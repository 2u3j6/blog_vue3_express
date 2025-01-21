/*
 * @Author: yu2u3j6 1398433233@qq.com
 * @Date: 2025-01-05 14:39:58
 * @LastEditors: yu2u3j6 1398433233@qq.com
 * @LastEditTime: 2025-01-21 16:45:58
 * @FilePath: \cursor_demo\server\src\controllers\auth.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret'

exports.login = async (ctx) => {
  try {
    const { username, password } = ctx.request.body

    const user = await User.findOne({ where: { username } })
    if (!user || !bcrypt.compareSync(password, user.password)) {
      ctx.throw(401, '用户名或密码错误')
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' })

    console.log('生成的token:', token)

    ctx.body = {
      code: 200,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
        },
      },
    }
  } catch (error) {
    ctx.throw(500, error)
  }
}
