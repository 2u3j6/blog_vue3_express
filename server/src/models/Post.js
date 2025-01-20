const { DataTypes } = require('sequelize')
const sequelize = require('./db')

const Post = sequelize.define('post', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 0 // 0: 草稿, 1: 已发布
  }
}, {
  freezeTableName: true,
  tableName: 'post'
})

module.exports = Post 