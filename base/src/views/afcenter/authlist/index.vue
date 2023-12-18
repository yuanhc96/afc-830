<template>
  <div>
    <div class="pl-20  pt-10 pr-20  pb-20">
      <div class="search-button table-tool-bar">
        <search-remoteButton
          class="fl mt-5"
          style="width:300px"
          :value.sync="query.searchValue"
          :loading="loading"
          :placeholder="'请输入' + dictType[type] + searchName"
          :options="options"
          @remoteMethod="remoteMethod"
          @openDetail="openDetail"
          @handleChange="handleChange"
        />
      </div>
      <el-tabs v-model="activeName" class="pm-switch">
        <el-tab-pane label="列表" name="table">
          <el-table
            :id="tableId"
            class="mt-10"
            :highlight-current-row="true"
            :height="autoTableHeight"
            border
            stripe
            :data="gridList"
            @selection-change="selectionChange"
          >
            <el-table-column label="角色编号" prop="code" show-overflow-tooltip />

            <el-table-column label="角色名称" prop="name" show-overflow-tooltip />
            <el-table-column
              label="资源权限数量"
              prop="resAmount"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-link @click="openEdit(scope.row)">{{
                  scope.row.resAmount
                }}</el-link>
              </template>
            </el-table-column>
            <el-table-column
              label="所属参与者"
              prop="partyName"
            >
              <template slot-scope="scope">
                <span>{{ handlePartyName(scope.row.partyName) }}</span>
              </template>
            </el-table-column>
          </el-table>
          <Pagination
            :page-size="query.limit"
            :current-page.sync="query.offset"
            :total="gridTotal"
            @size-change="changePageSizer"
            @current-change="changePage"
          />
        </el-tab-pane>
        <el-tab-pane label="视图" name="chart">
          <ViewChart
            :view-data="viewData"
            :current-data="{type:type, partyId, searchValue:query.searchValue, searchCode}"
            :dict-type="dictType"
            :active-name="activeName"
          />
        </el-tab-pane>
      </el-tabs>

      <SelectTypes
        v-if="dialogVisibleShow"
        :active-name.sync="type"
        :dialog-visible.sync="dialogVisibleShow"
        title="选择账号"
        :is-multiple="false"
        :party-types="objectType"
        :form.sync="form"
        @sure="selectUser"
      />
      <Detail
        v-if="dialogVisible"
        :row.sync="selectRow"
        :dialog-visible.sync="dialogVisible"
        title="查看详情"
        @cancel="cancel"
      />
    </div>
  </div>
</template>

<script>
import {
  AuthManagerController,
  DictTypeController,
  OrgController, PositionController, SelectionComponentController, WorkGroupController
} from '@controller'
import { BaseVue, List, _ } from '@lib'
import { mapGetters } from 'vuex'
import Detail from './form.vue'
import ViewChart from './view.vue'
export default {
  components: { Detail, ViewChart },
  mixins: [BaseVue, List],
  props: {},
  data() {
    return {
      tableHeight: 'calc(100vh - 354px)',
      formRef: 'form',
      searchValue: '',
      searchCode: '',
      dialogVisibleShow: false,
      query: {
        searchValue: ''
      },
      type: 'user',
      typeObject: {},
      options: [],
      objectType: [],
      dictType: {},
      dicttypeid: 'sys_party_types',
      code: 'user',
      partyId: '',
      searchLoading: false,
      activeName: 'table',
      viewData: [],
      searchName: ''
    }
  },
  watch: {
    dicts: {
      immediate: true,
      handler(val) {
        if (val) {
          const objectType = this.dicts[this.dicttypeid].filter(item => item.code !== 'role_app') || []
          this.objectType = objectType
          if (objectType.length > 0) {
            const dictType = {}
            objectType.forEach((item) => {
              dictType[item.code] = item.name
            })
            this.dictType = dictType
            this.dictType.role = '角色'
            this.type = this.objectType[0].code
            this.searchName = this.type === 'user' ? '编号' : '名称'
          }
        }
      },
    },
    'type': {
      immediate: true,
      handler(val) {
        if (val) {
          this.typeObject = this.objectType.filter((item) => {
            if (item.code === val) {
              return [item]
            }
          })
          this.searchName = val === 'user' ? '编号' : '名称'
        }
      },
    },
  },
  computed: {
    ...mapGetters(['dicts']),
  },
  mounted() {
    this.loadDict()
  },
  methods: {
    async searchBody() {
      if (!this.query.searchValue && !this.partyId) {
        this.$msg.warning(`请输入${this.dictType[this.type]}${this.searchName}！`)
        return
      }
      // 根据用户，查询权限
      const query = _.cloneDeep(this.query)
      const paload = { partyType: this.type, partyId: this.partyId, ...query, roleType: 'platform', lazy: true }
      const resp = await this.dispatch(
        AuthManagerController.queryRolesByPartyWithPage,
        paload
      )
      this.searchLoading = false
      if (!resp.error) {
        this.gridData = resp.data
      }
      this.searchView()
    },
    async searchView() {
      let query = _.cloneDeep(this.query)
      query = {
        pageSize: -1,
        pageIndex: -1
      }
      const paload = { partyType: this.type, partyId: this.partyId, ...query, roleType: 'platform', lazy: true }
      const resp = await this.dispatch(
        AuthManagerController.queryRolesByPartyWithPage,
        paload
      )
      this.searchLoading = false
      if (!resp.error) {
        this.viewData = resp.data
      }
    },

    async remoteMethod(query) {
      if (query !== '') {
        const paload = {
          pageIndex: 0,
          pageSize: -1,
          name: query,
        }
        let resp = {}
        if (this.type === 'org') {
          resp = await this.dispatch(OrgController.queryOrgsByCriteria, paload)
        } else if (this.type === 'user') {
          const queryPayload = {
            pageIndex: 0,
            pageSize: -1,
            code: query
          }
          resp = await this.dispatch(SelectionComponentController.queryUser, queryPayload)
        } else if (this.type === 'position') {
          resp = await this.dispatch(PositionController.queryPositionsByCriteria, paload)
        } else if (this.type === 'emp') {
          resp = await this.dispatch(SelectionComponentController.queryEmployee, paload)
        } else if (this.type === 'workGroup') {
          resp = await this.dispatch(WorkGroupController.queryWorkGroupsByCriteria, paload)
        }
        if (!resp.error) {
          this.options = resp.data.data || resp.data
          console.log('this.options',this.options)
          if (this.type === 'user' || this.type === 'emp' || this.type === 'position') {
            this.options = this.options.map(item => {
              item.name = item.name + (item.code ? ' ( ' + item.code + ' )' : '')
              return item
            })
          }
        }
      }
    },
    openDetail() {
      if (!this.type && this.type !== 0) {
        this.$msg.warning('请选择搜索对象的类型！')
        return
      }
      this.dialogVisibleShow = true
    },
    selectUser(selectData) {
      this.dialogVisibleShow = false
      if (selectData.length > 0) {
        const value = selectData[0]
        this.type = value.extra.type
        this.query.searchValue = (this.type === 'user' || this.type === 'emp' || this.type === 'position') ? value.name + '(' + value.code + ')' : value.name
        this.searchCode = value.code
        // 刷新列表
        this.partyId = value.id
      }
      this.searchBody()
    },
    cancelAdd() {
      this.dialogVisibleShow = false
    },
    cancel() {
      this.dialogVisible = false
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
    changeTypeSelect(e) {
      const code = this.typeObject.length > 0 ? this.typeObject[0].code : ''
      if (code !== e) {
        this.query.searchValue = ''
        this.options = []
      }
    },
    handleChange(val) {
      if (!val) {
        this.gridData = {
          data: [],
          total: 0
        }
      }else {
        this.partyId = val
        this.searchBody()
      }
    },
    // 查询
    async selectClick() {
      if (!this.query.searchValue && !this.partyId) {
        this.$msg.warning(`请输入${this.dictType[this.type]}${this.searchName}！`)
        return
      }
      this.searchLoading = true
      this.query.offset = 1
      await this.searchBody('all')
    },
    // 重置
    resetClick() {
      this.type = this.objectType[0].code
      this.gridData = undefined
      this.viewData = undefined
      this.query = {
        limit: 10,
        offset: 1,
        searchValue: '',
      }
    },
    handlePartyName(numString) {
      let theString = ''
      if (numString.length > 0) {
        const dictType = this.dictType
        theString = numString.replace(/\((.*?)\)/g, function(numString, i) {
          return `(${dictType[i]})`
        })
      }
      return theString
    }
  },
}
</script>

<style lang='scss' scoped>

.bar {
  margin-bottom: 10px !important;
}
.title {
  line-height: 45px;
  font-size: 14px;
  border-bottom: 1px solid #ebebeb;
  font-weight: bold;
}
.form{
  ::v-deep .el-input__suffix{
    padding: 0 6px;
  }

  .clearfix {
    margin-top: 10px;
  }
}
::v-deep .treeBtn {
  border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
  // border-left: 0px !important;
  border-left-color: transparent !important;
  height: 28px !important;
}

.container {
  position: relative;
  padding: 20px 0;
  .btn-area {
    text-align: right;
  }
}

::v-deep .pm-switch .el-tabs__nav{
    width:145px;
 }

 .search-button {
    position: fixed;
    top: 60px;
    right: 20px;
    z-index:99;
  }

</style>
