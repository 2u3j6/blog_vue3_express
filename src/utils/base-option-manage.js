import merge from 'lodash/merge.js'

// 图表颜色列表
const chartColorList = ['#677AF4', '#11CE99', '#0D821F', '#F79029', '#C066FF', '#C0FF3E', '#FF7F50', '#CEA8B6', '#9CAED2', '#F6D300', '#E7663A']

// 数字格式化，保留指定小数位
Math.numberFixed = function (num, fixedCount) {
  if (fixedCount === undefined) {
    fixedCount = 0
  }
  let tmp = Math.pow(10, fixedCount)
  return Math.floor(num * tmp) / tmp
}

// 数值格式化函数：大于10000显示w，大于1000显示k
function getFormatter(value) {
  let num = parseInt(value)
  num = Math.abs(num)
  if (num >= 10000) {
    return Math.numberFixed(value / 10000, 1) + 'w'
  } else if (num >= 1000) {
    return Math.numberFixed(value / 1000, 1) + 'k'
  } else {
    return num
  }
}

const OptionManager = {
  // 基础配置项
  baseOption: {
    tooltip: {
      trigger: 'axis', // 坐标轴触发提示框
    },
  },

  // 创建水平柱状图基础配置
  createBaseHorizontalBarOption() {
    let rotate = 0
    if (window.innerWidth < 480) {
      rotate = 30
    }
    rotate = 30
    let option = {
      // 提示框配置
      tooltip: {
        trigger: 'axis', // 触发类型：坐标轴触发
        axisPointer: {
          type: 'shadow', // 指示器类型：阴影
        },
      },
      // 图表布局配置
      grid: {
        left: '4%', // 左边距
        right: '4%', // 右边距
        bottom: '10%', // 下边距
        top: '10%', // 上边距
        containLabel: true, // 包含坐标轴文字
      },
      // X轴配置
      xAxis: {
        type: 'value', // 数值轴
        boundaryGap: [0, 0.01], // 边界间隙
        splitLine: {
          show: false, // 不显示分隔线
        },
        axisLabel: {
          // 轴标签配置
          show: true,
          rotate: rotate, // 标签旋转角度
          formatter: function (value) {
            return getFormatter(value) // 数值格式化
          },
          color: '#979797', // 标签颜色
        },
        axisLine: {
          // 轴线配置
          lineStyle: {
            color: '#979797', // 轴线颜色
          },
        },
      },
      // Y轴配置
      yAxis: {
        type: 'category', // 类目轴
        axisLabel: {
          show: true,
          margin: 5,
          color: '#979797',
          interval: 0, // 强制显示所有标签
          // 标签文字换行处理
          formatter: function (params) {
            let newParamsName = ''
            let paramsNameNumber = params.length
            let provideNumber = 10 // 每行最多显示字符数
            let rowNumber = Math.ceil(paramsNameNumber / provideNumber)
            if (paramsNameNumber > provideNumber) {
              for (let p = 0; p < rowNumber; p++) {
                let tempStr = ''
                let start = p * provideNumber
                let end = start + provideNumber
                if (p === rowNumber - 1) {
                  tempStr = params.substring(start, paramsNameNumber)
                } else {
                  tempStr = params.substring(start, end) + '\n'
                }
                newParamsName += tempStr
              }
            } else {
              newParamsName = params
            }
            return newParamsName
          },
        },
        axisLine: {
          lineStyle: {
            color: '#979797',
          },
        },
      },
      // 系列列表配置
      series: [
        {
          type: 'bar', // 图表类型：柱状图
          itemStyle: {
            color: '#527ded', // 柱条颜色
          },
          barWith: '50%', // 柱条宽度
        },
      ],
    }
    return option
  },

  // 创建基础饼图配置
  createBasePieOption() {
    let option = {
      tooltip: {
        trigger: 'item', // 触发类型：数据项触发
        formatter: '{b}: {c}%', // 提示框格式化
      },
      series: [
        {
          type: 'pie', // 图表类型：饼图
          radius: ['0', '80%'], // 饼图半径
          itemStyle: {
            color: function (params) {
              return chartColorList[params.dataIndex] // 使用颜色列表
            },
          },
        },
      ],
    }
    return option
  },

  // 创建垂直柱状图基础配置
  getBarOption(data = []) {
    const option = {
      xAxis: {
        type: 'category',
        data: [],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          type: 'bar',
          itemStyle: {
            color: '#409EFF',
          },
        },
      ],
    }

    return merge({}, this.baseOption, option, {
      xAxis: { data: data.map((item) => item.name) },
      series: [{ data: data.map((item) => item.value) }],
    })
  },

  // 创建环形图基础配置
  getPieOption(data = []) {
    return {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
          },
          data,
        },
      ],
    }
  },

  // 创建面积图基础配置
  getLineOption(data = []) {
    const option = {
      xAxis: {
        type: 'category',
        data: [],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          type: 'line',
          smooth: true,
          itemStyle: {
            color: '#67C23A',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(103,194,58,0.3)',
                },
                {
                  offset: 1,
                  color: 'rgba(103,194,58,0)',
                },
              ],
            },
          },
        },
      ],
    }

    return merge({}, this.baseOption, option, {
      xAxis: { data: data.map((item) => item.name) },
      series: [{ data: data.map((item) => item.value) }],
    })
  },

  // 创建仪表盘基础配置
  getGaugeOption(value = 0) {
    return {
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          splitNumber: 10,
          radius: '80%',
          progress: {
            show: true,
            roundCap: true,
            width: 8,
          },
          pointer: {
            show: true,
            length: '60%',
            width: 4,
            itemStyle: {
              color: '#666',
            },
          },
          axisLine: {
            roundCap: true,
            lineStyle: {
              width: 8,
              color: [
                [0.7, '#67C23A'],
                [0.9, '#E6A23C'],
                [1, '#F56C6C'],
              ],
            },
          },
          axisTick: {
            show: true,
            splitNumber: 5,
            length: 6,
            lineStyle: {
              width: 1,
              color: '#999',
            },
          },
          splitLine: {
            show: true,
            length: 10,
            lineStyle: {
              width: 2,
              color: '#999',
            },
          },
          axisLabel: {
            show: false,
          },
          title: {
            fontSize: 14,
            offsetCenter: [0, '30%'],
          },
          detail: {
            width: '60%',
            lineHeight: 30,
            height: 30,
            borderRadius: 8,
            offsetCenter: [0, '-10%'],
            valueAnimation: true,
            formatter: function (value) {
              return '{value|' + value.toFixed(0) + '}{unit|%}'
            },
            rich: {
              value: {
                fontSize: 28,
                fontWeight: 'bolder',
                color: '#777',
              },
              unit: {
                fontSize: 16,
                color: '#999',
                padding: [0, 0, 0, 4],
              },
            },
          },
          data: [
            {
              value,
              name: '完成率',
              title: {
                offsetCenter: [0, '30%'],
              },
              detail: {
                offsetCenter: [0, '-10%'],
              },
            },
          ],
        },
      ],
    }
  },
}

export default OptionManager
