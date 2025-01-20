const { DataTypes } = require('sequelize')
const sequelize = require('./db')
const bcrypt = require('bcryptjs')

const User = sequelize.define('user', {
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
    set(value) {
      const hash = bcrypt.hashSync(value, 10)
      this.setDataValue('password', hash)
    }
  }
}, {
  tableName: 'user',
  underscored: true
})

module.exports = User 