---
icon: person
sidebar: false
title: 自我介绍
date: 2022-07-10
timeline: true
article: false
footer: 看我浪迹多逍遥o(*≧▽≦)ツ┏━┓拍桌狂笑
category:
- 自我介绍
tag:
- About

---

很高心认识你，我是罗龙江，一个正在成长中的前端工程师！

<!-- more -->

本网站是我blog的vue版本，使用vuepress构建，原hexo的版本目前正在维护中

网站从2022年7月10日距今已经运行了:<text style="color:blue">{{msg}}</text> :tada::tada::tada:

你可以通过[首页](/)的社交图标联系到我，网站暂时没有启用valine系统，所以还没有评论功能

文章主要是给自己提供一个记录和回忆的地方，自己忘了的东西可以快速找到，并不具备其它商业意义

网站所有的文章都会标注`引用`标签和`原创`标签，如感兴趣，均可自由引用，但请不要用于商业用途

<script setup>
import {ref} from "vue";
const msg = ref(null);
let ms=new Date()-new Date(2022,6,10);
let day=Math.floor(ms/(24*3600*1000));
msg.value=`${day}天`
</script>
