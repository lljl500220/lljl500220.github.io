---
icon: code
date: 2023-4-13 
title: electron开发日志
article: true
isOriginal: true
sidebar: false
category: 技术杂谈
tag:
- vue3
- electron
---

我接手的项目中有一个叫做 [全省成品油一体化监管服务平台](http://117.175.182.152:40004/)。是以前一个前端写的，后来我接手后，一度觉得是依托答辩，
但是苦于一直没有时间重构，一直搁置到3月底。趁着最近没需求，正好把一直想学的electron学一下。

<!-- more -->

## 先来看一下效果图吧！
![demo](/carefree/demo.png)

[项目地址github](https://github.com/lljl500220/electron) 请前往此处预览和下载项目文件

## 初始化、新建项目
本处只考虑windows系统，为什么捏，因为本大人没有mac！

首先在你的文件夹中选择一个地方，新建文件electron-app，当然也可不不新建，因为等下我们将使用[electron-vite](https://cn-evite.netlify.app/guide/)命令新建这个工程。  
确保你有如下环境：
1. node14+
2. npx && yarn

在控制台中执行以下语句：
```shell
npm create @quick-start/electron
```
然后按部就班的根据提示，创建一个新项目。  

![新建项目](/carefree/create.png)

使用编辑器打开该项目，我习惯使用webstorm，你也可以使用vscode或者其它你喜欢的工具, 执行install.
```shell
npm install
//执行完毕之后
npm run dev
```
node.js将为你打开这样一个预览程序：

![初始界面](/carefree/electron1.png)

当你看到上图这样界面的时候，恭喜你，已经完成了最重要的一步啦!:tada::tada::tada:。我们现在已经拥有了一个electron程序的雏形，接下来就是要将其完善，
工作内容就和使用vue3开发一个web应用没有太大的区别了。如果你拥有一定的vue3开发经验，那只需要阅读[进程通信](#进程通信)、[主进程](#主进程)、[预加载脚本](#预加载脚本)、
[渲染进程](#渲染进程)等章节即可。
## 进程通信
### 主进程
electron程序使用chromium和node.js作为运行环境，将二者作为二进制打包进入exe文件中，使得静态的html页面能够模拟桌面应用的样子运行。  

上面也提到了，electron有主进程和渲染进程的区别，此概念来自于[流程模型](https://www.electronjs.org/zh/docs/latest/tutorial/process-model),
是一个模拟了现代浏览器结构的模型，解决了一些安全问题，此处不细说，上面链接进去可以自行了解。  

electron拥有一个主进程+n个渲染进程，主进程运行在node.js中，拥有node api。渲染进程运行在chromium，拥有浏览器api，两者之间不可以直接进行通信(为了安全考虑)  

主进程一般用于管理窗口，以及其它的有关node、系统的事件。

### 渲染进程
可以理解为浏览器打开的一个个tab一样，google浏览器的多进程模式也是基于这样的设计完成的。刚刚我们打开的那个页面，嵌入的index.html就是一个渲染进程，而打开这个窗口的能力就是来自主进程。

### 预加载脚本
上文说到，主进程和渲染进程之间无法进行直接通信，那有些内容又确实需要进行通信该咋办咧？搭个桥嘛，所以预加载脚本就应运而生，它作为一个中间件提供了主进程往渲染进程传递内容或者
渲染进程往主进程请求内容的能力。

### 主进程实例
打开新建好的工程，其结构应该长这样：

![目录结构](/carefree/files.png)

主进程应该被写在/src/main/index.ts文件中，一起来看下这个文件：

```typescript
//index.ts
import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
    // 新建窗口
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    // 如果是在开发模式下，loadURL方法会加载vite服务的地址，比如http://localhost:8080
    // 如果是打包之后，loadFile方法会加载一个基于当前文件夹地址加上renderer/index.html的文件
    // 其实就是我们vue程序的那个index.html
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
}


// whenReady方法会告诉你electron已经准备好了，可以加载了
// 此外，有很多的方法和api只能在whenReady之后使用，比如icp模块
app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

```

首先跃入眼帘的是createWindow方法，方法中创建了一个BrowserWindow实例名为mainWindow，mainWindow几个参数
```typescript
  const mainWindow = new BrowserWindow({
    width: 900, //宽度
    height: 670, //高度
    show: false, //是否一开始就显示
    autoHideMenuBar: true, //自动隐藏左上方的工具栏
    ...(process.platform === 'linux' ? { icon } : {}), //设置程序icon
    webPreferences: {
        preload: join(__dirname, '../preload/index.js'), //预加载脚本地址
        sandbox: false //不是很懂这个sandbox，实际上开启之后也不会对程序有直观影响
    }
})
```
由于我们将show属性设置为了false，所以只执行createWindow将无法打开窗口。继续向下看：
```typescript
// ready-to-show事件定义了一个监听，当index.html已经加载完毕后就会触发。
mainWindow.on('ready-to-show', () => {
    // BrowserWindow.show方法打开当前实例窗口
    // 从这个位置之后就能看到窗口弹出了
    mainWindow.show()
})
    
// 用于替换window.open方法，这里反悔了deny，则永远不会打开新窗口，需要打开新窗口则需要需要新建一个BrowserWindow实例打开
mainWindow.webContents.setWindowOpenHandler((details) => {
    //以桌面的默认方式打开url，有可能是一个文件。
    shell.openExternal(details.url)
    return { action: 'deny' }
})

// 如果是在开发模式下，loadURL方法会加载vite服务的地址，比如http://localhost:8080
// 如果是打包之后，loadFile方法会加载一个基于当前文件夹地址加上renderer/index.html的文件
// 其实就是我们vue程序的那个index.html
if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
} else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
}
```

到这里为止呢，主进程的大部分代码就已经结束了，接下来就是在app.whenReady事件中执行creatWindow方法创建实例就可以啦。

### 预加载脚本
 上文说到，预加载脚本用来解决主进程和渲染进程通信的问题。预加载脚本在preload文件夹中，首先来看一段预加载脚本的代码：
```typescript
import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// process.contextIsolated 上下文隔离，这个值要在主进程的webPreferences中定义，一般都是为true的。
// 如果将这个值定义为false，则在渲染进程中可以直接访问node的api而不需要预加载脚本。
if (process.contextIsolated) {
    try {
        // 通过上下文桥将electronAPI暴露到渲染进程中。
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)
    } catch (error) {
        console.error(error)
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI
    // @ts-ignore (define in dts)
    window.api = api
}
```
通过上面的预加载脚本，我们就可以在vue代码中访问electronAPI了
```vue
<script setup lang="ts">
import { reactive } from 'vue'
const versions = reactive({ ...window.electron.process.versions })
</script>

<template>
  <ul class="versions">
    <li class="electron-version">Electron v{{ versions.electron }}</li>
    <li class="chrome-version">Chromium v{{ versions.chrome }}</li>
    <li class="node-version">Node v{{ versions.node }}</li>
    <li class="v8-version">V8 v{{ versions.v8 }}</li>
  </ul>
</template>

```

## 渲染进程主动请求主进程信息

### 启动动画实例
上面说了进程间的通信以及创建一个初始的window，接下来我们实现一个app常见的启动动画：

![启动动画](/carefree/动画.gif)

上面这个动画的文件可以在[项目地址github](https://github.com/lljl500220/electron)这里找到。

接下来我们要实现：
1. 在主界面打开之前，先打开这个页面
2. 模拟主界面加载，比如接口请求完毕，文件请求完毕等，异步关闭该界面，打开主界面

首先实现第一步： 想要打开一个窗口，就需要用到我们上面提到的BrowserWindow类，那么就存在了两个BrowserWindow实例，现在需要将这两个实例异步加载。

首先在resources文件夹中写入上面的loading.html，如下：

![loading.html](/carefree/index-html.jpg)

然后在main/index.ts文件中新加如下代码：
```typescript
// main/index.ts
const showLoading = (): void => {
    load = new BrowserWindow({
        width: 960,
        height: 670,
        frame: false,
        backgroundColor: '#2376b7',
        webPreferences: {
            contextIsolation: true,
            // preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    })
    // load.webContents.openDevTools()
    load.loadFile(join(__dirname, '../../resources/loading.html'))

    load.on('show', createWindow)
    load.show()
}
```

其中，load变量需要定义为全局变量，因为我们等下要在主窗口中将其关闭。

原来whenReady事件中，调用了createWindow()方法唤起主界面，现在我们需要修改为showLoading()方法，先行唤起我们的启动页。
```typescript
-- createWindow()
++ showLoading()
```

唤醒启动页之后，需要模拟一个等待的过程，比如网络请求啊，本地文件读取啊之类的事件。这里我们模拟一下在渲染进程，也就是我们的app
中发起网络请求，等待其返回之后关闭启动页，打开主页面的过程。

要实现上面这个效果，就需要在渲染进程和主进程之间进行通信，我们现在预加载脚本中添加一个函数：

```typescript
 contextBridge.exposeInMainWorld('api', {
    ping: () => ipcRenderer.invoke('ping')
})
```

然后在主进程中监听ipcMain：

```typescript
  ipcMain.handle('ping', () => {
    if (load) {
        //启动页隐藏、关闭
        load.hide()
        load.close()
    }
    //主页面去除menu
    Menu.setApplicationMenu(null)
    //主页面最大化
    mainWindow.maximize()
    //主页面显示
    mainWindow.show()
    //返回了屏幕尺寸
    return mainWindow.getContentSize()
})
```

然后在我们的渲染进程触发window.ping方法就好啦：

```typescript
//index.vue

const ping = async () => {
    //@ts-ignore
    let a: number[] = await window.api.ping()
    rem.value = a[0] / 100 + 'px'
    localStorage.setItem('rem', (a[0] / 100).toString())
    document.getElementsByTagName('html')[0].style['font-size'] = rem.value
    document.getElementsByTagName('html')[0].style['height'] = a[1] + 'px'
    document.getElementsByTagName('html')[0].style['width'] = a[0] + 'px'
    document.getElementsByTagName('body')[0].style['height'] = a[1] + 'px'
    document.getElementsByTagName('body')[0].style['width'] = a[0] + 'px'
    resetChart('贵州', 0)
}

setTimeout(() => {
    ping()
}, 500)
```

到这里呢，electron基本的使用已经就完成啦，它仍然有非常多的api需要自己去学习，我只是记录自己学习的过程，更多的内容请前往[electron](https://www.electronjs.org/zh/docs/latest/)自主学习吧！
