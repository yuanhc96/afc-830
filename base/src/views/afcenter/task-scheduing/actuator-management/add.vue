<template>
  <pm-form-dialog
    :dialogVisible.sync="dialogVisible"
    width="480px"
    :title="title"
    :inline="true"
    :loading="loading"
    okText="确定">
    <el-form :ref="formRef" slot="form" label-position="top" :rules="rules" :model="form" class="scroll-form" label-width="130px">
      <el-row v-if="this.formType === 'add'">
        <el-col>
          <el-form-item label="创建模式">
            <el-radio-group v-model="createType">
              <el-radio label="app">应用</el-radio>
              <el-radio label="custom">自定义</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="createType === 'app' && formType === 'add'" class="mb-50">
        <el-col >
          <el-form-item label="所属应用" prop="appname">
            <el-select v-model="form.appname" style="width:100%" placeholder="">
              <el-option
                v-for="item in apps"
                :key="item.code"
                :label="item.code"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-form-item label="执行器编码" prop="appname">
          <el-input v-model.trim="form.appname" clearable />
          </el-form-item>
        <el-col>
          <el-form-item label="执行器名称" prop="title">
            <el-input v-model.trim="form.title" clearable />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="注册方式" prop="addressType">
            <el-radio-group v-model="form.addressType" @input="inputAddress">
              <el-radio :label="0">自动注册</el-radio>
              <el-radio :label="1">手动录入</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col class="mb-50">
          <el-form-item label="机器地址" prop="addressList">
            <el-input
              v-model.trim="form.addressList"
              type="textarea"
              placeholder="请输入执行器地址列表，多地址逗号分隔"
              :disabled="form.addressType === 0"
              clearable />
          </el-form-item>
        </el-col>
      </el-row>
        
    </el-form>
  </pm-form-dialog>
</template>
<script>
import { AppController, JobGroupController } from '@controller'
import { BaseVue, Form, VueUtil, _ } from '@lib'
// import { mapGetters } from 'vuex'
import model from './model'
export default {
  name: 'actuator-add',
  mixins: [BaseVue, Form],
  props: {
  },
  data() {
    let addressListTimer = null
    return {
      formRef: 'actuatorForm',
      rules: {
        appname: [
          { required: true, message: 'AppName是必填项' },
          // { min: 4, max: 64, message: '名称长度限制为4~64'}
        ],
        title: [
          { required: true, message: '执行器名称是必填项' },
          // { min: 4, max: 12, message: '名称长度限制为4~12'}
        ],
        addressList: [
          { validator: (rule, value, callback, source, options) => {
            if (addressListTimer !== null) {
              clearTimeout(addressListTimer)
            }
            addressListTimer = setTimeout(async() => {
              if (!value && this.form.addressType === 1) {
                callback('机器地址是必填项')
              } else {
                callback()
              }
            }, 300)
          } }
        ]
      },
      model: model,
      form: _.cloneDeep(model),
      createType: 'app',
      apps: [],
      appObj: null
    }
  },
  computed: {
    ...VueUtil(this)
      .select([JobGroupController])
      .state(),
    // ...mapGetters(['dicts']),
    title() {
      return `${this.formType === 'add' ? '新建执行器' : '编辑执行器'}`
    },
    formType() {
      return this.form && this.form.id ? 'edit' : 'add'
    },
    loading() {
      return this.JobGroupController.save.loading || this.JobGroupController.update.loading
    }
  },
  watch: {
    // dialogVisible: {
    //   immediate: true,
    //   handler(val) {
    //     if (val) {
    //       if (this.form.title) {
    //         this.createType = 'custom'
    //       } else {
    //         this.createType = 'app'
    //       }
    //     }
    //   }
    // }
  },
  mounted() {
    this.getApps()
  },
  methods: {
    async validateResolve() {
      let resp = {}
      let form = _.cloneDeep(this.form)
      if (this.formType === 'add') {
        if (this.createType === 'app') {
          const app = this.apps.filter(a => a.code === form.appname) || []
          form.title = app[0]?.name
        }
        console.log(this.form, form)
        resp = await this.dispatch(JobGroupController.save, form)
      } else if (this.formType === 'edit') {
        delete form.registryList
        delete form.updateTime
        resp = await this.dispatch(JobGroupController.update, form)
      }
      if (!resp.error) {
        this.$msg.success('保存成功！')
        this.$emit('success')
        this.cancel()
      }
    },
    inputAddress(val) {
      if (val === 0) {
        this.form.addressList = null
      }
    },
    async getApps() {
      const paload = {
        pageIndex: 0,
        pageSize: -1,
        tenantId: this.currentTenant
      }
      const resp = await this.dispatch(AppController.queryAppsByCriteria, paload)
      if (!resp.error) {
        this.apps = resp.data.data
      }
    }
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