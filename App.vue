<script lang="ts" setup>
import { useAppStore } from 'valaxy'
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeConfig } from 'valaxy-theme-yun/composables/config'
import { useYunAppStore } from 'valaxy-theme-yun/stores/app'

const themeConfig = useThemeConfig()

const app = useAppStore()
const yun = useYunAppStore()
const route = useRoute()

// 修复：安全地处理路由变化，避免访问未定义的 route.meta
watch(
  () => route && route.meta && route.meta.layout,
  (layout) => {
    if (layout === 'home' || app.isMobile)
      yun.leftSidebar.isOpen = false
    else
      yun.leftSidebar.isOpen = false
  },
  { immediate: true },
)

onMounted(() => {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
  app.showLoading = false
})

const isDev = import.meta.env.DEV
</script>

<template>
  <YunStratoApp v-if="yun.isStrato" />
  <YunDebug v-if="isDev" />

  <YunPageHeaderGradient />
  <YunNavMenu />

  <YunFullscreenMenu v-if="yun.isNimbo && !yun.size.isLg" />
  <YunStratoSidebar v-if="yun.isStrato" />

  <YunFireworks v-if="themeConfig.fireworks.enable" />
  <slot name="bg">
    <YunBg v-if="themeConfig.bg_image.enable" />
  </slot>
  <YunBackToTop />
</template>