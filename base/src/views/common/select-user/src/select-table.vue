<template>
  <el-table
    ref="tableRef"
    v-loading="loading"
    :data="tableData"
    :show-header="false"
    height="399px"
    @select="selectionChangeTable"
  >
    <el-table-column v-if="showSelect" type="selection" width="55" />
    <el-table-column label="员工">
      <template slot-scope="{row}">
        <el-col :span="3">
          <i class="el-icon-user-solid" :class="showSelect ? 'showSelect' : ''"></i>
        </el-col>
        <el-col :span="21">
          <div>{{ row.employee.name  }}({{row.employee.code}})</div>
        </el-col>
      </template>
    </el-table-column>
    <el-table-column v-if="showRemove" width="80px">
      <template slot-scope="{row}">
        <el-button type="text" icon="el-icon-delete" @click="removeRow(row)"></el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name: 'el-table-select',
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
    showRemove: {
      type: Boolean,
      default: false
    },
    // 右边tabledata
    selectedRows: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
     
    }
  },
  watch: {
    tableData: {
      immediate: true,
      deep: true,
      handler()  {
        this.toggleRowSelection()
      }
    },
    selectedRows: {
      immediate: true,
      deep: true,
      handler(val) {
        // 右边表格删除
        this.tableData.length && this.$nextTick(()=> {
          this.tableData.forEach(i => {
            const isExit = val.every(j => j.employee.id !== i.employee.id)
            if (isExit) {
              this.$refs.tableRef.toggleRowSelection(i, false)
            }
          })
        })
      }
    }
  },
  mounted() {
  },

  methods: {
    selectionChangeTable (selections, row) {
      this.$emit('change', selections, row)
    },
    removeRow(row) {
      const index = this.tableData.filter(i => i.id !== row.id)
      this.tableData.splice(index, 1)
      this.$emit('change', _.cloneDeep(this.tableData))
    },
    toggleRowSelection() {
      this.tableData.length && this.$nextTick(()=> {
        this.selectedRows.forEach(i => {
          const selectedRows = this.tableData.filter(j => j.employee.id === i.employee.id)
          if (selectedRows.length) {
            this.$refs.tableRef.toggleRowSelection(selectedRows[0], true)
          }
        })
      }) 
    }
  },
}
</script>
<style lang="scss" scoped>
  .el-table {
    i {
      font-size: 26px;
      color: #bbb;
      line-height: 22px;
    }
    .showSelect {
      margin-left: -17px;
    }
  }
</style>
