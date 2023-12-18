<comment>
// api对象
// apiName:{
//         query:"UserController.queryRole",
//         delete:"UserController.deleteRole",
//         disable:"UserController.disable",
//         enable:"UserController.enable",
//       },
// api参数对象
// params:{
      //   query:{},
      //   delete:{
      //     path:{},
      //     key:''
      //   },
      //   status:""
      // },
</comment>
<template>
  <div>
    <div class="top-block" data-testId="UITest-dialog-job">
      <el-row>
        <el-col :span="12">
          <PmToolbar>
            <el-button
              v-permission="funcCode.add"
              :disabled="enableOpt"
              plain
              icon="el-icon-plus"
              @click="openAdd"
            >
              添加角色
            </el-button>
          </PmToolbar>
        </el-col>
        <el-col :span="12" class="text-right">
          <PmSearch
            class="float-right"
            style="width: 300px"
            :query.sync="query"
            default-prop="name"
            placeholder="搜索角色名称"
            @search="pmSearch"
          >
            <template slot="body">
              <el-form-item label="角色编号" prop="code">
                <el-input v-model="query.code" clearable />
              </el-form-item>
              <el-form-item label="角色名称" prop="name">
                <el-input v-model="query.name" clearable />
              </el-form-item>
            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <pm-table
      :id="tableId"
      v-loading="loading"
      :height="height"
      border
      stripe
      :columns="columns"
      :table-data="gridList"
      auto-select-row
      @selection-change="selectChange"
    >
      <!-- <div
        v-if="!enableOpt"
        class="inline-action"
        slot="status"
        slot-scope="scope"
      >
        <span>{{ scope.row.status === "1" ? "启用" : "禁用" }}</span>
      </div> -->
      <!-- <div class="inline-action" slot="code" slot-scope="scope">
        <el-link @click="openEdit(scope.row)">{{ scope.row.code }}</el-link>
      </div> -->
      <div slot="action" slot-scope="scope" class="inline-action">
        <PmToolbar>
          <PmToolbarItem
            v-permission="funcCode.del"
            type="text"
            size="mini"
            @click="remove(scope.row)"
          >删除</PmToolbarItem>
          <!-- <PmToolbarItem size="mini" @click="handleStatus(scope.row)">{{
            scope.row.status === "1" ? "禁用" : "启用"
          }}</PmToolbarItem> -->
        </PmToolbar>
      </div>
    </pm-table>
    <Pagination
      :selections="selections"
      :page-size="query.limit"
      :current-page.sync="query.offset"
      :total="gridTotal"
      @size-change="changePageSizer"
      @current-change="changePage"
    />
    <select-types
      :dialog-visible.sync="dialogVisible"
      :org-data="orgData"
      :dialogquery-fun="dialogqueryFun"
      :is-multiple="true"
      :party-types="partyTypes"
      title="添加角色"
      @sure="handleSuccess"
    />
  </div>
</template>

<script>
import { BaseVue, List } from '@lib'
import { controller } from './controller.js'
export default {
  name: '',
  components: { },
  mixins: [BaseVue, List],
  props: {
    funcCode: {
      default: {}
    },
    height: {
      default: function() {
        return 'calc(100vh - 408px)'
      },
    },
    params: {
      default: function() {
        return {}
      },
    },
    orgData: {},
    dimensionData: {},
    apiName: {
      default: function() {
        return ''
      },
    },
    queryFun: {},
    dialogqueryFun: {},
    addFun: {},
    deleteFun: {},
    enableOpt: {
      default: function() {
        return false
      }
    },
    clearable: {
      default: function() {
        return false
      }
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      columns: [
        { label: '编号', prop: 'code', scope: 'code' },
        { label: '名称', prop: 'name', scope: 'name' },
        // { label: "状态", prop: "status", scope: "status" },
        // { label: "创建人", prop: "createUserName" },
        // { label: "创建时间", prop: "createTime" },
        { label: '操作', scope: 'action', width: 120 },
      ],
      partyTypes: [{ code: 'role', name: '角色' }],
    }
  },
  computed: {},
  watch: {
    params: {
      immediate: true,
      deep: true,
      handler: function(value) {
        if (value) {
          this.search()
        }
      }
    },
    orgData: {
      immediate: true,
      handler: function(value) {
        if (this.clearable) {
          if (value) {
            this.search()
          } else {
            this.gridData = []
          }
        }
      }
    }
  },
  mounted() {
    if (this.orgData) {
      this.search()
    }
  },
  methods: {
    async handleStatus(row) {
      let resp
      if (row.status === '1') {
        resp = await this.dispatch(controller[this.apiName.disable], {
          [this.params.statusKey]: row.id,
        })
      } else {
        resp = await this.dispatch(controller[this.apiName.enable], {
          [this.params.statusKey]: row.id,
        })
      }
      if (!resp.error) {
        this.message.success('操作成功！')
        this.search()
      }
    },
    async handleSuccess(form) {
      let resp
      if (this.addFun) {
        const arr = form.map(i => { return { id: i.id, types: '' } })
        resp = await this.addFun.call(this, { orgId: this.orgData.id, resources: arr })
      } else {
        const ids = form.map(i => { return i.id })
        resp = await this.dispatch(controller[this.apiName.create], {
          ...this.params.create.path, [this.params.create.key]: ids
        })
      }
      if (!resp.error) {
        this.dialogVisible = false
        this.search()
        this.$emit('success')
      }
    },
    // 列表 选择改变
    selectChange(selection) {
      this.selectRow = selection
    },
    async searchBody() {
      if (this.queryFun) {
        const resp = await this.queryFun.call(this, { orgId: this.orgData.id, ...this.query })
        // resp.data.data = resp.data.data.map(i=>{return i.role})

        return resp
      }
      const payload = { ...this.params.query, ...this.query }
      console.log(controller)
      const resp = await this.dispatch(controller[this.apiName.query], payload)
      if (!resp.error && this.params.type === 'obj') {
        const gridList = resp.data.data.map(i => i.role)
        resp.data.data = gridList
      }

      return resp
    },
    async removeBody(row) {
      let resp
      if (this.deleteFun) {
        const arr = { id: row.resId, types: '' }
        resp = await this.deleteFun.call(this, { orgId: this.orgData.id, resources: [arr] })
      } else {
        resp = await this.dispatch(controller[this.apiName.delete], {
          ...this.params.delete.path, [this.params.delete.key]: [row.id]
        })
      }
      this.$emit('success')
      return resp
    },
  },
}
</script>
<style lang="scss" scoped>
</style>

