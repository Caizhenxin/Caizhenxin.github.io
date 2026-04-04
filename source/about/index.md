---
title: 关于我
date: 2026-04-04 12:00:00
type: about
layout: about
comments: false
---

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=Philosopher:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">

<style>
/* 关于页面自定义样式 */
.about-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Philosopher', 'Noto Serif SC', serif;
}

/* 个人主页头部 */
.profile-hero {
  display: flex;
  gap: 2.5rem;
  align-items: flex-start;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.profile-photo-wrapper {
  flex-shrink: 0;
}

.profile-photo {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  border: 4px solid #fff;
}

.profile-info {
  flex: 1;
  min-width: 250px;
}

.profile-info p:first-child {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.2rem 0;
  color: #1a202c;
}

.profile-info p:nth-child(2) {
  font-size: 1.3rem;
  color: #4a5568;
  margin: 0 0 0.8rem 0;
}

.profile-divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  margin: 1rem 0;
  border-radius: 2px;
}

.profile-info p:nth-child(4) {
  font-size: 1.1rem;
  color: #2d3748;
  margin: 0.5rem 0;
  font-weight: 500;
}

.profile-affiliation {
  margin: 0.5rem 0;
}

.profile-affiliation a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.profile-affiliation a:hover {
  text-decoration: underline;
}

.profile-focus {
  margin-top: 0.8rem;
  padding: 0.5rem 1rem;
  background: #f7fafc;
  border-radius: 8px;
  border-left: 3px solid #667eea;
  font-size: 0.95rem;
  color: #4a5568;
}

/* 导航卡片 */
.nav-cards {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
  flex-wrap: wrap;
}

.nav-card {
  flex: 1;
  min-width: 120px;
  text-align: center;
  padding: 1.5rem 1rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.nav-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
}

.nav-card-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.nav-card-link {
  color: #2d3748;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
}

.nav-card-link:hover {
  color: #667eea;
}

/* CV 下载按钮 */
.cv-button-wrapper {
  text-align: center;
  margin: 2rem 0;
}

.cv-button {
  display: inline-block;
  padding: 0.8rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.cv-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  color: #fff;
}

/* 介绍区域 */
.intro-section {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  margin: 2rem 0;
  line-height: 1.8;
  color: #4a5568;
}

.intro-section p {
  margin: 1rem 0;
}

.intro-section a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.intro-section a:hover {
  text-decoration: underline;
}

/* 页脚 */
.page-footer {
  text-align: center;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
  color: #a0aec0;
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-hero {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .profile-photo {
    width: 150px;
    height: 150px;
  }
  
  .profile-divider {
    margin: 1rem auto;
  }
  
  .nav-cards {
    flex-direction: column;
  }
  
  .intro-section {
    padding: 1.5rem;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .profile-info p:first-child {
    color: #f7fafc;
  }
  
  .profile-info p:nth-child(2) {
    color: #cbd5e0;
  }
  
  .profile-info p:nth-child(4) {
    color: #e2e8f0;
  }
  
  .profile-focus {
    background: #2d3748;
    color: #cbd5e0;
  }
  
  .nav-card {
    background: #2d3748;
  }
  
  .nav-card-link {
    color: #e2e8f0;
  }
  
  .intro-section {
    background: #2d3748;
    color: #cbd5e0;
  }
  
  .page-footer {
    border-top-color: #4a5568;
  }
}
</style>

<div class="about-page">
  <!-- 个人主页头部 -->
  <div class="profile-hero">
    <div class="profile-photo-wrapper">
      <img src="/img/avatar.jpg" class="profile-photo" alt="Cai Zhenxin">
    </div>
    <div class="profile-info">
      <p>Cai Zhenxin</p>
      <p>蔡振辛</p>
      <div class="profile-divider"></div>
      <p>热爱技术的开发者</p>
      <div class="profile-affiliation">
        <p>独立开发者 · 技术博主</p>
      </div>
      <div class="profile-focus">
        <p>前端开发 · 静态博客 · 用户体验设计</p>
      </div>
    </div>
  </div>

  <!-- 导航卡片 -->
  <div class="nav-cards">
    <div class="nav-card">
      <span class="nav-card-icon">📝</span>
      <a href="/archives/" class="nav-card-link">文章归档</a>
    </div>
    <div class="nav-card">
      <span class="nav-card-icon">🏷️</span>
      <a href="/tags/" class="nav-card-link">标签</a>
    </div>
    <div class="nav-card">
      <span class="nav-card-icon">💬</span>
      <a href="mailto:caizhenxin@example.com" class="nav-card-link">联系我</a>
    </div>
  </div>

  <!-- CV 下载按钮 -->
  <div class="cv-button-wrapper">
    <a href="/files/resume.pdf" class="cv-button">📄 下载我的简历</a>
  </div>

  <!-- 介绍区域 -->
  <div class="intro-section">
    <p>👋 你好，朋友！很高兴你来到了我的个人网站！</p>
    
    <p>我是 <strong>蔡振辛</strong>，一名热爱技术的前端开发者。目前专注于 Web 开发和用户体验设计，正在探索静态博客生成器（如 Hexo）的最佳实践。</p>
    
    <p>我的兴趣主要集中在：</p>
    <ul>
      <li><strong>前端开发</strong> - Vue.js、React、TypeScript</li>
      <li><strong>静态站点生成</strong> - Hexo、Valaxy、VitePress</li>
      <li><strong>用户体验设计</strong> - 响应式设计、无障碍访问</li>
      <li><strong>DevOps</strong> - GitHub Actions、CI/CD 自动化</li>
    </ul>
    
    <p>除了编程，我还喜欢：</p>
    <ul>
      <li>📷 摄影 - 用镜头记录美好瞬间</li>
      <li>📚 阅读 - 技术书籍和科幻小说</li>
      <li>🎵 音乐 - 学习吉他和音乐制作</li>
      <li>🏃 运动 - 跑步和羽毛球</li>
    </ul>
    
    <p>我尝试以透明、可复现和包容的方式进行开发。这包括分享代码、参与开源项目，以及持续学习新技术。</p>
    
    <p>欢迎随意浏览我的博客，如果你有任何想法或发现任何错误，请随时<a href="mailto:caizhenxin@example.com">联系我</a>，希望我们能一起创造一些很棒的东西！</p>
  </div>

  <!-- 页脚 -->
  <div class="page-footer">
    <p><em>最后更新：2026 年 4 月</em></p>
  </div>
</div>
