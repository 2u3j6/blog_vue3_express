<template>
  <div class="dashboard-container">
    <div class="chart-row">
      <div class="chart-item">
        <base-chart ref="barChartRef" title="销售数据" height="300" />
      </div>
      <div class="chart-item">
        <base-chart ref="pieChartRef" title="收入分布" height="300" />
      </div>
    </div>
    <div class="chart-row">
      <div class="chart-item">
        <base-chart ref="lineChartRef" title="趋势分析" height="300" />
      </div>
      <div class="chart-item">
        <base-chart ref="gaugeChartRef" title="目标完成度" height="300" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, nextTick } from 'vue'
  import BaseChart from '@/components/baseChart.vue'
  import OptionManager from '@/utils/base-option-manage'
  import { merge } from 'lodash-es'

  const barChartRef = ref(null)
  const pieChartRef = ref(null)
  const lineChartRef = ref(null)
  const gaugeChartRef = ref(null)

  // 柱状图配置
  const initBarChart = () => {
    try {
      if (!barChartRef.value) {
        throw new Error('barChart ref is null')
      }
      const data = [
        { name: '1月', value: 120 },
        { name: '2月', value: 200 },
        { name: '3月', value: 150 },
        { name: '4月', value: 80 },
        { name: '5月', value: 70 },
        { name: '6月', value: 110 }
      ]

      const option = merge({}, OptionManager.getBarOption(data), {
        series: [{
          name: '销售额'
        }]
      })

      barChartRef.value.setOption(option)
    } catch (error) {
      console.error('初始化柱状图失败:', error)
    }
  }

  // 饼图配置
  const initPieChart = () => {
    const data = [
      { value: 1048, name: '产品A' },
      { value: 735, name: '产品B' },
      { value: 580, name: '产品C' },
      { value: 484, name: '产品D' }
    ]

    pieChartRef.value?.setOption(OptionManager.getPieOption(data))
  }

  // 折线图配置
  const initLineChart = () => {
    const data = [
      { name: '周一', value: 820 },
      { name: '周二', value: 932 },
      { name: '周三', value: 901 },
      { name: '周四', value: 934 },
      { name: '周五', value: 1290 },
      { name: '周六', value: 1330 },
      { name: '周日', value: 1320 }
    ]

    const option = merge({}, OptionManager.getLineOption(data), {
      series: [{
        name: '访问量'
      }]
    })

    lineChartRef.value?.setOption(option)
  }

  // 仪表盘配置
  const initGaugeChart = () => {
    gaugeChartRef.value?.setOption(OptionManager.getGaugeOption(80))
  }

  onMounted(async () => {
    // 添加延时确保 DOM 已完全渲染
    await nextTick()

    console.log('开始初始化图表')

    // 检查 ref 是否存在
    if (!barChartRef.value) {
      console.error('barChartRef 不存在')
    }

    initBarChart()
    initPieChart()
    initLineChart()
    initGaugeChart()
  })
</script>

<style scoped>
  .dashboard-container {
    padding: 20px;
    height: calc(100vh - 60px);
    overflow: hidden;
  }

  .chart-row {
    display: flex;
    gap: 20px;
    height: calc(50% - 10px);
    margin-bottom: 20px;
  }

  .chart-row:last-child {
    margin-bottom: 0;
  }

  .chart-item {
    flex: 1;
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    min-width: 300px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style> 