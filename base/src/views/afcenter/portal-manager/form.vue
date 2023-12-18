<template>
  <div>
    <el-form
      :ref="formRef"
      :model="form"
      :rules="validateRules"
      label-position="top"
    >
      <el-row :key="formType" :gutter="20">
        <el-col :span="24">
          <el-form-item label="编号" prop="code">
            <el-input v-model.trim="form.code" v-focus="formType !== 'edit'" :disabled="formType === 'edit'" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="名称" prop="name">
            <el-input v-model.trim="form.name" v-focus="formType === 'edit'" />
          </el-form-item>
        </el-col>
        <el-col v-if="form.extra && form.extra.userOptions" :span="12">
          <el-form-item label="是否可以调整" prop="isCanUpdate">
            <el-radio-group v-model="form.extra.userOptions.isCanUpdate" :disabled="true">
              <el-radio-button :label="true">是</el-radio-button>
              <el-radio-button :label="false">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否发布" prop="isPublish">
            <el-radio-group v-model="form.isPublish">
              <el-radio-button label="1">是</el-radio-button>
              <el-radio-button label="0">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item v-if="form.extra && form.extra.userOptions && form.extra.userOptions.layoutType" label="布局" prop="layoutType">
            <el-radio-group v-model="form.extra.userOptions.layoutType">
              <el-radio v-for="item in layoutTypeList" :key="item.value" :label="item.value">
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="图标" prop="portalIcon">
            <PmSelectIcon v-model="form.portalIcon" mode="dialog" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="显示顺序" prop="sortNo">
            <el-input
              v-model="form.sortNo"
              type="number"
              min="1"
              max="999"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="showFooter" style="border-top: 1px" class="div-near-bottom">
      <el-button
        type="primary"
        :loading="btnLoading"
        @click="submit"
      >保存</el-button>
    </div>
  </div>
</template>
<script>
import IconSelect from '@/components/Icon/icon-select'
import { PortalController } from '@controller'
import { BaseVue, Form, _ } from '@lib'
import model, { LAYOUT_TYPE_LIST } from './model.js'
const YesOrNoOptions = [
  {
    code: true,
    name: '是'
  },
  {
    code: false,
    name: '否'
  }
]
export default {
  components: { IconSelect },
  mixins: [BaseVue, Form],
  props: {
    data: {},
    currentNode: {},
    mark: {
      type: String,
      default: 'pc',
    },
    isMobileLeaf: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    var checkLeafResourse = (rule, value, callback) => {
      if (!this.form.resource) {
        return callback(new Error('请输入/选择页面资源'))
      }
      callback()
    }
    let nameTimer = null
    return {
      YesOrNoOptions,
      formRef: 'form',
      model: model,
      layoutTypeList: LAYOUT_TYPE_LIST,
      form: _.cloneDeep(model),
      btnLoading: false,
      validateRules: {
        code: [
          { required: true, message: '请输入门户编号', trigger: 'change' },
          {
            validator: (rule, value, callback, source, options) => {
              if (this.formType === 'edit') {
                callback()
              }
              if (value && /[\u4E00-\u9FA5]/g.test(value)) {
                callback(new Error('编码不能输入汉字'))
              }
              var reg = /^[a-zA-Z_]([a-zA-Z0-9_]+)?$/
              if (!reg.test(value)) {
                callback(new Error('请输入大小写字母、数字或者下划线，并以字母或下划线开头！'))
              }
              if (nameTimer !== null) {
                clearTimeout(nameTimer)
              }
              if (!value) {
                callback()
              } else if (!this.formData || value !== this.formData.code) {
                nameTimer = setTimeout(async() => {
                  const res = await this.dispatch(PortalController.existenceByCode, {
                    code: value,
                    tenantId: this.currentTenant,
                  })
                  if (res.data == true) {
                    callback(new Error(`${value}编码已存在!`))
                  }
                  callback()
                }, 300)
              }
            },
          },
        ],
        name: [
          { required: true, message: '请输入门户名称', trigger: 'change' },
        ],
        leafResource: [
          { required: true, validator: checkLeafResourse, trigger: 'change' },
        ],
        resource: [{ required: false, trigger: 'change' }],
      },
    }
  },
  computed: {
    title() {
      return `${this.formType === 'add' ? '新建' : '编辑'}门户`
    },
    formType() {
      if (this.form.id) {
        return 'edit'
      } else {
        return 'add'
      }
    },
    appId() {
      return this.$route.query ? this.$route.query.appId : null
    }
  },
  watch: {
  },
  mounted() {
    if (this.data) {
      const { extra } = this.data
      const json = extra && JSON.parse(extra) || model.extra
      json.userOptions.layoutType = json.userOptions.layoutType ? json.userOptions.layoutType : model.extra.userOptions.layoutType
      this.form = { ...this.data, ...{ extra: json }}
      console.log('json:', json, this.form)
    }
  },
  methods: {
    async validateResolve() {
      this.$emit('update:loading', true)
      let resp = {}
      if (!this.form.scope) {
        this.form.scope = 'public'
      }
      if (this.formType === 'add') {
        const payload = {
          portal: {
            ...this.form,
            appId: this.appId || null,
            types: this.appId ? 'app' : 'platform',
            content: '',
            extra: JSON.stringify(this.form.extra)
          },
        }
        resp = await this.dispatch(PortalController.createWithPublic, payload)
      } else if (this.formType === 'edit') {
        const payload = {
          id: this.form.id,
          extra: this.form.extra,
          portalIcon: this.form.portalIcon,
          isPublish: this.form.isPublish,
          params: {
            name: this.form.name || '1',
            sortNo: this.form.sortNo || '1',
          }
        }
        resp = await this.dispatch(PortalController.updateWithPublic, payload)
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
    numberChage() {
      if (this.form.sortNo < 1) {
        this.form.sortNo = 1
      }
      if (this.form.sortNo > 99) {
        this.form.sortNo = 99
      }
    },
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
