import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import {copyCodePlugin} from "vuepress-plugin-copy-code2";

export default defineUserConfig({
  base: "/",

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
