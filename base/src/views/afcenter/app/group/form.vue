<template>
  <div>
    <el-form :ref="formRef" :model="form" :rules="validateRules" label-position="top">
      <el-row>
        <el-col :span="24">
          <el-form-item label="编号" prop="code">
            <el-input v-model="form.code" v-focus :disabled="formType==='edit'" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="排序" prop="sortNo">
            <el-input v-model="form.sortNo" type="number" min="1" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div
      v-if="showFooter"
      style="border-top: 1px solid #e8e8e8;"
      class="text-center pt-10"
      :loading="FuncGroupManager.updateFuncGroup.loading"
    >
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>
<script>
import { ResGroupController } from '@controller'
import { BaseVue, Form, VueUtil, _ } from '@lib'
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
    appid: {
      type: String,
      default: 'appid'
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
      form: _.cloneDeep(model),
      validateRules: {
        code: [
          { required: true, message: '请输入分组编号', trigger: 'change' },
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
                const res = await this.dispatch(ResGroupController.isExist, { code: value, tenantId: this.currentTenant })
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
          { required: true, message: '请输入分组名称', trigger: 'change' },
        ]
      },
    }
  },
  mounted() {
    if (this.data) {
      this.form = this.data
    }
  },
  computed: {
    ...VueUtil(this)
      .select([ResGroupController])
      .state(),
    title() {
      return `${this.formType === 'add' ? '新建' : '编辑'}功能组`
    },
    formType() {
      if (this.data) {
        return 'edit'
      } else {
        return 'add'
      }
    }
  },
  watch: {
    data: {
      immediate: true,

      handler() {
        // this.loadData()
      }
    }
  },
  methods: {
    async loadData() {
      if (!this.data) {
        return
      }
      const resp = await this.dispatch(FuncGroupManager.getFuncGroup, {
        payload: {
          'template': {
            'funcgroupid': this.data.realId
          }
        }
      })
      this.form = resp.data.appfuncgroup
    },
    async validateResolve() {
      this.$emit('update:loading', true)
      let resp = {}
      if (this.formType === 'add') {
        this.form.appId = this.appid
        this.form.businessObjId = this.businessObjId
        this.form.tenantId = this.currentTenant
        resp = await this.dispatch(ResGroupController.create, {
          payload: {
            resGroup: this.form,
          }
        })
        this.cancel()
      } else if (this.formType === 'edit') {
        resp = await this.dispatch(ResGroupController.update, {
          payload: {
            resGroup: this.form,
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
  }
}
</script>
