---
title: 为什么会有vite？
icon: vite
---

相信每个前端开发，都经历过webpack时期（我现在还有webpack的项目），超级慢的热更新，超级慢的开发时编译速度，没区别地折磨过每一个前端人。  
先来分析一下为什么webpack很慢，简单回顾总结一下，毕竟已经是过去式了。  

<!-- more -->

## webpack非常慢的原理
在开发环境下，webpack总是执行一个： `分析依赖-构建依赖图-使用loader转化所有文件为产出-打包为bundle-启动dev server` 这样一个流程。导致在大项目下，webpack会越来越慢,因为每次
文件改变，都会执行一遍全量的分析和打包。

## 为什么说vite比webpack快
根本原因是vite并不像webpack一样每次HMR都要触发全量的编译，反而是利用现代浏览器天然支持ES Module特性，将`构建`这个动作，在开发环境取消掉，因为给浏览器的就是ES模块，所以即便不构建
也能正确使用。

那就有一种场景，我们直接导入某个包的时候，使用的是形如： 
```typeScript
import {ref} from 'vue'
```
这样直接送给浏览器，它咋知道`vue`这个玩意是从哪里来的呢，它只知道文件路径对吧，比如/src /xxx ../ 等等，所以对于每个文件请求，经过vite服务器时，会先处理一遍，把裸模块重写，比如：
```typeScript
import {ref} from 'vue'

import {ref} from '/node_modules/.vite/deps/vue.js'
```
诶，是不是很奇怪，为什么是`/.vite/deps/`，这就要引出我们的下一个问题了。

虽然解决了模块路径的问题，但是又遇到另一个问题了：总所周知，有些库的模块相当之多，比如vueUse，lodash-es这种方法库，动辄几百上千个模块，如果每个模块都搞成一个文件给浏览器，那光是网络请求都要卡
半天，这咋办呢。  

诶，聪明的你肯定想到了，那我把这种一个包下面的模块都像webpack一样打包到一个文件不就行了吗？是的，事实上vite就是这么做的，在vite当中，有一个叫做per-bunding的动作，在第一次启动项目时，
vite会做以下几件事：
1. 扫描代码，获取哪些位置import了外部模块
2. 使用esbuild打包这些模块
3. 将打包后的结果放到/node_modules/.vite/deps/
4. 之后浏览器请求时，因为文件是被拦截过的，路径会直接指向打包后的文件

这样就能够解决引用外部模块的问题啦。至于为什么要用esbuild而不是其它，因为快，无它。  

## 怎么处理源代码
那么众所周知，浏览器的原生es能力，只知道JavaScript，不认识你的什么vue，less，ts，jsx这些鬼玩意儿，咋办捏，那就翻译一下呗。  

vite基于koa/connect实现了一个开发服务器，这个服务器会拦截所有浏览器往工程目录的请求，进行如下的一个处理流程：  
1. 浏览器请求 比如 /src/App.vue
2. Vite服务器拦截这个请求
3. 读取App.vue文件
4. 使用@vitejs/plugin-vue进行transform转换成浏览器认识的js代码
5. 返回给浏览器

这一整个过程，都是按需发生的，浏览器发起对哪个文件的请求，才会进行处理。  

:::info vue文件怎么处理？
这里插个题外话：vue文件会被怎么处理？  

都知道，vue文件是分为三部分的，template，script，style。当vite需要读取一个vue文件时，会将它拆成多个虚拟模块：
1. App.vue
2. App.vue?vue&type=script 也就是编译后的script
3. App.vue?vue&type=template 编译后的 render 函数（vue的render，这块建议看看vue的源码）
4. App.vue?vue&type=style&index=0 编译后的css

所以一个vue文件，会形成多个虚拟模块，这就是为什么我们有时候会看到非常多的请求的原因。而且上述这些，都是js模块，那都说到这里了，再说一点，为什么css也是js模块呢？  

上面说过了，浏览器总是只认识js，import只能使用js作为目标，那么为了实现vite的这个按需编译，就要把css变成可以import的js模块，一个vue模板内的css，最终会被编译为：
```javaScript
import { updateStyle } from "/@vite/client"

updateStyle("hash", "body { color: red }")

export default "hash"
```
在vite的runtime中，拿到这段代码会执行创建style标签的逻辑，将样式注入，这就达到了css->js->css的转换。

emmm，这块本来应该是vue的内容，这里就不再展开了。
:::

