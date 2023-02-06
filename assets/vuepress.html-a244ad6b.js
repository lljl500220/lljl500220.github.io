import{_ as n,V as s,W as a,X as e,Y as t,a1 as p}from"./framework-99671185.js";const c="/carefree/vuepress_warn.png",i={},l=t("p",null,"开始使用vuepress的时候，学习到了在md文件中直接使用vue语法和语法糖的方法 起初是没什么太大的问题，直接使用即可。但是最近发现这种语法使用方式，会影响到 run build之后的命令执行，node进程不知被卡在了什么地方，无法继续，也不会退出终端。",-1),u=p('<figure><img src="'+c+`" alt="build之后不会结束终端任务" tabindex="0" loading="lazy"><figcaption>build之后不会结束终端任务</figcaption></figure><p>构建任务已经执行完毕，dist也能正确输出，如果是手动部署至github page的话，确实没什么 问题，但是如果使用的是github的action或者其它类似的ci，那么就会一直卡住在这里，无法 部署成功。</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code>      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 构建文档
        <span class="token key atrule">env</span><span class="token punctuation">:</span>
          <span class="token key atrule">NODE_OPTIONS</span><span class="token punctuation">:</span> <span class="token punctuation">-</span><span class="token punctuation">-</span>max_old_space_size=8192
        <span class="token key atrule">run</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token punctuation">-</span>
          npm run docs<span class="token punctuation">:</span>build
          <span class="token punctuation">&gt;</span> src/.vuepress/dist/.nojekyll

      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 部署文档
        <span class="token key atrule">uses</span><span class="token punctuation">:</span> JamesIves/github<span class="token punctuation">-</span>pages<span class="token punctuation">-</span>deploy<span class="token punctuation">-</span>action@v4
        <span class="token key atrule">with</span><span class="token punctuation">:</span>
          <span class="token comment"># 这是文档部署到的分支名称</span>
          <span class="token key atrule">branch</span><span class="token punctuation">:</span> gh<span class="token punctuation">-</span>deploy
          <span class="token key atrule">folder</span><span class="token punctuation">:</span> src/.vuepress/dist
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>思来想去也没个头绪，之前一直是没什么问题的，也能正确构建。后来想起，昨天为了尝试pnpm，执行了一次 install命令，主题的版本和 vuepress的版本被更新了。这次更新直接导致了我无法在md中使用vue代码， 如果是手动部署，那没什么问题。但是如果是通过action执行的话，在2.0.0-beta.171版本下，就不能在md 文件中使用vue代码</p>`,4);function o(r,d){return s(),a("div",null,[l,e(" more "),u])}const k=n(i,[["render",o],["__file","vuepress.html.vue"]]);export{k as default};