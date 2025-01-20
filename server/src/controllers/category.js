const { Category } = require('../models')

exports.list = async (ctx) => {
  try {
    const categories = await Category.findAll()
    
    ctx.body = {
      code: 200,
      data: categories
    }
  } catch (error) {
    ctx.throw(500, error)
  }
}

exports.create = async (ctx) => {
  const { name, description } = ctx.request.body

  try {
    const category = await Category.create({ name, description })

    ctx.body = {
      code: 200,
      data: category
    }
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      ctx.throw(400, '分类名已存在')
    }
    ctx.throw(500, error)
  }
}

exports.update = async (ctx) => {
  const { id } = ctx.params
  const { name, description } = ctx.request.body

  try {
    const category = await Category.findByPk(id)
    
    if (!category) {
      ctx.throw(404, '分类不存在')
    }

    await category.update({ name, description })

    ctx.body = {
      code: 200,
      data: category
    }
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      ctx.throw(400, '分类名已存在')
    }
    ctx.throw(500, error)
  }
}

exports.delete = async (ctx) => {
  const { id } = ctx.params

  try {
    const category = await Category.findByPk(id)
    
    if (!category) {
      ctx.throw(404, '分类不存在')
    }

    await category.destroy()

    ctx.body = {
      code: 200,
      message: '删除成功'
    }
  } catch (error) {
    ctx.throw(500, error)
  }
} 