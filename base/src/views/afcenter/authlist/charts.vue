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
      default: '100%',
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
    // lazy
    this.drawEcharts()
    window.addEventListener('resize', this.myChart.resize)
  },
  watch: {
    // 一开始打开的就是当前tab
    // option: {
    //   deep: true,
    //   immediate: true,
    //   handler() {
        // this.myChart && window.removeEventListener('resize', this.myChart.resize)
        // this.drawEcharts()
        // window.addEventListener('resize', this.myChart.resize)
      // }
    // }
  },
  methods: {
    drawEcharts() {
      const option = {
        tooltip: {
          show: true ,
          trigger: 'item' ,
          showDelay: 0,//显示延时，添加显示延时可以避免频繁切换
          hideDelay: 50,//隐藏延时
          formatter: (item) => {
            if (item.data.type === 'resource') {
              return `${item.data.name} (${item.data.code})`
            } else {
              return item.data.name
            }
          }
        },
        // legend: {
        //   show: true,
        //   type: 'plain',
        //   // data: graph.categories.map(function (a) {
        //   //   return a.name;
        //   // })
        //   left: '10%',
        //   top: '2%',
        //   formatter: function (name) {
        //     return 'Legend ' + name;
        //   }
        // },
        series: [
          {
            data: this.option,
            type: 'tree',
            // color:'#aceafc',
            areaStyle: {
              color: '#e5f8fe'
            },
            lineStyle: {
              // color: '#aceafc',
              width: 1
            },
            initialTreeDepth: 4,
            top: '50px',
            bottom: '1%',
            left: '2%',
            right: '28%',
            symbol: (a, item) => {
              const img = item.data.type ? `${item.data.type}.png` : 'auths.png'
              return `image://../../../../static/images/${img}`
            },
            symbolSize: 25,
            label: {
              position: 'right',
              show: true,
              formatter: (item) => {
                if (item.data.type === 'resource') {
                  return [item.data.name, item.data.code].join('\n')
                } else {
                  return item.data.name
                }
              }
            }
          }
        ],
      }
      const el = this.$el
      this.myChart = echarts.init(el, '')
      this.myChart.setOption(option)
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.myChart.resize)
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
