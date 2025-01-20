<script setup>
import { ref } from 'vue'

// 使用 defineModel 进行双向绑定
const title = defineModel('title')
const content = defineModel('content')
const status = defineModel('status', { default: 0 })
const categoryId = defineModel('categoryId')
const tagIds = defineModel('tagIds', { default: () => [] })

// 从父组件接收分类列表
const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  tags: {
    type: Array,
    default: () => []
  }
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择文章分类', trigger: 'change' }
  ]
}

const formRef = ref(null)

// 提供验证方法给父组件
defineExpose({
  validate: () => formRef.value?.validate()
})
</script>

<template>
  <el-form
    ref="formRef"
    :model="{ title, content, status, categoryId }"
    :rules="rules"
    label-width="80px"
  >
    <el-form-item label="标题" prop="title">
      <el-input v-model="title" placeholder="请输入文章标题" />
    </el-form-item>

    <el-form-item label="分类" prop="categoryId">
      <el-select v-model="categoryId" placeholder="请选择分类">
        <el-option
          v-for="item in categories"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>

     <el-form-item label="标签" prop="categoryId">
      <el-select multiple v-model="tagIds" placeholder="请选择标签">
        <el-option
          v-for="item in tags"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="内容" prop="content">
      <el-input
        v-model="content"
        type="textarea"
        :rows="10"
        placeholder="请输入文章内容"
      />
    </el-form-item>

    <el-form-item label="状态">
      <el-radio-group v-model="status">
        <el-radio :label="0">草稿</el-radio>
        <el-radio :label="1">发布</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template> 