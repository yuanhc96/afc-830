<template>
  <div class="pl-20 pr-20 pb-20">
    <div class="mt-10 ml-10">
      <el-select
        v-model="logFileName"
        placeholder="请输入文件名"
        class="mr-10"
        allow-create
        filterable
        @change="getLogs"
      >
        <el-option v-for="f in logFileNames" :key="f" :label="f" :value="f" />
      </el-select>
      <span class="mr-5">起始行号</span>
      <el-input-number v-model="startLineNo" :min="-50000" :max="50000" />
      <el-tooltip placement="top" content="行号为负数则代表从倒数第几行开始">
        <span class="mr-5"><i class="el-icon-question mt-10" /> </span>
      </el-tooltip>
      <el-button circle icon="el-icon-refresh" @click="search" />
      <!-- <el-button @click="openDialog(operateDict.enableLog.value)">激活日志记录</el-button> -->
      <!-- <el-button @click="openDialog(operateDict.disableLog.value)">取消日志记录</el-button> -->
    </div>
    <div v-loading="loading" class="mt-10 p-10 log-container" :style="`height:${dialogHeightNum}px;`">
      <CodeEditor
        ref="debugger-log-editor"
        v-model="fileContent"
        max-width="100%"
        label="DevOps调试日志"
        theme="vs-dark"
        :options="{ readOnly: false, wordWrap: 'on' }"
        :height="dialogHeightNum"
      />
    </div>
    <pm-dialog
      :close-on-click-modal="false"
      :title="operateDict[operation].text"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      class="body-no-padding"
    >
      <div class="p-10">
        <el-form ref="dialogForm" label-width="100px" :model="dialogForm">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="类名">
                <el-input v-focus v-model.trim="dialogForm.className" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="方法名">
                <el-input v-model="dialogForm.methodName" />
              </el-form-item>
            </el-col>
            <el-col v-if="isEnableLog" :span="24">
              <el-form-item label="行为">
                <el-select v-model="dialogForm.actionTypeName" multiple placeholder="请选择">
                  <el-option key="before" label="before" value="before" />
                  <el-option key="after" label="after" value="after" />
                  <el-option key="exception" label="exception" value="exception" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="isEnableLog" :span="24">
              <el-form-item label="保持时长">
                <el-input-number v-model="dialogForm.keepMin" :min="1" :max="10" />
                <span class="ml-5">分钟</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </pm-dialog>
  </div>
</template>

<script>
import CodeEditor from '@/views/common/code-editor/src/index.vue'
import { LoggerController } from '@controller'
import { BaseVue } from '@lib'
import _ from 'lodash'

const operateDict = {
  disableLog: {
    value: 'disableLog',
    text: '取消日志记录'
  },
  enableLog: {
    value: 'enableLog',
    text: '激活日志记录'
  }
}
export default {
  name: 'devops-debugge-log',
  components: { CodeEditor },
  mixins: [BaseVue],
  data() {
    return {
      loading: false,
      fileContent: '',
      startLineNo: -1000,
      offsetLine: 0,
      operation: 'disableLog',
      operateDict: _.cloneDeep(operateDict),
      dialogVisible: false,
      dialogForm: {
        className: null,
        methodName: null,
        actionTypeName: ['before'],
        keepMin: 10,
      },
      isFirstLoad: true,
      trainInterval: null,
      refreshLogsSymbol: null,
      logFileName: null,
      logFileNames: []
    }
  },
  computed: {
    dialogHeightNum() {
      return document.body.clientHeight - 200
    },
    isEnableLog() {
      return this.operation === 'enableLog'
    },
  },
  async mounted() {
    // this.trainInterval = await this.getTrainInterval()
    this.offsetLine = 0
    await this.getLogFileNames()
    this.getLogs()
  },
  methods: {
    search() {
      this.offsetLine = 0
      this.getLogs()
    },
    async getLogFileNames() {
      const resp = await this.dispatch(LoggerController.getLogFileNames, {
      })
      if (!resp.error) {
        this.logFileNames = resp.data
        if (this.logFileNames && this.logFileNames.length) {
          this.logFileName = this.logFileNames[0]
        }
      }
    },
    async getLogs() {
      this.loading = true
      const resp = await this.dispatch(LoggerController.getLogs, {
        logFileName: this.logFileName,
        startLineNo: this.startLineNo
      })
      if (!resp.error) {
        this.fileContent = resp.data
        this.loading = false
        this.isFirstLoad = false
        const logEditor = this.$refs['debugger-log-editor']
        if (!logEditor) {
          return
        }
        logEditor.language = this.getLanguage()
        logEditor.setValue(resp.data)
        this.$nextTick(() => {
          logEditor.bottom()
        })
      }
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
    // openDialog(operationType) {
    //   this.operation = operationType
    //   this.dialogVisible = true
    // },
    async submit() {
      let resp
      if (!this.dialogForm.className && !this.dialogForm.methodName) {
        this.$msg.error('请输入类名或方法名!')
        return
      }
      if (this.isEnableLog) {
        resp = await this.dispatch(LoggerController.enableLog, {
          className: this.dialogForm.className,
          methodName: this.dialogForm.methodName,
          actionTypeName: this.dialogForm.actionTypeName.join('|'),
          keepMin: this.dialogForm.keepMin,
        })
      } else {
        resp = await this.dispatch(LoggerController.disableLog, {
          className: this.dialogForm.className,
          methodName: this.dialogForm.methodName,
          actionTypeName: this.dialogForm.actionTypeName.join('|'),
          keepMin: this.dialogForm.keepMin,
        })
      }
      if (resp && !resp.error) {
        this.dialogVisible = false
        this.$msg.success('操作成功!')
      }
    },
  },
}
</script>
