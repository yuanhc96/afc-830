<template>
  <div style="max-width:600px">
    <el-form :ref="formRef" :model="form" :rules="validateRules" label-position="top">
      <el-form-item label="编号" prop="code">
        <el-input v-model="form.code" v-focus :disabled="formType==='edit'" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" :disabled="readonly" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" :disabled="readonly" type="textarea" :rows="2" />
      </el-form-item>
    </el-form>
    <div v-if="showFooter" style="border-top: 1px " class="div-near-bottom">
      <el-button v-permission="FuncCode.afc_f_businessObject_edit" type="primary" :loading="btnLoading" @click="submit">保存</el-button>
    </div>
  </div>
</template>
<script>
import { BusinessObjectController } from '@controller'
import { BaseVue, Form, _ } from '@lib'
import model from './model.js'
export default {
  components: {},
  mixins: [BaseVue, Form],
  props: {
    data: {},
    params: {},
    type: {
      default: 'group',
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const codeTimer = null
    let nameTimer = null
    return {
      formRef: 'form',
      model: model,
      form: _.cloneDeep(model),
      btnLoading: false,
      validateRules: {
        code: [
          { required: true, message: '请输入业务对象编号', trigger: 'change' },
          { validator: (rule, value, callback, source, options) => {
            if (this.formType === 'edit') {
              callback()
            }
            if (nameTimer !== null) {
              clearTimeout(nameTimer)
            }
            if (!value) {
              callback()
            } else if (!this.formData || value !== this.formData.code) {
              nameTimer = setTimeout(async() => {
                const res = await this.dispatch(BusinessObjectController.isExist, { code: value, tenantId: this.currentTenant })
                console.log(res, 'res')
                if (res.data == true) {
                  callback(new Error(`${value}编号已存在!`))
                }
                callback()
              }, 300)
            }
          } }
        ],
        name: [
          { required: true, message: '请输入业务对象名称', trigger: 'change' },
        ]
      },
    }
  },
  computed: {

    title() {
      return `${this.formType === 'add' ? '新建' : '编辑'}功能组`
    },
    formType() {
      if (!this.params) {
        this.showFooter = true
        return 'edit'
      } else {
        return 'add'
      }
    }
  },

  watch: {

  },
  mounted() {
    if (this.data) {
      this.form = this.data
      this.showFooter = true
    }
  },
  methods: {
    async validateResolve() {
      this.btnLoading = true
      this.$emit('update:loading', this.btnLoading)
      let resp = {}
      if (this.formType === 'add') {
        // this.checkCode(this.application.code)
        this.form.appId = this.params.id
        this.form.tenantId = this.currentTenant
        resp = await this.dispatch(BusinessObjectController.create, {
          payload: {
            businessObject: this.form,
          }
        })
        this.cancel()
      } else if (this.formType === 'edit') {
        resp = await this.dispatch(BusinessObjectController.update, {
          payload: {
            businessObject: this.form,
          }
        })
      }
      this.btnLoading = false
      this.$emit('update:loading', this.btnLoading)
      if (!resp.error) {
        this.$msg.success('保存成功!')
        this.$emit('success')
        return true
      } else {
        return false
      }
    },
  }
}
</script>
