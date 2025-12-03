---
title: 一个自动网页截图工具
icon: edit
isOriginal: true
category: 技术杂谈
tag:
- node
- 小玩意
---

最近隔壁项目组有一个需求，要将某个页面定时截图发送到飞书，由于这不是一个正常意义上的前端问题，所以他们前端可能一下子没想到方案，所以产品经理来找我问了问。  
其实这种需求是比较常见的，企业对前端做快照，自动化测试截图等大部分都需要。这里使用node+express做一个简单的截图服务（定时任务就不写了，自己的服务器经不起造）

<!-- more -->

## 思路
从前端的角度来说，要想实现截图必然是需要先将页面渲染出来，我这里采用了[Playwright](https://github.com/microsoft/playwright)的方案，这是微软一个用于端到端测试的工具，用于模拟真实的浏览器环境，用户操作等，具备录制，调试等功能，这里不再展开。 
这里就肯定下来是一个后端的活了，我用node和python比较多，这里用node实现一下。
## 编码

### 核心的截图方法
```javascript
// 从playwright获取浏览器内核
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * 滚动页面以触发懒加载内容
 * @param {Page} page - Playwright页面对象
 * @param {number} scrollDelay - 滚动间隔时间（毫秒）
 */
async function scrollAndLoadContent(page, scrollDelay = 1000) {
    try {
        // 获取页面的初始高度
        let previousHeight = await page.evaluate('document.body.scrollHeight');
        let currentHeight = 0;
        let maxScrollAttempts = 10; // 最大滚动尝试次数，防止无限滚动
        let scrollAttempts = 0;

        console.log(`页面初始高度: ${previousHeight}px`);

        while (scrollAttempts < maxScrollAttempts) {
            // 滚动到页面底部
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');

            // 等待一段时间让内容加载
            await page.waitForTimeout(scrollDelay);

            // 等待网络空闲，确保异步内容加载完成
            try {
                await page.waitForLoadState('networkidle', { timeout: 5000 });
            } catch (e) {
                // 如果网络不空闲，继续执行
                console.log('网络未空闲，继续滚动...');
            }

            // 获取新的页面高度
            currentHeight = await page.evaluate('document.body.scrollHeight');

            console.log(`滚动第 ${scrollAttempts + 1} 次，当前高度: ${currentHeight}px`);

            // 如果高度没有变化，说明没有更多内容加载，退出循环
            if (currentHeight === previousHeight) {
                console.log('页面高度不再增加，滚动加载完成');
                break;
            }

            previousHeight = currentHeight;
            scrollAttempts++;
        }

        // 滚动回顶部，准备截图
        await page.evaluate('window.scrollTo(0, 0)');
        await page.waitForTimeout(1000); // 等待页面稳定

        console.log(`滚动加载完成，最终页面高度: ${currentHeight}px`);

    } catch (error) {
        console.warn('滚动加载过程中出现警告:', error.message);
        // 即使滚动失败，也继续截图
    }
}

/**
 * 使用 Playwright 将网址导出成图像
 * @param {string} url - 要截图的网址
 * @param {object} options - 截图选项
 * @param {string} options.outputPath - 输出文件路径，默认为 'screenshot.png'
 * @param {object} options.viewport - 视口大小，默认为 { width: 1920, height: 1080 }
 * @param {boolean} options.fullPage - 是否截取全页面，默认为 true
 * @param {string} options.format - 图片格式，'png' 或 'jpeg'，默认为 'png'
 * @param {number} options.quality - JPEG 质量（1-100），仅在 format 为 'jpeg' 时有效
 * @param {number} options.timeout - 页面加载超时时间（毫秒），默认为 30000
 * @param {boolean} options.enableScrollLoading - 是否启用滚动加载（处理懒加载内容），默认为 false
 * @param {number} options.scrollDelay - 滚动间隔时间（毫秒），默认为 1000
 * @returns {Promise<string>} 返回截图文件的路径
 */
async function captureWebsiteScreenshot(url, options = {}) {
    const {
        outputPath = 'screenshot.png',
        viewport = { width: 1920, height: 1080 },
        fullPage = true,
        format = 'png',
        quality = 90,
        timeout = 30000,
        enableScrollLoading = false,
        scrollDelay = 1000
    } = options;

    let browser;

    try {
        // 启动浏览器
        console.log('正在启动浏览器...');
        browser = await chromium.launch({
            headless: true // 无头模式
        });

        // 创建新页面
        const page = await browser.newPage();

        // 设置视口大小
        await page.setViewportSize(viewport);

        // 设置超时时间
        page.setDefaultTimeout(timeout);

        console.log(`正在访问网址: ${url}`);

        // 访问网页
        await page.goto(url, {
            waitUntil: 'networkidle', // 等待网络空闲
            timeout: timeout
        });

        // 等待页面完全加载
        await page.waitForLoadState('domcontentloaded');

        // 如果启用滚动加载，执行滚动操作以触发懒加载内容
        if (enableScrollLoading && fullPage) {
            console.log('正在执行滚动加载以触发懒加载内容...');
            await scrollAndLoadContent(page, scrollDelay);
        }

        console.log('正在截取屏幕截图...');

        // 确保输出目录存在
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // 配置截图选项
        const screenshotOptions = {
            path: outputPath,
            fullPage: fullPage,
            type: format
        };

        // 如果是 JPEG 格式，添加质量参数
        if (format === 'jpeg') {
            screenshotOptions.quality = quality;
        }

        // 截图
        await page.screenshot(screenshotOptions);

        console.log(`截图已保存到: ${path.resolve(outputPath)}`);

        return path.resolve(outputPath);

    } catch (error) {
        console.error('截图过程中发生错误:', error.message);
        throw error;
    } finally {
        // 关闭浏览器
        if (browser) {
            await browser.close();
            console.log('浏览器已关闭');
        }
    }
}

/**
 * 批量截图功能
 * @param {Array<Object>} urls - 网址配置数组
 * @param {string} urls[].url - 网址
 * @param {string} urls[].name - 文件名（可选）
 * @param {Object} globalOptions - 全局选项
 * @returns {Promise<Array<string>>} 返回所有截图文件路径
 */
async function batchCaptureScreenshots(urls, globalOptions = {}) {
    const results = [];

    for (let i = 0; i < urls.length; i++) {
        const urlConfig = urls[i];
        const url = typeof urlConfig === 'string' ? urlConfig : urlConfig.url;
        const name = urlConfig.name || `screenshot_${i + 1}.png`;

        try {
            console.log(`\n=== 正在处理第 ${i + 1}/${urls.length} 个网址 ===`);

            const outputPath = path.join(globalOptions.outputDir || 'screenshots', name);
            const result = await captureWebsiteScreenshot(url, {
                ...globalOptions,
                outputPath
            });

            results.push(result);

        } catch (error) {
            console.error(`处理 ${url} 时出错:`, error.message);
            results.push(null);
        }
    }

    return results;
}

/**
 * 专门用于截取长页面的函数（自动启用滚动加载）
 * @param {string} url - 要截图的网址
 * @param {object} options - 截图选项（与captureWebsiteScreenshot相同，但默认启用滚动加载）
 * @returns {Promise<string>} 返回截图文件的路径
 */
async function captureLongPageScreenshot(url, options = {}) {
    // 为长页面截图设置默认选项
    const longPageOptions = {
        fullPage: true,
        enableScrollLoading: true,
        scrollDelay: 1000,
        timeout: 60000, // 长页面需要更长的超时时间
        ...options
    };

    console.log('=== 长页面截图模式 ===');
    console.log('已自动启用滚动加载和全页面截图');

    return await captureWebsiteScreenshot(url, longPageOptions);
}

// 导出函数供其他模块使用
module.exports = {
    captureWebsiteScreenshot,
    batchCaptureScreenshots,
    captureLongPageScreenshot
};

```

## 接口
核心截图方法已经有了，接下来就是搞个接口，当然，甚至不需要接口，如果是服务器自己跑一个定时任务的话，直接使用就可以了。我这里要给后端伙伴和产品看一下效果，所以搞一个简易接口。
node搞这个么显然就是express简单了。给个简单的截图接口示例
```javascript
app.post('/api/screenshot/long', async (req, res) => {
    try {
        const {
            url,
            filename,
            viewport = { width: 1920, height: 1080 },
            format = 'png',
            quality = 90,
            scrollDelay = 1000,
            timeout = 60000 // 长页面需要更长的超时时间
        } = req.body;

        // 验证必需参数
        if (!url) {
            return res.status(400).json({
                success: false,
                error: '缺少必需参数: url'
            });
        }

        // 验证 URL 格式
        try {
            new URL(url);
        } catch {
            return res.status(400).json({
                success: false,
                error: '无效的 URL 格式'
            });
        }

        // 生成文件名
        const timestamp = Date.now();
        const extension = format === 'jpeg' ? 'jpg' : format;
        const outputFilename = filename || `long_screenshot_${timestamp}.${extension}`;
        const outputPath = path.join(screenshotsDir, outputFilename);

        console.log(`收到长页面截图请求: ${url}`);

        // 执行长页面截图
        const imagePath = await captureLongPageScreenshot(url, {
            outputPath,
            viewport,
            format,
            quality,
            scrollDelay,
            timeout
        });

        const stats = fs.statSync(imagePath);

        res.json({
            success: true,
            message: '长页面截图成功',
            data: {
                filename: outputFilename,
                url: `/screenshots/${outputFilename}`,
                fullUrl: `${req.protocol}://${req.get('host')}/screenshots/${outputFilename}`,
                size: stats.size,
                format: format,
                dimensions: viewport,
                created: new Date().toISOString(),
                type: 'long_page'
            }
        });

    } catch (error) {
        console.error('长页面截图失败:', error);
        res.status(500).json({
            success: false,
            error: '长页面截图失败',
            details: error.message
        });
    }
});

```

其他的接口可以去到github仓库中找到，也可以使用[https://www.qinzhuan-dev.top/index.html](网页demo)预览功能