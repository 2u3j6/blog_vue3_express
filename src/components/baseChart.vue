<!--
 * @Author: yu2u3j6 1398433233@qq.com
 * @Date: 2025-01-06 16:16:33
 * @LastEditors: yu2u3j6 1398433233@qq.com
 * @LastEditTime: 2025-01-07 09:39:25
 * @FilePath: \cursor_demo\src\components\baseChart.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div ref="chartRef" :style="{
      width: typeof width === 'number' ? width + 'px' : width,
      height: typeof height === 'number' ? height + 'px' : height
    }"></div>
</template>

<script setup>
  import * as echarts from 'echarts'
  import { onMounted, onUnmounted, ref } from 'vue'
  import { throttle } from 'lodash-es'
  console.log('lodash-es', throttle)

  // 定义 props
  const props = defineProps({
    width: {
      type: [String, Number],
      default: '100%'
    },
    height: {
      type: [String, Number],
      default: '300px'
    },
    title: {
      type: String,
      default: ''
    }
  })

  const chartRef = ref(null)
  let chartInstance = null

  // 初始化图表
  const initChart = () => {
    if (chartRef.value) {
      // 添加调试信息
      console.log('初始化图表', props.title)

      // 确保容器有宽高
      if (chartRef.value.offsetHeight === 0) {
        console.warn('图表容器高度为0')
      }

      chartInstance = echarts.init(chartRef.value)

      // 设置默认配置
      const defaultOption = {
        title: {
          text: props.title,
          left: 'center'
        }
      }
      chartInstance.setOption(defaultOption)
    } else {
      console.warn('chartRef.value 不存在')
    }
  }

  // 提供给外部的 setOption 方法
  const setOption = (option) => {
    if (!chartInstance) {
      console.error('图表实例未初始化', props.title)
      return
    }
    try {
      chartInstance.setOption(option)
    } catch (error) {
      console.error('设置图表配置失败:', error)
    }
  }

  // 使用 lodash 的节流函数处理 resize
  const handleResize = throttle(() => {
    chartInstance?.resize()
  }, 200)  // 200ms 的节流延迟

  onMounted(() => {
    initChart()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    handleResize.cancel()  // 取消未执行的节流函数
    chartInstance?.dispose()
  })

  // 暴露方法给父组件使用
  defineExpose({
    setOption
  })
</script>

<style scoped>
  /* 添加样式确保容器可见 */
  div {
    min-height: 300px;
    min-width: 200px;
  }
</style>
