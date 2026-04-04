---
title: About Me
date: 2026-04-04 12:00:00
type: about
layout: page
comments: false
---

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Serif+SC:wght@400;700&display=swap" rel="stylesheet">

<style>
/* 覆盖 Fluid 主题默认样式 */
.about-page-wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  font-family: 'Inter', 'Noto Serif SC', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #2c3e50;
  line-height: 1.7;
}

/* 个人主页头部 */
.profile-header {
  display: flex;
  gap: 3rem;
  align-items: center;
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
  flex-wrap: wrap;
}

.profile-photo-wrapper {
  flex-shrink: 0;
}

.profile-photo {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 8px 24px rgba(44, 62, 80, 0.12);
  border: 4px solid #fff;
  transition: transform 0.3s ease;
}

.profile-photo:hover {
  transform: scale(1.03);
}

.profile-info {
  flex: 1;
  min-width: 280px;
}

.profile-name {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 0.3rem 0;
  color: #1a202c;
  letter-spacing: -0.02em;
}

.profile-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  margin: 0 0 1rem 0;
  font-weight: 400;
}

.profile-divider {
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #0ea5e9);
  margin: 1rem 0;
  border-radius: 2px;
}

.profile-role {
  font-size: 1.05rem;
  color: #334155;
  margin: 0.5rem 0;
  font-weight: 500;
}

.profile-affiliation {
  margin: 0.5rem 0;
  font-size: 0.95rem;
  color: #64748b;
}

.profile-tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.profile-tag {
  padding: 0.3rem 0.8rem;
  background: #f1f5f9;
  color: #475569;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

/* 导航卡片 */
.nav-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin: 2.5rem 0;
}

.nav-card {
  text-align: center;
  padding: 1.5rem 1rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
}

.nav-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.12);
  border-color: #3b82f6;
}

.nav-card-icon {
  font-size: 1.8rem;
  display: block;
  margin-bottom: 0.6rem;
}

.nav-card-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: #334155;
}

/* 介绍区域 */
.intro-section {
  background: #fff;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  margin: 2rem 0;
  border: 1px solid #f1f5f9;
}

.intro-section p {
  margin: 0 0 1.2rem 0;
  color: #475569;
}

.intro-section p:last-child {
  margin-bottom: 0;
}

.intro-section strong {
  color: #1e293b;
  font-weight: 600;
}

.intro-section a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

.intro-section a:hover {
  border-bottom-color: #3b82f6;
}

/* 联系方式 */
.contact-section {
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
  text-align: center;
}

.contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.8rem;
  background: linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%);
  color: #fff;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
  color: #fff;
}

/* 页脚 */
.page-footer {
  text-align: center;
  margin-top: 3rem;
  padding-top: 1.5rem;
  color: #94a3b8;
  font-size: 0.85rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .about-page-wrapper {
    padding: 1.5rem 1rem 3rem;
  }
  
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
  }
  
  .profile-photo {
    width: 140px;
    height: 140px;
  }
  
  .profile-divider {
    margin: 1rem auto;
  }
  
  .profile-tags {
    justify-content: center;
  }
  
  .intro-section {
    padding: 1.5rem;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .about-page-wrapper {
    color: #e2e8f0;
  }
  
  .profile-name {
    color: #f8fafc;
  }
  
  .profile-subtitle, .profile-role {
    color: #cbd5e1;
  }
  
  .profile-tag {
    background: #334155;
    color: #e2e8f0;
  }
  
  .nav-card {
    background: #1e293b;
    border-color: #334155;
  }
  
  .nav-card-title {
    color: #e2e8f0;
  }
  
  .intro-section {
    background: #1e293b;
    border-color: #334155;
  }
  
  .intro-section p {
    color: #cbd5e1;
  }
  
  .intro-section strong {
    color: #f1f5f9;
  }
  
  .page-footer {
    border-top-color: #334155;
  }
}
</style>

<div class="about-page-wrapper">
  <!-- 个人主页头部 -->
  <div class="profile-header">
    <div class="profile-photo-wrapper">
      <img src="/img/avatar.jpg" class="profile-photo" alt="Caizhenxin">
    </div>
    <div class="profile-info">
      <h1 class="profile-name">Caizhenxin</h1>
      <p class="profile-subtitle">蔡振辛</p>
      <div class="profile-divider"></div>
      <p class="profile-role">Psychology Student & Aspiring Researcher</p>
      <div class="profile-affiliation">
        <p>Nanjing Normal University</p>
      </div>
      <div class="profile-tags">
        <span class="profile-tag">Psychology</span>
        <span class="profile-tag">Cognitive Processes</span>
        <span class="profile-tag">Research</span>
        <span class="profile-tag">Hengyang, Hunan</span>
      </div>
    </div>
  </div>

  <!-- 导航卡片 -->
  <div class="nav-cards">
    <a href="/archives/" class="nav-card">
      <span class="nav-card-icon">📝</span>
      <span class="nav-card-title">Articles</span>
    </a>
    <a href="/tags/" class="nav-card">
      <span class="nav-card-icon">🏷️</span>
      <span class="nav-card-title">Tags</span>
    </a>
    <a href="mailto:czx@nnu.edu.cn" class="nav-card">
      <span class="nav-card-icon">💬</span>
      <span class="nav-card-title">Contact</span>
    </a>
  </div>

  <!-- 介绍区域 -->
  <div class="intro-section">
    <p>Hi, I'm <strong>Caizhenxin</strong>, originally from Hengyang, Hunan, China, and currently a student at <strong>Nanjing Normal University</strong>, majoring in psychology.</p>
    
    <p>I'm deeply fascinated by psychology and aspire to become a researcher in the future, focusing on understanding human behavior and cognitive processes. I am continually developing my research skills and knowledge through my studies.</p>
    
    <p>I'm actively working on improving my English skills and communication abilities to better engage in academic discussions and collaborate with others. I'm eager to develop both my research and language capabilities as I pursue my studies.</p>
    
    <p>If you have any suggestions, opportunities, or feedback, feel free to contact me at <a href="mailto:czx@nnu.edu.cn">czx@nnu.edu.cn</a> or <a href="mailto:Idle.Mr.Xin@gmail.com">Idle.Mr.Xin@gmail.com</a>.</p>
  </div>

  <!-- 联系方式按钮 -->
  <div class="contact-section">
    <a href="mailto:czx@nnu.edu.cn" class="contact-btn">
      <span>📧</span> Get in Touch
    </a>
  </div>

  <!-- 页脚 -->
  <div class="page-footer">
    <p><em>Last updated: April 2026</em></p>
  </div>
</div>
