<template>
  <el-row :gutter="10">
    <el-col :span="11">
      <div class="selectUser_search">
        <el-row type="flex">
          <el-col style="width:150px">
            <slot name="filter" />
          </el-col>
          <el-col>
            <PmSearch
              ref="searchForm"
              :query.sync="query"
              default-prop="name"
              :placeholder="`搜索${dictType[this.type]}名称`"
              @search="pmSearch"
            >
              <template slot="body">
                <el-form-item :label="dictType[this.type] + '名称'" prop="name">
                  <el-input
                    v-model.trim="query.name"
                    clearable
                    @keypress.native.enter="searchEnter"
                  />
                </el-form-item>
                <el-form-item :label="dictType[this.type] + '编号'" prop="code">
                  <el-input
                    v-model.trim="query.code"
                    clearable
                    @keypress.native.enter="searchEnter"
                  />
                </el-form-item>
              </template>
            </PmSearch>
          </el-col>
        </el-row>
      </div>
      <div class="block">
        <el-table
          ref="multipleTableDepart"
          v-loading="loading"
          :class="isMultiple ? '' : 'section'"
          :data="gridList"
          :height="isRole ? '350px' : '399px'"
          @selection-change="selectionChange"
          @select="selectionChangeDepartLeft"
          @select-all="selectAll"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            :label="dictType[this.type] + '编号'"
            prop="code"
            width="150"
            show-overflow-tooltip
          />
          <el-table-column
            :label="dictType[this.type] + '名称'"
            prop="name"
            width="130"
            show-overflow-tooltip
          />
        </el-table>
        <Pagination
          v-if="isRole"
          background
          :border="false"
          :current-page.sync="query.offset"
          :page-size="query.limit"
          :total="gridTotal"
          @size-change="changePageSizer"
          @current-change="changePage"
        />
      </div>
    </el-col>
    <el-col :span="2">
      <div class="move_btns">
        <div>
          <div class="text-center">
            <el-button
              v-if="isMultiple"
              type="primary"
              icon="el-icon-d-arrow-right"
              circle
              @click="addAllUsers"
            />
          </div>
          <div class="text-center">
            <el-button
              style="margin-top:15px"
              type="primary"
              icon="el-icon-d-arrow-left"
              circle
              @click="removeAllUsers"
            />
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="11">
      <div class="right_title p-5 mt-5">
        <span>{{ rightTitle }}</span>
      </div>
      <div class="block" style="border-bottom:none">
        <select-table
          :table-data="tableDataSelect"
          :show-select="false"
          :show-remove="true"
          :show-type="true"
          @change="selectionChangeDepart"
        />
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { RoleController, WorkGroupController } from '@controller'
import { BaseVue, Form, List, VueUtil } from '@lib'
import SelectTable from './select-table.vue'
export default {
  name: 'select-user',
  components: { SelectTable },
  mixins: [BaseVue, Form, List],
  props: {
    value: {},
    isMultiple: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: '',
    },
    dictType: {
      type: Object,
      default: {},
    },
    allSelecteData: {
      type: Array,
      default: [],
    },
    activeName: {
      type: String,
      default: '',
    },
    orgData: {
      type: Object,
      default: {},
    },
    dialogqueryFun: {
      type: Function,
    },
    businessObjId: {
      type: String,
      default: '',
    },
    currentAppId: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      selectedLeft: [],
      tableDataSelect: [],
      selectionsDepart: [],
      selectionsDepartLeft: [],
    }
  },
  computed: {
    ...VueUtil(this).select([RoleController, WorkGroupController]).state(),
    rightTitle() {
      const isMultiple = ' (' + `${this.isMultiple ? '多选' : '单选'}` + ')'
      return '已选' + isMultiple
    },
    disabledTurnLeftDepart() {
      return !this.selectionsDepart.length
    },
    disabledTurnRightDepart() {
      return !this.selectionsDepartLeft.length
    },
    loading() {
      if (this.type === 'workGroup') {
        return this.WorkGroupController.queryWorkGroupsByCriteria.loading
      }
    },
    isRole() {
      return this.type.startsWith('role')
    },
    appId() {
      return (this.$route.query ? this.$route.query.appId : null) || this.currentAppId || null
    },
  },
  watch: {
    gridList: {
      immediate: true,
      deep: true,
      handler(val) {
        val.length &&
          this.$nextTick(() => {
            this.tableDataSelect.forEach((i) => {
              const selectedRows = val.filter((j) => j.id === i.id)
              if (selectedRows.length) {
                this.$refs.multipleTableDepart.toggleRowSelection(
                  selectedRows[0],
                  true
                )
              }
            })
          })
      },
    },
    allSelecteData: {
      immediate: true,
      deep: true,
      handler(val) {
        this.tableDataSelect = _.cloneDeep(val)
      },
    },
  },
  mounted() {
    this.search()
  },
  methods: {
    searchEnter() {
      if (this.$refs.searchForm) {
        // 高级搜索 enter
        this.$refs.searchForm.searchQuery = { ...this.query }
        this.$refs.searchForm.initOptions()
        this.$refs.searchForm.visible = false
      }
      this.pmSearch()
    },
    handleName(data) {
      let value = ''
      if (data.name) {
        value = data.name + (data.code ? ' ( ' + data.code + ' )' : '')
      }
      return value
    },
    async searchBody() {
      console.log(this.query, '========')
      const { name, code } = this.query
      const query = {
        pageSize: this.isRole ? this.query.limit : -1,
        pageIndex: this.isRole ? this.query.offset - 1 : -1,
        name,
        code,
      }
      if (this.type === 'workGroup') {
        return await this.dispatch(
          WorkGroupController.queryWorkGroupsByCriteria,
          query
        )
      } else if (this.type.startsWith('role')) {
        if (this.dialogqueryFun) {
          return await this.dialogqueryFun.call(this, {
            orgId: this.orgData.id,
            ...query,
          })
        } else {
          if (this.appId) {
            const payload = { appId: this.appId, ...query }
            return await this.dispatch(
              RoleController.queryAppRolesWithPage,
              payload
            )
          } else {
            let payload = { type: 'platform', ...query }
            if (this.businessObjId) {
              payload = {
                ...payload,
                businessObjId: this.businessObjId,
                type: 'businessObject',
              }
            }
            return await this.dispatch(
              RoleController.queryRolesWithPage,
              payload
            )
          }
        }
      }
    },
    async addAllUsers() {
      const _gridList = this.gridList
      _gridList.forEach((item) => {
        item.extra = {
          type: this.type,
          name: this.dictType[this.type],
        }
        item.extraType = this.type
      })
      _gridList.forEach((item) => {
        const user = this.tableDataSelect.every(
          (tem) => tem.id !== item.id || tem.extraType !== item.extraType
        )
        if (user) {
          this.tableDataSelect.unshift(item)
        }
      })
      this.$emit('change', this.tableDataSelect, this.type)
      // this.$refs.multipleTableDepart.clearSelection()
      // this.$refs.multipleTableDepart.toggleAllSelection()
    },
    removeUsers() {
      const ids = this.selectionsDepart.map((item) => item.id)
      const tableDataSelect = this.tableDataSelect.filter(
        (item) => _.indexOf(ids, item.id) === -1
      )
      this.$set(this, 'tableDataSelect', tableDataSelect)
      this.$emit('change', tableDataSelect, this.type)
    },
    removeAllUsers() {
      this.$set(this, 'tableDataSelect', [])
      this.$emit('change', [], this.type)
      this.$refs.multipleTableDepart.clearSelection()
    },
    selectAll(selections) {
      const _selections = selections.length
        ? _.cloneDeep(selections)
        : _.cloneDeep(this.gridList)
      _selections.forEach((item) => {
        item.extra =
          item.extra && item.extra.type
            ? item.extra
            : {
              type: this.type,
              name: this.dictType[this.type],
            }
        item.extraType = this.type
      })
      if (selections.length) {
        _selections.forEach((i) => {
          const isExit = this.tableDataSelect.every(
            (j) => i.id !== j.id || i.extraType !== j.extraType
          )
          if (isExit) {
            this.tableDataSelect.unshift(i)
          }
        })
      } else {
        // 取消所有
        _selections.forEach((i) => {
          this.tableDataSelect.forEach((j, index) => {
            if (i.id === j.id && i.extraType === j.extraType) {
              this.tableDataSelect.splice(index, 1)
            }
          })
        })
      }
      this.$emit('change', this.tableDataSelect, this.type)
    },
    selectionChangeDepart(selections) {
      // 右边表格删除
      this.tableDataSelect = selections
      this.gridList.length &&
        this.$nextTick(() => {
          this.gridList.forEach((i) => {
            const isExit = this.tableDataSelect.every(
              (j) => j.id !== i.id || j.extraType !== i.extraType
            )
            if (isExit) {
              this.$refs.multipleTableDepart.toggleRowSelection(i, false)
            }
          })
        })
      this.$emit('change', this.tableDataSelect, this.type)
    },
    // 部门左边
    selectionChangeDepartLeft(selections, row) {
      // 被选中的是右边的表格
      const _row = _.cloneDeep(row)
      _row.extra = {
        type: this.type,
        name: this.dictType[this.type],
      }
      _row.extraType = this.type
      const _selections = _.cloneDeep(selections)
      _selections.forEach((item) => {
        item.extra =
          item.extra && item.extra.type
            ? item.extra
            : {
              type: this.type,
              name: this.dictType[this.type],
            }
        item.extraType = this.type
      })
      // 如果是勾选中，不在this.tableDataSelect的中间，则加
      if (_selections.some((i) => i.id === _row.id)) {
        if (this.isMultiple) {
          if (this.tableDataSelect.every((j) => j.id !== row.id || j.extraType !== row.extraType)) {
            this.tableDataSelect.unshift(_row)
          }
        } else {
          this.tableDataSelect = [_row]
          this.$refs.multipleTableDepart.clearSelection()
        }
      } else {
        // 如果取消勾选，在this.tableDataSelect，则删
        this.tableDataSelect.forEach((i, index) => {
          if (i.id === _row.id && i.extraType === _row.extraType) {
            this.tableDataSelect.splice(index, 1)
          }
        })
      }
      if (_row.id) {
        // this.turnSingle(_selections, _row, 'multipleTableDepart')
        this.$emit('change', this.tableDataSelect, this.type)
      }
    },
    selectionChange(val) {
      if (!this.isMultiple) {
        val.forEach(row => {
          if (this.tableDataSelect.some(i => i.id === row.id)) {
            this.$refs.multipleTableDepart.toggleRowSelection(row, true)
          } else {
            this.$refs.multipleTableDepart.toggleRowSelection(row)
          }
        })
      }
    }
  },
}
</script>
<style lang="scss" scoped>
.el-row {
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
  .block_right {
    .el-tree-node__content {
      .item {
        // height: 40px;
        width: 100%;
        i {
          // line-height: 35px;
          font-size: 20px;
          color: #ddd;
        }
      }
    }
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
  }
}

.el-tree-node {
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
::v-deep .el-table__header{
  width: 100% !important;
}
::v-deep .el-table__body{
  width: 100% !important;
}
// ::v-deep .el-pager {
//   max-width: 82px;
//   overflow-x: auto;
//   overflow-y: hidden;
// }
::v-deep .el-input--mini .el-input__inner {
  height: 32px;
}
.section {
  ::v-deep .has-gutter {
    .el-checkbox {
      display: none;
    }
  }
}
</style>
