<template>
  <div>
    <el-form :ref="formRef" :model="form" :rules="validateRules" label-position="top">
      <el-row>
        <!-- <el-col :span="22">
          <el-form-item label="变量编号" prop="code">
            <el-input
              disabled
              v-model.trim="form.name"
            />
          </el-form-item>
        </el-col> -->
        <el-col :span="24">
          <el-form-item label="名称" prop="name">
            <el-input v-model.trim="form.name" v-focus :disabled="formType === 'edit'" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否加密" prop="isEncrypt" style="width: 440px">
            <Dict v-model="form.isEncrypt" dicttypeid="sys_switch" />
          </el-form-item>
        </el-col>
        <el-col v-if="form.isEncrypt == '1'" :span="24">
          <el-form-item label="内容">
            <el-input v-model.trim="form.value" placeholder="变量内容" show-password />
          </el-form-item>
        </el-col>
        <el-col v-else :span="24">
          <el-form-item label="内容">
            <el-input v-model.trim="form.value" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述" prop="description">
            <el-input v-model="form.description" :disabled="readonly" type="textarea" :rows="2" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { SysVariableController } from '@controller'
import { BaseVue, Form, _ } from '@lib'
import model from './model.js'
export default {
  components: {},
  mixins: [BaseVue, Form],
  props: {
    data: {
      default: () => {}
    },
    groupid: {
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
      btnLoading: false,
      validateRules: {
        // code: [
        // { required: true, message: "请输入变量代码", trigger: "change" },
        // {
        //   validator: (rule, value, callback, source, options) => {
        //     if (this.formType === "edit") {
        //       callback();
        //     }
        //     if (nameTimer !== null) {
        //       clearTimeout(nameTimer);
        //     }
        //     if (!value) {
        //       callback();
        //     } else if (!this.formData || value !== this.formData.code) {
        //       nameTimer = setTimeout(async () => {
        //         const res = await this.dispatch(SysVariableController.isExist, {
        //           code: value,
        //           tenantId: this.currentTenant,
        //         });
        //         if (res.data == true) {
        //           callback(new Error(`${value}编码已存在!`));
        //         }
        //         callback();
        //       }, 300);
        //     }
        //   },
        // },
        // ],
        name: [
          { required: true, message: '请输入变量名称', trigger: 'change' },
          {
            validator: (rule, value, callback, source, options) => {
              if (this.formType === 'edit') {
                callback()
              }
              if (nameTimer !== null) {
                clearTimeout(nameTimer)
              }
              if (value && /[\u4E00-\u9FA5]/g.test(value)) {
                callback(new Error('系统变量名称不能输入汉字'))
              }
              if (!value) {
                callback()
              } else if (!this.formData || value !== this.formData.name) {
                nameTimer = setTimeout(async() => {
                  const res = await this.dispatch(SysVariableController.isNameExist, {
                    name: value,
                    tenantId: this.currentTenant
                  })
                  if (res.data == true) {
                    callback(new Error(`变量名称${value}已存在!`))
                  }
                  callback()
                }, 300)
              }
            }
          }
        ],
        isEncrypt: [{ required: true, message: '请选择是否加密', trigger: 'change' }],
        value: [{ required: true, message: '请输入变量内容', trigger: 'change' }]
      }
    }
  },
  computed: {
    formType() {
      if (this.data && this.data.id) {
        return 'edit'
      } else {
        return 'add'
      }
    },
    appId() {
      return this.$route.query ? this.$route.query.appId : null
    }
  },
  mounted() {
    if (this.data) {
      this.findById(this.data.id)
    }
  },
  methods: {
    async validateResolve() {
      let resp = {}
      this.btnLoading = true
      this.$emit('update:loading', this.btnLoading)
      if (this.formType === 'add') {
        this.form.tenantId = this.currentTenant
        this.form.code = this.form.name
        this.form.resGroupId = this.groupid
        resp = await this.dispatch(SysVariableController.create, {
          payload: {
            systemVariable: { ...this.form,
              types: this.appId ? 'application' : 'platform',
              appId: this.appId || null,
            }
          }
        })

        this.cancel()
      } else if (this.formType === 'edit') {
        resp = await this.dispatch(SysVariableController.update, {
          payload: {
            systemVariable: this.form
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
    findById(id) {
      const payload = { id: id }
      this.dispatch(SysVariableController.findSystemVariable, payload).then((result) => {
        this.form = result.data
      })
    }
  }
}
</script>
<style></style>
