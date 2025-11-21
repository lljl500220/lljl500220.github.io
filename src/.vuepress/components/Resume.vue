<template>
  <div class="resume-page">
    <div class="resume-container">
      <header class="resume-header">
        <div class="header-left">
          <h1>{{ profile.name }} <span class="position-tag">{{ profile.position }}</span></h1>
          <div class="contact-info">
            <span>{{ profile.email }}</span>
            <span>{{ profile.phone }}</span>
            <span>{{ profile.location }}</span>
          </div>
          <p class="education">{{ profile.school }}</p>
        </div>
        <div class="header-right"></div>
      </header>

      <section class="resume-section">
        <div class="section-heading">
          <h2>工作经历</h2>
          <div class="section-progress">
            <div class="section-progress-leaf"></div>
            <div class="section-progress-track">
              <div class="section-progress-fill"></div>
            </div>
          </div>
        </div>
        <div class="timeline">
          <div
            v-for="(exp, index) in experience"
            :key="index"
            class="timeline-item"
          >
            <div class="timeline-left">
              <div
                class="timeline-dot"
                :ref="el => setTimelineLeafRef(el as HTMLDivElement | null, index)"
              ></div>
              <div class="timeline-line" v-if="index !== experience.length - 1"></div>
            </div>
            <div class="timeline-content">
              <div class="timeline-header">
                <span class="timeline-date">{{ exp.date }}</span>
                <h3 class="timeline-title">
                  {{ exp.company }} · {{ exp.position }}
                </h3>
              </div>
              <ul class="details">
                <li v-for="(detail, i) in exp.details" :key="i">{{ detail }}</li>
              </ul>
              <div v-if="exp.tags?.length" class="exp-tags">
                <span v-for="tag in exp.tags" :key="tag" class="exp-tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="resume-section">
        <div class="section-heading">
          <h2>重点项目</h2>
          <div class="section-progress">
            <div class="section-progress-leaf"></div>
            <div class="section-progress-track">
              <div class="section-progress-fill"></div>
            </div>
          </div>
        </div>
        <div class="project-list">
          <div
            v-for="(project, index) in projects"
            :key="index"
            class="timeline-item project-item"
          >
            <div class="timeline-left">
              <div
                class="timeline-dot project-dot"
                :ref="el => setProjectLeafRef(el as HTMLDivElement | null, index)"
              ></div>
              <div class="timeline-line" v-if="index !== projects.length - 1"></div>
            </div>
            <div class="timeline-content project-card">
              <div class="timeline-header">
                <span class="timeline-date">{{ project.date }}</span>
                <h3 class="timeline-title">
                  <a v-if="project.link" :href="project.link" target="_blank" class="project-link">
                    {{ project.name }}
                  </a>
                  <span v-else>{{ project.name }}</span>
                </h3>
              </div>
              <p class="subtitle">{{ project.description }}</p>
              <ul class="details">
                <li v-for="(detail, i) in project.details" :key="i">{{ detail }}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import lottie from "lottie-web";

let sectionLeafAnimations: any[] = [];
const timelineLeafRefs = ref<(HTMLDivElement | null)[]>([]);
let timelineLeafAnimations: any[] = [];
const projectLeafRefs = ref<(HTMLDivElement | null)[]>([]);
let projectLeafAnimations: any[] = [];

const setTimelineLeafRef = (el: HTMLDivElement | null, index: number) => {
  if (!el) return;
  timelineLeafRefs.value[index] = el;
};

const setProjectLeafRef = (el: HTMLDivElement | null, index: number) => {
  if (!el) return;
  projectLeafRefs.value[index] = el;
};

onMounted(async () => {
  // 顶部两个装饰条右侧的叶子
  const sectionLeafNodes = document.querySelectorAll<HTMLDivElement>(".section-progress-leaf");
  sectionLeafNodes.forEach((el, index) => {
    const anim = lottie.loadAnimation({
      container: el,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/assets/lotties/leaf.json",
      name: `section_leaf_${index}`,
    });
    sectionLeafAnimations.push(anim);
  });

  // 初始化时间线上的叶子节点
  timelineLeafRefs.value.forEach((el, index) => {
    if (!el) return;
    const anim = lottie.loadAnimation({
      container: el,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/assets/lotties/leaf_icon.json",
      name: `timeline_leaf_${index}`,
    });
    timelineLeafAnimations.push(anim);
  });

  // 初始化项目上的叶子节点
  projectLeafRefs.value.forEach((el, index) => {
    if (!el) return;
    const anim = lottie.loadAnimation({
      container: el,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/assets/lotties/leaf_icon_2.json",
      name: `project_leaf_${index}`,
    });
    projectLeafAnimations.push(anim);
  });
});

onBeforeUnmount(() => {
  if (sectionLeafAnimations.length) {
    sectionLeafAnimations.forEach((a) => a.destroy && a.destroy());
    sectionLeafAnimations = [];
  }

  if (timelineLeafAnimations.length) {
    timelineLeafAnimations.forEach((a) => a.destroy && a.destroy());
    timelineLeafAnimations = [];
  }

  if (projectLeafAnimations.length) {
    projectLeafAnimations.forEach((a) => a.destroy && a.destroy());
    projectLeafAnimations = [];
  }
});

const profile = ref({
  name: "罗龙江",
  position: "前端开发",
  email: "1723377108@qq.com",
  phone: "18755192440",
  location: "武汉",
  school: "合肥工业大学 · 软件工程 (2021)",
});

const customText = ref("");

const experience = ref([
  {
    company: "中科院电子学研究所(现空天信息研究院)",
    position: "工程师",
    date: "实习，签订三方协议",
    details: [
      "搭建电子学研究所的 DevOps 平台，参与搭建本地化 Jenkins、Sonar、GitLab 等服务器，实现代码自动化构建、质量检查与自动部署。"
    ],
    tags: ["DevOps 平台", "CI/CD 流水线", "自动化部署"],
  },
  {
    company: "思特奇信息技术股份有限公司",
    position: "前端工程师",
    date: "2021.01 - 2024.05",
    details: [
      "前端负责人，实习生导师，带领前端团队支持公司在贵州业务开展，协调人员分工；负责新人培训，项目管理，技术分享等。",
      "构建了思特奇贵阳研发中心前端组件库，构建了项目init脚手架，实现了统一风格项目的快速初始化。",
      "参与项目开发，负责了黔云通，贵人家园，全省统一石化平台等项目的落地",
    ],
    tags: ["前端工程化", "组件库 / 脚手架", "团队培养", "从0到1项目落地","vue2,vue3,pwa,electron"],
  },
  {
    company: "集度汽车(外包)",
    position: "前端工程师",
    date: "2024.05 - 2024.12",
    details: [
      "前端开发，参与了集度汽车商业化中台团队组件库建设，微前端建设等",
      "参与了商业化中台前端sentry监控平台的建设，实现了整个商业化中台前端的错误监控和告警",
      "从0开始参与了集度的ai agent平台开发，使用的是dify的方案，落地了集度汽车app、小程序的智能售前客服能力；实现了内部的智能直播切片平台，实现了知识库系统等ai应用。",
      "其他商业化中台的业务开发：保险业务，置换二手车业务等"
    ],
    tags: ["ai agent", "ai应用", "微前端", "埋点,sentry监控","vue3"],
  },
  {
    company: "泰康集团/泰康在线(外包)",
    position: "前端工程师",
    date: "2025.04 - 至今",
    details: [
      "泰康在线，风控合规项目组，合规项目群开发，风控项目群开发，审计稽核项目群开发",
      "完成风控合规，审计项目之外，作为支援参与了其他项目组的攻坚工作。董办的股权结构图需求，风险管理中台的地图需求"
    ],
    tags: ["canvas konva.js","vue3,nuxt3,nodejs","大屏地图",'超大量dom渲染的优化'],
  },
  {
    company: "武汉智玺科技-团队",
    position: "什么都干点的前端工程师",
    date: "2025.01 - 至今",
    details: [
      "前端开发，完成了北京耐特瑞公司的一个医疗平台，包括门诊后台，人员管理平台，患者小程序，医生使用app等项目。",
      "在建的香港从化马会票务项目，taro框架下的大型小程序集合项目，主要包含了票务，游戏，咨询等业务模块。实现了大型配置动画的播放和控制能力，实现了简单的小游戏程序，蓝牙设备交互"
    ],
    tags: ["动画控制器","taro,flutter,vue3","lottie,animation","微信小游戏","蓝牙设备交互"],
  },
]);

const projects = ref([
  {
    name: "黔云通系列项目",
    date: "2021.01-2024.05",
    description: "思特奇在贵州落地的政企合作文旅项目，在职期间，该平台发展到四川承德，云南昆明等地落地，年流水统计超3亿元。",
    link: "https://www.lbymt.com/config/home/home?sysFlag=qn", // 可选：项目链接，留空则不显示链接
    details: [
      "主要贡献：协调人力，项目管理，提供技术方案，参与开发，对外实施落地。",
      "重构了前身数旅通项目，从java迁移到以vue3为核心的前后端分离开发模式。对之后的项目提供了脚手架，组件库等基础设施。",
      "进行了以数旅通为中心的微前端结构设计，实现了其他项目后续管理平台的快速落地。",
      "开发了石化项目的pwa版本，景区酒店企业端的electron版本，实现了售票机，打印机的硬件交互。" 
    ],
  },
  {
    name: "企业管理系统",
    date: "2023.03",
    description: "面向中小企业的一站式管理平台",
    details: [
      "使用 Vue3 + Element Plus 构建，支持权限管理、数据可视化等功能",
      "采用微前端架构，支持模块化开发和独立部署",
      "优化首屏加载速度，Lighthouse 性能评分达到 95+",
    ],
  },
    {
    name: "企业管理系统",
    date: "2023.03",
    description: "面向中小企业的一站式管理平台",
    details: [
      "使用 Vue3 + Element Plus 构建，支持权限管理、数据可视化等功能",
      "采用微前端架构，支持模块化开发和独立部署",
      "优化首屏加载速度，Lighthouse 性能评分达到 95+",
    ],
  },
]);
</script>

<style scoped>
.resume-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #e6fffa 0%, #edf2f7 40%, #f7fafc 100%);
  padding: 40px 20px;
}

.resume-container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.resume-header {
  background: linear-gradient(135deg, #81e6d9 0%, #bee3f8 40%, #edf2f7 100%);
  color: #234e52;
  padding: 16px 20px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.resume-header h1 {
  margin: 0 0 8px 0;
  font-size: 2.2em;
  font-weight: 700;
  color: #234e52;
  border: none;
}

.position-tag {
  font-size: 0.6em;
  font-weight: 400;
  opacity: 0.85;
}

.header-left {
  max-width: 60%;
}

.header-right {
  flex: 1;
}

.contact-info {
  display: flex;
  justify-content: center;
  justify-content: flex-start;
  gap: 16px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.contact-info span {
  font-size: 0.9em;
  opacity: 0.9;
  color: #2d3748;
}

.education {
  margin: 4px 0 0 0;
  font-size: 0.9em;
  opacity: 0.9;
  color: #2d3748;
}

.resume-section {
  padding: 0 20px
}

.advantages-section {
  padding: 20px 40px;
}

.custom-text {
  margin: 0;
  color: #555;
  line-height: 1.7;
  white-space: pre-wrap;
}

.resume-section:last-child {
  border-bottom: none;
}

.resume-section h2 {
  color: #2c7a7b;
  font-size: 1.6em;
}

.section-heading {
  margin-bottom: 10px;
}

.section-heading h2 {
  margin-bottom: 2px;
  padding-bottom: 0;
  border-bottom: none;
}

.section-progress {
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
}

.section-progress-track {
  position: relative;
  flex: 1;
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: rgba(45, 55, 72, 0.06);
  overflow: hidden;
}

.section-progress-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -30%;
  width: 160%;
  background: linear-gradient(90deg, #c6f6d5 0%, #81e6d9 25%, #2c7a7b 60%, #81e6d9 85%, #c6f6d5 100%);
  filter: saturate(1.1);
  animation: section-liquid 7s ease-in-out infinite;
}

.section-progress-leaf {
  width: 32px;
  height: 32px;
  pointer-events: none;
}

@keyframes section-liquid {
  0% {
    transform: translateX(-18%);
  }
  25% {
    transform: translateX(-5%);
  }
  50% {
    transform: translateX(18%);
  }
  100% {
    transform: translateX(-18%);
  }
}

.item {
  margin-bottom: 30px;
}

.item:last-child {
  margin-bottom: 0;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 10px;
}

.item-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.3em;
  border: none;
}

.date {
  color: #666;
  font-size: 0.9em;
  white-space: nowrap;
}

.subtitle {
  color: #666;
  margin: 5px 0 15px 0;
  font-size: 1em;
}

.details {
  list-style: none;
  padding: 0;
  margin: 0;
}

.details li {
  position: relative;
  padding-left: 16px;
  margin-bottom: 8px;
  color: #555;
  line-height: 1.6;
}

.details li:before {
  content: "▸";
  position: absolute;
  left: 0;
  color: #2c7a7b;
  font-weight: bold;
}

.exp-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.exp-tag {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.8em;
  background: rgba(129, 230, 217, 0.18);
  color: #276749;
  border: 1px solid rgba(129, 230, 217, 0.4);
}

.timeline {
  position: relative;
  margin-top: 0;
  padding-left: 4px;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  position: relative;
  margin-bottom: 16px;
}

.project-list {
  margin-top: 0;
  padding-left: 4px;
}

.timeline-left {
  position: relative;
  width: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-dot {
  width: 22px;
  height: 22px;
  margin-top: 6px;
}

.project-dot {
  width: 22px;
  height: 22px;
  margin-top: 6px;
}

.timeline-line {
  flex: 1;
  width: 2px;
  margin-top: 6px;
  background: linear-gradient(
    to bottom,
    rgba(56, 178, 172, 0.9),
    rgba(129, 230, 217, 0.4),
    rgba(56, 178, 172, 0.05)
  );
}

.timeline-content {
  flex: 1;
  padding: 8px 16px 18px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f7fafc 0%, #edfdfd 40%, #ffffff 100%);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
  border: 1px solid rgba(203, 213, 224, 0.9);
  transition: box-shadow 0.22s ease, border-color 0.22s ease, background 0.22s ease;
  position: relative;
}

/* 对话框式三角形凸起 - 指向左边的叶子 */
.timeline-content::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 12px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 8px solid rgba(203, 213, 224, 0.9);
  transition: border-right-color 0.22s ease;
}

.timeline-content::after {
  content: '';
  position: absolute;
  left: -7px;
  top: 12px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 8px solid #f7fafc;
  transition: border-right-color 0.22s ease;
}

.timeline-item:hover .timeline-content {
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.12);
  border-color: rgba(56, 178, 172, 0.55);
  background: linear-gradient(135deg, #edfdfd 0%, #ffffff 70%);
}

.timeline-item:hover .timeline-content::before {
  border-right-color: rgba(56, 178, 172, 0.55);
}

.timeline-item:hover .timeline-content::after {
  border-right-color: #edfdfd;
}

.timeline-item:hover .timeline-title {
  color: #2c7a7b;
}

.timeline-item:hover .details li:before {
  color: #38b2ac;
}

.timeline-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 6px;
}

.timeline-date {
  font-size: 0.85em;
  color: #718096;
  margin-bottom: 2px;
}

.timeline-title {
  margin: 0;
  font-size: 1.05em;
  color: #333;
  border: none;
}

.project-link {
  color: #2c7a7b;
  text-decoration: underline;
  text-decoration-color: rgba(44, 122, 123, 0.4);
  text-underline-offset: 3px;
  transition: all 0.22s ease;
}

.project-link:hover {
  color: #38b2ac;
  text-decoration-color: #38b2ac;
}

@media (max-width: 768px) {
  .resume-page {
    padding: 20px 10px;
  }

  .resume-header {
    padding: 40px 20px;
  }

  .resume-header h1 {
    font-size: 2em;
  }

  .resume-section {
    padding: 30px 20px;
  }

  .contact-info {
    flex-direction: column;
    gap: 10px;
  }
}
</style>


