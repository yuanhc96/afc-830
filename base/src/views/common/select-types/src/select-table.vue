<template>
  <div>
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      :show-header="false"
      :height="height"
      @select="selectionChangeTable"
    >
      <el-table-column v-if="showSelect" type="selection" width="55" />
      <el-table-column v-if="showType" width="90px">
        <template slot-scope="{row}">
          <div>{{ row.extra && row.extra.name}}</div>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="{row}">
          <el-tooltip @mouseover.native.stop="getTipContent(row)" class="item" effect="dark" :content="tipContent" :disabled="type !== 'emp'" placement="top">
            <div>{{ handleName(row) }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column v-if="showRemove" width="60px">
        <template slot-scope="{row}">
          <el-button type="text" icon="el-icon-delete" @click="removeRow(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <template>
      <slot name="pagination"/>
    </template>
  </div>
</template>
<script>
import { EmployeeController } from '@controller'
import { BaseVue, VueUtil } from "@lib"
export default {
  name: 'el-table-select',
  mixins: [BaseVue],
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    showSelect: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    height:{
      type:Number,
      default:399
    },
    showType:{
      type: Boolean,
      default: false
    },
    // 选中的数据
    selectedRows: {
      type: Array,
      default: []
    },
    // 右边表格用来删除的
    showRemove: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
    }
  },
  data() {
    return {
     tipContent: '查询中...'
    }
  },
  computed: {
    ...VueUtil(this)
      .select([EmployeeController])
  },
  watch: {
    tableData: {
      immediate: true,
      deep: true,
      handler(val) {
        val.length && this.$nextTick(()=> {
          this.selectedRows.forEach(i => {
            const selectedRows = val.filter(j => this.isSame(i, j) && j.id === i.id)
            if (selectedRows.length) {
              this.$refs.tableRef.toggleRowSelection(selectedRows[0], true)
            }
          })
        }) 
      }
    },
    selectedRows: {
      immediate: true,
      deep: true,
      handler(val) {
        this.$nextTick(() => {
          // 右边表格删除时触发,左边表格更新
          this.$refs.tableRef.clearSelection()
          this.tableData.length && val.forEach(i => {
            const selectedRows = this.tableData.filter(j => this.isSame(i, j) && j.id === i.id)
            if (selectedRows.length) {
              this.$refs.tableRef.toggleRowSelection(selectedRows[0], true)
            }
          })
        })
      }
    }
  },
  mounted() {
  },

  methods: {
    handleName(data) {
      let value = data.name + (data.code ? ' ( ' + data.code + ' )' : '')
      return value
    },
    selectionChangeTable (selections, row) {
      let selectedRows = _.cloneDeep(this.selectedRows)
      if (selections.some(i => this.isSame(i, row) && i.id === row.id)) {
        if (this.selectedRows.length) {
          if (this.selectedRows.every(j => j.id !== row.id || !this.isSame(j, row))) {
            selectedRows.unshift(row)
          }
        } else {
          selectedRows.unshift(row)
        }
      } else {
        this.selectedRows.forEach((i, index) => {
          if (i.id === row.id && this.isSame(i, row)) {
            selectedRows.splice(index, 1)
          }
        })
      }
      // this.$emit("update:selectedRows", selectedRows)
      this.$emit('change', selectedRows, row)
    },
    toggleRowSelection(row){
      this.$refs.tableRef.toggleRowSelection(row,true)
    },
    removeRow(row) {
      let tableData = _.cloneDeep(this.tableData)
      tableData = tableData.filter(i => !(this.isSame(i, row) && i.id === row.id))
      this.$emit('change', tableData, row)
    },
     isSame(a, b) {
      return a.extraType === b.extraType
    },
    async getTipContent(row) {
      if (this.type !== 'emp') return
      const res = await this.dispatch(EmployeeController.getOrgFullPathByEmployeeCode, {
        empCode: row.code
      })
      if (!res.error) {
        this.tipContent = res.data.indexOf('/') === 0 ? res.data.slice(1): res.data
      }
    }
  },
}
</script>
<style lang="scss" scoped>
  .el-table {
    i {
      font-size: 30px;
      color: #bbb;
      line-height: 42px;
    }
    i.el-icon-delete {
      font-size: 16px;
    }
    .showSelect {
      margin-left: -20px;
    }
  }
  .row{
    display: flex;
    align-items: center;
  }
</style>
