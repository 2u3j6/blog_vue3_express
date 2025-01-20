require('dotenv').config()

module.exports = {
  database: process.env.DB_NAME || 'blog_db',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootroot',
  host: process.env.DB_HOST || '47.100.111.51',
  dialect: 'mysql',
  logging: false,
  define: {
    timestamps: true,
    underscored: true
  },
  dialectOptions: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  }
} 