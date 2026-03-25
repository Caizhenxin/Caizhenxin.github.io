import { defineValaxyConfig } from 'valaxy'
import type { ThemeConfig } from 'valaxy-theme-yun'

export default defineValaxyConfig<ThemeConfig>({
  siteConfig: {
    lang: 'zh-CN',
    title: '游手好闲辛大人',
    author: {
      name: 'Cai Zhenxin',
      avatar: 'https://cdn.jsdelivr.net/gh/Caizhenxin/Caizhenxin.github.io/public/avatar.png',
      status: {
        emoji: '🚀',
        message: '正在编码...',
      },
    },
    description: '技术博客与个人作品集',
    url: 'https://caizhenxin.github.io',
  },

  theme: 'yun',
  themeConfig: {
    banner: {
      enable: true,
      title: '游手好闲辛大人',
      description: '🚀 热爱技术，热爱生活',
      cloud: {
        enable: true,
      },
    },
    
    say: {
      enable: true,
      api: 'https://el-bot-api.vercel.app/api/words',
      hitokoto: {
        api: 'https://v1.hitokoto.cn',
      },
    },

    social: [
      {
        name: 'GitHub',
        link: 'https://github.com/Caizhenxin',
        icon: 'i-ri-github-line',
        color: '#6e5494',
      },
      {
        name: 'Blog',
        link: 'https://caizhenxin.github.io',
        icon: 'i-ri-globe-line',
        color: '#0078D7',
      },
    ],

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

    footer: {
      since: 2026,
      icon: {
        enable: true,
        name: 'i-ri-cloud-line',
        animated: true,
      },
      powered: {
        enable: true,
        copyright: {
          enable: true,
          length: 50,
        },
      },
    },

    fireworks: {
      enable: true,
    },
  },

  router: {
    base: '/',
    extendRoute(route) {
      if (!route.meta) {
        route.meta = {}
      }
      if (!route.meta.layout) {
        route.meta.layout = 'default'
      }
      return route
    },
  },
})