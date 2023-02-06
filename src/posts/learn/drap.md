---
title: html5 拖放api
date: 2022-7-20
icon: html
---

前两日收到极客公众号的广告推送，看到一道面试题，内容大约是：html5实现拖拽的方式有哪些？
自问我当时也只能粗浅的知道有鼠标事件或者drap api，但是具体怎么实现，还是不太清楚，故趁此机会
温故知新。

<!-- more -->

话不多说，直接上代码
```vue
<template>
  <!-- 放置拖拽元素的容器 -->
  <div id="div1" @drop="drop" @dragover="dragover"></div>
  <!-- 被拖拽的元素 -->
  <div style="width: 120px;height: 120px;background-color: red" id="drag1" draggable="true"
       @dragstart="drag"></div>
</template>
```
```ts
//在进入容器时阻止默认事件
function dragover(ev:any) {
  ev.preventDefault();
}

//开始拖拽元素时，将被拖动的元素转换类型
function drag(ev:any) {
  ev.dataTransfer.setData("Text", ev.target.id);
}

//放置该元素时，阻止默认事件，否则会出现当拖拽的元素为链接形式，会被浏览器直接打开的问题
//从事件消息中获取到元素内容，将内容放置到目标容器中
function drop(ev:any) {
  ev.preventDefault();
  let data = ev.dataTransfer.getData("Text");
  ev.target.appendChild(document.getElementById(data));
}
```

这方法能够快速的拖动元素到目标容器中，但是一旦出现某种情况，需要自由的拖动元素到任意位置，一般就需要使用到鼠标事件，比较麻烦。
通过css属性设置，也能达到响应的效果。

思路是这样的：仍然使用drag拖动元素，给一个比较大的目标容器，计算鼠标坐标和容器边框的相对距离，对拖动元素设置css即可。比如上方的代码，
最终drag1的元素会被拖动到dorp1的左上方。

:::center
![上方代码拖动之前](/learn/drag_start.png =200x200)
![上方代码拖动结果](/learn/drag.png =200x200)
:::

如果我想让dorp1放置到drag1的右下方，那就需要自己去定位和设置css属性了。

上方代码修改如下
```ts
function drop(ev:any) {
  ev.preventDefault();
  let data = ev.dataTransfer.getData("Text");
  ev.target.appendChild(document.getElementById(data));
  setupPosition(data,50,50)
}

function setupPosition(target:string,left:number,top:number){
  let doc:any = window.document.getElementById(target)
  doc.style.position = "absolute"
  doc.style.left = left.toString() + "px"
  doc.style.top = left.toString() + "px"
}
```

:::center
![上方代码拖动结果](/learn/drap_center.png =200x200)
:::
实现的效果从拖动到左上方变成了居中，当然也可以设置其它css属性。