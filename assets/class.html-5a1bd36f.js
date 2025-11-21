import{$ as n,O as s,P as a,W as e}from"./framework-210236c4.js";const t={},p=e(`<h2 id="class的基本使用" tabindex="-1"><a class="header-anchor" href="#class的基本使用" aria-hidden="true">#</a> class的基本使用</h2><p>在es6中，class是一个语法糖，它的本质是函数，所以我们可以使用class来构建一个类，然后使用new关键字来实例化一个对象。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">Animal</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">name</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">say</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token keyword">let</span> animal <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Animal</span><span class="token punctuation">(</span><span class="token string">&#39;dog&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
animal<span class="token punctuation">.</span><span class="token function">say</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// dog</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这段代码中，我们使用class关键字来构建了一个Animal类，然后使用new关键字来实例化了一个对象，这个对象有一个name属性和一个say方法。 class既然是一个语法糖，那么它的本质是什么呢？我们可以使用typeof关键字来查看它的类型。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">typeof</span> Animal<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// function</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>我们可以看到，class的本质是一个函数，所以我们可以使用函数的方式来构建一个类。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">Animal</span><span class="token punctuation">(</span><span class="token parameter">name</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token class-name">Animal</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">say</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">let</span> animal <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Animal</span><span class="token punctuation">(</span><span class="token string">&#39;dog&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
animal<span class="token punctuation">.</span><span class="token function">say</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// dog</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这两段代码是等价的，我们可以看到，class的本质是一个函数，它的构造函数是constructor，它的原型是prototype。</p><h2 id="class的继承" tabindex="-1"><a class="header-anchor" href="#class的继承" aria-hidden="true">#</a> class的继承</h2><p>在es6中，class可以使用extends关键字来实现继承，这样我们就可以使用子类来继承父类的属性和方法。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">Animal</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">name</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">say</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token keyword">class</span> <span class="token class-name">Dog</span> <span class="token keyword">extends</span>
<span class="token class-name">Animal</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> age</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">super</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>age <span class="token operator">=</span> age<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">bark</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;wangwang&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token keyword">let</span> dog <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Dog</span><span class="token punctuation">(</span><span class="token string">&#39;dog&#39;</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
dog<span class="token punctuation">.</span><span class="token function">say</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// dog</span>
dog<span class="token punctuation">.</span><span class="token function">bark</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// wangwang</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这段代码中，我们使用extends关键字来实现了继承，这样我们就可以使用子类来继承父类的属性和方法，然后使用super关键字来调用父类的构造函数。</p><p>了解了类和类的用法，接下来我们来实现一个简单的Vue()类，来模拟Vue的实现。</p><h2 id="实现一个简单的vue类" tabindex="-1"><a class="header-anchor" href="#实现一个简单的vue类" aria-hidden="true">#</a> 实现一个简单的Vue类</h2><p>在Vue中，我们可以使用new关键字来实例化一个Vue对象，然后使用它的属性和方法来实现数据的双向绑定。</p><div class="language-typecript line-numbers-mode" data-ext="typecript"><pre class="language-typecript"><code>interface Options {
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
        if(vnode.children &amp;&amp; Array.isArray(vnode.children)) {
            vnode.children.forEach(child =&gt; {
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
            tag: &#39;div&#39;,
            children: [
                {
                    tag: &#39;p&#39;,
                    text: &#39;hello&#39;
                },
                {
                    tag: &#39;p&#39;,
                    text: &#39;world&#39;
                }
            ]
        }
        let app = typeof this.options.el === &#39;string&#39; ? document.querySelector(this.options.el) : this.options.el
        app.appendChild(this.render(data))
    }
}

new Vue({el: &#39;#app&#39;})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="private和public-protected" tabindex="-1"><a class="header-anchor" href="#private和public-protected" aria-hidden="true">#</a> private和public, protected</h2><p>在es6中，class中的属性和方法默认是public的，我们可以使用private和protected关键字来实现私有属性和受保护的属性。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">Animal</span> <span class="token punctuation">{</span>
  <span class="token keyword">private</span> <span class="token literal-property property">name</span><span class="token operator">:</span> string<span class="token punctuation">;</span>
  <span class="token keyword">protected</span> <span class="token literal-property property">age</span><span class="token operator">:</span> number<span class="token punctuation">;</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">name</span><span class="token operator">:</span> string<span class="token punctuation">,</span> <span class="token literal-property property">age</span><span class="token operator">:</span> number</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>age <span class="token operator">=</span> age<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">say</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token keyword">class</span> <span class="token class-name">Dog</span> <span class="token keyword">extends</span>
<span class="token class-name">Animal</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">name</span><span class="token operator">:</span> string<span class="token punctuation">,</span> <span class="token literal-property property">age</span><span class="token operator">:</span> number</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">super</span><span class="token punctuation">(</span>name<span class="token punctuation">,</span> age<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">bark</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;wangwang&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token keyword">let</span> dog <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Dog</span><span class="token punctuation">(</span><span class="token string">&#39;dog&#39;</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
dog<span class="token punctuation">.</span><span class="token function">say</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// dog</span>
dog<span class="token punctuation">.</span><span class="token function">bark</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// wangwang</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>dog<span class="token punctuation">.</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// error</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>dog<span class="token punctuation">.</span>age<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// error</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这段代码中，我们使用private和protected关键字来实现私有属性和受保护的属性，这样我们就可以使用子类来继承父类的属性和方法，然后使用super关键字来调用父类的构造函数。</p><h2 id="抽象类" tabindex="-1"><a class="header-anchor" href="#抽象类" aria-hidden="true">#</a> 抽象类</h2><p>在es6中，class可以使用abstract关键字来实现抽象类，这样我们就可以使用抽象类来实现抽象方法。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>abstract <span class="token keyword">class</span> <span class="token class-name">Animal</span> <span class="token punctuation">{</span>
  abstract <span class="token function">say</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">class</span> <span class="token class-name">Dog</span> <span class="token keyword">extends</span>
<span class="token class-name">Animal</span> <span class="token punctuation">{</span>
  <span class="token function">say</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;wangwang&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token keyword">let</span> dog <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Dog</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
dog<span class="token punctuation">.</span><span class="token function">say</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// wangwang</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>抽象类中的抽象方法不能有具体的实现，它只能在子类中实现，所以抽象类一般用于顶层设计。</p><p>抽象类中的方法可以有具体的实现，但是抽象类中的抽象方法不能有具体的实现。且由于抽象类无法被实例化，所以抽象类中方法哪怕有具体实现也只能在派生子类中能够使用。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h2><p>在es6中，class是一个语法糖，它的本质是函数，所以我们可以使用class来构建一个类，然后使用new关键字来实例化一个对象。class可以使用extends关键字来实现继承，这样我们就可以使用子类来继承父类的属性和方法。class中的属性和方法默认是public的，我们可以使用private和protected关键字来实现私有属性和受保护的属性。class可以使用abstract关键字来实现抽象类，这样我们就可以使用抽象类来实现抽象方法。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code></code></pre><div class="line-numbers" aria-hidden="true"></div></div>`,28),c=[p];function i(o,l){return s(),a("div",null,c)}const d=n(t,[["render",i],["__file","class.html.vue"]]);export{d as default};
