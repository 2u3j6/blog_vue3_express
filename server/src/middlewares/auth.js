const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret'

module.exports = async (ctx, next) => {
  const token = ctx.headers.authorization?.split(' ')[1]
  
  if (!token) {
    ctx.throw(401, '未登录')
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    ctx.state.user = decoded
    await next()
  } catch (err) {
    ctx.throw(401, '登录已过期')
  }
} 