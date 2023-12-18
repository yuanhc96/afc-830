<template>
  <pm-dialog
    :visible.sync="dialogVisible"
    :show-close="cancel"
    width="480px"
    title="日志清理"
    :inline="true"
    :loading="loading"
    >
    <el-form  label-position="top" :ref="formRef" :model="clearForm" label-width="120px">
      <el-row :gutter="22">
        <el-col :span="24">
          <el-form-item label="执行器" prop="jobGroup">
            <el-select v-model="clearForm.jobGroup" style="width:100%" @change="getJobInfos(clearForm.jobGroup)">
              <el-option
                v-for="item in jobGroups"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="任务" prop="jobInfos">
            <el-select v-model="clearForm.jobId" style="width:100%">
              <el-option
                v-for="item in jobInfos"
                :key="item.id"
                :label="item.jobDesc"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="mb-20">
          <el-form-item label="清理方式" prop="type">
            <el-select v-model="clearForm.type" style="width:100%">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer">
        <el-button @click="cancel" size="mini">取消</el-button>
        <el-button @click="submitSave" type="primary" size="mini">确定</el-button>
      </span>
  </pm-dialog>
</template>
<script>
import { JobInfoController, JobLogController } from '@controller'
import { BaseVue, Form, VueUtil, _ } from '@lib'
export default {
  name: 'trigger',
  mixins: [BaseVue, Form],
  props: {
    jobGroup:{
      type: String,
      default: ''
    },
    jobId:{
      type: String,
      default: ''
    },
    jobGroups: {
      type: Array,
      default: () => []
    },
    jobInfos: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const clearForm = {
      jobGroup: this.jobGroup,
      jobId: this.jobId,
      type: 1
    }
    const options = [
      {label: '清理一个月之前日志数据', value: 1},
      {label: '清理三个月之前日志数据', value: 2},
      {label: '清理六个月之前日志数据', value: 3},
      {label: '清理一年之前日志数据', value: 4},
      {label: '清理一千条以前日志数据', value: 5},
      {label: '清理一万条以前日志数据', value: 6},
      {label: '清理三万条以前日志数据', value: 7},
      {label: '清理十万条以前日志数据', value: 8},
      {label: '清理所有日志数据', value: 9}]
    return {
      formRef: 'triggerForm',
      clearForm: _.cloneDeep(clearForm),
      options: _.cloneDeep(options)
    }
  },
  computed: {
    ...VueUtil(this)
      .select([JobLogController])
      .state(),
    loading() {
      return this.JobLogController.clearLog.loading
    }
  },
  watch: {
    dialogVisible: {
      immediate: true,
      handler(val) {
        if(val) {
          this.clearForm.jobGroup = this.jobGroup
          this.clearForm.jobId = this.jobId
          this.clearForm.type = 1
        }
      }
    }
  },
  methods: {
    async submitSave() {
      let { jobId, jobGroup, type } = this.clearForm
      jobId = jobId == 0 ? null : jobId
      jobGroup = jobGroup == 0 ? null : jobGroup
      const resp = await this.dispatch(JobLogController.clearLog, {
        params:{
          jobId,
          jobGroup,
          type
        }
      })
      const { code, msg } = resp.data
      if (code === 200) {
        this.$msg.success('执行成功')
        this.$emit('success')
        this.cancel()
      } else {
        this.$msg.error(msg)
      }
    },
    async getJobInfos(jobGroup) {
      this.clearForm.jobId = 0
      if (!jobGroup) {
        this.jobInfos = [{id: 0, jobDesc: '全部'}]
        return
      }
      const resp = await this.dispatch(JobInfoController.pageList, {
        jobGroup: jobGroup,
        triggerStatus: -1,
        start: 0,
        length: 9999
      })
      if (!resp.error) {
        const { data } = resp.data
        this.jobInfos = data || []
        this.jobInfos.unshift({id: 0, jobDesc: '全部'})
      }
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .scroll-form {
    margin-bottom: -31px;
  }
</style>