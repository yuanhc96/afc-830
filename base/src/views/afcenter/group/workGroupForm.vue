<template>
  <div>
    <el-form
      :ref="formRef"
      label-width="130px"
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
        >
          <el-form-item label="负责人" prop="managerEmpId">
            <SearchRemoteButton class="w-100p" placeholder="输入人员名称搜索" :value.sync="form.managerEmpId" :options="employeeOpts" @openDetail="openUser" @remoteMethod="remoteUser" />
          </el-form-item></el-col>
        <el-col
          :span="24"
        ><el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
          /> </el-form-item></el-col>
      </el-row>
    </el-form>
    <SelectUser
      v-model="selected"
      :dialog-visible.sync="userDialogVisible"
      @input="handleInput"
    />
  </div>
</template>

<script>
import { EmployeeController, WorkGroupController } from '@controller'
import { BaseVue, Form, _ } from '@lib'
import model from './model'
export default {
  name: '',
  components: {},
  mixins: [BaseVue, Form],
  data() {
    let codeTimer = null
    const _this = this
    function validater(rule, value, callback, source, options) {
      let api
      if (rule.field === 'code') {
        api = WorkGroupController.findWorkGroupIsExist
      } else {
        api = WorkGroupController.findWorkGroupIsExist
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
            callback(new Error(`${value}工作组编号已存在!`))
          }
          callback()
        }
      }, 300)
    }
    return {
      employeeOpts: [],
      userDialogVisible: false,
      options: [],
      formRef: 'groupform',
      form: _.cloneDeep(model),
      model: model,
      validateRules: {
        code: [
          { required: true, message: '请输入工作组编号', trigger: 'change' },
          { validator: validater },
        ],
        name: [
          { required: true, message: '请输入工作组名称', trigger: 'change' },
        ],
      },
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

    selected() {
      if (this.formData) {
        const employee = {
          id: this.formData.managerEmpId,
          name: this.formData.managerEmpName
        }
        return { employee, org: { code: '', name: '' }}
      } else {
        const employee = {
          id: this.form.managerEmpId,
          name: this.form.managerEmpName
        }
        return { employee, org: { code: '', name: '' }}
      }
    }

  },
  watch: {
    formType(value) {
      if (value === 'add') this.form = _.clone(model)
    },
    formData: {
      immediate: true,
      handler: function(value) {
        if (value && value.managerEmpId) {
          this.employeeOpts = [{ id: value.managerEmpId, name: value.managerEmpName }]
        }
      }
    }
  },
  mounted() {},
  methods: {
    clearHandler() {
      this.form.managerEmpName = ''
    },
    handleInput(selected) {
      const { id, name } = selected.employee
      this.form.managerEmpId = id
      this.form.managerEmpName = name
      this.employeeOpts = [selected.employee]
    },
    handleChange(value) {
      this.form.managerEmpName = this.employeeOpts.find((i) => {
        return i.id === value
      }).name
    },
    openUser() {
      // this.formProp=prop
      this.userDialogVisible = true
    },
    // 远程搜索
    async remoteUser(param) {
      if (!param) return
      const query = {
        pageIndex: 0,
        pageSize: 99,
        name: param,
      }
      const resp = await this.dispatch(
        EmployeeController.queryEmployeesByTenantId,
        query
      )
      if (!resp.error) {
        this.options = resp.data.data
      }
    },
    async validateResolve() {
      let resp = {}
      if (this.formType === 'add') {
        resp = await this.dispatch(WorkGroupController.create, {
          required: true,
          workGroup: {
            ...this.form,
          },
        })
        this.cancel()
      } else if (this.formType === 'edit') {
        resp = await this.dispatch(WorkGroupController.update, {
          required: true,
          workGroup: {
            ...this.form,
          },
        })
      }
      if (!resp.error) {
        this.$emit('submit')
        this.$msg.success('保存成功!')
        return true
      } else {
        return false
      }
    },
  },
}
</script>
<style></style>
