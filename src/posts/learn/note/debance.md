---
title: 优雅的实现防抖
icon: javascript
isOriginal: true
toc: true
category: 前端进阶
tag:
- javascript 
---

## 防抖的使用场景
防抖在前端的应用非常常见，比如大屏-页面缩放,输入搜索-防抖和校验,按钮点击-不希望频繁的被点击,滚动限制-希望在滚动一定距离后或者一定时间后再发生加载事件等。
我们举例一个输入搜索来说，其它的也是同样的原理。  
比如现在有如下代码
```vue
<script setup lang="ts">
import {ref} from "vue";
import {findUserApi} from "../api/friend"

const inputStr = ref('')
const input = () =>{
  findUserApi({data:inputStr.value}).then((res)=>{
    console.log(res)
  })
}

</script>

<template>
  <el-input placeholder="测试" v-model="inputStr" @input="input"/>
</template>
```
很显然，这段代码在输入框每次发生变化时都会进行一次findUser操作，这样做有什么问题呢：
1. 频繁的请求，造成服务器和客户端资源浪费
2. 异步请求可能会导致最终得到的结果并不是最后一次请求的结果
3. 频繁的视图变化，用户体验并不好

那么有没有什么办法去改变呢，通常-这里说的是在epd代码中发现的写法，就会有如下的这种代码
```typescript
const inputStr = ref('')
let timeout = 0
const input = () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
        findUserApi({data: inputStr.value}).then((res) => {
            console.log(res)
        })
    }, 1000)
}
```
那这个请求方法就会被改变了，一秒内只会发送一次，并且不会重复发送请求，这是epd中常见的一种写法。  
但是还有一个问题啊，每次需要防抖的时候都要写这么一段，很麻烦，有没有一个封装的方法呢？

## 封装debounce函数
为了能够在所有的防抖场景都能够快速的构建一个防抖函数，我们需要实现一个通用的工具，比如下面这样
```vue
const inputStr = ref('')
let timeout = 0
const input = () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    findUserApi({data: inputStr.value}).then((res) => {
      console.log(res)
    })
  }, 1000)
}

const debounce = (func: Function, duration = 1000) => {
  let timerId = 0;
  return () => {
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      func()
    }, duration)
  }
}

const new_input = debounce(input)

</script>

<template>
  <el-input placeholder="测试" v-model="inputStr" @input="new_input"/>
</template>
```
现在，new_input函数就是一个能够快速防抖的函数了。结束了吗？远远没有。  
debounce是一个通用函数，那么还需要考虑其他问题，比如万一input()是有参数的呢?，比如this指向呢？
### 保证this指向与原函数一致
我们都知道，使用箭头函数时，this是不存在的，它永远指向自己的外层，那么在debounce方法中就无法使用箭头函数返回。
### 保证参数
可以使用剩余参数收集起来，再传递给func
```typescript
const debounce = (func: Function, duration = 1000) => {
    let timerId = 0;
    return function (...arg:any) {
        clearTimeout(timerId)
        timerId = setTimeout(() => {
            func.apply(this,arg)
        }, duration)
    }
}
```
好了，现在我们得到了一个非常优雅的防抖函数，它几乎能胜任任何情况下的防抖操作。这就完了吗，我今天想说的是另一种实现思路-rxjs

## rxjs实现防抖
使用rxjs可以轻松的实现这个功能
```typescript
const inputObs = new Subject<string>()
inputObs.pipe(
    debounceTime(1000),
    filter((value: string) => value !== ''),
    distinctUntilChanged(),
    switchMap( (value: string) => {
        return from(findUserApi({data: value}))
    })).subscribe((result: any) => {
    console.log(result)
})
const input = (value: string) => {
    inputObs.next(value)
}
```
上面的代码，创建了一个可观察的对象，通过管道限制了每秒最多执行1次，过滤了数据为空字符串的情况，保证本次输入和上次输入不一致的情况下才允许发起请求，
如果一个请求在1秒内没有完成，但是现在进入了其它的输入，则取消上一次的请求，保证结果是最后结果等！

事实上，我们自己实现的debounce函数仍然是存在问题的，尤其是无法保证结果最新这一项。但是使用rxjs就可以完美保证这个效果。