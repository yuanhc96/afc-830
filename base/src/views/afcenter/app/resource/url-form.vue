<template>
  <div>
    <el-form :ref="formRef" :model="form" :rules="validateRules" label-position="top">
      <div style="display: grid;grid-template-columns: repeat(2,1fr);grid-column-gap: 22px">
        <div>
          <el-form-item id="openType" label="类型" prop="openType">
            <Dict v-model="content.openType" dicttypeid="sys_open_types" :disabled="formType === 'edit'" @change="dictChange" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="编号" prop="code">
            <el-input v-model.trim="form.code" v-focus="!(formType === 'edit' || this.content.openType === 'lowReport')" :disabled="formType === 'edit' || this.content.openType === 'lowReport'" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="名称" prop="name">
            <el-input v-model.trim="form.name" v-focus="formType === 'edit' || this.content.openType === 'lowReport'" />
          </el-form-item>
        </div>
        <div v-if="MicroAppOpenType.includes(content.openType )">
          <el-form-item label="模块名称" prop="appMark">
            <el-select v-model="content.microMark" style="width: 100%;">
              <el-option
                v-for="item in appMicroList"
                :key="item.id"
                :label="item.microMark"
                :value="item.microMark"
              />
            </el-select>
          </el-form-item>
        </div>
        <div v-if="content.openType == 'otherMicroApp'">
          <el-form-item label="路由" prop="router">
            <el-input v-model.trim="content.router" placeholder="" />
          </el-form-item>
        </div>
        <div v-if="content.openType == 'microApp'">
          <el-form-item label="标识" prop="mark">
            <el-autocomplete
              v-model.trim="content.mark"
              class="w-100p"
              :fetch-suggestions="querySearch"
              placeholder="请输入/选择页面标识"
              :trigger-on-focus="true"
              @select="handleSelect"
            />
          </el-form-item>
        </div>
        <template v-if="content.openType == 'lowView' || content.openType == 'lowForm'">
          <div>
            <el-form-item label="低开资源" prop="lowResourse">
              <SelectTree
                v-model="currentRes"
                :app-code="appCode"
                :low-res-type="content.openType"
                @setLowresValue="getLowresValue"
              />
            </el-form-item>
          </div>
        </template>
        <div v-if="content.openType === 'lowReport'">
          <el-form-item label="报表资源" prop="BiResourse">
            <BiResourseTree
              v-model="currentRes"
              style="width: 100%"
              :app-code="appCode"
              @setBiResValue="getBiResValue"
            />
          </el-form-item>
        </div>

        <div v-if="content.openType == 'afcenter'">
          <el-form-item label="路径" prop="afcenterPath">
            <el-input v-model.trim="content.afcenterPath" />
          </el-form-item>
        </div>
        <div v-if="content.openType === 'process'">
          <el-form-item label="流程定义" prop="processDefName">
            <el-select
              v-model="content.processDefName"
              style="width:100%"
              filterable
              placeholder="请输入流程中文名称搜索/选择流程资源"
              @change="proceeChange"
            >
              <el-option v-for="item in processes" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </div>

        <div v-if="!['iframe', 'lowReport'].includes(this.content.openType)">
          <el-form-item label="" prop="query">
            <div slot="label">
              输入参数
              <el-tooltip class="item" effect="dark" placement="top">
                <div slot="content">
                  1.格式 例如:a=a1&b=b1
                  <br>
                  2.支持配置当前用户信息;例如:userName=${userName}
                  <br>
                  3.当前用户信息支持字段:userName,userId,userRealName,userMail,userOrgName,userOrgId
                </div>
                <i class="el-icon-question ml-10" style="color: #2a4767" />
              </el-tooltip>
            </div>
            <el-input v-model.trim="content.query" />

          </el-form-item>
        </div>
        <div v-if="content.openType == 'iframe'">
          <el-form-item label="地址" prop="url">
            <el-input v-model.trim="content.url" />
          </el-form-item>
        </div>
        <div v-if="['iframe', 'lowReport'].includes(content.openType)">
          <el-form-item label="" prop="params">
            <template solt="label">
              <span>输入参数</span>
              <el-tooltip class="item" effect="dark" placement="top">
                <div slot="content">
                  1.支持配置当前用户信息;例如:userName=${userName}
                  <br>
                  2.当前用户信息支持字段:userName,userId,userRealName,userMail,userOrgName,userOrgId
                </div>
                <i class="el-icon-question ml-10" style="color: #2a4767" />
              </el-tooltip>
            </template>

            <el-input v-model.trim="content.params" />

          </el-form-item>
        </div>
        <div v-if="content.openType && !MicroAppOpenType.includes(content.openType)">
          <el-form-item label="描述" prop="description">
            <el-input v-model.trim="form.description" type="textarea" :rows="2" />
          </el-form-item>
        </div>
      </div>
      <div v-if="!content.openType || MicroAppOpenType.includes(content.openType)">
        <el-form-item label="描述" prop="description">
          <el-input v-model.trim="form.description" type="textarea" :rows="2" />
        </el-form-item>
      </div>
    </el-form>
    <div v-if="showFooter" style="border-top: 1px solid #e8e8e8" class="text-center pt-10">
      <el-button type="primary" :loading="loading" @click="submit">保存</el-button>
    </div>
  </div>
</template>
<script>
import { loadModulesList } from '@/utils/loadRemote.js'
import { AppController, BfpProcessManagerController, DictTypeController, ResourceController } from '@controller'
import { BaseVue, Form } from '@lib'
import { isJSON } from '@util/tools.js'
import { cloneDeep, get } from 'lodash'
import { mapGetters } from 'vuex'
import BiResourseTree from './BI-resourse-tree.vue'
import SelectTree from './low-res-tree.vue'
import model from './model.js'
const MicroAppOpenType = ['microApp', 'otherMicroApp']
export default {
  components: { SelectTree, BiResourseTree },
  mixins: [BaseVue, Form],
  props: {
    data: {},
    params: {
      default: null
    },
    businessObjId: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    appId: {
      type: String,
      default: null
    }
  },
  data() {
    var checkOpenType = (rule, value, callback) => {
      if (!this.content.openType) {
        return callback(new Error('请选择页面加载模式'))
      }
      callback()
    }
    var checkmark = (rule, value, callback) => {
      if (!this.content.mark) {
        return callback(new Error('请输入页面标识'))
      }
      // else{
      //        var reg=/^[a-z]+$/
      //        if(!reg.test(this.content.mark)){
      //           callback(new Error(`页面标识为小写字母!`))
      //        }
      //        callback()
      //      }
      callback()
    }
    var checkafcenterPath = (rule, value, callback) => {
      if (!this.content.afcenterPath) {
        return callback(new Error('请输入页面地址'))
      }
      callback()
    }
    var checkUrlPath = (rule, value, callback) => {
      if (!this.content.url) {
        return callback(new Error('请输入页面地址'))
      }
      callback()
    }
    var checkappMark = (rule, value, callback) => {
      if (!this.content.microMark) {
        return callback(new Error('请选择模块标识'))
      }
      callback()
    }
    var checklowResourse = (rule, value, callback) => {
      if (!this.content.resourceCode) {
        return callback(new Error('请选择低开资源'))
      }
      callback()
    }
    var checkBiResourse = (rule, value, callback) => {
      if (!this.content.bicode) {
        return callback(new Error('请选择报表资源'))
      }
      callback()
    }

    var checkprocessDefName = (rule, value, callback) => {
      if (!this.content.processDefName) {
        return callback(new Error('请输入流程定义名称'))
      }
      callback()
    }

    const codeTimer = null
    let nameTimer = null
    return {
      MicroAppOpenType,
      formRef: 'form',
      model: model,
      form: cloneDeep(model.resource),
      content: {
        openType: null,
        mark: null,
        url: null,
        params: null,
        microUrl: null, // 微前端模块url
        microMark: null, // 微前端模块标识
        isLowOrHigh: 'high',
        resourceCode: null,
        formStatus: null,
        resourceType: null,
        viewType: null,
        appCode: null,
        query: null,
        processDefName: null,
        biId: null,
        biType: null,
        bicode: null
      },
      dicttypeid: 'sys_open_types',
      dictType: [],
      dictTypeAll: [],
      isShowAfc: false,
      modulesList: [],
      appMicroList: [],
      processes: [],
      selectProcess: null,
      currentRes: {},
      appCode: '',
      resourceTypes: [
        { value: 'form', name: '表单' },
        { value: 'view', name: '视图' }
      ],
      validateRules: {
        code: [
          { required: true, message: '请输入页面编号', trigger: 'change' },
          {
            validator: (rule, value, callback, source, options) => {
              if (this.formType === 'edit') {
                callback()
              }
              if (nameTimer !== null) {
                clearTimeout(nameTimer)
              }
              if (!value) {
                callback()
              } else if (!this.formData || value !== this.formData.code) {
                nameTimer = setTimeout(async() => {
                  const res = await this.dispatch(ResourceController.isExist, {
                    code: value,
                    tenantId: this.currentTenant
                  })
                  if (res.data == true) {
                    callback(new Error(`${value}编码已存在!`))
                  }
                  callback()
                }, 300)
              }
            }
          }
        ],
        name: [{ required: true, message: '请输入页面名称', trigger: 'change' }],
        mark: [{ required: true, validator: checkmark, trigger: 'change' }],
        afcenterPath: [{ required: true, validator: checkafcenterPath, trigger: 'change' }],
        url: [{ required: true, validator: checkUrlPath, trigger: 'change' }],
        openType: [{ required: true, validator: checkOpenType, trigger: 'change' }],
        appMark: [{ required: true, validator: checkappMark, trigger: 'change' }],
        lowResourse: [{ required: true, validator: checklowResourse, trigger: 'change' }],
        processDefName: [{ required: true, validator: checkprocessDefName, trigger: 'change' }],
        BiResourse: [{ required: true, validator: checkBiResourse, trigger: 'change' }]
      }
    }
  },
  computed: {
    title() {
      return `${this.formType === 'add' ? '新建' : '编辑'}功能`
    },
    formType() {
      if (!this.params) {
        return 'edit'
      } else {
        return 'add'
      }
    },
    openTypeList() {
      return this.isShowAfc ? this.dictTypeAll : this.dictType
    },
    ...mapGetters(['dicts'])
  },
  watch: {
    businessObjId(res) {
      this.businessObjId = res
    },
    'content.microMark': {
      immediate: true,
      async handler(val) {
        console.log(this.appMicroList, val)
        const microUrl = get(
          this.appMicroList.find((item) => item.microMark === val),
          'microUrl',
          null
        )
        if (microUrl) {
          this.modulesList = await loadModulesList(`${microUrl}${val}/remoteEntry.js`)
        } else {
          this.modulesList = []
        }
      }
    },
    'content.openType': {
      immediate: true,
      async handler(val) {
        if(val){
          this.clearValidate('form') // 清除整个表单的校验
        }
        if (val && val === 'process') {
          await this.getProcess()
        }
        if (val && this.formType === 'add') {
          this.form.code = null
          this.form.name = null
          if (['lowView', 'lowForm'].includes(val)) {
            this.currentRes = null
          } else if (val === 'process') {
            this.content.processDefName = null
          } else if (val === 'lowReport') {
            this.content.biId = null
            this.content.biType = null
            this.content.bicode = null
          }
        }
      }
    },
    dicts: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          const objectType = this.dicts[this.dicttypeid] || []
          this.dictTypeAll = objectType
          this.dictType = objectType.filter((item) => item.code != 'afcenter')
        }
      }
    },

  },
  async mounted() {
    this.loadDictData()
    const app = await this.findAppbyId()
    if (app.openType === 'microApp') {
      if (isJSON(app.microUrl)) {
        this.appMicroList = JSON.parse(app.microUrl)
        // if (this.appMicroList.length > 0) {
        //   this.content.microMark = this.appMicroList[0].microMark;
        // }
      }
    }
    // edit
    if (this.form.content) {
      const content = JSON.parse(this.form.content)
      this.content = { ...content }
      this.currentRes = { ...content }
    }
    // 双击页面类型 显示出 afcenter 类型
    // document.addEventListener('dblclick', (e) => {
    //   const formItem = document.getElementById('openType')
    //   if (formItem) {
    //     this.isShowAfc = true
    //   }
    // })
  },
  methods: {
    dictChange(dict) {
      // console.log('======+++',dict)
    },
    async querySearch(queryString, cb) {
      const list = [{}]
      const results = queryString
        ? this.modulesList.filter((item) => item.indexOf(queryString) != -1)
        : this.modulesList
      for (const item of results) {
        list.push({ value: item })
      }
      cb(list)
    },
    async findAppbyId() {
      const payload = { id: this.appId }
      const app = await this.dispatch(AppController.findApp, payload)
      this.appCode = app.data.code
      return app.data
    },
    async remoteValidateCode(funccode) {
      const resp = await this.dispatch(FunctionManager.validateFunction, {
        payload: { template: { funccode }}
      })
      if (!resp.error) {
        return resp.data.data === 0
      } else {
        return false
      }
    },
    async validateResolve() {
      this.$emit('update:loading', true)
      let resp = {}
      this.content.appCode = this.appCode
      if (this.formType === 'add') {
        this.form.content = JSON.stringify(this.content)
        this.form.resGroupId = this.params.resGroupId
        this.form.tenantId = this.currentTenant
        const parameter =
          this.businessObjId == null ? { appId: this.params.appId } : { businessObjId: this.businessObjId }
        resp = await this.dispatch(ResourceController.create, {
          payload: {
            resource: {
              ...this.form,
              ...parameter,
              types: this.params.type
            }
          }
        })
      } else if (this.formType === 'edit') {
        this.form.content = JSON.stringify(this.content)
        resp = await this.dispatch(ResourceController.update, {
          resource: {
            ...this.form
          }
        })
      }
      this.$emit('update:loading', false)
      if (!resp.error) {
        this.$msg.success('保存成功!')
        this.$emit('success')
        return true
      } else {
        return false
      }
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
    getBiResValue(node) {
      if (node) {
        this.content.biId = node.id
        this.content.biType = node.type
        this.content.bicode = node.code
        this.form.code = node.code
        this.form.name = `${node.typeName}_${node.label}`
      }
    },
    async getProcess() {
      const payload = { pageIndex: 0, pageSize: 9999, appCode: this.appCode }
      const resp = await this.dispatch(BfpProcessManagerController.queryProcessDefineInfosByAppCode, payload)
      this.processes = resp.data.data.data.map((item) => {
        return {
          value: item.processDefName,
          label: item.processChName
        }
      })
    },
    proceeChange(data) {
      if (this.formType !== 'edit') {
        this.form.code = data
      }
      this.form.name = this.processes.filter((item) => item.value === data)[0].label
    },
    getLowresValue(node) {
      if (node) {
        console.log(node, 'getLowresValue')
        this.content.resourceCode = node.partendCode
        if (this.content.openType === 'lowView') {
          if (node.code === 'default') {
            this.content.viewType = 'view'
          } else {
            this.content.viewType = node.code
          }
          if (this.formType !== 'edit') {
            this.form.code = node.id
          }
          this.form.name = `${node.partendName}_${node.label}`
        } else {
          this.content.resourceType = 'form'
          this.content.formStatus = node.type
          if (this.formType !== 'edit') {
            this.form.code = node.id
          }
          this.form.name = `${node.partendName}_${node.name}`
        }
      } else {
        this.content.resourceCode = null
        this.content.formStatus = null
        this.content.viewType = null
      }
    }
  }
}
</script>
