<template>
  <el-tabs v-model="activeName" class="person-tabs">
    <el-tab-pane :label="titleMapping.first" name="first">
      <work-group-form ref="groupForm" class="pt-10" :form-data="form" @submit="emitSuccess" />
    </el-tab-pane>
    <el-tab-pane :label="titleMapping.second" name="second">
      <user-form :work-group-data="form" height="calc(100vh - 335px)" @close="closeHandler" @success="emitSearch" />
    </el-tab-pane>
    <el-tab-pane :label="titleMapping.third" name="third">
      <Role :params="params" :func-code="funcCode" :api-name="apiName" height="calc(100vh - 335px)" @success="emitSearch" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Role from '@/views/afcenter/user/components/roleComponent/index'
import { BaseVue, Form } from '@lib'
import userForm from './user/index.vue'
import workGroupForm from './workGroupForm.vue'
export default {
  name: 'group-tabs',
  components: { 'user-form': userForm, 'work-group-form': workGroupForm, Role },
  mixins: [BaseVue, Form],
  props: {
    dialogTitle: ''
  },
  props: {
    formData: {},
    activeName: 'first',
  },
  data() {
    return {
      titleMapping: {
        'first': '工作组详情',
        'second': '成员信息',
        'third': '角色信息'
      },
      apiName: {
        query: 'WorkGroupController.query',
        delete: 'WorkGroupController.delete',
        create: 'WorkGroupController.create',
      },
      params: {
        query: {},
        delete: {
          path: {},
          key: ''
        },
        create: {
          path: {},
          key: ''
        },
        status: ''
      },
    }
  },
  computed: {
    funcCode() {
      return {
        add: this.FuncCode.afc_f_workgroup_role_add,
        del: this.FuncCode.afc_f_workgroup_role_del,
      }
    },
  },
  watch: {
    formData(value) {
      console.log(value, '===========')
      if (value) {
        this.params.query = {
          workGroupId: value.id
        }
        this.params.delete = {
          path: { workGroupId: value.id },
          key: 'roleIds'
        }
        this.params.create = {
          path: { workGroupId: value.id },
          key: 'roleIds'
        }
        this.params.statusKey = 'userId'
      }
      this.form = { ...value }
    },
    activeName: {
      immediate: true,
      handler(val) {
        this.$emit('update:activeName', val)
        this.$emit('update:dialogTitle', this.titleMapping[val])
      }
    }
  },
  mounted() {},

  methods: {
    closeHandler(value) {
      if (this.$refs.groupForm) {
        if (this.form.managerEmpId === value) {
          this.$refs.groupForm.form.managerEmpId = ''
          this.$refs.groupForm.form.managerEmpName = ''
        }
      }
    },
    emitSearch() {
      this.$emit('search')
    },
    emitSuccess() {
      this.$emit('success')
    },
    handleClick(arg) {
      if (arg.name === 'second') { this.$refs.userForm && this.$refs.userForm.queryEmployeesByWorkGroupId() }
    },
    validateResolve() {
      this.$refs.groupForm && this.$refs.groupForm.submit()
      this.$refs.userForm && this.$refs.userForm.handleEmployees()
    },
    cancel() {
      this.$refs.groupForm && this.$refs.groupForm.cancel()
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__content{
      padding-top:0px;
    }
   ::v-deep  .el-tabs__header{
      display:none;
    }
</style>
