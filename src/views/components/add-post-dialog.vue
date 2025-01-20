<template>
  <el-dialog v-model="visible" title="Tips" width="500" :before-close="handleClose">
    <PostForm ref="formRef" :categories="categories" :tags="tags" v-model:title="form.title" v-model:categoryId="form.categoryId" v-model:tagIds="form.tagIds" v-model:content="form.content" v-model:status="form.status" />
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
  import { watch, ref, computed, onMounted } from 'vue';
  import PostForm from '@/components/PostForm.vue'  // 导入 PostForm 组件
  import request from '@/utils/request'
  import { ElMessage, ElMessageBox } from 'element-plus'

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    }
  }
  )
  const emit = defineEmits(['update:visible'])
  const formRef = ref(null)
  const tags = ref([])
  const categories = ref([])
  const form = ref({
    id: '',
    title: '',
    content: '',
    categoryId: '',
    tagIds: [],
    status: 0
  })
  const visible = defineModel('visible')
  const handleClose = (done) => {
    done()
  }
  const cancel = () => {
    console.log('cancel');

    visible.value = false
  }
  const confirm = () => {
    console.log('confirm');

    visible.value = false
  }
  //  或者
  // const visible = computed({
  //   get() {
  //     return props.visible
  //   },
  //   set(val) {
  //     emit('update:visible', val)
  //   }
  // })

  const getTags = async () => {
    try {
      const res = await request.get('/tags')
      tags.value = res.data
    } catch (error) {
      console.error(error)
    }
  }

  const getCategories = async () => {
    try {
      const res = await request.get('/categories')
      categories.value = res.data
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async () => {
    const valid = await formRef.value.validate()
    if (!valid) return
    try {
      if (form.value.id) {
        await request.put(`/posts/${form.value.id}`, form.value)
      } else {
        await request.post('/posts', form.value)
      }
      ElMessage.success('保存成功')
      visible.value = false
      emit('addPostSuccess')
    } catch (error) {
      console.error(error)
    }
  }

  onMounted(() => {
    getTags()
    getCategories()
  })
</script>