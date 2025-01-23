/*
 * @Author: yu2u3j6 1398433233@qq.com
 * @Date: 2025-01-05 14:39:54
 * @LastEditors: yu2u3j6 1398433233@qq.com
 * @LastEditTime: 2025-01-21 16:50:36
 * @FilePath: \cursor_demo\server\src\middlewares\auth.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret' // 添加默认值

module.exports = async (ctx, next) => {
  try {
    // 添加更详细的调试日志
    // console.log('=== 认证中间件开始 ===')
    // console.log('请求路径:', ctx.path)
    // console.log('请求方法:', ctx.method)
    // console.log('完整请求头:', JSON.stringify(ctx.headers, null, 2))
    // console.log('认证头:', ctx.headers.authorization)
    // console.log('JWT_SECRET:', JWT_SECRET)

    const authHeader = ctx.headers.authorization

    if (!authHeader) {
      ctx.throw(401, '未提供认证token')
    }

    // 确保正确解析 Bearer token
    const token = authHeader.split(' ')[1]

    if (!token) {
      // console.log('认证失败: token格式错误')
      ctx.throw(401, '无效的token格式')
    }

    try {
      // 验证 token
      const decoded = jwt.verify(token, JWT_SECRET)
      // console.log('token解码成功:', decoded)
      ctx.state.user = decoded
      await next()
    } catch (err) {
      // console.error('Token验证失败:', err)
      ctx.throw(401, 'token验证失败: ' + err.message)
    }
  } catch (err) {
    // console.error('认证中间件错误:', err)
    ctx.throw(401, err.message)
  }
}
