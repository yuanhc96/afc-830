<template>
  <div class="main">
    <div class="num">
      <el-row :gutter="20">
        <el-col :span="8" v-for="(report, index) in reportLists" :key="index">
          <div class="num_item" :style="`background-color: ${report.bgc};`">
            <div class="left">
              <pm-icon value='qushi' />
            </div>
            <div class="top">
              <div>{{ report.name }}</div>
              <div style="font-size: 18px; font-weight: bold; margin-top: 5px;">{{ report.num }}</div>
            </div>
            <div class="foot">{{ report.description }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="chart">
      <el-row :gutter="20">
        <el-col>
          <div class="item">
            <el-card shadow="hover">
              <div slot="header">
                <div class="item-title">调度报表</div>
                <div class="switch-btn">
                  <el-popover
                    placement="left"
                    width="400"
                    trigger="click">
                    <el-date-picker
                      v-model="dateTime"
                      type="daterange"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :picker-options="dateTimeOptions"
                      :default-time="['00:00:00', '23:59:59']"
                      style="width: 100%"
                      :clearable="false"
                      @change="getData">
                    </el-date-picker>
                    <i class="el-icon-date" style="color: #1890ff; font-size: 18px;line-height: 8px;" slot="reference"></i>
                  </el-popover>
                  
                </div>
              </div>
              <div class="item-content">
                <div class="left">
                  <Charts v-if="dateList.series" :option="dateList" />
                </div>
                <div class="right">
                  <Charts v-if="scalelist.series" :option="scalelist" />
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { JobIndexController } from '@controller'
import { BaseVue, _ } from '@lib'
import { localStore } from '@util/sessionStore'
import moment from 'dayjs'
import Charts from './charts.vue'
const reportLists = [{
  name: '任务数量',
  num: 0,
  description: '调度中心运行的任务数量',
  bgc: '#00c0ef',
},{
  name: '调度次数',
  num: 0,
  description: '调度中心触发的调度次数',
  bgc: '#f39c12',
},{
  name: '在线执行器实例数量',
  num: 0,
  description: '调度中心在线的执行器机器数量',
  bgc: '#00a65a',
}]
let dateList = {
  title: {
    text: '日期分布图',
    left: '1%'
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: []
  },
  yAxis: {
    type: 'value'
  },
  legend: {
    data: ['成功', '失败', '进行中'],
  },
  series: [
    {
      data: [0, 0, 0, 0, 0],
      name: '成功',
      emphasis: {
        focus: 'series'
      },
      type: 'line',
      stack: 'Total',
      color: '#aceafc',
      areaStyle: {
        color: '#4cc18b'
      },
      lineStyle: {
        color: '#aceafc',
        width: 1
      }
    },{
      name: '失败',
      data: [0, 0, 0, 0, 0],
      type: 'line',
      stack: 'Total',
      color: '#c23632',
      areaStyle: {
        color: '#d4726f'
      },
      lineStyle: {
        color: '#c23632',
        width: 1
      },
      emphasis: {
        focus: 'series'
      }
    },{
      name: '进行中',
      data: [0, 0, 0, 0, 0],
      type: 'line',
      stack: 'Total',
      color: '#f39c12',
      areaStyle: {
        color: '#f39c12'
      },
      lineStyle: {
        color: '#f39c12',
        width: 1
      },
      emphasis: {
        focus: 'series'
      }
    }
  ]
}
let scalelist = {
  title: {
    text: '成功比例图',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [{
    name: '比例图',
    type: 'pie',
    radius: '50%',
    color:['#00a65a', '#c23632', '#f39c12'],
    data: [
      { value: 0, name: '成功' },
      { value: 0, name: '失败' },
      { value: 0, name: '进行中' },
    ],
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }]
}

export default {
  components: { Charts },
  mixins: [BaseVue],
  data() {
    return {
      reportLists: _.cloneDeep(reportLists),
      dateList: {},
      scalelist: {},
      query: {
        startDate: null,
        endDate: null
      },
      dateTime:[,],
      dateTimeOptions: {
        onPick: ({ maxDate, minDate }) => {
          if (minDate && !maxDate) {
            this.timeOptionRange = minDate
          }
          if (maxDate) {
            this.timeOptionRange = null
          }
        },
        disabledDate: (time) => {
          // 设置一个月的时间戳
          let secondNum = 29 * 24 * 60 * 60 * 1000
          // 获取选中时间
          let timeOptionRange = this.timeOptionRange
          if (timeOptionRange) {
            return time.getTime() > timeOptionRange.getTime() + secondNum || time.getTime() < timeOptionRange.getTime() - secondNum
          }
        },
        shortcuts: [{
          text: '今日',
          onClick(picker) {
            const end = new Date(new Date().toLocaleDateString() + ' 23:59:59');
            const start = new Date(new Date().toLocaleDateString() + ' 00:00:00');
            start.setTime(start);
            end.setTime(end);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '昨日',
          onClick(picker) {
            const end = new Date(new Date(new Date().getTime() - 3600 * 1000 * 24).toLocaleDateString()+ ' 23:59:59');
            const start = new Date(new Date(new Date().getTime() - 3600 * 1000 * 24).toLocaleDateString()+ ' 00:00:00');
            start.setTime(start);
            end.setTime(end);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '本月',
          onClick(picker) {
            const end = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0,23,59,59);
            const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            start.setTime(start);
            end.setTime(end);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '上个月',
          onClick(picker) {
            const end = new Date(new Date().getFullYear(), new Date().getMonth(), 0,23,59,59);
            const start = new Date(new Date().getFullYear(), new Date().getMonth() -1, 1);
            start.setTime(start);
            end.setTime(end);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  async mounted() {
    this.$store.commit('SET_PLATFORM', null)
    localStore.set('isobjectMenu', false)
    this.resetDateTime()
    this.getData()
  },
  methods: {
    async getData() {
      this.query.startDate = moment(this.dateTime[0]).format('YYYY-MM-DD HH:mm:ss') 
      this.query.endDate = moment(this.dateTime[1]+ ' 23:59:59').format('YYYY-MM-DD HH:mm:ss')
      console.log(this.dateTime)
      console.log(this.query, '====this.query')
      const resp = await this.dispatch(JobIndexController.chartInfo, this.query)
      if (!resp.error && resp.data.code === 200) {
        const {content} = resp.data
        this.reportLists[0].num = content.jobInfoCount
        this.reportLists[1].num = content.jobLogCount
        this.reportLists[2].num = content.executorCount
        dateList.xAxis.data = content.triggerDayList
        dateList.series[0].data = content.triggerDayCountSucList
        dateList.series[1].data = content.triggerDayCountFailList
        dateList.series[1].data = content.triggerDayCountRunningList
        scalelist.series[0].data = [
          { value: content.triggerCountSucTotal, name: '成功' },
          { value: content.triggerCountFailTotal, name: '失败' },
          { value: content.triggerCountRunningTotal, name: '进行中' },
        ]
        this.$set(this, 'dateList', dateList)
        this.$set(this, 'scalelist', scalelist)
      } else {
        this.$msg.error('查询报错')
        this.$set(this, 'dateList', dateList)
        this.$set(this, 'scalelist', scalelist)
      }
    },
    resetDateTime() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      this.dateTime = [moment(start).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD')]
    },
  }
}
</script>
<style lang="scss" scoped>
.main {
  padding: 20px 20px 0;
  background-color: #f8f8f8;
  max-height: calc(90vh + 150px);
  min-height: calc(90vh + 2px);
  .num {
    .num_item {
      height: 90px;
      font-size: 14px;
      color: white;
      .left {
        border-top-left-radius: 2px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 2px;
        display: block;
        float: left;
        height: 90px;
        width: 90px;
        text-align: center;
        font-size: 45px;
        line-height: 90px;
        background: rgba(0,0,0,0.2);
        i {
          font-size: 45px;
        }
      }
      .top{
        border-bottom: 2px solid #fff;
        padding: 7px 0 0 10px;
        margin: 7px 0px 10px 90px;
      }
      .foot {
        padding-left: 100px;
      }
    }
  }
  .chart {
    height: 75%;
    .item {
      margin: 20px 0;
      .el-card{
        height: 80%;
        .item-title {
          float: left;
          font-size: 15px;
          font-weight: 700;
          line-height: 8px;
        }
        .switch-btn {
          float: right;
        }
        .item-content {
          display: flex;
          height: 400px;
          .left {
            flex: 1;
          }
          .right {
            width: 355px;
          }
        }
      }
    }
  }
}
</style>
