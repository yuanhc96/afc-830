<template>
  <pm-dialog
    :visible.sync="dialogVisible"
    width="460px"
    :title="title"
    :inline="true"
    :show-close="showClose"
    okText="确定"
    class="body-no-padding">
    <el-form :ref="formRef" class="standard-form" :model="form" label-position="top" :rules="validateRules" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="登录用户名" prop="userId">
            <el-input v-focus v-model.trim="userInfo.userName" disabled class="w-100p" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="原密码" prop="password">
            <el-input v-model.trim="form.password" class="w-100p" auto-complete="new-password" type="password" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="新密码" prop="newPassword">
            <el-input
              v-model.trim="form.newPassword"
              class="w-100p"
              auto-complete="new-password"
              type="password"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="确认密码" prop="rePassword">
            <el-input v-model="form.rePassword" class="w-100p" auto-complete="new-password" type="password" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer">
      <el-button v-if="showClose" @click="cancel" size="mini">取消</el-button>
      <el-button @click="submit" :loading="loading" size="mini" type="primary">确定</el-button>
    </span>
  </pm-dialog>
</template>
<script>
import { LoginManagerController, UserController } from '@controller'
import { BaseVue, Form, Validator, VueUtil, _ } from '@lib'
import store from '@util/sessionStore'
import JSENcrypt from 'jsencrypt'

const model = {
  userId: null,
  password: null,
  newPassword: null,
  rePassword: null,
}
export default {
  components: {},
  mixins: [BaseVue, Form],
  props: {
    dialogVisible: {
      default: false,
      type: Boolean
    },
    showClose: {
      type: Boolean,
      default: true
    }
  },
  data() {
    let passwordTimer = null
    return {
      formRef: 'form',
      validateRules: {
        password: [
          { required: true, message: '原密码是必填项' }
        ],
        newPassword: [
          { required: true, message: '新密码是必填项' },
          { validator: (rule, value, callback, source, options) => {
            if (passwordTimer !== null) {
              clearTimeout(passwordTimer)
            }
            passwordTimer = setTimeout(() => {
              if (!!value && value === this.form.password) {
                callback(`新密码与原密码一致`)
              } else {
                callback()
              }
            }, 300)
          } },
          { validator: Validator.passwordPolicy },
        ],
        rePassword: [
          {
            validator: (rule, value, callback, source, options) => {
              var errors = []
              if (value !== this.form.newPassword) {
                callback('两次密码输入不一致')
              }
              callback(errors)
            }, required: true
          },
          { required: true, message: '确认密码是必填项' }
        ],
      },
      model: {},
      form: _.cloneDeep(model),
    }
  },
  computed: {
    ...VueUtil(this)
      .select([UserController])
      .state(),
    title() {
      return `修改密码`
    },
    
    loading() {
      return this.UserController.updatePassword.loading
    }
  },
  watch: {
    dialogVisible(val) {
      this.$emit('dialogVisible:update', val)
    }
  },
  methods: {
    async validateResolve() {
      const { type, data } = await this.getType()
      let password = ''
      let newPassword = ''
      if (type === 'RSA') {
        password = this.rsaKey(data, this.form.password)
        newPassword = this.rsaKey(data, this.form.newPassword)
      } else if (type === 'SM2') {
        password = sm2Encrypt(this.form.password, data, 0)
        newPassword = sm2Encrypt(this.form.newPassword, data, 0)
      }
      const resp = await this.dispatch(UserController.updatePassword, {
        oldUser: {
          'id': this.userInfo.userId,
          'password': password
        },
        newUser: {
          'id': this.userInfo.userId,
          'code': this.userInfo.code,
          'password': newPassword
        }
      })
      if (!resp.error) {
        store.set('passwordPolicy', {
          flag: false,
          message: ''
        })
        this.$emit('success')
        this.cancel()
        // 让用户登出重新登陆
        this.$confirm('密码修改成功,请重新登录', '提示', {
          confirmButtonText: '确定',
          closeOnClickModal: false,
          showCancelButton: false, //不显示取消按钮
          showClose: false,
          center: true,
          type: 'warning',
        })
          .then(async () => {
            this.$store.dispatch('LogOut').then(() => {
              this.$router.push({ name: 'login' })
            })
          })
      }
    },
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
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-form {
    padding: 10px 20px 30px 20px!important;
  }
</style>
