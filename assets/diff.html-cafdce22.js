import{$ as n,O as s,P as a,X as p,Q as t,W as e}from"./framework-210236c4.js";const o="/carefree/diff.png",c={},l=t("p",null,"vue3diff算法学习",-1),i=e('<h2 id="ast是什么" tabindex="-1"><a class="header-anchor" href="#ast是什么" aria-hidden="true">#</a> ast是什么</h2><p>ast是抽象语法树的简写（abstract syntax code），vue操作dom的过程，就是将template转化为ast的过程，也就是虚拟dom。</p><div class="hint-container info"><p class="hint-container-title">相关信息</p><p>事实上很多编译器都会将代码转化为ast，然后再进行操作，比如babel，typescript等等。</p></div><h2 id="为什么要用虚拟dom" tabindex="-1"><a class="header-anchor" href="#为什么要用虚拟dom" aria-hidden="true">#</a> 为什么要用虚拟dom</h2><p>一个dom的属性是非常多的，去操作dom比较的复杂，而且操作dom比较浪费性能和时间，但是js不一样。操作js非常快捷，并且性能很高，所以将dom转化为虚拟dom后， 通过js的方式，改变部分节点内容，要远比直接操作dom来得更加的快。</p><h2 id="vue3diff" tabindex="-1"><a class="header-anchor" href="#vue3diff" aria-hidden="true">#</a> vue3diff</h2><p>一图表示</p><figure><img src="'+o+`" alt="diff算法" tabindex="0" loading="lazy"><figcaption>diff算法</figcaption></figure><h2 id="源码" tabindex="-1"><a class="header-anchor" href="#源码" aria-hidden="true">#</a> 源码</h2><p>ok，依旧是来看一下源码。源码目录在runtime-core/src/renderer.ts。<br> 首先在大约1580行找到patchChildren函数，这个函数是diff算法的核心。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code> <span class="token keyword">const</span> patchChildren<span class="token operator">:</span> PatchChildrenFn <span class="token operator">=</span> <span class="token punctuation">(</span>
    n1<span class="token punctuation">,</span>  <span class="token comment">//旧的节点</span>
        n2<span class="token punctuation">,</span> <span class="token comment">//新的节点</span>
        container<span class="token punctuation">,</span> <span class="token comment">//容器</span>
        anchor<span class="token punctuation">,</span> <span class="token comment">//锚点</span>
        parentComponent<span class="token punctuation">,</span> <span class="token comment">//父组件</span>
        parentSuspense<span class="token punctuation">,</span> <span class="token comment">//父suspense suspense是一个内置组件 用于收集异步组件的依赖</span>
        isSVG<span class="token punctuation">,</span> <span class="token comment">//是否是svg元素</span>
        slotScopeIds<span class="token punctuation">,</span> <span class="token comment">//作用域插槽 ID</span>
        optimized <span class="token operator">=</span> <span class="token boolean">false</span> <span class="token comment">//是否执行优化</span>
<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>该函数调用时机在节点更新时，比如节点的属性变化，子节点的变化等等。可以看到，传入新旧节点，该新旧节点类型是VNode类型( 也就是虚拟节点)。 继续往下看</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">const</span> c1 <span class="token operator">=</span> n1 <span class="token operator">&amp;&amp;</span> n1<span class="token punctuation">.</span>children <span class="token comment">//旧的节点的子节点</span>
<span class="token keyword">const</span> prevShapeFlag <span class="token operator">=</span> n1 <span class="token operator">?</span> n1<span class="token punctuation">.</span>shapeFlag <span class="token operator">:</span> <span class="token number">0</span> <span class="token comment">//旧的节点的标记</span>
<span class="token keyword">const</span> c2 <span class="token operator">=</span> n2<span class="token punctuation">.</span>children <span class="token comment">//新节点的子节点</span>

<span class="token keyword">const</span> <span class="token punctuation">{</span>patchFlag<span class="token punctuation">,</span> shapeFlag<span class="token punctuation">}</span> <span class="token operator">=</span> n2 <span class="token comment">//patchFlag 表示新旧节点的差异</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>初始化了旧节点的子节点，旧节点的标记，新节点的子节点，新节点的patchFlag和shapeFlag。patchFlag是一个标记，表示新旧节点的差异，shapeFlag是一个标记，表示节点的类型。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code> <span class="token keyword">if</span> <span class="token punctuation">(</span>patchFlag <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>patchFlag <span class="token operator">&amp;</span> PatchFlags<span class="token punctuation">.</span><span class="token constant">KEYED_FRAGMENT</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// this could be either fully-keyed or mixed (some keyed some not)</span>
        <span class="token comment">// presence of patchFlag means children are guaranteed to be arrays</span>
        <span class="token function">patchKeyedChildren</span><span class="token punctuation">(</span>
            c1 <span class="token keyword">as</span> VNode<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
            c2 <span class="token keyword">as</span> VNodeArrayChildren<span class="token punctuation">,</span>
            container<span class="token punctuation">,</span>
            anchor<span class="token punctuation">,</span>
            parentComponent<span class="token punctuation">,</span>
            parentSuspense<span class="token punctuation">,</span>
            isSVG<span class="token punctuation">,</span>
            slotScopeIds<span class="token punctuation">,</span>
            optimized
        <span class="token punctuation">)</span>
        <span class="token keyword">return</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>patchFlag <span class="token operator">&amp;</span> PatchFlags<span class="token punctuation">.</span><span class="token constant">UNKEYED_FRAGMENT</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// unkeyed</span>
        <span class="token function">patchUnkeyedChildren</span><span class="token punctuation">(</span>
            c1 <span class="token keyword">as</span> VNode<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
            c2 <span class="token keyword">as</span> VNodeArrayChildren<span class="token punctuation">,</span>
            container<span class="token punctuation">,</span>
            anchor<span class="token punctuation">,</span>
            parentComponent<span class="token punctuation">,</span>
            parentSuspense<span class="token punctuation">,</span>
            isSVG<span class="token punctuation">,</span>
            slotScopeIds<span class="token punctuation">,</span>
            optimized
        <span class="token punctuation">)</span>
        <span class="token keyword">return</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果patchFlag大于0，表示新旧节点有差异，那么就会进入patchKeyedChildren或者patchUnkeyedChildren函数。patchKeyedChildren函数是用来处理有key的节点，patchUnkeyedChildren函数是用来处理没有key的节点。</p><p>实际上往后还有一种情况，当patchFlag不大于0时，需要去处理子节点：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code> <span class="token comment">//新节点的子节点有三种可能：文本、数组或没有子节点。</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>shapeFlag <span class="token operator">&amp;</span> ShapeFlags<span class="token punctuation">.</span><span class="token constant">TEXT_CHILDREN</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">//新节点是文本节点</span>
    <span class="token comment">// text children fast path</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>prevShapeFlag <span class="token operator">&amp;</span> ShapeFlags<span class="token punctuation">.</span><span class="token constant">ARRAY_CHILDREN</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// 旧节点是数组</span>
        <span class="token function">unmountChildren</span><span class="token punctuation">(</span>c1 <span class="token keyword">as</span> VNode<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> parentComponent<span class="token punctuation">,</span> parentSuspense<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>c2 <span class="token operator">!==</span> c1<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// 子节点不同</span>
        <span class="token function">hostSetElementText</span><span class="token punctuation">(</span>container<span class="token punctuation">,</span> c2 <span class="token keyword">as</span> <span class="token builtin">string</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span> <span class="token comment">//新节点不是文本节点</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>prevShapeFlag <span class="token operator">&amp;</span> ShapeFlags<span class="token punctuation">.</span><span class="token constant">ARRAY_CHILDREN</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// 旧节点是数组</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>shapeFlag <span class="token operator">&amp;</span> ShapeFlags<span class="token punctuation">.</span><span class="token constant">ARRAY_CHILDREN</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">//新节点是数组</span>
            <span class="token comment">// 两个数组类型的节点，将进行diff</span>
            <span class="token function">patchKeyedChildren</span><span class="token punctuation">(</span>
                c1 <span class="token keyword">as</span> VNode<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
                c2 <span class="token keyword">as</span> VNodeArrayChildren<span class="token punctuation">,</span>
                container<span class="token punctuation">,</span>
                anchor<span class="token punctuation">,</span>
                parentComponent<span class="token punctuation">,</span>
                parentSuspense<span class="token punctuation">,</span>
                isSVG<span class="token punctuation">,</span>
                slotScopeIds<span class="token punctuation">,</span>
                optimized
            <span class="token punctuation">)</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            <span class="token comment">// 没有新的子节点，将卸载旧的子节点</span>
            <span class="token function">unmountChildren</span><span class="token punctuation">(</span>c1 <span class="token keyword">as</span> VNode<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> parentComponent<span class="token punctuation">,</span> parentSuspense<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>prevShapeFlag <span class="token operator">&amp;</span> ShapeFlags<span class="token punctuation">.</span><span class="token constant">TEXT_CHILDREN</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">hostSetElementText</span><span class="token punctuation">(</span>container<span class="token punctuation">,</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// mount new if array</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>shapeFlag <span class="token operator">&amp;</span> ShapeFlags<span class="token punctuation">.</span><span class="token constant">ARRAY_CHILDREN</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">mountChildren</span><span class="token punctuation">(</span>
                c2 <span class="token keyword">as</span> VNodeArrayChildren<span class="token punctuation">,</span>
                container<span class="token punctuation">,</span>
                anchor<span class="token punctuation">,</span>
                parentComponent<span class="token punctuation">,</span>
                parentSuspense<span class="token punctuation">,</span>
                isSVG<span class="token punctuation">,</span>
                slotScopeIds<span class="token punctuation">,</span>
                optimized
            <span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实是当patchFlag大于0时的处理差不多的。ok接下来呢就是我们diff算法的重要部分了，patchKeyedChildren和patchUnkeyedChildren函数。</p><h3 id="patchunkeyedchildren" tabindex="-1"><a class="header-anchor" href="#patchunkeyedchildren" aria-hidden="true">#</a> patchUnkeyedChildren</h3><p>首先是一个没有key的情况，我们在开发的时候总会遇到一种提示，当我们使用v-for的时候，如果没有key，会有一个警告，这个警告是有道理的，因为没有key的话，diff算法会变得非常的低效。 下面我们一起看一下没有key的情况：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">const</span> patchUnkeyedChildren <span class="token operator">=</span> <span class="token punctuation">(</span>
    c1<span class="token operator">:</span> VNode<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token comment">//旧的</span>
    c2<span class="token operator">:</span> VNodeArrayChildren<span class="token punctuation">,</span> <span class="token comment">//新的</span>
    container<span class="token operator">:</span> RendererElement<span class="token punctuation">,</span>
    anchor<span class="token operator">:</span> RendererNode <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    parentComponent<span class="token operator">:</span> ComponentInternalInstance <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    parentSuspense<span class="token operator">:</span> SuspenseBoundary <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    isSVG<span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">,</span>
    slotScopeIds<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    optimized<span class="token operator">:</span> <span class="token builtin">boolean</span>
<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    c1 <span class="token operator">=</span> c1 <span class="token operator">||</span> <span class="token constant">EMPTY_ARR</span>
    c2 <span class="token operator">=</span> c2 <span class="token operator">||</span> <span class="token constant">EMPTY_ARR</span>
    <span class="token keyword">const</span> oldLength <span class="token operator">=</span> c1<span class="token punctuation">.</span>length
    <span class="token keyword">const</span> newLength <span class="token operator">=</span> c2<span class="token punctuation">.</span>length
    <span class="token keyword">const</span> commonLength <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">min</span><span class="token punctuation">(</span>oldLength<span class="token punctuation">,</span> newLength<span class="token punctuation">)</span>
    <span class="token keyword">let</span> i
    <span class="token keyword">for</span> <span class="token punctuation">(</span>i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> commonLength<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> nextChild <span class="token operator">=</span> <span class="token punctuation">(</span>c2<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> optimized
            <span class="token operator">?</span> <span class="token function">cloneIfMounted</span><span class="token punctuation">(</span>c2<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token keyword">as</span> VNode<span class="token punctuation">)</span>
            <span class="token operator">:</span> <span class="token function">normalizeVNode</span><span class="token punctuation">(</span>c2<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
        <span class="token function">patch</span><span class="token punctuation">(</span>
            c1<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span>
            nextChild<span class="token punctuation">,</span>
            container<span class="token punctuation">,</span>
            <span class="token keyword">null</span><span class="token punctuation">,</span>
            parentComponent<span class="token punctuation">,</span>
            parentSuspense<span class="token punctuation">,</span>
            isSVG<span class="token punctuation">,</span>
            slotScopeIds<span class="token punctuation">,</span>
            optimized
        <span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>oldLength <span class="token operator">&gt;</span> newLength<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// remove old</span>
        <span class="token function">unmountChildren</span><span class="token punctuation">(</span>
            c1<span class="token punctuation">,</span>
            parentComponent<span class="token punctuation">,</span>
            parentSuspense<span class="token punctuation">,</span>
            <span class="token boolean">true</span><span class="token punctuation">,</span>
            <span class="token boolean">false</span><span class="token punctuation">,</span>
            commonLength
        <span class="token punctuation">)</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token comment">// mount new</span>
        <span class="token class-name">mountChildren</span><span class="token punctuation">(</span>
            c2<span class="token punctuation">,</span>
            container<span class="token punctuation">,</span>
            anchor<span class="token punctuation">,</span>
            parentComponent<span class="token punctuation">,</span>
            parentSuspense<span class="token punctuation">,</span>
            isSVG<span class="token punctuation">,</span>
            slotScopeIds<span class="token punctuation">,</span>
            optimized<span class="token punctuation">,</span>
            commonLength
        <span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>相当简单哈，按照<a href="#vue3diff">图里</a>的没有key的情况，就是替换，删除，添加，没有其它的算法。</p><h3 id="patchkeyedchildren" tabindex="-1"><a class="header-anchor" href="#patchkeyedchildren" aria-hidden="true">#</a> patchKeyedChildren</h3><p>接下来是有key的情况，这个时候就是我们大名鼎鼎的diff算法大展身手的地盘了。内容很多，我们一点点来看。</p><h4 id="开头" tabindex="-1"><a class="header-anchor" href="#开头" aria-hidden="true">#</a> 开头</h4><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>  <span class="token keyword">const</span> <span class="token function-variable function">patchKeyedChildren</span> <span class="token operator">=</span> <span class="token punctuation">(</span>
    c1<span class="token operator">:</span> VNode<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    c2<span class="token operator">:</span> VNodeArrayChildren<span class="token punctuation">,</span>
    container<span class="token operator">:</span> RendererElement<span class="token punctuation">,</span>
    parentAnchor<span class="token operator">:</span> RendererNode <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    parentComponent<span class="token operator">:</span> ComponentInternalInstance <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    parentSuspense<span class="token operator">:</span> SuspenseBoundary <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    isSVG<span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">,</span>
    slotScopeIds<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    optimized<span class="token operator">:</span> <span class="token builtin">boolean</span>
<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span>
    <span class="token keyword">const</span> l2 <span class="token operator">=</span> c2<span class="token punctuation">.</span>length
    <span class="token keyword">let</span> e1 <span class="token operator">=</span> c1<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span> <span class="token comment">// prev ending index</span>
    <span class="token keyword">let</span> e2 <span class="token operator">=</span> l2 <span class="token operator">-</span> <span class="token number">1</span> <span class="token comment">// next ending index</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>首先是初始化一些变量，i是一个索引，l2是新节点的长度，e1是旧节点的长度减1，e2是新节点的长度减1。</p><h4 id="前序算法" tabindex="-1"><a class="header-anchor" href="#前序算法" aria-hidden="true">#</a> 前序算法</h4><p>还是看图，图种，有key的情况下，会先进行一个先序对比，怎么比呢。我们看代码：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>    <span class="token comment">// 1. sync from start</span>
    <span class="token comment">// (a b) c</span>
    <span class="token comment">// (a b) d e</span>
<span class="token keyword">while</span> <span class="token punctuation">(</span>i <span class="token operator">&lt;=</span> e1 <span class="token operator">&amp;&amp;</span> i <span class="token operator">&lt;=</span> e2<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> n1 <span class="token operator">=</span> c1<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
    <span class="token keyword">const</span> n2 <span class="token operator">=</span> <span class="token punctuation">(</span>c2<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> optimized
        <span class="token operator">?</span> <span class="token function">cloneIfMounted</span><span class="token punctuation">(</span>c2<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token keyword">as</span> VNode<span class="token punctuation">)</span>
        <span class="token operator">:</span> <span class="token function">normalizeVNode</span><span class="token punctuation">(</span>c2<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isSameVNodeType</span><span class="token punctuation">(</span>n1<span class="token punctuation">,</span> n2<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">patch</span><span class="token punctuation">(</span>
            n1<span class="token punctuation">,</span>
            n2<span class="token punctuation">,</span>
            container<span class="token punctuation">,</span>
            <span class="token keyword">null</span><span class="token punctuation">,</span>
            parentComponent<span class="token punctuation">,</span>
            parentSuspense<span class="token punctuation">,</span>
            isSVG<span class="token punctuation">,</span>
            slotScopeIds<span class="token punctuation">,</span>
            optimized
        <span class="token punctuation">)</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token keyword">break</span>
    <span class="token punctuation">}</span>
    i<span class="token operator">++</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">isSameVNodeType</span><span class="token punctuation">(</span>n1<span class="token operator">:</span> VNode<span class="token punctuation">,</span> n2<span class="token operator">:</span> VNode<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">boolean</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>
        __DEV__ <span class="token operator">&amp;&amp;</span>
        n2<span class="token punctuation">.</span>shapeFlag <span class="token operator">&amp;</span> ShapeFlags<span class="token punctuation">.</span><span class="token constant">COMPONENT</span> <span class="token operator">&amp;&amp;</span>
        hmrDirtyComponents<span class="token punctuation">.</span><span class="token function">has</span><span class="token punctuation">(</span>n2<span class="token punctuation">.</span><span class="token keyword">type</span> <span class="token class-name"><span class="token keyword">as</span></span> ConcreteComponent<span class="token punctuation">)</span>
    <span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// #7042, ensure the vnode being unmounted during HMR</span>
        <span class="token comment">// bitwise operations to remove keep alive flags</span>
        n1<span class="token punctuation">.</span>shapeFlag <span class="token operator">&amp;=</span> <span class="token operator">~</span>ShapeFlags<span class="token punctuation">.</span><span class="token constant">COMPONENT_SHOULD_KEEP_ALIVE</span>
        n2<span class="token punctuation">.</span>shapeFlag <span class="token operator">&amp;=</span> <span class="token operator">~</span>ShapeFlags<span class="token punctuation">.</span><span class="token constant">COMPONENT_KEPT_ALIVE</span>
        <span class="token comment">// HMR only: if the component has been hot-updated, force a reload.</span>
        <span class="token keyword">return</span> <span class="token boolean">false</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> n1<span class="token punctuation">.</span>type <span class="token operator">===</span> n2<span class="token punctuation">.</span>type <span class="token operator">&amp;&amp;</span> n1<span class="token punctuation">.</span>key <span class="token operator">===</span> n2<span class="token punctuation">.</span>key
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在判断了新旧节点的type和类型相同的情况下，会调用patch函数去使用新节点替换旧节点。</p><h4 id="后序算法" tabindex="-1"><a class="header-anchor" href="#后序算法" aria-hidden="true">#</a> 后序算法</h4><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>    <span class="token comment">// 2. sync from end</span>
    <span class="token comment">// a (b c)</span>
    <span class="token comment">// d e (b c)</span>
<span class="token keyword">while</span> <span class="token punctuation">(</span>i <span class="token operator">&lt;=</span> e1 <span class="token operator">&amp;&amp;</span> i <span class="token operator">&lt;=</span> e2<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> n1 <span class="token operator">=</span> c1<span class="token punctuation">[</span>e1<span class="token punctuation">]</span>
    <span class="token keyword">const</span> n2 <span class="token operator">=</span> <span class="token punctuation">(</span>c2<span class="token punctuation">[</span>e2<span class="token punctuation">]</span> <span class="token operator">=</span> optimized
        <span class="token operator">?</span> <span class="token function">cloneIfMounted</span><span class="token punctuation">(</span>c2<span class="token punctuation">[</span>e2<span class="token punctuation">]</span> <span class="token keyword">as</span> VNode<span class="token punctuation">)</span>
        <span class="token operator">:</span> <span class="token function">normalizeVNode</span><span class="token punctuation">(</span>c2<span class="token punctuation">[</span>e2<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isSameVNodeType</span><span class="token punctuation">(</span>n1<span class="token punctuation">,</span> n2<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">patch</span><span class="token punctuation">(</span>
            n1<span class="token punctuation">,</span>
            n2<span class="token punctuation">,</span>
            container<span class="token punctuation">,</span>
            <span class="token keyword">null</span><span class="token punctuation">,</span>
            parentComponent<span class="token punctuation">,</span>
            parentSuspense<span class="token punctuation">,</span>
            isSVG<span class="token punctuation">,</span>
            slotScopeIds<span class="token punctuation">,</span>
            optimized
        <span class="token punctuation">)</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token keyword">break</span>
    <span class="token punctuation">}</span>
    e1<span class="token operator">--</span>
    e2<span class="token operator">--</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>与前序算法是一模一样的，只不过从后往前开始比较。这两部分呢还是比较简单的。</p><h4 id="插入、新增" tabindex="-1"><a class="header-anchor" href="#插入、新增" aria-hidden="true">#</a> 插入、新增</h4><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">//新增</span>
<span class="token comment">// 3. common sequence + mount</span>
<span class="token comment">// (a b)</span>
<span class="token comment">// (a b) c</span>
<span class="token comment">// i = 2, e1 = 1, e2 = 2</span>
<span class="token comment">// (a b)</span>
<span class="token comment">// c (a b)</span>
<span class="token comment">// i = 0, e1 = -1, e2 = 0</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>i <span class="token operator">&gt;</span> e1<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">//如果当前索引大于旧节点的长度</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>i <span class="token operator">&lt;=</span> e2<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">//并且小于新节点的长度 通过这两个条件可以判断为新增，因为前序和后续已经都对比过了</span>
        <span class="token keyword">const</span> nextPos <span class="token operator">=</span> e2 <span class="token operator">+</span> <span class="token number">1</span>
        <span class="token keyword">const</span> anchor <span class="token operator">=</span> nextPos <span class="token operator">&lt;</span> l2 <span class="token operator">?</span> <span class="token punctuation">(</span>c2<span class="token punctuation">[</span>nextPos<span class="token punctuation">]</span> <span class="token keyword">as</span> VNode<span class="token punctuation">)</span><span class="token punctuation">.</span>el <span class="token operator">:</span> parentAnchor
        <span class="token keyword">while</span> <span class="token punctuation">(</span>i <span class="token operator">&lt;=</span> e2<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">patch</span><span class="token punctuation">(</span>
                <span class="token keyword">null</span><span class="token punctuation">,</span>
                <span class="token punctuation">(</span>c2<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> optimized
                    <span class="token operator">?</span> <span class="token function">cloneIfMounted</span><span class="token punctuation">(</span>c2<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token keyword">as</span> VNode<span class="token punctuation">)</span>
                    <span class="token operator">:</span> <span class="token function">normalizeVNode</span><span class="token punctuation">(</span>c2<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
                container<span class="token punctuation">,</span>
                anchor<span class="token punctuation">,</span>
                parentComponent<span class="token punctuation">,</span>
                parentSuspense<span class="token punctuation">,</span>
                isSVG<span class="token punctuation">,</span>
                slotScopeIds<span class="token punctuation">,</span>
                optimized
            <span class="token punctuation">)</span>
            i<span class="token operator">++</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>patch方法不传入旧节点则是新增。optimized的作用则是为了提升性能，如果是true则会复用节点，否则会重新创建一个新的节点。</p><h4 id="卸载、删除" tabindex="-1"><a class="header-anchor" href="#卸载、删除" aria-hidden="true">#</a> 卸载、删除</h4><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">//删除</span>
<span class="token comment">// 4. common sequence + unmount</span>
<span class="token comment">// (a b) c</span>
<span class="token comment">// (a b)</span>
<span class="token comment">// i = 2, e1 = 2, e2 = 1</span>
<span class="token comment">// a (b c)</span>
<span class="token comment">// (b c)</span>
<span class="token comment">// i = 0, e1 = 0, e2 = -1</span>
<span class="token keyword">else</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>i <span class="token operator">&gt;</span> e2<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">//如果当前索引大于新节点的长度</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>i <span class="token operator">&lt;=</span> e1<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">//当前索引小于旧节点的长度 说明在旧节点而不在新节点</span>
        <span class="token function">unmount</span><span class="token punctuation">(</span>c1<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> parentComponent<span class="token punctuation">,</span> parentSuspense<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span>
        i<span class="token operator">++</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>unmount接收父节点，父级的异步组件收集者。该函数会清除在组件内收集的依赖和副作用函数。</p><h4 id="乱序" tabindex="-1"><a class="header-anchor" href="#乱序" aria-hidden="true">#</a> 乱序</h4><p>ok，重头戏来了，在我们进行了先序，后续，新增删除等简单的判断后，剩下的是不是只有一种情况-被移动了，或是删除时移动，或是新增时移动，或是简单的移动。 总之呢，这个新节点的顺序，他就与旧节点的key顺序对不上。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">const</span> s1 <span class="token operator">=</span> i <span class="token comment">// prev starting index</span>
<span class="token keyword">const</span> s2 <span class="token operator">=</span> i <span class="token comment">// next starting index</span>

<span class="token comment">//构建新节点的映射关系</span>

<span class="token comment">// 5.1 build key:index map for newChildren</span>
<span class="token keyword">const</span> keyToNewIndexMap<span class="token operator">:</span> Map<span class="token operator">&lt;</span><span class="token builtin">string</span> <span class="token operator">|</span> <span class="token builtin">number</span> <span class="token operator">|</span> <span class="token builtin">symbol</span><span class="token punctuation">,</span> <span class="token builtin">number</span><span class="token operator">&gt;</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">for</span> <span class="token punctuation">(</span>i <span class="token operator">=</span> s2<span class="token punctuation">;</span> i <span class="token operator">&lt;=</span> e2<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> nextChild <span class="token operator">=</span> <span class="token punctuation">(</span>c2<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> optimized
        <span class="token operator">?</span> <span class="token function">cloneIfMounted</span><span class="token punctuation">(</span>c2<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token keyword">as</span> VNode<span class="token punctuation">)</span>
        <span class="token operator">:</span> <span class="token function">normalizeVNode</span><span class="token punctuation">(</span>c2<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>nextChild<span class="token punctuation">.</span>key <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>__DEV__ <span class="token operator">&amp;&amp;</span> keyToNewIndexMap<span class="token punctuation">.</span><span class="token function">has</span><span class="token punctuation">(</span>nextChild<span class="token punctuation">.</span>key<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">warn</span><span class="token punctuation">(</span>
                <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">Duplicate keys found during update:</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span>
                <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>nextChild<span class="token punctuation">.</span>key<span class="token punctuation">)</span><span class="token punctuation">,</span>
                <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">Make sure keys are unique.</span><span class="token template-punctuation string">\`</span></span>
            <span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
        keyToNewIndexMap<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>nextChild<span class="token punctuation">.</span>key<span class="token punctuation">,</span> i<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这段代码被官方注释为5.1，他是diff的第一步，构建新节点的映射关系，这个映射关系是一个map，key是新节点的key，value是新节点的索引。 比如，现在有如下节点 1、2、3、4、5，进行上面的排序后，会变成一个map ： 5:0, 4:1, 3:2, 2:3, 1:4 ok,接下来是5.2</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">let</span> j
<span class="token keyword">let</span> patched <span class="token operator">=</span> <span class="token number">0</span>
<span class="token keyword">const</span> toBePatched <span class="token operator">=</span> e2 <span class="token operator">-</span> s2 <span class="token operator">+</span> <span class="token number">1</span>
<span class="token keyword">let</span> moved <span class="token operator">=</span> <span class="token boolean">false</span>
<span class="token comment">// used to track whether any node has moved</span>
<span class="token keyword">let</span> maxNewIndexSoFar <span class="token operator">=</span> <span class="token number">0</span>
<span class="token comment">// works as Map&lt;newIndex, oldIndex&gt;</span>
<span class="token comment">// Note that oldIndex is offset by +1</span>
<span class="token comment">// and oldIndex = 0 is a special value indicating the new node has</span>
<span class="token comment">// no corresponding old node.</span>
<span class="token comment">// used for determining longest stable subsequence</span>

<span class="token comment">//记录新节点在旧节点的位置</span>
<span class="token keyword">const</span> newIndexToOldIndexMap <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name"><span class="token builtin">Array</span></span><span class="token punctuation">(</span>toBePatched<span class="token punctuation">)</span>
<span class="token keyword">for</span> <span class="token punctuation">(</span>i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> toBePatched<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> newIndexToOldIndexMap<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">0</span>

<span class="token keyword">for</span> <span class="token punctuation">(</span>i <span class="token operator">=</span> s1<span class="token punctuation">;</span> i <span class="token operator">&lt;=</span> e1<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> prevChild <span class="token operator">=</span> c1<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>patched <span class="token operator">&gt;=</span> toBePatched<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">//有多余的节点就删除了</span>
        <span class="token comment">// all new children have been patched so this can only be a removal</span>
        <span class="token function">unmount</span><span class="token punctuation">(</span>prevChild<span class="token punctuation">,</span> parentComponent<span class="token punctuation">,</span> parentSuspense<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span>
        <span class="token keyword">continue</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">let</span> newIndex
    <span class="token keyword">if</span> <span class="token punctuation">(</span>prevChild<span class="token punctuation">.</span>key <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        newIndex <span class="token operator">=</span> keyToNewIndexMap<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>prevChild<span class="token punctuation">.</span>key<span class="token punctuation">)</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token comment">// key-less node, try to locate a key-less node of the same type</span>
        <span class="token class-name"><span class="token keyword">for</span></span> <span class="token punctuation">(</span>j <span class="token operator">=</span> s2<span class="token punctuation">;</span> j <span class="token operator">&lt;=</span> e2<span class="token punctuation">;</span> j<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>
                newIndexToOldIndexMap<span class="token punctuation">[</span>j <span class="token operator">-</span> s2<span class="token punctuation">]</span> <span class="token operator">===</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span>
                <span class="token function">isSameVNodeType</span><span class="token punctuation">(</span>prevChild<span class="token punctuation">,</span> c2<span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token keyword">as</span> VNode<span class="token punctuation">)</span>
            <span class="token punctuation">)</span> <span class="token punctuation">{</span>
                newIndex <span class="token operator">=</span> j
                <span class="token keyword">break</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token comment">//如果新节点不包含旧节点也删除</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>newIndex <span class="token operator">===</span> <span class="token keyword">undefined</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">unmount</span><span class="token punctuation">(</span>prevChild<span class="token punctuation">,</span> parentComponent<span class="token punctuation">,</span> parentSuspense<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        newIndexToOldIndexMap<span class="token punctuation">[</span>newIndex <span class="token operator">-</span> s2<span class="token punctuation">]</span> <span class="token operator">=</span> i <span class="token operator">+</span> <span class="token number">1</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>newIndex <span class="token operator">&gt;=</span> maxNewIndexSoFar<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            maxNewIndexSoFar <span class="token operator">=</span> newIndex
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            <span class="token comment">//当节点存在交叉时，需要求最长递增 子序列</span>
            moved <span class="token operator">=</span> <span class="token boolean">true</span>
        <span class="token punctuation">}</span>
        <span class="token function">patch</span><span class="token punctuation">(</span>
            prevChild<span class="token punctuation">,</span>
            c2<span class="token punctuation">[</span>newIndex<span class="token punctuation">]</span> <span class="token keyword">as</span> VNode<span class="token punctuation">,</span>
            container<span class="token punctuation">,</span>
            <span class="token keyword">null</span><span class="token punctuation">,</span>
            parentComponent<span class="token punctuation">,</span>
            parentSuspense<span class="token punctuation">,</span>
            isSVG<span class="token punctuation">,</span>
            slotScopeIds<span class="token punctuation">,</span>
            optimized
        <span class="token punctuation">)</span>
        patched<span class="token operator">++</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>5.2相当长啊，但是总体来说，它是执行一个删除操作。首先，我们会遍历旧节点，如果旧节点的key在新节点中不存在，则删除。如果存在，则进行patch操作。 当newIndex &lt; maxNewIndexSoFar时，则需要计算最长递增子序列，这个是为了解决节点交叉的问题。</p><p>最后我们再来看一下vue3是怎么求的。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token function">getSequence</span><span class="token punctuation">(</span>arr<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> p <span class="token operator">=</span> arr<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>
  <span class="token keyword">let</span> i<span class="token punctuation">,</span> j<span class="token punctuation">,</span> u<span class="token punctuation">,</span> v<span class="token punctuation">,</span> c
  <span class="token keyword">const</span> len <span class="token operator">=</span> arr<span class="token punctuation">.</span>length
  <span class="token keyword">for</span> <span class="token punctuation">(</span>i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> len<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> arrI <span class="token operator">=</span> arr<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>arrI <span class="token operator">!==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      j <span class="token operator">=</span> result<span class="token punctuation">[</span>result<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>arr<span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">&lt;</span> arrI<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        p<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> j
        result<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span>
        <span class="token keyword">continue</span>
      <span class="token punctuation">}</span>
      u <span class="token operator">=</span> <span class="token number">0</span>
      v <span class="token operator">=</span> result<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span>
      <span class="token keyword">while</span> <span class="token punctuation">(</span>u <span class="token operator">&lt;</span> v<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        c <span class="token operator">=</span> <span class="token punctuation">(</span>u <span class="token operator">+</span> v<span class="token punctuation">)</span> <span class="token operator">&gt;&gt;</span> <span class="token number">1</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>arr<span class="token punctuation">[</span>result<span class="token punctuation">[</span>c<span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&lt;</span> arrI<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          u <span class="token operator">=</span> c <span class="token operator">+</span> <span class="token number">1</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
          v <span class="token operator">=</span> c
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>arrI <span class="token operator">&lt;</span> arr<span class="token punctuation">[</span>result<span class="token punctuation">[</span>u<span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>u <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          p<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> result<span class="token punctuation">[</span>u <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span>
        <span class="token punctuation">}</span>
        result<span class="token punctuation">[</span>u<span class="token punctuation">]</span> <span class="token operator">=</span> i
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  u <span class="token operator">=</span> result<span class="token punctuation">.</span>length
  v <span class="token operator">=</span> result<span class="token punctuation">[</span>u <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>u<span class="token operator">--</span> <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    result<span class="token punctuation">[</span>u<span class="token punctuation">]</span> <span class="token operator">=</span> v
    v <span class="token operator">=</span> p<span class="token punctuation">[</span>v<span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> result
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>总体来说呢是一个贪心加二分查找的算法，我们可以给几个简化版本来看：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">let</span> arr <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">3</span><span class="token punctuation">,</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">5</span><span class="token punctuation">,</span><span class="token number">7</span><span class="token punctuation">,</span><span class="token number">3</span><span class="token punctuation">,</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">,</span><span class="token number">7</span><span class="token punctuation">,</span><span class="token number">8</span><span class="token punctuation">,</span><span class="token number">9</span><span class="token punctuation">]</span>

<span class="token doc-comment comment">/**第一重种实现，仅能得到最长递增子序列的长度
 * 时间复杂度O(n^2)
 * 空间复杂度O(n) 使用了一个dp数组
 * <span class="token keyword">@param</span> <span class="token parameter">arr</span>
 */</span>
<span class="token keyword">function</span> <span class="token function">diff</span> <span class="token punctuation">(</span>arr<span class="token operator">:</span><span class="token builtin">number</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> dp <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name"><span class="token builtin">Array</span></span><span class="token punctuation">(</span>arr<span class="token punctuation">.</span>length<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">fill</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> arr<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// 从第二个数开始</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> j <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> j <span class="token operator">&lt;</span> i<span class="token punctuation">;</span> j<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// 从第一个数开始</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>arr<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">&gt;</span> arr<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// 如果当前数大于前面的数</span>
                dp<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">max</span><span class="token punctuation">(</span>dp<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> dp<span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token comment">// 当前数的最长递增子序列为前面的数的最长递增子序列+1</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>dp<span class="token punctuation">)</span>
    <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>Math<span class="token punctuation">.</span><span class="token function">max</span><span class="token punctuation">(</span><span class="token operator">...</span>dp<span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token function">diff</span><span class="token punctuation">(</span>arr<span class="token punctuation">)</span>

<span class="token doc-comment comment">/**第二重种实现，得到最长递增子序列的值
 * 时间复杂度O(n^2)
 * 空间复杂度O(n^2) 使用了一个dp二维数组
 * <span class="token keyword">@param</span> <span class="token parameter">arr</span>
 */</span>
<span class="token keyword">function</span> <span class="token function">diffWithValue</span> <span class="token punctuation">(</span>arr<span class="token operator">:</span><span class="token builtin">number</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> dp <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">[</span>arr<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token comment">// 以第一个数为结尾的最长递增子序列</span>

    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> arr<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">_diff</span><span class="token punctuation">(</span>arr<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">function</span> <span class="token function">_diff</span><span class="token punctuation">(</span>num<span class="token operator">:</span><span class="token builtin">number</span><span class="token punctuation">)</span><span class="token punctuation">{</span> <span class="token comment">// 计算以num为结尾的最长递增子序列</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> dp<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&gt;=</span> <span class="token number">0</span><span class="token punctuation">;</span> i<span class="token operator">--</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">const</span> line <span class="token operator">=</span> dp<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
            <span class="token keyword">const</span> tail <span class="token operator">=</span> line<span class="token punctuation">[</span>line<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>num <span class="token operator">&gt;</span> tail<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// 如果num大于当前行的最后一个数</span>
                dp<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token operator">...</span>line<span class="token punctuation">,</span> num<span class="token punctuation">]</span><span class="token punctuation">)</span>
                <span class="token keyword">break</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token keyword">if</span><span class="token punctuation">(</span>num <span class="token operator">&lt;</span> tail <span class="token operator">&amp;&amp;</span> i <span class="token operator">===</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">{</span> <span class="token comment">// 如果num小于当前行的最后一个数，并且是第一行</span>
                dp<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span>num<span class="token punctuation">]</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> dp<span class="token punctuation">[</span>dp<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">diffWithValue</span><span class="token punctuation">(</span>arr<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">lengthOfLIS</span><span class="token punctuation">(</span>nums<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">number</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> tails<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment">// tails数组用于存储递增子序列的尾部元素</span>

    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> num <span class="token keyword">of</span> nums<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">let</span> left <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
        <span class="token keyword">let</span> right <span class="token operator">=</span> tails<span class="token punctuation">.</span>length<span class="token punctuation">;</span>

        <span class="token comment">// 使用二分查找在tails数组中找到第一个大于等于当前元素的位置</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span>left <span class="token operator">&lt;</span> right<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">const</span> mid <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">floor</span><span class="token punctuation">(</span><span class="token punctuation">(</span>left <span class="token operator">+</span> right<span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>tails<span class="token punctuation">[</span>mid<span class="token punctuation">]</span> <span class="token operator">&lt;</span> num<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                left <span class="token operator">=</span> mid <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
                right <span class="token operator">=</span> mid<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>

        <span class="token comment">// 如果当前元素大于tails数组中的最大值，则将其添加到tails数组的末尾</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>right <span class="token operator">===</span> tails<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            tails<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>num<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            tails<span class="token punctuation">[</span>right<span class="token punctuation">]</span> <span class="token operator">=</span> num<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">return</span> tails<span class="token punctuation">.</span>length<span class="token punctuation">;</span> <span class="token comment">// 返回tails数组的长度作为最长递增子序列的长度</span>
<span class="token punctuation">}</span>


<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">lengthOfLIS</span><span class="token punctuation">(</span>arr<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,52);function u(r,k){return s(),a("div",null,[l,p(" more "),i])}const v=n(c,[["render",u],["__file","diff.html.vue"]]);export{v as default};
