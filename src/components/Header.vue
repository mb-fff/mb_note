<template>
  <!-- header -->
  <header class="m-header">
    <!-- 左侧logo -->
    <div class="m-l">
      <img class="m-logo" src="@/assets/img/logo.png" />
      <span class="m-title">NOTE</span>
    </div>
    <!-- 中间菜单 -->
    <div class="m-c">
      <nav class="m-nav-t">
        <span
          :class="navItem.isActive ? 'm-nav-t-item is-active' : 'm-nav-t-item'"
          v-for="navItem in navlist"
          :key="navItem.navName"
          @click="changeNav(navItem)"
        >{{ navItem.navName }}</span>
      </nav>
    </div>
    <!-- 右侧功能、登录信息 -->
    <div class="m-r">
      <!-- 搜索框 -->
      <el-input
        v-model="searchKey"
        class="m-search"
        placeholder="search note"
        :suffix-icon="Search"
      />
      <!-- 写笔记 -->
      <el-button class="m-write-note" type="primary" @click="edit()">写笔记</el-button>
      <!-- 登陆 -->
      <el-button
        class="m-btn-login"
        type="primary"
        v-if="loginStatus === false"
        @click="loginDialogVisible = true"
      >登陆</el-button>
      <!-- 头像 -->
      <div class="m-avatar" v-else>
        <img :src="userInfo.avatar" @click="isShowOperList = !isShowOperList" />
      </div>
    </div>
  </header>
  <!-- 操作列表 -->
  <aside class="m-oper-list" v-show="isShowOperList">
    <p class="m-oper-item" @click="edit()">
      <el-icon>
        <edit-pen />
      </el-icon>写笔记
    </p>
    <p class="m-oper-item">
      <el-icon>
        <user-filled />
      </el-icon>我的主页
    </p>
    <p class="m-oper-item">
      <el-icon>
        <folder-checked />
      </el-icon>标签管理
    </p>
    <p class="m-oper-item">
      <el-icon>
        <View />
      </el-icon>浏览记录
    </p>
    <p class="m-oper-item">
      <el-icon>
        <tools />
      </el-icon>设置
    </p>
    <p class="m-oper-item" @click="logout()">
      <el-icon>
        <switch-button />
      </el-icon>退出
    </p>
  </aside>
  <!-- 登陆框 -->
  <Login :loginDialogVisible="loginDialogVisible" @changeVisible="changeVisible"></Login>
</template>

<script  lang="ts" setup>
import { computed, reactive, watch, toRefs } from 'vue'
import Login from './Login.vue'
import { Search, View, EditPen, UserFilled, FolderChecked, Tools, SwitchButton } from '@element-plus/icons-vue'
import { changeNavStyle } from '@/utils/common'
import { LocalStorageOfTime, Storage } from '@/utils/storage'
import { INavItem } from '@/types/IUtils'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

const storageOfTime = new LocalStorageOfTime()
const storage = new Storage('session')
const $store = useStore()
const $router = useRouter()
const $route = useRoute()

// 状态
let state = reactive({
  // 搜索关键词
  searchKey: '',
  // 导航列表
  navlist: [
    {
      navName: '首页',
      isActive: true,
      path: 'Homepage'
    },
    {
      navName: '笔记',
      isActive: false,
      path: 'NoteList'
    }
  ],
  // 操作列表状态
  isShowOperList: false,
  // 登录框状态
  loginDialogVisible: false
})

// 解构，template中可直接使用
const { searchKey, navlist, isShowOperList, loginDialogVisible } = toRefs(state)

// 登陆状态
const loginStatus = computed(() => {
  const status: boolean = $store.getters.loginStatus
  if (status) $store.dispatch('getUserInfo')
  return status
})

// 登陆人信息
const userInfo = computed(() => {
  return $store.getters.userInfo
})

// 当前标签页
const curNavItem = computed(() => {
  return $store.getters.curNavItem
})

// 监听搜索框内容
watch(
  () => state.searchKey,
  newV => {
    console.log(newV)
  },
  {
    // 深度监听
    deep: true
  }
)

// 监听当前标签页
watch(
  () => curNavItem,
  newV => {
    changeNavStyle(newV.value.navName, state.navlist)
  },
  {
    deep: true
  }
)

// 判断token是否存在或过期，决定登陆状态
const getLoginStatus = (): void => {
  const token = storageOfTime.get('mb_note_token').value
  if (token) {
    $store.commit('SET_LOGIN_STATUS', true)
  }
}

// 切换标签页（首页、笔记、收藏）
const changeNav = (navItem: INavItem):void => {
  changeNavStyle(navItem.navName, state.navlist)
  storage.set('mb_note_curNavItem', navItem)
  $store.commit('SET_CUR_NAV_ITEM', navItem)
  $router.push({ name: navItem.path })
}

// 关闭登录框
const changeVisible = (val: boolean): void => {
  state.loginDialogVisible = val
}

// 退出登陆
const logout = (): void => {
  storageOfTime.remove('mb_note_token')
  $store.commit('SET_LOGIN_STATUS', false)
  state.isShowOperList = false
}

// 写笔记
const edit = (): void => {
  loginStatus.value ? $router.push({ name: 'Edit' }) : state.loginDialogVisible = true
}

// 数据初始化
const init = (): void => {
  // 获取初始登陆状态
  getLoginStatus()
  // 笔记页
  const routeName = $route.name
  if (routeName !== 'Note') {
    // 获取当前所在标签页
    let curNavItem = storage.get('mb_note_curNavItem')
    curNavItem = curNavItem ? curNavItem : state.navlist[0]
    changeNav(curNavItem)
  }
}

init()
</script>

<style scoped lang='scss'>
.m-header {
  width: 100%;
  min-width: 1300px;
  height: 60px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0 20px;
  display: flex;
  box-sizing: border-box;
  .m-l {
    width: 10%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .m-logo {
      width: 28px;
      height: 28px;
      &:hover {
        cursor: pointer;
      }
    }
    .m-title {
      font-size: 28px;
      margin: 0 5px;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .m-c {
    width: 65%;
    height: 100%;
    .m-nav-t {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      .m-nav-t-item {
        height: 100%;
        line-height: 59px;
        font-size: 16px;
        font-weight: 500;
        margin: 0 20px;
        position: relative;
        &:hover {
          cursor: pointer;
          &::before {
            display: inline;
          }
        }
        &.is-active {
          color: #1e80ff;
          &::before {
            display: inline;
          }
        }
        &::before {
          display: none;
          content: "";
          width: 32px;
          height: 3px;
          background-color: #1e80ff;
          position: absolute;
          bottom: 0;
        }
      }
    }
  }
  .m-r {
    width: 25%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .m-search {
      width: 200px;
    }
    .m-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
}
.m-oper-list {
  width: 150px;
  height: 260px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  position: absolute;
  right: 0;
  top: 60px;
  z-index: 999;
  padding: 20px 15px;
  box-sizing: border-box;
  .m-oper-item {
    height: 24px;
    line-height: 24px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    font-size: 16px;
    .el-icon {
      margin-right: 10px;
      color: #86909c;
    }
    &:hover {
      cursor: pointer;
      background: #f1f3f4;
    }
  }
}
</style>
