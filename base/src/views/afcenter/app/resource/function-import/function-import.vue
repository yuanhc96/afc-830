<template>
  <el-dialog :visible.sync="importDialogVisible" width="800px" top="60px" title="功能码导入" :before-close="handleClose" append-to-body>
    <div class="div-content">
      <el-form ref="form" :rules="rules" :model="form" class="classify-form" label-width="150px">
        <el-row>
          <el-col :span="24">
            <div class="divide-bar"> <span>导入类型</span></div>
          </el-col>
          <el-col :span="22">
            <el-form-item label="功能码类型" prop="resSubType">
              <Dict
              v-model="form.resSubType"
              dicttypeid="sys_resource_sub_types"
            />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <div class="divide-bar"> <span>导入说明</span></div>
          </el-col>
          <el-col :span="22">
            <ul>
              <li v-for="(value,index) in introductionList" :key="index" style="line-height:2.15">
                {{ index+1 }}. {{ value }}
              </li>
            </ul>
          </el-col>

                  <!-- <el-col :span="22" v-if="importSetSelect=='file'">
            <el-form-item label="导入文件" prop="excel">
            <el-upload
                ref="upload"
                name="file"
                :http-request="uploadFile"
                :headers="headers"
                :action="uploadUrl"
                :data="uploadData"
                :on-change="fileChange"
                :on-remove="handleRemove"
                :before-upload="beforeUpload"
                :on-success="localUploadSuccess"
                :on-error="uploadError"
                :limit="1"
                :file-list="fileList"
                :auto-upload="false"
                drag
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">注意：只能上传json文件</div>
            </el-upload>
            </el-form-item>
        </el-col> -->

        </el-row>
      </el-form>
      <UploadfunctionList v-if="funlistDialogVisible" :funlist-dialog-visible.sync="funlistDialogVisible" :funlist="reslist" :appid="appid" :business-obj-id="businessObjId" :groupid="groupid" :all-close.sync="allClose" />
    </div>
    <span slot="footer">
      <el-button v-if="importSetSelect=='url'" type="primary" :loading="butLoading" @click="submitUrl">下一步</el-button>
      <el-button v-if="importSetSelect=='file'" type="primary" :loading="butLoading" :disabled="fileList.length==0" @click="submit">下一步</el-button>
    </span>
  </el-dialog>
</template>
<script>
import ajaxUtil from '@/libs/ajaxUtil'
import * as auth from '@/utils/auth.js'
import { FunctionCodeToolsController } from '@controller'
import { BaseVue, Form } from '@lib'
import UploadfunctionList from './uploadfunction-list.vue'
export default {
  components: { UploadfunctionList },
  mixins: [BaseVue, Form],
  props: {
    importDialogVisible: {
      type: Boolean,
      default: false,
    },
    appid: {
      type: String,
      default: null,
    },
    groupid: {
      type: String,
      default: null,
    },
    businessObjId: {
      type: String,
      default: null,
    },
    headers: {
      type: Object,
      default() {
        const headers = {
          Authorization: auth.getToken(),
        }
        return headers
      },
    },
  },
  data() {
    var checkimportUrl = (rule, value, callback) => {
      if (!this.urlWapperse) {
        return callback(new Error('请输入应用地址'))
      }
      callback()
    }
    return {
      rules: {
        resSubType: [
          { required: true, message: "请选择导入功能码类型",  trigger: 'blur' }
        ],
      },
      butLoading: false,
      urlWapperse: null,
      fileList: [],
      funlistDialogVisible: false,
      importSetSelect: 'url',
      reslist: [],
      form:{
        resSubType:null,
      },
      introductionList: [
      '高开功能码：高开应用代码内部注解@BoundFunctions和@ClassBoundFunctions上定义的功能码，用于对高开场景的方法权限控制。',
      '低开功能码：低开在线表单编辑器中用户自定义设置的功能码，用于对低开场景的表单视图按钮权限控制。'
      ],
      allClose: false,
    }
  },
  computed: {

  },
  watch: {
    allClose(res) {
      if (res) {
        this.handleClose()
      }
    }
  },
  mounted() {
  },
  methods: {
    async submit() {
      this.$refs['upload'].submit()
    },
    fileChange(file, fileList) {
      this.fileList = fileList
    },
    handleRemove(currFile, fileList) {
      this.fileList = fileList
    },
    beforeUpload(file) {
      var error = null
      if (!/\.json$/.test(file.name)) {
        error = '请导入JSON文件!'
      }
      if (error) {
        this.$msg.warning(error)
        this.loading = false
        return false
      }
      this.loading = true
      return true
    },
    uploadSuccess() {
      this.importDialogVisible = false
      this.$emit('update:importDialogVisible', false)
      this.$msg.success('导入成功')
      this.$emit('success')
    },
    uploadError(data) {
      const errordata = JSON.parse(data)
      this.$msg.error(data.message || data.error || '导入失败!')
    },
    localUploadSuccess(data) {
      this.loading = false
      if (data.reCode === '-1') {
        this.uploadError(data)
      } else {
        this.uploadSuccess()
      }
    },
    uploadFile(obj) {
      this.reslist = []
      this.butLoading = true
      const headers = ajaxUtil.buildHeaders()
      const newHeaders = {
        ...headers,
        'Content-Type': 'multipart/form-data;boundary=<calculated when request is sent>'
      }
      const params = new FormData()
      params.append('file', obj.file)
      params.append('appId', this.appid)
      if (this.businessObjId) {
        params.append('businessObjId', this.businessObjId)
      }
      ajaxUtil.headers(newHeaders).ajax({
        url: `/api/afc/function-code-tools/${this.appid}/parse-function-codes`,
        method: 'post',
        data: params,
      })
        .then(res => {
          this.butLoading = false
          if (!res.error) {
            for (const i in res.data) {
              this.reslist.push({
                ...res.data[i]
              })
            }
            this.funlistDialogVisible = true
            this.butLoading = false
          }
        })
        .catch(err => {
          this.butLoading = false
          this.$msg.error(`文件解析失败!${err.message}`)
        })
    },
    async submitUrl() {
      this.$refs['form'].validate( async (valid) => {  //开启校验
      if (valid) {   // 如果校验通过，请求接口，允许提交表单
            this.butLoading = true
            this.reslist = []
            const payload = {
              appId: this.appid,
            }
            payload.params = this.businessObjId ? { businessObjId: this.businessObjId,resSubType:this.form.resSubType } : {resSubType:this.form.resSubType }
            const resp = await this.dispatch(FunctionCodeToolsController.parseFunCodesByFile, payload)
            if (!resp.error) {
              for (const i in resp.data) {
                this.reslist.push({
                  ...resp.data[i]
                })
              }
              this.funlistDialogVisible = true
              this.butLoading = false
            } else {
              this.butLoading = false
            }
          } else {   //校验不通过
            return false;
          }
        });

    },
    handleClose() {
      this.importDialogVisible = false
      this.$emit('update:importDialogVisible', this.importDialogVisible)
    }
  }
}
</script>
<style lang="scss" scoped>

.div-content {
  height:calc(100vh - 280px);
  overflow-y:auto;
  overflow-x:hidden;
  }
</style>
