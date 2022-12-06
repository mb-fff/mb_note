import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    redirect: '/homepage',
    component: () => import(/* webpackChunkName:"home" */ '@/views/homepage/home.vue'),
    children: [
      // 首页
      {
        path: '/homepage',
        name: 'Homepage',
        component: () => import(/* webpackChunkName:"home" */ '@/views/homepage/homepage.vue')
      },
      // 笔记列表
      {
        path: '/notelist',
        name: 'NoteList',
        component: () => import(/* webpackChunkName:"home" */ '@/views/homepage/notepage.vue')
      },
      {
        path: '/note',
        name: 'Note',
        component: () => import(/* webpackChunkName:"note" */ '@/views/note/note.vue')
      }
    ]
  },
  // 写笔记
  {
    path: '/edit',
    name: 'Edit',
    component: () => import(/* webpackChunkName:"edit" */ '@/views/edit/editNote.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
