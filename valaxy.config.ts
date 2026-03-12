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
      enable: true,
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
  },
})