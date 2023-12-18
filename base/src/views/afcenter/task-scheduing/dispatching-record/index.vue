<template>
  <div class="pl-20 pr-20 pb-20">
    <div class="top-block">
      <el-row>
        <el-col :span="16">
          <PmToolbar>
            <PmToolbarItem plain icon="el-icon-plus" @click="clearLog">清理</PmToolbarItem>
          </PmToolbar>
        </el-col>
        <el-col :span="8" class="text-right">
          <PmSearch
            class="float-right"
            style="width: 300px"
            :query.sync="query"
            @search="pmSearch"
            placeholder="搜索"

          >
            <template slot="body">
              <el-form-item label="执行器" prop="jobGroup">
                <el-select v-model="query.jobGroup" style="width:100%" @change="getJobInfos(query.jobGroup)">
                  <el-option
                    v-for="item in jobGroup"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="任务" prop="jobId">
                <el-select v-model="query.jobId" style="width:100%" placeholder="">
                  <el-option
                    v-for="item in jobInfos"
                    :key="item.id"
                    :label="item.jobDesc"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="状态" prop="logStatus">
                <el-select v-model="query.logStatus" style="width:100%" placeholder="">
                  <el-option
                    v-for="item in logStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="调度时间" prop="filterTime">
                <el-date-picker
                  v-model="query.filterTime"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始"
                  end-placeholder="结束"
                  :clearable="false"
                  style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table v-loading="loading" :data="gridList"
        border stripe
        :id="tableId"
        :height="autoTableHeight"
      >
        <el-table-column label="任务ID" prop="jobId" />
        <el-table-column label="调度时间" prop="triggerTime" min-width="170px" />
        <el-table-column label="调度结果" prop="triggerCode">
          <template slot-scope="{row}">
            {{ row.triggerCode === 200 ? '成功' : '失败' }}
          </template>
        </el-table-column>
        <el-table-column label="调度备注" prop="triggerMsg">
          <template slot-scope="{row}">
            <PmToolbarItem v-if="row.triggerMsg" type="text" @click="check('trigger', row.triggerMsg)"> 查看 </PmToolbarItem>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="执行时间" prop="handleTime" min-width="170px" />
        <el-table-column label="执行结果" prop="handleCode">
          <template slot-scope="{row}" v-if="row.triggerCode === 200">
            {{ row.handleCode === 200 ? '成功' : row.handleCode === 500 ? '失败' : '进行中' }}
          </template>
        </el-table-column>
        <el-table-column label="失败备注" prop="handleMsg">
          <template slot-scope="{row}">
            <PmToolbarItem v-if="row.handleMsg" type="text" @click="check('handler', row.handleMsg)"> 查看 </PmToolbarItem>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="{row}">
            <PmToolbar v-if="row.handleCode">
              <PmToolbarItem type="text" @click="logDetailCat(row)"> 执行日志 </PmToolbarItem>
            </PmToolbar>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-right">
        <Pagination 
          :selections="selections"
          :page-size="query.limit"
          :current-page.sync="query.offset"
          :total="gridTotal"
          @size-change="changePageSizer"
          @current-change="changePage"
          />
      </div>
    </div>
    <Check :dialog-visible.sync="checkVisible" :content="checkContent" :type="checkType" />
    <ClearForm :dialog-visible.sync="clearVisible" :jobGroups="jobGroup" :jobInfos="jobInfos" :jobGroup="query.jobGroup" :jobId="query.jobId" @success="search" />
  </div>
</template>
<script>
import { JobGroupController, JobInfoController, JobLogController } from '@controller';
import { BaseVue, List, VueUtil } from '@lib';
import moment from 'dayjs';
import Check from './check.vue';
import ClearForm from './clear.vue';

export default {
  components: { Check, ClearForm },
  mixins: [BaseVue, List],
  props: {
    defaultQuery:{
      type:Object,
      default:()=>{
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      clearVisible: false,
      jobGroup: [],
      jobInfos: [],
      query: {
        limit: 10,
        offset: 1,
        jobGroup: 0,
        jobId: 0,
        logStatus: -1,
        filterTime: [new Date(new Date().toLocaleDateString() + ' 00:00:00'), new Date(new Date().toLocaleDateString() + ' 23:59:59')]
      },
      logStatus: [
        {
          value: -1,
          label: '全部'
        },{
          value: 1,
          label: '成功'
        },{
          value: 2,
          label: '失败'
        },{
          value: 3,
          label: '进行中'
        }
      ],
      pickerOptions: {
        shortcuts: [{
          text: '最近一小时',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000);
            picker.$emit('pick', [start, end]);
          }
        }, {
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
      checkType: 'handler',
      checkContent: '',
      checkVisible: false
    }
  },
  computed: {
    ...VueUtil(this)
      .select([JobLogController, JobGroupController, JobInfoController])
      .state(),
    loading() {
      return this.JobLogController.pageList.loading
    }
  },
  watch: {},

  created() {
  },

  async mounted() {
    await this.getJobGroup()
    if(this.defaultQuery){
      this.query.jobGroup = Number(this.defaultQuery.jobGroup) || 0
      await this.getJobInfos(this.query.jobGroup)
      this.query.jobId = Number(this.defaultQuery.jobId) || 0
    }
    await this.search()
  },

  methods: {
    async searchBody() {
      this.clearFields()
      const startTime = moment(this.query.filterTime[0]).format('YYYY-MM-DD HH:mm:ss')
      const endTime = moment(this.query.filterTime[1]).format('YYYY-MM-DD HH:mm:ss')
      let resp = await this.dispatch(JobLogController.pageList, {
        jobGroup: this.query.jobGroup,
        jobId: this.query.jobId,
        logStatus: this.query.logStatus,
        // filterTime: '2023-05-09%2015:11:36%20-%202023-06-08%2015:11:36',
        filterTime: startTime + ' - ' + endTime,
        start: (this.query.offset - 1) * this.query.limit,
        length: this.query.limit
      })
      const { data, recordsTotal } = resp.data
      return {
        data: {
          data: data,
          total: recordsTotal
        }
      }
    },
    async getJobGroup() {
      const resp = await this.dispatch(JobGroupController.pageList, {
        start: 0,
        length: 9999
      })
      if (!resp.error) {
        const { data } = resp.data
        this.jobGroup = data || []
        this.jobGroup.unshift({id: 0, title: '全部'})
      }
    },
    async getJobInfos(jobGroup) {
      if (!jobGroup) {
        this.jobInfos = [{id: 0, jobDesc: '全部'}]
        return
      }
      const resp = await this.dispatch(JobInfoController.pageList, {
        jobGroup: jobGroup,
        triggerStatus: -1,
        start: 0,
        length: 9999
      })
      if (!resp.error) {
        const { data } = resp.data
        this.jobInfos = data || []
        this.jobInfos.unshift({id: 0, jobDesc: '全部'})
      }
    },
    async logDetailCat(row) {
      const routedata = this.$router.resolve({
        path: '/dispatching_record/logDetailPage',
        query: {
          logId: row.id
        }
      })
      window.open(routedata.href, '_blank')
    },
    check(type, msg) {
      this.checkType = type
      this.checkContent = msg
      this.checkVisible = true
    },
    clearLog() {
      this.clearVisible = true
      
    },
    clearFields() {
      if (!this.query.jobGroup) {
        this.query.jobGroup = 0
      }
      if (!this.query.jobGroup) {
        this.query.jobId = 0
      }
      if (!this.query.logStatus) {
        this.query.logStatus = -1
      }
      if (!this.query.filterTime) {
        const start = new Date(new Date().toLocaleDateString() + ' 00:00:00') 
        const end = new Date(new Date().toLocaleDateString() + ' 23:59:59') 
        this.query.filterTime = [start, end]
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
