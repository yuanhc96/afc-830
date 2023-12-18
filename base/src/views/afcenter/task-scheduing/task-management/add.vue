<template>
  <pm-form-dialog
    :dialogVisible.sync="dialogVisible"
    width="800px"
    top="30px"
    :title="title"
    :inline="true"
    :loading="loading"
    okText="确定">
      <el-form :ref="formRef" slot="form" label-position="top"  :rules="rules" :model="form" class="scroll-form" label-width="120px">
      <el-row :gutter="22">
        <el-col :span="24">
          <div class="divide-bar">
            <span>基础配置</span>
          </div>
        </el-col>
        <el-col :span="12">
          <el-form-item label="执行器" prop="jobGroup">
            <el-select v-model="form.jobGroup" style="width:100%" placeholder="" @change="jobGroupChange">
              <el-option
                v-for="item in jobGroup"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务名称" prop="jobDesc">
            <el-input v-focus v-model.trim="form.jobDesc" clearable />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="负责人" prop="author">
            <el-input v-model.trim="form.author" clearable />
          </el-form-item>
        </el-col> -->
        <el-col :span="24">
          <el-form-item label="报警邮件" prop="alarmEmail">
            <el-input v-model.trim="form.alarmEmail" clearable placeholder="请输入报警邮件，多个邮件地址则逗号分隔" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="divide-bar">
            <span>调度配置</span>
          </div>
        </el-col>
        <el-col :span="12">
          <el-form-item label="调度类型" prop="scheduleType">
            <el-select v-model="form.scheduleType" style="width:100%">
              <el-option
                v-for="item in scheduledTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="form.scheduleType === 'CRON'" label="Cron" prop="schedule_conf_CRON">
            <CronInput ref="ref_corn" v-model.trim="form.schedule_conf_CRON" />
            <!-- <el-input v-model.trim="form.schedule_conf_CRON" clearable /> -->
          </el-form-item>
          <el-form-item v-else-if="form.scheduleType === 'FIX_RATE'" label="固定速度" prop="schedule_conf_FIX_RATE">
            <el-input v-model.trim="form.schedule_conf_FIX_RATE" clearable placeholder="请输入 （ Second ）" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="divide-bar">
            <span>任务配置</span>
          </div>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运行模式" prop="glueType">
            <el-select  v-model="form.glueType" :disabled="disabled" style="width:100%" placeholder="" @change="selectChange">
              <el-option
                v-for="item in glueTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="JobHandler" prop="executorHandler" v-if="form.glueType === 'BEAN'">
            <el-input v-model.trim="form.executorHandler"  :disabled="form.glueType !== 'BEAN'" clearable />
          </el-form-item>
          <el-form-item label="逻辑流" prop="executorHandler" v-if="form.glueType === 'logicalFlow'">
            <FormServiceSelector
                    v-model="logicId"
                    :appCode="appCode"
                    style="width:100%"
                    @change="handlerChange($event)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="任务参数" prop="executorParam">
            <el-input type="textarea" v-model.trim="form.executorParam" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="divide-bar">
            <span>高级配置</span>
          </div>
        </el-col>
        <el-col :span="12">
          <el-form-item label="路由策略" prop="executorRouteStrategy">
            <el-select v-model="form.executorRouteStrategy" style="width:100%" placeholder="">
              <el-option
                v-for="item in routerStrategy"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="子任务ID" prop="childJobId">
            <el-input v-model.trim="form.childJobId" clearable placeholder="请输入子任务的任务ID,如存在多个则逗号分隔" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="调度过期策略" prop="misfireStrategy">
            <el-select v-model="form.misfireStrategy" style="width:100%" placeholder="">
              <el-option
                v-for="item in misfireStrategy"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="阻塞处理策略" prop="executorBlockStrategy">
            <el-select v-model="form.executorBlockStrategy" style="width:100%" placeholder="">
              <el-option
                v-for="item in blockStrategy"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务超时时间" prop="executorTimeout">
            <el-input v-model.trim="form.executorTimeout" clearable placeholder="任务超时时间，单位秒，大于零时生效" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="失败重试次数" prop="executorFailRetryCount">
            <el-input v-model.trim="form.executorFailRetryCount" clearable placeholder="失败重试次数，大于零时生效" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </pm-form-dialog>
</template>
<script>
import { JobInfoController } from '@controller'
import { BaseVue, Form, VueUtil, _ } from '@lib'
import FormServiceSelector from './components/FormServiceSelector.vue'
import CronInput from './cron.vue'
import model, { glueTypes } from './model'
export default {
  name: 'task-add',
  mixins: [BaseVue, Form],
  components: { CronInput,FormServiceSelector },
  props: {
    jobGroup:{
      type: Array,
      default: () => []
    }
  },
  data() {
    let JobHandlerTimer = null
    return {
      logicId:'',
      appCode:'',
      formRef: 'tenantForm',
      rules: {
        jobGroup: [{ required: true, message: '执行器是必选项' }],
        jobDesc: [{ required: true, message: '任务名称是必填项' }],
        author: [{ required: true, message: '负责人是必填项' }],
        scheduleType: [{ required: true, message: '调度类型是必填项' }],
        schedule_conf_FIX_RATE: [{ required: true, message: '固定速度是必填项' }],
        schedule_conf_CRON: [{ required: true, message: 'CORN是必填项' }],
        glueType: [{ required: true, message: '运行模式是必填项' }],
        executorHandler: [{ required: true, message: 'JobHandler是必填项' },
        // { 
        //   validator: (rule, value, callback, source, options) => {
        //     if (JobHandlerTimer !== null) {
        //       clearTimeout(JobHandlerTimer)
        //     }
        //     JobHandlerTimer = setTimeout(async() => {
        //       if (!value && this.form.glueType === 'BEAN') {
        //         callback('JobHandler是必填项')
        //       } else {
        //         callback()
        //       }
        //     }, 300)
        //   }
        // }
      ],
      },
      model: model,
      form: _.cloneDeep(model),
      options: [],
      scheduledTypes:[{
        value: 'NONE',
        label: '无'
      },{
        value: 'CRON',
        label: 'CRON'
      },{
        value: 'FIX_RATE',
        label: '固定速度'
      }],
      routerStrategy: [{
        value: 'FIRST',
        label: '第一个'
      },{
        value: 'LAST',
        label: '最后一个'
      },{
        value: 'ROUND',
        label: '轮询'
      },{
        value: 'RANDOM',
        label: '随机'
      },{
        value: 'CONSISTENT_HASH',
        label: '一致性HASH'
      },{
        value: 'LEAST_FREQUENTLY_USED',
        label: '最不经常用'
      },{
        value: 'LEAST_RECENTLY_USED',
        label: '最近最久未使用'
      },{
        value: 'FAILOVER',
        label: '故障转移'
      },{
        value: 'BUSYOVER',
        label: '忙碌转移'
      },{
        value: 'SHARDING_BROADCAST',
        label: '分片广播'
      }],
      misfireStrategy:[{
        value: 'DO_NOTHING',
        label: '忽略'
      },{
        value: 'FIRE_ONCE_NOW',
        label: '立即执行一次'
      }],
      blockStrategy:[{
        value: 'SERIAL_EXECUTION',
        label: '单机串行'
      },{
        value: 'DISCARD_LATER',
        label: '丢弃后续调度'
      },{
        value: 'COVER_EARLY',
        label: '覆盖之前调度'
      }],
      glueTypes:glueTypes.filter(item=> ['BEAN','logicalFlow'].includes(item.value))
    }
  },
  computed: {
    ...VueUtil(this)
      .select([JobInfoController])
      .state(),
    title() {
      return `${this.formType === 'add' ? '新建任务' : this.formType === 'edit' ? '编辑任务' : '复制任务'}`
    },
    formType() {
      return this.form && this.form.id ? 'edit' : this.formData && this.formData.jobDesc ? 'copy' : 'add'
    },
    disabled() {
      return this.formType === 'edit'
    },
    loading() {
      return this.JobInfoController.add.loading || this.JobInfoController.update.loading
    }
  },
  watch: {
    dialogVisible: {
      handler(val) {
        if (val && this.formType === 'add') {
          // this.form.jobGroup = this.jobGroup[0]?.id
        } else if (!val) {
          this.$refs.ref_corn && this.$refs.ref_corn.refresh()
        }
      }
    }
  },
  mounted() {
    if(this.form && this.form.isBiz){
      this.form.glueType = 'logicalFlow'
      this.logicId =  this.form.executorHandler.replace(/(.*)(\.)([^\.]*)$/, "$1^_^$3")
      this.jobGroupChange(this.form.jobGroup)     
    }
  },
  methods: {
    jobGroupChange(value){
      this.appCode = this.jobGroup.filter(group=>group.id === value )[0].title
    },
    async validateResolve() {
      let resp = {}
      let form = _.cloneDeep(this.form)
      if (form.scheduleType === 'CRON') {
        form.scheduleConf = form.schedule_conf_CRON
      } else if (form.scheduleType === 'FIX_RATE') {
        form.scheduleConf = form.schedule_conf_FIX_RATE
      } else {
        form.scheduleConf = null
      }
      let isBiz = false
      if(form.glueType === 'logicalFlow'){
          isBiz = true
          form.glueType = 'BEAN'
      }
      if (this.formType !== 'edit') {
        // if (form.glueType === 'GLUE_GROOVY') {
        //   form.glueRemark = 'GLUE代码初始化'
        //   form.glueSource = 'package com.xxl.job.service.handler;\r\n\r\nimport com.xxl.job.core.context.XxlJobHelper;\r\nimport com.xxl.job.core.handler.IJobHandler;\r\n\r\npublic class DemoGlueJobHandler extends IJobHandler {\r\n\r\n\t@Override\r\n\tpublic void execute() throws Exception {\r\n\t\tXxlJobHelper.log(\"XXL-JOB, Hello World.\");\r\n\t}\r\n\r\n}\r\n'
        // } else if (form.glueType === 'GLUE_SHELL') {
        //   form.glueRemark = 'GLUE代码初始化'
        //   form.glueSource = '#!/bin/bash\necho \"xxl-job: hello shell\"\n\necho \"脚本位置：$0\"\necho \"任务参数：$1\"\necho \"分片序号 = $2\"\necho \"分片总数 = $3\"\n\necho \"Good bye!\"\nexit 0\n'
        // } else if (form.glueType === 'GLUE_PYTHON') {
        //   form.glueRemark = 'GLUE代码初始化'
        //   form.glueSource = '#!/usr/bin/python\r\n# -*- coding: UTF-8 -*-\r\nimport time\r\nimport sys\r\n\r\nprint \"xxl-job: hello python\"\r\n\r\nprint \"脚本位置：\", sys.argv[0]\r\nprint \"任务参数：\", sys.argv[1]\r\nprint \"分片序号：\", sys.argv[2]\r\nprint \"分片总数：\", sys.argv[3]\r\n\r\nprint \"Good bye!\"\r\nexit(0)\r\n'
        // } else if (form.glueType === 'GLUE_PHP') {
        //   form.glueRemark = 'GLUE代码初始化'
        //   form.glueSource = '<?php\r\n\r\n    echo \"xxl-job: hello php  \\n\";\r\n\r\n    echo \"脚本位置：$argv[0]  \\n\";\r\n    echo \"任务参数：$argv[1]  \\n\";\r\n    echo \"分片序号 = $argv[2]  \\n\";\r\n    echo \"分片总数 = $argv[3]  \\n\";\r\n\r\n    echo \"Good bye!  \\n\";\r\n    exit(0);\r\n\r\n?>\r\n'
        // } else if (form.glueType === 'GLUE_NODEJS') {
        //   form.glueRemark = 'GLUE代码初始化'
        //   form.glueSource = '#!/usr/bin/env node\r\nconsole.log(\"xxl-job: hello nodejs\")\r\n\r\nvar arguments = process.argv\r\n\r\nconsole.log(\"脚本位置: \" + arguments[1])\r\nconsole.log(\"任务参数: \" + arguments[2])\r\nconsole.log(\"分片序号: \" + arguments[3])\r\nconsole.log(\"分片总数: \" + arguments[4])\r\n\r\nconsole.log(\"Good bye!\")\r\nprocess.exit(0)\r\n'
        // } else if (form.glueType === 'GLUE_POWERSHELL') {
        //   form.glueRemark = 'GLUE代码初始化'
        //   form.glueSource = 'Write-Host \"xxl-job: hello powershell\"\r\n\r\nWrite-Host \"脚本位置: \" $MyInvocation.MyCommand.Definition\r\nWrite-Host \"任务参数: \"\r\n\tif ($args.Count -gt 2) { $args[0..($args.Count-3)] }\r\nWrite-Host \"分片序号: \" $args[$args.Count-2]\r\nWrite-Host \"分片总数: \" $args[$args.Count-1]\r\n\r\nWrite-Host \"Good bye!\"\r\nexit 0\r\n'
        // }
        resp = await this.dispatch(JobInfoController.add, {...form,params:{isBiz}})
      } else {
        delete form.addTime
        delete form.updateTime
        delete form.glueUpdatetime
        delete form.glueType_extra
        resp = await this.dispatch(JobInfoController.update, {...form,params:{isBiz}})
      }
      const { code, msg } = resp.data
      if (code === 200) {
        this.$msg.success('保存成功！')
        this.$emit('success')
        this.cancel()
      } else {
        this.$msg.error(msg)
      }
    },
    handlerChange(data){
           this.form.executorHandler = data.bizCode
    },
    selectChange(value){
      if(value === 'logicalFlow' && !this.form.jobGroup){
        this.$message({
          message: '请选择执行器',
          type: 'warning'
        });
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