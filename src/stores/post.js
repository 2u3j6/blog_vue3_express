import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePostStore = defineStore('post', () => {
  const posts = ref([])
  const loading = ref(false)

  // Vue 3.4 提供了更好的响应式调试信息
  const publishedPosts = computed(() => {
    return posts.value.filter(post => post.status === 1)
  })

  async function fetchPosts() {
    loading.value = true
    try {
      const response = await fetch('/api/posts')
      posts.value = await response.json()
    } finally {
      loading.value = false
    }
  }

  return {
    posts,
    loading,
    publishedPosts,
    fetchPosts
  }
}) 