<template>
  <div class="m-nav">
    <nav class="m-nav-inner">
      <span
        :class="navItem.isActive ? 'm-nav-item is-active' : 'm-nav-item'"
        v-for="navItem in state.navlist"
        :key="navItem.navName"
        @click="changeNav(navItem)"
      >{{ navItem.navName }}</span>
      <span class="m-nav-item is-manage">标签管理</span>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { changeNavStyle } from '@/utils/common'
import { INavItem } from '@/types/IUtils'
import HttpType from '@/api/httpType'

const httpType = new HttpType()

// 状态
const state = reactive({
  // 导航列表
  navlist: [
    {
      navName: '综合',
      isActive: true,
      type: 0
    }
  ]
})

// 获取笔记类型
const getAllType = async () => {
  try {
    const param = {}
    const res = await httpType.getAllType(param)
    const { list } = res.data.data
    list.forEach((item: any) => {
      state.navlist.push({
        navName: item.type_desc,
        isActive: false,
        type: item.type
      })
    })
  } catch (error) {
    console.log(error)
  }
}

const emit = defineEmits(['changeNoteType'])

// 切换标签页
const changeNav = (navItem: INavItem): void => {
  changeNavStyle(navItem.navName, state.navlist)
  emit('changeNoteType', navItem)
}

getAllType()
</script>

<style scoped lang='scss'>
.m-nav {
  width: 100%;
  height: 46px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  background-color: #fff;
  .m-nav-inner {
    width: 1000px;
    height: 100%;
    display: flex;
    align-items: center;
    position: relative;
    margin: 0 auto;
    .m-nav-item {
      font-size: 14px;
      margin: 0 15px;
      color: #71777c;
      position: relative;
      &:hover {
        cursor: pointer;
        color: #1e80ff;
      }
      &.is-active {
        color: #1e80ff;
      }
      &.is-manage {
        position: absolute;
        right: 10px;
      }
    }
  }
}
</style>
