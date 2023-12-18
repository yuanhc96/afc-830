<template>
  <el-form :ref="formRef" model="[]" :rules="validateRules" label-width="120px">
    <el-table
      ref="table"
      border stripe
      v-loading="listLoading"
      :highlight-current-row="true"
      :data="tableData"
      :header-cell-style="{'background':'#F5F4F7'}"
      @selection-change="handleCurrentChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
        :resizable="false"
      />
      <el-table-column
        prop="code"
        label="分组编号"
        width="160"
        align="center"
      />
      <el-table-column
        prop="name"
        label="分组名称"
        min-width="160"
        align="center"
      />
    </el-table>

  </el-form>
</template>

<script>
import { ResourceController } from '@controller'
import { BaseVue, Form, List } from '@lib'
export default {
  mixins: [BaseVue, List, Form],
  props: {
    tableData: {
      type: Object,
      default: null,
    },
    multipleSelection: {
      type: Object,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formRef: 'form',
      dialogVisible: true,
      selectGroup: null,
      validateRules: {

      },
    }
  },
  methods: {

    handleCurrentChange(val) {
      this.selectGroup = val[0].id
      this.$nextTick(function() {
        this.tableData.forEach((item) => {
          if (val[val.length - 1] === item) {
            this.$refs.table.toggleRowSelection(item, true)
          } else {
            this.$refs.table.toggleRowSelection(item, false)
          }
        })
      })
    },
    async validateResolve() {
      this.$emit('update:loading', true)
      const resp = await this.submitGroup()
      this.$emit('update:loading', false)
      if (!resp.error) {
        this.$msg.success('资源转移分组成功！')
        this.$emit('pmsuccess')
        return true
      } else {
        return false
      }
    },
    async submitGroup() {
      const res = this.multipleSelection.map(i => i.id)
      const payload = {
        resGroupId: this.selectGroup,
        resources: this.multipleSelection
      }
      const resp = await this.dispatch(ResourceController.updateTypes, payload)
      return resp
    },
  }
}
</script>

<style lang="scss" scoped>
</style>

