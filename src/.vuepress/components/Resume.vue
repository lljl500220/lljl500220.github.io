<template>
  <div class="resume-page">
    <button class="export-pdf-btn" @click="exportToPDF">导出PDF</button>
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

      <!-- 技能与自我介绍部分 -->
      <section class="skills-intro-section">
        <div class="skills-area">
          <div class="skill-item" v-for="skill in skills" :key="skill.name">
            <div class="skill-header">
              <span class="skill-name">{{ skill.name }}</span>
              <span class="skill-level">{{ skill.level }}</span>
            </div>
            <div class="skill-bar">
              <div class="skill-fill" :style="{ width: skill.percentage }"></div>
            </div>
          </div>
        </div>
        <div class="other-skills-area">
          <span class="other-skills-label">其他技能:</span>
          <div class="other-skills-tags">
            <span v-for="tag in otherSkills" :key="tag" class="other-skill-tag">
              {{ tag }}
            </span>
          </div>
        </div>
        <div class="intro-area">
          <p class="intro-text">{{ introduction }}</p>
        </div>
      </section>

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
                  {{ project.name }}
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

      <section class="resume-section">
        <div class="section-heading">
          <h2>学术项目</h2>
          <div class="section-progress">
            <div class="section-progress-leaf"></div>
            <div class="section-progress-track">
              <div class="section-progress-fill"></div>
            </div>
          </div>
        </div>
        <div class="project-list">
          <div
            v-for="(project, index) in academicProjects"
            :key="index"
            class="timeline-item project-item"
          >
            <div class="timeline-left">
              <div
                class="timeline-dot project-dot"
                :ref="el => setProjectLeafRef(el as HTMLDivElement | null, projects.length + index)"
              ></div>
              <div class="timeline-line" v-if="index !== academicProjects.length - 1"></div>
            </div>
            <div class="timeline-content project-card">
              <div class="timeline-header">
                <span class="timeline-date">{{ project.date }}</span>
                <h3 class="timeline-title">
                  {{ project.name }}
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

const exportToPDF = () => {
  window.print();
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
  position: "前端开发/全栈开发",
  email: "1723377108@qq.com",
  phone: "18755192440",
  wechat: "qinzhuan",
  location: "武汉",
  school: "合肥工业大学 · 软件工程 (2019)",
});

const skills = ref([
  { name: "Vue.js", level: "精通", percentage: "95%" },
  { name: "React", level: "熟练", percentage: "80%" },
  { name: "TypeScript / JavaScript", level: "精通", percentage: "90%" },
  { name: "小程序 / Taro / Uniapp", level: "熟练", percentage: "85%" },
]);

const otherSkills = ref([
  'Python','Node.js','Canvas','微前端','Electron','Scss/Less','埋点 Sentry','AI辅助开发','Echarts','Vite'
]);

const introduction = ref(
  "4年前端开发经验，带领过10人前端团队，注重前端标准化，负责过多个省级项目落地。擅长Vue和React技术栈，有全栈能力。在不同公司都负责或参与搭建组件库、脚手架和微前端架构。做过AI Agent平台和监控平台，有性能优化和Canvas、SVG动画经验。近期在进行生物信息学研究，使用Python和R语言开发AI模型应用，具备跨领域学习和技术整合能力。"
);

const customText = ref("");

const experience = ref([
  {
    company: "武汉智玺科技有限公司",
    position: "全栈工程师",
    date: "2024.12 - 至今",
    details: [
      "负责医疗平台和票务小程序项目的全栈开发，包括爱丁医生医疗平台和从化马会票务系统",
      "开发爱丁医生医疗平台，包括门诊后台、管理平台、患者小程序、医生APP，前端Vue3后端Node.js，使用原生小程序和uniapp实现多端开发",
      "开发从化马会票务小程序（Taro框架），实现复杂动画控制器（支持CSS和Lottie动画组合）、LBS小游戏、蓝牙信标对接等功能",
      "使用Cursor AI编程辅助开发，显著提升开发效率；同时协助配偶进行生物信息学研究，使用Python和R开发AI模型应用"
    ],
    tags: ["全栈开发", "医疗平台", "小程序开发", "AI编程"],
  },
  {
    company: "集度汽车科技有限公司",
    position: "前端工程师",
    date: "2024.05 - 2024.12",
    details: [
      "参与商业化中台前端开发，负责AI Agent平台和监控系统从0到1的建设，负责微前端架构优化和业务需求开发",
      "基于Dify搭建AI智能客服平台，落地到集度APP和小程序，使用反馈好评率达87%",
      "负责Sentry监控平台建设，覆盖商业化中台20+微前端应用，接入飞书告警机制，实现每周线上问题自动收集，自动飞书同步责任人，大幅提升问题发现和解决效率",
      "开发智能直播切片工具，自动从直播内容生成营销素材，每周产出100+条内容，大幅提升运营效率；同时负责保险、二手车置换等业务模块开发"
    ],
    tags: ["AI应用", "监控建设", "从0到1"],
  },
  {
    company: "思特奇信息技术股份有限公司",
    position: "前端负责人",
    date: "2021.01 - 2024.05",
    details: [
      "带领10人前端团队，负责贵州政企项目的技术规划和团队管理，主导黔云通、贵人家园、石油监管平台等多个省级政企合作项目落地，累计服务用户100万+，企业端注册商户800+",
      "从0搭建前端工程化体系：组件库（20+组件）、CLI脚手架、微前端架构",
      "设计并实现qiankun微前端架构，整合贵阳研发中心和成都分支多个子项目，支持多团队独立开发部署",
      "三年内担任技术导师，培养9名前端新人，组织技术分享会，主导团队技术栈从JavaWeb+Vue2升级到Vue3"
    ],
    tags: ["团队管理", "工程化建设", "技术导师"],
  },
  {
    company: "中科院电子学研究所（空天信息研究院）",
    position: "工程师（实习）",
    date: "实习",
    details: [
      "参与研究所DevOps平台建设，负责Jenkins、Sonar、GitLab等服务的本地化部署，搭建CI/CD流水线，实现代码自动化构建和质量检查"
    ],
    tags: ["DevOps实践"],
  }
]);

const projects = ref([
  {
    name: "黔云通文旅平台系列",
    date: "2021.01-2024.05",
    description: "思特奇，云码通与黔南州政府合作的级文旅平台，在黔南州落地后迅速推广到全省旅游景区，在职期间，推广到云南昆明，四川承德等",
    contribution: "技术负责人，负责前端架构和开发",
    tags: ["Vue3", "qiankun微前端", "Electron", "硬件交互"],
    details: [
      "重构java单体项目，改成Vue3前后端分离，同时组织开发了对应组件库和脚手架工程",
      "用qiankun做了微前端，推动成都分支和贵阳分支多个子项目接入统一管理",
      "用Electron开发了桌面端，接了售票机、打印机、等硬件设备，实现了开票，打印，验票等功能",
      "使用uniapp，开发了闸机程序，实现了扫码入园，验票等功能"
    ],
  },
  {
    name:'贵人家园（人社服务平台）',
    date: '2021.01-2024.05',
    description: '在黔南州推广的人社服务平台，社保、公积金、就业、文旅等业务均有涉及，目前除去贵州外已推广到承德，昆明，长沙，武汉等城市',
    tags: ["Vue3", "uniapp", "聊天应用", "多端统一"],
    contribution: '负责技术选型和开发',
    details: [
      '用uniapp，实现了APP、小程序、H5一套代码搞定，统一了多端开发流程',
      '接入了公积金、医保、警务等政务平台'
    ],
  },
  {
    name:'全省石油监管一体化平台',
    date: '2021.01-2024.05',
    description: '贵州省交通厅和商务厅合作的加油站监管平台，覆盖5000多个加油站',
    tags: ["Vue3", "Echarts", "实时视频"],
    contribution: '负责平台开发',
    details: [
      '实现配置表单，审计报表生成，报送资料总结等功能',
      '实现实时画面传输，任意加油站摄像头切换，主动识别车流量与订单量不符等问题（基于海康威视摄像头）'
    ],
  },
  {
    name: "集度AI Agent智能客服平台",
    date: "2024.05-2024.12",
    description: "基于Dify做的AI智能客服和内容生产工具",
    tags: ["Dify", "RAG", "React", "AI Agent"],
    contribution: '负责从0开始搭建AI Agent平台，并落地到集度APP和小程序',
    details: [
      '使用Dify搭建AI智能客服平台，落地到集度APP和小程序，使用反馈好评率达87%',
      '开发智能直播切片工具，自动从直播内容生成营销素材，每周产出100+条内容，大幅提升运营效率；同时负责保险、二手车置换等业务模块开发'
    ],
  },
  {
    name: '从化马会票务小程序',
    date: '2024.12-至今',
    description: '香港从化马会的大型票务小程序，包含票务、游戏、资讯等业务模块',
    tags: ['Taro', 'Lottie', 'LBS小游戏', '蓝牙交互', 'AI辅助开发'],
    contribution: '负责项目架构设计和开发',
    details: [
      '负责项目整体架构设计、技术选型和开发实现，使用Cursor AI工具大幅提升开发效率',
      '设计并实现复杂动画控制系统，支持多个CSS和Lottie动画的精准到毫秒的控制和组合播放',
      '开发LBS小游戏，结合GPS定位和蓝牙信标实现实时位置交互，处理位置漂移和信号强度优化',
      '负责后端服务开发（NestJS），实现常规curd操作，定时器，通知推送等功能'
    ],
  },
  {
    name: '爱丁医生医疗平台',
    date: '2024.12-2025.03',
    description: '北京耐特瑞的医疗信息化平台，包括门诊后台、管理平台、患者小程序、医生APP',
    tags: ['Vue3', 'Node.js', 'uniapp', '原生小程序', 'AI辅助开发'],
    contribution: '独立负责全栈开发和项目管理',
    details: [
      '独立完成项目需求分析、架构设计和技术实现，充分利用Cursor AI工具实现快速开发和迭代',
      '设计并实现门诊后台、管理平台、患者小程序、医生APP四端系统，确保多端数据同步和业务闭环',
      '搭建后端服务架构（Node.js + Express），设计RESTful API和数据库模型',
      '3个月高效完成从0到1的开发和上线，展现出色的AI工具使用能力和项目交付能力'
    ],
  },
]);

const academicProjects = ref([
  {
    name: "基因组学AI应用开发",
    date: "2024.12 - 至今",
    description: "协助配偶进行生物信息学研究，基于AlphaGenome和DeepTSS模型开发基因预测应用",
    tags: ["Python", "R语言", "AI模型", "生物信息学"],
    contribution: "技术支持与应用开发",
    details: [
      "使用AlphaGenome模型，结合解脂耶氏酵母基因组测序数据，实现DNA可及性、蛋白结合位点、RNA剪切点、基因表达水平趋势等方面的预测",
      "使用DeepTSS模型实现甲硫氨酸裂解酶转录起始位点预测",
      "使用R语言和Python进行数据分析、处理和科研绘图"
    ],
  }
]);
</script>

<style scoped>
.resume-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #e6fffa 0%, #edf2f7 40%, #f7fafc 100%);
  padding: 40px 20px;
  position: relative;
}

.export-pdf-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #2c7a7b 0%, #38b2ac 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(44, 122, 123, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;
}

.export-pdf-btn:hover {
  background: linear-gradient(135deg, #38b2ac 0%, #4fd1c5 100%);
  box-shadow: 0 6px 16px rgba(44, 122, 123, 0.4);
  transform: translateY(-2px);
}

.export-pdf-btn:active {
  transform: translateY(0);
}

.resume-container {
  max-width: 800px;
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

.skills-intro-section {
  padding: 30px 40px;
  background: linear-gradient(135deg, #f0fdfa 0%, #f7fafc 100%);
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
}

.skills-area {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-name {
  font-size: 0.95em;
  font-weight: 500;
  color: #2d3748;
}

.skill-level {
  font-size: 0.85em;
  color: #718096;
}

.skill-bar {
  height: 6px;
  background: rgba(226, 232, 240, 0.5);
  border-radius: 999px;
  overflow: hidden;
  position: relative;
}

.skill-fill {
  height: 100%;
  background: linear-gradient(90deg, #81e6d9 0%, #2c7a7b 100%);
  border-radius: 999px;
  transition: width 0.8s ease;
  animation: skill-fill 1.5s ease-in-out;
}

@keyframes skill-fill {
  from {
    width: 0 !important;
  }
}

.other-skills-area {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px dashed rgba(129, 230, 217, 0.4);
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.other-skills-label {
  font-size: 0.9em;
  font-weight: 500;
  color: #2d3748;
  white-space: nowrap;
  padding-top: 4px;
}

.other-skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
}

.other-skill-tag {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.85em;
  background: rgba(129, 230, 217, 0.15);
  color: #2c7a7b;
  border: 1px solid rgba(129, 230, 217, 0.3);
  transition: all 0.2s ease;
  cursor: default;
}

.other-skill-tag:hover {
  background: rgba(129, 230, 217, 0.25);
  border-color: rgba(129, 230, 217, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(44, 122, 123, 0.1);
}

.intro-area {
  padding-top: 16px;
  border-top: 1px dashed rgba(129, 230, 217, 0.4);
  margin-top: 20px;
}

.intro-text {
  margin: 0;
  color: #4a5568;
  line-height: 1.8;
  font-size: 0.95em;
  text-align: justify;
  text-indent: 2em;
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

  .skills-intro-section {
    padding: 20px 16px;
  }

  .skills-area {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .other-skills-area {
    flex-direction: column;
    gap: 8px;
  }

  .other-skills-tags {
    gap: 6px;
  }

  .other-skill-tag {
    font-size: 0.8em;
    padding: 3px 10px;
  }

  .intro-text {
    font-size: 0.9em;
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

/* 打印样式 */
@media print {
  .export-pdf-btn {
    display: none !important;
  }

  .resume-page {
    background: white;
    padding: 0;
  }

  .resume-container {
    max-width: 100%;
    box-shadow: none;
    border-radius: 0;
  }

  .skills-intro-section {
    background: white;
    page-break-inside: avoid;
  }

  /* 打印时隐藏叶子动画 */
  .timeline-dot,
  .section-progress-leaf {
    display: none !important;
  }

  /* 打印时隐藏对话框突出 */
  .timeline-content::before,
  .timeline-content::after {
    display: none !important;
  }

  /* 调整时间线布局 */
  .timeline-left {
    display: none !important;
  }

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


