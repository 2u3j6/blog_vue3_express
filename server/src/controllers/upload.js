const multer = require('@koa/multer')
const path = require('path')
const fs = require('fs') // 使用原生 fs
const fsPromises = require('fs').promises // 使用 promises API

// 配置文件存储
const storage = multer.diskStorage({
  // 设置文件存储位置
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  // 设置文件名
  filename: function (req, file, cb) {
    // 获取文件扩展名
    const ext = path.extname(file.originalname)

    // 生成文件名: 时间戳 + 随机数 + 原始扩展名
    cb(null, `temp-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`)
  },
})

// 文件上传限制
const limits = {
  fileSize: 5 * 1024 * 1024, // 限制文件大小为5MB
  files: 1, // 限制文件数量
}

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 允许所有类型的文件
  cb(null, true)
}

// 创建 multer 实例
const upload = multer({
  storage,
  limits,
  fileFilter,
})

// 导出 multer 中间件
exports.upload = upload.single('file')

// 文件上传处理
exports.uploadFile = async (ctx) => {
  try {
    const file = ctx.request.file
    if (!file) {
      ctx.throw(400, {
        code: 400,
        message: '没有文件被上传',
      })
    }

    ctx.body = {
      code: 200,
      data: {
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
      },
    }
  } catch (error) {
    ctx.status = error.status || 500
    ctx.body = {
      code: error.status || 500,
      message: error.message,
    }
  }
}

// 文件切片上传
exports.uploadSlice = async (ctx) => {
  try {
    const file = ctx.request.file
    const { filename, index, total } = ctx.request.body

    if (!file) {
      ctx.throw(400, {
        code: 400,
        message: '没有文件被上传',
      })
    }
    // 重命名为需要的格式
    const newPath = path.join(path.dirname(file.path), `${index}-${filename}`)

    await fsPromises.rename(file.path, newPath)
    ctx.body = {
      code: 200,
      data: {
        filename,
        index,
        total,
      },
    }
  } catch (error) {
    ctx.status = error.status || 500
    ctx.body = {
      code: error.status || 500,
      message: error.message,
    }
  }
}

// 添加合并切片的方法
exports.mergeSlice = async (ctx) => {
  try {
    const { filename, total } = ctx.request.body
    const chunksDir = path.join(__dirname, '../../uploads')
    const filePath = path.join(chunksDir, filename)

    // 读取所有切片
    const chunkPaths = []
    for (let i = 0; i < total; i++) {
      chunkPaths.push(path.join(chunksDir, `${i}-${filename}`))
    }

    // 使用 Promise 包装写入流操作
    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(filePath)

      writeStream.on('error', reject)
      writeStream.on('finish', resolve)

      // 使用异步函数处理写入
      async function mergeChunks() {
        try {
          for (let chunkPath of chunkPaths) {
            const buffer = await fsPromises.readFile(chunkPath)
            writeStream.write(buffer)
            // 删除切片文件
            await fsPromises.unlink(chunkPath)
          }
          writeStream.end()
        } catch (err) {
          writeStream.destroy(err)
        }
      }

      mergeChunks().catch(reject)
    })

    ctx.body = {
      code: 200,
      data: {
        filename,
        path: filePath,
      },
    }
  } catch (error) {
    console.error('合并切片错误:', error)
    ctx.status = error.status || 500
    ctx.body = {
      code: error.status || 500,
      message: error.message,
    }
  }
}
