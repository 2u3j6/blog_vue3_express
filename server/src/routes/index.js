/*
 * @Author: yu2u3j6 1398433233@qq.com
 * @Date: 2025-01-21 14:47:45
 * @LastEditors: yu2u3j6 1398433233@qq.com
 * @LastEditTime: 2025-01-21 17:02:56
 * @FilePath: \cursor_demo\server\src\routes\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const Router = require('@koa/router')
const auth = require('../controllers/auth')
const post = require('../controllers/post')
const category = require('../controllers/category')
const tag = require('../controllers/tag')
const authMiddleware = require('../middlewares/auth')
const upload = require('../controllers/upload')

const router = new Router()

// 认证相关路由
router.post('/blog/login', auth.login)

// 文件上传路由 - 修改中间件顺序
router.post('/blog/upload', upload.upload, authMiddleware, upload.uploadFile)

// 文章相关路由
router.get('/blog/posts', authMiddleware, post.list)
router.post('/blog/posts', authMiddleware, post.create)
router.put('/blog/posts/:id', authMiddleware, post.update)
router.delete('/blog/posts/:id', authMiddleware, post.delete)

// 分类相关路由
router.get('/blog/categories', authMiddleware, category.list)
router.post('/blog/categories', authMiddleware, category.create)
router.put('/blog/categories/:id', authMiddleware, category.update)
router.delete('/blog/categories/:id', authMiddleware, category.delete)

// 标签相关路由
router.get('/blog/tags', authMiddleware, tag.list)
router.post('/blog/tags', authMiddleware, tag.create)
router.put('/blog/tags/:id', authMiddleware, tag.update)
router.delete('/blog/tags/:id', authMiddleware, tag.delete)

module.exports = router
