<template>
  <div class="m-10">
    <el-form
      :ref="formRef"
      :model="form"
      :rules="validateRules"
      :disabled="disabled"
      label-position="top"
      data-testId="员工表单"
    >
      <div
        style="
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-column-gap: 22px;
        "
      >
        <div>
          <el-form-item
            v-if="formType === 'add'"
            label="编号"
            prop="employeeCode"
          >
            <el-input v-model="form.employeeCode" @input="inputChange" />
          </el-form-item>
          <el-form-item v-else label="编号">
            <el-input
              v-model="form.code"
              :disabled="formType === 'edit'"
              @input="inputChange"
            />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
        </div>
        <div>
          <el-form-item
            v-if="formType === 'add'"
            label="岗位"
            prop="positionIds"
          >
            <SearchRemoteButton
              :multiple="true"
              :value.sync="form.positionIds"
              :options.sync="options"
              placeholder="输入机岗位名称搜索"
              :loading.sync="loading"
              @openDetail="openAdd"
              @remoteMethod="remoteMethod"
            />
          </el-form-item>
        </div>
        <div>
          <el-form-item v-if="formType === 'add'" label="账号" prop="code">
            <el-input v-model="form.code" v-focus autocomplete="new-password" />
          </el-form-item>
        </div>
        <div v-if="formType === 'add'">
          <el-form-item label="密码" prop="password">
            <el-input
              v-model.trim="form.password"
              show-password
              autocomplete="new-password"
              data-testId="员工表单密码项"
            />
          </el-form-item>
        </div>
        <div v-if="formType === 'add'">
          <!-- data-testId="员工表单确认密码项" -->
          <el-form-item label="确认密码" prop="checkPass">
            <el-input
              v-model.trim="checkPass"
              show-password
              autocomplete="off"
            />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="性别" prop="gender">
            <Dict v-model="form.gender" dicttypeid="gender" />
          </el-form-item>
        </div>

        <div>
          <el-form-item label="电话" prop="phoneNumber">
            <el-input v-model="form.phoneNumber" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="所属机构">
            <SearchRemoteButton
              :multiple="isRootNode"
              :collapse-tags="false"
              :disabled="isRootNode"
              :loading="loading"
              :options="orgOpt"
              placeholder="输入机构名称搜索"
              :value.sync="form.orgId"
              @openDetail="openOrg"
              @remoteMethod="searchOrg"
            />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="工作地点" prop="oAddress">
            <el-input v-model="form.oAddress" />
          </el-form-item>
        </div>

        <div>
          <el-form-item label="邮件" prop="pemail">
            <el-input v-model="form.pEmail" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="工作电话" prop="oTel">
            <el-input v-model="form.oTel" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="证件类型" prop="cardType">
            <Dict v-model="form.cardType" dicttypeid="sys_card_type" />
          </el-form-item>
        </div>

        <div>
          <el-form-item label="证件号码" prop="cardNumber">
            <el-input v-model="form.cardNumber" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="入职日期" prop="inDate">
            <el-date-picker
              v-model="form.inDate"
              type="date"
              style="width: 100%"
              placeholder="选择日期"
            />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="排序" prop="sortBy">
            <el-input v-model="form.sortBy" :min="1" type="number" />
          </el-form-item>
        </div>
      </div>
      <div>
        <el-form-item label="备注" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="2" />
        </el-form-item>
      </div>
    </el-form>
    <SelectTypes
      ref="position"
      :active-name="type"
      :position-search="positionqueryFun"
      :dialog-visible.sync="positionVisible"
      title="选择岗位"
      :is-multiple="true"
      :party-types="objectType"
      @sure="successHandler"
    />
    <!-- <Position
      ref="position"
      :org-data="orgData"
      :data="formData"
      :dialogqueryFun="positionqueryFun"
      :visible.sync="positionVisible"
      @success="successHandler"
    /> -->
    <SelectTypes
      :active-name="type"
      :dialog-visible.sync="partyVisible"
      title="选择组织机构"
      :is-multiple="isRootNode"
      :party-types="objectType"
      @sure="handleSuccess"
    />
  </div>
</template>

<script>
import {
  EmployeeController,
  LoginManagerController,
  OrgController,
  PositionController,
  UserController,
} from '@controller'
import { BaseVue, Form, Validator, _ } from '@lib'
import JSENcrypt from 'jsencrypt'
import { mapGetters } from 'vuex'
import { employee, model, user } from './model'
import Position from './position/components/index.vue'
export default {
  name: '',
  components: { Position },
  inject: ['parentRef'],
  mixins: [BaseVue, Form],
  props: {
    dimensionData: {},
    orgData: {},
    disabled: {
      default: function() {
        return false
      },
    },
    isRootNode: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String, // ‘all’展示用户全部信息
      default: '',
    },
  },
  data() {
    const _this = this
    function validater(rule, value, callback, source, options) {
      let api
      let message
      if (rule.field === 'code') {
        message = '账号已存在'
        api = UserController.findUserIsExist
      }
      if (rule.field === 'employeeCode') {
        message = '用户编号已存在'
        api = EmployeeController.findEmployeeIsExist
      }
      const codeTimer = setTimeout(async() => {
        if (!value || _this.formType == 'edit') {
          callback()
        } else {
          const count = await _this.dispatch(api, { code: value })
          if (count.data) {
            clearTimeout(codeTimer)
            callback(new Error(`${value}${message}!`))
          }
          clearTimeout(codeTimer)
          callback()
        }
        // }
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
      } else if (this.checkPass !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dicttypeid: 'sys_party_types',
      partyVisible: false,
      objectType: [],
      type: '',
      orgOpt: [],
      statusOptions: [
        { label: '禁用', value: '0' },
        { label: '启用', value: '1' },
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
      remoteQuery: '',
      formRef: 'employeeForm',
      form: _.cloneDeep(model),
      model: model,
      validateRules: {
        code: [
          { required: true, message: '请输入用户代码', trigger: 'change' },
          { validator: validater },
        ],
        employeeCode: [
          { required: true, message: '请输入员工编号', trigger: 'change' },
          { validator: validater },
        ],
        name: [
          { required: true, message: '请输入员工名称', trigger: 'change' },
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'change' },
          { validator: Validator.passwordPolicy },
        ],
        positionIds: [
          { required: true, message: '请输入岗位', trigger: 'change' },
        ],
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [
          { required: true, validator: validateCheckPass, trigger: 'blur' },
        ],
        phoneNumber: [
          { message: '请输入手机号码', trigger: 'change' },
          { validator: Validator.telNumber },
        ],
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
    ...mapGetters(['dicts']),
  },
  watch: {
    positionVisible(val) {
      val && this.getDicts(this.dicts, val)
    },
    partyVisible(val) {
      val && this.getDicts(this.dicts, !val)
    },
    type: {
      immediate: true,
      handler(val) {
        if (val) {
          this.typeObject = this.objectType.filter((item) => {
            if (item.code == val) {
              return [item]
            }
          })
        }
      },
    },
    formType(value) {
      if (value === 'add') this.form = _.clone(model)
      if (value === 'edit') {
        const employee = { ...this.form }
        this.$set(this.form, 'employee', employee)
      }
    },
    orgData: {
      immediate: true,
      deep: true,
      handler(val) {
        const orgs = this.obj2Arr(val)
        this.orgOpt = orgs.map((item) => {
          return { id: item.id, name: item.name }
        })
        const arr = orgs.map((item) => {
          return item.id
        })
        this.form.orgId = this.isRootNode ? arr : arr.join('')
      },
    },
    // 表单修改时，修改组织机构回显
    form: {
      immediate: true,
      handler: function(val) {
        const orgs = this.obj2Arr(this.orgData)
        this.orgOpt = orgs.map((item) => {
          return { id: item.id, name: item.name }
        })

        const arr = orgs.map((item) => {
          return item.id
        })
        this.form.orgId = this.isRootNode ? arr : arr.join('')
      },
    },
    'form.positionIds': {
      immediate: true,
      handler(val) {
        if (!this.remoteQuery) {
          this.options = this.options.filter((item) =>
            val.some((i) => i === item.id)
          )
        }
      },
    },
  },
  mounted() {
    this.loadDict()
  },
  methods: {
    getDicts(val, visible) {
      if (val) {
        const objectType = this.dicts[this.dicttypeid] || []
        this.objectType = objectType.filter((item) => {
          if (item.code == (visible ? 'position' : 'org')) {
            return item
          }
        })
        if (this.objectType.length > 0) {
          const dictType = {}
          this.objectType.forEach((item) => {
            dictType[item.code] = item.name
          })
          this.dictType = dictType
          this.type = this.objectType[0].code
        }
      }
    },
    async positionqueryFun(param) {
      const nodeArr = this.parentRef.tree.getNodePath(this.orgData.id)
      let orgId = ''
      if (nodeArr.length) {
        orgId = nodeArr[0].id
      }
      const payload = { ...param, orgId }
      const resp = await this.$refs['position'].dispatch(
        OrgController.queryPositionsToTree,
        payload
      )
      return resp
    },
    async loadDict() {
      if (!this.dicttypeid) {
        return
      }
      if (!this.dicts.hasOwnProperty(this.dicttypeid)) {
        this.$store.commit('ADD_DICT', { key: this.dicttypeid, value: null })
        const resp = await this.dispatch(
          DictTypeController.queryDictTypesByCriteria,
          {
            code: this.dicttypeid,
            tenantId: this.currentTenant,
          }
        )
        if (!resp.error) {
          this.$store.commit('ADD_DICT', {
            key: this.dicttypeid,
            value: resp.data.data.length ? resp.data.data[0].dictEntrys : [],
          })
        }
      }
    },
    afterCancel() {
      this.checkPass = ''
    },
    successHandler(arr) {
      this.options = arr
      this.$nextTick(() => {
        this.form.positionIds = arr.map((i) => {
          return i.id
        })
      })
      this.positionVisible = false
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
      const param = { orgId: '', positionIds: [], employee: {}, user: {}}
      if (this.formType === 'add') {
        form.orgId = this.orgData.id
        for (const key in form) {
          if (Object.hasOwnProperty.call(form, key)) {
            const element = form[key]
            if (employee.hasOwnProperty(key)) {
              param.employee[key] = element
            } else if (user.hasOwnProperty(key)) {
              param.user[key] = element
            }
          }
        }
        param.positionIds = form.positionIds
        param.employee.code = form.employeeCode
        param.orgId = form.orgId
        const { type, data } = await this.getType()
        let password = ''
        if (type === 'RSA') {
          password = this.rsaKey(data, param.user.password)
        } else if (type === 'SM2') {
          password = sm2Encrypt(param.user.password, data, 0)
        }
        param.user.password = password
        if (!param.employee.inDate) {
          delete param.employee.inDate
        }
        if (!param.employee.outDate) {
          delete param.employee.outDate
        }
        resp = await this.dispatch(EmployeeController.create, {
          required: true,
          ...param,
        })
      } else if (this.formType === 'edit') {
        for (const key in form) {
          if (Object.hasOwnProperty.call(form, key)) {
            const element = form[key]
            if (employee.hasOwnProperty(key)) {
              param.employee[key] = element
            }
          }
        }
        param.positionIds = form.positionIds
        param.orgId = form.orgId
        param.oldOrgId = this.orgData.id
        param.employee.code = form.code
        delete param.employeeCode
        delete param.user

        resp = await this.dispatch(EmployeeController.update, {
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
      this.remoteQuery = query
      if (query !== '') {
        this.loading = true
        const nodeArr = this.parentRef.tree.getNodePath(this.orgData.id)
        let orgId = ''
        if (nodeArr.length) {
          orgId = nodeArr[0].id
        }
        const payload = { ...this.query, name: query, orgId }
        const resp = await this.dispatch(
          OrgController.queryPositionsToTree,
          payload
        )
        if (!resp.error) {
          const options = _.unionBy(this.options.concat(resp.data.data), 'id')
          this.options = _.cloneDeep(options)
        }
        this.loading = false
      } else {
        this.options = this.options.filter((item) =>
          this.form.positionIds.some((i) => i === item.id)
        )
      }
    },
    async searchOrg(query) {
      if (query !== '') {
        this.loading = true
        const payload = { ...this.query, name: query }
        const resp = await this.dispatch(
          PositionController.queryPositionsByCriteria,
          payload
        )
        if (!resp.error) {
          this.orgOpt = resp.data.data
        }
        this.loading = false
      } else {
        this.orgOpt = []
      }
    },
    openOrg() {
      this.partyVisible = true
    },
    handleSuccess(arr) {
      if (arr.length > 0) {
        const { id, name } = arr.pop()
        this.form.orgId = id
        this.form.orgName = name
        this.orgOpt = [{ id, name }]
      }
    },
    obj2Arr(obj) {
      if (Array.isArray(obj)) {
        return obj
      } else {
        return [obj]
      }
    },
  },
}
</script>
<style></style>
