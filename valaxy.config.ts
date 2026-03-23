import { defineValaxyConfig } from 'valaxy'
import type { ThemeConfig } from 'valaxy-theme-yun'

export default defineValaxyConfig<ThemeConfig>({
  siteConfig: {
    lang: 'zh-CN',
    title: '游手好闲辛大人',
    author: {
      name: 'Cai Zhenxin',
    },
    description: '技术博客与个人作品集',
    url: 'https://caizhenxin.github.io',
  },

  theme: 'yun',
  themeConfig: {
    banner: {
      enable: false,
      title: '游手好闲辛大人',
    },
    social: [
      {
        name: 'GitHub',
        link: 'https://github.com/Caizhenxin',
        icon: 'i-ri-github-line',
      },
    ],
  },

  router: {
    base: '/',
    extendRoute(route) {
      // Ensure route.meta exists and has a layout property
      if (!route.meta) {
        route.meta = {}
      }
      // Set default layout if not specified
      if (!route.meta.layout) {
        route.meta.layout = 'default'
      }
      return route
    },
  },
})