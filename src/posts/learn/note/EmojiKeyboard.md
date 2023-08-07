---
title: 手把手搓一个vue3emoji键盘插件
date: 2023-7-19
icon: html
isOriginal: true
category: VUE插件
tag:
- html5
- javaScript
---

近期的一个项目中有一个emoji的设计，找了很久，网上的插件都不太适合在h5上面使用，那我们就自己写一个吧

<!-- more -->

- 使用Unicode编码的emoji
- 使用vue3+ts开发插件
- 使用vite打包为lib
- 发布到npm
- 只适配移动端

# 新建项目
老生常谈了
```shell
npm create vite@latest my-app -- --template vue-ts
```
我添加了eslint的相关能力和包，自己按需添加吧

# 表情获取
我是从[https://www.emojiall.com/](https://www.emojiall.com/)这个网站获取的表情，提供了Unicode的编码，或者直接复制该表情也可以，我这里选择了直接复制，按照你的项目需求去做。

![emoji样例](/learn/emoji_demo.png)
