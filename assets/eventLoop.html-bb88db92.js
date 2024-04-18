import{_ as n,V as s,W as a,X as t,Y as e,a2 as p}from"./framework-82b537ca.js";const o="/learn/浏览器任务管理器.png",c="/learn/eventLoop-1.png",i="/learn/eventLoopCode.png",l="/learn/eventLoop-2.png",u={},r=e("p",null,"有关事件循环的重新学习和一些新的理解",-1),d=p('<h2 id="浏览器的进程模型" tabindex="-1"><a class="header-anchor" href="#浏览器的进程模型" aria-hidden="true">#</a> 浏览器的进程模型</h2><h3 id="进程" tabindex="-1"><a class="header-anchor" href="#进程" aria-hidden="true">#</a> 进程</h3><p>众所周知，程序运行都需要开辟一块内存空间，分配至少一个进程，浏览器也不例外。一般来说，浏览器为了完成复杂的任务，会开辟多个进程：</p><ol><li><strong>浏览器进程</strong> 主要负责界⾯显示、⽤户交互、⼦进程管理等。浏览器进程内部会启动多个线程处理不同的任务。</li><li><strong>网络进程</strong> 负责加载⽹络资源。⽹络进程内部会启动多个线程来处理不同的⽹络任务。</li><li><strong>渲染进程</strong> 在渲染进程中，会优先开辟一个渲染主线程，该线程用于执行我们熟知的HTML,CSS,JS代码等。默认情况下，浏览器会为每一个tab页面开辟一个新的渲染进程。 我们接下来主要分析渲染进程中的内容。</li></ol><div style="text-align:center;"><figure><img src="'+o+'" alt="浏览器任务管理器" width="400" height="400" tabindex="0" loading="lazy"><figcaption>浏览器任务管理器</figcaption></figure></div><h3 id="线程" tabindex="-1"><a class="header-anchor" href="#线程" aria-hidden="true">#</a> 线程</h3><p>我们可以把一个进程看作是一个工厂，一个线程是一个工人，一个进程中至少会存在一个主线程，该线程结束则意味着进程也结束了， 浏览器也是基于这样的基本结构的。在渲染进程中，一般主线程为<strong>渲染主线程</strong>，该线程执行了非常多的任务，比如：</p><ul><li>解析html代码</li><li>解析css</li><li>计算样式</li><li>计算布局</li><li>处理图像</li><li>执行全局的js代码</li><li>执行事件处理的函数</li><li>执行计时器的函数</li><li>...等</li></ul><p>为了解决这些问题，浏览器安排了一个模型来完成各种任务之间的调度-排队，也就是我们常说的EventLoop，在浏览器的实现中一般被称为MessageQueue。</p><figure><img src="'+c+`" alt="事件循环基本解释" width="600" height="400" tabindex="0" loading="lazy"><figcaption>事件循环基本解释</figcaption></figure><p>事件循环做了几件事：</p><ol><li>类似一个java中的main方法，渲染主线程中存在一个run方法，run方法开启了一个无限循环，类似如下：<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> messageQueue <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
 <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token punctuation">;</span><span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
<span class="token comment">//每次在这个循环中，将从各种队列中取出一个存在的任务，比如微队列、延时队列、交互队列等</span>
<span class="token comment">//根据w3c的最新标准，浏览器必须实现的队列仅存在微队列，其它的队列一般来说由浏览器决定是否实现</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li>当任务队列中存在一个任务时，将其按照先进先出的顺序，取出并放入到主线程执行。</li><li>如果当前所有的任务队列中都没有任务，则取出任务的动作将陷入沉睡，直到任务队列中新增了一个任务，从任务队列中重新唤醒该动作。</li><li>向任务队列中添加任务这个动作是任何时候都能够开启的，包括其它进程的线程也可以向本线程添加任务，比如浏览器进程监听的用户操作，点击，滚动等。</li></ol><figure><img src="`+i+`" alt="事件循环源代码" width="300" height="400" tabindex="0" loading="lazy"><figcaption>事件循环源代码</figcaption></figure><h2 id="其它相关概念" tabindex="-1"><a class="header-anchor" href="#其它相关概念" aria-hidden="true">#</a> 其它相关概念</h2><h3 id="浏览器的异步任务" tabindex="-1"><a class="header-anchor" href="#浏览器的异步任务" aria-hidden="true">#</a> 浏览器的异步任务</h3><p>浏览器在执行过程中，会遇到的一些无法立即处理的任务，浏览器无法立即执行，也无法持续等待，所以采取了异步的方式，将其回调延迟执行。</p><ul><li>定时任务 <code>setTimeout</code> <code>setInterval</code> 这类型的任务会被渲染主线程置入os模块，调用系统计时器，系统计时器完成计时后，就可以将回调函数置入到延时队列等待执行。</li><li>网络任务 <code>xhr</code> <code>fetch</code> <code>ajax</code> 这类型的任务通常会以promise.resolve或者promise.reject的方式返回，他们自己的线程将回调函数置入到微队列，在主线程任务完成之后优先执行该回调函数。</li><li>交互任务 <code>addEventListener</code> 通常，交互任务会被浏览器置为优先级仅次于微任务队列的队列中。</li></ul><p>接下来看一些实际的例子，来帮助理解异步和线程之间的关系，我们从简单到难：</p><ol><li>单纯的主线程任务，即初始的js代码<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">fun1</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span>
<span class="token function">fun1</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token comment">//out 2 1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>这段代码应该是最简单的，不需要任何的解释，它输出了 2 1</li><li>主线程任务中含有延时任务<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">log</span><span class="token punctuation">(</span><span class="token parameter">val</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">log</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">log</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token function">log</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span>
<span class="token comment">//out 3 1 sleep 1s 2</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>上述代码，稍有编码经验的应该都没问题，执行顺序是3 1 2，虽然确实很简单，但是这里我想借助这个代码分析一下上述的线程问题： 首先我们可以确定的是，这段代码中总共需要一个延时队列，一个渲染主线程，那么分析结果就如下图：</li></ol><figure><img src="`+l+`" alt="事件循环分析" tabindex="0" loading="lazy"><figcaption>事件循环分析</figcaption></figure><ol start="3"><li>主线程任务中有promise或者MutationObserver或者queueMicrotask<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>  <span class="token keyword">function</span> <span class="token function">log</span><span class="token punctuation">(</span><span class="token parameter">val</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  
  <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">log</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  
  <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">log</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  
  <span class="token keyword">let</span> promise <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token parameter">resolve</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;init promise&#39;</span><span class="token punctuation">)</span>
  <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span>
  <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">&#39;promise resolve&#39;</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">999</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
  
  promise<span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">res</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
  
  <span class="token function">log</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span>

<span class="token comment">//out 3 1 sleep 999ms promis resolve 1ms 2</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><p>在这段代码中，我们加入了一个promise，它将一个settimeout塞到了微任务中，这个微任务又将回调函数塞到了延时队列中。如果等待时间不是999而是1000，那么执行结果将是 3 1 2 promise resolve</p><div class="hint-container tip"><p class="hint-container-title">注意</p><p>请注意，这段代码有部分人拿到编辑器或者node环境下执行可能会有不同的结果，因为node环境是使用多线程执行的js代码，而浏览器则是使用单线程，在处理上有些许差异！</p></div><h3 id="js为什么有时候会阻塞页面渲染" tabindex="-1"><a class="header-anchor" href="#js为什么有时候会阻塞页面渲染" aria-hidden="true">#</a> js为什么有时候会阻塞页面渲染</h3><p>在开发过程中，我总会发现有些很奇怪的代码，明明点击了一个按钮或者是改变了一个文本，但是要隔很久才出现效果，不知道其它小伙伴有没有遇到过，我们结合一段代码来说一下这种情况。</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">&gt;</span></span>我是一段文本<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span><span class="token punctuation">&gt;</span></span>change<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">var</span> h1 <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">querySelector</span><span class="token punctuation">(</span><span class="token string">&#39;h1&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">var</span> btn <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">querySelector</span><span class="token punctuation">(</span><span class="token string">&#39;button&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token comment">// 死循环指定的时间</span>
      <span class="token keyword">function</span> <span class="token function">delay</span><span class="token punctuation">(</span><span class="token parameter">duration</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">var</span> start <span class="token operator">=</span> Date<span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span>Date<span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-</span> start <span class="token operator">&lt;</span> duration<span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
      <span class="token punctuation">}</span>

      btn<span class="token punctuation">.</span><span class="token function-variable function">onclick</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        h1<span class="token punctuation">.</span>textContent <span class="token operator">=</span> <span class="token string">&#39;这段文本现在被改变了！&#39;</span><span class="token punctuation">;</span>
        <span class="token function">delay</span><span class="token punctuation">(</span><span class="token number">3000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在问题来了，当change按钮被点击后，文本会立马改变吗？<br> 答案是文本内容实际上已经被改变了，但是视觉效果上要延迟三秒才改变。为什么会造成这种情况，引入我们上面说过的各种任务队列的知识：</p><ol><li>一开始，主线程读取了js代码，定义了h1，btn，delay函数，并且向其它进程(浏览器进程)添加了一个监听。</li><li>随后点击事件发生，执行到<code>h1.textContent = &#39;这段文本现在被改变了&#39;</code>，现在文本已经被改变了。但是文本改变了，不代表页面能改变，上面提到了，主线程负责各种各样的事情， 比如执行html，css，js，绘制等等，现在内容改变了，页面是需要重新绘制的，所以主线程向一个任务队列中添加了一个重新绘制的任务，该任务和其他的队列任务一样正在排队。</li><li>随后执行到<code>delay(3000)</code>，在这个函数中，很容易看到，这是在堵塞主线程3000ms，所以主线程在这3s的时间里一直在执行delay函数的内容，并不认为当前函数已经结束了。</li><li>3s结束后，再去其它的队列中获取到重新渲染的任务，才将h1的内容改变。</li></ol><h3 id="任务有没有优先级" tabindex="-1"><a class="header-anchor" href="#任务有没有优先级" aria-hidden="true">#</a> 任务有没有优先级</h3><blockquote><p>任务没有优先级，但是队列存在优先级</p></blockquote><p>在w3c的标准中，微任务队列优先级最高，其它的队列w3c并没有进行强硬的要求，但是，从v8引擎的源代码来看，交互队列的优先级仅次于微队列。</p><hr><p>好啦，本篇的内容就到这啦，下一次是浏览器的渲染原理。</p>`,34);function k(v,m){return s(),a("div",null,[r,t(" more "),d])}const g=n(u,[["render",k],["__file","eventLoop.html.vue"]]);export{g as default};