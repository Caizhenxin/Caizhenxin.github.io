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
      title: '欢迎来到我的博客',
    },
    // 社交链接
    social: [
      {
        name: 'GitHub',
        link: 'https://github.com/Caizhenxin',
        icon: 'i-ri-github-line',
      },
    ],
  },

  // 开发工具
  devtools: true,

  // 构建配置
  build: {
    ssgForPagination: true,
  },
})
