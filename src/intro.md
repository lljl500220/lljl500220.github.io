---
icon: person
sidebar: false
title: 自我介绍
date: 2022-07-10
timeline: true
category:
- 自我介绍
tag:
- About
---

很高心认识你，我是罗龙江，一个正在成长中的前端工程师！

<!-- more -->

本网站是我blog的vue版本，使用vuepress构建，原hexo的版本目前正在维护中

网站从2022年7月10日距今已经运行了:<text style="color:blue">{{msg}}</text>

你可以通过[首页](/)的社交图标联系到我，网站暂时没有启用valine系统，所以还没有评论功能

网站所有的文章都会标注`引用`标签和`原创`标签，如感兴趣，均可自由引用，但请不要用于商业用途

<script setup>
import { ref } from 'vue';
const msg = ref(null);
setInterval(()=>{
    let ms=new Date()-new Date(2022,6,10);
    let day=Math.floor(ms/(24*3600*1000));
    let msLevel=ms%(24*3600*1000);
    let hours=Math.floor(msLevel/(3600*1000));
    let msLevelNext=msLevel%(3600*1000);
    let minutes=Math.floor(msLevelNext/(60*1000));
    let msLeaveLast=msLevelNext%(60*1000);
    let seconds=Math.round(msLeaveLast/1000);
    msg.value=`${day}天${hours}小时${minutes}分钟${seconds}秒`
},1000)
</script>
