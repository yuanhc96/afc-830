<template>
  <el-dialog :visible.sync="dialogVisible" width="800px" top="60px" :title="title" append-to-body>
    <div class="div-content">
      <el-form ref="form" :rules="rules" :model="uploadData" label-position="top">
        <el-row :gutter="20">
          <el-col v-if="DimensionsVisible" :span="12">
            <el-form-item :label="currentIndex === 1 ? '默认维度' : '选择维度'" prop="type">
              <el-select v-model="DimensionsSetSelect" :disabled="currentIndex === 1" placeholder="请选择" style="width:100%">
                <el-option v-for="item in Dimensionslist" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>

            </el-form-item>
          </el-col>
          <el-col v-if="repeatSettingVisible" :span="12">
            <el-form-item label="重复验证字段" prop="type">
              <el-select v-model="repeatSetSelect" placeholder="请选择" style="width:100%">
                <el-option v-for="item in repeatsetList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="importSettingVisible" :span="12">
            <el-form-item label="导入模式" prop="type">
              <!-- <template solt="label">
              <span>导入模式</span>
               <el-tooltip placement="top">
                  <div slot="content">1.修改：当重复验证字段相同，插入时对此条数据修改<br>2.忽略：当重复验证字段相同，插入时对此条数据不做处理<br>默认重复检验字段为‘编号code’</div>
                  <i class="el-icon-question ml-10" />
              </el-tooltip>
             </template> -->
              <el-select v-model="importSetSelect" placeholder="请选择" style="width:100%">
                <el-option v-for="item in importsetList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>

            </el-form-item>
          </el-col>
          <!-- <el-col v-if="!isMaterial && !isComponents" :span="12">
            <el-form-item label="下载模板" prop="name">
              <a v-permission="FuncCode.afc_f_import_template_download" style="color:#1890ff"
                @click="downloadTemplate()">模板下载</a>

            </el-form-item>
          </el-col> -->
          <el-col :span="22">
            <el-form-item label="" prop="excel">
              <template solt="label">
                <span class="excel-text">上传{{ !isMaterial && !isComponents ? 'Excel' : 'ZIP' }}</span>
                <a
                  v-if="!isMaterial && !isComponents"
                  v-permission="FuncCode.afc_f_import_template_download"
                  style="color:#1890ff"
                  @click="downloadTemplate()"
                >(模板下载)</a>
              </template>

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
                :file-list="fileList"
                :auto-upload="false"
              >
                <el-button size="small">选择文件</el-button><span class="ml-10">{{
                  fileList.length == 0 ? (!isMaterial && !isComponents ? '上传.xlsx文件' : '上传.zip文件') : '已选择' + fileList.length + '文件'
                }}</span>
              </el-upload>
            </el-form-item>
          </el-col>
          <template v-if="currentIndex === 5">
            <el-col :span="12">
              <el-form-item label="" prop="type">
                <template solt="label">
                  <span class="excel-text">导出国际化语言选择</span>
                  <el-tooltip placement="top">
                    <div slot="content">
                      1.导出国际化语言选择：不选默认导出全部语言类型<br>
                      2.国际化导出：会把菜单模块和业务字典模块的配置的国际化导出
                    </div>
                    <i class="el-icon-question ml-10" />
                  </el-tooltip>
                </template>
                <el-select v-model="selectlangs" multiple clearable collapse-tags placeholder="请选择" style="margin-bottom: 10px;width:100%">
                  <el-option v-for="item in langOptions" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>

              </el-form-item>

            </el-col>
            <el-col :span="5">
              <el-button type="primary" style="margin-top: 30px;" :loading="exporti18nLoading" @click="exporti18nData"> 国际化导出</el-button>
            </el-col>

            <!-- <el-col :span="22">
              <el-form-item label="导出模块选择" prop="type">
                <el-select v-model="exportModuleSetSelect" placeholder="请选择">
                  <el-option v-for="item in exportModuleList" :key="item.value" :label="item.label"
                    :value="item.value" />
                </el-select>

                <el-tooltip placement="top">
                  <div slot="content">1.修改：当重复验证字段相同，插入时对此条数据修改<br>2.忽略：当重复验证字段相同，插入时对此条数据不做处理<br>默认重复检验字段为‘编号code’
                  </div>
                  <i class="el-icon-question ml-10" />
                </el-tooltip>
              </el-form-item>

            </el-col> -->

          </template>

          </el-col>
        </el-row>
      </el-form>
      <ul style="margin-top: 10px">
        <li v-for="(value, index) in introductionList" :key="index" style="line-height:2.15">
          {{ index+ 1 }}. {{ value }}
        </li>
      </ul>
      <ImportHistory
        v-if="historyDialogVisible"
        :history-dialog-visible.sync="historyDialogVisible"
        :import-type="importType"
      />
    </div>
    <span slot="footer">
      <el-button type="primary" :loading="butLoading" :disabled="fileList.length == 0" @click="submit">提交</el-button>
      <el-button type="primary" @click="openHistory">历史导入记录</el-button>
    </span>
  </el-dialog>
</template>
<script>
import ajaxUtil from '@/libs/ajaxUtil'
import * as auth from '@/utils/auth.js'
import { DictTypeController, DimensionController, GeneralI18nController } from '@controller'
import { BaseVue, Form, VueUtil } from '@lib'
import FileSaver from 'file-saver'
import { mapGetters } from 'vuex'
import ImportHistory from './import-history.vue'
export default {
  name: 'template-import',
  components: { ImportHistory },
  mixins: [BaseVue, Form],
  props: {
    importSettingVisible: {
      type: Boolean,
      default: false,
    },
    repeatSettingVisible: {
      type: Boolean,
      default: false,
    },
    DimensionsVisible: {
      type: Boolean,
      default: true,
    },
    introductionList: {
      type: Object,
      default: [
        '选择文件：导入模板',
        '填写模板数据后将文件上传。',
        '导入设置说明：判断是更新、添加或覆盖，如果添加则对必填列验证；如果更新必填列则不验证，非必填列可删除，如不删除则以当列值(含空值)更新。']
    },
    importTitle: {
      type: String,
      default: '导入',
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    currentIndex: {
      type: Number,
      default: 0,
    },
    downloadTemplateSetting: {
      type: Object,
      default: {},
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
    return {
      rules: {
      },
      butLoading: false,
      uploadData: {
        importSetting: 'update'
      },
      fileList: [],
      importSetSelect: 'update',
      repeatSetSelect: 'emp_code',
      DimensionsSetSelect: null,
      Dimensionslist: [],
      importsetList: [
        {
          value: 'update',
          label: '修改'
        },
        {
          value: 'ignore',
          label: '忽略'
        }
      ],
      repeatsetList: [
        {
          value: 'emp_code',
          label: '员工编号'
        },
        {
          value: 'user_code',
          label: '登录账号'
        },
      ],
      exportModuleList: [
        {
          value: 'Menu',
          label: '菜单'
        },
        {
          value: 'DictType',
          label: '业务字典类型'
        },
        {
          value: 'DictEntry',
          label: '业务字典项'
        },
      ],
      importType: null,
      importTypesList: ['org', 'employee', 'res', 'dict', '', 'i18n', 'material', 'component_center'],
      historyDialogVisible: false,
      dicttypeid: 'sys_i18n_locale',
      langOptions: [],
      selectlangs: '',
      exporti18nLoading: false,
    }
  },
  computed: {
    title() {
      return `${this.importTitle}导入`
    },
    ...mapGetters(['dicts']),
    ...VueUtil(this)
      .select([DictTypeController])
      .state(),
    isMaterial() {
      return this.importTypesList[this.currentIndex] === 'material'
    },
    isComponents() {
      return this.importTypesList[this.currentIndex] === 'component_center'
    },
    isExpress() {
      return Vue.config.isExpress
    },
    apiPrefixPath() {
      const path = Vue.config.apiPrefix.path
      return path.endsWith('/') ? path.slice(0, -1) : path
    }
  },
  watch: {
    dicts: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val && this.currentIndex === 5) {
          const objectType = this.dicts[this.dicttypeid] || []
          this.langOptions = objectType.filter(item => item.code !== 'zh_CN')
        }
      }
    }
  },
  mounted() {
    if (this.DimensionsVisible) {
      this.getDimensionlist()
    }
    if (this.currentIndex === 5) {
      this.loadDictData()
    }
  },
  methods: {
    getDimensionlist() {
      const payload = { tenantId: this.currentTenant, pageIndex: -1, pageSize: -1 }
      this.dispatch(DimensionController.queryDimensionsWithPage, payload).then(res => {
        this.Dimensionslist = res.data.data
        const defDimension = res.data.data.filter(item => item.code == 'def_dimension')
        this.DimensionsSetSelect = defDimension[0].id
      })
    },

    async submit() {
      this.$refs['upload'].submit()
    },
    fileChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      }
    },
    handleRemove(currFile, fileList) {
      this.fileList = fileList
    },
    beforeUpload(file) {
      var error = null
      if ((!this.isMaterial && !this.isComponents) && !/\.xlsx$/.test(file.name) || (this.isMaterial || this.isComponents) && !/\.zip$/.test(file.name)) {
        error = `请导入${(!this.isMaterial && !this.isComponents) ? 'xlsx' : 'zip'} 文件!`
      } else if (file.size / 1024 / 1024 > 200) {
        error = '上传文件大小不能超过 200MB'
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
      this.dialogVisible = false
      this.$emit('update:dialogVisible', false)
      this.$msg.success('导入成功')
      this.$emit('success')
    },
    uploadError(data) {
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
      this.butLoading = true
      const prefix = this.isExpress ? `${this.apiPrefixPath}/` : `/afc/`
      const uploadData = [
        `${prefix}api/afc/orgs/${this.importSetSelect}/import-org`,
        `${prefix}api/afc/orgs/${this.importSetSelect}/import-emp`,
        `${prefix}api/afc/function-code-tools/${this.importSetSelect}/import-app-resource`,
        `${prefix}api/afc/dict-types/${this.importSetSelect}/import-dict`,
        '',
        `${prefix}api/afc/i18ns/actions/${this.importSetSelect}/import`,
        `${prefix}api/afc/materials/actions/import/${this.importSetSelect}`,
        `${prefix}api/afc/component-centers/actions/import`,
      ]
      const headers = ajaxUtil.buildHeaders()
      const newHeaders = {
        ...headers,
        'Content-Type': 'multipart/form-data;boundary=<calculated when request is sent>'
      }
      const params = new FormData()
      params.append(`${this.isMaterial || this.isComponents ? 'multipartFile' : 'file'}`, obj.file)
      if (!this.isComponents) {
        params.append('importSetting', this.importSetSelect)
        params.append('importTypes', this.importTypesList[this.currentIndex])
      }
      if (this.repeatSettingVisible) {
        params.append('code', this.repeatSetSelect)
      }
      if (this.DimensionsVisible) {
        params.append('dimensionId', this.DimensionsSetSelect)
      }
      console.log(uploadData[this.currentIndex], '====uploadData[this.currentIndex]')
      console.log(params, '====params')
      // debugger
      ajaxUtil.headers(newHeaders).ajax({
        url: uploadData[this.currentIndex],
        method: 'post',
        data: params,
      })
        .then(res => {
          console.log(res, '====success')
          this.butLoading = false
          if (!res.error) {
            const msg = `${res.data.failNum ? '\n 详细信息可以在"历史导入记录"中下载查看' : ''}   `
            if (this.isComponents) {
              this.$msg.success('上传成功！')
            } else {
              this.$msg.warning(`共${res.data.rowCount}条数据，${res.data.succNum}条导入成功，${res.data.failNum}条失败${msg}`, 3000)
            }
          }
        }).catch(err => {
          console.log(err, '===errrrrr===')
          this.butLoading = false
          this.$msg.error(`${err.data.errorLocalizedMessage}`)
        })
    },
    downloadTemplate() {
      ajaxUtil.config.responseType = 'blob'
      const { downloadTemplateUrl, templateName } = this.downloadTemplateSetting
      ajaxUtil.ajax({
        url: downloadTemplateUrl,
        method: 'get',
        data: {}
      })
        .then(res => {
          if (!res.error) {
            const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,charset=utf-8' })
            FileSaver.saveAs(blob, `${templateName}.xlsx`)
          }
        })
      ajaxUtil.config.responseType = 'json'
    },
    openHistory() {
      this.importType = this.importTypesList[this.currentIndex]
      this.historyDialogVisible = true
    },
    async exporti18nData() {
      this.exporti18nLoading = true
      ajaxUtil.config.responseType = 'blob'
      const payload = {
        codes: []
      }
      payload.params = { locales: this.selectlangs }
      const resp = await this.dispatch(
        GeneralI18nController.exportI18nMessages,
        payload
      )
      ajaxUtil.config.responseType = 'json'
      if (!resp.error) {
        const blob = new Blob([resp.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,charset=utf-8',
        })
        FileSaver.saveAs(blob, `国际化资源.xlsx`)
      }
      this.exporti18nLoading = false
    },
    async loadDictData() {
      if (!this.dicttypeid) {
        return
      }
      if (!this.dicts[this.dicttypeid]) {
        const resp = await this.dispatch(DictTypeController.queryDictTypesByCriteria, {
          code: this.dicttypeid,
          tenantId: this.currentTenant
        })
        if (!resp.error) {
          this.$store.commit('ADD_DICT', {
            key: this.dicttypeid,
            value: resp.data.data.length ? resp.data.data[0].dictEntrys : []
          })
        }
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.excel-text{
  color: #000;
}
::v-deep .el-select {
  float: left;
  height: 28px;

  .el-input {
    height: 28px;

    .el-input__inner {
      border: 1px solid #dcdfe6;
      height: 28px !important;
    }
  }
}

.div-content {
  height: calc(100vh - 330px);
  overflow-y: auto;
  overflow-x: hidden;
}
ul {
  margin:0;
  padding-left:15px;
}
</style>
