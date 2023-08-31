// src/.vuepress/config.ts
import { defineUserConfig } from "vuepress";
import { dynamicTitlePlugin } from "@vuepress-denaro/vuepress-plugin-dynamic-title";

// src/.vuepress/theme.ts
import { hopeTheme } from "vuepress-theme-hope";

// src/.vuepress/navbar/index.ts
import { navbar } from "vuepress-theme-hope";
var zhNavbar = navbar([
  "/",
  {
    text: "\u8D70\u9A6C\u6C5F\u6E56",
    icon: "/assets/icon/jiu_16.svg",
    prefix: "/posts/work/",
    children: [
      "README.md"
    ]
  },
  {
    text: "\u783A\u5251",
    icon: "/assets/icon/jian_16.svg",
    prefix: "/posts/learn",
    children: [
      {
        text: "\u5237\u9898\u7B14\u8BB0",
        icon: "edit",
        link: "/simulation/"
      },
      {
        text: "\u5B66\u4E60\u7B14\u8BB0",
        icon: "note",
        link: "/note/"
      },
      {
        text: "\u7B97\u6CD5\u7B14\u8BB0",
        icon: "code",
        link: "/algorithm/"
      }
    ]
  },
  {
    text: "\u95F2\u60C5\u9038\u81F4",
    icon: "/assets/icon/zheshan.svg",
    prefix: "/posts/carefree/",
    children: [
      "README.md"
    ]
  }
]);

// src/.vuepress/sidebar/index.ts
import { sidebar } from "vuepress-theme-hope";
var zhSidebar = sidebar({
  "/": [],
  "/posts/work/": "structure",
  "/posts/learn/note/": "structure",
  "/posts/learn/simulation/": "structure",
  "/posts/learn/algorithm/": "structure",
  "/posts/carefree/": "structure"
});

// src/.vuepress/theme.ts
var theme_default = hopeTheme({
  hostname: "https://lljl500220.github.io/",
  author: {
    name: "\u79E6\u7BC6",
    url: "https://qinzhuan.top"
  },
  favicon: "/assets/favicon.png",
  iconAssets: "iconfont",
  logo: "/assets/favicon.png",
  docsDir: "docs",
  pageInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime"],
  blog: {
    medias: {
      GitHub: "https://github.com/lljl500220/",
      QQ: "http://wpa.qq.com/msgrd?v=3&uin=1723377108&site=qq&menu=yes",
      Steam: "https://steamcommunity.com/profiles/76561199066457326/"
    }
  },
  locales: {
    "/": {
      // navbar
      navbar: zhNavbar,
      // sidebar
      sidebar: zhSidebar,
      footer: "\u4E00\u4E2A\u8010\u6495\u7684\u524D\u7AEF",
      displayFooter: true,
      blog: {
        description: "\u4E00\u4E2A\u524D\u7AEF\u5F00\u53D1\u8005",
        intro: "/intro.html"
      }
    }
  },
  plugins: {
    blog: true,
    copyCode: {},
    // If you don’t need comment feature, you can remove following option
    // The following config is for demo ONLY, if you need comment feature, please generate and use your own config, see comment plugin documentation for details.
    // To avoid disturbing the theme developer and consuming his resources, please DO NOT use the following config directly in your production environment!!!!!
    comment: {
      /**
       * Using Giscus
       */
      // provider: "Giscus",
      // repo: "vuepress-theme-hope/giscus-discussions",
      // repoId: "R_kgDOG_Pt2A",
      // category: "Announcements",
      // categoryId: "DIC_kwDOG_Pt2M4COD69",
      /**
       * Using Twikoo
       */
      // provider: "Twikoo",
      // envId: "https://twikoo.ccknbc.vercel.app",
      /**
       * Using Waline
       */
      // provider: "Waline",
      // serverURL: "https://vuepress-theme-hope-comment.vercel.app",
    },
    // Disable features you don’t want here
    mdEnhance: {
      align: true,
      attrs: true,
      chart: true,
      codetabs: true,
      container: true,
      demo: true,
      echarts: true,
      figure: true,
      flowchart: true,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      katex: true,
      mark: true,
      tasklist: true,
      mermaid: true,
      playground: {
        presets: ["ts", "vue"]
      },
      presentation: {
        plugins: ["highlight", "math", "search", "notes", "zoom"]
      },
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended"
              };
          }
        }
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
      vuePlayground: true
    }
  }
});

// src/.vuepress/config.ts
var config_default = defineUserConfig({
  base: "/",
  locales: {
    "/": {
      lang: "zh-CN",
      title: "\u6C34\u6708\u6D1E\u5929",
      description: "\u7405\u5B1B\u798F\u5730\uFF0C\u6C34\u6708\u6D1E\u5929\u3002"
    }
  },
  theme: theme_default,
  plugins: [
    dynamicTitlePlugin({
      showIcon: "",
      // The icon displayed when the document is in the current tab.
      showText: "(/\u2267\u25BD\u2266/)\u54A6\uFF01\u53C8\u597D\u4E86\uFF01",
      // The title displayed when the document is in the current tab.
      hideIcon: "",
      // The icon displayed when the document is not in the current tab.
      hideText: "(\u25CF\u2014\u25CF)\u5594\u54DF, \u5D29\u6E83\u5566\uFF01",
      // The title displayed when the document is not in the current tab.
      recoverTime: 2e3
      // The time to recover the title after the tab is changed.
    })
  ],
  shouldPrefetch: false
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjLy52dWVwcmVzcy9jb25maWcudHMiLCAic3JjLy52dWVwcmVzcy90aGVtZS50cyIsICJzcmMvLnZ1ZXByZXNzL25hdmJhci9pbmRleC50cyIsICJzcmMvLnZ1ZXByZXNzL3NpZGViYXIvaW5kZXgudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOi9sbGpsNTAwMjIwLmdpdGh1Yi5pby9zcmMvLnZ1ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJGOlxcXFxsbGpsNTAwMjIwLmdpdGh1Yi5pb1xcXFxzcmNcXFxcLnZ1ZXByZXNzXFxcXGNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRjovbGxqbDUwMDIyMC5naXRodWIuaW8vc3JjLy52dWVwcmVzcy9jb25maWcudHNcIjtpbXBvcnQge2RlZmluZVVzZXJDb25maWd9IGZyb20gXCJ2dWVwcmVzc1wiO1xyXG5pbXBvcnQgeyBkeW5hbWljVGl0bGVQbHVnaW4gfSBmcm9tICdAdnVlcHJlc3MtZGVuYXJvL3Z1ZXByZXNzLXBsdWdpbi1keW5hbWljLXRpdGxlJ1xyXG5pbXBvcnQgdGhlbWUgZnJvbSBcIi4vdGhlbWUuanNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZVVzZXJDb25maWcoe1xyXG4gICAgYmFzZTogXCIvXCIsXHJcblxyXG4gICAgbG9jYWxlczoge1xyXG4gICAgICAgIFwiL1wiOiB7XHJcbiAgICAgICAgICAgIGxhbmc6IFwiemgtQ05cIixcclxuICAgICAgICAgICAgdGl0bGU6IFwiXHU2QzM0XHU2NzA4XHU2RDFFXHU1OTI5XCIsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlx1NzQwNVx1NUIxQlx1Nzk4Rlx1NTczMFx1RkYwQ1x1NkMzNFx1NjcwOFx1NkQxRVx1NTkyOVx1MzAwMlwiLFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG5cclxuICAgIHRoZW1lLFxyXG4gICAgcGx1Z2luczpbXHJcbiAgICAgICAgZHluYW1pY1RpdGxlUGx1Z2luKHtcclxuICAgICAgICAgICAgc2hvd0ljb246ICcnLCAvLyBUaGUgaWNvbiBkaXNwbGF5ZWQgd2hlbiB0aGUgZG9jdW1lbnQgaXMgaW4gdGhlIGN1cnJlbnQgdGFiLlxyXG4gICAgICAgICAgICBzaG93VGV4dDogJygvXHUyMjY3XHUyNUJEXHUyMjY2LylcdTU0QTZcdUZGMDFcdTUzQzhcdTU5N0RcdTRFODZcdUZGMDEnLCAvLyBUaGUgdGl0bGUgZGlzcGxheWVkIHdoZW4gdGhlIGRvY3VtZW50IGlzIGluIHRoZSBjdXJyZW50IHRhYi5cclxuICAgICAgICAgICAgaGlkZUljb246ICcnLCAvLyBUaGUgaWNvbiBkaXNwbGF5ZWQgd2hlbiB0aGUgZG9jdW1lbnQgaXMgbm90IGluIHRoZSBjdXJyZW50IHRhYi5cclxuICAgICAgICAgICAgaGlkZVRleHQ6ICcoXHUyNUNGXHUyMDE0XHUyNUNGKVx1NTU5NFx1NTRERiwgXHU1RDI5XHU2RTgzXHU1NTY2XHVGRjAxJywgLy8gVGhlIHRpdGxlIGRpc3BsYXllZCB3aGVuIHRoZSBkb2N1bWVudCBpcyBub3QgaW4gdGhlIGN1cnJlbnQgdGFiLlxyXG4gICAgICAgICAgICByZWNvdmVyVGltZTogMjAwMCwgLy8gVGhlIHRpbWUgdG8gcmVjb3ZlciB0aGUgdGl0bGUgYWZ0ZXIgdGhlIHRhYiBpcyBjaGFuZ2VkLlxyXG4gICAgICAgIH0pLFxyXG5cclxuICAgIF0sXHJcbiAgICBzaG91bGRQcmVmZXRjaDogZmFsc2UsXHJcbn0pO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkY6L2xsamw1MDAyMjAuZ2l0aHViLmlvL3NyYy8udnVlcHJlc3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkY6XFxcXGxsamw1MDAyMjAuZ2l0aHViLmlvXFxcXHNyY1xcXFwudnVlcHJlc3NcXFxcdGhlbWUudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Y6L2xsamw1MDAyMjAuZ2l0aHViLmlvL3NyYy8udnVlcHJlc3MvdGhlbWUudHNcIjtpbXBvcnQgeyBob3BlVGhlbWUgfSBmcm9tIFwidnVlcHJlc3MtdGhlbWUtaG9wZVwiO1xyXG5pbXBvcnQgeyB6aE5hdmJhciB9IGZyb20gXCIuL25hdmJhclwiO1xyXG5pbXBvcnQgeyB6aFNpZGViYXIgfSBmcm9tIFwiLi9zaWRlYmFyXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBob3BlVGhlbWUoe1xyXG4gIGhvc3RuYW1lOiBcImh0dHBzOi8vbGxqbDUwMDIyMC5naXRodWIuaW8vXCIsXHJcblxyXG4gIGF1dGhvcjoge1xyXG4gICAgbmFtZTogXCJcdTc5RTZcdTdCQzZcIixcclxuICAgIHVybDogXCJodHRwczovL3FpbnpodWFuLnRvcFwiLFxyXG4gIH0sXHJcblxyXG4gIGZhdmljb246IFwiL2Fzc2V0cy9mYXZpY29uLnBuZ1wiLFxyXG5cclxuICBpY29uQXNzZXRzOiBcImljb25mb250XCIsXHJcblxyXG4gIGxvZ286IFwiL2Fzc2V0cy9mYXZpY29uLnBuZ1wiLFxyXG5cclxuICBkb2NzRGlyOiBcImRvY3NcIixcclxuXHJcbiAgcGFnZUluZm86IFtcIkF1dGhvclwiLCBcIk9yaWdpbmFsXCIsIFwiRGF0ZVwiLCBcIkNhdGVnb3J5XCIsIFwiVGFnXCIsIFwiUmVhZGluZ1RpbWVcIl0sXHJcblxyXG4gIGJsb2c6IHtcclxuICAgIG1lZGlhczoge1xyXG4gICAgICBHaXRIdWI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2xsamw1MDAyMjAvXCIsXHJcbiAgICAgIFFROiBcImh0dHA6Ly93cGEucXEuY29tL21zZ3JkP3Y9MyZ1aW49MTcyMzM3NzEwOCZzaXRlPXFxJm1lbnU9eWVzXCIsXHJcbiAgICAgIFN0ZWFtOiBcImh0dHBzOi8vc3RlYW1jb21tdW5pdHkuY29tL3Byb2ZpbGVzLzc2NTYxMTk5MDY2NDU3MzI2L1wiLFxyXG4gICAgfSxcclxuICB9LFxyXG5cclxuICBsb2NhbGVzOiB7XHJcbiAgICBcIi9cIjoge1xyXG4gICAgICAvLyBuYXZiYXJcclxuICAgICAgbmF2YmFyOiB6aE5hdmJhcixcclxuXHJcbiAgICAgIC8vIHNpZGViYXJcclxuICAgICAgc2lkZWJhcjogemhTaWRlYmFyLFxyXG5cclxuICAgICAgZm9vdGVyOiBcIlx1NEUwMFx1NEUyQVx1ODAxMFx1NjQ5NVx1NzY4NFx1NTI0RFx1N0FFRlwiLFxyXG5cclxuICAgICAgZGlzcGxheUZvb3RlcjogdHJ1ZSxcclxuXHJcbiAgICAgIGJsb2c6IHtcclxuICAgICAgICBkZXNjcmlwdGlvbjogXCJcdTRFMDBcdTRFMkFcdTUyNERcdTdBRUZcdTVGMDBcdTUzRDFcdTgwMDVcIixcclxuICAgICAgICBpbnRybzogXCIvaW50cm8uaHRtbFwiLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG5cclxuICBwbHVnaW5zOiB7XHJcbiAgICBibG9nOiB0cnVlLFxyXG4gICAgY29weUNvZGU6e30sXHJcbiAgICAvLyBJZiB5b3UgZG9uXHUyMDE5dCBuZWVkIGNvbW1lbnQgZmVhdHVyZSwgeW91IGNhbiByZW1vdmUgZm9sbG93aW5nIG9wdGlvblxyXG4gICAgLy8gVGhlIGZvbGxvd2luZyBjb25maWcgaXMgZm9yIGRlbW8gT05MWSwgaWYgeW91IG5lZWQgY29tbWVudCBmZWF0dXJlLCBwbGVhc2UgZ2VuZXJhdGUgYW5kIHVzZSB5b3VyIG93biBjb25maWcsIHNlZSBjb21tZW50IHBsdWdpbiBkb2N1bWVudGF0aW9uIGZvciBkZXRhaWxzLlxyXG4gICAgLy8gVG8gYXZvaWQgZGlzdHVyYmluZyB0aGUgdGhlbWUgZGV2ZWxvcGVyIGFuZCBjb25zdW1pbmcgaGlzIHJlc291cmNlcywgcGxlYXNlIERPIE5PVCB1c2UgdGhlIGZvbGxvd2luZyBjb25maWcgZGlyZWN0bHkgaW4geW91ciBwcm9kdWN0aW9uIGVudmlyb25tZW50ISEhISFcclxuICAgIGNvbW1lbnQ6IHtcclxuICAgICAgLyoqXHJcbiAgICAgICAqIFVzaW5nIEdpc2N1c1xyXG4gICAgICAgKi9cclxuICAgICAgLy8gcHJvdmlkZXI6IFwiR2lzY3VzXCIsXHJcbiAgICAgIC8vIHJlcG86IFwidnVlcHJlc3MtdGhlbWUtaG9wZS9naXNjdXMtZGlzY3Vzc2lvbnNcIixcclxuICAgICAgLy8gcmVwb0lkOiBcIlJfa2dET0dfUHQyQVwiLFxyXG4gICAgICAvLyBjYXRlZ29yeTogXCJBbm5vdW5jZW1lbnRzXCIsXHJcbiAgICAgIC8vIGNhdGVnb3J5SWQ6IFwiRElDX2t3RE9HX1B0Mk00Q09ENjlcIixcclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBVc2luZyBUd2lrb29cclxuICAgICAgICovXHJcbiAgICAgIC8vIHByb3ZpZGVyOiBcIlR3aWtvb1wiLFxyXG4gICAgICAvLyBlbnZJZDogXCJodHRwczovL3R3aWtvby5jY2tuYmMudmVyY2VsLmFwcFwiLFxyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIFVzaW5nIFdhbGluZVxyXG4gICAgICAgKi9cclxuICAgICAgLy8gcHJvdmlkZXI6IFwiV2FsaW5lXCIsXHJcbiAgICAgIC8vIHNlcnZlclVSTDogXCJodHRwczovL3Z1ZXByZXNzLXRoZW1lLWhvcGUtY29tbWVudC52ZXJjZWwuYXBwXCIsXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvLyBEaXNhYmxlIGZlYXR1cmVzIHlvdSBkb25cdTIwMTl0IHdhbnQgaGVyZVxyXG4gICAgbWRFbmhhbmNlOiB7XHJcbiAgICAgIGFsaWduOiB0cnVlLFxyXG4gICAgICBhdHRyczogdHJ1ZSxcclxuICAgICAgY2hhcnQ6IHRydWUsXHJcbiAgICAgIGNvZGV0YWJzOiB0cnVlLFxyXG4gICAgICBjb250YWluZXI6IHRydWUsXHJcbiAgICAgIGRlbW86IHRydWUsXHJcbiAgICAgIGVjaGFydHM6IHRydWUsXHJcbiAgICAgIGZpZ3VyZTogdHJ1ZSxcclxuICAgICAgZmxvd2NoYXJ0OiB0cnVlLFxyXG4gICAgICBnZm06IHRydWUsXHJcbiAgICAgIGltZ0xhenlsb2FkOiB0cnVlLFxyXG4gICAgICBpbWdTaXplOiB0cnVlLFxyXG4gICAgICBpbmNsdWRlOiB0cnVlLFxyXG4gICAgICBrYXRleDogdHJ1ZSxcclxuICAgICAgbWFyazogdHJ1ZSxcclxuICAgICAgdGFza2xpc3Q6IHRydWUsXHJcbiAgICAgIG1lcm1haWQ6IHRydWUsXHJcbiAgICAgIHBsYXlncm91bmQ6IHtcclxuICAgICAgICBwcmVzZXRzOiBbXCJ0c1wiLCBcInZ1ZVwiXSxcclxuICAgICAgfSxcclxuICAgICAgcHJlc2VudGF0aW9uOiB7XHJcbiAgICAgICAgcGx1Z2luczogW1wiaGlnaGxpZ2h0XCIsIFwibWF0aFwiLCBcInNlYXJjaFwiLCBcIm5vdGVzXCIsIFwiem9vbVwiXSxcclxuICAgICAgfSxcclxuICAgICAgc3R5bGl6ZTogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIG1hdGNoZXI6IFwiUmVjb21tZW5kZWRcIixcclxuICAgICAgICAgIHJlcGxhY2VyOiAoe3RhZ30pID0+IHtcclxuICAgICAgICAgICAgaWYgKHRhZyA9PT0gXCJlbVwiKVxyXG4gICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0YWc6IFwiQmFkZ2VcIixcclxuICAgICAgICAgICAgICAgIGF0dHJzOiB7dHlwZTogXCJ0aXBcIn0sXHJcbiAgICAgICAgICAgICAgICBjb250ZW50OiBcIlJlY29tbWVuZGVkXCIsXHJcbiAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgICAgc3ViOiB0cnVlLFxyXG4gICAgICBzdXA6IHRydWUsXHJcbiAgICAgIHRhYnM6IHRydWUsXHJcbiAgICAgIHZQcmU6IHRydWUsXHJcbiAgICAgIHZ1ZVBsYXlncm91bmQ6IHRydWUsXHJcbiAgICB9LFxyXG4gIH0sXHJcblxyXG59KTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOi9sbGpsNTAwMjIwLmdpdGh1Yi5pby9zcmMvLnZ1ZXByZXNzL25hdmJhclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRjpcXFxcbGxqbDUwMDIyMC5naXRodWIuaW9cXFxcc3JjXFxcXC52dWVwcmVzc1xcXFxuYXZiYXJcXFxcaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Y6L2xsamw1MDAyMjAuZ2l0aHViLmlvL3NyYy8udnVlcHJlc3MvbmF2YmFyL2luZGV4LnRzXCI7aW1wb3J0IHtuYXZiYXJ9IGZyb20gXCJ2dWVwcmVzcy10aGVtZS1ob3BlXCI7XHJcblxyXG5leHBvcnQgY29uc3QgemhOYXZiYXIgPSBuYXZiYXIoW1xyXG4gICAgXCIvXCIsXHJcbiAgICB7XHJcbiAgICAgICAgdGV4dDogXCJcdThENzBcdTlBNkNcdTZDNUZcdTZFNTZcIixcclxuICAgICAgICBpY29uOiBcIi9hc3NldHMvaWNvbi9qaXVfMTYuc3ZnXCIsXHJcbiAgICAgICAgcHJlZml4OiBcIi9wb3N0cy93b3JrL1wiLFxyXG4gICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgIFwiUkVBRE1FLm1kXCJcclxuICAgICAgICBdLFxyXG4gICAgfSwge1xyXG4gICAgICAgIHRleHQ6IFwiXHU3ODNBXHU1MjUxXCIsXHJcbiAgICAgICAgaWNvbjogXCIvYXNzZXRzL2ljb24vamlhbl8xNi5zdmdcIixcclxuICAgICAgICBwcmVmaXg6IFwiL3Bvc3RzL2xlYXJuXCIsXHJcbiAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogXCJcdTUyMzdcdTk4OThcdTdCMTRcdThCQjBcIixcclxuICAgICAgICAgICAgICAgIGljb246IFwiZWRpdFwiLFxyXG4gICAgICAgICAgICAgICAgbGluazogXCIvc2ltdWxhdGlvbi9cIlxyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBcIlx1NUI2Nlx1NEU2MFx1N0IxNFx1OEJCMFwiLFxyXG4gICAgICAgICAgICAgICAgaWNvbjogXCJub3RlXCIsXHJcbiAgICAgICAgICAgICAgICBsaW5rOiBcIi9ub3RlL1wiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBcIlx1N0I5N1x1NkNENVx1N0IxNFx1OEJCMFwiLFxyXG4gICAgICAgICAgICAgICAgaWNvbjogXCJjb2RlXCIsXHJcbiAgICAgICAgICAgICAgICBsaW5rOiBcIi9hbGdvcml0aG0vXCIsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdLFxyXG4gICAgfSwge1xyXG4gICAgICAgIHRleHQ6IFwiXHU5NUYyXHU2MEM1XHU5MDM4XHU4MUY0XCIsXHJcbiAgICAgICAgaWNvbjogXCIvYXNzZXRzL2ljb24vemhlc2hhbi5zdmdcIixcclxuICAgICAgICBwcmVmaXg6IFwiL3Bvc3RzL2NhcmVmcmVlL1wiLFxyXG4gICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgIFwiUkVBRE1FLm1kXCJcclxuICAgICAgICBdLFxyXG4gICAgfSxcclxuXSk7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRjovbGxqbDUwMDIyMC5naXRodWIuaW8vc3JjLy52dWVwcmVzcy9zaWRlYmFyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJGOlxcXFxsbGpsNTAwMjIwLmdpdGh1Yi5pb1xcXFxzcmNcXFxcLnZ1ZXByZXNzXFxcXHNpZGViYXJcXFxcaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Y6L2xsamw1MDAyMjAuZ2l0aHViLmlvL3NyYy8udnVlcHJlc3Mvc2lkZWJhci9pbmRleC50c1wiO2ltcG9ydCB7IHNpZGViYXIgfSBmcm9tIFwidnVlcHJlc3MtdGhlbWUtaG9wZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IHpoU2lkZWJhciA9IHNpZGViYXIoe1xyXG4gICAgXCIvXCI6W1xyXG5cclxuICAgIF0sXHJcbiAgICBcIi9wb3N0cy93b3JrL1wiOlwic3RydWN0dXJlXCIsXHJcbiAgICBcIi9wb3N0cy9sZWFybi9ub3RlL1wiOlwic3RydWN0dXJlXCIsXHJcbiAgICBcIi9wb3N0cy9sZWFybi9zaW11bGF0aW9uL1wiOlwic3RydWN0dXJlXCIsXHJcbiAgICBcIi9wb3N0cy9sZWFybi9hbGdvcml0aG0vXCI6XCJzdHJ1Y3R1cmVcIixcclxuICAgIFwiL3Bvc3RzL2NhcmVmcmVlL1wiOlwic3RydWN0dXJlXCJcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFIsU0FBUSx3QkFBdUI7QUFDM1QsU0FBUywwQkFBMEI7OztBQ0R1UCxTQUFTLGlCQUFpQjs7O0FDQUosU0FBUSxjQUFhO0FBRTlULElBQU0sV0FBVyxPQUFPO0FBQUEsRUFDM0I7QUFBQSxFQUNBO0FBQUEsSUFDSSxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsSUFDUixVQUFVO0FBQUEsTUFDTjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFBRztBQUFBLElBQ0MsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sUUFBUTtBQUFBLElBQ1IsVUFBVTtBQUFBLE1BQ047QUFBQSxRQUNJLE1BQU07QUFBQSxRQUNOLE1BQU07QUFBQSxRQUNOLE1BQU07QUFBQSxNQUNWO0FBQUEsTUFBRztBQUFBLFFBQ0MsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLE1BQ1Y7QUFBQSxNQUNBO0FBQUEsUUFDSSxNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEs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
