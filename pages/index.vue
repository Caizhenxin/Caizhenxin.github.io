<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeConfig } from 'valaxy-theme-yun/composables/config'
import { useYunAppStore } from 'valaxy-theme-yun/stores/app'

const route = useRoute()
const themeConfig = useThemeConfig()
const yun = useYunAppStore()

const isPage = computed(() => route?.path?.startsWith('/page'))

const showNotice = computed(() => {
  const notice = themeConfig.value.notice
  return notice?.enable && (isPage.value ? !notice.hideInPages : true)
})

// 作者信息
const authorName = 'Cai Zhenxin'
const authorTitle = '游手好闲辛大人'
const authorBio = '🚀 热爱技术，热爱生活'
const authorAvatar = '/avatar.svg'

// 统计信息
const stats = {
  posts: 3,
  tags: 8,
  categories: 4,
}
</script>

<template>
  <div class="home-container">
    <!-- 头像和个人介绍区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <!-- 头像 -->
        <div class="avatar-wrapper">
          <img 
            :src="authorAvatar" 
            :alt="authorName"
            class="avatar"
            @error="(e) => (e.target as HTMLImageElement).src = '/avatar.svg'"
          />
          <div class="status-badge">🚀</div>
        </div>
        
        <!-- 个人信息 -->
        <div class="author-info">
          <h1 class="author-name">{{ authorName }}</h1>
          <h2 class="author-title">{{ authorTitle }}</h2>
          <p class="author-bio">{{ authorBio }}</p>
        </div>

        <!-- 统计信息 -->
        <div class="stats">
          <div class="stat-item">
            <span class="stat-number">{{ stats.posts }}</span>
            <span class="stat-label">文章</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ stats.tags }}</span>
            <span class="stat-label">标签</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ stats.categories }}</span>
            <span class="stat-label">分类</span>
          </div>
        </div>

        <!-- 社交链接 -->
        <div class="social-links">
          <a 
            v-for="social in themeConfig.social" 
            :key="social.name"
            :href="social.link"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link"
            :title="social.name"
          >
            <div :class="social.icon" class="social-icon"></div>
          </a>
        </div>
      </div>
    </div>

    <!-- 博客文章列表 -->
    <div class="posts-section">
      <div class="section-header">
        <h2 class="section-title">
          <span class="section-icon">📝</span>
          最新文章
        </h2>
        <a href="/archives/" class="view-all">查看全部 →</a>
      </div>
      <YunPostList />
    </div>

    <!-- 公告区域 -->
    <YunNotice
      v-if="showNotice"
      class="notice-section"
      :content="themeConfig.notice.content"
    />
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero-section {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  margin-bottom: 3rem;
  color: white;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 2rem;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  object-fit: cover;
  transition: transform 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
}

.status-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: #4CAF50;
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  border: 3px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.author-info {
  margin-bottom: 2rem;
}

.author-name {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.author-title {
  font-size: 1.5rem;
  font-weight: 400;
  margin: 0 0 1rem 0;
  opacity: 0.9;
}

.author-bio {
  font-size: 1.2rem;
  margin: 0;
  opacity: 0.85;
  line-height: 1.6;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin: 2rem 0;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.social-icon {
  font-size: 1.5rem;
}

.posts-section {
  margin-top: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-icon {
  font-size: 1.5rem;
}

.view-all {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.view-all:hover {
  color: #764ba2;
  text-decoration: underline;
}

.notice-section {
  margin-top: 3rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #667eea;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-section {
    padding: 3rem 1rem;
  }
  
  .author-name {
    font-size: 2rem;
  }
  
  .author-title {
    font-size: 1.2rem;
  }
  
  .stats {
    gap: 2rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .social-links {
    gap: 0.8rem;
  }
  
  .social-link {
    width: 45px;
    height: 45px;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .hero-section {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  }
  
  .section-title {
    color: #fff;
  }
  
  .section-header {
    border-bottom-color: #333;
  }
  
  .notice-section {
    background: #2d2d2d;
    color: #fff;
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>