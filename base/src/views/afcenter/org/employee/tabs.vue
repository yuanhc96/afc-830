<template>
  <el-tabs v-model="tabName" @tab-click="handleClick">
    <el-tab-pane label="基本信息" name="base">
      <baseFrom
        :ref="tabName"
        class="person-base-tabs"
        :is-root-node="isRootNode"
        :disabled="disabled"
        :form-data="form"
        :org-data="orgData"
        mode="all"
        style="margin-top: 0"
        @success="handleEmit"
      />
    </el-tab-pane>
    <el-tab-pane label="账号信息" name="account">
      <Account class="pt-10" :user-data="form" />
    </el-tab-pane>
    <el-tab-pane lazy label="岗位设置" name="position">
      <positionList
        ref="position"
        :is-root-node="isRootNode"
        :func-code="positionCode"
        :dialogquery-fun="positionqueryFun"
        :employee-code="employeeCode"
        :retain="true"
        :inner-visible="dialogVisible"
        :position-search="positionSearch"
        :params="positionParam"
        :api-name="positionApi"
        height="calc(100vh - 450px)"
        :data="form"
        :org-data="orgData"
        :user-id="userId"
        :show-pb20="false"
        style="margin-top: -10px"
      />
    </el-tab-pane>
    <el-tab-pane label="角色设置" name="role">
      <Role
        ref="role"
        :func-code="roleCode"
        :org-data="orgData"
        :dialogquery-fun="dialogqueryFun"
        :params="params"
        :api-name="apiName"
        height="calc(100vh - 450px)"
        style="margin-top: -10px"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Role from '@/views/afcenter/user/components/roleComponent/index'
import { OrgController } from '@controller'
import { BaseVue, Form, _ } from '@lib'
import Account from './account.vue'
import baseFrom from './form'
import info from './info.vue'
import positionList from './position/index.vue'
import roleList from './role/index.vue'
export default {
  provide() {
    return {
      elForm: this,
    }
  },
  inject: ['parentRef'],
  name: 'employee-tabs',
  components: { baseFrom, info, positionList, roleList, Role, Account },
  mixins: [BaseVue, Form],
  props: {
    disabled: {
      default: function() {
        return false
      },
    },
    formData: {},
    orgData: {},
    tabName: {
      default: 'base'
    },
    dialogVisible: {
      default: function() {
        return false
      },
    },
    employeeData:{
      type:Object,
      default:()=>{}
    },
    dimensionData:{
      type:Object,
      default:()=>{}
    },
    isRootNode: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      apiName: {
        query: 'EmployeeController.query',
        delete: 'EmployeeController.delete',
        create: 'EmployeeController.create',
      },
      positionParam: {
        employeeId: '',
        orgId: '',
        type: 'obj',
        create: {},
        delete: {},
        query: {},
      },
      positionApi: {
        query: 'employeeQuery',
        delete: 'employeeDelete',
        create: 'employeeCreate',
      },
      params: {
        query: {},
        delete: {
          path: {},
          key: '',
        },
        create: {
          path: {},
          key: '',
        },
        status: '',
      },
      isAble: false,
      userId: '',
      activeName: 'base',
    }
  },
  computed: {
    positionCode() {
      return {
        add: this.FuncCode.afc_f_org_employee_position_add,
        del: this.FuncCode.afc_f_org_employee_position_del,
        mainPot: this.FuncCode.afc_f_org_employee_position_switch_main,
      }
    },
    roleCode() {
      return {
        add: this.FuncCode.afc_f_employee_role_add,
        del: this.FuncCode.afc_f_employee_role_del,
      }
    },
    employeeCode(){
      return this.employeeData.code
    }
  },
  watch: {
    formData: {
      immediate: true,
      handler: function(value) {
        if (value) {
          this.params.query = {
            employeeId: value.id,
          }
          this.params.delete = {
            path: { employeeId: value.id },
            key: 'roleIds',
          }
          this.params.create = {
            path: { employeeId: value.id },
            key: 'roleIds',
          }
          this.params.statusKey = 'userId'
          // 参数封装
          this.positionParam.create.body = {
            orgId: this.orgData.id,
            employeeId: value.id,
          }
          this.positionParam.create.key = 'positionIds'
          this.positionParam.delete.body = {
            orgId: this.orgData.id,
            employeeId: value.id,
          }
          this.positionParam.delete.key = 'positionIds'
          this.positionParam.query = {
            employeeId: value.id,
            orgId: this.orgData.id,
          }
          this.form = _.cloneDeep(this.formData)
        }
      },
    },
    dialogVisible(value) {
      if (!value) {
        this.$refs.position && this.$refs.position.resetQuery()
      }
    }
  },
  mounted() {},
  methods: {
    async positionqueryFun(param) {
      const nodeArr = this.parentRef.tree.getNodePath(
        this.$refs['position'].orgData.id
      )
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
    async dialogqueryFun(param) {
      const nodeArr = this.parentRef.tree.getNodePath(
        this.$refs['role'].orgData.id
      )
      let orgId = ''
      if (nodeArr.length) {
        orgId = nodeArr[0].id
      }
      const payload = { ...param, orgId }
      const resp = await this.$refs['role'].dispatch(
        OrgController.queryRolesToTree,
        payload
      )
      return resp
    },
    async positionSearch(param) {
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
    handleEmit() {
      this.$emit('success')
    },
    handleClick({ name }) {
      this.$emit('update:tabName', name)
    },
    async submit() {
      await this.$refs[this.tabName].submit()
    },
    validateResolve() {
      this.$refs.userForm && this.$refs.userForm.handleEmployees()
    },
  },
}
</script>

<style lang="scss" scoped>
.person-base-tabs {
  height: calc(100vh - 377px);
  overflow-y: auto;
  overflow-x: hidden
}
</style>
