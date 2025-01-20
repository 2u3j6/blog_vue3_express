const { Sequelize } = require('sequelize')
const config = require('../config/database')

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging,
    define: {
      freezeTableName: true
    }
  }
)

module.exports = sequelize 