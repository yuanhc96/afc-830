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
  <div :class="{'pb-20':showPb20}">
    <div class="top-block">
      <el-row>
        <el-col :span="16">
          <PmToolbar>
            <PmToolbarItem
              v-permission="funcCode.add"
              plain
              :disabled="enableOpt"
              icon="el-icon-plus"
              @click="addAction"
            >添加岗位</PmToolbarItem>
          </PmToolbar>
        </el-col>
        <el-col :span="8" class="text-right">
          <PmSearch
            class="float-right"
            style="width: 300px"
            :query.sync="query"
            default-prop="code"
            placeholder="搜索岗位编号"
            @search="pmSearch"
          >
            <template slot="body">
              <el-form-item label="岗位编号" prop="code">
                <el-input v-model="query.code" v-focus clearable />
              </el-form-item>
              <el-form-item label="岗位名称" prop="name">
                <el-input v-model="query.name" clearable />
              </el-form-item>
            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <pm-table
      v-loading="loading"
      :height="height"
      :columns="columns"
      :table-data="gridList"
      auto-select-row
      border
      stripe
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
      <!--      <div slot="code" slot-scope="scope" class="inline-action">-->
      <!--        <el-link @click="openEdit(scope.row)">{{ scope.row.code }}</el-link>-->
      <!--      </div>-->
      <div slot="name" slot-scope="scope" class="inline-action">
        <span>{{ scope.row.name }}</span><span>{{ scope.row.dependentType=='1'?'(主岗)':'' }}</span>
      </div>
      <div slot="action" slot-scope="scope" class="inline-action">
        <PmToolbar>
          <PmToolbarItem v-if="scope.row.org" v-permission="funcCode.mainPot" type="text" size="mini" @click="setMainPost(scope.row)">设为主岗</PmToolbarItem>
          <PmToolbarItem
            v-permission="funcCode.del"
            type="text"
            :disabled="(total==1) && retain"
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

    <SelectTypes
      :active-name="type"
      :position-search="dialogqueryFun"
      :dialog-visible.sync="dialogVisible"
      title="选择岗位"
      :is-multiple="true"
      :party-types="objectType"
      @sure="handleSuccess"
    />
    <OrgForm
      ref="orgForm"
      :employeeCode="employeeCode"
      :org-data="orgData"
      :dimension-data="dimensionData"
      @change="handleChange"
    />
  </div>
</template>

<script>
import { DictTypeController, OrgController } from '@controller'
import { BaseVue, List } from '@lib'
import { mapGetters } from 'vuex'
import Position from './components/index.vue'
import { controller } from './controller.js'
import OrgForm from './orgForm.vue'
export default {
  name: '',
  components: { Position, OrgForm },
  mixins: [BaseVue, List],
  props: {
    funcCode: {
      default: {}
    },
    positionSearch: {},
    clearable: {
      default: function() { return false }
    },
    height: {
      default: function() {
        return 'calc(100vh - 281px)'
      },
    },
    params: {
      default: function() {
        return {}
      },
    },
    innerVisible: {
      default: function() {
        return false
      }
    },
    dialogqueryFun: {},
    dimensionData: {},
    apiName: {
      default: function() {
        return ''
      },
    },
    queryFun: {},
    addFun: {},
    deleteFun: {},
    orgData: {},
    enableOpt: {
      default: function() {
        return false
      }
    },
    retain: {
      default: function() {
        return false
      }
    },
    isRootNode: {
      type: Boolean,
      default: false
    },
    showPb20: {
      default: true
    },
    employeeCode:{
      type: String,
      default:"",
    }

  },
  data() {
    return {
      total: 0,
      dicttypeid: 'sys_party_types',
      objectType: [],
      type: '',
      loading: false,
      dialogVisible: false,
      columns: [],
    }
  },
  watch: {
    params: { deep: true,
      handler: function(value) {
        if (value) {
          this.search()
        }
      }
    },
    dicts: {
      immediate: true,
      handler(val) {
        if (val) {
          const objectType = this.dicts[this.dicttypeid] || []
          this.objectType = objectType.filter((item) => {
            if (item.code == 'position') {
              return item
            }
          })
          if (this.objectType.length > 0) {
            const dictType = {}
            this.objectType.forEach((item) => {
              dictType[item.code] = item.name
            })
            this.dictType = dictType
            this.type = this.objectType[0].code
          }
        }
      },

    },
    type: {
      immediate: true,
      handler(val) {
        if (val) {
          this.typeObject = this.objectType.filter((item) => {
            if (item.code == val) {
              return [item]
            }
          })
        }
      },
    },
    innerVisible: {
      handler: function(val) {
        if (!val) {
          this.query =
            {
              limit: 10,
              offset: 1,
            }
        }
      }
    },
    orgData: {
      handler: function(value) {
        if (this.clearable) {
          if (value) {
            this.search()
          } else {
            this.gridData = []
          }
        }
      }
    },
    isRootNode: {
      handler(val) {
        if (val) {
          this.columns = [
            { label: '编号', prop: 'code', scope: 'code' },
            { label: '名称', prop: 'name', scope: 'name' },
            { label: '所属机构', prop: 'orgName', scope: 'orgName' },
            { label: '操作', scope: 'action', width: 150 },
          ]
        } else {
          this.columns = [
            { label: '编号', prop: 'code', scope: 'code' },
            { label: '名称', prop: 'name', scope: 'name' },
            { label: '操作', scope: 'action', width: 150 },
          ]
        }
      },
      immediate: true,
    }

  },
  computed: { ...mapGetters(['dicts'])
  },
  mounted() {
    this.loadDict()
    this.search()
  },
  methods: {
    resetQuery() {
      this.query = { limit: 10, offset: 1 }
      this.search()
    },
    async loadDict() {
      if (!this.dicttypeid) {
        return
      }
      if (!this.dicts.hasOwnProperty(this.dicttypeid)) {
        this.$store.commit('ADD_DICT', { key: this.dicttypeid, value: null })
        const resp = await this.dispatch(
          DictTypeController.queryDictTypesByCriteria,
          {
            code: this.dicttypeid,
            tenantId: this.currentTenant,
          }
        )
        if (!resp.error) {
          this.$store.commit('ADD_DICT', {
            key: this.dicttypeid,
            value: resp.data.data.length ? resp.data.data[0].dictEntrys : [],
          })
        }
      }
    },
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
    // 添加岗位
    async handleSuccess(arr) {
      let resp
      if (this.addFun) {
        const positionIds = arr.map(i => { return { id: i.id, types: '' } })
        resp = await this.addFun.call(this, { orgId: this.orgData.id, resources: positionIds })
      } else {
        const ids = arr.map(i => { return i.id })
        resp = await this.dispatch(controller[this.apiName.create], {
          ...this.params.create.body, [this.params.create.key]: ids
        })
      }
      if (!resp.error) {
        this.dialogVisible = false
        this.search()
      }
    },
    // 列表 选择改变
    selectChange(selection) {
      this.selectRow = selection
    },
    // 查询岗位
    async searchBody() {
      if (this.queryFun) {
        const resp = await this.queryFun.call(this, { orgId: this.orgData.id, ...this.query })
        // resp.data.data = resp.data.data.map(i=>{return {...i,id:i.resId}})
        return resp
      }
      const payload = { ...this.params.query, ...this.query }
      if (this.isRootNode && this.apiName.query === 'employeeQuery') {
        payload.orgId = -1
      }
      const resp = await this.dispatch(controller[this.apiName.query], payload)
      if (!resp.error && this.params.type === 'obj') {
        const gridList = resp.data.data.map(i => { return { ...i.position, dependentType: i.dependentType, org: i.org, orgName: i.org.name } })
        resp.data.data = gridList
        this.total = resp.data.total
      }

      return resp
    },
    async setMainPost(row) {
      const payload = { ...this.params.query, positionId: row.id, orgId: row.org.id }
      const resp = await this.dispatch(OrgController.switchMainPositionInOrg, {
        ...payload
      })
      this.search()
    },
    async removeBody(row) {
      let resp
      if (this.deleteFun) {
        const arr = { id: row.resId, types: '' }
        resp = await this.deleteFun.call(this, { orgId: this.orgData.id, resources: [arr] })
      } else {
        resp = await this.dispatch(controller[this.apiName.delete], {
          ...this.params.delete.body, orgId: row.org.id, [this.params.delete.key]: [row.id]
        })
      }

      return resp
    },
    // 打开岗位还是组织机构弹窗
    addAction() {
      if (this.isRootNode) {
        this.$refs['orgForm'] && this.$refs['orgForm'].show()
      } else {
        this.openAdd()
      }
    },
    // 添加岗位
    handleChange(row) {
      this.flag = true
      this.params.create.body.orgId = row.id
      this.openAdd()
    }
  },
}
</script>
<style></style>
