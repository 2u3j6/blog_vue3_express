interface Post {
  id: number
  title: string
  content: string
  status: 0 | 1
  createdAt: string
  updatedAt: string
  category?: {
    id: number
    name: string
  }
  tags?: Array<{
    id: number
    name: string
  }>
}

// Vue 3.4 改进了类型推断
const post = defineModel<Post>('post') 