---
title: vite插件，热更新
icon: vite
---

书接上回，上回我们讲到-赛博坦上起狼烟，黛玉七擒威震天！  

话说这赛博坦世界，本非金雕玉砌只邦，原是铁骨钢胎所在。那乾坤之间，不见日月轮转，唯有能量潮汐起落，紫霞青焰交织成昼夜....

偏题了不好意思，脱口相声下次再说，下面我们一起来看看vite的热更新，插件的内容

<!-- more -->

## HMR
曾经我面试过一个候选人，我问HMR是什么，他说不知道。我又问热更新是什么，他说是热更新...  

emmm，以上为真实场景，没有半点虚构，HMR，全名叫做Hot Module Replacement，顾名思义，热模块替换，也叫做热更新。

它有什么作用呢？ 写了代码，按下保存按键之后，不需要刷新页面就能看到改变，乃至于滚动条，表单状态都不会改变和丢失，现代前端框架几乎都已经实现了hmr的开发阶段功能。

### 核心原理

#### Websocket链接
众所周知，启动vite时，会启动一个服务器，浏览器上预览我们的页面时，实际上是请求了这个服务，他们之间会建立一个长链接的关系。vite监听到文件的变化后，会推送一个消息给
浏览器，浏览器就知道这个位置改变了，重新渲染一下。

#### 模块依赖图
上文说过，vite会维护一张模块之间的依赖图谱(Module Graph)，用于记录模块之间的引用关系，当某个模块变化后，顺着依赖图一直找，找到所有受影响的部分，就能实现精准的定位。

::: important hmr怎么处理文件变化？
首先确定vite hmr查找文件的顺序：
入口文件 main.ts -> App.vue(会产生边界) -> Xxx.vue(边界) -> xxx.tx(没有边界)
ok，那边`边界`是什么？：
边界 就是 ‘声明了 import.meta.hot.accept()’的模块。
vue文件因为 @vitejs/plugin-vue 注入了accept代码
tsx/jsx文件 @vitejs/plugin-react 注入了accept代码 
普通ts文件，没有任何注入。
:::

当一处代码被改变时会发生什么呢？这里以vue为例，react其实也是同理：  
比如 detail.vue 改变了任何代码，vite就会从它开始向依赖图谱查找，发现它本身就是存在边界的(实现了hot.accept())的，那么查找到自己就结束了，
所以通知浏览器，更新detail.vue

如果是一个 ts文件，比如 date.ts里面的方法被修改了，vite检测到变化，首先也会向上找，对于每一个导入它的分支路径，都向上查找到存在边界或者直通入口的位置结束。

### 插件
vite的插件，其实就是一个对象，该对象暴露出了一个`name`属性和一些钩子函数，这些钩子函数会在构建的不同阶段被调用。  

一个简单的例子：
```typescript
// my-plugin.ts
export default function myPlugin() {
  return {
    name: 'my-plugin',
    transform(code, id) {
      if (id.endsWith('.vue')) {
        return code.replace('console.log', 'console.warn');
      }
    }
  };
}

// vite.config.ts
import { defineConfig } from 'vite'
import myPlugin from './my-plugin'

export default defineConfig({
  plugins: [myPlugin()]
})
```

是不是和我们常用的vue插件，react插件使用方式很相似？，

随后执行run或者build，就能在控制台看到啦。注意，run命令并不会直接触发构建，这个在我们上一章是说到的，因为vite是按需构建的，只有在浏览器请求某个文件时，才会构建它。build命令才会触发完整的构建。

### 带配置的插件

插件既然是方法，自然可以传入参数，所谓的配置，不过是实参而已。我们来把上面的插件做点简单的修改：

```typescript
import type { Plugin } from 'vite'

interface CountLinesPluginOptions {
    verbose?: boolean
    exclude?: string[]
    include?: string[]
}

let totalLines = 0

const defaultOptions: CountLinesPluginOptions = {
    verbose: true,
    exclude: ['node_modules','dist'],
    include: ['.ts', '.vue', '.js','.css']
}

export function countLinesPlugin(options: CountLinesPluginOptions = {}): Plugin {
    const config = { ...defaultOptions, ...options }
    return {
        name: 'count-lines-plugin',
        
        // 添加这个钩子来确认插件在工作
        buildStart() {
            console.log('🔍 代码行数统计插件开始工作！')
            totalLines = 0  // 重置计数器
        },
        
        buildEnd() {
            console.log(`📊 代码统计完成！总计: ${totalLines} 行`)
        },
        transform(code: string, id: string) {
            const fileExt = id.split('.').pop()
            const shouldInclude = config.include && config.include.some(ext => id.endsWith(ext))

            if(!shouldInclude){
                return null
            }
            
            // 只统计源代码文件，排除node_modules等
            if (id.includes('node_modules') || (config.exclude && config.exclude.some(ex => id.includes(ex))) || !shouldInclude) {
                return null
            }
            
            const lines = code.split('\n').length
            totalLines += lines
            if(config.verbose) {
                console.log(`📄 文件 ${id} 有 ${lines} 行，总计 ${totalLines} 行`)
            }
            return null
        }
    }
}
```

现在就会按照默认参数或者传入参数来统计代码行数了。

### 虚拟模块插件

虚拟模块是vite的一个特性，它允许我们在代码中导入一些并不存在于文件系统中的模块。这些模块是由插件动态生成的，可以在构建时被注入到代码中。

``` typescript
import type { Plugin } from 'vite'

export function buildInfoPlugin(): Plugin {
    let buildTime = new Date().toISOString()

    return {
        name: 'build-info-plugin',

        resolveId(id: string) {
            if (id === 'virtual:build-info') {
                return '\0' + id
            }
        },

        load(id: string) {
            if (id === '\0virtual:build-info') {
                // 这里就是虚拟模块的"内容"！
                return `
export const buildInfo = {
    buildTime: '${buildTime}',
    version: '1.0.0',
    author: '墨瑶',
    environment: '${process.env.NODE_ENV || 'development'}'
}

export function getBuildInfo() {
    return buildInfo
}

export default buildInfo
`
            }
        },

        buildStart() {
            console.log('🏗️ 构建信息插件开始工作！')
            buildTime = new Date().toISOString() // 更新构建时间
        },

        buildEnd() {
            console.log('✅ 构建完成！构建时间:', buildTime)
        }
    }
}
```

这样就可以在代码中导入虚拟模块了：
``` typescript
import { buildInfo } from 'virtual:build-info'

console.log('构建信息:', buildInfo)
```

这里面用到了`resolveId`和`load`两个钩子，`resolveId`用于解析虚拟模块的ID，`load`用于加载虚拟模块的内容。其中`resolveId`返回的ID需要加上`\0`前缀，这是vite的约定，表示这是一个虚拟模块。

来详细说一下`resolveId`，我们的代码会写`import { buildInfo } from 'virtual:build-info'`，在vite解析import的时候，会先调用`resolveId`钩子，知道这是一个虚拟模块，它就会问所有插件：你们谁能解决虚拟模块呀？随后一旦插件使用`resolveId`钩子并返回了虚拟模块的ID，vite就会调用`load`钩子来加载虚拟模块的内容。

::: tip 如果有多个插件都返回了虚拟模块id会发生什么？
如果多个插件都返回了虚拟模块id，vite会优先使用第一个未返回空的插件。
:::


### 代码转换

在vite中，代码转换是通过`transform`钩子来实现的。这个钩子允许我们在代码被发送到浏览器之前对其进行修改。

``` typescript
import type { Plugin } from 'vite'

export function removeLogPlugin(): Plugin {
    return {
        name: 'remove-log-plugin',
        transform(code: string, id: string) {
            if (id.includes('node_modules') || id.includes('\0')) {
                return null
            }

            // 移除所有 console.log
            code = code.replace(/console\.log\([^)]*\);?/g, '')

            return { code, map: null }
        }
    }
}
```

这个插件会移除所有代码中的`console.log`，`transform`钩子接收两个参数：`code`是源代码，`id`是文件路径。如果返回`null`，表示不转换此文件。如果返回对象，`code`是转换后的代码，`map`是源映射（可选）。

非常简单对不对，但是实际上，这里仅仅是了解，真正做插件开发的工程师，还需要考虑性能优化，错误处理等问题。


### 服务器插件

