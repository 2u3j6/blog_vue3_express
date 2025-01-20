const mysql = require('mysql2/promise')
const config = require('../config/database')

// 创建连接池
const pool = mysql.createPool({
  host: config.host,
  user: config.username,
  password: config.password,
  database: config.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
})

// 执行 SQL 查询的工具函数
const query = async (sql, params = []) => {
  try {
    const [rows] = await pool.execute(sql, params)
    return rows
  } catch (error) {
    console.error('SQL Error:', error)
    throw error
  }
}

// 分页查询工具函数
const paginate = async (sql, params = [], page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize
  const countSql = sql.replace(/SELECT.*?FROM/i, 'SELECT COUNT(*) as total FROM')
  
  try {
    const [rows] = await pool.execute(`${sql} LIMIT ? OFFSET ?`, [...params, pageSize, offset])
    const [countResult] = await pool.execute(countSql, params)
    
    return {
      list: rows,
      total: countResult[0].total,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    }
  } catch (error) {
    console.error('SQL Error:', error)
    throw error
  }
}

// 事务执行工具函数
const transaction = async (callback) => {
  const connection = await pool.getConnection()
  
  try {
    await connection.beginTransaction()
    const result = await callback(connection)
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

module.exports = {
  query,
  paginate,
  transaction,
  pool
} 