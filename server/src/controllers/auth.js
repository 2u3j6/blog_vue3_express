const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const JWT_SECRET = 'your-jwt-secret'

exports.login = async (ctx) => {
  const { username, password } = ctx.request.body

  const user = await User.findOne({ where: { username } })
  if (!user || !bcrypt.compareSync(password, user.password)) {
    ctx.throw(401, '用户名或密码错误')
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' })
  
  ctx.body = {
    code: 200,
    data: { token }
  }
} 