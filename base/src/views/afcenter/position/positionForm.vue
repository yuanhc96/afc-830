<template>
  <div>
    <el-form
      :ref="formRef"
      label-width="120px"
      class="position-form"
      :model="form"
      :rules="validateRules"
      label-position="top"
    >
      <el-row :key="formType">
        <el-col
          :span="24"
        ><el-form-item label="编号" prop="code">
          <el-input v-model="form.code" v-focus="formType!=='edit'" :disabled="formType==='edit'" /> </el-form-item></el-col>
        <el-col
          :span="24"
        ><el-form-item label="名称" prop="name">
          <el-input v-model="form.name" v-focus="formType==='edit'" /> </el-form-item></el-col>
        <el-col
          :span="24"
        ><el-form-item label="职责" prop="obligation">
          <el-input v-model="form.obligation" /> </el-form-item></el-col>
        <el-col
          :span="24"
        ><el-form-item label="描述" prop="desc">
          <el-input
            v-model="form.description"
            type="textarea"
          /> </el-form-item></el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { PositionController } from '@controller'
import { BaseVue, Form, _ } from '@lib'
import { position } from './model'

export default {
  name: 'position-form',
  components: {},
  mixins: [BaseVue, Form],
  props: {
    positionType: '',
  },
  data() {
    let codeTimer = null
    const _this = this
    function validater(rule, value, callback, source, options) {
      let api
      if (rule.field === 'code') {
        api = PositionController.findPositionIsExist
      } else {
        api = PositionController.findPositionIsExist
      }

      if (codeTimer !== null) {
        clearTimeout(codeTimer)
      }
      codeTimer = setTimeout(async() => {
        if (!value || _this.formType == 'edit') {
          callback()
        } else {
          const count = await _this.dispatch(api, { code: value })
          if (count.data) {
            callback(new Error(`${value}岗位编号已存在!`))
          }
          callback()
        }
      }, 300)
    }
    return {
      validateRules: {
        code: [
          { required: true, message: '请输入岗位编号', trigger: 'change' },
          { validator: validater }
        ],
        name: [
          { required: true, message: '请输入岗位名称', trigger: 'change' },
        ],
      },
      formRef: 'positionform',
      form: _.cloneDeep(position),
      model: position,
      activeName: 'first',
    }
  },
  computed: {
    // title() {
    //   return `${this.formType === "add" ? "新建" : "编辑"}应用功能`;
    // },
    formType() {
      if (this.formData) {
        return 'edit'
      } else {
        return 'add'
      }
    },
  },
  watch: {},
  mounted() {},
  methods: {
    resetForm() {
      this.clearValidate()
      this.form = _.cloneDeep(this.model || {})
    },
    async validateResolve() {
      let resp = {}
      if (this.formType === 'add') {
        resp = await this.dispatch(PositionController.create, {
          required: true,
          position: {
            ...this.form,
            types: this.positionType,
          },
        })
        this.cancel()
      } else if (this.formType === 'edit') {
        resp = await this.dispatch(PositionController.update, {
          required: true,
          position: {
            ...this.form,
          },
        })
      }
      if (!resp.error) {
        this.$msg.success('保存成功!')
        this.$emit('success')
        return true
      } else {
        return false
      }
    },
  },
}
</script>
<style></style>
