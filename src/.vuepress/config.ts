import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import {copyCodePlugin} from "vuepress-plugin-copy-code2";

const siteBase = process.env.SITE_BASE ?? "/";

export default defineUserConfig({
  base: siteBase,

  locales: {
    "/": {
      lang: "zh-CN",
      title: "秦篆",
      description: "",
    },
  },

  theme,

  shouldPrefetch: false,
});
