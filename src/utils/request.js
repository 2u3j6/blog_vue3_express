/*
 * @Author: yu2u3j6 1398433233@qq.com
 * @Date: 2025-01-05 14:08:42
 * @LastEditors: yu2u3j6 1398433233@qq.com
 * @LastEditTime: 2025-01-20 10:21:59
 * @FilePath: \cursor_demo\src\utils\request.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios'
import { ElLoading } from 'element-plus'

let loading = null
let needLoadingRequestCount = 0

const startLoading = () => {
  console.log('开始loading...')
  loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(255, 255, 255, 0.3)',
    fullscreen: true,
    target: 'body',
  })
}

const endLoading = () => {
  if (loading) {
    loading.close()
    loading = null
  }
}

const showFullScreenLoading = () => {
  console.log('当前请求数:', needLoadingRequestCount)
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

const tryHideFullScreenLoading = () => {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    setTimeout(() => {
      endLoading()
    }, 100)
  }
}

const request = axios.create({
  baseURL: '/blog',
  timeout: 5000,
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    console.log('发起请求:', config.url)
    if (!config.noLoading) {
      showFullScreenLoading()
    }
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    tryHideFullScreenLoading()
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    if (!response.config.noLoading) {
      tryHideFullScreenLoading()
    }
    return response.data
  },
  (error) => {
    if (!error.config?.noLoading) {
      tryHideFullScreenLoading()
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default request
