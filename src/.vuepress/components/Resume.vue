<template>
  <div class="resume-page">
    <div class="resume-container">
      <header class="resume-header">
        <div class="header-content">
          <div class="header-row-1">
            <span class="name">{{ profile.name }}</span>
            <span class="position">{{ profile.position }}</span>
            <span class="location">{{ profile.location }}</span>
          </div>
          <div class="header-row-2">
            <a :href="`mailto:${profile.email}`" class="contact-link">{{ profile.email }}</a>
            <a :href="`tel:${profile.phone}`" class="contact-link">{{ profile.phone }}</a>
            <span class="contact-link wechat" @click="copyWechat">
              微信: {{ profile.wechat }}
            </span>
            <span>{{ profile.school }}</span>
          </div>
        </div>
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
          <h2>主要项目</h2>
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
              <div v-if="project.contribution" class="contribution">
                <strong>主要贡献：</strong>{{ project.contribution }}
              </div>
              <ul class="details">
                <li v-for="(detail, i) in project.details" :key="i">{{ detail }}</li>
              </ul>
              <div v-if="project.tags?.length" class="project-tags">
                <span v-for="tag in project.tags" :key="tag" class="project-tag">
                  {{ tag }}
                </span>
              </div>
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

const copyWechat = () => {
  const wechat = profile.value.wechat;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(wechat).then(() => {
      alert(`微信号已复制: ${wechat}`);
    });
  } else {
    alert(`微信号: ${wechat}`);
  }
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
  wechat: "qinzhuan",
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
    tags: ["前端工程化", "组件库 / 脚手架", "团队培养", "从0到1项目落地"],
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
    tags: ["ai agent", "ai应用", "微前端", "埋点,sentry监控"],
  },
  {
    company: "泰康集团/泰康在线(外包)",
    position: "前端工程师",
    date: "2025.04 - 至今",
    details: [
      "泰康在线，风控合规项目组，合规项目群开发，风控项目群开发，审计稽核项目群开发",
      "完成风控合规，审计项目之外，作为支援参与了其他项目组的攻坚工作。董办的股权结构图需求，风险管理中台的地图需求"
    ],
    tags: ["canvas konva.js","大屏地图",'超大量dom渲染的优化'],
  },
  {
    company: "武汉智玺科技-团队",
    position: "什么都干点的前端工程师",
    date: "2025.01 - 至今",
    details: [
      "前端开发，完成了北京耐特瑞公司的一个医疗平台，包括门诊后台，人员管理平台，患者小程序，医生使用app等项目。",
      "在建的香港从化马会票务项目，taro框架下的大型小程序集合项目，主要包含了票务，游戏，咨询等业务模块。实现了大型配置动画的播放和控制能力，实现了简单的小游戏程序，蓝牙设备交互"
    ],
    tags: ["动画控制器","taro","lottie,animation","微信小游戏","蓝牙设备交互"],
  },
]);

const projects = ref([
  {
    name: "黔云通系列项目",
    date: "2021.01-2024.05",
    description: "思特奇在贵州落地的政企合作文旅项目，在职期间，该平台发展到四川承德，云南昆明等地落地。",
    link: "https://www.lbymt.com/config/home/home?sysFlag=qn",
    contribution: "协调人力，项目管理，提供技术方案，参与开发，对外实施落地。",
    tags: ["Vue3", "qiankun微前端", "Electron","JavaEE后端","uniapp","微信小程序","硬件交互"],
    details: [
      "重构了前身数旅通项目，从java迁移到以vue3为核心的前后端分离开发模式。对之后的项目提供了脚手架，组件库等基础设施。",
      "进行了以数旅通为中心的微前端结构设计，实现了其他项目后续管理平台的快速落地。",
      "开发景区酒店企业端的electron版本，实现了售票机，打印机的硬件交互。景区验票闸机的app，实现人脸识别等交互。" 
    ],
  },
  {
    name:'贵人家园项目',
    date: '2021.01-2024.05',
    description: '黔南州推广的一个人社服务app，主要面向政企服务，提供社保，公积金，就业，人才，扶贫等服务',
    link: 'https://baike.baidu.com/item/%E8%B4%B5%E4%BA%BA%E5%AE%B6%E5%9B%AD/63608256',
    tags: ["Vue3", "uniapp","对话聊天应用","微信小程序"],
    contribution: '技术选型，app开发，小程序开发，管理后台开发',
    details: [
      '使用uniapp的方案，实现了贵人家园的app，小程序一体的开发',
      '协调多个外部平台，如公积金，灵活用工，本地招聘等服务接入',
    ],
  },
  {
    name:'省石油一体化平台',
    date: '2021.01-2024.05',
    description: '云码通和省交通厅和商务厅合作的项目，用于安全排查，税务监管，在职期间，该平台已覆盖全省5000+加油站',
    link: 'http://swt.guizhou.gov.cn/xwzx/swyw/202412/t20241206_86309267.html',
    tags: ["Vue3", "视频传输","echarts"],
    contribution: '技术选型，平台开发',
    details: [
      '使用vue3+ts+element+echarts的组合开发了该平台',
      '接入了视频实时传输的功能，'
    ],
  },
  {
    name: "监控平台建设",
    date: "2024.05-2024.12",
    description: "集度汽车商业化中台前端sentry监控平台的建设",
    tags: ["Sentry","nodejs"],
    contribution: '参与sentry平台的本地化搭建，实现监控告警在飞书的通知，实现告警统计',
    details: [
      '每周根据告警数据，调整告警规则，优化告警策略，优化告警通知方式',
      '定期组织sentry问题分析，与团队成员一同解决平台监控发现的问题'
    ],
  },
  {
    name:'ai agent平台建设',
    date: '2024.05-2024.12',
    description: '集度汽车商业化中台前端ai agent平台的建设',
    tags:['react','nodejs','h5'],
    contribution: '平台的搭建，实现生成式ai的应用落地，直播切片、知识库检索等agent工具的开发',
    details: [
      '集度售前智能开发，应用于集度app，小程序',
      '集度智能直播切片平台开发，应用于集度后端知识库系统',
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
  padding: 20px 30px;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.header-row-1 {
  display: flex;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
}

.header-row-1 .name {
  font-size: 2.2em;
  font-weight: 700;
  color: #234e52;
}

.header-row-1 .position,
.header-row-1 .location {
  font-size: 1.1em;
  font-weight: 500;
  color: #2d3748;
  opacity: 0.9;
}

.header-row-2 {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.header-row-2 span {
  font-size: 0.95em;
  color: #2d3748;
  opacity: 0.85;
}

.contact-link {
  font-size: 0.95em;
  color: #2d3748;
  opacity: 0.85;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.contact-link:hover {
  color: #2c7a7b;
  opacity: 1;
}

.contact-link.wechat {
  border-bottom: 1px dashed rgba(44, 122, 123, 0.3);
}

.contact-link.wechat:hover {
  border-bottom-color: #2c7a7b;
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

.contribution {
  padding: 10px 14px;
  margin: 10px 0 12px 0;
  background: linear-gradient(135deg, rgba(129, 230, 217, 0.12) 0%, rgba(198, 246, 213, 0.08) 100%);
  border-left: 3px solid #2c7a7b;
  border-radius: 4px;
  color: #2d3748;
  line-height: 1.6;
  font-size: 0.95em;
}

.contribution strong {
  color: #2c7a7b;
  font-weight: 600;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.project-tag {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.8em;
  background: rgba(129, 230, 217, 0.18);
  color: #276749;
  border: 1px solid rgba(129, 230, 217, 0.4);
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
    padding: 20px 12px;
  }

  .header-row-1 .name {
    font-size: 1.8em;
  }

  .header-row-1 .position,
  .header-row-1 .location {
    font-size: 1em;
  }

  .resume-section {
    padding: 0px 12px;
  }

  .header-row-2 {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  /* 移动端隐藏叶子 */
  .timeline-left,
  .section-progress-leaf {
    display: none !important;
  }

  /* 移动端隐藏对话框突出 */
  .timeline-content::before,
  .timeline-content::after {
    display: none !important;
  }

  /* 调整时间线布局 */
  .timeline-item {
    display: block;
  }

  .timeline {
    padding-left: 0;
  }

  .project-list {
    padding-left: 0;
  }
}
</style>


