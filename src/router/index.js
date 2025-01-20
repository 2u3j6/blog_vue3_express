/*
 * @Author: yu2u3j6 1398433233@qq.com
 * @Date: 2025-01-05 14:03:35
 * @LastEditors: yu2u3j6 1398433233@qq.com
 * @LastEditTime: 2025-01-06 16:30:35
 * @FilePath: \cursor_demo\src\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import Login from '@/views/Login.vue'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('../views/dashboard/index.vue'),
      },
      {
        path: 'posts',
        component: () => import('../views/Posts.vue'),
      },
      {
        path: 'categories',
        component: () => import('../views/Categories.vue'),
      },
      {
        path: 'tags',
        component: () => import('../views/Tags.vue'),
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (userStore.token) {
    if (to.path === '/login') {
      console.log('/')

      next({ path: '/' })
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

export default router
