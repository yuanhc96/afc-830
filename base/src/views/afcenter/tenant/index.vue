<template>
  <div class="pl-20 pr-20 pb-20">
    <div class="top-block">
      <el-row>
        <el-col :span="16">
          <PmToolbar>
            <PmToolbarItem plain v-permission="FuncCode.afc_f_tenant_add" icon="el-icon-plus" @click="openAdd">新建租户</PmToolbarItem>
          </PmToolbar>
        </el-col>
        <el-col :span="8" class="text-right">
          <PmSearch
            class="float-right"
            style="width: 300px"
            :query.sync="query"
            defaultProp="name"
            placeholder="搜索租户名称"
            @search="pmSearch"
          >
            <template slot="body">
                <el-form-item label="租户编号" prop="code">
                  <el-input v-model="query.code" clearable />
                </el-form-item>
                <el-form-item label="租户名称" prop="name">
                  <el-input v-model="query.name" clearable />
                </el-form-item>
            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table v-loading="loading" :data="gridList" handleAdd
        border stripe
        :id="tableId"
        :height="autoTableHeight"
        >
        <el-table-column label="租户编号" prop="code" />
        <el-table-column label="名称" prop="name" />
        <el-table-column label="状态" prop="status">
          <template slot-scope="{row}">
            {{ getStatus(row.status, true) }}
          </template>
        </el-table-column>
        <el-table-column label="管理员账号" prop="userCode" />
        <el-table-column label="操作" width="150px">
          <template slot-scope="{row}">
            <PmToolbar>
              <PmToolbarItem
                type="text"
                v-if="row.status === '1' && allow(FuncCode.afc_f_tenant_disable)"
                :disabled="actionLoading"
                @click="changeStatus(row)"
              >
                禁用
              </PmToolbarItem>
              <PmToolbarItem
                type="text"
                v-else-if="row.status === '0' && allow(FuncCode.afc_f_tenant_enable)"
                :disabled="actionLoading"
                @click="changeStatus(row)"
              >
                启用
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
    </div>
    <TenantAdd :dialog-visible.sync="dialogVisible" :form-data.sync="selectRow" @success="search" />
  </div>
</template>
<script>
import { TenantController } from '@controller'
import { BaseVue, List, VueUtil } from '@lib'
import TenantAdd from './add.vue'

export default {
  components: { TenantAdd },
  mixins: [BaseVue, List],
  props: {},

  data() {
    return {
      dialogVisible: false,
      tenantId: '',
      tenantName: '',
      member: [],
      query: {
        limit: 10,
        offset: 1,
        name: null,
        code: null
      },
      statusDict: [
        {
          value: '0',
          label: '禁用'
        },
        {
          value: '1',
          label: '启用'
        }
      ]
    }
  },
  computed: {
    ...VueUtil(this)
      .select([TenantController])
      .state(),
    loading() {
      return this.TenantController.queryTenantsByCriteria.loading
    },
    actionLoading() {
      return this.TenantController.disable.loading || this.TenantController.enable.loading
    }
  },
  watch: {},

  created() {
  },

  mounted() {
    this.search()
  },

  methods: {
    async searchBody() {
      let resp = await this.dispatch(TenantController.queryTenantsByCriteria, {
        name: this.query.name,
        code: this.query.code,
        pageIndex: this.query.offset - 1,
        pageSize: this.query.limit
      })
      return resp
    },
    async changeStatus(row) {
      let resp = null
      if(row.status === '1') {
        resp = await this.dispatch(TenantController.disable, {
          id: row.id
        })
      }else {
        resp = await this.dispatch(TenantController.enable, {
          id: row.id
        })
      } 
      if (!resp.error) {
        this.$msg.success(`${this.getStatus(row.status, false)}成功`)
        this.search()
      }
    },
    getStatus(status, turn) {
      const currentStatus = turn ? status : status === '0' ? '1' : '0'
      const obj = this.statusDict.filter(item => item.value === currentStatus)[0]
      return obj.label
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
