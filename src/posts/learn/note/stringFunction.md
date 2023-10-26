---
title: js/ts字符串方法总结
icon: javascript
isOriginal: true
category: 前端基础
tag:
- javaScript
- typeScript
---
js中String类型原型链上的相关方法和常见用法总结，这些内容在[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)上都有甚至更好，但是自己写过一次之后印象会更深一点。
<!-- more -->

## padStart-padEnd
一个字符串补齐到指定长度的方法，举个栗子：在不使用day.js的时候，想将时间转为hh:mm:ss这种格式需要自己去获取时间，然后取出相应的位置，然后进行补齐。
使用padStart就不用了  
是否影响原字符串：否
```javascript
let time = new Date()
let h = time.getHours().toString().padStart(2,'0')
let m = time.getMinutes().toString().padStart(2,'0')
let s = time.getSeconds().toString().padStart(2,'0')
console.log(h,m,s)
//hh:mm:ss

let astr = 'a'
let bstr = 'bb'

astr = astr.padEnd(4,'0')
bstr = bstr.padEnd(4,'0')

console.log(astr,bstr)
//a000 bb00
```

## concat
连接多个字符串并返回一个新的字符串  
是否影响原字符串：否
```javascript
let str1 = 'you are'
let str2 = ' pig'
console.log(str1.concat(str2))
// you are pig
```

## at
是否影响原字符串：否  
at方法和方括号计法很类似，都是返回指定位置的UTF-16字符,但是at可以接收负数，从末尾计数。
:::info 为什么是UTF-16
在早期的 Unicode 标准中，所有字符都可以在一个 16 位的数字范围内表示，这意味着每个字符可以使用一个 16 位的数值来表示。这就是 UCS-2 编码，它只包含基本多文种平面（BMP）中的字符。

但随着时间的推移，Unicode 标准开始包括更多的字符，超出了单个 16 位数字所能表示的范围。为了容纳这些额外的字符，UTF-16 编码被引入。在 UTF-16 编码中，大多数常用字符仍然只需要一个 16 位的单元，但某些字符可能需要两个 16 位的单元，这称为“代理对”。

JavaScript 内部使用 UTF-16 来存储和操作字符串，所以当你查询一个字符时，通常你得到的是一个 16 位的码元。这也是为什么当你试图获取一个代理对中的一半时（例如一个位于字符串中的四字节 emoji 的一半），你可能会得到一个不完整或无法识别的字符。

这就是 MDN 在 at() 方法的描述中提及 UTF-16 码元的原因，因为它在技术上是准确的，并且反映了 JavaScript 如何处理字符串的细节。
:::
```javascript
let str1 = 'my name is god'
console.log(str1[3] === str1.at(3))
//true
console.log(str1.at(-5))
// s
```

## charAt
是否影响原字符串：否
>String 的 charAt() 方法返回一个由给定索引处的单个 UTF-16 码元构成的新字符串。
>charAt() 方法总是将字符串作为 UTF-16 码元序列进行索引，因此它可能会返回孤项代理。要获取给定索引处的完整 Unicode 码位，请使用 String.prototype.codePointAt() 和 String.fromCodePoint()。

想要理解这段话，我们需要先了解一下unicode和utf-16，utf在上一条已经说过了
:::info unicode
Unicode 是一个国际标准，用于给所有的字符、标点和符号（无论是哪种语言或脚本）分配一个唯一的数字。这个数字通常被称为“码位”。  

UTF-16 是 Unicode 字符集的一种编码方式。它使用一个或两个 16 位的单元来表示一个字符。大多数常见的 Unicode 字符只需要一个 16 位的单元来表示，但一些较大的码位（超过 U+FFFF 的字符）需要两个 16 位的单元。这两个单元被称为代理对，分为高代理和低代理。

“孤项代理”是指一个单独存在（没有与其配对的代理）的代理单元。当我们使用 charAt() 来索引一个字符串时，如果指向的位置正好是一个代理对的一部分，那么 charAt() 只会返回那个位置的单元（可能是高代理或低代理），而不会返回完整的字符。这就可能产生一个孤立的代理单元。
:::

看一段代码
```javascript
let emoji = "😀";
let str = "emoji"
console.log(str.charAt(0))
console.log(emoji.charAt(0))
console.log(emoji.at(0))
// e
// 无法获得一个字符 乱码
// 无法获得一个字符 乱码
```

## charCodeAt
是否影响原字符串：否
>String 的 charCodeAt() 方法返回一个整数，表示给定索引处的 UTF-16 码元，其值介于 0 和 65535 之间。
>charCodeAt() 方法总是将字符串当作 UTF-16 码元序列进行索引，因此它可能返回单独代理项（lone surrogate）。

```javascript
let emoji = "😀";
let str = "emoji"
console.log(emoji.charCodeAt(0));
console.log(emoji.charCodeAt(1));
console.log(str.charCodeAt(0))
// 55357 😀的第一个孤项代理
// 56832 😀的第二个孤项代理
// 101 'e'
```

## codePointAt
是否影响原字符串：否  
>String 的 codePointAt() 方法返回一个非负整数，该整数是从给定索引开始的字符的 Unicode 码位值。请注意，索引仍然基于 UTF-16 码元，而不是 Unicode 码位。

```javascript
let emoji = "😀";
let str = "emoji"
console.log(emoji.codePointAt(0));
console.log(emoji.codePointAt(1));
console.log(str.codePointAt(0))
// 128512 😀的第一个码位
// 56832 😀的第二个码位
// 101 'e'
```

## fromCharCode
>String 的 fromCharCode() 方法从一串 Unicode 码元序列中返回一个字符串.

```javascript
var str = String.fromCharCode(72, 101, 108, 108, 111); // 返回 'Hello'
console.log(str);
```

## fromCodePoint
>String.fromCodePoint() 静态方法将根据指定的码位序列返回一个字符串。

```javascript
var emoji = String.fromCodePoint(128513);
console.log(emoji); // 输出：😁
```

## includes
是否影响原字符串：否  
该方法区分大小写，如果想不区分大小写，可以使用正则表达式

>String 的 includes() 方法用于判断一个字符串是否包含在另一个字符串中，根据情况返回 true 或 false。
> 第一个参数是要搜索的字符串，第二个参数是开始搜索的位置，默认为 0。

```javascript
let str = 'hello world'
console.log(str.includes('hello'))
// true
console.log(str.includes('Hello'))
// false
console.log(str.includes('hello',1))
// false
```

## indexOf
是否影响原字符串：否
该方法区分大小写，如果想不区分大小写，可以使用正则表达式
>String 的 indexOf() 方法在字符串中搜索指定子字符串，并返回其第一次出现的位置索引。
> 它可以接受一个可选的参数指定搜索的起始位置，如果找到了指定的子字符串，则返回的位置索引大于或等于指定的数字。  
> 第一个参数是要搜索的字符串，第二个参数是开始搜索的位置，默认为 0。

```javascript
let str = 'hello world'
console.log(str.indexOf('hello'))
// 0
console.log(str.indexOf('Hello'))
// -1
console.log(str.indexOf('hello',1))
// -1
```

## lastIndexOf
是否影响原字符串：否
>String 的 lastIndexOf() 方法搜索该字符串并返回指定子字符串最后一次出现的索引。它可以接受一个可选的起始位置参数，
> 并返回指定子字符串在小于或等于指定数字的索引中的最后一次出现的位置。

```javascript
let str = 'hello world'
console.log(str.lastIndexOf('hello'))
// 0
console.log(str.lastIndexOf('Hello'))
// -1
console.log(str.lastIndexOf('hello',1))
// 0
```

## match
是否影响原字符串：否
>String 的 match() 方法将检索字符串以获得指定值，或找到一个或多个正则表达式的匹配。

```javascript
let str = 'hello world'
console.log(str.match('hello'))
// ["hello", index: 0, input: "hello world", groups: undefined]
console.log(str.match('Hello'))
// null
```

## matchAll
是否影响原字符串：否
>String 的 matchAll() 方法返回一个包含所有匹配正则表达式及分组捕获结果的迭代器。

```javascript
const regexp = /t(e)(st(\d?))/g;
const str = 'test1test2';

const array = [...str.matchAll(regexp)];

console.log(array[0]);
//Array ["test1", "e", "st1", "1"]

console.log(array[1]);
//Array ["test2", "e", "st2", "2"]
```

## localeCompare
是否影响原字符串：否
>localeCompare() 方法返回一个数字，表示参考字符串在排序顺序中是在给定字符串之前、之后还是与之相同。在支持 Intl.Collator API 的实现中，该方法仅是调用了 Intl.Collator 方法。  
> 0：两个字符串相等 1：字符串在字母表中排在字符串参数之前 -1：字符串在字母表中排在字符串参数之后
```javascript
let str1 = 'hello world'
let str2 = 'hello world'
let str3 = 'Hello world'
console.log(str1.localeCompare(str2))
// 0
console.log(str1.localeCompare(str3))
// 1
console.log(str3.localeCompare(str1))
// -1
```

## normalize
>String 的 normalize() 方法返回该字符串的 Unicode 标准化形式。

```javascript
let str = '\u0041\u006d\u00e9\u006c\u0069\u0065';
console.log(str.normalize())
// Amélie
```

## Raw
>String 的 raw() 方法返回一个字符串，表示一个模板字符串的原始字符串。

```javascript
let str = String.raw`Hi\n${2+3}!`;
console.log(str);
// Hi\n5!
```

raw和直接使用模板字符串有一些区别，模板字符串会将转义字符转义为对应的字符，而raw则不会。
```javascript
let str = `Hi\n${2+3}!`;
console.log(str);
// Hi
// 5!
```

## repeat
是否影响原字符串：否
>String 的 repeat() 方法返回一个新字符串，表示将原字符串重复 n 次。

```javascript
let str = 'hello world'
console.log(str.repeat(2))
// hello worldhello world
```

## replace
是否影响原字符串：否
>String 的 replace() 方法返回一个由替换值（replacement）替换一些或所有匹配的模式（pattern）后的新字符串。

```javascript
let str = 'hello world'
console.log(str.replace('hello','hi'))
// hi world
```

## replaceAll
是否影响原字符串：否
>String 的 replaceAll() 方法返回一个新字符串，该字符串是通过使用 replacement 替换了与 regexp 匹配的子字符串的每个匹配子串后得到的。

```javascript
let str = 'hello world'
console.log(str.replaceAll('l','my'))
// hemmyo wormy
```

## search
是否影响原字符串：否
>String 的 search() 方法执行正则表达式和 String 对象之间的一个搜索匹配。返回值是匹配的第一个位置。如果没有匹配，则返回 -1。

```javascript
let str = 'hello world'
console.log(str.search('l'))
// 2
```

## slice
是否影响原字符串：否
>String 的 slice() 方法提取某个字符串的一部分，并返回一个新的字符串，且不会改动原字符串。

```javascript
let str = 'hello world'
console.log(str.slice(2,5))
// llo
```

## split
是否影响原字符串：否
>String 的 split() 方法使用指定的分隔符字符串将一个 String 对象分割成子字符串数组，以一个指定的分割字串来决定每个拆分的位置。

```javascript
let str = 'hello world'
console.log(str.split(' '))
// ["hello", "world"]
console.log(str)
// hello world
```

## startsWith
是否影响原字符串：否
>String 的 startsWith() 方法用来判断当前字符串是否以另外一个给定的子字符串开头，并根据判断结果返回 true 或 false。

```javascript
let str = 'hello world'
console.log(str.startsWith('hello'))
// true
console.log(str.startsWith('Hello'))
// false
```

## substring
是否影响原字符串：否
>String 的 substring() 方法返回该字符串从起始索引到结束索引（不包括）的部分，如果未提供结束索引，则返回到字符串末尾的部分。

```javascript
let str = 'hello world'
console.log(str.substring(2,5))
// llo
```

## toLocaleLowerCase
是否影响原字符串：否
>String 的 toLocaleLowerCase() 方法根据任何特定于语言环境的案例映射，返回调用字符串被转换为小写的值。

```javascript
let str = 'HELLO WORLD'
console.log(str.toLocaleLowerCase())
// hello world
```

## toLocaleUpperCase
是否影响原字符串：否
>String 的 toLocaleUpperCase() 方法根据任何特定于语言环境的案例映射，返回调用字符串被转换为大写的值。

```javascript
let str = 'hello world'
console.log(str.toLocaleUpperCase())
// HELLO WORLD
```

## toLowerCase
是否影响原字符串：否
>String 的 toLowerCase() 方法返回调用该方法的字符串值转换为小写形式的新字符串。

```javascript
let str = 'HELLO WORLD'
console.log(str.toLowerCase())
// hello world
```

## toString
是否影响原字符串：否
>String 的 toString() 方法返回指定对象的字符串形式。

```javascript
let str = 'HELLO WORLD'
console.log(str.toString())
// HELLO WORLD
```

## toUpperCase
是否影响原字符串：否
>String 的 toUpperCase() 方法返回调用该方法的字符串值转换为大写形式的新字符串。

```javascript
let str = 'hello world'
console.log(str.toUpperCase())
// HELLO WORLD
```

## trim
是否影响原字符串：否
>String 的 trim() 方法会从一个字符串的两端删除空白字符。在这个上下文中的空白字符是所有的空白字符 (space, tab, no-break space 等) 以及所有行终止符字符（如 LF，CR）。
> trim() 方法并不影响原字符串本身，它返回的是一个新的字符串。

```javascript
let str = ' hello world '
console.log(str.trim())
// hello world
```

## trimEnd
是否影响原字符串：否
>String 的 trimEnd() 方法从一个字符串的末端删除空白字符。trimEnd() 方法并不影响原字符串本身，它返回的是一个新的字符串。

```javascript
let str = ' hello world '
console.log(str.trimEnd())
//  hello world
```

## trimStart
是否影响原字符串：否
>String 的 trimStart() 方法从一个字符串的开始删除空白字符。trimStart() 方法并不影响原字符串本身，它返回的是一个新的字符串。

```javascript
let str = ' hello world '
console.log(str.trimStart())
// hello world 
```

## valueOf
是否影响原字符串：否
>String 的 valueOf() 方法返回一个 String 对象的原始值。

```javascript
let str = 'hello world'
console.log(str.valueOf())
// hello world
```

