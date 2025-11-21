---
title: 一个自动网页截图工具
icon: edit
isOriginal: true
category: 技术杂谈
tag:
- node
- 小玩意
---

最近隔壁项目组有一个需求，要将某个页面定时截图发送到飞书，由于这不是一个正常意义上的前端问题，所以他们前端可能一下子没想到方案。  
其实这种需求是比较常见的，企业对前端做快照，自动化测试截图等大部分都需要。这里使用node+express做一个简单的截图服务（定时任务就不写了，自己的服务器经不起造）

<!-- more -->

## 思路
从前端的角度来说，要想实现截图必然是需要先将页面渲染出来，我这里采用了[Playwright](https://github.com/microsoft/playwright)的方案
