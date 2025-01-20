<template>
  <Suspense>
    <template #default>
      <router-view />
    </template>
    <template #fallback>
      <el-skeleton :rows="6" animated />
    </template>
  </Suspense>
</template>

<script setup>
  import { onErrorCaptured } from 'vue'

  // 改进的错误处理
  onErrorCaptured((error) => {
    console.error('捕获到异步组件错误:', error)
    return false // 阻止错误继续传播
  })
</script>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html,
  body {
    height: 100%;
    width: 100%;
  }

  #app {
    height: 100%;
    width: 100%;
  }
</style> 