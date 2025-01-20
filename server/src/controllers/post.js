const { Post, Category, Tag } = require('../models')

exports.list = async (ctx) => {
  const { page = 1, pageSize = 10 } = ctx.query

  try {
    const { count, rows } = await Post.findAndCountAll({
      include: [
        {
          model: Category,
          attributes: ['id', 'name'],
        },
        {
          model: Tag,
          attributes: ['id', 'name'],
          through: { attributes: [] }, // 不返回中间表数据
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(pageSize),
      offset: (parseInt(page) - 1) * parseInt(pageSize),
    })

    ctx.body = {
      code: 200,
      data: {
        list: rows,
        total: count,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      },
    }
  } catch (error) {
    ctx.throw(500, error)
  }
}

exports.create = async (ctx) => {
  const { title, content, categoryId, tagIds = [], status = 0 } = ctx.request.body
  console.log(categoryId)

  try {
    const post = await Post.create({
      title,
      content,
      status,
      categoryId,
    })

    if (tagIds.length > 0) {
      await post.setTags(tagIds)
    }

    // 重新查询文章以获取关联数据
    const newPost = await Post.findByPk(post.id, {
      include: [
        {
          model: Category,
          attributes: ['id', 'name'],
        },
        {
          model: Tag,
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
    })

    ctx.body = {
      code: 200,
      data: newPost,
    }
  } catch (error) {
    ctx.throw(500, error)
  }
}

exports.update = async (ctx) => {
  const { id } = ctx.params
  const { title, content, categoryId, tagIds = [], status } = ctx.request.body

  try {
    const post = await Post.findByPk(id)

    if (!post) {
      ctx.throw(404, '文章不存在')
    }

    await post.update({
      title,
      content,
      categoryId,
      status,
    })

    if (tagIds.length > 0) {
      await post.setTags(tagIds)
    }

    // 重新查询文章以获取关联数据
    const updatedPost = await Post.findByPk(id, {
      include: [
        {
          model: Category,
          attributes: ['id', 'name'],
        },
        {
          model: Tag,
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
    })

    ctx.body = {
      code: 200,
      data: updatedPost,
    }
  } catch (error) {
    ctx.throw(500, error)
  }
}

exports.delete = async (ctx) => {
  const { id } = ctx.params

  try {
    const post = await Post.findByPk(id)

    if (!post) {
      ctx.throw(404, '文章不存在')
    }

    await post.destroy()

    ctx.body = {
      code: 200,
      message: '删除成功',
    }
  } catch (error) {
    ctx.throw(500, error)
  }
}
