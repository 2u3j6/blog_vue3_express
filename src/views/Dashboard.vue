<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <template #header>文章总数</template>
          <div class="card-body">
            <h2>{{ stats.posts || 0 }}</h2>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <template #header>分类总数</template>
          <div class="card-body">
            <h2>{{ stats.categories || 0 }}</h2>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <template #header>标签总数</template>
          <div class="card-body">
            <h2>{{ stats.tags || 0 }}</h2>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { shallowRef } from 'vue'

const stats = ref({
  posts: 0,
  categories: 0,
  tags: 0
})

// 大数据列表使用 shallowRef 提高性能
const tableData = shallowRef([])

const loadData = async () => {
  const response = await fetch('/api/stats')
  // 整个对象的更新会触发响应，但内部属性的变化不会
  tableData.value = await response.json()
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}
.card-body {
  text-align: center;
  padding: 20px;
}
</style> 