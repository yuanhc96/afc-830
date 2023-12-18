<template>
    <el-row :gutter="10">
        <el-col :span="11">
        <div class="selectUser_search" v-if="type==='workGroup'">
            <PmSearch ref="searchForm" :query.sync="query" defaultProp="name" placeholder="搜索工作组名称" @search="pmSearch">
            <template slot="body">
                <el-form-item label="工作组名称" prop="name">
                    <el-input v-model.trim="query.name" clearable @keypress.native.enter="searchEnter" />
                </el-form-item>
                <el-form-item label="工作组编号" prop="code">
                    <el-input v-model.trim="query.code" clearable @keypress.native.enter="searchEnter" />
                </el-form-item>
            </template>
            </PmSearch>
        </div>
        <div class="block">
            <el-table
              ref="multipleTableDepart"
              :class="isMultiple?'':'section'"
              v-loading="loading" :data="gridList"
              height="349px"
              @select="selectionChangeDepartLeft"
              @select-all="selectAll">
                <el-table-column type="selection" width="55"/>
                <el-table-column label="工作组编号" prop="code" v-if="type==='workGroup'"></el-table-column>
                <el-table-column label="工作组名称" prop="name" v-if="type==='workGroup'"></el-table-column>
            </el-table>
            <el-pagination
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
        </el-col>
        <el-col :span="2">
        <div class="move_btns">
          <div>
            <div v-if="isMultiple">
            <el-button type="primary" icon="el-icon-d-arrow-right" @click="addAllUsers" circle></el-button>
            </div>
            <div>
            <el-button type="primary" icon="el-icon-d-arrow-left" @click="removeAllUsers" circle></el-button>
            </div>
          </div>
        </div>
        </el-col>
        <el-col :span="11">
        <div class="right_title p-5">
            <span>{{ rightTitle }}</span>
        </div>
        <div class="block">
          <select-table
            :tableData="tableDataSelect"
            :showSelect="false"
            :showRemove="true"
            @change="selectionChangeDepart"
            :showIcon="false"
          />
        </div>
        </el-col>
    </el-row>
</template>

<script>
import { WorkGroupController } from '@controller'
import { BaseVue, Form, List, VueUtil } from '@lib'
import SelectTable from './select-table.vue'
export default {
  name: 'select-user',
  components: {SelectTable},
  mixins: [BaseVue, Form, List],
  props: {
    value: {},
    isMultiple: {
      type: Boolean,
      default: true
    },
    type:{
        type:String,
        default:''
    },
    dictType:{
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      selectedLeft: [],
      disabledTurnLeft: true,
      tableDataSelect: [],
      // 机构搜索显示树还是表格
      selectionsDepart: [],
      selectionsDepartLeft: []
    }
  },
  computed: {
    ...VueUtil(this)
      .select([WorkGroupController])
      .state(),
    rightTitle() {
      const isMultiple = ' (' + `${this.isMultiple ? '多选' : '单选'}` + ')'
      return '已选' + this.dictType[this.type] + isMultiple
    },
    disabledTurnLeftDepart() {
      return !this.selectionsDepart.length
    },
    disabledTurnRightDepart() {
      return !this.selectionsDepartLeft.length
    },
    loading(){
      if(this.type === 'workGroup'){
        return this.WorkGroupController.queryWorkGroupsByCriteria.loading
      }
    }
  },
  watch: {
    gridList: {
      immediate: true,
      deep: true,
      handler(val) {
        val.length && this.$nextTick(()=> {
          this.tableDataSelect.forEach(i => {
            const selectedRows = val.filter(j => j.id === i.id)
            if (selectedRows.length) {
              this.$refs.multipleTableDepart.toggleRowSelection(selectedRows[0], true)
            }
          })
        })
      }
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    searchEnter(){
      if(this.$refs.searchForm){ //高级搜索 enter
        this.$refs.searchForm.searchQuery = {...this.query}
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
        if(this.type === 'workGroup'){
            let query = this.otherQuery(this.query)
            const resp = await this.dispatch(WorkGroupController.queryWorkGroupsByCriteria, query)
            return resp
        }
        
    },
    async addUsers() {
        this.delRepeat(this.selectionsDepartLeft)
        this.$emit('change',this.tableDataSelect,this.type)
        // this.selectionsDepartLeft = []
        // this.$refs.multipleTableDepart.clearSelection()
    },
    async addAllUsers() {
      this.delRepeat(_.cloneDeep(this.gridList))
      this.$emit('change',this.tableDataSelect,this.type)
      this.disabledTurnRightOrg = true
      this.$refs.multipleTableDepart.clearSelection()
      this.$refs.multipleTableDepart.toggleAllSelection()
    },
    // 去重
    delRepeat(tableDataSelect) {
      tableDataSelect.forEach(item => {
        const user = this.tableDataSelect.every(tem => tem.id != item.id)
        if (user) {
          this.tableDataSelect.push(item)
        }
      })
    },
    removeUsers() {
      let ids = this.selectionsDepart.map(item => item.id)
      const tableDataSelect = this.tableDataSelect.filter(item => _.indexOf(ids, (item.id)) === -1)
      this.$set(this, 'tableDataSelect', tableDataSelect)
      this.$emit('change',tableDataSelect,this.type)
      this.disabledTurnLeft = true
    },
    removeAllUsers() {
      this.$set(this, 'tableDataSelect', [])
      this.$emit('change',[],this.type)
      this.disabledTurnLeft = true
      this.$refs.multipleTableDepart.clearSelection()
    },
    selectAll(selection) {
      if (selection.length) {
        selection.forEach(i => {
          const isExit = this.tableDataSelect.every(j => i.id !== j.id)
          if (isExit) {
            this.tableDataSelect.push(i)
          }
        })
      } else {
        this.gridList.forEach(i => {
          this.tableDataSelect.forEach(j => {
            if (i.id === j.id) {
              const index = _.indexOf(this.tableDataSelect.map(k => k.id), i.id)
              this.tableDataSelect.splice(index, 1)
            }
          })
        })
      }
      this.$emit('change',this.tableDataSelect,this.type)
    },
    selectionChangeDepart(selections) {
      // 右边表格删除
      this.tableDataSelect = selections
      this.gridList.length && this.$nextTick(()=> {
        this.gridList.forEach(i => {
          const isExit = this.tableDataSelect.every(j => j.id !== i.id)
          if (isExit) {
            this.$refs.multipleTableDepart.toggleRowSelection(i, false)
          }
        })
      })
      this.$emit('change',this.tableDataSelect,this.type)
    },
    // 部门左边
    selectionChangeDepartLeft(selections,row) {
      // 被选中的是右边的表格
      if (selections.some(i => i.id === row.id)) {
        this.tableDataSelect.push(row)
      } else {
        
        const index = _.indexOf(this.tableDataSelect.map(i => i.id), row.id)
        this.tableDataSelect.splice(index, 1)
      }
      if(row){
        this.turnSingle(selections, row, 'multipleTableDepart')
        this.$emit('change',this.tableDataSelect,this.type)
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
            this.$refs[type].toggleRowSelection(tableSelections[0], false)
          }
          this.tableDataSelect = [row]
        } else {
          this.tableDataSelect = selections
        }
      }
    },
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
    .block_right {
      .el-tree-node__content {
        .item  {
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
      padding-top: 170px;
      text-align: center;
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
.section{
  ::v-deep .has-gutter{
    .el-checkbox{
        display: none;

    }
  }
}

</style>
