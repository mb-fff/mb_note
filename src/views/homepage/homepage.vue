<template>
  <main class="m-main">
    <!-- 首屏 -->
    <div class="m-page-one">
      <div class="m-l">
        <div class="m-inner">
          <p class="m-inner-item">Note</p>
          <p class="m-inner-item">{{ state.targetDes }}</p>
          <p class="m-inner-item">
            <el-button class="m-btn" type="success" size="large" @click="beginUse" round>开始使用</el-button>
            <el-button class="m-btn" type="primary" size="large" @click="introduce" round>功能介绍</el-button>
          </p>
        </div>
      </div>
      <div class="m-r">
        <img class="m-img" src="@/assets/img/m1.png" />
      </div>
    </div>
    <!-- 第二屏 -->
    <div class="m-page-two">
      <h2 class="m-title">写笔记</h2>
      <div class="m-video-wrap">
        <video class="m-video" muted autoplay loop>
          <source src="@/assets/video/1.mp4" type="video/mp4" />
          <p>Your browser doesn't support HTML5 video.</p>
        </video>
      </div>
    </div>
    <!-- 第三屏 -->
    <div class="m-page-three">
      <h2 class="m-title">看笔记</h2>
      <div class="m-video-wrap">
        <video class="m-video" muted autoplay loop>
          <source src="@/assets/video/2.mp4" type="video/mp4" />
          <p>Your browser doesn't support HTML5 video.</p>
        </video>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Storage } from '@/utils/storage'
import { scrollTo } from '@/utils/common'

const $router = useRouter()
const $store = useStore()
const storage = new Storage('session')

// 状态
const state = reactive({
  // 应用描述
  originDes: '一款轻量、高效、功能丰富的笔记',
  targetDes: ''
})

// 对应用描述进行处理
const handleText = (text: string): void => {
  // 分割字符串
  const textArr = text.split('')
  let [count, len] = [0, textArr.length]
  // 定时器
  let timer = setInterval(() => {
    state.targetDes += textArr[count++]
    if (count === len) clearInterval(timer)
  }, 100)
}

// 开始使用
const beginUse = (): void => {
  $router.push({ name: 'NoteList' })
  const navItem = { navName: '笔记', isActive: true, path: 'NoteList' }
  $store.commit('SET_CUR_NAV_ITEM', navItem)
  storage.set('mb_note_curNavItem', navItem)
}

// 功能介绍
const introduce = (): void => {
  const y = document.documentElement.offsetHeight || document.body.offsetHeight
  scrollTo(y, 0, 'smooth')
}

handleText(state.originDes)
</script>

<style lang='scss' scoped>
.m-main {
  padding-top: 60px;
  .m-page-one {
    height: calc(100vh - 60px);
    background: linear-gradient(to right, #53a8ff, #95d475);
    display: flex;
    .m-l {
      width: 40%;
      display: flex;
      justify-content: center;
      align-items: center;
      .m-inner {
        width: 360px;
        .m-inner-item {
          height: 60px;
          line-height: 60px;
          color: #fff;
          font-size: 24px;
          &:nth-child(1) {
            font-size: 36px;
          }
          .m-btn {
            margin-right: 15px;
          }
        }
      }
    }
    .m-r {
      width: 60%;
      display: flex;
      justify-content: center;
      align-items: center;
      .m-img {
        width: 90%;
        height: 75%;
        border-radius: 5px;
        animation: mb-fade-in 0.5s linear;
      }
    }
  }
  .m-page-two,
  .m-page-three {
    height: 100vh;
    background: linear-gradient(to bottom, #8cc5ff, #e1f3d8);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .m-title {
      position: absolute;
      height: 50px;
      line-height: 50px;
      text-align: center;
      top: 30px;
      font-size: 26px;
      font-weight: 100;
      color: #606266;
    }
    .m-video-wrap {
      width: 920px;
      height: 490px;
      border-radius: 8px;
      overflow: hidden;
      .m-video {
        width: 100%;
        height: 100%;
      }
    }
  }
  @keyframes mb-fade-in {
    from {
      margin-top: 100px;
      opacity: 0.5;
    }
    to {
      margin-top: 0;
      opacity: 1;
    }
  }
}
</style>
