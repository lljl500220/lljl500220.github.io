---
title: diff算法和ast
icon: vue
isOriginal: true
category:
- 技术杂谈
tag:
- vue3
---
vue3diff算法学习
<!-- more -->
## ast是什么
ast是抽象语法树的简写（abstract syntax code），vue操作dom的过程，就是将template转化为ast的过程，也就是虚拟dom。
## 为什么要用虚拟dom
一个dom的属性是非常多的，去操作dom比较的复杂，而且操作dom比较浪费性能和时间，但是js不一样。操作js非常快捷，并且性能很高，所以将dom转化为虚拟dom后，
通过js的方式，改变部分节点内容，要远比直接操作dom来得更加的快。
## vue3diff
一图表示，此图来源于京东小满zs
![diff算法](/carefree/diff.png)