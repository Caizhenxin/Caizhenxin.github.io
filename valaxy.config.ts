import { defineValaxyConfig } from 'valaxy'
import type { ThemeConfig } from 'valaxy-theme-yun'

export default defineValaxyConfig<ThemeConfig>({
  // 站点配置
  siteConfig: {
    lang: 'zh-CN',
    title: 'Cai Zhenxin 的博客',
    author: {
      name: 'Cai Zhenxin',
    },
    description: '技术博客与个人作品集',
    url: 'https://caizhenxin.github.io',
  },

  // 主题配置
  theme: 'yun',
  themeConfig: {
    banner: {
      enable: true,
      title: '游手好闲辛大人的小站',
      cloud: {
        enable: true,
      },
    },
    // 社交链接
    social: [
      {
        name: 'GitHub',
        link: 'https://github.com/Caizhenxin',
        icon: 'i-ri-github-line',
      },
    ],
    // 页面配置
    pages: [
      {
        name: '归档',
        url: '/archives/',
        icon: 'i-ri-archive-line',
      },
      {
        name: '标签',
        url: '/tags/',
        icon: 'i-ri-price-tag-3-line',
      },
      {
        name: '关于',
        url: '/about/',
        icon: 'i-ri-user-line',
      },
    ],
    // 页脚配置
    footer: {
      since: 2026,
      icon: {
        enable: true,
        name: 'i-ri-cloud-line',
        animated: true,
      },
    },
  },

  // 开发工具
  devtools: true,

  // 构建配置
  build: {
    ssgForPagination: true,
  },
})
