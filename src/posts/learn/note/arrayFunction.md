---
title: js/ts数组方法总结
icon: javascript
date: 2022-9-10
isOriginal: true
category:
- 前端基础
tag:
- javaScript
- typeScript
---
js中Array类型相关方法和常见用法总结
<!-- more -->
## 描述
1. 在js中，数组不是一个基本类型，它是具有多个明显特征的对象，所以typeof []的结果是object。
2. 数组的大小是可以动态调整的，并且可以存入不同类型的数据或者对象，但是在ts中，必须将数组类型设置为any才可以这样操作。
3. js的数组必须从0开始进行下标索引，无法像其它高级语言一样以任意字符串进行索引。
4. js、ts中的数组，复制操作均为浅拷贝。（所有 JavaScript 对象的标准内置复制操作都会创建浅拷贝，而不是深拷贝）

## length
与string的长度不一样的是，array的length是可以写入的，当写入一个比原先长度更长的length时，多出的数组位置将被undefined填充，
减少时将会从尾部顺序删除。
```typescript
let arrTest = [1,2,3,4]
arrTest.length = 5
console.log(arrTest[4]) //undefined
arrTest.length = 2
console.log(arrTest) //[1,2]
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