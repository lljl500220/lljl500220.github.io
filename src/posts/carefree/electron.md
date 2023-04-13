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

