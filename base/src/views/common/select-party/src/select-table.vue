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
      <el-table-column>
        <template slot-scope="{row}">
          <div class="row">
            <el-col :span="3" v-if="showIcon">
              <i class="el-icon-user-solid" :class="showSelect ? 'showSelect' : ''"></i>
            </el-col>
            <el-col :span="21">
              <div>{{ handleName(row)  }}</div>
            </el-col>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="showRemove" width="80px">
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
    height:{
      type:Number,
      default:399
    },
    showIcon:{
      type: Boolean,
      default: true
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
      handler(val) {
        val.length && this.$nextTick(()=> {
          this.selectedRows.forEach(i => {
            const selectedRows = val.filter(j => j.id === i.id)
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
            const selectedRows = this.tableData.filter(j => j.id === i.id)
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
      if (selections.some(i => i.id === row.id)) {
        selectedRows.push(row)
      } else {
        const index = _.indexOf(selectedRows.map(i => i.id), row.id)
        selectedRows.splice(index, 1)
      }
      this.$emit("update:selectedRows", selectedRows)
      this.$emit('change', selectedRows, row)
    },
    toggleRowSelection(row){
      this.$refs.tableRef.toggleRowSelection(row,true)
    },
    removeRow(row) {
      const tableData = _.cloneDeep(this.tableData)
      const index = _.indexOf(tableData.map(i => i.id), row.id)
      tableData.splice(index, 1)
      this.$emit('change', tableData, row)
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
