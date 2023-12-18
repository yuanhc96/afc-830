<template>
  <div style="max-width:600px;margin-left:-10px">
    <el-form :ref="formRef" :model="form" :rules="validateRules" label-position="top">
      <el-col :span="24">
        <el-form-item label="编号" prop="code">
          <el-input v-model.trim="form.code" v-focus :disabled="formType == 'edit'" @input="inputChange" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="form.name" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="描述" prop="description">
          <el-input v-model.trim="form.description" type="textarea" :row="3" />
        </el-form-item>
      </el-col>
    </el-form>
    <slot name="infoFooter" />
  </div>
</template>
<script>
import {
  RoleController
} from '@controller'
import { BaseVue, Form } from '@lib'
export default {
  mixins: [BaseVue, Form],
  props: {
    form: {},
    formType: {
      type: String
    }
  },
  data() {
    let codeTimer = null
    return {
      validateRules: {
        code: [{ required: true, message: '请输入角色编号', trigger: 'change' },
          { validator: (rule, value, callback, source, options) => {
            if (codeTimer !== null) {
              clearTimeout(codeTimer)
            }
            codeTimer = setTimeout(async() => {
              if (!value || this.formType == 'edit') {
                callback()
              } else {
                const count = await this.dispatch(RoleController.existenceByCode, { code: value })
                if (count.data) {
                  callback(new Error(`${value}角色编号已存在`))
                }
                callback()
              }
            }, 300)
          } }
        ],
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'change' }
        ],
      },
    }
  },
  methods: {
    validateResolve() {
      this.$emit('validateResolve')
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-input__inner{
  height: 32px;
}
</style>
