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

/* 社交链接 */
.social-links {
  display: flex;
  gap: 0.8rem;
  margin: 1.5rem 0;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #475569;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #3b82f6;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.social-icon {
  width: 20px;
  height: 20px;
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

/* 下载简历按钮 */
.cv-button-wrapper {
  text-align: center;
  margin: 2rem 0;
}

.cv-button {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%);
  color: #fff;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

.cv-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
  color: #fff;
}

.cv-icon {
  width: 18px;
  height: 18px;
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
  
  .social-link {
    background: #334155;
    color: #cbd5e1;
  }
  
  .social-link:hover {
    background: #3b82f6;
    color: #fff;
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

  <!-- 社交链接 -->
  <div class="social-links">
    <a href="https://github.com/Caizhenxin" target="_blank" rel="noopener" class="social-link" title="GitHub">
      <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
    </a>
    <a href="https://space.bilibili.com/" target="_blank" rel="noopener" class="social-link" title="Bilibili">
      <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906L17.813 4.653zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773H5.333zm4 5.146c-.373 0-.64.107-.8.32-.16.214-.24.454-.24.72v.96c0 .266.08.506.24.72.16.213.427.32.8.32.373 0 .64-.107.8-.32.16-.214.24-.454.24-.72v-.96c0-.266-.08-.506-.24-.72-.16-.213-.427-.32-.8-.32zm5.334 0c-.374 0-.64.107-.8.32-.16.214-.24.454-.24.72v.96c0 .266.08.506.24.72.16.213.426.32.8.32.373 0 .64-.107.8-.32.16-.214.24-.454.24-.72v-.96c0-.266-.08-.506-.24-.72-.16-.213-.427-.32-.8-.32z"/></svg>
    </a>
    <a href="mailto:czx@nnu.edu.cn" class="social-link" title="Email">
      <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
    </a>
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
  </div>

  <!-- 下载简历按钮 -->
  <div class="cv-button-wrapper">
    <a href="/files/CV_Caizhenxin.pdf" class="cv-button" download>
      <svg class="cv-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      <span>Download My CV</span>
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
