<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :title="title"
    append-to-body
    width="800px"
  >
    <el-row>
      <el-col :span="12">
        <div class="selectUser_search">
          <PmSearch :query.sync="queryOrg" defaultProp="name" placeholder="搜索机构名称" @search="getUserDataOrg">
            <template slot="body">
                <el-form-item label="编号" prop="code">
                  <el-input v-model="queryOrg.code" clearable />
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="queryOrg.name" clearable />
                </el-form-item>
            </template>
          </PmSearch>
        </div>
        <div class="block">
          <el-tree
            v-if="showTree"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            ref="treeLeft"
            :load="loadNode"
            lazy
            @check-change="handleCheckChangeLeft"
          >
            <div style="width: 100%" slot-scope="{node, data }">
              <i class="iconfont icon-inquiry-template" />
              {{ handleName(data) }}
            </div>
          </el-tree>
          <el-table
            ref="multipleTable"
            v-else
            v-loading="orgLoading"
            :data="tableDataEmp"
            height="399px"
            :show-header="isMultiple"
            @select="selectionChange"
            @select-all="selectAllChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column label="待选机构">
              <template slot-scope="{row}">
                {{ row.name + ' ( ' +  row.code + ' ) ' }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="right_title p-5">
          <span>{{ rightTitle }}</span>
          <el-button type="plain" class="clean_all fr" @click="cleanAll">清空</el-button>
        </div>
        <div class="block">
          <el-table
            ref="tableRef"
            :data="tableDataSelect"
            :show-header="false"
            height="399px"
            @select="selectionChangeTable"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column label="员工">
              <template slot-scope="{row}">
                {{ row.name + ' ( ' +  row.code + ' ) ' }}
              </template>
            </el-table-column>
            <!-- <el-table-column v-if="showRemove" width="80px">
              <template slot-scope="{row}">
                <el-button type="text" icon="el-icon-delete" @click="removeRow(row)"></el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </div>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="sure">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { SelectionComponentController } from '@controller'
import { BaseVue, Form, List, VueUtil } from '@lib'
import Model from './model'

const queryOrg = {
  code: null,
  name: null
}
export default {
  name: 'select-user',
  mixins: [BaseVue, Form, List, Model],
  props: {
    value: {},
    title: {
      type: String,
      default: '添加人员'
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 模式:'dimension',维度;'rootOrgs'指定机构ids,codes为根;'orgs'指定机构ids,codes平铺;'roles'指定角色ids,codes;'emps'人员ids,codes
    rangeMode: {
      type: Number,
      default: 'dimension'
    },
    // {dimensionCode: 'def_dimension'}
    // {ids: [...]}
    // {codes: [...]}
    rangeData: {
      type: Object,
      default: {dimensionCode: 'def_dimension'}
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
      queryOrg: _.cloneDeep(queryOrg),
      tableDataSelect: [],
      selectedLeft: [],
      disabledTurnLeft: true,
      tableDataDepart: [],
      tableDataEmp: [],
      // 机构搜索显示树还是表格
      showTree: true,
      selectionsOrg: [],
      selectionsDepart: [],
      selectionsDepartLeft: [],
      rootNode: {},
    }
  },
  computed: {
    ...VueUtil(this)
      .select([SelectionComponentController])
      .state(),
    rightTitle() {
      const isMultiple = ' (' + `${this.isMultiple ? '多选' : '单选'}` + ')'
      return '已选机构' + isMultiple
    },
    orgLoading() {
      return this.SelectionComponentController.queryEmployeeForOrg.loading
    },
  },
  watch: {
    // queryOrg: {
    //   deep: true,
    //   immediate: true,
    //   handler(val) {
    //     if (!val.name && !val.code) {
    //       this.showTree = true
    //     }
    //   }
    // },
    dialogVisible: {
      immediate: true,
      handler(val) {
        if (val) {
          this.showTree = true
          this.tableDataSelect = this.isMultiple ? _.cloneDeep(this.value || [])
            : this.value && this.value.id ? [{...this.value}] : []
          // 再次打开弹框，树的数据初始化
          this.refreshNode()
        }
      }
    },
    tableDataSelect: {
      immediate: true,
      deep: true,
      handler(val) {
        val && val.length && this.$nextTick(() => {
          val.forEach(row => {
            this.$refs.tableRef && this.$refs.tableRef.toggleRowSelection(row, true)
          })
        })
      }
    }
  },
  mounted() {
  },
  methods: {
    // 高级查询
    async getUserDataOrg() {
      if (this.queryOrg.name || this.queryOrg.code) {
        this.showTree = false
        // ids根节点
        const ids = this.rootData.map(i => i.id)
        const { name, code } = this.queryOrg
        if (['dimension', 'rootOrgs', 'orgs'].includes(this.rangeMode)) {
          this.tableDataEmp = await this.getEmpByOrgs({
            tenantId: this.tenantId,
            ids,
            name,
            code,
            isFirst: this.rangeMode === 'orgs' ? '1' : '0', // 是否查询子机构
            pageIndex: 0,
            pageSize: -1
          })
        } else if (this.rangeMode === 'roles') {
          this.tableDataEmp = await this.getEmpByRolecode({
            ...this.rangeData,
            name,
            code,
          })
        } else if (this.rangeMode === 'emps') {
          this.tableDataEmp = await this.getEmpByIds({
            ...this.rangeData,
            name,
            code,
          })
        }
      } else {
        this.showTree = true
      }
      this.refreshSelected()
    },
    handleClick(val) {
      if (val.name === 'department') {
        this.$refs.multipleTableDepart.toggleRowSelection()
      } else if (val.name === 'organization' && !this.showTree) {
        this.$refs.multipleTable.toggleRowSelection()
      }
    },
    cleanAll() {
      this.tableDataSelect.splice(0)
      this.refreshSelected()
    },
    handleName(data) {
      let value = ''
      if (data.name) {
        value = data.name + (data.code ? ' ( ' + data.code + ' )' : '')
      } else {
        value = data.name + (data.code ? ' ( ' + data.code + ' )' : '')
      }
      return value
    },
    cancel() {
      this.reset()
      this.$emit('update:dialogVisible', false)
    },
    reset() {
      this.activeName = 'department'
      this.tableDataSelect = []
      this.queryOrg = _.cloneDeep(queryOrg)
    },
    sure() {
      if (this.isMultiple) {
        this.$emit('input', this.tableDataSelect)
      } else {
        this.$emit('input', this.tableDataSelect[0])
      }
      this.cancel()
    },
    handleCheckChangeLeft(data, checked, indeterminate) {
      if (!this.isMultiple) {
        const nodes = this.$refs.treeLeft.getCheckedNodes()
        this.tableDataSelect = _.cloneDeep(nodes)
        if (nodes.length === 2) {
          this.$refs.treeLeft.setCheckedNodes([data])
        }
      } else {
        const nodes = this.$refs.treeLeft.getCheckedNodes()
        this.tableDataSelect = _.cloneDeep(nodes.filter(i => i.type === 'emp'))
      }
    },
    selectionChangeTable (selections, row) {
      this.tableDataSelect.forEach((i, index) => {
        if (i.id === row.id) {
          this.tableDataSelect.splice(index, 1)
        }
      })
      this.refreshSelected()
    },
    // 刷新左边选中
    refreshSelected() {
      this.$nextTick(() => {
        if (this.showTree) {
          this.$refs.treeLeft.setCheckedNodes(this.tableDataSelect)
        } else {
          this.tableDataEmp.forEach(i => {
            if (this.tableDataSelect.some(j => j.id === i.id)) {
              this.$refs.multipleTable.toggleRowSelection(i, true)
            } else {
              this.$refs.multipleTable.toggleRowSelection(i, false)
            }
          })
        }
      })
    },
    // 根据根节点ids查询员工
    async getUsersByOrgid(ids) {
      const resp = await this.dispatch(SelectionComponentController.queryEmployees, {
        orgIds: ids
      })
      if (!resp.error) {
        return resp.data
      }
    },
    removeAllUsers() {
      this.$set(this, 'tableDataSelect', [])
      this.disabledTurnLeft = true
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
      const { data } = node
      const parentId = data && data.id
      let nodes = []
      if (node.level === 0) {
        // this.rootNode = node
        let data = []
        if (this.rangeMode === 'dimension') {
          data = await this.getOrgs({
            ...this.rangeData,
            tenantId: this.tenantId
          })
        } else if (['orgs', 'rootOrgs'].includes(this.rangeMode)) {
          data = await this.getOrgsByIds({
            ...this.rangeData,
            // isFirst: this.rangeMode === 'orgs' ? '1' : '0',
            tenantId: this.tenantId
          })
        } else if (this.rangeMode === 'roles') {
          data = await this.getRolesByIds({
            ...this.rangeData
          })
        } else if (this.rangeMode === 'emps') {
          data = await this.getEmpByIds({
            ...this.rangeData
          })
        }
        nodes = data.map(i => {
          if (this.rangeMode === 'emps') {
            return {
              ...i,
              leaf: true
            }
          } else {
            return i
          }
        })
        this.rootData = _.cloneDeep(nodes)
      } else {
        let data = []
        if (['dimension', 'rootOrgs'].includes(this.rangeMode)) {
          const data1 = await this.getSonOrgs(parentId)
          const data2 = await this.getSonEmp(parentId)
          data = data1.concat(data2)
        } else if (this.rangeMode === 'orgs') {
          data = await this.getSonEmp(parentId)
        } else if (this.rangeMode === 'roles') {
          data = await this.getEmpByRolecode({
            roleIds: [parentId]
          })
        }
        nodes = data.map(i => {
          return {
            ...i,
            leaf: i.type === 'emp'
          }
        })
      }
      nodes = nodes.map(i => {
        return {
          ...i,
          disabled: ['org', 'role'].includes(i.type)
        }
      })
      if (this.isMultiple && node.data && node.data.type === 'org'&& nodes.some(i => i.type === 'emp')) {
        this.$set(node.data, 'disabled', false)
      }
      this.$nextTick(() => {
        this.$refs.treeLeft.setCheckedNodes(this.tableDataSelect || [])
      })
      return resolve(nodes)
    },
    selectionChangeOrg(selections) {
      this.tableDataSelect = selections
      if (this.showTree) {
        this.$refs.treeLeft.setCheckedNodes(this.tableDataSelect)
      } else {
        if (!selections.length) {
          this.$refs.multipleTable.clearSelection()
        } else {
          const data = this.tableDataEmp.filter(i => selections.every(j => j.id !== i.id))
          this.$refs.multipleTable.toggleRowSelection(data[0], false)
        }
      }
    },
    // 左边表格
    selectionChange (selections, row) {
      if (this.isMultiple) {
        // 多选不能直接赋值，得判断是否已选中
        if (selections.some(i => i.id === row.id) && this.tableDataSelect.every(i => i.id !== row.id)) {
          this.tableDataSelect.push(row)
        } else {
          const index = _.indexOf(this.tableDataSelect.map(i => i.id), row.id)
          this.tableDataSelect.splice(index, 1)
        }
      } else {
        this.tableDataSelect = selections.filter(i => i.id === row.id)
        if (selections.length > 1) {
          selections.forEach(i => {
            if (i.id !== row.id) {
              this.$refs.multipleTable.toggleRowSelection(i, false)
            }
          })
        }
      }
    },
    selectAllChange(selection) {
      if (selection.length) {
        selection.forEach(i => {
          if(this.tableDataSelect.every(j => j.id !== i.id)) {
            this.tableDataSelect.push(i)
          }
        })
      } else {
        this.tableDataEmp.forEach(i => {
          if(this.tableDataSelect.some(j => j.id === i.id)) {
            const index = this.tableDataSelect.map(i => i.id).indexOf(i.id)
            this.tableDataSelect.splice(index, 1)
          }
        })
      }
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
      padding-right: 10px;
      height: 35px;
      line-height: 28px;
      .clean_all {
        margin-top: -2px;
      }
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

  ::v-deep .el-input--mini .el-input__inner {
  height: 35px;
}
</style>
