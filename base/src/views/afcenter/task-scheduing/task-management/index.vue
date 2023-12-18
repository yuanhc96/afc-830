<template>
  <div class="pl-20 pr-20 pb-20">
    <div class="top-block">
      <el-row>
        <el-col :span="16">
          <PmToolbar>
            <PmToolbarItem plain icon="el-icon-plus" @click="openAdd">新建任务</PmToolbarItem>
          </PmToolbar>
        </el-col>
        <el-col :span="8" class="text-right">
          <PmSearch
            class="float-right"
            style="width: 300px"
            :query.sync="query"
            defaultProp="jobDesc"
            placeholder="搜索任务名称"
            @search="pmSearch"
          >
            <template slot="body">
              <el-form-item label="执行器" prop="jobGroup">
                <el-select v-model="query.jobGroup" style="width:100%" placeholder="" clearable>
                  <el-option
                    v-for="item in jobGroup"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="状态" prop="triggerStatus">
                <el-select v-model="query.triggerStatus" style="width:100%" placeholder="">
                  <el-option
                    v-for="item in statusDict"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="任务名称" prop="jobDesc">
                <el-input v-model="query.jobDesc" clearable />
              </el-form-item>
              <el-form-item label="JobHandler" prop="executorHandler">
                <el-input v-model="query.executorHandler" clearable />
              </el-form-item>
              <!-- <el-form-item label="负责人" prop="author">
                <el-input v-model="query.author" clearable />
              </el-form-item> -->
            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table v-loading="loading" :data="gridList"
        stripe border
        :id="tableId"
        :height="autoTableHeight"
      >
        <el-table-column label="任务ID" prop="id" />
        <el-table-column label="任务名称" prop="jobDesc" />
        <el-table-column label="调度类型" prop="scheduleConf" min-width="120">
          <template slot-scope="{row}">
            {{ row.scheduleType }}
            <span v-if="row.scheduleType !== 'NONE'">:</span>
            {{ row.scheduleConf }}
          </template>
        </el-table-column>
        <el-table-column label="运行模式" prop="executorHandler" min-width="180">
          <template slot-scope="{row}">
            {{ row.glueType_extra }}
            <span v-if="row.glueType === 'BEAN'">: {{ row.executorHandler }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行器" prop="jobGroup">
        <template slot-scope="{row}">
            {{ formatJobGroup(row.jobGroup)}}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="triggerStatus">
          <template slot-scope="{row}">
            {{ row.triggerStatus === 1 ? '启动' : '停止' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170px">
          <template slot-scope="{row}">
            <PmToolbar>
              <PmToolbarItem v-if="row.triggerStatus === 0" type="text" @click="switchStatus(row)"> 启动 </PmToolbarItem>
              <PmToolbarItem v-else type="text" @click="switchStatus(row, '停止')"> 停止 </PmToolbarItem>
              <PmToolbarItem type="text" @click="openEdit(row)"> 编辑 </PmToolbarItem>
              <PmToolbarGroup>
                <PmToolbarItem type="text" @click="trigger(row)"> 执行一次 </PmToolbarItem>
                <PmToolbarItem type="text" @click="gotoLog(row)"> 查询日志 </PmToolbarItem>
                <PmToolbarItem type="text" @click="load(row)"> 注册节点 </PmToolbarItem>
                <PmToolbarItem type="text" @click="nextTrigger(row)"> 最近执行时间 </PmToolbarItem>
                <!-- <PmToolbarItem v-if="row.glueType !== 'BEAN'" type="text" @click="glueIDE(row)"> GLUE IDE </PmToolbarItem> -->
                <PmToolbarItem type="text" @click="remove(row)"> 删除 </PmToolbarItem>
                <PmToolbarItem type="text" @click="copyEdit(row)"> 复制 </PmToolbarItem>
              </PmToolbarGroup>
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
    <TaskAdd
      v-if="dialogVisible"
      :dialog-visible.sync="dialogVisible"
      :form-data.sync="selectRow"
      :jobGroup="jobGroup"
      @success="search" />
    <Trigger
      :dialog-visible.sync="triggerVisible"
      :trigger-id="triggerId"/>
    <CheckUrl :dialog-visible.sync="checkVisible" :currentRegistryList="currentRegistryList" />
    <TriggerTimeList :dialog-visible.sync="nextTriggerVisible" :triggerTimeLists="triggerTimeLists" />
    <Logdialog :dialogVisible.sync="logDialogVisible" v-if="logDialogVisible" :logTitle="logTitle" :defaultQuery="defaultQuery"/>
  </div>
</template>
<script>
import { JobGroupController, JobInfoController } from '@controller'
import { BaseVue, List, VueUtil } from '@lib'
import CheckUrl from '../actuator-management/checkUrl.vue'
import Logdialog from './components/LogDialog'
import TaskAdd from './add.vue'
import { glueTypes } from './model'
import TriggerTimeList from './next-trigger.vue'
import Trigger from './trigger.vue'

export default {
  components: { TaskAdd, Trigger, CheckUrl, TriggerTimeList,Logdialog },
  mixins: [BaseVue, List, ],
  props: {},

  data() {
    return {
      dialogVisible: false,
      triggerVisible: false,
      checkVisible: false,
      logDialogVisible: false,
      nextTriggerVisible: false,
      defaultQuery:{},
      logTitle:"",
      query: {
        limit: 10,
        offset: 1,
        name: null,
        code: null,
        jobGroup: null,
        triggerStatus: -1,
        jobDesc: null,
        executorHandler: null,
        // author: null
      },
      statusDict: [
        {
          value: -1,
          label: '全部'
        },
        {
          value: 0,
          label: '停止'
        },
        {
          value: 1,
          label: '启动'
        }
      ],
      options:[],
      jobGroup : [],
      currentRegistryList: [],
      triggerTimeLists: [],
      glueTypes
    }
  },
  computed: {
    ...VueUtil(this)
      .select([JobInfoController, JobGroupController])
      .state(),
    loading() {
      return this.JobInfoController.pageList.loading
    }
  },
  watch: {},

  created() {
  },

  async mounted() {
    await this.getJobGroup()
    await this.search()
  },

  methods: {
    async getJobGroup() {
      const resp = await this.dispatch(JobGroupController.pageList, {
        start: 0,
        length: 9999
      })
      if (!resp.error) {
        const { data } = resp.data
        this.jobGroup = data || []
        // this.query.jobGroup = data[0]?.id
      }
    },
    async searchBody() {
      const { jobGroup, triggerStatus, jobDesc, executorHandler} = this.query
      let resp = await this.dispatch(JobInfoController.pageList, {
        jobGroup: jobGroup || 0,
        triggerStatus,
        jobDesc,
        executorHandler,
        start: (this.query.offset - 1) * this.query.limit,
        length: this.query.limit
      })
      const { data, recordsTotal } = resp.data
      return {
        data: {
          data: data.map(item => {
            if (item.scheduleType === 'CRON') {
              item.schedule_conf_CRON = item.scheduleConf
            } else if (item.scheduleType === 'FIX_RATE') {
              item.schedule_conf_FIX_RATE = item.scheduleConf
            }
            return {
              ...item,
              glueType_extra: item.isBiz ?  '逻辑流' : this.glueTypes.filter(type => item.glueType === type.value)[0].label
            }
          }),
          total: recordsTotal
        }
      }
    },
    switchStatus(row, type = '启动') {
      this.$confirm(`确定${type}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          let resp = null
          if (type === '启动') {
            resp = await this.dispatch(JobInfoController.start, {
              id: row.id
            })
          } else {
            resp = await this.dispatch(JobInfoController.pause, {
              id: row.id
            })
          }
          const {code, msg} = resp.data
          if (code === 200) {
            this.$msg.success(`${type}成功`)
            this.search()
          } else {
            this.$msg.error(msg)
          }
        })
        .catch(() => {
        })
    },
    copyEdit(row) {
      this.selectRow = _.cloneDeep(row)
      delete this.selectRow.id
      delete this.selectRow.addTime
      delete this.selectRow.glueUpdatetime
      delete this.selectRow.updateTime
      this.dialogVisible = true
    },
    trigger(row) {
      this.triggerVisible = true
      this.triggerId = row.id
    },
    async load(row) {
      const resp = await this.dispatch(JobGroupController.loadById, {
        id: row.jobGroup
      })
      const {code, msg, content} = resp.data
      if (code === 200) {
        this.checkVisible = true
        this.currentRegistryList = content.registryList || []
      } else {
        this.$msg.error(msg)
      }
    },
    async nextTrigger(row) {
      const resp = await this.dispatch(JobInfoController.nextTriggerTime, {
        scheduleType: row.scheduleType,
        scheduleConf: row.scheduleConf
      })
      const {code, msg, content} = resp.data
      if (code === 200) {
        this.nextTriggerVisible = true
        this.triggerTimeLists = content
      } else {
        this.$msg.error(msg)
      }
    },
    async removeBody(row) {
      const resp = await this.dispatch(JobInfoController.remove, {
        id: row.id
      })
      if (!resp.error) {
        this.$msg.success('删除成功！')
        this.search()
      }
    },
    async glueIDE(row) {
      const routedata = this.$router.resolve({
        path: '/task-management/editor',
        query: {
          jobId: row.id,
          jobDesc: row.jobDesc
        }
      })
      window.open(routedata.href, '_blank')
    },
    async gotoLog(row) {
      this.defaultQuery = { 
          jobGroup: row.jobGroup,
          jobId: row.id 
      }
      this.logTitle = row.jobDesc
      this.logDialogVisible = true
    },
    formatJobGroup(val) {
      const arr = this.jobGroup.filter(i => i.id === val) || []
      return arr[0]?.title
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
