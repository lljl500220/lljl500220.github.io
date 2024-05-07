---
title: ES6的代理模式 Proxy
icon: javascript
category: javascript
tag:
- javascript
next: ./响应式源码实现.md
prev: ./build.md
---

## Object.defineProperty
在vue3出世后，总会遇到一个新的面试题:说一些vue2与vue3的区别。作为一个前端开发，最先想到的当然就是响应式的更改，

<!-- more -->

### 基础原理
在vue2中，我们通过Object.defineProperty来实现数据的响应式：
```javascript
let obj = {
    name:'luolj',
    age:18
}

Object.defineProperty(obj,'name',{
    get(){
        return '帅比'
    },
    set(newValue){
        console.log('名称已经被修改为：'+newValue)
    }
})

console.log(obj.name)
obj.name = 'luolj2'
console.log(obj.name)
```
上面的代码执行后会输出
```shell
帅比
名称已经被修改为：luolj2
帅比
```
诶，是不是很奇怪，明明已经修改了name属性，但是再次获得name属性时，却没有变化。这是因为Object.defineProperty只能监听对象的属性，而不能监听对象本身。
我们的get函数总是返回一个固定值，因为在attributes中无法使用this，如果使用obj.name的话，会造成递归调用以至内存泄露。

怎么解决这个问题呢？其实也相当简单，我们可以在外部添加一个提前定义好的量，比如这样：
```javascript
let obj = {
    name:'luolj',
    age:18
}

let proxyName = obj.name

Object.defineProperty(obj,'name',{
    get(){
        return proxyName
    },
    set(newValue){
        proxyName = newValue
        console.log('名称已经被修改为：'+newValue)
    }
})

console.log(obj.name)
obj.name = 'luolj2'
console.log(obj.name)
```
这段代码现在就能够正确输出了
```shell
luolj
名称已经被修改为：luolj2
luolj2
```

### vue2中是怎么使用的呢
我们都知道，在vue2中定义响应式变量，需要在data中定义，然后在vue实例中使用，如下：
```javascript
let vm = new Vue({
    data(){
        return {
            name:'luolj',
            age:18
        }
    }
})
```
从源码来看
```javascript
function initState (vm) {
    vm._watchers = [];
    var opts = vm.$options;
    if (opts.props) { initProps(vm, opts.props); }
    if (opts.methods) { initMethods(vm, opts.methods); }
    if (opts.data) {
        initData(vm);
    } else {
        observe(vm._data = {}, true /* asRootData */);
    }
    if (opts.computed) { initComputed(vm, opts.computed); }
    if (opts.watch && opts.watch !== nativeWatch) {
        initWatch(vm, opts.watch);
    }
}
```
走马观花的看一下，initData函数中，vue2新定义了的一个新的_data用来初始化数据，然后通过observe函数来监听这个_data对象，这个observe函数是vue2中的一个重要函数，用来监听对象的变化。

接下来的代码我就不一一介绍了，大家可以自行查看vue2的源码。从initData函数中，我们可以知道一点，当我们在vue2中对数据进行比如this.name = xxx操作时，实际上是在对_data对象进行操作，然后通过Object.defineProperty来监听这个_data对象的变化。

## Proxy
在ES6中，我们有了一个新的代理模式Proxy，它可以监听对象本身，接下来我们来说一下怎么用，为什么用它。

### Proxy的基本使用
先给出一段示例
```typescript
let obj = {
    name:'luolj',
    age:18
}

const proxy = new Proxy(obj,{
    get(target,key,receiver){ //receiver是proxy实例
        return Reflect.get(target,key,receiver)
    },
    set(target: { name: string; age: number }, p: string | symbol, newValue: any, receiver: any): boolean {
        return Reflect.set(target,p,newValue,receiver)
    }
})
```
::: info js小知识
Reflect是一个内置的对象，它提供拦截JavaScript操作的方法。这些方法与proxy handler方法相对应。Reflect不是一个函数对象，因此它是不可构造的。

在一些高级语言中，反射是指程序可以访问、检测和修改它本身状态或行为的一种能力。在JavaScript中，Reflect对象的设计目的是反映（reflect）ECMAScript语义的底层操作。

由于其接收一个receiver参数，能够在native code层面保证上下文的完整性，所以一般Proxy操作的拦截都会使用Reflect来进行。
:::

如上面的代码所示，大家应该能够看出与Object.defineProperty的区别。

当然，Proxy还有很多其他的方法，比如apply、has、deleteProperty等，大家可以自行查看文档。

### 为什么使用Proxy
Proxy可以监听对象本身，而Object.defineProperty只能监听对象的属性。  
(面试题:为什么属性更新无法重绘视图)  
以上面的例子来说，假设我需要在obj执行 obj.like = 'sw'，第一个例子就无法再次拦截到这个属性的变化，因为Object.defineProperty只能监听对象的属性，而不能监听对象本身。

数组变异 $set $delete $add
```javascript
data() {
    return {
        arr: [1, 2, 3]
    }
}

this.arr[3] = 4 // 无法监听到 
```

事实上，这个问题并不是由于Object.defineProperty的问题，而是由于尤大在性能方面的考量放弃了，以下有段代码可以证明这个问题
```javascript
function defineReactive(data, key, val) {
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
      get: function defineGet() {
        console.log(`get key: ${key} val: ${val}`);
        return val;
      },
      set: function defineSet(newVal) {
        console.log(`set key: ${key} val: ${newVal}`);
        val = newVal;
      }
  })
}

function observe(data) {
  Object.keys(data).forEach(function(key) {
    defineReactive(data, key, data[key]);
  })
}

let test = [1, 2, 3];

observe(test);

test[0] = 4 // set key: 0 val: 4
```
于是就有了一系列的$方法来解决这个问题，但是这个方法并不是很优雅，而Proxy就可以很好的解决这个问题。

```javascript
let obj = {
    name:'luolj',
    age:18
}

const proxy = new Proxy(obj,{
    get(target,key,receiver){ //receiver是proxy实例
        return Reflect.get(target,key,receiver)
    },
    set(target: { name: string; age: number }, p: string | symbol, newValue: any, receiver: any): boolean {
        return Reflect.set(target,p,newValue,receiver)
    }
})
obj.name = 'luo'
proxy.name = 'luo2'
console.log(obj.name) // luo2
console.log(proxy.name) // luo2
```
无论是修改原始对象obj还是修改代理对象proxy，都能够触发proxy的set方法，这就是Proxy的优势所在。

### 弊端
proxy只能接收一个 extends object类型的对象，所以对于数组、Map、Set等类型的对象，我们需要自己进行处理，这就是Proxy的一个弊端。  
比如数组：
```javascript
let arr = [1, 2, 3]

const createProxy = (obj: any) => {
    if (Object.prototype.toString.call(obj) === '[object Object]') {
        return new Proxy(obj, {})
    } else {
        let Obj = {
            value: obj
        }
        return new Proxy(Obj, {})
    }
}

let newArr = createProxy(arr)
arr.push(4)
console.log(newArr) // [1, 2, 3, 4]
```
vue内部呢对于非object类型的数据，会进行特殊处理，比如数组，这样就能够监听到数组的变化。

下一次我们来说一下vue3中的响应式，副作用函数effect，trigger等源码实现。
