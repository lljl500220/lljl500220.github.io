import{_ as n,V as s,W as a,X as t,Y as p,a2 as e}from"./framework-82b537ca.js";const c={},o=p("p",null,"js中Array类型相关方法和常见用法总结",-1),l=e(`<h2 id="描述" tabindex="-1"><a class="header-anchor" href="#描述" aria-hidden="true">#</a> 描述</h2><ol><li>在js中，数组不是一个基本类型，它是具有多个明显特征的对象，所以typeof []的结果是object。</li><li>数组的大小是可以动态调整的，并且可以存入不同类型的数据或者对象，但是在ts中，必须将数组类型设置为any才可以这样操作。</li><li>js的数组必须从0开始进行下标索引，无法像其它高级语言一样以任意字符串进行索引。</li><li>js、ts中的数组，复制操作均为浅拷贝。（所有 JavaScript 对象的标准内置复制操作都会创建浅拷贝，而不是深拷贝）</li></ol><h2 id="length" tabindex="-1"><a class="header-anchor" href="#length" aria-hidden="true">#</a> length</h2><p>与string的长度不一样的是，array的length是可以写入的，当写入一个比原先长度更长的length时，多出的数组位置将被undefined填充， 减少时将会从尾部顺序删除。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">let</span> arrTest <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">,</span><span class="token number">3</span><span class="token punctuation">,</span><span class="token number">4</span><span class="token punctuation">]</span>
arrTest<span class="token punctuation">.</span>length <span class="token operator">=</span> <span class="token number">5</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>arrTest<span class="token punctuation">[</span><span class="token number">4</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token comment">//undefined</span>
arrTest<span class="token punctuation">.</span>length <span class="token operator">=</span> <span class="token number">2</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>arrTest<span class="token punctuation">)</span> <span class="token comment">//[1,2]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="array类的静态方法" tabindex="-1"><a class="header-anchor" href="#array类的静态方法" aria-hidden="true">#</a> Array类的静态方法</h2><ol><li>Array.from() 从一个类数组对象中创建数组实例。常用于数组去重之类的操作，以下是一个去重的例子：<div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">let</span> arrTest <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">,</span><span class="token number">3</span><span class="token punctuation">,</span><span class="token number">4</span><span class="token punctuation">]</span>
<span class="token keyword">let</span> arr2 <span class="token operator">=</span> <span class="token builtin">Array</span><span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Set</span><span class="token punctuation">(</span>arrTest<span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>arr2<span class="token punctuation">)</span> <span class="token comment">//[1,2,3,4]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>上面例子中使用了Set类，是es6中新加入的数据类型<div class="hint-container info"><p class="hint-container-title">Array与Set的区别</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">let</span> arrTest <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">,</span><span class="token number">3</span><span class="token punctuation">,</span><span class="token number">4</span><span class="token punctuation">]</span>
<span class="token comment">//去重</span>
<span class="token keyword">let</span> arr2 <span class="token operator">=</span> <span class="token builtin">Array</span><span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Set</span><span class="token punctuation">(</span>arrTest<span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>arr2<span class="token punctuation">)</span>
<span class="token comment">//删除</span>
arrTest<span class="token punctuation">.</span><span class="token function">splice</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">)</span>
<span class="token keyword">let</span> set <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Set</span><span class="token punctuation">(</span>arrTest<span class="token punctuation">)</span>
set<span class="token punctuation">.</span><span class="token function">delete</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
<span class="token comment">//添加</span>
arrTest<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span>
arrTest<span class="token punctuation">.</span><span class="token function">unshift</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span>
arrTest<span class="token punctuation">.</span><span class="token function">splice</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">0</span><span class="token punctuation">,</span><span class="token number">1</span><span class="token punctuation">)</span>
set<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token number">6</span><span class="token punctuation">)</span>
<span class="token comment">//清空</span>
arrTest<span class="token punctuation">.</span>length <span class="token operator">=</span> <span class="token number">0</span>
set<span class="token punctuation">.</span><span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token comment">//判断元素是否存在</span>
arrTest<span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">&gt;</span> <span class="token operator">-</span><span class="token number">1</span>
arrTest<span class="token punctuation">.</span><span class="token function">includes</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
set<span class="token punctuation">.</span><span class="token function">has</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></li><li>Array.isArray() 判断是否为array类型<div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code> <span class="token keyword">let</span> arrTest <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">,</span><span class="token number">3</span><span class="token punctuation">,</span><span class="token number">4</span><span class="token punctuation">]</span>
 <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token builtin">Array</span><span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>arrTest<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">//true</span>
 <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token builtin">Array</span><span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Set</span><span class="token punctuation">(</span>arrTest<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">//false</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li>Array.of()</li></ol>`,7);function u(i,r){return s(),a("div",null,[o,t(" more "),l])}const d=n(c,[["render",u],["__file","arrayFunction.html.vue"]]);export{d as default};