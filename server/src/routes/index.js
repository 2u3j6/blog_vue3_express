const Router = require('@koa/router')
const auth = require('../controllers/auth')
const post = require('../controllers/post')
const category = require('../controllers/category')
const tag = require('../controllers/tag')
const authMiddleware = require('../middlewares/auth')

const router = new Router()

// 认证相关路由
router.post('/blog/login', auth.login)

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
