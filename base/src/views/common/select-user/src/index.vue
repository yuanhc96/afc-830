<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :title="title"
    append-to-body
    width="800px"
  >
    <div>
      <div v-if="activeName==='department'" label="同部门">
        <el-row :gutter="10">
          <el-col :span="11">
            <el-row type="flex">
              <el-col style="width:150px">
                <el-select v-model="activeName" class="select-type" @change="handleClick">
                  <el-option value="department" label="同部门" />
                  <el-option value="organization" label="组织机构" />
                </el-select>
              </el-col>
              <el-col>
                <PmSearch :query.sync="queryDepart" default-prop="name" placeholder="搜索姓名" @search="getUserDataDepart">
                  <template slot="body">
                    <el-form-item label="编号" prop="code">
                      <el-input v-model="queryDepart.code" clearable />
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                      <el-input v-model="queryDepart.name" clearable />
                    </el-form-item>
                  </template>
                </PmSearch>
              </el-col>
            </el-row>
            <div class="block">
              <select-table
                ref="multipleTableDepart"
                :loading="departLoading"
                :table-data="tableDataDepart"
                :selected-rows="tableDataSelect"
                @change="selectionChangeDepartLeft"
              />
            </div>
          </el-col>
          <el-col :span="2">
            <div class="move_btns">
              <div>
                <!-- <el-button type="primary" :disabled="disabledTurnRightDepart" icon="el-icon-arrow-right" circle @click="addUsers"></el-button>
                <el-button type="primary" :disabled="disabledTurnLeftDepart" icon="el-icon-arrow-left" circle @click="removeUsers"></el-button> -->
                <el-button v-if="isMultiple" type="primary" icon="el-icon-d-arrow-right" circle @click="addAllUsers" />
                <el-button type="primary" icon="el-icon-d-arrow-left" circle @click="removeAllUsers" />
              </div>
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
                @change="selectionChangeDepart"
              />
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-else-if="activeName==='organization'" label="组织机构">
        <el-row :gutter="10">
          <el-col :span="11">
            <el-row type="flex">
              <el-col style="width:150px">
                <el-select v-model="activeName" class="select-type">
                  <el-option value="department" label="同部门" />
                  <el-option value="organization" label="组织机构" />
                </el-select>
              </el-col>
              <el-col>
                <PmSearch :query.sync="queryOrg" default-prop="name" placeholder="搜索姓名" @search="getUserDataOrg">
                  <template slot="body">
                    <el-form-item label="编号" prop="code">
                      <el-input v-model="queryOrg.code" clearable />
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                      <el-input v-model="queryOrg.name" clearable />
                    </el-form-item>
                  </template>
                </PmSearch>
              </el-col>
            </el-row>

            <div class="block">
              <!--                修改前的代码-->
              <!--              <el-tree-->
              <!--                v-if="showTreeOrg"-->
              <!--                ref="treeLeft"-->
              <!--                :props="defaultProps"-->
              <!--                show-checkbox-->
              <!--                node-key="id"-->
              <!--                :load="loadNode"-->
              <!--                lazy-->
              <!--                @check-change="handleCheckChangeLeft"-->
              <!--              >-->
              <!--                <div slot-scope="{node, data }" style="width: 85%">-->
              <!--                  <i v-if="data.type === 'org'" class="iconfont icon-inquiry-template" />-->
              <!--                  <i v-else class="el-icon-user" />-->
              <!--                  <span class="one_warp" :title="handleName(data)">{{ handleName(data) }}</span>-->
              <!--                </div>-->
              <!--              </el-tree>-->
              <div v-if="showTreeOrg">
                <!-- 面包屑导航 -->
                <div class="top-area">
                  <div class="scroll-bar">
                    <el-breadcrumb separator-class="el-icon-arrow-right" style="white-space: nowrap; display: flex;">
                      <el-breadcrumb-item
                        v-for="(item, index) in breadcrumbList"
                        :key="index"
                        @click.native="changeList(item)"
                      >
                        {{ item ? item.name : '' }}
                      </el-breadcrumb-item>
                    </el-breadcrumb>
                  </div>
                  <!-- <el-button @click="allCheck" type="primary">全选</el-button> -->
                </div>
                <!-- 人员列表 -->
                <el-table
                  ref="multipleTable"
                  :data="breadModeData"
                  :show-header="false"
                  @select="selectionChange"
                >
                  <el-table-column prop="name" show-overflow-tooltip>
                    <template slot-scope="{row}">
                      <div style="display: flex;align-items: center">
                        <el-checkbox v-if="row.type !== 'org'" v-model="row.checked" @change="changeList(row)" />
                        <svg-icon v-if="row.type === 'org'"  icon-class="org-tree" />
                        <i v-else class="el-icon-user" />
                        <div
                          style="cursor: pointer;margin-left: 5px"
                          @click="changeList(row)"
                        >
                          {{ row.name + (row.code && row.type !== 'org'? ' ( ' + row.code + ' )' : '') }}</div>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <select-table
                v-else
                ref="multipleTable"
                :loading="orgLoading"
                :table-data="tableDataOrg"
                :selected-rows="tableDataSelect"
                @change="selectionChange"
              />
            </div>
          </el-col>
          <el-col :span="2">
            <div class="move_btns">
              <div>
                <!-- <el-button type="primary" :disabled="disabledTurnRightOrg" icon="el-icon-arrow-right" circle @click="addUsers"></el-button>
                <el-button type="primary" :disabled="disabledTurnLeftOrg" icon="el-icon-arrow-left" circle @click="removeUsers"></el-button> -->
                <el-button v-if="isMultiple" type="primary" icon="el-icon-d-arrow-right" circle @click="addAllUsers" />
                <el-button type="primary" icon="el-icon-d-arrow-left" circle @click="removeAllUsers" />
              </div>
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
                @change="selectionChangeOrg"
              />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="sure">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { SelectionComponentController } from '@controller'
import { BaseVue, Form, List, VueUtil } from '@lib'
import SelectTable from './select-table.vue'

const queryOrg = {
  code: null,
  name: null
}
const queryDepart = {
  code: null,
  name: null
}
export default {
  name: 'select-user',
  components: { SelectTable },
  mixins: [BaseVue, Form, List],
  props: {
    value: {},
    title: {
      type: String,
      default: '员工选择'
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeName: 'department',
      rootData: [],
      breadcrumbList: [{ orgLevel: 0, name: '根节点', type: 'org' }],
      breadModeData: [],
      defaultProps: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      },
      queryOrg: _.cloneDeep(queryOrg),
      queryDepart: _.cloneDeep(queryDepart),
      tableDataSelect: [],
      selectedLeft: [],
      disabledTurnRightOrg: true,
      disabledTurnLeft: true,
      tableDataDepart: [],
      tableDataOrg: [],
      // 机构搜索显示树还是表格
      showTreeOrg: true,
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
      return '已选员工' + isMultiple
    },
    disabledTurnLeftOrg() {
      return !this.selectionsOrg.length
    },
    disabledTurnLeftDepart() {
      return !this.selectionsDepart.length
    },
    disabledTurnRightDepart() {
      return !this.selectionsDepartLeft.length
    },
    orgLoading() {
      return this.SelectionComponentController.queryEmployeeForOrg.loading
    },
    departLoading() {
      return this.SelectionComponentController.queryEmployeeForDepartment.loading ||
      this.SelectionComponentController.queryEmployeeInOrg.loading
    }
  },
  watch: {
    queryOrg: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val.name && !val.code) {
          this.showTreeOrg = true
          this.disabledTurnRightOrg = true
        }
      }
    },
    dialogVisible: {
      immediate: true,
      handler(val) {
        if (val) {
          this.reset()
          this.tableDataSelect = this.isMultiple ? _.cloneDeep(this.value)
            : this.value && this.value.employee && this.value.employee.name ? [_.cloneDeep(this.value)] : []
          this.gettableDataDepart()
          // 再次打开弹框，树的数据初始化
          this.refreshNode()
        }
      }
    }
  },
  mounted() {
    this.getData()
  },
  beforeDestroy() {
    localStorage.removeItem('localData')
  },
  methods: {
    async getUserDataOrg() {
      if (this.queryOrg.name || this.queryOrg.code) {
        this.showTreeOrg = false
        this.disabledTurnRightOrg = true
        const resp = await this.dispatch(SelectionComponentController.queryEmployeeForOrg, this.queryOrg)
        if (!resp.error) {
          this.tableDataOrg = resp.data
        }
      } else {
        this.showTreeOrg = true
      }
    },
    async getUserDataDepart() {
      if (this.queryDepart.name || this.queryDepart.code) {
        const resp = await this.dispatch(SelectionComponentController.queryEmployeeForDepartment, this.queryDepart)
        if (!resp.error) {
          this.tableDataDepart = resp.data
        }
      } else {
        this.gettableDataDepart()
      }
    },
    async gettableDataDepart() {
      const orgId = this.userInfo.userOrgId
      const resp = await this.dispatch(SelectionComponentController.queryEmployeeInOrg, {
        orgId: orgId,
        pageIndex: 0,
        pageSize: 9999
      })
      if (!resp.error) {
        this.tableDataDepart = resp.data.data
      }
    },
    handleClick(val) {
      setTimeout(() => {
        if (val.name === 'department' && this.$refs.multipleTableDepart) {
          this.$refs.multipleTableDepart.toggleRowSelection()
        } else if (val.name === 'organization' && !this.showTreeOrg && this.$refs.multipleTable) {
          this.$refs.multipleTable.toggleRowSelection()
        }
      }, 200)
    },
    handleName(data) {
      let value = ''
      if (data.name) {
        value = data.name + (data.code ? ' ( ' + data.code + ' )' : '')
      } else {
        value = data.employee.name + (data.employee.code ? ' ( ' + data.employee.code + ' )' : '')
      }
      return value
    },
    cancel() {
      this.$emit('update:dialogVisible', false)
    },
    reset() {
      this.activeName = 'department'
      this.tableDataSelect = []
      this.queryDepart = _.cloneDeep(queryDepart)
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
    async changeList(node) {
      console.log(node)
      if (node.type === 'org') {
        this.breadcrumbList = this.breadcrumbList.slice(0, node.orgLevel)
        this.breadcrumbList.push(node)
        const data = node
        let nodes = []
        const localData = JSON.parse(localStorage.getItem('localData')) || {} // 本地缓存
        if (node.orgLevel === 0) {
          this.rootNode = node
          const resp = await this.dispatch(SelectionComponentController.queryOrg, {})
          nodes = resp.data.map(item => {
            item.type = 'org'
            if (!this.isMultiple) {
              item.disabled = true
            }
            return item
          })
          console.log(nodes)
          this.rootData = nodes
        } else {
          // 机构
          if (localData[data.id]) { // 本地缓存
            nodes = localData[data.id]
          } else {
            let nodesOrg = []
            let nodesUser = []
            const resp1 = await this.dispatch(SelectionComponentController.queryChildByParentId, {
              parentId: data.id
            })
            nodesOrg = resp1.data.map(item => {
              item.type = 'org'
              if (!this.isMultiple) {
                item.disabled = true
              }
              return item
            })
            // 员工
            const resp2 = await this.dispatch(SelectionComponentController.queryEmployeeByOrg, {
              orgId: data.id
            })
            console.log(resp2)
            if (!resp2.error) {
              nodesUser = resp2.data.map(item => {
                return {
                  ...item,
                  id: item.employee.id,
                  name: item.employee.name,
                  code: item.employee.code,
                  leaf: true,
                  org: { ...data }
                }
              })
            }
            nodes = nodesUser.concat(nodesOrg)
          }

          if (data.id) {
            localData[data.id] = nodes
            localStorage.setItem('localData', JSON.stringify(localData))
            console.log('localData', localData)
          }
        }

        if (this.isMultiple && this.isEmpType && node.data && node.data.type === 'org' && nodes.some(i => i.type === 'emp')) {
          this.$set(node.data, 'disabled', false)
        }
        this.breadModeData = nodes
        this.breadModeData.map(i => {
          i.checked = this.tableDataSelect.some(n => i.id === n.id)
        })
        console.log(this.breadModeData)
      } else {
        console.log(this.value)
        console.log(this.tableDataSelect)

        if (!this.tableDataSelect.some(i => i.id === node.id)) {
          if (this.isMultiple) {
            this.tableDataSelect.push(node)
          } else {
            this.tableDataSelect = []
            this.tableDataSelect.push(node)
          }
        } else {
          this.tableDataSelect.splice(this.tableDataSelect.findIndex(n => n.id === node.id), 1)
        }

        this.breadModeData = this.breadModeData.map(i => {
          i.checked = this.tableDataSelect.some(n => i.id === n.id)
          return i
        })

        console.log(this.breadModeData)

        // if (this.isMultiple) {
        //   this.$emit('input', this.tableDataSelect)
        // } else {
        //   if (this.tableDataSelect.length) {
        //     this.$emit('input', this.tableDataSelect[0])
        //   } else {
        //     this.$emit('input', {})
        //   }
        // }
        // this.toggleRowSelection()
      }
    },
    handleCheckChangeLeft(data, checked, indeterminate) {
      if (!this.isMultiple) {
        const nodes = this.$refs.treeLeft.getCheckedNodes(true)
        // 如果取消的不是右边选中的，则不需要处理
        if (nodes.length || this.tableDataSelect.length && this.tableDataSelect[0].employee.id === data.employee.id) {
          this.turnSingle(nodes, data, 'treeLeft', true)
        }
      } else {
        // const length = this.$refs.treeLeft.getCheckedKeys().length
        // this.disabledTurnRightOrg = !length
        if (!indeterminate) {
          this.addUsers(data, checked)
        }
      }
    },
    // 树，多选效果
    async addUsers(data, checked) {
      let tableDataSelect = []
      if (this.activeName === 'organization') {
        if (data.type === 'org') {
          // 根据机构获取员工
          const users = await this.getUsersByOrgid([data.id])
          tableDataSelect = tableDataSelect.concat(users)
          this.delRepeat(tableDataSelect, checked)
        } else {
          tableDataSelect.push(data)
          this.delRepeat(tableDataSelect, checked)
        }
      }
      this.disabledTurnRightOrg = true
    },
    async addAllUsers() {
      if (this.isMultiple) {
        // 当前页面能看到的全部
        let tableDataSelect = []
        if (this.activeName === 'organization') {
          // 查询跟节点对应的员工
          let users = []
          if (this.showTreeOrg) {
            console.log(this.breadModeData)
            users = this.breadModeData.filter(i => i.type !== 'org')
            // const ids = this.rootData.map(item => item.id)
            // users = ids.length ? await this.getUsersByOrgid(ids) : []
            // this.$refs.treeLeft.setCheckedKeys([])
          } else {
            users = _.cloneDeep(this.tableDataOrg)
          }
          tableDataSelect = tableDataSelect.concat(users)
        } else {
          // await this.gettableDataDepart()
          tableDataSelect = _.cloneDeep(this.tableDataDepart)
        }
        this.delRepeat(tableDataSelect, true)
        this.disabledTurnRightOrg = true
      } else {
        this.$message.warning('单选模式下不支持全选功能')
      }
    },
    // 去重
    delRepeat(tableDataSelect, type) {
      if (type) {
        tableDataSelect.forEach(item => {
          const user = this.tableDataSelect.every(tem => tem.employee.id !== item.employee.id)
          if (user) {
            this.tableDataSelect.push(item)
          }
        })
      } else {
        tableDataSelect.forEach(item => {
          const index = this.tableDataSelect.map(tem => tem.employee.id).indexOf(item.employee.id)
          if (index !== -1) {
            this.tableDataSelect.splice(index, 1)
          }
        })
      }
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
    removeUsers() {
      let ids = []
      if (this.activeName === 'organization') {
        ids = this.selectionsOrg.map(item => item.id)
      } else {
        ids = this.selectionsDepart.map(item => item.id)
      }
      const tableDataSelect = this.tableDataSelect.filter(item => _.indexOf(ids, (item.id)) === -1)
      this.$set(this, 'tableDataSelect', tableDataSelect)
      this.disabledTurnLeft = true
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
      let nodes = []
      if (node.level === 0) {
        this.rootNode = node
        const resp = await this.dispatch(SelectionComponentController.queryOrg, {})
        nodes = resp.data.map(item => {
          item.type = 'org'
          if (!this.isMultiple) {
            item.disabled = true
          }
          return item
        })
        this.rootData = nodes
      } else {
        // 机构
        let nodesOrg = []
        let nodesUser = []
        const resp1 = await this.dispatch(SelectionComponentController.queryChildByParentId, {
          parentId: data.id
        })
        nodesOrg = resp1.data.map(item => {
          item.type = 'org'
          if (!this.isMultiple) {
            item.disabled = true
          }
          return item
        })
        // 员工
        const resp2 = await this.dispatch(SelectionComponentController.queryEmployeeByOrg, {
          orgId: data.id
        })
        if (!resp2.error) {
          nodesUser = resp2.data.map(item => {
            return {
              ...item,
              id: item.employee.id,
              leaf: true,
              org: { ...data }
            }
          })
        }
        nodes = nodesUser.concat(nodesOrg)
        console.log(nodes)
      }
      return resolve(nodes)
    },
    async getData() {
      const resp = await this.dispatch(SelectionComponentController.queryOrg, {})
      console.log(resp)
      resp.data.forEach(i => {
        i.type = 'org'
      })
      this.breadModeData = resp.data
    },
    selectionChangeDepart(selections) {
      this.selectionsDepart = selections
    },
    selectionChangeOrg(selections) {
      this.selectionsOrg = selections
    },
    // 部门左边
    selectionChangeDepartLeft(selections, row) {
      if (this.isMultiple) {
        if (selections.some(i => i.employee.id === row.employee.id)) {
          this.tableDataSelect.push(row)
        } else {
          const index = _.indexOf(this.tableDataSelect.map(i => i.employee.id), row.employee.id)
          this.tableDataSelect.splice(index, 1)
        }
      } else {
        this.turnSingle(selections, row, 'multipleTableDepart')
      }
    },
    // 机构高级查询
    selectionChange(selections, row) {
      if (this.isMultiple) {
        if (selections.some(i => i.employee.id === row.employee.id)) {
          this.tableDataSelect.push(row)
        } else {
          const index = _.indexOf(this.tableDataSelect.map(i => i.employee.id), row.employee.id)
          this.tableDataSelect.splice(index, 1)
        }
      } else {
        this.turnSingle(selections, row, 'multipleTable')
      }
    },
    // 复选框-单选操作
    turnSingle(selections, row, type, isTree) {
      if (!this.isMultiple) {
        if (selections.length === 2) {
          if (isTree) {
            const tableSelections = selections.filter(item => item.employee.id === row.employee.id)
            this.$refs[type].setCheckedNodes(tableSelections)
          } else {
            const tableSelections = selections.filter(item => item.employee.id !== row.employee.id)
            this.$refs[type].$refs.tableRef.toggleRowSelection(tableSelections[0], false)
          }
          this.tableDataSelect = [row]
        } else {
          this.tableDataSelect = selections
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-breadcrumb__inner{
  &:hover{
    font-weight: bold;
    cursor: pointer;
  }
}
.top-area{
  display: flex;justify-content: space-between;align-items: center;padding: 10px 5px;background: #f5f5f5;
  .scroll-bar{
    overflow-x: auto;overflow-y: hidden;
  }
}
  .el-row {
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
  .one_warp {
    width: 75%;
    height: 20px;
    line-height: 20px;
    margin-bottom: -5px;
    overflow-y: hidden;
    display: inline-block;
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  //::v-deep .el-tabs__header{
  //display:none;
//}
.select-type {
  ::v-deep i.el-input__icon.el-input__validateIcon.el-icon-circle-close{
    display: none !important;
  }
  ::v-deep i.el-input__icon.el-input__validateIcon.el-icon-circle-check{
    display: none !important;
  }
}
</style>
