<template>
  <div class="m-content">
    <main class="m-main">
      <!-- 左侧笔记 -->
      <section class="m-l">
        <div class="m-box-title">
          <h1 class="m-title">{{ noteData.title }}</h1>
          <div class="m-box-info">
            <div class="m-box-info-l">
              <img class="m-avatar" :src="userInfo.avatar" />
            </div>
            <div class="m-box-info-r">
              <p class="m-info-nickName">{{ userInfo.nickname }}</p>
              <p class="m-info-time">{{ noteData.create_time }}</p>
            </div>
          </div>
        </div>
        <v-md-editor
          v-model="noteData.content"
          mode="preview"
          @copy-code-success="handleCopyCodeSuccess"
        ></v-md-editor>
      </section>
      <!-- 右侧区域 -->
      <section class="m-r">
        <div class="m-box-user">
          <div class="m-user-l">
            <img class="m-user-l-avatar" :src="userInfo.avatar" />
          </div>
          <div class="m-user-r">
            <span class="m-user-r-author">{{ userInfo.nickname }}</span>
          </div>
        </div>
        <div class="m-box-info">
          <div class="m-views">
            <div class="m-views-icon">
              <el-icon :size="16" color="#7bb9ff">
                <View />
              </el-icon>
            </div>
            <div class="m-views-inner">
              文章被阅读
              <span class="m-viwes-data">{{ noteData.views }}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, computed } from 'vue'
import HttpNote from '@/api/httpNote'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { View } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'

const $route = useRoute()
const $store = useStore()
const httpNote = new HttpNote()

const state = reactive({
  noteData: {
    id: 0,
    author: '',
    create_time: '',
    title: '',
    content: '',
    views: 0
  }
})

const { noteData } = toRefs(state)

// 查询笔记
const queryNoteById = async () => {
  try {
    const res = await httpNote.getNoteById({ id: Number($route.query.noteId) })
    const { data } = res.data
    data.create_time = dayjs(data.create_time).format('YYYY年MM月DD日 HH:mm')
    state.noteData = data
    console.log(data)
    updateNoteById()
  } catch (error) {
    console.log(error)
  }
}

// 每进入一次，浏览量+1
const updateNoteById = async () => {
  try {
    const res = await httpNote.updateNote({ id: state.noteData.id, views: state.noteData.views + 1 })
  } catch (error) {
    console.log(error)
  }
}

// 登陆人信息
const userInfo = computed(() => {
  return $store.getters.userInfo
})

// 快捷复制
const handleCopyCodeSuccess = (code: string): void => {
  ElMessage.success('copy success')
}

queryNoteById()
</script>

<style lang='scss' scoped>
.m-content {
  width: 100%;
  background-color: #f4f5f5;
  .m-main {
    width: 1080px;
    margin: 0 auto;
    padding-top: 80px;
    display: flex;
    justify-content: space-around;
    .m-l {
      width: 800px;
      min-height: calc(100vh - 80px);
      background-color: #fff;
      padding: 20px;
      box-sizing: border-box;
      :deep(.javascript) {
        white-space: pre-wrap;
      }
      :deep(.github-markdown-body) {
        padding: 0;
      }
      :deep(.github-markdown-body h1, .github-markdown-body h2) {
        border: none;
      }
      .m-box-title {
        margin-bottom: 30px;
        border-bottom: 1px solid #ebeef5;
        .m-title {
          height: 42px;
          line-height: 42px;
          margin-bottom: 20px;
          font-size: 32px;
          font-weight: 600;
        }
        .m-box-info {
          height: 48px;
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          .m-box-info-l {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 15px;
            .m-avatar {
              width: 100%;
              height: 100%;
            }
          }
          .m-box-info-r {
            flex: 1;
            height: 42px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            color: #73767a;
          }
        }
      }
    }
    .m-r {
      width: 240px;
      height: 200px;
      background-color: #fff;
      padding: 20px;
      box-sizing: border-box;
      .m-box-user {
        height: 80px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ebeef5;
        .m-user-l {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          .m-user-l-avatar {
            width: 100%;
            height: 100%;
            &:hover {
              cursor: pointer;
            }
          }
        }
        .m-user-r {
          flex: 1;
          .m-user-r-author {
            font-size: 18px;
            margin-left: 20px;
            color: #606266;
          }
        }
      }
      .m-box-info {
        height: 80px;
        display: flex;
        align-items: center;
        .m-views {
          height: 30px;
          display: flex;
          align-items: center;
          .m-views-icon {
            width: 16px;
            height: 16px;
            padding: 4px;
            border-radius: 50%;
            background-color: #e1efff;
            margin-right: 5px;
          }
          .m-views-inner {
            font-size: 14px;
            .m-viwes-data {
              font-size: 16px;
            }
          }
        }
      }
    }
  }
}
</style>
