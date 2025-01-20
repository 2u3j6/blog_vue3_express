const { Sequelize } = require('sequelize')
const bcrypt = require('bcryptjs')
const mysql = require('mysql2/promise')
const config = require('../src/config/database')

const initDatabase = async () => {
  let connection;
  try {
    console.log('开始初始化数据库...')
    
    // 创建 MySQL 连接
    connection = await mysql.createConnection({
      host: config.host,
      user: config.username,
      password: config.password
    })

    // 创建数据库
    console.log('创建数据库...')
    await connection.query(`DROP DATABASE IF EXISTS ${config.database}`)
    await connection.query(
      `CREATE DATABASE ${config.database} 
       CHARACTER SET utf8mb4 
       COLLATE utf8mb4_unicode_ci`
    )
    await connection.query(`USE ${config.database}`)

    // 创建 Sequelize 连接
    console.log('创建 Sequelize 连接...')
    const sequelize = new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      dialect: config.dialect,
      define: {
        timestamps: true,
        underscored: true
      },
      dialectOptions: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      },
      logging: console.log
    })

    // 测试连接
    await sequelize.authenticate()
    console.log('数据库连接成功')

    // 导入模型
    console.log('导入模型...')
    const models = require('../src/models')
    const { User, Category, Tag } = models

    // 同步模型到数据库
    console.log('同步模型到数据库...')
    await models.sequelize.sync({ force: true })

    // 创建管理员用户
    console.log('创建初始数据...')
    const user = await User.create({
      username: 'admin',
      password: 'admin123'
    })
    console.log('创建的用户:', user.toJSON())

    // 创建测试分类
    const categories = await Category.bulkCreate([
      { name: '技术', description: '技术相关文章' },
      { name: '生活', description: '生活随笔' },
      { name: '其他', description: '其他分类' }
    ])
    console.log('创建的分类:', categories.map(c => c.toJSON()))

    // 创建测试标签
    const tags = await Tag.bulkCreate([
      { name: 'JavaScript' },
      { name: 'Vue' },
      { name: 'Node.js' },
      { name: 'MySQL' }
    ])
    console.log('创建的标签:', tags.map(t => t.toJSON()))

    console.log('数据库初始化成功！')
    console.log('默认管理员账号：admin')
    console.log('默认管理员密码：admin123')

    await sequelize.close()
    await connection.end()

  } catch (error) {
    console.error('数据库初始化失败：', error)
    if (connection) {
      await connection.end()
    }
    process.exit(1)
  }
}

// 添加错误处理
process.on('unhandledRejection', (error) => {
  console.error('未处理的 Promise 拒绝:', error)
  process.exit(1)
})

initDatabase() 