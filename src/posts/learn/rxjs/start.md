---
title: 出发-开始学习
icon: typeScript
isOriginal: true
category: rxjs
tag:
- javaScript
- typeScript
---

## RXJS是什么
官网说：
:::info
RxJS 是一个使用可观察序列编写异步和基于事件的程序的库。它提供了一种核心类型，即 Observable、一些周边类型（Observer、Scheduler、Subjects）和类似于 Array 方法（map、filter、reduce、every 等）的操作符，以便将异步事件作为集合进行处理。
:::

非常不好理解，我们从上面提到的几个东西开始逐步理解这个东西

## Observable
从字面意思上，它可以解释为“可观察的”。事实上，它确实是rxjs的最核心概念，一个可以被观察的“流”对象。  
### 可被观察
rxjs的核心是观察者模式(订阅-发布模式)，当订阅了一个可以被观察的对象时，订阅者(在rxjs中通常是observer，即`new Observable().subscribe(observer)`).
我们来看一段代码
```typescript
// 首先是一个非常简单的创建被观察者
const observable = new Observable<number>(subscribe=>{
    subscribe.next(1)
    subscribe.next(2)
    subscribe.next(3)
    setTimeout(()=>{
        subscribe.next(4)
    },1000)
})
//然后去观察它(订阅)
observable.subscribe({
    next:(n)=>console.log(n)
})
//随即，observable将推送一个数据流出来，1,2,3,1s...,4
```
```shell
1
2
3
等待1s
4
```
### 流
上文提到了一个被观察的对象，在被订阅后，会逐渐的推送出一个‘流’出来，那么流究竟是什么？  
在计算机科学中，流被用于描述一组数据的连续传输和处理，可以看作是数据的有序序列，尽管它们在时间上不一定连续。在网络中，用于代指连续传输的数据包序列(它仍然是一个有序的，但是不一定在时间上连续的数据序列)，比如TCP。
在代码中，比如java的io操作InputStream和node的FileStream，这些都是流的体现。
在rxjs中，所有被观测的对象，都会将数据以流的形式推送给观察者或者说订阅者。所以这就是官网对rxjs定性的第二点-将异步事件作为集合处理。同时，rxjs的几乎所有操作符都与Array方法相似，这表明了，rxjs中的数据流动是一个有序序列。  
接下来我们看一段代码
```typescript
const observable = new Observable<number>(subscribe => {
    subscribe.next(1)
    subscribe.next(2)
    subscribe.next(3)
    setTimeout(() => {
        subscribe.next(4)
    }, 1000)
})
observable.subscribe({
    next: (n) => console.log(n)
})
//1,2,3,1s...,4
```
