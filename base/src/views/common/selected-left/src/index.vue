<template>
  <div :class="{'is_dialog': !isDialog, 'isHeight': !isDialogHeight}">
    <div class="selectUser_search">
      <PmSearch :query.sync="query" defaultProp="name" placeholder="搜索名称" @search="pmSearch">
        <template slot="body">
            <el-form-item label="编号" prop="code">
              <el-input v-model="query.code" clearable />
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input v-model="query.name" clearable />
            </el-form-item>
        </template>
      </PmSearch>
    </div>
    <div class="block left_block">
      <el-tree
        v-show="showTree"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        ref="treeLeft"
        :load="loadNode"
        :check-strictly="isOrgType || !isMultiple"
        lazy
        @check-change="handleCheckChangeLeft"
      >
        <div style="width: 100%" slot-scope="{node, data }">
          <svg-icon v-if="data.type === 'emp'" class="svgicon" icon-class="user-tree" />
          <svg-icon v-else-if="data.type === 'role'" class="svgicon" icon-class="role-tree" />
          <svg-icon v-else class="svgicon" icon-class="org-tree" />
          {{ data.name + (data.code ? ' ( ' + data.code + ' )' : '') }}
        </div>
      </el-tree>
      <div v-show="!showTree" class="role-type">
        <el-table
          ref="multipleTable"
          :class="isMultiple?'':'section'"
          :data="gridList"
          :show-header="false"
          :height="tableHeight"
          @select="selectionChange"
          @select-all="selectAll">
            <el-table-column type="selection" width="55"/>
            <el-table-column :label="types[activeName]+'名称'" show-overflow-tooltip>
              <template slot-scope="{row}">
                {{ row.name + ' ( ' +  row.code + ' )' }}
              </template>
            </el-table-column>
        </el-table>
        <el-pagination
          v-if="isRoleType"
          class="pagination"
          background
          @size-change="changePageSizer"
          @current-change="changePage"
          :current-page.sync="query.offset"
          :page-size="query.limit"
          layout="total,prev, pager,next, sizes"
          :page-sizes="[10, 20, 30, 40, 50]"
          :total="gridTotal">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { BaseVue, Form, List } from '@lib'
import { SelectionComponentController } from '@controller'
import Model from './model.js'

const query = {
  name: null,
  code: null,
  limit: 10,
  offset: 1
}
export default {
  name: 'select-user',
  components: {},
  mixins: [BaseVue, Form, List, Model],
  props: {
    value: {
      type: Array,
      default: []
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    tenantId: {
      type: String,
      default: null
    },
    // 模式:'dimension',维度;'rootOrgs'指定机构ids,codes为根;'orgs'指定机构ids,codes平铺
    // 模式:同机构--'dimension',维度;'rootOrgs'指定机构ids,codes为根;'orgs'指定机构ids,codes平铺;'roles'指定角色ids,codes;'emps'人员ids,codes
    // 模式:'roles',指定角色ids,codes;rangeData,不传参，当前所有的
    rangeMode: {
      required: true,
      type: Object,
      default: {
        emp: 'dimension',
        org: 'dimension',
        role: 'roles'
      }
    },
    // {dimensionCode: 'def_dimension'}
    // {ids: [...]}
    // {codes: [...]}
    rangeData: {
      required: true,
      type: Object,
      default: {
        emp: { dimensionCode: 'def_dimension' },
        org: { dimensionCode: 'def_dimension' },
        role: null
      }
    },
    // 当前选择类型
    currentType: {
      type: String,
      default: 'emp'
    },
    activeName: {
      type: String,
      default: 'emp'
    },
    // 样式调整，针对非弹框的
    isDialog: {
      type: Boolean,
      default: true
    },
    isDialogHeight: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      rootData: [],
      defaultProps: {
        label: 'name',
        children: 'children',
        isLeaf: 'isLeaf'
      },
      query: _.cloneDeep(query),
      // 机构搜索显示树还是表格
      showTree: true,
      selectionsOrg: [],
      selectionsDepart: [],
      selectionsDepartLeft: [],
      rootNode: {},
    }
  },
  computed: {
    isRoleType() {
      return this.currentType === 'role'
    },
    isOrgType() {
      return this.currentType === 'org'
    },
    isEmpType() {
      return this.currentType === 'emp'
    },
    tableHeight() {
      let height = '299px'
      if (!this.isDialogHeight) {
        height = this.isRoleType ? '249px': '299px'
      } else {
        height = this.isRoleType ? '349px': '399px'
      }
      return height
    }
  },
  watch: {
    query: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val.name && !val.code) {
          this.showTree = !this.isRoleType
          this.toggleRowSelection()
        }
      }
    },
    gridList: {
      immediate: true,
      handler() {
        this.toggleRowSelection()
      }
    }
  },
  mounted() {
    if (this.isRoleType) {
      this.search()
    }
  },
  methods: {
    async searchBody() {
      const mode = this.rangeMode[this.currentType]
      const rangeData = this.rangeData[this.currentType] || {}
      if (this.isRoleType) {
        const options = {
          ...((rangeData.ids || rangeData.codes) ?  rangeData : {}),
          ...this.query,
          tenantId: this.tenantId
        }
        const resp = await this.getRolesByIds(options)
        this.gridData = resp.data
      } else if (this.query.name || this.query.code) {
        // rootData,根据根节点查询机构或人员
        this.showTree = false
        const ids = this.rootData.map(i => i.id)
        const { name, code } = this.query
        if (this.isOrgType) {
          this.gridData = await this.getOrgsByIds({
            tenantId: this.tenantId,
            ids,
            name,
            code,
            isFirst: mode === 'orgs' ? '1' : '0' // 是否查询子机构
          })
        } else if (this.isEmpType){
          if (_.includes(['dimension', 'rootOrgs', 'orgs'], mode)) {
            const resp = await this.getEmpByOrgs({
              tenantId: this.tenantId,
              orgIds: ids,
              name,
              code,
              isFirst: mode === 'orgs' ? '1' : '0',
              pageIndex: 0,
              pageSize: -1,
            })
            this.gridData = resp.data
          } else if (mode === 'roles'){
            // 根据角色ids,员工name,code 查询员工,
            this.gridData = await this.getEmpByRolecode({
              tenantId: this.tenantId,
              roleIds: ids,
              name,
              code
            })
          } else if (mode === 'emps') {
            // 员工IDs
            this.gridData = await this.getEmpByIds({
              tenantId: this.tenantId,
              ...rangeData,
              name,
              code
            })
          }
        }
      } else {
        this.showTree = !this.isRoleType
      }
    },
    reset() {
      this.query = _.cloneDeep(query)
    },
    async handleCheckChangeLeft(data, checked, indeterminate) {
      if (!this.isMultiple) {
        let nodes = _.cloneDeep(this.value)
        if (checked) {
          nodes = [data]
        } else {
          if (data.type === this.currentType) {
            nodes = []
          }
        }
        this.$emit('input', nodes)
        if (nodes.length === 2) {
          this.$refs.treeLeft.setCheckedNodes([data])
        }
      } else {
        let tableDataSelect = _.cloneDeep(this.value)
        const getselected = async () => {
          let datas = []
          // 单拎出--员工多选时，选中org或role
          if (data.type !== this.currentType) {
            let node = this.$refs.treeLeft.getNode(data.id)
            node.expand()
            if (data.type === 'org') {
              const resp = await this.getEmpByOrgs({
                tenantId: this.tenantId,
                orgIds: [data.id],
                isFirst: '1',
                pageIndex: 0,
                pageSize: -1,
              })
              datas = resp.data
            } else if (data.type === 'role') {
              datas = await this.getEmpByRolecode({
                tenantId: this.tenantId,
                roleIds: [data.id]
              })
            }
          } else {
            datas.push(data)
          }
          return datas
        }
        if (checked) {
          const datas = await getselected()
          if (tableDataSelect.length) {
            datas.forEach(i => {
              if (tableDataSelect.every(j => j.id !== i.id || j.type !== i.type)) {
                tableDataSelect.unshift(i)
              }
            })
          } else if (datas.length){
            tableDataSelect = _.cloneDeep(datas)
          }
        } else if (!indeterminate) {
          const datas = await getselected()
          datas.forEach(i => {
            tableDataSelect.forEach((j, index) => {
              if (j.id === i.id && j.type === i.type) {
                tableDataSelect.splice(index, 1)
              }
            })
          })
        }
        this.$emit('input', tableDataSelect)
      }
    },
    toggleRowSelection() {
      const tableDataSelect = this.value.filter(i => i.type === this.currentType)
      this.$nextTick(() => {
        if (this.showTree) {
          this.$refs.treeLeft.setCheckedNodes(tableDataSelect)
        } else {
          this.$refs.multipleTable.clearSelection()
          tableDataSelect.forEach(i => {
            this.gridList.forEach(j => {
              if (i.id === j.id && i.type === j.type) {
                this.$refs.multipleTable.toggleRowSelection(j, true)
              }
            })
          })
        }
      })
    },
    // async addAllUsers() {
    //   // 当前页面能看到的全部
    //   let tableDataSelect = []
    //   if (this.currentType === 'org') {
    //     // 查询跟节点对应的员工
    //     let users = []
    //     if (this.showTree) {
    //       const ids = this.rootData.map(item => item.id)
    //       users = ids.length ? await this.getUsersByOrgid(ids) : []
    //       // this.$refs.treeLeft.setCheckedKeys([])
    //     } else {
    //       users = _.cloneDeep(this.gridList)
    //     }
    //     tableDataSelect = tableDataSelect.concat(users)
    //   }
    //   this.delRepeat(tableDataSelect, true)
    // },
    // 根据根节点ids查询员工
    async getUsersByOrgid(ids) {
      const resp = await this.dispatch(SelectionComponentController.queryEmployees, {
        tenantId: this.tenantId,
        orgIds: ids
      })
      if (!resp.error) {
        return resp.data
      }
    },
    // 刷新根节点
    async refreshNode() {
      if (this.rootNode.childNodes && this.rootNode.childNodes.length) {
        if (this.rootNode.data && this.rootNode.data.length) {
          this.$set(this.rootNode, 'data', [])
        }
        this.$set(this.rootNode, 'loaded', false)
        await this.rootNode.loadData()
      }
    },
    async loadNode(node, resolve) {
      if (this.isRoleType) {
        return resolve([])
      }
      const mode = this.rangeMode[this.currentType]
      const rangeData = this.rangeData[this.currentType]
      const { data } = node
      let nodes = []
      if (node.level === 0) {
        // 第一级的模式dimension,rootOrgs,orgs都是查机构
        if (mode === 'dimension') {
          nodes = await this.getOrgs({
            ...rangeData,
            tenantId: this.tenantId
          })
        } else if (mode === 'rootOrgs' || mode === 'orgs') {
          nodes = await this.getOrgsByIds({
            ...rangeData,
            tenantId: this.tenantId
          })
        } else if (mode === 'roles') {
          const options = {
            ...((rangeData.ids || rangeData.codes) ?  rangeData : {}),
            tenantId: this.tenantId,
            pageIndex: 0,
            pageSize: -1
          }
          const { data } = await this.getRolesByIds(options)
          nodes = data.data
        } else if (mode === 'emps') {
          nodes = await this.getEmpByIds({
            ...rangeData,
            tenantId: this.tenantId
          })
        }
        this.rootNode = node
        // 方便后续高级搜索接口调用
        this.rootData = nodes
      } else {
        if (mode === 'dimension' || mode === 'rootOrgs') {
          // 机构
          let nodesOrg = await this.getSonOrgs(data.id)
          let nodesEmps = []
          if (this.isEmpType) {
            nodesEmps = await this.getSonEmp(data.id)
          }
          nodes = nodesOrg.concat(nodesEmps)
        } else if (mode === 'orgs') {
          nodes = await this.getSonEmp(data.id)
        } else if (mode === 'roles') {
          nodes = await this.getEmpByRolecode({
            tenantId: this.tenantId,
            roleIds: [data.id]
          })
        }
      }
      nodes = nodes.map(i => {
        return {
          type: 'org',
          ...i,
          // 员工时单选，类型不为员工
          // 员工时多选，机构没有展开，或者子节点没有员工时
          disabled: i.type !== 'emp' && !this.isMultiple && this.isEmpType
           || this.isMultiple && this.isEmpType && i.type === 'org',
          isLeaf: i.type === 'emp' || this.isOrgType && mode === 'orgs'
        }
      })
      if (this.isMultiple && this.isEmpType && node.data && node.data.type === 'org'&& nodes.some(i => i.type === 'emp')) {
          this.$set(node.data, 'disabled', false)
        }
      let selection = this.$refs.treeLeft && this.$refs.treeLeft.getCheckedNodes() || []
      selection = selection.concat(this.value.filter(i => i.type === this.currentType))
      this.$nextTick(() => {
        this.$refs.treeLeft.setCheckedNodes(selection)
      })
      return resolve(nodes)
    },
    // 表格
    selectionChange(selections, row) {
      let tableDataSelect = _.cloneDeep(this.value)
      if (this.isMultiple) {
        if (selections.some(i => i.id === row.id) && tableDataSelect.every(i => i.id !== row.id || i.type !== row.type)) {
          tableDataSelect.unshift(row)
        } else {
          let index = -1
          tableDataSelect.forEach((i, j) => {
            if (i.id === row.id && i.type === row.type) {
              index = j
            }
          })
          index !== -1 && tableDataSelect.splice(index, 1)
        }
      } else {
        tableDataSelect = selections.filter(i => i.id === row.id && i.type === row.type)
        if (selections.length > 1) {
          selections.forEach(i => {
            if (i.id !== row.id) {
              this.$refs.multipleTable.toggleRowSelection(i, false)
            }
          })
        }
      }
      this.$emit('input', tableDataSelect)
    },
  }
}
</script>
<style lang="scss" scoped>
  .el-row {
    height: 420px;
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
      height: 28px;
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
  .pagination{
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: right;
    border: none !important;
    overflow-y: hidden;
  }
  ::v-deep .el-pager {
    max-width: 82px;
    overflow-x: auto;
    overflow-y: hidden;
    &::-webkit-scrollbar {
      height: 3px;
    }
  }
  .svgicon{
    width: 17px;
    height: 17px;
    margin-right: 7px;
  }
  i.el-icon-user {
    font-size: 16px;
  }

  .is_dialog {
    .block {
      height: 300px;
      overflow: auto;
      border: 1px solid #ddd;
      border-top: none;
      border-left: none;
      border-bottom: none;
    }
  }
  .isHeight {
    .block {
      height: 300px;
    }
  }
  ::v-deep .el-input-group__append, ::v-deep .el-input-group__prepend {
    border-radius: 0;
  }
  ::v-deep input.el-input__inner {
    border-radius: 0;
  }
  
</style>