<template>
  <div class="tags">
    <div class="header">
      <el-button type="primary" @click="handleAdd">
        新建标签
      </el-button>
    </div>

    <el-table :data="tags" style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="标签名称" />
      <el-table-column prop="count" label="文章数量" width="100" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 标签编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="form.id ? '编辑标签' : '新建标签'"
      width="500px"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

const loading = ref(false)
const tags = ref([])
const dialogVisible = ref(false)

const form = ref({
  id: '',
  name: ''
})

// 获取标签列表
const getList = async () => {
  loading.value = true
  try {
    const res = await request.get('/tags')
    tags.value = res.data
  } catch (error) {
    console.error(error)
  }
  loading.value = false
}

const handleAdd = () => {
  form.value = {
    id: '',
    name: ''
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  form.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该标签吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await request.delete(`/tags/${row.id}`)
      ElMessage.success('删除成功')
      getList()
    } catch (error) {
      console.error(error)
    }
  })
}

const handleSubmit = async () => {
  try {
    if (form.value.id) {
      await request.put(`/tags/${form.value.id}`, form.value)
    } else {
      await request.post('/tags', form.value)
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    getList()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
.tags {
  padding: 20px;
}
.header {
  margin-bottom: 20px;
}
</style> 