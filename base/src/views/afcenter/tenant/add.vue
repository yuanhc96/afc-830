<template>
  <pm-form-dialog
    :dialogVisible.sync="dialogVisible"
    width="640px"
    :title="title"
    :inline="true"
    :loading="loading"
    okText="确定">
    <el-form :ref="formRef" slot="form" :rules="rules" :model="form" class="scroll-form" label-position="top" >
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="divide-bar">
            <span>租户</span>
          </div>
        </el-col>
        <el-col :span="12">
          <el-form-item label="租户编号" prop="code">
            <el-input v-focus v-model.trim="form.code" :disabled="disabled" :maxlength="25" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="租户名称" prop="name">
            <el-input v-model.trim="form.name" clearable :maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="默认公司名称" prop="orgName">
            <el-input v-model.trim="form.orgName" clearable :maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-row>
                <el-radio label="1">启用</el-radio>
                <el-radio label="0">禁用</el-radio>
              </el-row>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!-- <el-col v-show="showtypes">
          <el-form-item label="类型" prop="types" style="width: 630px;">
            <Dict
              v-model="form.types"
              placeholder="..."
              dicttypeid="sys_tenant_types"
            />
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="divide-bar">
            <span>租户管理员</span>
          </div>
        </el-col>
        <el-col :span="12">
          <el-form-item label="管理员账号" prop="user.code">
            <el-input v-model.trim="form.user.code" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="管理员名称" prop="employee.name">
            <el-input v-model.trim="form.employee.name" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="管理员密码" prop="user.password">
            <el-input v-model.trim="form.user.password" clearable auto-complete="new-password" type="password" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="确认密码" prop="surePassword">
            <el-input v-model.trim="form.surePassword" clearable auto-complete="new-password" type="password" />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="描述">
            <el-input v-model="form.description" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </pm-form-dialog>
</template>
<script>
import { LoginManagerController, TenantController, UserController } from '@controller'
import { BaseVue, Form, Validator, VueUtil, _ } from '@lib'
import JSENcrypt from 'jsencrypt'
// import { mapGetters } from 'vuex'
import model from './model'
export default {
  name: 'tenant-add',
  mixins: [BaseVue, Form],
  props: {
  },
  data() {
    let codeTimer = null
    let passwordTimer = null
    let userCodeTimer = null
    return {
      formRef: 'tenantForm',
      rules: {
        code: [
          { required: true, message: '租户编号是必填项' },
          { validator: (rule, value, callback, source, options) => {
            if (codeTimer !== null) {
              clearTimeout(codeTimer)
            }
            codeTimer = setTimeout(async() => {
              if (!value) {
                callback()
              } else {
                const count = await this.dispatch(TenantController.isExist, { code: value })
                if (!this.disabled && count.data) {
                  callback(new Error(`${value}租户编号已存在!`))
                }
                callback()
              }
            }, 300)
          } }
        ],
        name: [
          { required: true, message: '租户名称是必填项' },
        ],
        orgName: [
          { required: true, message: '公司名称是必填项' },
        ],
        ['employee.name']: [
          { required: true, message: '管理员名称是必填项' },
        ],
        ['user.code']: [
          { required: true, message: '管理员账号是必填项' },
          { validator: (rule, value, callback, source, options) => {
            if (userCodeTimer !== null) {
              clearTimeout(userCodeTimer)
            }
            userCodeTimer = setTimeout(async() => {
              if (!value) {
                callback()
              } else {
                const count = await this.dispatch(UserController.findUserIsExist, { code: value })
                if (!this.disabled && count.data) {
                  callback(new Error(`${value}管理员账号已存在!`))
                }
                callback()
              }
            }, 300)
          } }
        ],
        ['user.password']: [
          { required: true, message: '管理员密码是必填项' },
          { validator: Validator.passwordPolicy },
        ],
        surePassword: [
          { required: true, message: '确认密码是必填项' },
          { validator: (rule, value, callback, source, options) => {
            if (passwordTimer !== null) {
              clearTimeout(passwordTimer)
            }
            passwordTimer = setTimeout(async() => {
              if (value && value !== this.form.user.password) {
                callback(new Error(`确认密码与管理员密码一致`))
              } else {
                callback()
              }
            }, 300)
          } }
        ],
      },
      model: model,
      form: _.cloneDeep(model),
      // showtypes: false
    }
  },
  computed: {
    ...VueUtil(this)
      .select([LoginManagerController, TenantController, UserController])
      .state(),
    // ...mapGetters(['dicts']),
    title() {
      return `${this.formType === 'add' ? '新建租户' : '编辑租户'}`
    },
    formType() {
      return this.form && this.form.id ? 'edit' : 'add'
    },
    disabled() {
      return this.formType === 'edit'
    },
    loading() {
      return this.TenantController.create.loading || this.TenantController.update.loading
    }
  },
  watch: {
    // dicts: {
    //   immediate: true,
    //   deep: true,
    //   handler(val) {
    //     if (val && val.sys_tenant_types) {
    //       this.showtypes = !!val.sys_tenant_types.length
    //     }
    //   }
    // }
  },
  mounted() {
  },
  methods: {
    rsaKey(publicKey, password) {
      let encrypt = new JSENcrypt()
      encrypt.setPublicKey(publicKey)
      return encrypt.encrypt(password)
    },
    async getType() {
      const res = await this.dispatch(LoginManagerController.getPasswordKey, {})
      if (!res.error) {
        return res.data
      }
    },
    async validateResolve() {
      this.switchScreenLoading(true)
      let resp = {}
      const form = _.cloneDeep(this.form)
      const user = _.cloneDeep(this.form.user)
      const employee = _.cloneDeep(this.form.employee)
      delete form.surePassword
      delete form.user
      delete form.employee
      if (this.formType === 'add') {
        const { type, data } = await this.getType()
        let password = ""
        if (type === 'RSA') {
          password = this.rsaKey(data, user.password)
        } else if (type === 'SM2') {
            password = sm2Encrypt(user.password, data, 0)
        }
        user.password = password
        resp = await this.dispatch(TenantController.create, {
            tenant: {
              ...form,
              createby: this.userInfo.userName
            },
            employee: employee,
            user: user
        })
      }
      // else if (this.formType === 'edit') {
      //   resp = await this.dispatch(TenantController.update, {
      //     tenant: form,
      //     user: user
      //   })
      // }
      if (!resp.error) {
        this.$msg.success('提交成功！')
        this.$emit('success')
        this.cancel()
      }
      this.switchScreenLoading(false)
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-radio {
    padding-right: 15px;
  }
  .scroll-form {
    margin-bottom: -31px;
  }
</style>