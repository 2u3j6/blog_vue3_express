const sequelize = require('./db')
const User = require('./User')
const Post = require('./Post')
const Category = require('./Category')
const Tag = require('./Tag')

// 文章与分类的关系：一对多
Post.belongsTo(Category)
Category.hasMany(Post)

// 文章与标签的关系：多对多
Post.belongsToMany(Tag, { through: 'PostTags' })
Tag.belongsToMany(Post, { through: 'PostTags' })

// 确保所有模型都使用同一个 sequelize 实例
const models = {
  sequelize,
  User,
  Post,
  Category,
  Tag
}

// 初始化所有模型
Object.values(models)
  .filter(model => model.associate)
  .forEach(model => model.associate(models))

module.exports = models 