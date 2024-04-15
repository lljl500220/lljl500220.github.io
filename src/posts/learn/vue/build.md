---
title: 编写构建脚本
icon: edit
---

## build.js
在packages文件夹同级新建一个scripts文件夹，添加一个build.js文件。我们将通过这个文件来读取模块文件，并构建输出。

### 文件读取
由于vue3的核心代码使用分包的形式，分别写在packages/reactivity、packages/runtime-core、packages/shared等文件夹下，我们需要将这些文件读取出来，然后合并到一个文件中。

```javascript
import fs from 'node:fs/promises'; //fs模块用于操作文件
import {existsSync,readfileSync} from 'node:fs'; //判断文件是否存在，读取文件
import path from 'node:path'; //path模块用于操作文件路径
import {cpus} from 'node:os'; //获取cpu核心数

//1. 读取文件夹
const dirs = readdirSync('../packages') //['reactivity','runtime-core','shared'...]

//判断读取到的内容是否是packages下的文件夹
const dirs = readdirSync('../packages').filter(target => {
    return statSync(`../packages/${target}`).isDirectory()
})

//2. 并行打包
async function buildAll() {
    await runParallel(cpus().length, targets, build)
}

```

:::info node小知识
这里使用了statSync方法来判断是否是文件夹，使用readdirSync方法来读取文件夹下的文件。都是常用的node.js文件操作方法，如果不熟悉可以查看[node.js文档](https://nodejs.org/dist/latest-v16.x/docs/api/fs.html)。
:::

上方的代码，处理了文件读取和并行打包的逻辑，接下来我们来实现runParallel函数。

```javascript
/**
 * 并行打包
 * @param {Array<string>} targets - 需要打包的一个数组
 * @returns {Promise<void>} - 一个promise对象 代表打包过程
 */
async function runParallel(maxConcurrency, source, iteratorFn) {
    /**@type {Promise<void>[]} */
    const ret = [] // 返回的promise数组 是用来描述所有任务的
    /**@type {Promise<void>[]} */
    const executing = [] // 正在执行的任务
    for (const item of source) {
        const p = Promise.resolve().then(() => iteratorFn(item)) // 调用iteratorFn函数 为什么要用Promise.resolve().then()包裹一层？ 因为iteratorFn函数可能是异步的，这样可以保证每个任务都是异步的
        ret.push(p)

        if (maxConcurrency <= source.length) { // 如果并发数小于任务数 则需要控制并发数
            const e = p.then(() => {
                executing.splice(executing.indexOf(e), 1) // 任务完成后，从执行列表中移除
            })
            executing.push(e) // 保存当前任务
            if (executing.length >= maxConcurrency) { // 如果当前执行的任务数大于等于最大并发数，则等待最快的任务完成
                await Promise.race(executing) // 等待最快的任务完成，然后继续执行
            }
        }
    }
    return Promise.all(ret) // 返回所有任务的promise数组
}
```
这个方法主要是为了控制并发数与cpu核心数的关系，如果并发数大于cpu核心数，那么就需要控制并发数，这样可以避免cpu过载。  
:::info node小知识
这里使用了Promise.race方法，此方法返回一个 Promise，一旦迭代器中的某个 promise 解决或拒绝，
返回的 promise 就会解决或拒绝。以下我给出几个例子
```javascript
const promise1 = new Promise((resolve, reject) => {
    setTimeout(resolve, 500, 'one');
});

const promise2 = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, 'two');
});

Promise.race([promise1, promise2]).then((value) => {
    console.log(value); // "two"
    // 都会完成，但是promise2会先完成 同理的 reject也是一样，会先出发catch或者error
});
```
:::

接下来实现build函数。
```javascript
/**
 * 打包
 * @param {string} target - 需要打包的文件夹
 * @returns {Promise<void>} - 一个promise对象 代表打包过程
 */
async function build(target) {
    //获取到目标的绝对路径
    const pkgDir = path.resolve(`../packages/${target}`)
    //获取到目标的package.json
    const pkg = require(`${pkgDir}/package.json`)

    //按照官方的逻辑，如果是发布版本或者没有指定目标，则忽略私有包 此处我们不再关心这个问题
    // if ((isRelease || !targets.length) && pkg.private) {
    //      return
    // }

    //删除dist目录
    await fs.rm(`${pkgDir}/dist`, { recursive: true })

    //按照官方的逻辑，如果是特定格式的构建，则不要删除dist 此处我们不再关心这个问题
    // if (!formats && existsSync(`${pkgDir}/dist`)) {
    //     await fs.rm(`${pkgDir}/dist`, { recursive: true })
    // }

    //执行打包

    //获取环境变量 由于我们是学习目的，此处也不再考虑环境变量的问题，全部构建为生产环境
    // const env = (pkg.buildOptions && pkg.buildOptions.env) || (devOnly ? 'development' : 'production')

    const env = 'production'
    
    await execa(
        'rollup',
        [
            '-c',
            '--environment',
            [
                `NODE_ENV:${env}`,
                `TARGET:${target}`
            ]
                .filter(Boolean)
                .join(','),
        ],
        { stdio: 'inherit' }, // 将子进程的输出打印到父进程
    )
}
```

:::info node小知识
Execa 是一个 Node.js 库，可以替代 Node.js 的原生 child_process 模块，
用于执行外部命令。Execa拥有更好的性能、可靠性和易用性，支持流式传输、输出控制、交互式 shell 等功能，
并跨平台兼容 Windows、macOS 和 Linux 等操作系统。同时，Execa 还支持 Promise API，提供更好的异步控制和异常处理机制。
使用 Execa 可以简化发现和解决常见的子进程处理问题，是 Node.js 开发中非常有用的工具之一。
:::

## rollup.config.js
在根目录下新建一个rollup.config.js文件，用于配置rollup的打包规则。

### 依赖
首先还是导入rollup需要的一些依赖
```javascript
import {fileURLToPath} from 'node:url' //用于处理文件路径
import {createRequire} from 'node:module' //用于创建require函数
import path from "node:path";
import json from "@rollup/plugin-json"; //用于处理文件路径
import esbuild from 'rollup-plugin-esbuild' //用于处理文件路径

```
导入上诉后的内容后，开始编写内容
### 处理常量
```javascript
// 如果命令行参数中没有指定目标，则抛出错误
if (!process.env.TARGET) {
    throw new Error('必须选择一个目标')
}

const require = createRequire(import.meta.url) //创建require函数
const __dirname = fileURLToPath(new URL('.', import.meta.url)) //获取当前文件所在目录的绝对路径

const masterVersion = require('./package.json').version //获取主版本号

const packagesDir = path.resolve(__dirname, 'packages') //获取packages目录的绝对路径
const packageDir = path.resolve(packagesDir, process.env.TARGET) //获取目标包的绝对路径

const resolve = (/** @type {string} */ p) => path.resolve(packageDir, p) //获取目标包内的文件的绝对路径
const pkg = require(`${packageDir}/package.json`) //获取目标包的package.json
const packageOptions = pkg.buildOptions || {} //获取目标包的构建选项
const name = packageOptions.filename || path.basename(packageDir) //获取目标包的名称

/** @type {Record<PackageFormat, OutputOptions>} */
const outputConfigs = {
    'esm-bundler': {
        file: resolve(`dist/${name}.esm-bundler.js`),  //esm-bundler适用于 bundlers（例如 webpack、Rollup）的 ES module 包
        format: 'es',
    },
    'cjs': {
        file: resolve(`dist/${name}.cjs.js`), // commonjs格式
        format: 'cjs',
    },
}
```
将上面的这些内容都指定后，就可以着手编写rollup的配置了。
```javascript
/** @type {ReadonlyArray<PackageFormat>} */
const defaultFormats = ['esm-bundler', 'cjs'] //默认的打包格式，包含commonjs以及esm

//此处按照最新的vue打包配置来看，理应先判断是否有inlineFormats，如果有则使用inlineFormats，否则使用defaultFormats
//打包格式
//我们只关注生产模式，相当于只打生产包
const packageConfigs = defaultFormats.map(format => createConfig(format, outputConfigs[format]))


export default packageConfigs
```
由于rollup一般是导出一个配置出去，所以上面的createConfig方法就是用来创建这个文件的。
```javascript
function createConfig(format, output, plugins = []) {
    //返回一个rollup配置对象
    return {
        input: resolve('src/index.ts'), //入口文件 我们简易实现，仅保留'src/index.ts'这种情况，事实上还有运行时等其他情况
        output: output, //输出配置 其实就是outputConfigs[format] vue本身实现了相当多中格式输出，但是我们只保留了两种
        plugins: [
            json({
                namedExports: false
            }),
            esbuild({ //处理ts文件
                tsconfig: path.resolve(__dirname, 'tsconfig.json'),
                sourceMap: output.sourcemap,
                minify: false,
                target: 'es2015',
                define:{
                    version: `"${masterVersion}"`
                }
            }),
            ...plugins //其它有可能存在的插件
        ]
    }
}
```

这样一个简易的rollup配置文件就完成了，接下来我们就可以通过node执行build.js文件，来进行打包了。其实原代码也没有特别复杂，只是在基础打包上面区分了各种环境，处理了一些特殊的情况，这样就可以更好的适应vue3的打包需求了。

## 执行打包
在package.json中添加一个脚本
```json
"scripts": {
    "build": "node scripts/build.js"
}
```
然后执行
```shell
npm run build
```
就可以进行打包了。现在将会在每个模块的dist文件夹下生成对应的打包文件。比如shared模块下的dist文件夹下就会生成shared.esm-bundler.js和shared.cjs.js两个文件。

如果需要将各种模块都集合为一个vue模块，则需要额外实现一个以vue为入口的打包文件，这个文件会引入各个模块，然后再进行打包。这个文件的实现和上面的文件类似，只是需要引入各个模块，然后再进行打包。