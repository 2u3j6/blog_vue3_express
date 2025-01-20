/*
 * @Author: yu2u3j6 1398433233@qq.com
 * @Date: 2025-01-05 14:03:49
 * @LastEditors: yu2u3j6 1398433233@qq.com
 * @LastEditTime: 2025-01-20 16:13:35
 * @FilePath: \cursor_demo\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs' // 导入中文语言包
import { createPinia } from 'pinia'
import * as ElementPlusIcons from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
const app = createApp(App)

// 配置 Element Plus 为中文
app.use(ElementPlus, {
  locale: zhCn,
})

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIcons)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.mount('#app')
