<template>
  <div class="echarts" :style="`height:${height};width:${width};`"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  props: {
    option: {
      type: Object,
      required: true
    },
    height: {
      type: String,
      default: '400px',
    },
    width: {
      type: String,
      default: '100%',
    },
  },
  data() {
    return {
      myChart: {},
      
    }
  },
  mounted() {
    this.drawEcharts()
    window.addEventListener('resize', this.myChart.resize)
  },
  watch: {
  },
  methods: {
    drawEcharts() {
      const option = {
        tooltip: {
          // show: true ,
          trigger: 'item' ,
          showDelay: 0,//显示延时，添加显示延时可以避免频繁切换
          hideDelay: 50,//隐藏延时
        },
        grid: {
          left: '15%'
        },
        ...this.option,
      }
      const el = this.$el
      this.myChart = echarts.init(el, '')
      this.myChart.setOption(option)
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.myChart.resize)
    this.myChart.dispose()
  },
}
</script>