---
title: 发布订阅模式
icon: return
---

## 前端中的发布订阅模式
身为前端开发，我们接触订阅发布模式的场景是相当多的，比如`Vue`的`$emit`和`$on`，`React`的`Context`和`Redux`等等。这些都是发布订阅模式的应用。  
再者，抛去框架之外，我们非常常用的一个场景就是`addEventListener`和`dispatchEvent`，这两个方法就是发布订阅模式的应用。  
以addEventListener为例：
```js
document.addEventListener('click', function() {
  console.log('click')
})
```
这里我们给document对象添加了一个click事件的监听器，当document对象触发click事件时，就会执行这个监听器中的函数。  
这样子可能有些同学看不出来这是发布订阅模式，那么我们可以稍微改造一下：
```js
document.addEventListener('abc', function() {
  console.log('click')
})
document.dispatchEvent(new Event('abc'))
```
这段代码可以分为几部分，首先是new Event('abc'),就是一个事件中心；然后是addEventListener，就是订阅事件；最后是dispatchEvent，就是派发事件。

## 发布订阅模式的实现
了解了发布订阅模式的应用场景，我们来看看发布订阅模式的实现。这里使用`TypeScript`来实现一个简单的发布订阅模式。  
首先我们要清楚，订阅发布模式的核心就是一个事件中心，我们可以通过这个事件中心来订阅事件和发布事件。所以这里我们先定义一个类型EmitterEvent，这个类型就是我们的事件中心。  
```typescript
interface EmitterEvent {
    nvents: Map<string, Function[]>
    on: (event: string, fn: Function) => void
    emit: (event: string, ...args: any[]) => void
    off: (event: string, fn: Function) => void
    once: (event: string, fn: Function) => void
}
```
这样就得到了一个事件中心的类型，接下来我们就可以实现这个类型了。

首先初始化，events我们使用Map表示。
```typescript
class EventEmitter implements EmitterEvent {
    events: Map<string, Function[]>;

    constructor() {
        this.events = new Map()
    }
}
```
接下来我们实现on方法，这个方法就是订阅事件。
```typescript
on(event: string, fn: Function) {
    //如果没有这个事件，就初始化一个，并且把fn放进去
    if (!this.events.has(event)) {
        this.events.set(event, [fn])
    }else {
     //如果已经有了这个事件，就把fn放进去
        //this.events.get(event)?.push(fn)// or
        const fns = this.events.get(event)
        fns && fns.push(fn)
    }
}
```
接下来我们实现emit方法，这个方法就是发布事件。
```typescript
emit(event: string, ...args: any[]) {
    //如果没有这个事件，就返回
    if (!this.events.has(event)) {
        return
    }          
    //如果有这个事件，就执行这个事件
    const fns = this.events.get(event)
    fns && fns.forEach(fn => {
        fn(...args)
    })
}
```
接下来我们实现off方法，这个方法就是取消订阅事件。
```typescript
off(event: string, fn: Function) {
    //如果没有这个事件，就返回
    if (!this.events.has(event)) {
        return
    }
    //如果有这个事件，就把fn过滤掉
    const fns = this.events.get(event)
    fns && this.events.set(event, fns.filter(f => f !== fn))
}
```
最后我们实现once方法，这个方法就是一次性订阅事件。思路也很简单，就是订阅事件，执行一次后就取消订阅。
```typescript
once(event: string, fn: Function) {
    const onceFn = (...args: any[]) => {
        fn(...args)
        this.off(event, onceFn)
    }
    this.on(event, onceFn)
}
```
这样我们就实现了一个简单的发布订阅模式。  

## 代码
```typescript
interface EmitterEvent {
    events: Map<string, Function[]>
    on: (event: string, fn: Function) => void
    emit: (event: string, ...args: any[]) => void
    off: (event: string, fn: Function) => void
    once: (event: string, fn: Function) => void
}

class EventEmitter implements EmitterEvent {
    events: Map<string, Function[]>;

    constructor() {
        this.events = new Map()
    }

    on(event: string, fn: Function) {
        if (!this.events.has(event)) {
            this.events.set(event, [fn])
        }else {
            const fns = this.events.get(event)
            fns && fns.push(fn)
        }
    }

    emit(event: string, ...args: any[]) {
        if (!this.events.has(event)) {
            return
        }          
        const fns = this.events.get(event)
        fns && fns.forEach(fn => {
            fn(...args)
        })
    }

    off(event: string, fn: Function) {
        if (!this.events.has(event)) {
            return
        }
        const fns = this.events.get(event)
        fns && this.events.set(event, fns.filter(f => f !== fn))
    }

    once(event: string, fn: Function) {
        const onceFn = (...args: any[]) => {
            fn(...args)
            this.off(event, onceFn)
        }
        this.on(event, onceFn)
    }
}
```
