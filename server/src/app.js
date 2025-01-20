/*
 * @Author: yu2u3j6 1398433233@qq.com
 * @Date: 2025-01-05 14:40:14
 * @LastEditors: yu2u3j6 1398433233@qq.com
 * @LastEditTime: 2025-01-15 10:05:48
 * @FilePath: \cursor_demo\server\src\app.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
require('dotenv').config()
const Koa = require('koa')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const errorHandler = require('./middlewares/errorHandler')
const router = require('./routes')

const app = new Koa()

// 错误处理
app.use(errorHandler)

// 跨域设置
app.use(
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  })
)

// 解析请求体
app.use(bodyParser())

// 路由
app.use(router.routes())
app.use(router.allowedMethods())

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
