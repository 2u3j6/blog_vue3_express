import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null,
  }),
  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
      // 添加调试日志
      console.log('存储的token:', token)
    },
    setUserInfo(info) {
      this.userInfo = info
    },
    clearUserInfo() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem('token')
    },
  },
})
