import router from './index'
import { useUserStore } from '@/stores/user'

const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (userStore.token) {
    if (to.path === '/login') {
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