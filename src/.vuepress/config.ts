import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import {copyCodePlugin} from "vuepress-plugin-copy-code2";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "zh-CN",
      title: "水月洞天",
      description: "琅嬛福地，水月洞天。",
    },
  },

  theme,

  shouldPrefetch: false,
});
