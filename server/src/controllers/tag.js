const { Tag } = require('../models')

exports.list = async (ctx) => {
  try {
    const tags = await Tag.findAll()
    
    ctx.body = {
      code: 200,
      data: tags
    }
  } catch (error) {
    ctx.throw(500, error)
  }
}

exports.create = async (ctx) => {
  const { name } = ctx.request.body

  try {
    const tag = await Tag.create({ name })

    ctx.body = {
      code: 200,
      data: tag
    }
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      ctx.throw(400, '标签名已存在')
    }
    ctx.throw(500, error)
  }
}

exports.update = async (ctx) => {
  const { id } = ctx.params
  const { name } = ctx.request.body

  try {
    const tag = await Tag.findByPk(id)
    
    if (!tag) {
      ctx.throw(404, '标签不存在')
    }

    await tag.update({ name })

    ctx.body = {
      code: 200,
      data: tag
    }
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      ctx.throw(400, '标签名已存在')
    }
    ctx.throw(500, error)
  }
}

exports.delete = async (ctx) => {
  const { id } = ctx.params

  try {
    const tag = await Tag.findByPk(id)
    
    if (!tag) {
      ctx.throw(404, '标签不存在')
    }

    await tag.destroy()

    ctx.body = {
      code: 200,
      message: '删除成功'
    }
  } catch (error) {
    ctx.throw(500, error)
  }
} 