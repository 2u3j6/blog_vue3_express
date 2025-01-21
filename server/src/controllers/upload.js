const multer = require('@koa/multer')
const path = require('path')

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
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext)
  },
})

// 文件上传限制
const limits = {
  fileSize: 5 * 1024 * 1024, // 限制文件大小为5MB
  files: 1, // 限制文件数量
}

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 限制文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    // 修改错误处理方式
    const error = new Error(`不支持的文件类型: ${file.mimetype}, 支持的类型: ${allowedTypes.join(', ')}`)
    error.status = 400 // 设置状态码为 400 而不是 401
    cb(error)
  }
}

// 创建 multer 实例
const upload = multer({
  storage,
  limits,
  fileFilter,
})

// 文件上传处理
exports.uploadFile = async (ctx) => {
  try {
    const file = ctx.request.file

    if (!file) {
      ctx.throw(400, {
        code: 400,
        message: '没有文件被上传或文件类型不支持',
      })
    }

    // 返回文件信息
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
    // 处理错误
    ctx.status = error.status || 500
    ctx.body = {
      code: error.status || 500,
      message: error.message,
    }
  }
}

// 导出 multer 中间件
exports.upload = upload.single('file')
