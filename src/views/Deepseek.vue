<template>
  <div class="chat-container">
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
import { ref, nextTick, onMounted } from 'vue'
import request from '@/utils/request'

const inputMessage = ref('')
const messages = ref([])
const loading = ref(false)
const messagesRef = ref(null)

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
    const response = await request.post('/chat', {
      message: userMessage
    })

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));
          // 处理接收到的数据
          console.log(data);
        }
      }
    }
  } catch (error) {
    console.error('Chat error:', error)
    messages.value.push({
      role: 'assistant',
      content: '抱歉，出现了一些问题，请稍后再试。'
    })
  } finally {
    loading.value = false
    scrollToBottom()
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
  // 初始欢迎消息
  messages.value.push({
    role: 'assistant',
    content: '你好！我是 AI 助手，有什么可以帮你的吗？'
  })
})
</script>

<style scoped>
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
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