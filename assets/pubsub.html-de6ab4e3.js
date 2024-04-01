import{_ as n,V as s,W as a,a2 as t}from"./framework-82b537ca.js";const p={},e=t(`<h2 id="前端中的发布订阅模式" tabindex="-1"><a class="header-anchor" href="#前端中的发布订阅模式" aria-hidden="true">#</a> 前端中的发布订阅模式</h2><p>身为前端开发，我们接触订阅发布模式的场景是相当多的，比如<code>Vue</code>的<code>$emit</code>和<code>$on</code>，<code>React</code>的<code>Context</code>和<code>Redux</code>等等。这些都是发布订阅模式的应用。<br> 再者，抛去框架之外，我们非常常用的一个场景就是<code>addEventListener</code>和<code>dispatchEvent</code>，这两个方法就是发布订阅模式的应用。<br> 以addEventListener为例：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>document<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&#39;click&#39;</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;click&#39;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里我们给document对象添加了一个click事件的监听器，当document对象触发click事件时，就会执行这个监听器中的函数。<br> 这样子可能有些同学看不出来这是发布订阅模式，那么我们可以稍微改造一下：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>document<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&#39;abc&#39;</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;click&#39;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
document<span class="token punctuation">.</span><span class="token function">dispatchEvent</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Event</span><span class="token punctuation">(</span><span class="token string">&#39;abc&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这段代码可以分为几部分，首先是new Event(&#39;abc&#39;),就是一个事件中心；然后是addEventListener，就是订阅事件；最后是dispatchEvent，就是派发事件。</p><h2 id="发布订阅模式的实现" tabindex="-1"><a class="header-anchor" href="#发布订阅模式的实现" aria-hidden="true">#</a> 发布订阅模式的实现</h2><p>了解了发布订阅模式的应用场景，我们来看看发布订阅模式的实现。这里使用<code>TypeScript</code>来实现一个简单的发布订阅模式。<br> 首先我们要清楚，订阅发布模式的核心就是一个事件中心，我们可以通过这个事件中心来订阅事件和发布事件。所以这里我们先定义一个类型EmitterEvent，这个类型就是我们的事件中心。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">interface</span> <span class="token class-name">EmitterEvent</span> <span class="token punctuation">{</span>
    nvents<span class="token operator">:</span> Map<span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token punctuation">,</span> <span class="token builtin">Function</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">&gt;</span>
    <span class="token function-variable function">on</span><span class="token operator">:</span> <span class="token punctuation">(</span>event<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> fn<span class="token operator">:</span> <span class="token builtin">Function</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">void</span>
    <span class="token function-variable function">emit</span><span class="token operator">:</span> <span class="token punctuation">(</span>event<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> <span class="token operator">...</span>args<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">void</span>
    <span class="token function-variable function">off</span><span class="token operator">:</span> <span class="token punctuation">(</span>event<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> fn<span class="token operator">:</span> <span class="token builtin">Function</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">void</span>
    <span class="token function-variable function">once</span><span class="token operator">:</span> <span class="token punctuation">(</span>event<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> fn<span class="token operator">:</span> <span class="token builtin">Function</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">void</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样就得到了一个事件中心的类型，接下来我们就可以实现这个类型了。</p><p>首先初始化，events我们使用Map表示。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">class</span> <span class="token class-name">EventEmitter</span> <span class="token keyword">implements</span> <span class="token class-name">EmitterEvent</span> <span class="token punctuation">{</span>
    events<span class="token operator">:</span> Map<span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token punctuation">,</span> <span class="token builtin">Function</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">&gt;</span><span class="token punctuation">;</span>

    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>events <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来我们实现on方法，这个方法就是订阅事件。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token function">on</span><span class="token punctuation">(</span>event<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> fn<span class="token operator">:</span> <span class="token builtin">Function</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">//如果没有这个事件，就初始化一个，并且把fn放进去</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token keyword">this</span><span class="token punctuation">.</span>events<span class="token punctuation">.</span><span class="token function">has</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>events<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>event<span class="token punctuation">,</span> <span class="token punctuation">[</span>fn<span class="token punctuation">]</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token keyword">else</span> <span class="token punctuation">{</span>
     <span class="token comment">//如果已经有了这个事件，就把fn放进去</span>
        <span class="token comment">//this.events.get(event)?.push(fn)// or</span>
        <span class="token keyword">const</span> fns <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>events<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span>
        fns <span class="token operator">&amp;&amp;</span> fns<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>fn<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来我们实现emit方法，这个方法就是发布事件。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token function">emit</span><span class="token punctuation">(</span>event<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> <span class="token operator">...</span>args<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">//如果没有这个事件，就返回</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token keyword">this</span><span class="token punctuation">.</span>events<span class="token punctuation">.</span><span class="token function">has</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span>
    <span class="token punctuation">}</span>          
    <span class="token comment">//如果有这个事件，就执行这个事件</span>
    <span class="token keyword">const</span> fns <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>events<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span>
    fns <span class="token operator">&amp;&amp;</span> fns<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>fn <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token function">fn</span><span class="token punctuation">(</span><span class="token operator">...</span>args<span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来我们实现off方法，这个方法就是取消订阅事件。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token function">off</span><span class="token punctuation">(</span>event<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> fn<span class="token operator">:</span> <span class="token builtin">Function</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">//如果没有这个事件，就返回</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token keyword">this</span><span class="token punctuation">.</span>events<span class="token punctuation">.</span><span class="token function">has</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span>
    <span class="token punctuation">}</span>
    <span class="token comment">//如果有这个事件，就把fn过滤掉</span>
    <span class="token keyword">const</span> fns <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>events<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span>
    fns <span class="token operator">&amp;&amp;</span> <span class="token keyword">this</span><span class="token punctuation">.</span>events<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>event<span class="token punctuation">,</span> fns<span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span>f <span class="token operator">=&gt;</span> f <span class="token operator">!==</span> fn<span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后我们实现once方法，这个方法就是一次性订阅事件。思路也很简单，就是订阅事件，执行一次后就取消订阅。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token function">once</span><span class="token punctuation">(</span>event<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> fn<span class="token operator">:</span> <span class="token builtin">Function</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> <span class="token function-variable function">onceFn</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token operator">...</span>args<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token function">fn</span><span class="token punctuation">(</span><span class="token operator">...</span>args<span class="token punctuation">)</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">off</span><span class="token punctuation">(</span>event<span class="token punctuation">,</span> onceFn<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span>event<span class="token punctuation">,</span> onceFn<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样我们就实现了一个简单的发布订阅模式。</p><h2 id="代码" tabindex="-1"><a class="header-anchor" href="#代码" aria-hidden="true">#</a> 代码</h2><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">interface</span> <span class="token class-name">EmitterEvent</span> <span class="token punctuation">{</span>
    events<span class="token operator">:</span> Map<span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token punctuation">,</span> <span class="token builtin">Function</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">&gt;</span>
    <span class="token function-variable function">on</span><span class="token operator">:</span> <span class="token punctuation">(</span>event<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> fn<span class="token operator">:</span> <span class="token builtin">Function</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">void</span>
    <span class="token function-variable function">emit</span><span class="token operator">:</span> <span class="token punctuation">(</span>event<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> <span class="token operator">...</span>args<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">void</span>
    <span class="token function-variable function">off</span><span class="token operator">:</span> <span class="token punctuation">(</span>event<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> fn<span class="token operator">:</span> <span class="token builtin">Function</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">void</span>
    <span class="token function-variable function">once</span><span class="token operator">:</span> <span class="token punctuation">(</span>event<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> fn<span class="token operator">:</span> <span class="token builtin">Function</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">void</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">EventEmitter</span> <span class="token keyword">implements</span> <span class="token class-name">EmitterEvent</span> <span class="token punctuation">{</span>
    events<span class="token operator">:</span> Map<span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token punctuation">,</span> <span class="token builtin">Function</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">&gt;</span><span class="token punctuation">;</span>

    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>events <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token function">on</span><span class="token punctuation">(</span>event<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> fn<span class="token operator">:</span> <span class="token builtin">Function</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token keyword">this</span><span class="token punctuation">.</span>events<span class="token punctuation">.</span><span class="token function">has</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>events<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>event<span class="token punctuation">,</span> <span class="token punctuation">[</span>fn<span class="token punctuation">]</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span><span class="token keyword">else</span> <span class="token punctuation">{</span>
            <span class="token keyword">const</span> fns <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>events<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span>
            fns <span class="token operator">&amp;&amp;</span> fns<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>fn<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token function">emit</span><span class="token punctuation">(</span>event<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> <span class="token operator">...</span>args<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token keyword">this</span><span class="token punctuation">.</span>events<span class="token punctuation">.</span><span class="token function">has</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span>
        <span class="token punctuation">}</span>          
        <span class="token keyword">const</span> fns <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>events<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span>
        fns <span class="token operator">&amp;&amp;</span> fns<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>fn <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
            <span class="token function">fn</span><span class="token punctuation">(</span><span class="token operator">...</span>args<span class="token punctuation">)</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token function">off</span><span class="token punctuation">(</span>event<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> fn<span class="token operator">:</span> <span class="token builtin">Function</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token keyword">this</span><span class="token punctuation">.</span>events<span class="token punctuation">.</span><span class="token function">has</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">const</span> fns <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>events<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span>
        fns <span class="token operator">&amp;&amp;</span> <span class="token keyword">this</span><span class="token punctuation">.</span>events<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>event<span class="token punctuation">,</span> fns<span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span>f <span class="token operator">=&gt;</span> f <span class="token operator">!==</span> fn<span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token function">once</span><span class="token punctuation">(</span>event<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> fn<span class="token operator">:</span> <span class="token builtin">Function</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> <span class="token function-variable function">onceFn</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token operator">...</span>args<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
            <span class="token function">fn</span><span class="token punctuation">(</span><span class="token operator">...</span>args<span class="token punctuation">)</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">off</span><span class="token punctuation">(</span>event<span class="token punctuation">,</span> onceFn<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span>event<span class="token punctuation">,</span> onceFn<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,23),o=[e];function c(i,l){return s(),a("div",null,o)}const k=n(p,[["render",c],["__file","pubsub.html.vue"]]);export{k as default};
