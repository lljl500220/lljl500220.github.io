import { defineClientConfig } from "@vuepress/client";
import Resume from "./components/Resume.vue";

export default defineClientConfig({
  enhance({ router }) {
    router.addRoute({
      path: "/resume.html",
      component: Resume,
      meta: {
        title: "在线简历",
      },
    });
  },
});


