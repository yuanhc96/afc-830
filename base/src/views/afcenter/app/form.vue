<template>
  <div class="pr-10 app-form" :class="isOneApp ? 'pl-20' : 'pl-10'" :style="`max-height: calc(100vh - ${isDialog?'270':'110'}px);`">
    <el-form :ref="formRef" label-position="top" :model="form" :rules="validateRules" style="  max-width:1024px;    ">
      <el-row :gutter="22">
        <el-col :span="24">
          <div class="divide-bar">
            <span>基本信息</span>
          </div>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称" prop="code">
            <el-input
              v-model.trim="form.code"
              v-focus
              type="text"
              :disabled="formType === 'edit'"
              placeholder="应用名称应和nacos中的应用名称或者高开应用名称保持一致"
              class="app-input"
            >
              <el-tooltip content="">
                <i v-if="formType === 'edit'" slot="suffix" class="disabled_btn el-icon-edit" @click="eidtName" />
              </el-tooltip>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示名称" prop="name">
            <el-input v-model.trim="form.name" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="图标" prop="icon">
            <icon-select
              v-model="appIcon"
              placeholder="请选择应用图标"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="颜色" prop="color">
            <IconColorPicker v-model="color" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="支持低开" prop="isLowcode" data-testId="支持低开">
            <el-radio-group v-model="form.isLowcode">
              <el-radio-button v-for="item in options" :key="item.code" :label="item.code">{{ item.name }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="form.id" :span="12">
          <el-form-item label="创建人" prop="createUser">
            <el-input v-model="form.createUser" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col v-if="isBpsStandalone" :span="12">
          <el-form-item label="是否三方应用" prop="isLowcode" data-testId="是否三方应用">
            <el-radio-group v-model="isOtherFlowApp">
              <el-radio-button v-for="item in options" :key="item.code" :label="item.code">{{ item.name }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="isOtherFlowApp === '1'" :span="12">
          <el-form-item label="三方应用地址" prop="url" data-testId="支持低开">
            <el-input v-model.trim="form.url" type="textarea" :rows="2" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="描述" prop="description">
            <el-input v-model="form.description" :disabled="readonly" type="textarea" :rows="2" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="divide-bar">
            <span>
              微前端模块设置
              <el-tooltip class="item" effect="dark" placement="top">
                <div slot="content">
                  1.可以配置多对微前端地址和微前端模块
                  <br>
                  2.微前端地址支持配置系统变量;例如：${aa}
                </div>
                <i class="el-icon-question ml-10" style="color: #2a4767" />
              </el-tooltip>
            </span>
          </div>
        </el-col>
        <el-col :span="12" style="text-align:right;">
          <el-form-item>
            <el-button plain icon="el-icon-plus" class="button-addmic" @click="addMicroMark()">
              添加微前端模块
            </el-button>
          </el-form-item>
        </el-col>
        <el-col v-for="(item, index) in microAppCollist" v-show="isMicroApp === '1'" :key="index" :span="24">
          <div class="micro-item fl">
            <div class="micro-item-div fl">
              <el-col :span="12" style="padding-left:0px">
                <el-form-item label="微前端模块" prop="">
                  <el-input v-model.trim="item.microMark" :disabled="readonly" />
                </el-form-item>
              </el-col>
              <el-col :span="12" style="padding-right:0px">
                <el-form-item label="微前端地址" prop="">
                  <el-input v-model.trim="item.microUrl" :disabled="readonly" />
                </el-form-item>
              </el-col>
              <div style="position:absolute;top:-30px;right:10px;">
                <i
                  class="el-icon-paperclip icon-del icon-btn"
                  @click="testMicroMark(item)"
                >
                  测试
                </i>
                <i
                  class="el-icon-delete icon-del icon-btn"
                  @click="delMicroMark(item)"
                >
                  删除
                </i>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="divide-bar">
            <span>OAuth2认证设置</span>
          </div>
        </el-col>
        <el-col v-if="form.id" :span="24">
          <el-form-item label="密钥" prop="secret" data-testId="密钥">
            <el-row :gutter="20" type="flex" style="width:100%">
              <el-col style="flex:1">
                <el-input v-model="form.secret" :disabled="true" />
              </el-col>
              <el-col style="width:max-content;padding-right: 0px;margin-right: -10px">
                <el-button class="refresh-btn" icon="el-icon-refresh-left" plain @click="handleRefresh(form.id)">刷新</el-button>
                <el-button v-clipboard:copy="form.secret || ''" v-clipboard:success="onCopy" v-clipboard:error="onError" class="copy-btn" icon="el-icon-document-copy" plain>复制</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col v-if="isOtherFlowApp !== '1'" :span="24">
          <el-form-item label-width="162px" label="回调地址" prop="url">
            <el-input v-model.trim="form.url" style="width:100%;" type="textarea" :rows="2" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="162px" label="访问凭证有效时间(分钟)" prop="accessToken">
            <el-input v-model="form.accessToken" type="number" min="1" @change="numberChage('accessToken')" />

          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="162px" label="刷新凭证有效时间(分钟)" prop="refreshToken">
            <el-input v-model="form.refreshToken" type="number" min="1" @change="numberChage('refreshToken')" />

          </el-form-item>
        </el-col>
        <!-- <el-form-item label="是否分享" prop="isShare">
           <el-switch v-model="form.isShare" @change="getchange(form.isShare)" />
          </el-form-item>  -->
      </el-row>
    </el-form>

    <div v-if="showFooter" style="border-top: 1px" class="div-near-bottom">
      <el-button
        v-permission="FuncCode.afc_f_app_edit"
        class="pt-10"
        type="primary"
        :loading="btnLoading"
        @click="submit"
      >
        保存
      </el-button>
    </div>
    <PmDialog
      :visible.sync="editDialogVisible"
      title="修改应用名称"
      :inline="true"
      :show-close="showClose"
      width="800px"
      class="edit_dialog"
    >
      <el-form :ref="formRef" :model="eidtForm" :rules="validateRules" class="classify-form" label-width="150px">
        <div style="color: red; margin: 12px 167px;font-size: 15px;">修改名称可能导致低开应用失效,建议在开发前修改</div>
        <el-form-item label="应用名称" prop="code">
          <el-input
            v-model.trim="eidtForm.code"
            type="text"
            placeholder="应用名称应和nacos中的应用名称或者高开应用名称保持一致"
            class="app-input"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="submitName">确定</el-button>
      </span>
    </PmDialog>
  </div>
</template>
<script>
import IconSelect from '@/components/Icon/icon-select'
import { loadModulesList } from '@/utils/loadRemote.js'
import { AppController } from '@controller'
import { BaseVue, Form, _ } from '@lib'
import { isJSON } from '@util/tools.js'
import model from './model.js'
import oneApp from './oneApp.js'
export default {
  components: { IconSelect },
  mixins: [BaseVue, Form,oneApp],
  props: {
    data: {
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    isDialog: {
      default: false
    }
  },
  data() {
    const codeTimer = null
    let nameTimer = null
    return {
      formRef: 'form',
      model: model,
      form: _.cloneDeep(model.application),
      btnLoading: false,
      isOtherFlowApp: '0',
      validateRules: {
        code: [
          { required: true, message: '请输入应用名称', trigger: 'change' },
          {
            validator: (rule, value, callback, source, options) => {
              // if (this.formType === "edit") {
              //   callback()
              // }
              if (nameTimer !== null) {
                clearTimeout(nameTimer)
              }
              if (value && value.indexOf('_') != -1) {
                callback(new Error('应用名称不能输入 _ 字符'))
              }
              if (value && /[\u4E00-\u9FA5]/g.test(value)) {
                callback(new Error('应用名称不能输入汉字'))
              }
              if (!value) {
                callback()
              } else if (this.formType === 'add' && (!this.formData || value !== this.formData.code) || this.formType === 'edit' && this.form.code !== value) {
                nameTimer = setTimeout(async() => {
                  const res = await this.dispatch(AppController.isExist, {
                    code: value,
                    tenantId: this.currentTenant
                  })
                  console.log(res, 'res')
                  if (res.data == true) {
                    callback(new Error(`${value}应用名称已存在!`))
                  }
                  callback()
                }, 300)
              } else {
                callback()
              }
            }
          }
        ],
        refreshToken: [
          { type: 'number', trigger: 'change' },
          {
            validator: (rule, value, callback, source, options) => {
              if (this.form.accessToken) {
                if (value > this.form.accessToken) {
                  callback()
                } else {
                  callback(new Error('必须大于访问凭证有效时间！'))
                }
              } else {
                callback()
              }
            }
          }
        ],
        name: [{ required: true, message: '请输入应用显示名称', trigger: 'change' }],
        // url: [{ required: true, message: "请输入注册地址", trigger: "change" }],
        microUrl: [
          {
            required: true,
            message: '请输入微应用地址',
            trigger: 'change'
          }
        ],
        openType: [
          {
            required: true,
            message: '请选择加载模式',
            trigger: 'change'
          }
        ],
        microMark: [
          {
            required: true,
            message: '请输入微应用标识',
            trigger: 'change'
          }
          // { validator: (rule, value, callback, source, options) => {
          //    if (!value) {
          //      callback()
          //    }else{
          //      var reg=/^[a-z]+$/
          //      if(!reg.test(value)){
          //         callback(new Error(`微应用标识为小写字母!`))
          //      }
          //      callback()
          //    }

          // }
          // }
        ]
        // bpsTenantId: [
        //   {
        //     required: true,
        //     message: "请输入流程租户",
        //     trigger: "change",
        //   },
        // ],
      },
      editDialogVisible: false,
      options: [
        {
          code: '1',
          name: '是'
        },
        {
          code: '0',
          name: '否'
        }
      ],
      addAttrs: {
        microMark: '',
        microUrl: ''
      },
      microAppCollist: [
        // {
        //   id: 1,
        //   microMark: "",
        //   microUrl: "",
        // },
      ],

      isMicroApp: '0',
      color: 'rgba(30, 144, 255, 1)',
      appPort:'',
      appIcon: '',
      eidtForm: {
        code: null
      },
      secretAfterRefresh: '', // 刷新后返回的密钥
    }
  },
  computed: {
    title() {
      return `${this.formType === 'add' ? '新建' : '编辑'}应用功能`
    },
    formType() {
      if (this.data) {
        return 'edit'
      } else {
        return 'add'
      }
    },
    isBpsStandalone() {
      return Vue.config.isBpsStandalone || false
    }
  },
  watch: {
    'form.types': {
      immediate: true,
      handler(val) {
        console.log(val, 'form.types')
      }
    },
    data: {
      immediate: true,
      handler(val) {
        if (val) {
          this.form = val
          this.showFooter = true
          if (val.types === 'other_flow_app') {
            this.isOtherFlowApp = '1'
          } else {
            this.isOtherFlowApp = '0'
          }
          if (val.openType === 'microApp') {
            if (isJSON(val.microUrl)) {
              this.microAppCollist = JSON.parse(val.microUrl)
              this.isMicroApp = '1'
            }
          }
          if (isJSON(val.extra)) {
            const extra = JSON.parse(val.extra)
            this.color = extra.color
            this.appPort = extra.appPort
            this.appIcon = extra.appIcon
          }
        }
      }
    }
  },
  async mounted() {
    if (!this.data && !this.isDialog) {
      this.isOneApp = true
      this.data = await this.findApp()
    }

  },
  methods: {
    async loadData() {
      if (this.data && this.data.realId) {
        const resp = await this.dispatch(ApplicationManager.getApplication, {
          payload: {
            template: {
              appid: this.data.realId
            }
          }
        })
        this.form = resp.data.appapplication
      }
    },
    async validateResolve() {
      let resp = {}
      this.btnLoading = true
      this.$emit('update:loading', this.btnLoading)
      this.form.extra = JSON.stringify({ color: this.color, appIcon: this.appIcon, appPort:this.appPort })
      if (this.isMicroApp === '1') {
        this.form.openType = 'microApp'
      }
      this.form.microUrl = JSON.stringify(this.microAppCollist)
      // this.form.bpsTenantId = ''
      this.form.types = this.isOtherFlowApp === '1' ? 'other_flow_app' : null
      if (this.formType === 'add') {
        this.form.tenantId = this.currentTenant
        resp = await this.dispatch(AppController.create, {
          payload: {
            application: this.form
          }
        })
        this.cancel()
      } else if (this.formType === 'edit') {
        resp = await this.dispatch(AppController.update, {
          payload: {
            application: this.form
          }
        })
      }
      this.btnLoading = false
      this.$emit('update:loading', this.btnLoading)
      if (!resp.error) {
        this.$msg.success('保存成功!')
        this.$emit('success')
        return true
      } else {
        return false
      }
    },
    async eidtName() {
      this.editDialogVisible = true
      this.eidtForm.code = this.form.code
    },

    arrRemove(arr, attr, value) {
      const newArr = arr.filter(function(item, index) {
        return item[attr] != value
      })
      return newArr
    },
    async submitName() {
      this.$refs[this.formRef].validate(async valid => {
        if (valid) {
          this.form.code = this.eidtForm.code
          await this.validateResolve()
          this.editDialogVisible = false
        }
      })
    },
    addMicroMark() {
      if (this.isMicroApp == '0') {
        this.isMicroApp = '1'
      }
      this.microAppCollist.push({
        id: Date.now(),
        microMark: 'name' + (this.microAppCollist.length + 1),
        microUrl: '/'
      })
    },
    delMicroMark(item) {
      this.$confirm('此是否删除当前微前端模块设置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.microAppCollist = this.arrRemove(this.microAppCollist, 'id', item.id)
        if (this.microAppCollist.length == 0) {
          this.isMicroApp = '0'
        }
      })
    },
    numberChage(val) {
      if (val === 'refreshToken') {
        if (this.form.refreshToken < 1) this.form.refreshToken = 1
      } else {
        if (this.form.accessToken < 1) this.form.accessToken = 1
      }
    },
    async testMicroMark(val) {
      let modulesList = []
      if (val && val.microUrl && val.microMark) {
        modulesList = await loadModulesList(`${val.microUrl}${val.microMark}/remoteEntry.js`)
      } else {
        modulesList = []
      }
      if (modulesList.length > 0) {
        this.$msg.success(`微前端模块${val.microMark}地址配置成功`)
      } else {
        this.$msg.error(`微前端模块${val.microMark}地址配置失败`)
      }
    },
    // 刷新密钥
    async handleRefresh(id) {
      const payload = { id }
      const resp = await this.dispatch(AppController.refreshSercet, payload)
      if (!resp.error) {
        // this.form.secret = resp.data
        // this.$emit('update:data', { ...this.data, secret: resp.data })
        this.form.secret = resp.data
      }
    },
    onCopy(e) {
      this.$msg.success('复制成功！')
    },
    onError(e) {
      this.$msg.error('复制失败！')
    },
  }
}
</script>
<style lang="scss" scoped>
.app-form {
  overflow-x:hidden;
  overflow-y:auto;
}
.cursor-hand {
  cursor: pointer;
}
::v-deep .el-table th > .cell {
  color: #909191 !important;
}

::v-deep .el-divider--horizontal {
  margin: 0 !important;
}
.icon-del {
  display: none;
}
.button-addmic {
    width: 150px;
    margin-top: 10px;
    margin-left: 11px;
    color: var(--tagBg);
    border-color: var(--tagBg);

}
.button-addmic:hover,.button-addmic:focus {
  color: #3B69B6 !important;
  border-color: #3B69B6 !important;
}
::v-deep .app-input .el-input__inner::placeholder {
  color: #F56C6C !important;
  font-size:12px;
}
.micro-item {
  width: 100%;
}
.micro-item-div {
  width: 100%;
  position:relative;
}
.micro-item-div:hover {
  background: #f5f5f5;
  .icon-del {
    display: inline-flex;
  }
}

::v-deep .disabled_btn {
  i.el-icon-edit {
    color: #fff;
}
}
.edit_dialog {
  ::v-deep .el-dialog__body {
    padding-bottom: 0px !important;
  }
}
.copy-btn,
.refresh-btn{
  border-color: var(--tagBg);
  color: var(--tagBg);
  margin-left:10px;
}
.icon-btn{
  line-height:30px;
  padding:5px;
  margin-top:30px;
  cursor:pointer;
  border-raduis:4px;
  &:hover{
    color:var(--tagBg);
  }
}
</style>
