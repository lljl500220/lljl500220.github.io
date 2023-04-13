---
title: 小米2022秋招
icon: edit
date: 2022-11-1
isOriginal: true
category: 前端基础
tag:
- html5
- javaScript
---

1. 关于 <!DOCTYPE> 下列说法错误的是
   - [ ] <!DOCTYPE> 声明必须是 HTML 文档的第一行，位于 html 标签之前
   - [ ] <!DOCTYPE> 声明没有结束标签 
   - [ ] <!DOCTYPE> 声明对大小写不敏感
   - [x] <!DOCTYPE> 声明是 HTML 标签，它是指示 web 浏览器关于页面使用哪个 HTML 版本进行编写的指令。
:::info 题解
<!DOCTYPE> 声明必须位于 HTML5 文档中的第一行，也就是位于 html 标签之前。该标签告知浏览器文档所使用的HTML 规范。

doctype 声明不属于 HTML 标签；tag; 它是一条指令，告诉浏览器编写页面所用的标记的版本。
:::
2. 以下代码的输出结果是
    ```javascript
    var end = Math.pow(2, 50)
    var start = end - 100
    var count = 0
    for(var i = start; i<= end; i++){
        ++count
    }
    console.log(count)
   ```
:::info 题解
101,不管Math.pow()的结果是多少，循环空间总是100，++count指令先执行加一操作再执行i++操作，所以进入第一百次循环后仍然执行了一次加一。

Math.pow(x,y)是用于计算x的y次方的值
:::
3. 使用Javascript在数组尾部添加数据的方法是？
   - [ ] arrayObj.shift()
   - [ ] arrayObj.unshift()
   - [x] arrayObj.pop()
   - [ ] arrayObj.push()
:::info 题解
shift() 从头部删除一个元素，返回该元素  
unshift() 向头部添加一个元素，viod类型  
pop() 和其它语言一样，出栈，从尾部删除一个元素，返回该元素  
push() 向尾部添加一个元素，void类型  
[更多array的相关方法请看这篇文章→](../note/arrayFunction.md)
::: 
4. 下列关于Window Location 说法错误的是（ ）
   - [x] location.host 返回 web 主机的域名
   - [ ] location.pathname 返回当前页面的路径和文件名
   - [ ] location.port 返回 web 主机的端口 （80 或 443）
   - [ ] location.protocol 返回所使用的 web 协议（http: 或 https:）
::: info 题解
hostname返回主机域名，不带端口；host返回的是主机域名、ip加端口
:::
5. 写出下面代码的执行结果
   ```javascript
   function A (cName) {
      if (cName) {
         this.name = cName
      }
   }
   A.prototype.name = 'XiaoMi'
   var a = new A()
   console.log('A', a.name)
   function B (cName) {
      this.name = cName
   }
   B.prototype.name = 'Xiaomi'
   var b = new B()
   console.log('B', b.name)
   ````
::: info 题解
输出：A XiaoMi;B undefined  
方法A、B实例均没有传入实参，故A中this.name没有被undefined覆盖；但是b的this.name被覆盖了。
:::
6. 下方代码的值是：
   ```javascript
   let oldValue = 2; 
   let newValue = oldValue << 3;
   ```
::: info 题解
16  
<< 位运算符，js中数字类型默认为十进制，位运算使用二进制运算，则 2 << 3等于2的二进制数左移3位，高位丢弃，低位补0  
2的二进制数为 0000 0010，左移三位后为 0001 0000，化为十进制为16
:::
7. position定位，下列说法错误的是（ ）
   - [ ] fixed元素，可定位相对于浏览器窗口的指定坐标，它始终是以 body 为依据
   - [ ] absolute 的元素，如果它的父容器设置了 position 属性，并且 position 的属性值为 absolute 或者relative，那么就会依据父容器进行偏移
   - [ ] fixed 属性的元素在标准流中不占位置
   - [x] relative元素以它原来的位置为基准偏移，在其移动后，原来的位置不再占据空间
::: info 题解 
fixed 不占文档流位置，以body为依据，故而可以放置在任意地方  
absolut根据父元素偏移。若父元素没有position值则根据body偏移  
relative偏移后仍然占据空间
:::
8. 请填写下面代码的输出结果（ ）
   ```javascript
   var callbacks = []
   for (var i = 0; i < 4; i++) {
      callbacks.push(function() {
      console.log(i);
   });
   }
   callbacks.forEach(cb => cb());
   ```
::: info 题解 
4,4,4,4  
for循环体内执行的内容是向callbacks中添加了四个一模一样的方法，该方法打印i值。由于
i是var关键字定义的，在for循环结束后仍然存在，所以最后循环执行时打印了最后一次循环时
的i值，即4。  
若i是let定义的，有作用域限制，则会打印0,1,2,3。
:::
9. 下列哪些不是浏览器支持的css选择器：（ ）
   - [ ] div + p
   - [ ] div:nth-child(1)
   - [x] a:disabled
   - [ ] input:disabled
::: info 题解
a标签没有disabled属性  
div+p如下：  
:::center
![div+p](/learn/div+p.png =x300)
:::
10. 数组中会改变原数组方法有哪些？
   - [x] sort
   - [ ] slice
   - [ ] concat
   - [x] pop
::: info 题解
array.sort()方法给原数组排序，可以传入参数函数实现倒序和正序或者自定义排序
```javascript
array1.sort((a,b)=>{
    // return a - b  正序
    return b - a //倒序
})
```
array.slice(start,end)方法截取数组的start位到end位。返回截取内容，原数组不变  
concat(arr1,arr2)函数链接两个数组，原数组不变，返回新数组  
[更多array的相关方法请看这篇文章→](../note/arrayFunction.md)
:::
11. 下列属于宏任务的是？
   - [x] setTimeout
   - [ ] MutationObserver
   - [ ] Promise.then catch finally
   - [x] requestAnimationFrame
   - [x] setInterval
::: info 题解
js宏任务包括
script(整体代码)  
setTimeout  
setInterval  
I/O  
UI交互事件  
postMessage 跨源通信方法  
MessageChannel 消息通道  
setImmediate(Node.js 环境) 将一个方法放入回调，在浏览器执行完毕其他任务后执行该方法  
requestAnimationFrame方法是用于页面动画帧的实现，属于ui事件。
:::
12. 【集合的所有子集】  
    问题描述: 集合的所有子集 给定一组不含重复元素的整数数组 nums，返回该数组所有可能的子集。示例如下：  
    输入样例1：nums = [1,2,3]  
    输出样例1：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]  
    输入样例2：nums = [0]  
    输出样例2：[[],[0]]  
::: info 题解
回溯算法
```typescript
function subsets(nums: number[]): number[][] {
    let path:number[] = [] //定义回溯队列
    let result:number[][] = [] //结果
    const backtrack = (start:number) => {
        result.push([...path]) //每次回溯成功后将当前队列解构至结果集
        if(start>nums.length) return
        for (let i = start; i < nums.length; i++) {
            path.push(nums[i]) //当前选择的结果集
            backtrack(i+1) //递归
            path.pop() //回溯
        }
    }
    backtrack(0)
    return result
}
```