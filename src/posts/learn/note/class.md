---
title: es6中的class
icon: javascript
isOriginal: true
toc: true
category: 前端进阶
tag:
- javascript 
- es6
---

## class的基本使用
在es6中，class是一个语法糖，它的本质是函数，所以我们可以使用class来构建一个类，然后使用new关键字来实例化一个对象。

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  say() {
    console.log(this.name);
  }
}
let animal = new Animal('dog');
animal.say(); // dog
```
这段代码中，我们使用class关键字来构建了一个Animal类，然后使用new关键字来实例化了一个对象，这个对象有一个name属性和一个say方法。
class既然是一个语法糖，那么它的本质是什么呢？我们可以使用typeof关键字来查看它的类型。

```javascript
console.log(typeof Animal); // function
```
我们可以看到，class的本质是一个函数，所以我们可以使用函数的方式来构建一个类。

```javascript
function Animal(name) {
  this.name = name;
}
Animal.prototype.say = function() {
  console.log(this.name);
}
let animal = new Animal('dog');
animal.say(); // dog
```
这两段代码是等价的，我们可以看到，class的本质是一个函数，它的构造函数是constructor，它的原型是prototype。

## class的继承
在es6中，class可以使用extends关键字来实现继承，这样我们就可以使用子类来继承父类的属性和方法。

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  say() {
    console.log(this.name);
  }
}
class Dog extends
Animal {
  constructor(name, age) {
    super(name);
    this.age = age;
  }
  bark() {
    console.log('wangwang');
  }
}
let dog = new Dog('dog', 2);
dog.say(); // dog
dog.bark(); // wangwang
```
这段代码中，我们使用extends关键字来实现了继承，这样我们就可以使用子类来继承父类的属性和方法，然后使用super关键字来调用父类的构造函数。

了解了类和类的用法，接下来我们来实现一个简单的Vue()类，来模拟Vue的实现。

## 实现一个简单的Vue类
在Vue中，我们可以使用new关键字来实例化一个Vue对象，然后使用它的属性和方法来实现数据的双向绑定。

```typecript
interface Options {
    el: string | HTMLElement
}

interface VueCls {
    options: Options
    init():void
}

interface VNode {
    tag: string
    text?: string
    children?: VNode[]
}

class Dom {
    createElement(el:string):HTMLElement {
        return document.createElement(el)
    }
    setText(el:HTMLElement, text:string | null) {
        el.textContent = text
    }
    render(vnode:VNode) {
        let root = this.createElement(vnode.tag)
        if(vnode.children && Array.isArray(vnode.children)) {
            vnode.children.forEach(child => {
                let childRoot = this.render(child)
                root.appendChild(childRoot)
            })
        }else {
            this.setText(root, vnode.text)
        }
        return root
    }
}

class Vue extends Dom implements VueCls{
    options: Options

    constructor(options:Options) {
        super()
        this.options = options
        this.init()
    }

    init() {
        let data:VNode = {
            tag: 'div',
            children: [
                {
                    tag: 'p',
                    text: 'hello'
                },
                {
                    tag: 'p',
                    text: 'world'
                }
            ]
        }
        let app = typeof this.options.el === 'string' ? document.querySelector(this.options.el) : this.options.el
        app.appendChild(this.render(data))
    }
}

new Vue({el: '#app'})
```

## private和public, protected
在es6中，class中的属性和方法默认是public的，我们可以使用private和protected关键字来实现私有属性和受保护的属性。

```javascript
class Animal {
  private name: string;
  protected age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  say() {
    console.log(this.name);
  }
}
class Dog extends
Animal {
  constructor(name: string, age: number) {
    super(name, age);
  }
  bark() {
    console.log('wangwang');
  }
}
let dog = new Dog('dog', 2);
dog.say(); // dog
dog.bark(); // wangwang
console.log(dog.name); // error
console.log(dog.age); // error
```
这段代码中，我们使用private和protected关键字来实现私有属性和受保护的属性，这样我们就可以使用子类来继承父类的属性和方法，然后使用super关键字来调用父类的构造函数。

## 抽象类
在es6中，class可以使用abstract关键字来实现抽象类，这样我们就可以使用抽象类来实现抽象方法。

```javascript
abstract class Animal {
  abstract say(): void;
}
class Dog extends
Animal {
  say() {
    console.log('wangwang');
  }
}
let dog = new Dog();
dog.say(); // wangwang
```
抽象类中的抽象方法不能有具体的实现，它只能在子类中实现，所以抽象类一般用于顶层设计。

抽象类中的方法可以有具体的实现，但是抽象类中的抽象方法不能有具体的实现。且由于抽象类无法被实例化，所以抽象类中方法哪怕有具体实现也只能在派生子类中能够使用。

## 总结
在es6中，class是一个语法糖，它的本质是函数，所以我们可以使用class来构建一个类，然后使用new关键字来实例化一个对象。class可以使用extends关键字来实现继承，这样我们就可以使用子类来继承父类的属性和方法。class中的属性和方法默认是public的，我们可以使用private和protected关键字来实现私有属性和受保护的属性。class可以使用abstract关键字来实现抽象类，这样我们就可以使用抽象类来实现抽象方法。
```