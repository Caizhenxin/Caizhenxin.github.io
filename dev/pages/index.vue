<template>
  <div class="home-page">
    <YunBanner />
    <YunPostList />
  </div>
</template>

<script setup lang="ts">
import YunBanner from 'valaxy-theme-yun/components/YunBanner.vue'
import YunPostList from 'valaxy-theme-yun/components/YunPostList.vue'
</script>

<route lang="yaml">
meta:
  layout: home
</route>