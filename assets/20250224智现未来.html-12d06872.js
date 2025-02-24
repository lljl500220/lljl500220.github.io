import{_ as n,V as s,W as a,X as e,a2 as t}from"./framework-82b537ca.js";const p={},i=t(`<ol><li>算法 其实就是一个二叉树生成,印象中力扣或者牛客做过这道题,太久了还想了一会,一开始都没想起来怎么写,直接尬住</li></ol><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">/*
使用 TypeScript 语法将没有层级的扁平数据转换成树形结构的数据
// 扁平数据 
[
    {   name: &#39;文本1&#39;,   parent: null,   id: 1 }, 
    {   name: &#39;文本2&#39;,   parent: 1,      id: 2 }, 
    {   name: &#39;文本3&#39;,   parent: 2,      id: 3 },
    {   name: &#39;文本4&#39;,   parent: null,   id: 4 },
    {   name: &#39;文本5&#39;,   parent: 4,      id: 5 }
] 
// 树状数据 
[
    {   
        name: &#39;文本1&#39;,   
        id: 1,   
        children: [
            {     
                name: &#39;文本2&#39;,     
                id: 2,     
                children: [
                    {       
                        name: &#39;文本3&#39;,       
                        id: 3,
                        children: [],   
                    }
                ]   
            }
        ] 
    }, {
        name: &quot;文本4&quot;,
        id: 4,
        children: [
            {
                name: &#39;文本5&#39;,
                id: 5,
                children: [],
            }
        ]
    }
] 
*/</span>

<span class="token comment">// 反正力扣或者牛客上都有</span>

<span class="token keyword">interface</span> <span class="token class-name">TreeNode</span> <span class="token punctuation">{</span>
    name<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span>
    parent<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">number</span> <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    id<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">convert2Tree</span><span class="token punctuation">(</span>arr<span class="token operator">:</span> TreeNode<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> map<span class="token operator">:</span> Map<span class="token operator">&lt;</span><span class="token builtin">number</span><span class="token punctuation">,</span> TreeNode<span class="token operator">&gt;</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword">const</span> rootNode<span class="token operator">:</span> TreeNode<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

    <span class="token comment">// 遍历</span>
    arr<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>item <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> node <span class="token operator">=</span> <span class="token punctuation">{</span>
            name<span class="token operator">:</span> item<span class="token punctuation">.</span>name<span class="token punctuation">,</span>
            id<span class="token operator">:</span> item<span class="token punctuation">.</span>id<span class="token punctuation">,</span>
            children<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
        <span class="token punctuation">}</span>
        map<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>item<span class="token punctuation">.</span>id<span class="token punctuation">,</span> node<span class="token punctuation">)</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>item<span class="token punctuation">.</span>parent <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            rootNode<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>node<span class="token punctuation">)</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            <span class="token keyword">const</span> parent <span class="token operator">=</span> map<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>item<span class="token punctuation">.</span>parent<span class="token punctuation">)</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>parent<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                parent<span class="token punctuation">.</span>children<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>node<span class="token punctuation">)</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token keyword">return</span> rootNode
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>作用域查找(完全答错) 一开始的直觉是没什么问题的,被问了两下有点不确定了,唉</li></ol><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token function">a</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token keyword">let</span> test<span class="token punctuation">;</span>
  <span class="token comment">/* 作用域a */</span> 
  <span class="token keyword">return</span> <span class="token keyword">function</span> <span class="token function">b</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>  
    <span class="token keyword">let</span> test<span class="token punctuation">;</span>
    <span class="token comment">/* 作用域链 b -&gt; ? */</span> 
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token keyword">function</span> <span class="token function">c</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token keyword">let</span> test<span class="token punctuation">;</span>
  <span class="token comment">/* 作用域c */</span>
  <span class="token keyword">const</span> fn <span class="token operator">=</span> <span class="token function">a</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">fn</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token function">c</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上的代码,假设test都有可能不存在的话,查找test的顺序是什么样子的?</p><p>变量 test 的查找顺序：</p><p>当 b() 被调用时，它会按照以下顺序查找 test：</p><p>b() 自己的作用域：首先在 b() 内部查找 let test;。如果存在，则使用这个 test</p><p>a() 的作用域：如果 b() 内部没有 test，则会沿着作用域链向上查找 a() 的作用域，查找 a() 中的 let test;</p><p>全局作用域：如果 a() 中也没有 test，则会继续向上查找全局作用域</p><p>具体执行过程： c() 被调用，创建 c() 的作用域，其中包含 let test;</p><p>c() 调用 a()，a() 创建自己的作用域，其中包含 let test;</p><p>a() 返回 b()，c() 将 b() 赋值给 fn</p><p>c() 调用 fn()，即 b()</p><p>b() 开始执行，首先在自己的作用域内查找 test：</p><p>如果 b() 内部有 let test;，则使用这个 test</p><p>如果 b() 内部没有 test，则向上查找 a() 的作用域，查找 a() 中的 let test;</p><p>如果 a() 中也没有 test，则继续向上查找全局作用域</p><ol start="3"><li><p>computed中,是怎么收集副作用函数的 说实话这个问到我了,记在这里,最多后天,等我抽空再读一下源码再来回答一次</p></li><li><p>问项目,最多后天,把所有项目整理一下,搞得自己项目都记不清</p></li></ol>`,19);function c(l,o){return s(),a("div",null,[e("more"),i])}const d=n(p,[["render",c],["__file","20250224智现未来.html.vue"]]);export{d as default};
