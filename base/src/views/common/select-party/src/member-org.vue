<template>
  <el-row :gutter="10">
    <el-col :span="11">
      <div class="selectUser_search">
        <PmSearch ref="searchForm" :query.sync="queryOrg" default-prop="name" :placeholder="'搜索'+ searchLabel" @search="getData">
          <template slot="body">
            <el-form-item :label="searchLabel" prop="name">
              <el-input v-model.trim="queryOrg.name" clearable @keypress.native.enter="searchEnter" />
            </el-form-item>
            <el-form-item :label="dictType[this.type]+'编号'" prop="code">
              <el-input v-model.trim="queryOrg.code" clearable @keypress.native.enter="searchEnter" />
            </el-form-item>
          </template>
        </PmSearch>
      </div>
      <div v-if="showTreeOrg" class="block">
        <el-tree
          ref="treeLeft"
          v-loading="loading"
          :props="defaultProps"
          show-checkbox
          node-key="id"
          :load="loadNode"
          lazy
          :check-strictly="type==='org'||((type=='position')&&isMultiple==false)"
          @check-change="handleCheckChangeLeft"
        >
          <div v-if="type==='user'||type==='emp'" slot-scope="{node, data }" style="width: 100%">
            <template v-if="data.type === 'org'">
              <i class="iconfont icon-inquiry-template" />
              {{ data.name }}
            </template>
            <template v-else>
              <i class="el-icon-user" />
              {{ handleName(data) }}
            </template>
          </div>
          <div v-else-if="type==='position'" slot-scope="{node, data }" style="width: 100%">
            <template v-if="data.type === 'position'">
              <i class="iconfont icon-inquiry-template" />
              {{ data.name }}
            </template>
            <template v-else>
              <i class="el-icon-user" />
              {{ handleName(data) }}
            </template>
          </div>
          <div v-else slot-scope="{node, data }" style="width: 100%">
            <i class="iconfont icon-inquiry-template" />
            {{ data.name }}
          </div>
        </el-tree>
      </div>
      <div v-else class="block">
        <select-table
          ref="multipleTable"
          :height="type!='org'? 349 : 399"
          :loading="selectLoading"
          :table-data="tableDataOrg"
          :selected-rows.sync="tableDataSelect"
          @change="selectionChange"
        >
          <template v-if="type!='org'" slot="pagination">
            <el-pagination
              class="pagination"
              background
              :current-page.sync="queryOrg.offset"
              :page-size="queryOrg.limit"
              :page-sizes="[10, 20, 30, 40, 50]"
              layout="total,prev, pager,next, sizes"
              :total="gridTotal"
              @size-change="changePageSizer"
              @current-change="changePage"
            />
          </template>
        </select-table>
      </div>
    </el-col>
    <el-col :span="2" class="move_btns">
      <div>
        <!-- <el-button type="primary" :disabled="disabledTurnRightOrg" icon="el-icon-arrow-right" circle @click="addUsers"></el-button>
            <el-button type="primary" :disabled="disabledTurnLeftOrg" icon="el-icon-arrow-left" circle @click="removeUsers"></el-button> -->
        <el-button v-if="isMultiple && type!='user'&&type!='emp'" type="primary" icon="el-icon-d-arrow-right" circle @click="addAllUsers" />
        <el-button type="primary" icon="el-icon-d-arrow-left" circle @click="removeAllUsers" />
      </div>
    </el-col>
    <el-col :span="11">
      <div class="right_title p-5">
        <span>{{ rightTitle }}</span>
      </div>
      <div class="block">
        <select-table
          :table-data="tableDataSelect"
          :show-select="false"
          :show-remove="true"
          :show-icon="type=='user'||type=='emp'"
          @change="selectionChangeOrg"
        />
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { OrgController, PositionController, SelectionComponentController } from '@controller'
import { BaseVue, VueUtil } from '@lib'
import SelectTable from './select-table.vue'
export default {
  name: 'member-org',
  components: { SelectTable },
  mixins: [BaseVue],
  props: {
    positionSearch: {},
    value: {},
    title: {
      type: String,
      default: '选择成员'
    },
    isMultiple: {
      type: Boolean,
      default: true
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String
    },
    dictType: {
      type: Object,
      default: {}
    },
    flag: {
      type: Boolean,
      default: true // 是否查询初始化管理员用户和员工 默认是
    }
  },
  data() {
    return {
      rootData: [],
      defaultProps: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      },
      queryOrg: {
        code: null,
        name: null,
        limit: 10,
        offset: 0
      },
      tableDataSelect: [], // 右边表格
      selectedLeft: [],
      selectedRight: [],
      tableDataOrg: [], // 右边表格选中
      selections: [],
      selectionsOrg: [],
      // 机构搜索显示树还是表格
      showTreeOrg: true,
      gridData: {}
    }
  },
  computed: {
    ...VueUtil(this)
      .select([OrgController, PositionController, SelectionComponentController])
      .state(),
    rightTitle() {
      const isMultiple = ' (' + `${this.isMultiple ? '多选' : '单选'}` + ')'
      return '已选' + this.dictType[this.type] + isMultiple
    },
    disabledTurnLeftOrg() {
      return !this.selectionsOrg.length
    },
    disabledTurnRightOrg() {
      return !this.selections.length
    },
    selectLoading() {
      if (this.type === 'org') {
        return this.OrgController.queryOrgsByCriteria.loading
      } else if (this.type === 'position') {
        return this.OrgController.queryPositionsToTree.loading
      } else if (this.type === 'emp') {
        return this.SelectionComponentController.queryEmployee.loading
      } else if (this.type === 'user') {
        return this.SelectionComponentController.queryUser.loading
      }
    },
    loading() {
      if (this.type === 'org') {
        return this.SelectionComponentController.queryOrg.loading
      } else if (this.type === 'position') {
        return this.PositionController.queryPositionTypes.loading
      } else if (this.type === 'emp') {
        return this.SelectionComponentController.queryOrg.loading
      } else if (this.type === 'user') {
        return this.SelectionComponentController.queryOrg.loading
      }
    },
    searchLabel() {
      if (this.type === 'emp') {
        return this.dictType[this.type] + '姓名'
      } else {
        return this.dictType[this.type] + '名称'
      }
    },
    gridTotal() {
      if (this.gridData && !_.isArray(this.gridData)) {
        return this.gridData.totalElements || this.gridData.total
      } else return 0
    },
  },
  // watch: {
  //   queryOrg: {
  //     deep: true,
  //     immediate: true,
  //     handler(val) {
  //       if (!val.name && !val.code) {
  //         this.showTreeOrg = true
  //       }else{
  //         this.showTreeOrg = false
  //       }
  //     }
  //   }
  // },
  mounted() {
  },
  methods: {
    searchEnter() {
      if (this.$refs.searchForm) { // 高级搜索 enter
        this.$refs.searchForm.searchQuery = { ...this.query }
        this.$refs.searchForm.initOptions()
        this.$refs.searchForm.visible = false
      }
      this.getData()
    },
    getData() {
      if (this.queryOrg.name || this.queryOrg.code) {
        this.showTreeOrg = false
      } else {
        this.showTreeOrg = true
      }
      if (this.type === 'org') {
        this.getDataOrg()
      } else if (this.type === 'position') {
        this.getDataPosition()
      } else if (this.type === 'emp') {
        this.getDataEmp()
      } else if (this.type === 'user') {
        this.getDataUser()
      }
    },
    async getDataOrg() {
      const payload = { code: this.queryOrg.code, name: this.queryOrg.name }
      const resp = await this.dispatch(OrgController.queryOrgsByCriteria, payload)
      if (!resp.error) {
        this.gridData = resp
        this.tableDataOrg = resp.data
        this.tableDataOrg.map((row, index) => {
          this.tableDataSelect.forEach(item => {
            if (row.id === item.id) {
              this.toggleRowSelection(row)
            }
          })
        })
      }
    },
    toggleRowSelection(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    async getDataPosition() {
      if (this.queryOrg.name || this.queryOrg.code) {
        const resp = await this.dispatch(OrgController.queryPositionsToTree, this.queryOrg)
        if (!resp.error) {
          this.gridData = resp.data
          this.tableDataOrg = resp.data.data
        }
      }
    },
    async getDataEmp() {
      if (this.queryOrg.name || this.queryOrg.code) {
        this.queryOrg.flag = this.flag
        const resp = await this.dispatch(SelectionComponentController.queryEmployee, this.queryOrg)
        if (!resp.error) {
          this.gridData = resp.data
          this.tableDataOrg = resp.data.data
        }
      }
    },
    async getDataUser() {
      if (this.queryOrg.name || this.queryOrg.code) {
        this.queryOrg.flag = this.flag
        const resp = await this.dispatch(SelectionComponentController.queryUser, this.queryOrg)
        if (!resp.error) {
          this.gridData = resp.data
          this.tableDataOrg = resp.data.data
        }
      }
    },
    handleName(data) {
      let value = ''
      if (data.name) {
        value = data.name + (data.code ? ' ( ' + data.code + ' )' : '')
      }
      return value
    },
    async changePageSizer(pageSize) {
      this.queryOrg.pageSize = pageSize
      this.changePage()
    },
    async changePage(index) {
      this.queryOrg = {
        ...this.queryOrg,
        pageIndex: index || 0
      }
      this.getData()
    },
    handleCheckChangeLeft(data, checked, indeterminate) {
      if (!this.isMultiple) {
        const nodes = this.$refs.treeLeft.getCheckedNodes()
        this.turnSingle(nodes, data, 'treeLeft', true)
      } else {
        this.selections = this.$refs.treeLeft.getCheckedNodes()
        if (checked === true) {
          this.addUsers()
        } else if (!indeterminate) {
          this.selectionsOrg = [data]
          this.removeUsers(data)
        }
      }
    },
    turnSingle(selections, row, type, isTree) {
      if (!this.isMultiple) {
        if (selections.length === 2) {
          if (isTree) {
            const tableSelections = selections.filter(item => item.id === row.id)
            this.$refs[type].setCheckedNodes(tableSelections)
          } else {
            const tableSelections = selections.filter(item => item.id !== row.id)
            this.$refs[type].$refs.tableRef.toggleRowSelection(tableSelections[0], false)
          }
          this.tableDataSelect = [row]
        } else {
          this.tableDataSelect = selections
        }
        this.$emit('change', this.tableDataSelect, this.type)
      }
    },

    async addUsers() {
      let tableDataSelect = []
      const nodes = this.selections
      await nodes.forEach(async item => {
        if (item.type === 'position') {
          // 根据机构获取人员
          let users
          if (this.positionSearch) {
            const resp = await this.positionSearch.call(this, { types: item.id })
            users = resp?.data?.data ? resp.data.data : []
          } else {
            users = await this.getUsersByPositionType(item.id)
          }
          tableDataSelect = tableDataSelect.concat(users)
          this.delRepeat(tableDataSelect)
          this.$emit('change', this.tableDataSelect, this.type)
        } else {
          if (this.type === 'emp' || this.type === 'user') {
            if (this.type === 'user') {
              if (item.employee && item.employee.name) {
                item.name = item.employee.name
              }
            }
            if (item.type != 'org') {
              tableDataSelect.push(item)
            }
          } else {
            tableDataSelect.push(item)
          }
          this.delRepeat(tableDataSelect)
          this.$emit('change', this.tableDataSelect, this.type)
        }
      })
      if (this.showTreeOrg) {
        // this.$refs.treeLeft.setCheckedKeys([]) //有时候不管用
        // let node = this.$refs.treeLeft.getNode(this.rootData[0].id).parent;
        // this.setCheckedKeys(node)
      } else {
        this.selections = []
        // this.$refs.multipleTable.$refs.tableRef.clearSelection()
      }
    },
    setCheckedKeys(node) {
      if (node.childNodes && node.childNodes.length > 0) {
        node.childNodes.map(val => {
          val.checked = false
          this.setCheckedKeys(val)
        })
      }
    },
    // 根据根节点ids查询员工
    async getUsersByPositionType(id) {
      const resp = await this.dispatch(OrgController.queryPositionsToTree, {
        types: id
      })
      if (!resp.error) {
        return resp.data.data
      }
    },
    async addAllUsers() {
      let tableDataSelect = []
      // 查询跟节点对应的人员
      if (this.showTreeOrg) {
        if (this.type === 'position') {
          this.rootData.forEach(async item => {
            const resp = await this.dispatch(OrgController.queryPositionsToTree, {
              types: item.id
            })
            tableDataSelect = tableDataSelect.concat(resp.data.data)
            this.delRepeat(tableDataSelect)
            this.$emit('change', this.tableDataSelect, this.type)
          })
          // this.$refs.treeLeft.setCheckedKeys([])
        } else {
          this.delRepeat(_.cloneDeep(this.rootData))
          this.$emit('change', this.tableDataSelect, this.type)
        }
        this.$refs.treeLeft.setCheckedNodes(this.rootData)
      } else {
        tableDataSelect = _.cloneDeep(this.tableDataOrg)
        this.delRepeat(tableDataSelect)
        this.$emit('change', this.tableDataSelect, this.type)
      }
    },
    // 去重
    delRepeat(tableDataSelect) {
      // if(this.tableDataSelect.length>0){
      tableDataSelect.forEach(item => {
        const user = this.tableDataSelect.length > 0 ? this.tableDataSelect.every(tem => tem.id != item.id) : []
        if (user || this.tableDataSelect.length == 0) {
          this.tableDataSelect.push(item)
        }
      })
      // }else{
      //   this.tableDataSelect = tableDataSelect
      // }
    },
    async removeUsers(data) {
      let tableDataSelect = []
      if (data.type === 'position') {
        let users
        if (this.positionSearch) {
          const resp = await this.positionSearch.call(this, { types: data.id })
          users = resp?.data?.data ? resp.data.data : []
        } else {
          users = await this.getUsersByPositionType(data.id)
        }
        tableDataSelect = this.tableDataSelect.filter(i => users.every(j => i.id !== j.id))
      } else {
        const ids = this.selectionsOrg.map(item => item.id)
        tableDataSelect = this.tableDataSelect.filter(item => _.indexOf(ids, (item.id)) === -1)
      }
      this.$emit('change', tableDataSelect, this.type)
      this.$set(this, 'tableDataSelect', tableDataSelect)
    },
    removeAllUsers() {
      this.$set(this, 'tableDataSelect', [])
      this.$emit('change', [], this.type)
      this.$refs.treeLeft.setCheckedKeys([])
    },
    async loadNode(node, resolve) {
      if (this.type === 'org') {
        const { data } = node
        let nodes = []
        if (node.level === 0) {
          const resp = await this.dispatch(SelectionComponentController.queryOrg, this.queryOrg)
          nodes = resp.data.map(item => {
            item.type = 'org'
            return item
          })
          this.rootData = nodes
        } else {
          let nodesOrg = []
          const resp = await this.dispatch(SelectionComponentController.queryChildByParentId, {
            parentId: data.id
          })
          nodesOrg = resp.data.map(item => {
            item.type = 'org'
            return item
          })
          nodes = nodesOrg
        }
        return resolve(nodes)
      } else if (this.type === 'position') {
        const { data } = node
        let nodes = []
        if (node.level === 0) {
          const resp = await this.dispatch(PositionController.queryPositionTypes, this.queryOrg)
          nodes = resp.data.data.map(item => {
            item.type = 'position'
            item.disabled = !this.isMultiple
            return item
          })
          this.rootData = nodes
        } else {
          let nodesOrg
          if (this.positionSearch) {
            nodesOrg = await this.positionSearch.call(this, {
              types: data.id
            })
          } else {
            nodesOrg = await this.dispatch(OrgController.queryPositionsToTree, {
              types: data.id
            })
          }
          nodes = nodesOrg.data.data.map(item => {
            return {
              ...item,
              leaf: true
            }
          })
        }
        return resolve(nodes)
      } else if (this.type === 'user') {
        const { data } = node
        let nodes = []
        if (node.level === 0) {
          const resp = await this.dispatch(SelectionComponentController.queryOrg, this.queryOrg)
          nodes = resp.data.map(item => {
            item.type = 'org'
            item.disabled = !this.isMultiple
            return item
          })
          this.rootData = nodes
        } else {
          let nodesOrg = []
          let nodesUser = []
          const resp1 = await this.dispatch(SelectionComponentController.queryChildByParentId, {
            parentId: data.id
          })
          nodesOrg = resp1.data.map(item => {
            item.type = 'org'
            item.disabled = !this.isMultiple
            return item
          })
          // 人员
          const resp2 = await this.dispatch(OrgController.queryUsersByOrgId, {
            orgId: data.id
          })
          if (!resp2.error) {
            nodesUser = resp2.data.data.map(item => {
              if (item.employee && item.employee.name) {
                item.name = item.employee.name
              }
              item.leaf = true
              return item
            })
          }
          nodes = nodesUser.concat(nodesOrg)
        }
        return resolve(nodes)
      } else if (this.type === 'emp') {
        const { data } = node
        let nodes = []
        if (node.level === 0) {
          const resp = await this.dispatch(SelectionComponentController.queryOrg, this.queryOrg)
          nodes = resp.data.map(item => {
            item.type = 'org'
            item.disabled = !this.isMultiple
            return item
          })
          this.rootData = nodes
        } else {
          let nodesOrg = []
          let nodesUser = []
          const resp1 = await this.dispatch(SelectionComponentController.queryChildByParentId, {
            parentId: data.id
          })
          nodesOrg = resp1.data.map(item => {
            item.type = 'org'
            item.disabled = !this.isMultiple
            return item
          })
          // 人员
          const resp2 = await this.dispatch(OrgController.queryEmployeesInOrg, {
            orgId: data.id
          })
          if (!resp2.error) {
            nodesUser = resp2.data.data.map(item => {
              return {
                ...item,
                leaf: true
              }
            })
          }
          nodes = nodesUser.concat(nodesOrg)
        }
        return resolve(nodes)
      }
    },
    selectionChangeOrg(selections) {
      this.tableDataSelect = selections
      this.$emit('change', selections, this.type)
    },
    selectionChange(selections, row) {
      if (!this.isMultiple) {
        this.selections = [row]
        this.turnSingle(selections, row, 'multipleTable')
      } else {
        this.selections = selections
        this.$emit('change', this.tableDataSelect, this.type)
      }
      // this.addUsers()
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-row {
    height: 420px;
    .selectUser_table {
      .el-row {
        height: 50px;
      }
    }
    .block {
      height: 400px;
      overflow: auto;
      border: 1px solid #ddd;
      border-top: none;
    }
    .right_title {
      border: 1px solid #ddd;
      background: #f5f5f5;
      color: #8f8888;
      padding-left: 10px;
      height: 32px;
    }
    .move_btns {
      margin-top: 170px;
      text-align: center;
      :nth-child(2) {
        margin: 15px 0 0 ;
      }
      :nth-child(3) {
        margin: 40px 0 0 ;
      }
      :nth-child(4) {
        margin: 15px 0 0 ;
      }
    }
  }

.el-tree-node{
  position: relative;
  padding-left: 16px;
}
  .el-tree-node::before {
  border-left: 1px dashed #4386c6;
  bottom: 0px;
  height: 100%;
  top: -20px;
  width: 1px;
}
.el-tree-node::after {
  border-top: 1px dashed #4386c6;
  height: 20px;
  top: 17px;
  width: 24px;
}
.pagination{
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: right;
    border: none !important;
}
::v-deep .el-input--mini .el-input__inner{
  height: 32px;
}
::v-deep .el-tree-node__content{
  height: 32px;
}
</style>

