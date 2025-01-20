<!--
 * @Author: yu2u3j6 1398433233@qq.com
 * @Date: 2025-01-20 16:10:13
 * @LastEditors: yu2u3j6 1398433233@qq.com
 * @LastEditTime: 2025-01-20 16:18:53
 * @FilePath: \cursor_demo\src\views\Posts.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: yu2u3j6 1398433233@qq.com
 * @Date: 2025-01-05 14:15:09
 * @LastEditors: yu2u3j6 1398433233@qq.com
 * @LastEditTime: 2025-01-20 16:15:01
 * @FilePath: \cursor_demo\src\views\Posts.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="posts">
    <div class="header">
      <el-button type="primary" @click="handleAdd">
        新建文章
      </el-button>
    </div>

    <el-table :data="posts" style="width: 100%">
      <el-table-column prop="title" label="标题" min-width="120" />
      <el-table-column prop="category" label="分类" width="120">
        <template #default="{ row }">
          {{ row.category?.name }}
        </template>
      </el-table-column>

      <el-table-column prop="tags" label="标签" min-width="120">
        <template #default="{ row }">
          {{ row.tags?.map(item => item.name).join(',') }}
        </template>
      </el-table-column>

      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template #default="{ row }">
          {{ useFormatTime(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? '已发布' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <BasePagination :page="currentPage" :limit="pageSize" :total="total" @handleCurrentChange="handleCurrentChange" />

    <addPostDialog @addPostSuccess="handleAddPostSuccess" v-model:visible="dialogVisible" v-if="dialogVisible" />
  </div>
</template>

<script setup>
  import addPostDialog from './components/add-post-dialog.vue'
  import { ref, watchEffect, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import request from '@/utils/request'
  import { useFormatTime } from '@/hook'
  import BasePagination from '@/components/BasePagination.vue'

  const posts = ref([])
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  const dialogVisible = ref(false)

  const searchQuery = ref('')

  // 新的 watchEffect 支持调试标签
  watchEffect(async (onCleanup) => {
    const controller = new AbortController()
    onCleanup(() => controller.abort())

    try {
      const response = await fetch(`/api/posts?q=${searchQuery.value}`, {
        signal: controller.signal
      })
      posts.value = await response.json()
      console.log(posts.value);

    } catch (error) {
      if (!error.name === 'AbortError') {
        console.error(error)
      }
    }
  }, {
    onTrack(e) {
      console.log('访问了依赖:', e)
    },
    onTrigger(e) {
      console.log('依赖项更新:', e)
    }
  })

  // 获取文章列表
  const getList = async () => {
    console.log('开始获取文章列表')  // 添加日志
    try {
      const res = await request.get('/posts', {
        params: {
          page: currentPage.value,
          pageSize: pageSize.value
        }
      })
      console.log('获取文章列表成功:', res)  // 添加日志
      posts.value = res.data.list
      total.value = res.data.total
    } catch (error) {
      console.error('获取文章列表失败:', error)
    }
  }

  // 获取分类列表

  const handleAdd = () => {
    dialogVisible.value = true
  }

  const handleAddPostSuccess = () => {
    getList()
  }

  const handleEdit = (row) => {
    form.value = { ...row }
    dialogVisible.value = true
  }

  const handleDelete = (row) => {
    ElMessageBox.confirm('确定要删除该文章吗？', '提示', {
      type: 'warning'
    }).then(async () => {
      try {
        await request.delete(`/posts/${row.id}`)
        ElMessage.success('删除成功')
        getList()
      } catch (error) {
        console.error(error)
      }
    })
  }

  // 合并处理分页改变事件
  const handleCurrentChange = ({ page, limit, type }) => {
    currentPage.value = page
    pageSize.value = limit
    getList()
  }

  onMounted(() => {
    getList()
  })
</script>

<style scoped>
  .posts {
    padding: 20px;
  }
  .header {
    margin-bottom: 20px;
  }
  .el-pagination {
    margin-top: 20px;
    justify-content: flex-end;
    padding: 0; /* 移除内边距 */
  }
</style> 