<template>
  <pm-form-dialog
    :dialogVisible.sync="dialogVisible"
    width="800px"
    title="执行一次"
    :inline="true"
    :loading="loading"
    okText="确定">
    <el-form :ref="formRef" slot="form" :rules="rules" :model="form" class="scroll-form" label-width="120px">
      <el-row>
        <el-col :span="22">
          <el-form-item label="任务参数" prop="executorParam">
            <el-input v-focus type="textarea" v-model.trim="form.executorParam" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="机器地址" prop="addressList">
            <el-input type="textarea" v-model.trim="form.addressList" placeholder="请输入本次执行的机器地址，为空则从执行器获取" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </pm-form-dialog>
</template>
<script>
import { JobInfoController } from '@controller'
import { BaseVue, Form, VueUtil, _ } from '@lib'
export default {
  name: 'trigger',
  mixins: [BaseVue, Form],
  props: {
    triggerId:{
      type: String,
      default: ''
    }
  },
  data() {
    const form = {
      id: null,
      executorParam: '',
      addressList: ''
    }
    return {
      formRef: 'triggerForm',
      rules: {},
      form: _.cloneDeep(form)
    }
  },
  computed: {
    ...VueUtil(this)
      .select([JobInfoController])
      .state(),
    loading() {
      return this.JobInfoController.triggerJob.loading
    }
  },
  methods: {
    async validateResolve() {
      const resp = await this.dispatch(JobInfoController.triggerJob, {...this.form, id: this.triggerId})
      const { code, msg } = resp.data
      if (code === 200) {
        this.$msg.success('执行成功')
        this.$emit('success')
        this.cancel()
      } else {
        this.$msg.error(msg)
      }
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