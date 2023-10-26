---
title: js/ts数组方法总结
icon: javascript
date: 2022-9-10
isOriginal: true
category: 前端基础
tag:
- javaScript
- typeScript
---
js中Array类型相关方法和常见用法总结
<!-- more -->
## 描述
1. 在js中，数组不是一个基本类型，它是具有多个明显特征的对象，所以typeof []的结果是object。
2. 数组的大小是可以动态调整的，并且可以存入不同类型的数据或者对象，但是在ts中，必须将数组类型设置为any(或其它你能够确认的类型)才可以这样操作。
3. js的数组必须从0开始进行下标索引，无法像其它高级语言一样以任意字符串进行索引。
4. js、ts中的数组，复制操作均为浅拷贝。（所有 JavaScript 对象的标准内置复制操作都会创建浅拷贝，而不是深拷贝）

## length
与string的长度不一样的是，array的length是可以写入的，当写入一个比原先长度更长的length时，多出的数组位置将被undefined填充，
减少时将会从尾部顺序删除。同理，当删除一个元素时，数组的length也会减少。
```typescript
let arrTest = [1,2,3,4]
arrTest.length = 5
console.log(arrTest[4]) //undefined
arrTest.length = 2
console.log(arrTest) //[1,2]
delete arrTest[1]
console.log(arrTest) //[1,empty]
``` 

## 稀疏数组
稀疏数组是指数组中的元素并不是连续排列的，中间有空缺的数组。  
```typescript
let arrTest = [1,2,3,4]
arrTest[10] = 10
console.log(arrTest) //[1,2,3,4,empty × 6,10]
```
在某些操作中，空槽的行为会表现得像undefined一样，但是在其它操作中，空槽会被跳过。  
```typescript
let arrTest = [1,2,3,4]
arrTest.length = 5
console.log(arrTest.length) //5
console.log(arrTest[4]) //undefined
for (const i of arrTest) {
   console.log(i);
} //1,2,3,4,undefined

let another = [...arrTest]
console.log(another) //[1,2,3,4,undefined]
```
但是在另一些操作中，尤其是迭代方法中，空槽会被跳过。  
```typescript
let arrTest = [1,2,3,4]
arrTest.length = 5
arrtest.forEach((item,index) => {
    console.log(item) //1,2,3,4
})
console.log(arrTest.map(item => item * 2)) //[2,4,6,8]
```

### 类数组对象
术语类数组对象指的是在上面描述的 length 转换过程中不抛出的任何对象。在实践中，这样的对象应该实际具有 length 属性，并且索引元素的范围在 0 到 length - 1 之间。（如果它没有所有的索引，它将在功能上等同于稀疏数组。）

许多 DOM 对象都是类数组对象——例如 NodeList 和 HTMLCollection。arguments 对象也是类数组对象。你可以在它们上调用数组方法，即使它们本身没有这些方法。
```typescript
function printArguments() {
   arguments.forEach((item) => {
      console.log(item);
   }); // TypeError: arguments.forEach is not a function
}
function printArguments() {
   Array.prototype.forEach.call(arguments, (item) => {
      console.log(item);
   });
}
```
::: tip
call和apply可以参考[这篇文章](class.md)
:::

## 构造函数 Array()
```typescript
let arrTest = new Array(1,2,3,4)
console.log(arrTest) //[1,2,3,4]
let arrTest2 = new Array(5)
console.log(arrTest2) //[empty × 5]
```


## Array类的静态方法
1. Array.from()
从一个类数组对象中创建数组实例。常用于数组去重之类的操作，以下是一个去重的例子：
    ```typescript
    let arrTest = [1,1,2,2,3,4]
    let arr2 = Array.from(new Set(arrTest))
    console.log(arr2) //[1,2,3,4]
    ```
    上面例子中使用了Set类，是es6中新加入的数据类型
    ::: info Array与Set的区别
    ```typescript
    let arrTest = [1,1,2,2,3,4]
    //去重
    let arr2 = Array.from(new Set(arrTest))
    console.log(arr2)
    //删除
    arrTest.splice(1,2)
    let set = new Set(arrTest)
    set.delete(1)
    //添加
    arrTest.push(5)
    arrTest.unshift(-1)
    arrTest.splice(1,0,1)
    set.add(6)
    //清空
    arrTest.length = 0
    set.clear()
    //判断元素是否存在
    arrTest.indexOf(1) > -1
    arrTest.includes(1)
    set.has(1)
    ```
    :::
2. Array.isArray()
   判断是否为array类型
   ```typescript
    let arrTest = [1,1,2,2,3,4]
    console.log(Array.isArray(arrTest)) //true
    console.log(Array.isArray(new Set(arrTest))) //false
   ```
3. Array.of()