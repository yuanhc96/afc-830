<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme

const animationDuration = 1000
const categoryAxisConfig = {
  type: 'category',
  name: '',
  axisLabel: {
    interval: 0,
    rotate: -25,
  },
  nameLocation: 'end',
  data: [],
  axisTick: {
    alignWithLabel: false,
  },
}
const valueAxisConfig = {
  type: 'value',
  name: '',
  nameLocation: 'end',
  minInterval: 1,
  axisTick: {
    show: false,
  },
}
const option = {
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
    },
  },
  legend: {
    data: [],
  },
  grid: {
    top: '10px',
    left: '10px',
    right: '10px',
    bottom: '50px',
  },
  xAxis: [],
  yAxis: [],
  series: [],
}

export default {
  name: 'common-charts',
  props: {
    className: {
      type: String,
      default: 'chart',
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '500px',
    },
    value: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      chart: null,
      option: _.cloneDeep(option),
    }
  },
  computed: {
    // 此处几个compute是为了防止初次加载页面时数据未加载完成报表初始化报错
    axisTitle() {
      return this.value.axisTitle || {}
    },
    seriesData() {
      return this.value.seriesData || []
    },
    axisData() {
      return this.value.axisData || []
    },
  },
  watch: {
    value: {
      deep: true,
      handler() {
        this.init()
      },
    },
  },
  mounted() {
    this.chart = echarts.init(this.$el, 'macarons')
    this.init()
  },
  activated() {},
  methods: {
    init() {
      this.initData()
      this.initChart()
    },
    initData() {
      this.option = {
        ..._.cloneDeep(option),
        ...this.value,
      }
      var optionSeriesData = []
      var legendData = []
      this.setAxis()
      if (this.seriesData) {
        this.seriesData.map(data => {
          legendData.push(data.title)
          optionSeriesData.push({
            name: data.title,
            type: data.chartType || 'bar',
            //            barWidth: '60%',
            barMaxWidth: 30,
            ...data,
            animationDuration,
          })
        })
        this.option.legend.data = legendData
        this.option.series = optionSeriesData
      }
    },
    setAxis() {
      if (this.value.horizontalCategoryChart) {
        this.option.xAxis[0] = categoryAxisConfig
        this.option.yAxis[0] = {
          ...valueAxisConfig,
          ...this.value.yAxis,
        }
        this.option.xAxis[0].name = this.axisTitle.category || ''
        this.option.yAxis[0].name = this.axisTitle.value || ''
        this.option.xAxis[0].data = this.axisData
      } else {
        this.option.xAxis[0] = valueAxisConfig
        this.option.yAxis[0] = categoryAxisConfig
        this.option.xAxis[0].name = this.axisTitle.value || ''
        this.option.yAxis[0].name = this.axisTitle.category || ''
        this.option.yAxis[0].data = this.axisData
      }
    },
    initChart() {
      if (this.option.series.length === 0) {
        this.chart.clear()
      }
      this.chart.setOption(this.option)
    },
    resize() {
      this.chart.resize()
    },
  },
}
</script>
