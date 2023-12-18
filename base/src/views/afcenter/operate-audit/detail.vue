<template>
  <el-dialog :close-on-click-modal="false" top="60px" title="日志详情" :visible.sync="dialogVisible" width="800px">
    <el-form class="view-form" label="120px" v-if="formData">
      <el-row>
        <el-col :span="8">
          <el-form-item label="目标对象">{{ formData.targetModelName }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="目标对象ID">{{ formData.targetModelId }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="操作类型">{{ getOperateType(formData.operateType) }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="操作人">{{ formData.operatorName }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <p><label>{{ label }}</label></p>
          <diff-editor v-if="formData.operateType === '1'" class="mt-10" height="400" :original="oldDataJson"
                       :modified="newDataJson"></diff-editor>
          <code-editor v-else class="mt-10" height="400" v-model="oldDataJson"></code-editor>
        </el-col>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer"> <el-button type="text" @click="cancel">取 消</el-button> </span>
  </el-dialog>
</template>

<script>
  import diffEditor from '@/views/common/code-editor/src/diff.vue'
import codeEditor from '@/views/common/code-editor/src/index.vue'
import { OperationLogController } from '@controller'
import { BaseVue, Form } from '@lib'
import Base from './base'
  const operateTypes = {
    '1': '对象值变化',
    '0': '新增对象',
    '2': '删除对象',
    '3': '登录对象',
    '4': '登出对象',
    '5': '对象',
  }
  export default {
    name: 'logger-details',
    mixins: [BaseVue, Form, Base],
    components: { diffEditor, codeEditor },
    computed: {
      label(){
        return operateTypes[this.formData.operateType]
      },
      oldDataJson() {
        if (this.details && this.details.oldDataJson) {
          return this.parseJSON(this.details.oldDataJson)
        } else {
          return ''
        }
      },
      newDataJson() {
        if (this.details && this.details.newDataJson) {
          return this.parseJSON(this.details.newDataJson)
        } else {
          return ''
        }
      },
    },
    props: {},

    data() {
      return {
        details: {},
      }
    },
    watch: {
      formData(val) {
        this.loadData()
      },
    },
    methods: {
      parseJSON(json) {
        try {
          return JSON.stringify(JSON.parse(json), null, 2)
        } catch (e) {
          return ''
        }
      },
      async loadData() {
        if (this.formData && this.formData.id) {
          let resp = null
          if (this.allow(this.FuncCode.afc_f_operation_logs_detail_query)) {
            resp = await this.dispatch(OperationLogController.findOperationLogDetail, {id: this.formData.id})
          } else {
            resp = await this.dispatch(OperationLogController.findTenantOperationLogDetail, {id: this.formData.id})
          }
          if (!resp.error) {
            this.details = resp.data
          }
        }
      },
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
