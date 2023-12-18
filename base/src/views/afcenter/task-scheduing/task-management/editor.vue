<template>
  <div class="">
    <div class="top-tool-bar">
      <el-row>
        <el-col :span="12">
          <div class="select">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                版本回溯<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item, index) in glueData" :key="index" :command="item.id">{{ item.glueRemark }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="btn" @click="openSave">
            <pm-icon value='save' /> 保存</div>
          <div class="btn" @click="closePage">
            <i class="el-icon-close"></i> 关闭</div>
        </el-col>
        <el-col :span="12">
          <span style="font-weight:700;font-size: 16px;">WebIDE</span>
          <span class="mr-5" style="font-size: 16px;">【 {{ glueInfo.glueType_extra }} 】 {{ this.jobDesc}}</span>
        </el-col>
      </el-row>
    </div>
    <div class="p-10 log-container" :style="`height:${dialogHeightNum}px;width:100%;`">
      <CodeEditor
        ref="log-editor"
        v-model="glueInfo.glueSource"
        max-width="100%"
        label="WebIDE"
        theme="vs-dark"
        :options="{ readOnly: false, wordWrap: 'on' }"
        :height="dialogHeightNum"
        :maxable="false"
      />
    </div>
    <pm-form-dialog
      :dialogVisible.sync="desVisible"
      width="800px"
      title="保存"
      :inline="true"
      :loading="loading"
      okText="确定">
      <el-form :ref="formRef" slot="form" :rules="rules" :model="form" class="scroll-form" label-width="120px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="源码备注" prop="glueRemark">
              <el-input v-focus type="textarea" v-model.trim="form.glueRemark" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </pm-form-dialog>
  </div>
</template>

<script>
import CodeEditor from '@/views/common/code-editor/src/index.vue'
import { JobCodeController } from '@controller'
import { BaseVue, Form } from '@lib'
import { glueTypes } from './model'

export default {
  name: 'devops-debugge-log',
  components: { CodeEditor },
  mixins: [BaseVue, Form],
  data() {
    return {
      glueInfo: {
        glueSource: null,
        glueType_extra: null,
        jobDesc: null,
      },
      form: {
        glueRemark: null
      },
      loading: false,
      desVisible: false,
      rules: {
        glueRemark: [{ required: true, message: '源码备注是必填项' },
        { min: 4, max: 100, message: '源码备长度限制为4~100' }]
      },
      glueTypes,
      glueData: [],
      jobId: '',
      jobDesc: ''
    }
  },
  computed: {
    dialogHeightNum() {
      return document.body.clientHeight - 60
    }
  },
  async mounted() {
    const { href } = window.location
    const string = href.slice(href.indexOf('?')+ 1)
    this.jobId = string.slice(string.indexOf('jobId=') + 6, string.indexOf('&'))
    this.jobDesc = string.slice(string.indexOf('jobDesc=') + 8)
    this.getData()
  },
  methods: {
    async getData() {
      const resp = await this.dispatch(JobCodeController.queryGluesByJobId, {jobId: this.jobId})
      if (!resp.error) {
        this.glueData = resp.data.map(item => {
          return {
            ...item,
            glueSource: JSON.parse(item.glueSource).glueSource,
            glueType_extra: this.glueTypes.filter(type => item.glueType === type.value)[0].label
          }
        })
        this.glueInfo = this.glueData[0]
      }
    },
    getLogs(data) {
      const logEditor = this.$refs['log-editor']
      console.log(logEditor,'==logEditor')
      if (!logEditor) {
        return
      }
      logEditor.language = 'json'
      logEditor.setValue(data)
      // this.$nextTick(() => {
      //   logEditor.bottom()
      // })
    },
    getLanguage() {
      if (!this.logFileName) {
        return 'json'
      }
      if (this.logFileName.indexOf('sql') !== -1) {
        return 'sql'
      }
      if (this.logFileName.endsWith('.xml')) {
        return 'xml'
      }
      return 'json'
    },
    async validateResolve() {
      const resp = await this.dispatch(JobCodeController.save, {
        jobId: this.jobId,
        payload:{glueSource: this.glueInfo.glueSource},
        params: {glueRemark: this.form.glueRemark}
      })
      if (resp && !resp.error) {
        this.getData()
        this.desVisible = false
        this.$msg.success('保存成功!')
      }
    },
    openSave() {
      this.desVisible = true
    },
    closePage() {
      window.close()
    },
    handleCommand(command) {
      this.glueInfo = this.glueData.filter(item => item.id === command)[0]
      this.getLogs(this.glueInfo.glueSource)
    }
  },
}
</script>
<style lang="scss" scoped>
  .top-tool-bar {
    height: 50px;
    line-height: 50px;
    background-color: #f2f2f2;
    padding: 0 50px;
    .select {
      width: 76px;
      display: inline-block;
    }
    .el-col {
      float: right;
      text-align: center;
      .btn {
        width: 70px;
        display: inline-block;
        cursor: pointer;
      }
    }
  }
  .log-container {
    margin-top: 1px;
  }
</style>
