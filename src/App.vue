<template>
  <router-view />
  <!-- 返回最上层 -->
  <BackTop></BackTop>
</template>

<script lang="ts" setup>
import BackTop from '@/components/BackTop.vue'
</script>

<style lang="scss">
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
html,
body {
  width: 100%;
  height: 100%;
}
</style>
