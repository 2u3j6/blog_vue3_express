<template>
  <div class="chat-container">
    <!-- 添加清除历史按钮 -->
    <div class="chat-header">
      <el-button type="danger" size="small" @click="clearHistory">清除历史记录</el-button>
    </div>

    <!-- 聊天记录区域 -->
    <div class="chat-messages" ref="messagesRef">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
        <div class="message-content">
          <div v-if="message.role === 'assistant'" class="avatar">AI</div>
          <div v-else class="avatar">ME</div>
          <div class="text">{{ message.content }}</div>
        </div>
      </div>
      <div v-if="loading" class="message assistant">
        <div class="message-content">
          <div class="avatar">AI</div>
          <div class="text">思考中...</div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-input">
      <el-input v-model="inputMessage" type="textarea" :rows="3" placeholder="请输入问题..."
                @keyup.enter.exact="handleSend" />
      <el-button type="primary" :loading="loading" @click="handleSend">发送</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import request, { createStreamRequest } from '@/utils/request'

const inputMessage = ref('')
const messages = ref([])
const loading = ref(false)
const messagesRef = ref(null)

// 从 localStorage 加载聊天记录
const loadMessages = () => {
  const savedMessages = localStorage.getItem('chatMessages')
  if (savedMessages) {
    messages.value = JSON.parse(savedMessages)
  } else {
    // 如果没有保存的消息，显示欢迎消息
    messages.value = [{
      role: 'assistant',
      content: '你好！我是 AI 助手，有什么可以帮你的吗？'
    }]
  }
}

// 保存聊天记录到 localStorage
const saveMessages = () => {
  localStorage.setItem('chatMessages', JSON.stringify(messages.value))
}

// 监听消息变化，自动保存
watch(messages, saveMessages, { deep: true })

// 发送消息
const handleSend = async () => {
  if (!inputMessage.value.trim() || loading.value) return

  const userMessage = inputMessage.value.trim()
  messages.value.push({
    role: 'user',
    content: userMessage
  })
  inputMessage.value = ''

  loading.value = true
  try {
    messages.value.push({
      role: 'assistant',
      content: ''
    })

    await createStreamRequest({
      url: '/chat',
      method: 'post',
      data: {
        message: userMessage
      },
      onDownloadProgress: ({ responseText }) => {
        if (responseText) {
          const lines = responseText.split('\n')
          for (const line of lines) {
            if (line.trim() === '') continue
            
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.code === 200) {
                  const lastMessage = messages.value[messages.value.length - 1]
                  if (lastMessage.role === 'assistant') {
                    lastMessage.content += data.data || ''
                    scrollToBottom()
                  }
                }
              } catch (e) {
                console.error('解析消息失败:', e, '原始数据:', line)
              }
            }
          }
        }
      }
    })

  } catch (error) {
    console.error('Chat error:', error)
    messages.value.push({
      role: 'assistant',
      content: '抱歉，出现了一些问题，请稍后再试。'
    })
  } finally {
    loading.value = false
    await scrollToBottom()
  }
}

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

onMounted(() => {
  // 替换原来的欢迎消息初始化，改用 loadMessages
  loadMessages()
  scrollToBottom()
})

// 可以添加一个清除历史记录的方法
const clearHistory = () => {
  messages.value = [{
    role: 'assistant',
    content: '你好！我是 AI 助手，有什么可以帮你的吗？'
  }]
  localStorage.removeItem('chatMessages')
}
</script>

<style scoped>
.chat-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.chat-header {
  padding: 10px;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 20px;
}

.message {
  margin-bottom: 20px;
}

.message-content {
  display: flex;
  gap: 12px;
  max-width: 80%;
}

.user .message-content {
  margin-left: auto;
  flex-direction: row-reverse;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #409eff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user .avatar {
  background: #67c23a;
}

.text {
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  line-height: 1.5;
  white-space: pre-wrap;
}

.user .text {
  background: #409eff;
  color: white;
}

.chat-input {
  display: flex;
  gap: 12px;
}

.chat-input .el-button {
  height: auto;
}
</style>