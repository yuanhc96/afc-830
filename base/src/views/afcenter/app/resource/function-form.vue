<template>
  <div>
    <el-form :ref="formRef" :key="formType" :model="form" :rules="validateRules" label-position="top">
      <el-row>
        <el-col :span="24">
          <el-form-item label="编号" prop="code">
            <el-input v-model.trim="form.code" v-focus="formType!=='edit'" :disabled="formType==='edit'" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="名称" prop="name">
            <el-input v-model.trim="form.name" v-focus="formType==='edit'" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="内容" prop="content">
            <el-input v-model.trim="form.content" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述" prop="description">
            <el-input v-model.trim="form.description" type="textarea" :rows="3" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="showFooter" style="border-top: 1px solid #e8e8e8;" class="text-center pt-10">
      <el-button type="primary" :loading="loading" @click="submit">保存</el-button>
    </div>
  </div>
</template>
<script>
import { ResourceController } from '@controller'
import { BaseVue, Form, _ } from '@lib'
import model from './model.js'

export default {
  components: {},
  mixins: [BaseVue, Form],
  props: {
    data: {},
    params: {
      default: null
    },
    businessObjId: {
      type: String,
      default: null
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
      form: _.cloneDeep(model.resource),
      validateRules: {
        code: [
          { required: true, message: '请输入功能编号', trigger: 'change' },
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
                const res = await this.dispatch(ResourceController.isExist, { code: value, tenantId: this.currentTenant })
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
          { required: true, message: '请输入功能名称', trigger: 'change' },
        ]
      },

    }
  },
  computed: {
    title() {
      return `${this.formType === 'add' ? '新建' : '编辑'}功能`
    },
    formType() {
      if (!this.params) {
        return 'edit'
      } else {
        return 'add'
      }
    }
  },
  watch: {
    businessObjId(res) {
      this.businessObjId = res
    }
  },
  mounted() {

  },
  methods: {
    async loadData() {
      if (this.data) {
        const resp = await this.dispatch(FunctionManager.getFunction, {
          payload: {
            'template': {
              'funccode': this.data.realId
            }
          }
        })
        this.form = resp.data.appfunction
      }
    },
    async remoteValidateCode(funccode) {
      const resp = await this.dispatch(FunctionManager.validateFunction, {
        payload: { 'template': { funccode }}
      })
      if (!resp.error) {
        return resp.data.data === 0
      } else { return false }
    },
    async validateResolve() {
      this.$emit('update:loading', true)
      let resp = {}
      if (this.formType === 'add') {
        this.form.resGroupId = this.params.resGroupId
        this.form.tenantId = this.currentTenant
        const parameter = this.businessObjId == null ? { appId: this.params.appId } : { businessObjId: this.businessObjId }
        resp = await this.dispatch(ResourceController.create, {
          payload: {
            resource: {
              ...this.form,
              ...parameter,
              types: this.params.type
            }
          }
        })
      } else if (this.formType === 'edit') {
        resp = await this.dispatch(ResourceController.update, {
          resource: {
            ...this.form,
          }
        })
      }
      this.$emit('update:loading', false)
      if (!resp.error) {
        this.$msg.success('保存成功!')
        this.$emit('success')
        return true
      } else {
        return false
      }
    }
  },
}
</script>
