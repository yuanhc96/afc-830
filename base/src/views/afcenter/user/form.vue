<template>
  <div class="summer">
    <el-form
      :ref="formRef"
      :model="form"
      label-position="top"
      :rules="validateRules"
    >

      <el-row>
        <el-col
          :span="24"
        >
          <el-form-item v-if="formType==='add'" label="用户账号" prop="user.code">
            <el-input v-model="form.user.code" v-focus autocomplete="new-password" />
          </el-form-item>
          <el-form-item v-else label="用户账号" prop="code">
            <el-input v-model="form.code" v-focus :disabled="formType==='edit'" autocomplete="new-password" />
          </el-form-item>
        </el-col>
        <el-col
          v-if="formType==='add'"
          :span="24"
        ><el-form-item label="密码" prop="user.password">
          <el-input
            v-model="form.user.password"
            type="password"
            autocomplete="new-password"
          /> </el-form-item></el-col>
        <el-col
          v-if="formType==='add'"
          :span="24"
        ><el-form-item label="确认密码" prop="checkPass">
          <el-input
            v-model="checkPass"
            type="password"
            autocomplete="off"
          /> </el-form-item></el-col>
        <el-col :span="24">
          <el-form-item v-if="formType==='add'" label="所属员工" prop="user.employeeId">
            <user :options.sync="userOptions" :value.sync="form.user.employeeId" @clear="clearHandler" @success="handleUser" />
          </el-form-item>
          <el-form-item v-else label="所属员工" prop="employeeId">
            <user :options.sync="userOptions" :value.sync="form.employeeId" @clear="clearHandler" @success="handleUser" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="所属员工编号">
            <el-input v-model="selectMember.code" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="所属机构">
            <el-input v-model="selectMember.name" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog
      title="新建人员"
      :visible.sync="visible"
      width="960px"
      append-to-body
      custom-class="employee"
    >
      <el-form
        :ref="formRef"
        label-width="120px"
        class="position-form"
        :model="form"
        :rules="validateRules"
      />
      <span slot="footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSure">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { EmployeeController, LoginManagerController, PositionController, UserController } from '@controller'
// import Position from "./position/index.vue";
import { BaseVue, Form, Validator, _ } from '@lib'
import JSENcrypt from 'jsencrypt'
import user from './components/user.vue'
import model from './model'
export default {
  name: '',
  components: { user },
  mixins: [BaseVue, Form],
  props: {
    dimensionData: {},
    orgData: {},
  },
  data() {
    let codeTimer = null
    const _this = this
    function validater(rule, value, callback, source, options) {
      let api
      if (rule.field === 'code') {
        api = UserController.findUserIsExist
      } else {
        api = UserController.findUserIsExist
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
            callback(new Error(`${value}账号已存在!`))
          }
          callback()
        }
      }, 300)
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.checkPass !== '') {
          this.$refs[formRef].validateField('checkPass')
        }
        callback()
      }
    }
    var validateCheckPass = (rule, value, callback) => {
      if (this.checkPass === '') {
        callback(new Error('请再次输入密码'))
      } else if (this.checkPass !== this.form.user.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      selectMember: {},
      userOptions: [],
      member: { employee: { id: '', name: '' }},
      memberVisible: false,
      isCreate: false,
      visible: false,
      statusOptions: [
        { label: '禁用', value: '0' },
        { label: '正式', value: '1' },
        { label: '试用', value: '2' },
        { label: '临时', value: '3' },
      ],
      genderOptions: [
        { label: '男', value: '0' },
        { label: '女', value: '1' },
      ],
      checkPass: '',
      positionVisible: false,
      query: {
        pageIndex: 0,
        pageSize: 10,
      },
      value: [],
      options: [],
      formRef: 'employeeForm',
      form: { ..._.cloneDeep(model), checkPass: '' },
      model: _.cloneDeep(model),
      validateRules: {
        name: [
          { required: true, message: '请输入员工名称', trigger: 'change' },
        ],
        'user.code': [
          { required: true, message: '请输入用户代码', trigger: 'change' },
          { validator: validater },
        ],
        'user.password': [
          { required: true, message: '请输入用户密码', trigger: 'change' },
          { validator: Validator.passwordPolicy }
        ],
        positionIds: [
          { required: true, message: '请输入岗位', trigger: 'change' },
        ],
        'user.employeeId': [{ required: true, message: '请选择员工', trigger: 'change' }],
        'employeeId': [{ required: true, message: '请选择员工', trigger: 'change' }],
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ required: true, validator: validateCheckPass, trigger: 'blur' }],
      },
    }
  },
  computed: {
    title() {
      return `${this.formType === 'add' ? '新建' : '编辑'}组织维度`
    },
    formType() {
      if (this.formData) {
        return 'edit'
      } else {
        return 'add'
      }
    },
  },
  watch: {
    form: {
      immediate: true,
      deep: true,
      handler: function(value) {

      }
    },
    dialogVisible: {
      immediate: true,
      handler: function(value) {
        if (value) {
          if (this.form) {
            if (this.formType === 'edit') {
              const { orgName, employeeCode, employeeId, name } = this.form
              this.userOptions = [{ id: employeeId, name }]
              this.selectMember = {
                code: employeeCode,
                name: orgName
              }
            }
          }
        } else {
          this.selectMember = {}
        }
      }
    }
  },
  mounted() {},
  methods: {
    clearHandler() {
      this.selectMember = {}
    },
    afterCancel() {
      this.checkPass = ''
    },
    handleUser(user) {
      this.form.employeeId = user.employee.id
      const { code } = user.employee
      const { name } = user.org
      this.selectMember = {
        code, name
      }
    },
    openCreate() {
      this.visible = true
    },
    handleSure() {},
    handleChange(value) {
      this.form.positionIds = value.positionIds
      this.options = value.options
    },
    hidden() {
      this.positionVisible = false
    },
    openAdd() {
      this.positionVisible = true
    },
    rsaKey(publicKey, password) {
      const encrypt = new JSENcrypt()
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
      let resp = {}
      const form = { ...this.form }
      if (this.formType === 'add') {
        let method
        if (this.isCreate) {
          method = EmployeeController.create
        } else {
          method = UserController.create
        }
        const { type, data } = await this.getType()
        let password = ''
        if (type === 'RSA') {
          password = this.rsaKey(data, form.user.password)
        } else if (type === 'SM2') {
          password = sm2Encrypt(form.user.password, data, 0)
        }
        form.user.password = password
        // param.orgId = form.orgId;
        resp = await this.dispatch(method, {
          required: true,
          ...form,
        })
      } else if (this.formType === 'edit') {
        let param = { ...this.form }
        delete param.user
        param = { user: { ...this.form }}
        resp = await this.dispatch(UserController.update, {
          required: true,
          ...param,
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
    // 远程搜索
    async remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        const payload = { ...this.query, name: query }
        const resp = await this.dispatch(
          PositionController.queryPositionsByCriteria,
          payload
        )
        if (!resp.error) {
          this.options = resp.data.data
        }
        this.loading = false
      } else {
        this.options = []
      }
    },
  },
}
</script>
<style lang="scss" scoped>
</style>
