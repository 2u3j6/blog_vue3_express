const { DataTypes } = require('sequelize')
const sequelize = require('./db')

const Tag = sequelize.define('tag', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  freezeTableName: true,
  tableName: 'tag'
})

module.exports = Tag 