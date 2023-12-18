<template>
  <div class="main">
    <div class="num">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="num_item">
            <div class="top">
              <i :class="tenantList[0].icon" />
              <span>{{ tenantList[0].name }}</span>
            </div>
            <div class="foot">
              <el-row>
                <el-col v-for="t in tenantList[0].children" :key="t.code" :span="6">
                  <div class="item">
                    <div class="item-num">
                      <span>{{ t.total }}</span>
                      <span :class="{'unit': !!t.totalUnit}" :title="t.totalTitle">{{ t.totalUnit }}</span>
                    </div>
                    <div class="item-title">{{ t.name }}</div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="num_item">
            <div class="topTwo">
              <i :class="tenantList[1].icon" />
              <span>{{ tenantList[1].name }}</span>
            </div>
            <div class="foot">
              <el-row>
                <el-col v-for="t in tenantList[1].children" :key="t.code" :span="6">
                  <div class="item">
                    <div class="item-num">
                      <span>{{ t.total }}</span>
                      <span :class="{'unit': !!t.totalUnit}" :title="t.totalTitle">{{ t.totalUnit }}</span>
                    </div>
                    <div class="item-title">{{ t.name }}</div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="chart">
      <el-row :gutter="20">
        <el-col v-for="c in chatLists" :key="c.code" :span="8">
          <div class="item">
            <el-card shadow="hover">
              <div slot="header">
                <span class="item-title">{{ c.name }}</span>
              </div>
              <div class="item-content">
                <Charts :option="c.chartData" />
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { OrgAuthorityCenterController } from '@controller'
import Charts from './charts.vue'
import { BaseVue, _ } from '@lib'
import store, { localStore } from '@util/sessionStore'

const tenantList = [
  {
    name: '组织',
    code: 'org',
    icon: 'iconfont icon-furniture',
    children: [
      { code: 'orgCount', name: '部门', total: 0, totalTitle: 0 },
      { code: 'positionCount', name: '岗位', total: 0, totalTitle: 0 },
      { code: 'workGroupCount', name: '工作组', total: 0, totalTitle: 0 },
      { code: 'employeeCount', name: '用户', total: 0, totalTitle: 0 },
    ]
  }, {
    name: '权限',
    code: 'right',
    icon: 'iconfont icon-mima',
    children: [
      { code: 'adminCount', name: '管理员', total: 0, totalTitle: 0 },
      { code: 'roleCount', name: '角色数量', total: 0, totalTitle: 0 },
      { code: 'appCount', name: '应用', total: 0, totalTitle: 0 },
      { code: 'resourceCount', name: '资源数量', total: 0, totalTitle: 0 }
    ]
  }
]
const chatLists = [
  {
    code: 'Org',
    name: '组织机构调整量',
    chartData: {
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [0, 0, 0, 0, 0],
          type: 'line',
          color: '#aceafc',
          areaStyle: {
            color: '#e5f8fe'
          },
          lineStyle: {
            color: '#aceafc',
            width: 1
          }
        }
      ]
    }
  },
  {
    code: 'Role',
    name: '权限调整量',
    type: 'line',
    chartData: {
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [0, 0, 0, 0, 0],
          type: 'line',
          color: '#3e8bc0',
          areaStyle: {
            color: '#e0edf6'
          },
          lineStyle: {
            color: '#3e8bc0',
            with: 1
          }
        }
      ]
    }
  },
  {
    code: 'activeUser',
    name: '活跃用户量',
    chartData: {
      xAxis: {
        type: 'category',
        data: ['1日', '2日', '3日', '4日', '5日']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [0, 0, 0, 0, 0],
          type: 'bar',
          color: '#b1bae2'
        }
      ]
    }
  }
]
export default {
  components: { Charts },
  mixins: [BaseVue],
  data() {
    return {
      tenantList: _.cloneDeep(tenantList),
      chatLists: []
    }
  },
  async mounted() {
    this.$store.commit('SET_PLATFORM', null)
    localStore.set('isobjectMenu', false)
    this.tenantList = tenantList
    await this.getDateX()
    this.getData()
  },
  methods: {
    // 横轴日期
    getDateX() {
      const date = new Date()
      let monthArr = [1, 2, 3, 4, 5]
      let dateArr = [1, 2, 3, 4, 5]
      const month = date.getMonth() + 1
      monthArr = monthArr.map((item, index) => {
        item = month - index
        if (item < 1) {
          item = item + 12
        }
        item = item + '月'
        return item
      })
      monthArr = monthArr.reverse()
      dateArr = dateArr.map((item, index) => {
        const day = new Date(date.getTime() - (3600 * 1000 * 24) * index)
        item = `${day.getMonth() + 1}/${day.getDate()}`
        return item
      })
      dateArr = dateArr.reverse()
      chatLists.forEach(list => {
        if (list.code === 'activeUser') {
          this.$set(list.chartData.xAxis, 'data', dateArr)
        } else {
          this.$set(list.chartData.xAxis, 'data', monthArr)
        }
      })
    },
    async getData() {
      const resp = await this.dispatch(OrgAuthorityCenterController.queryTenantStatistics, {})
      if (resp.data) {
        this.tenantList.forEach(list => {
          list.children.forEach(item => {
            const code = item.code
            const total = resp.data[code]
            item.totalTitle = total
            item.totalUnit = total <= 999 ? '' : total <= 999999 ? '万' : '...'
            item.total = total <= 999 ? total : String(total / 10000).indexOf('.') === 2 ? String(total / 10000).slice(0, 2) : String(total / 10000).slice(0, 3)
          })
        })
        chatLists.forEach(list => {
          const code = list.code
          let arr = [0, 0, 0, 0, 0]
          arr = arr.map((item, index) => {
            return resp.data[code + index]
          })
          this.$set(list.chartData.series[0], 'data', arr.reverse())
        })
        this.chatLists = _.cloneDeep(chatLists)
      } else {
        this.chatLists = _.cloneDeep(chatLists)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.main {
  padding: 20px 20px 0;
  max-height: calc(90vh + 150px);
  min-height: calc(90vh + 2px);
  .num {
    height: 25%;
    .num_item {
      border: 1px solid #ddd;
      .top, .topTwo {
        height: 15%;
        color: white;
        padding: 15px 20px;
        font-size: 20px;
        font-weight: 700px;
        span {
          margin-left: 15px;
        }
        i {
          font-size: 22px;
        }
      }
      .top {
        background-image: linear-gradient(to right, #4eaff3, #03e5bd);
      }
      .topTwo {
        background-image: linear-gradient(to right, #fb6aa5, #fd9e6e);
      }
      .foot {
        background-color: #fff;
        height: 85%;
        .item {
          height: 100px;
          margin-top: 40px;
          margin-bottom: 20px;
          border-right: 1px solid #dadce1;
          text-align: center;
          .item-title {
            font-size: 14px;
            color: #909090;
          }
          .item-num {
            font-size: 60px;
            font-weight: 700;
            margin: 20px 0 5px;
            color: #504d4d;
            .unit {
              font-size: 24px;
              font-weight: 400;
              margin-left: -15px;
              cursor: pointer;
            }
          }
        }
        .el-col:nth-child(4) {
          .item {
            border: none;
          }
        }
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
          font-size: 15px;
          font-weight: 700;
        }
        .item-content {
          width: 100%;
          height: 400px;
        }
      }
    }
  }
}
</style>
