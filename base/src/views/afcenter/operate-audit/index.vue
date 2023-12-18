<template>
  <div class="pl-20 pr-20 pb-20">
    <div class="top-block">
      <el-row>
        <el-col :span="16">
          <el-dropdown
            v-if="allow(FuncCode.afc_f_operation_logs_tenant_export)
            || allow(FuncCode.afc_f_operation_logs_sys_export)"
            @command="exportData" trigger="hover"
            placement="bottom"
          >
            <el-button>
              导出 <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="isAdminLevel && allow(FuncCode.afc_f_operation_logs_sys_export)" command="allAdmin">全部</el-dropdown-item>
              <el-dropdown-item v-else-if="!isAdminLevel && allow(FuncCode.afc_f_operation_logs_tenant_export)" command="allTenant">全部</el-dropdown-item>
              <el-dropdown-item v-if="isAdminLevel && allow(FuncCode.afc_f_operation_logs_sys_export)" command="curAdmin">当前页</el-dropdown-item>
              <el-dropdown-item v-else-if="!isAdminLevel && allow(FuncCode.afc_f_operation_logs_tenant_export)" command="curTenant">当前页</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="8" class="text-right">
          <PmSearch
            class="float-right"
            style="width: 300px"
            :query.sync="query"
            defaultProp="operatorName"
            placeholder="搜索操作人"
            @search="pmSearch"
          >
            <template slot="body">
              <el-form-item label="操作类型" prop="operateType">
                <el-select v-model="query.operateType" clearable style="width: 100%">
                  <el-option
                    v-for="item in operateTypeDict"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="操作人" prop="operatorName">
                <el-input v-model="query.operatorName" clearable placeholder="请输入操作人" />
              </el-form-item>
              <el-form-item v-if="isAdminLevel" label="租户" prop="tenantName">
                <tenant-select
                  v-model="query.tenant"
                  width="274"
                  @change="getCurrentTenant"
                />
                <!-- <el-select v-model="query.tenantId" placeholder="请选择" clearable style="width: 100%">
                  <el-option
                    v-for="item in tenantLists"
                    :key="item.id"
                    :label="item.name + ' (' + item.code + ')'"
                    :value="item.id">
                  </el-option>
                </el-select> -->
              </el-form-item>
              <el-form-item label="资源类型" prop="targetType">
                <el-input v-model="query.targetType" clearable placeholder="请输入资源类型" />
              </el-form-item>
              <el-form-item label="业务对象" prop="targetModelName">
                <el-input v-model="query.targetModelName" clearable placeholder="请输入业务对象" />
              </el-form-item>
              <el-form-item label="时间范围" prop="dateTime">
                <el-date-picker
                  v-model="dateTime"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="dateTimeOptions"
                  :default-time="['00:00:00', '23:59:59']"
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
        stripe border
        :id="tableId"
        :height="autoTableHeight"
      >
        <el-table-column label="日期" prop="operateDate" min-width="150" />
        <el-table-column label="操作类型" prop="operateType" min-width="87px" >
          <template slot-scope="{row}">
            {{ getOperateType(row.operateType) }}
          </template>
        </el-table-column>
        <el-table-column label="操作人" prop="operatorName" />
        <el-table-column v-if="isAdminLevel" label="租户" prop="tenantName" show-overflow-tooltip />
        <el-table-column label="资源类型" prop="targetType" min-width="87px" />
        <el-table-column label="业务对象" prop="targetModelName" show-overflow-tooltip min-width="87px" />
        <el-table-column label="操作描述" prop="message" show-overflow-tooltip min-width="300px"/>
        <el-table-column label="操作" width="150px">
          <template slot-scope="{row}">
            <PmToolbar>
              <PmToolbarItem type="text" v-if="showDetailBtn" @click="openEdit(row)">
                详情
              </PmToolbarItem>
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
      <Detail :dialog-visible.sync="dialogVisible" :form-data.sync="selectRow" />
    </div>
  </div>
</template>
<script>
import { OperationLogController, TenantController } from '@controller'
import { BaseVue, List, VueUtil, _ } from '@lib'
import ajaxUtil from '@lib/ajaxUtil'
import moment from 'dayjs'
import FileSaver from 'file-saver'
import Base from './base'
import Detail from './detail.vue'
import TenantSelect from './tenant-select.vue'
export default {
  components: { Detail, TenantSelect },
  mixins: [BaseVue, List, Base],
  props: {},

  data() {
    return {
      query: {
        limit: 10,
        offset: 1,
        operateType: null,
        beginTime: null,
        endTime: null,
        operatorName: null,
        targetModelName: null,
        targetType: null,
        tenant: null,
        tenantName: ''
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
        }
      },
      tenantLists: [],
      dialogVisible: false,
      selectRow: {}
    }
  },
  computed: {
    ...VueUtil(this)
      .select([ OperationLogController, TenantController])
      .state(),
    loading() {
      return this.OperationLogController.queryOperationLogForSys.loading || this.OperationLogController.queryOperationLogForTenant.loading
    },
    // 根据租户id是否是平台管理员
    isAdminLevel() {
      console.log(this.allow(this.FuncCode.afc_f_operation_logs_sys_query), 'this.allow(this.FuncCode.afc_f_operation_logs_sys_query)')
      return this.allow(this.FuncCode.afc_f_operation_logs_sys_query)
    },
    showDetailBtn() {
      return this.allow(this.FuncCode.afc_f_operation_logs_detail_query) || this.allow(this.FuncCode.afc_f_operation_logs_detail_tenant_query)
    }
  },
  watch: {
    'query.tenantName': {
      immediate: true,
      handler(val) {
        console.log(val, 'tenantName')
        if (!val) {
          this.query.tenant = null
        }
      }
    }
  },

  created() {
  },

  async mounted() {
    this.resetDateTime()
    await this.search()
    if (this.isAdminLevel) {
      this.getTenantLists()
    }
  },

  methods: {
    async searchBody() {
      console.log(this.query, '=====')
      this.query.beginTime = moment(this.dateTime[0]).format('YYYY-MM-DD HH:mm:ss') 
      this.query.endTime = moment(this.dateTime[1]+ ' 23:59:59').format('YYYY-MM-DD HH:mm:ss')
      let resp = null
      let params = {
        pageIndex: this.query.offset - 1,
        pageSize: this.query.limit,
        beginTime: this.query.beginTime,
        endTime: this.query.endTime,
        targetType: this.query.targetType,
        targetModelName: this.query.targetModelName,
        operatorName: this.query.operatorName,
        type: this.query.operateType
      }
      if (!this.isAdminLevel) {
        resp = await this.dispatch(OperationLogController.queryOperationLogForTenant, params)
        return resp
      } else {
        resp = await this.dispatch(OperationLogController.queryOperationLogForSys, {
          ...params,
          tenantId: this.query.tenant && this.query.tenant.id || null,
        })
        const { data } = resp.data
        if (!resp.error) {
          const tenantIdList = _.uniq(data.map(i => i.tenantId))
          if (!tenantIdList.length) {
            return resp
          } else {
            const res = await this.dispatch(TenantController.findTenantByIds, {ids: tenantIdList})
            if (!res.error) {
              const tenantList = res.data
              resp.data.data = data.map(item => {
                const tenant = tenantList.filter(i => i.id === item.tenantId)
                return {
                  ...item,
                  tenantName: tenant.length ? tenant[0].name : item.tenantId
                }
              })
              return resp
            }
          }
          
        }
      }
    },
    async getTenantLists() {
      let resp = await this.dispatch(TenantController.queryTenantsByCriteria, {
        pageIndex: 0,
        pageSize: 20
      })
      if (!resp.error) {
        this.tenantLists = resp.data.data
      }
    },
    resetDateTime() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
      this.dateTime = [moment(start).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD')]
    },
    async exportData(type) {
      console.log('daochu', type)
      ajaxUtil.config.responseType = 'blob'
      let params = {
        beginTime: this.query.beginTime,
        endTime: this.query.endTime,
        operateType: this.query.operateType,
        pageIndex: this.query.offset - 1,
        pageSize: this.query.limit,
      }
      let resp = null
      if (type === 'allTenant') {
        this.switchScreenLoading(true)
        resp = await this.dispatch(OperationLogController.exportOperationLogsForTenant, {
          params: {
            pageIndex: -1,
            pageSize: -1
          }
        })
      } else if (type === 'allAdmin') {
        this.switchScreenLoading(true)
        resp = await this.dispatch(OperationLogController.exportOperationLogsForSys, {
          params: {
            pageIndex: -1,
            pageSize: -1
          }
        })
      } else if (type === 'curTenant') {
        resp = await this.dispatch(OperationLogController.exportOperationLogsForTenant, { params })
      } else if (type === 'curAdmin') {
        params.tenantId = this.query.tenantId
        resp = await this.dispatch(OperationLogController.exportOperationLogsForSys, { params })
      }
      if (!resp.error) {
        const blob = new Blob([resp.data], { type: 'application/vnd.ms-excel,charset=utf-8' })
        FileSaver.saveAs(blob, `${moment().format('YYYY-MM-DD')}-审计日志.xlsx`)
      }
      ajaxUtil.config.responseType = 'json'
      this.switchScreenLoading(false)
    },
    openDetail(row) {
      this.detailDialog = true
      this.selectRow = row
    },
    showDetail(row) {
      const arr = ['0', '1', '2']
      return arr.includes(row.operateType)
    },
    getCurrentTenant(row) {
      this.query.tenantName = row.name
      this.query.tenant = row
    }
  }
} 
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  button.el-button.el-button--default.el-button--mini.el-dropdown-selfdefine {
    border-color: var(--tagBg);
    color: var(--tagBg);
  }
  .el-dropdown-menu--mini .el-dropdown-menu__item {
    text-align: center;
    padding: 0 19px;
  }
</style>
