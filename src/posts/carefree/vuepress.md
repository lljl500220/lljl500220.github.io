---
title: md中使用vue语法
icon: edit
---

开始使用vuepress的时候，学习到了在md文件中直接使用vue语法和语法糖的方法
起初是没什么太大的问题，直接使用即可。但是最近发现这种语法使用方式，会影响到
run build之后的命令执行，node进程不知被卡在了什么地方，无法继续，也不会退出终端。

<!-- more -->

![build之后不会结束终端任务](/carefree/vuepress_warn.png)

构建任务已经执行完毕，dist也能正确输出，如果是手动部署至github page的话，确实没什么
问题，但是如果使用的是github的action或者其它类似的ci，那么就会一直卡住在这里，无法
部署成功。

@[code{32-44} yaml](../../../.github/workflows/deploy-docs.yml)

思来想去也没个头绪，之前一直是没什么问题的，也能正确构建。后来想起，昨天为了尝试pnpm，执行了一次
install命令，主题的版本和 vuepress的版本被更新了。这次更新直接导致了我无法在md中使用vue代码，
如果是手动部署，那没什么问题。但是如果是通过action执行的话，在2.0.0-beta.171版本下，就不能在md
文件中使用vue代码