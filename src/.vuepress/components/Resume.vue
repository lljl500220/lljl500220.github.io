<template>
  <div class="resume-page">
    <div class="resume-container">
      <header class="resume-header">
        <h1>{{ profile.name }}</h1>
        <div class="contact-info">
          <span>{{ profile.email }}</span>
          <span>{{ profile.phone }}</span>
          <span>{{ profile.location }}</span>
        </div>
        <p class="summary">{{ profile.summary }}</p>
      </header>

      <section class="resume-section">
        <h2>🎓 教育背景</h2>
        <div v-for="(edu, index) in education" :key="index" class="item">
          <div class="item-header">
            <h3>{{ edu.school }}</h3>
            <span class="date">{{ edu.date }}</span>
          </div>
          <p class="subtitle">{{ edu.degree }} - {{ edu.major }}</p>
        </div>
      </section>

      <section class="resume-section">
        <h2>💼 工作经历</h2>
        <div v-for="(exp, index) in experience" :key="index" class="item">
          <div class="item-header">
            <h3>{{ exp.company }} - {{ exp.position }}</h3>
            <span class="date">{{ exp.date }}</span>
          </div>
          <ul class="details">
            <li v-for="(detail, i) in exp.details" :key="i">{{ detail }}</li>
          </ul>
        </div>
      </section>

      <section class="resume-section">
        <h2>🚀 技能特长</h2>
        <div class="skills-grid">
          <div v-for="(skill, index) in skills" :key="index" class="skill-item">
            <span class="skill-name">{{ skill.name }}</span>
            <div class="skill-bar">
              <div class="skill-progress" :style="{ width: skill.level + '%' }"></div>
            </div>
          </div>
        </div>
      </section>

      <section class="resume-section">
        <h2>🏆 项目经验</h2>
        <div v-for="(project, index) in projects" :key="index" class="item">
          <div class="item-header">
            <h3>{{ project.name }}</h3>
            <span class="date">{{ project.date }}</span>
          </div>
          <p class="subtitle">{{ project.description }}</p>
          <ul class="details">
            <li v-for="(detail, i) in project.details" :key="i">{{ detail }}</li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const profile = ref({
  name: "秦篆",
  email: "example@email.com",
  phone: "138-xxxx-xxxx",
  location: "中国·北京",
  summary: "热爱技术的前端开发工程师，专注于 Vue.js 生态和现代化前端工程实践。",
});

const education = ref([
  {
    school: "XX大学",
    degree: "本科",
    major: "计算机科学与技术",
    date: "2018.09 - 2022.06",
  },
]);

const experience = ref([
  {
    company: "XX科技有限公司",
    position: "前端工程师",
    date: "2022.07 - 至今",
    details: [
      "负责公司核心产品的前端开发和维护，使用 Vue3 + TypeScript 技术栈",
      "优化项目构建流程，将打包速度提升 40%",
      "参与组件库建设，提高团队开发效率",
    ],
  },
]);

const skills = ref([
  { name: "Vue.js", level: 90 },
  { name: "JavaScript/TypeScript", level: 85 },
  { name: "React", level: 75 },
  { name: "Node.js", level: 70 },
  { name: "Webpack/Vite", level: 80 },
  { name: "CSS/Sass", level: 85 },
]);

const projects = ref([
  {
    name: "个人技术博客",
    date: "2022.07",
    description: "基于 VuePress 2 搭建的个人技术博客",
    details: [
      "使用 VuePress Theme Hope 主题，支持 Markdown 增强功能",
      "集成代码高亮、数学公式、流程图等功能",
      "通过 GitHub Actions 实现自动化部署",
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.resume-container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.resume-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 40px;
  text-align: center;
}

.resume-header h1 {
  margin: 0 0 20px 0;
  font-size: 3em;
  font-weight: 700;
  color: white;
  border: none;
}

.contact-info {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.contact-info span {
  font-size: 1em;
  opacity: 0.95;
}

.summary {
  font-size: 1.1em;
  line-height: 1.6;
  opacity: 0.95;
  max-width: 600px;
  margin: 0 auto;
}

.resume-section {
  padding: 40px;
  border-bottom: 1px solid #eee;
}

.resume-section:last-child {
  border-bottom: none;
}

.resume-section h2 {
  color: #667eea;
  font-size: 1.8em;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 3px solid #667eea;
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
  padding-left: 20px;
  margin-bottom: 8px;
  color: #555;
  line-height: 1.6;
}

.details li:before {
  content: "▸";
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.skill-item {
  margin-bottom: 15px;
}

.skill-name {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.skill-bar {
  height: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 5px;
  transition: width 1s ease;
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

  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>


