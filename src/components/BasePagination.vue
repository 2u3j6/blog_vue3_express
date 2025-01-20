<template>
  <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]" :total="total" @size-change="handleSizeChange" @current-change="handlePageChange" layout="total, sizes, prev, pager, next" background />
</template>

<script setup>
  import { ref, watch } from 'vue'  // 添加必要的导入

  const props = defineProps({
    // 当前页码
    page: {
      type: Number,
      default: 1
    },
    // 每页条数
    limit: {
      type: Number,
      default: 10
    },
    // 总条数
    total: {
      type: Number,
      default: 0
    }
  })

  const emit = defineEmits(['handleCurrentChange'])

  // 内部维护页码和每页条数
  const currentPage = ref(props.page)
  const pageSize = ref(props.limit)

  // 监听父组件传入的值变化
  watch(() => props.page, (val) => {
    currentPage.value = val
  })

  watch(() => props.limit, (val) => {
    pageSize.value = val
  })

  // 处理每页条数改变
  const handleSizeChange = (val) => {
    pageSize.value = val
    currentPage.value = 1  // 重置为第一页
    emit('handleCurrentChange', {
      page: 1,
      limit: val,
      type: 'size'
    })
  }

  // 处理页码改变
  const handlePageChange = (val) => {
    currentPage.value = val
    emit('handleCurrentChange', {
      page: val,
      limit: pageSize.value,
      type: 'page'
    })
  }
</script>

<style scoped>
  .el-pagination {
    margin-top: 20px;
    justify-content: flex-end;
    padding: 0;
  }
</style> 