const { DataTypes } = require('sequelize')
const sequelize = require('./db')

const Category = sequelize.define('category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING
  }
}, {
  freezeTableName: true,
  tableName: 'category'
})

module.exports = Category 