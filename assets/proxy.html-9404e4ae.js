import{_ as t,V as e,W as o,Y as s,Z as n,a0 as c,a2 as a,F as l}from"./framework-82b537ca.js";const i={},u=a(`<h2 id="object-defineproperty" tabindex="-1"><a class="header-anchor" href="#object-defineproperty" aria-hidden="true">#</a> Object.defineProperty</h2><p>在vue3出世后，总会遇到一个新的面试题:说一些vue2与vue3的区别。作为一个前端开发，最先想到的当然就是响应式的更改，</p><h3 id="基础原理" tabindex="-1"><a class="header-anchor" href="#基础原理" aria-hidden="true">#</a> 基础原理</h3><p>在vue2中，我们通过Object.defineProperty来实现数据的响应式：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> obj <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">name</span><span class="token operator">:</span><span class="token string">&#39;luolj&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">age</span><span class="token operator">:</span><span class="token number">18</span>
<span class="token punctuation">}</span>

Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span><span class="token string">&#39;name&#39;</span><span class="token punctuation">,</span><span class="token punctuation">{</span>
    <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token string">&#39;帅比&#39;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">set</span><span class="token punctuation">(</span>newValue<span class="token punctuation">)</span><span class="token punctuation">{</span>
        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;名称已经被修改为：&#39;</span><span class="token operator">+</span>newValue<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>obj<span class="token punctuation">.</span>name<span class="token punctuation">)</span>
obj<span class="token punctuation">.</span>name <span class="token operator">=</span> <span class="token string">&#39;luolj2&#39;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>obj<span class="token punctuation">.</span>name<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的代码执行后会输出</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>帅比
名称已经被修改为：luolj2
帅比
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>诶，是不是很奇怪，明明已经修改了name属性，但是再次获得name属性时，却没有变化。这是因为Object.defineProperty只能监听对象的属性，而不能监听对象本身。 我们的get函数总是返回一个固定值，因为在attributes中无法使用this，如果使用obj.name的话，会造成递归调用以至内存泄露。</p><p>怎么解决这个问题呢？其实也相当简单，我们可以在外部添加一个提前定义好的量，比如这样：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> obj <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">name</span><span class="token operator">:</span><span class="token string">&#39;luolj&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">age</span><span class="token operator">:</span><span class="token number">18</span>
<span class="token punctuation">}</span>

<span class="token keyword">let</span> proxyName <span class="token operator">=</span> obj<span class="token punctuation">.</span>name

Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span><span class="token string">&#39;name&#39;</span><span class="token punctuation">,</span><span class="token punctuation">{</span>
    <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> proxyName
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">set</span><span class="token punctuation">(</span>newValue<span class="token punctuation">)</span><span class="token punctuation">{</span>
        proxyName <span class="token operator">=</span> newValue
        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;名称已经被修改为：&#39;</span><span class="token operator">+</span>newValue<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>obj<span class="token punctuation">.</span>name<span class="token punctuation">)</span>
obj<span class="token punctuation">.</span>name <span class="token operator">=</span> <span class="token string">&#39;luolj2&#39;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>obj<span class="token punctuation">.</span>name<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这段代码现在就能够正确输出了</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>luolj
名称已经被修改为：luolj2
luolj2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="vue2中是怎么使用的呢" tabindex="-1"><a class="header-anchor" href="#vue2中是怎么使用的呢" aria-hidden="true">#</a> vue2中是怎么使用的呢</h3><p>我们都知道，在vue2中定义响应式变量，需要在data中定义，然后在vue实例中使用，如下：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> vm <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token function">data</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">name</span><span class="token operator">:</span><span class="token string">&#39;luolj&#39;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">age</span><span class="token operator">:</span><span class="token number">18</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从源码来看</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">initState</span> <span class="token punctuation">(</span><span class="token parameter">vm</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    vm<span class="token punctuation">.</span>_watchers <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">var</span> opts <span class="token operator">=</span> vm<span class="token punctuation">.</span>$options<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>opts<span class="token punctuation">.</span>props<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token function">initProps</span><span class="token punctuation">(</span>vm<span class="token punctuation">,</span> opts<span class="token punctuation">.</span>props<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>opts<span class="token punctuation">.</span>methods<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token function">initMethods</span><span class="token punctuation">(</span>vm<span class="token punctuation">,</span> opts<span class="token punctuation">.</span>methods<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>opts<span class="token punctuation">.</span>data<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">initData</span><span class="token punctuation">(</span>vm<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token function">observe</span><span class="token punctuation">(</span>vm<span class="token punctuation">.</span>_data <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token boolean">true</span> <span class="token comment">/* asRootData */</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>opts<span class="token punctuation">.</span>computed<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token function">initComputed</span><span class="token punctuation">(</span>vm<span class="token punctuation">,</span> opts<span class="token punctuation">.</span>computed<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>opts<span class="token punctuation">.</span>watch <span class="token operator">&amp;&amp;</span> opts<span class="token punctuation">.</span>watch <span class="token operator">!==</span> nativeWatch<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">initWatch</span><span class="token punctuation">(</span>vm<span class="token punctuation">,</span> opts<span class="token punctuation">.</span>watch<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>走马观花的看一下，initData函数中，vue2新定义了的一个新的_data用来初始化数据，然后通过observe函数来监听这个_data对象，这个observe函数是vue2中的一个重要函数，用来监听对象的变化。</p>`,18),r={href:"http://xn--vue2this-od0mo5ds66btogm0i8sm4kk1ofw7jo54al33jyu5a.name",target:"_blank",rel:"noopener noreferrer"},k=a(`<h2 id="proxy" tabindex="-1"><a class="header-anchor" href="#proxy" aria-hidden="true">#</a> Proxy</h2><p>在ES6中，我们有了一个新的代理模式Proxy，它可以监听对象本身，接下来我们来说一下怎么用，为什么用它。</p><h3 id="proxy的基本使用" tabindex="-1"><a class="header-anchor" href="#proxy的基本使用" aria-hidden="true">#</a> Proxy的基本使用</h3><p>先给出一段示例</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">let</span> obj <span class="token operator">=</span> <span class="token punctuation">{</span>
    name<span class="token operator">:</span><span class="token string">&#39;luolj&#39;</span><span class="token punctuation">,</span>
    age<span class="token operator">:</span><span class="token number">18</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> proxy <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Proxy</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span><span class="token punctuation">{</span>
    <span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span>key<span class="token punctuation">,</span>receiver<span class="token punctuation">)</span><span class="token punctuation">{</span> <span class="token comment">//receiver是proxy实例</span>
        <span class="token keyword">return</span> Reflect<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span>key<span class="token punctuation">,</span>receiver<span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">set</span><span class="token punctuation">(</span>target<span class="token operator">:</span> <span class="token punctuation">{</span> name<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span> age<span class="token operator">:</span> <span class="token builtin">number</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> p<span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token builtin">symbol</span><span class="token punctuation">,</span> newValue<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">,</span> receiver<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">boolean</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> Reflect<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span>p<span class="token punctuation">,</span>newValue<span class="token punctuation">,</span>receiver<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container info"><p class="hint-container-title">js小知识</p><p>Reflect是一个内置的对象，它提供拦截JavaScript操作的方法。这些方法与proxy handler方法相对应。Reflect不是一个函数对象，因此它是不可构造的。</p><p>在一些高级语言中，反射是指程序可以访问、检测和修改它本身状态或行为的一种能力。在JavaScript中，Reflect对象的设计目的是反映（reflect）ECMAScript语义的底层操作。</p><p>由于其接收一个receiver参数，能够在native code层面保证上下文的完整性，所以一般Proxy操作的拦截都会使用Reflect来进行。</p></div><p>如上面的代码所示，大家应该能够看出与Object.defineProperty的区别。</p><p>当然，Proxy还有很多其他的方法，比如apply、has、deleteProperty等，大家可以自行查看文档。</p><h3 id="为什么使用proxy" tabindex="-1"><a class="header-anchor" href="#为什么使用proxy" aria-hidden="true">#</a> 为什么使用Proxy</h3><p>Proxy可以监听对象本身，而Object.defineProperty只能监听对象的属性。<br> (面试题:为什么属性更新无法重绘视图)<br> 以上面的例子来说，假设我需要在obj执行 obj.like = &#39;sw&#39;，第一个例子就无法再次拦截到这个属性的变化，因为Object.defineProperty只能监听对象的属性，而不能监听对象本身。</p><p>数组变异 $set $delete $add</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token function">data</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">arr</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">this</span><span class="token punctuation">.</span>arr<span class="token punctuation">[</span><span class="token number">3</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">4</span> <span class="token comment">// 无法监听到 </span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>事实上，这个问题并不是由于Object.defineProperty的问题，而是由于尤大在性能方面的考量放弃了，以下有段代码可以证明这个问题</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">defineReactive</span><span class="token punctuation">(</span><span class="token parameter">data<span class="token punctuation">,</span> key<span class="token punctuation">,</span> val</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span> key<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">enumerable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token literal-property property">configurable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
      <span class="token function-variable function">get</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token function">defineGet</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">get key: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> val: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>val<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> val<span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token function-variable function">set</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token function">defineSet</span><span class="token punctuation">(</span><span class="token parameter">newVal</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">set key: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> val: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>newVal<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        val <span class="token operator">=</span> newVal<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">observe</span><span class="token punctuation">(</span><span class="token parameter">data</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  Object<span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">defineReactive</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span> key<span class="token punctuation">,</span> data<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">let</span> test <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

<span class="token function">observe</span><span class="token punctuation">(</span>test<span class="token punctuation">)</span><span class="token punctuation">;</span>

test<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">4</span> <span class="token comment">// set key: 0 val: 4</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>于是就有了一系列的$方法来解决这个问题，但是这个方法并不是很优雅，而Proxy就可以很好的解决这个问题。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> obj <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">name</span><span class="token operator">:</span><span class="token string">&#39;luolj&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">age</span><span class="token operator">:</span><span class="token number">18</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> proxy <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Proxy</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span><span class="token punctuation">{</span>
    <span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span>key<span class="token punctuation">,</span>receiver<span class="token punctuation">)</span><span class="token punctuation">{</span> <span class="token comment">//receiver是proxy实例</span>
        <span class="token keyword">return</span> Reflect<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span>key<span class="token punctuation">,</span>receiver<span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">set</span><span class="token punctuation">(</span>target<span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token literal-property property">name</span><span class="token operator">:</span> string<span class="token punctuation">;</span> age<span class="token operator">:</span> number <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token literal-property property">p</span><span class="token operator">:</span> string <span class="token operator">|</span> symbol<span class="token punctuation">,</span> <span class="token literal-property property">newValue</span><span class="token operator">:</span> any<span class="token punctuation">,</span> <span class="token literal-property property">receiver</span><span class="token operator">:</span> any<span class="token punctuation">)</span><span class="token operator">:</span> boolean <span class="token punctuation">{</span>
        <span class="token keyword">return</span> Reflect<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span>p<span class="token punctuation">,</span>newValue<span class="token punctuation">,</span>receiver<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
obj<span class="token punctuation">.</span>name <span class="token operator">=</span> <span class="token string">&#39;luo&#39;</span>
proxy<span class="token punctuation">.</span>name <span class="token operator">=</span> <span class="token string">&#39;luo2&#39;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>obj<span class="token punctuation">.</span>name<span class="token punctuation">)</span> <span class="token comment">// luo2</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>proxy<span class="token punctuation">.</span>name<span class="token punctuation">)</span> <span class="token comment">// luo2</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>无论是修改原始对象obj还是修改代理对象proxy，都能够触发proxy的set方法，这就是Proxy的优势所在。</p><h3 id="弊端" tabindex="-1"><a class="header-anchor" href="#弊端" aria-hidden="true">#</a> 弊端</h3><p>proxy只能接收一个 extends object类型的对象，所以对于数组、Map、Set等类型的对象，我们需要自己进行处理，这就是Proxy的一个弊端。<br> 比如数组：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> arr <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span>

<span class="token keyword">const</span> <span class="token function-variable function">createProxy</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">obj</span><span class="token operator">:</span> any</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">Object</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span> <span class="token operator">===</span> <span class="token string">&#39;[object Object]&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Proxy</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token keyword">let</span> Obj <span class="token operator">=</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">value</span><span class="token operator">:</span> obj
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Proxy</span><span class="token punctuation">(</span>Obj<span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">let</span> newArr <span class="token operator">=</span> <span class="token function">createProxy</span><span class="token punctuation">(</span>arr<span class="token punctuation">)</span>
arr<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token number">4</span><span class="token punctuation">)</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>newArr<span class="token punctuation">)</span> <span class="token comment">// [1, 2, 3, 4]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>vue内部呢对于非object类型的数据，会进行特殊处理，比如数组，这样就能够监听到数组的变化。</p><p>下一次我们来说一下vue3中的响应式，副作用函数effect，trigger等源码实现。</p>`,22);function d(v,m){const p=l("ExternalLinkIcon");return e(),o("div",null,[u,s("p",null,[n("接下来的代码我就不一一介绍了，大家可以自行查看vue2的源码。从initData函数中，我们可以知道一点，"),s("a",r,[n("当我们在vue2中对数据进行比如this.name"),c(p)]),n(" = xxx操作时，实际上是在对_data对象进行操作，然后通过Object.defineProperty来监听这个_data对象的变化。")]),k])}const y=t(i,[["render",d],["__file","proxy.html.vue"]]);export{y as default};
