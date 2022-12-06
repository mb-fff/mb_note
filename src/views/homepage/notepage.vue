<template>
  <!-- 上侧导航 -->
  <div :class="isNavShow ? 'm-top-nav is-hide-down' : 'm-top-nav is-hide-up'">
    <Nav @changeNoteType="changeNoteType"></Nav>
  </div>
  <!-- 下侧内容 -->
  <div class="m-content">
    <main class="m-main">
      <!-- 左侧笔记 -->
      <section class="m-l">
        <!-- 类型 -->
        <div class="m-type">
          <span :class="typeItem.isActive ? 'm-type-item is-active' : 'm-type-item'" v-for="typeItem in navlist"
            @click="changeType(typeItem.navName)" :key="typeItem.navName">{{ typeItem.navName }}</span>
        </div>
        <!-- 笔记列表 -->
        <ul class="m-note-list" v-infinite-scroll="noteLoad" :infinite-scroll-immediate="false">
          <li class="m-note-item" v-for="item in notelist" :key="item.noteId">
            <!-- 笔记信息 -->
            <div class="m-item-l">
              <!-- 头部 -->
              <div class="m-note-t">
                <span class="m-note-t-name">{{ item.author }}</span>
                <span class="m-note-t-time">{{ item.createTime }}</span>
              </div>
              <!-- 标题 -->
              <h3 class="m-note-title" @click="toNoteDetail(item.noteId)">{{ item.title }}</h3>
              <!-- 描述 -->
              <p class="m-note-desc">{{ item.desc }}</p>
              <!-- 底部 -->
              <div class="m-note-b">
                <div class="m-note-b-item">
                  <el-icon :size="16">
                    <View />
                  </el-icon>
                  <span class="m-val">{{ item.trafficNum }}</span>
                </div>
                <div class="m-note-b-item">
                  <el-icon :size="16">
                    <chat-square />
                  </el-icon>
                  <span class="m-val">{{ item.markNum }}</span>
                </div>
              </div>
            </div>
            <!-- 预览图 -->
            <div class="m-item-r">
              <img class="m-img" :src="item.imgUrl" />
            </div>
          </li>
          <!-- 加载状态 -->
          <p class="m-data-loading" v-show="isNoteLoading">
            <span class="m-span-load">加载中</span>
            <el-icon>
              <loading />
            </el-icon>
          </p>
          <!-- 到底了 -->
          <p class="m-data-null" v-show="isNull">到底了</p>
        </ul>
      </section>
      <!-- 右侧区域 -->
      <section class="m-r">
        <h2 class="m-curTimeType">
          <el-icon color="#f5a415" :size="24">
            <calendar />
          </el-icon>
          <span class="m-curTimeType-name">{{ curTimeType }}好！</span>
        </h2>
        <h2 class="m-curDate">{{ curDate }}</h2>
        <p class="m-welcome">welcome to my note!</p>
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
import Nav from '@/components/Nav.vue'
import { reactive, onBeforeUnmount, watch, toRefs, computed } from 'vue'
import { View, ChatSquare, Loading, Calendar } from '@element-plus/icons-vue'
import { changeNavStyle } from '@/utils/common'
import { INavItem } from '@/types/IUtils'
import HttpNote from '@/api/httpNote'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'

const httpNote = new HttpNote()
const $router = useRouter()

// 状态
const state = reactive({
  // 导航是否显示
  isNavShow: true,
  // 当前页面滚动条高度
  curScrollTop: 0,
  // 导航列表
  navlist: [
    {
      navName: '最新',
      isActive: true,
      path: ''
    },
    {
      navName: '最热',
      isActive: false,
      path: ''
    }
  ],
  // 笔记列表
  notelist: [
    // {
    //   noteId: 0,
    //   author: '',
    //   createTime: '',
    //   title: '',
    //   type: 0,
    //   desc: '',
    //   trafficNum: '',
    //   markNum: '',
    //   imgUrl: ''
    // }
  ],
  // 笔记类型
  type: 0,
  // 当前页
  pageNum: 1,
  // 条数
  pageSize: 5,
  // 是否加载数据
  isNoteLoading: false,
  // 是否加载到底了
  isNull: false,
  // 当前日期
  curDate: dayjs().format('YYYY年MM月DD日 HH:mm:ss')
})

const { isNavShow, navlist, notelist, isNoteLoading, isNull, curDate } =
  toRefs(state)

// 监听笔记类型的改变
watch(
  () => state.type,
  (newV) => {
    state.pageNum = 1
    state.isNull = false
    getAllNote()
  },
  {
    deep: true,
    immediate: true
  }
)

// 上午、下午、中午
const curTimeType = computed(() => {
  const time = Number(dayjs().format('HH'))
  return time === 12 ? '中午' : time < 12 ? '上午' : '下午'
})

// 切换标签
const changeNoteType = (navItem: INavItem) => {
  if (navItem.type !== undefined) state.type = navItem.type
}

// 获取笔记列表
async function getAllNote(flag?: string) {
  try {
    const param = {
      pageNum: state.pageNum,
      pageSize: state.pageSize,
      type: state.type
    }
    const res = await httpNote.getAllNote(param)
    const { data } = res.data
    if (flag !== 'infinite') state.notelist = []
    data.list.forEach((item: any) => {
      state.notelist.push({
        noteId: item.id,
        author: item.author,
        createTime: dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss'),
        title: item.title,
        type: item.type,
        desc: item.desc,
        trafficNum: item.views,
        markNum: item.comments,
        imgUrl:
          'https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd21166593a541908cafdfed7f716be3~tplv-k3u1fbpfcp-no-mark:240:240:240:160.awebp?'
      })
    })
    if (flag === 'infinite') state.isNoteLoading = false
    if (data.list.length === 0) state.isNull = true
  } catch (error: any) {
    ElMessage.error(error.data.message)
  }
}

// 滚动加载
const noteLoad = () => {
  state.isNoteLoading = true
  state.pageNum++
  getAllNote('infinite')
}

// 跳转至笔记详情
const toNoteDetail = (noteId: number) => {
  const routeUrl = $router.resolve({
    path: '/note',
    query: { noteId }
  })
  window.open(routeUrl.href, '_blank')
}

// 切换类型
const changeType = (curType: string): void => {
  console.log(curType)
  changeNavStyle(curType, state.navlist)
}

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

setInterval(() => {
  state.curDate = dayjs().format('YYYY年MM月DD日 HH:mm:ss')
}, 1000)
</script>

<style scoped lang='scss'>
.m-top-nav {
  width: 100%;
  background-color: #fff;
  position: fixed;
  top: 60px;
  z-index: 99;

  &.is-hide-up {
    transform: translateY(-60px);
    transition: 0.3s linear;
  }

  &.is-hide-down {
    transform: translateY(0);
    transition: 0.3s linear;
  }
}

.m-content {
  width: 100%;
  background-color: #f4f5f5;

  .m-main {
    width: 960px;
    margin: 0 auto;
    padding-top: 115px;
    display: flex;
    justify-content: space-around;

    .m-l {
      width: 700px;
      background-color: #fff;

      .m-type {
        width: 100%;
        height: 46px;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #909090;

        .m-type-item {
          padding: 0 15px;

          &:nth-child(1) {
            border-right: 1px solid #eee;
          }

          &:hover {
            cursor: pointer;
            color: #1e80ff;
          }

          &.is-active {
            color: #1e80ff;
          }
        }
      }

      .m-note-list {
        height: calc(100vh - 161px);
        overflow-x: hidden;
        overflow-y: auto;

        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-thumb {
          background-color: #ddd;
          border-radius: 3px;
        }

        .m-note-item {
          height: 160px;
          padding: 15px;
          background-color: #fff;
          border-top: 1px solid #eee;
          text-align: left;
          box-sizing: border-box;
          display: flex;

          .m-item-l {
            width: 70%;

            .m-note-t {
              height: 22px;
              line-height: 22px;
              font-size: 13px;
              color: #86909c;

              .m-note-t-name,
              .m-note-t-time {
                padding: 0 8px;
              }

              .m-note-t-name {
                border-right: 1px solid #eee;
                padding-left: 0;
              }
            }

            .m-note-title {
              height: 54px;
              padding: 15px 0;
              line-height: 24px;
              box-sizing: border-box;
              color: #1d2129;
              font-weight: 700;

              &:hover {
                cursor: pointer;
              }
            }

            .m-note-desc {
              width: 100%;
              height: 22px;
              line-height: 22px;
              color: #86909c;
              font-size: 13px;
              font-weight: 400;
              margin-bottom: 10px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }

            .m-note-b {
              height: 20px;
              display: flex;
              align-items: center;

              .m-note-b-item {
                font-size: 13px;
                color: #4e5969;
                display: flex;
                align-items: center;
                margin-right: 20px;

                .m-val {
                  padding: 0 5px;
                }
              }
            }
          }

          .m-item-r {
            width: 30%;
            padding: 20px;
            box-sizing: border-box;

            .m-img {
              width: 100%;
              height: 100%;

              &:hover {
                cursor: pointer;
              }
            }
          }
        }

        .m-data-loading {
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 14px;
          color: #3f95ed;

          .m-span-load {
            margin: 0 2px;
          }
        }

        .m-data-null {
          height: 20px;
          line-height: 20px;
          text-align: center;
          font-size: 14px;
          color: #dedfe0;
        }
      }
    }

    .m-r {
      width: 240px;
      height: 170px;
      background-color: #fff;
      padding: 10px;
      box-sizing: border-box;

      .m-curTimeType {
        height: 50px;
        font-size: 22px;
        display: flex;
        align-items: center;
        justify-content: center;

        .m-curTimeType-name {
          margin: 0 5px;
        }
      }

      .m-curDate {
        height: 50px;
        line-height: 50px;
        text-align: center;
      }

      .m-welcome {
        height: 50px;
        line-height: 50px;
        text-align: center;
      }
    }
  }
}
</style>
