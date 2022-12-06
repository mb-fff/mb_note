<template>
  <!-- 头部header -->
  <div :class="state.isNavShow ? 'm-top-wrap is-hide-down' : 'm-top-wrap is-hide-up'">
    <Header></Header>
  </div>
  <!-- 子路由渲染 -->
  <router-view />
</template>

<script lang="ts" setup>
import Header from '@/components/Header.vue'
import { reactive, onBeforeUnmount } from 'vue'

// 状态
const state = reactive({
  // 导航是否显示
  isNavShow: true,
  // 当前页面滚动条高度
  curScrollTop: 0
})

// 滚动条滚动处理
const handleScroll = (): void => {
  const scrollTop: number =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop

  if (scrollTop > 300 && scrollTop > state.curScrollTop) {
    // 当前滚动条高度大于300且向下滑动
    state.isNavShow = false
  } else if (scrollTop < state.curScrollTop) {
    // 向上滑动
    state.isNavShow = true
  }
  state.curScrollTop = scrollTop
}

// 监听滚动条滚动事件
window.addEventListener('scroll', handleScroll)

// 实例销毁之前
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang='scss'>
.m-top-wrap {
  width: 100%;
  background-color: #fff;
  position: fixed;
  top: 0;
  z-index: 999;
  &.is-hide-up {
    transform: translateY(-60px);
    transition: 0.3s linear;
  }
  &.is-hide-down {
    transform: translateY(0);
    transition: 0.3s linear;
  }
}
</style>
