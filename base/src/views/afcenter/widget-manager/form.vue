<template>
  <div>
    <el-form
      :ref="formRef"
      :model="form"
      :rules="validateRules"
      label-position="top"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="编号" prop="code">
            <el-input
              v-model.trim="form.code"
              v-focus
              :disabled="formType === 'edit'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="名称" prop="name">
            <el-input v-model.trim="form.name" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="页面资源" prop="leafResource">
            <SelectUrl v-model="form.resource" :mark="mark" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="图标" prop="description">
            <PmSelectIcon
              v-model="form.description"
              mode="dialog"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="宽度比例" prop="widthType">
            <el-radio-group v-model="form.widthType">
              <el-radio v-for="item in widthTypeList" :key="item" :label="item">{{
                item
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最小高度" prop="minHeight">
            <el-input-number v-model="form.minHeight" :min="1" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否自定义" prop="scope">
            <el-radio-group v-model="form.scope">
              <el-radio-button label="private">是</el-radio-button>
              <el-radio-button label="public">否</el-radio-button>
            </el-radio-group>
            <el-tooltip placement="top">
              <div slot="content">自定义widget不会显示头部的标题及配置</div>
              <i class="el-icon-question ml-10" />
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row></el-form>
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
import { WidgetController } from '@controller'
import { BaseVue, Form, _ } from '@lib'
import SelectUrl from '../menu/selectUrl.vue'
import model from './model.js'
export default {
  components: { IconSelect, SelectUrl },
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
      widthTypeList: ['small', 'middle', 'large'],
      formRef: 'form',
      model: model,
      form: _.cloneDeep(model),
      btnLoading: false,
      validateRules: {
        code: [
          { required: true, message: '请输入widget编号', trigger: 'change' },
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
                callback(
                  new Error(
                    '请输入大小写字母、数字或者下划线，并以字母或下划线开头！'
                  )
                )
              }
              if (nameTimer !== null) {
                clearTimeout(nameTimer)
              }
              if (!value) {
                callback()
              } else if (!this.formData || value !== this.formData.code) {
                nameTimer = setTimeout(async() => {
                  const res = await this.dispatch(
                    WidgetController.existenceByCode,
                    {
                      code: value,
                      tenantId: this.currentTenant,
                    }
                  )
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
          { required: true, message: '请输入widget名称', trigger: 'change' },
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
      return `${this.formType === 'add' ? '新建' : '编辑'}widget`
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
    },
  },
  watch: {},
  mounted() {
    if (this.data) {
      const { content } = this.data
      const json = content && JSON.parse(content) || {}
      const widthType = json && json.widthType || model.widthType
      const minHeight = json && json.minHeight || model.minHeight
      this.form = { ...this.data, widthType, minHeight }
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
        const resource = this.form.resource ? { id: this.form.resource.id } : {}
        const payload = {
          widget: {
            ...this.form,
            content: JSON.stringify({
              widthType: this.form.widthType,
              minHeight: this.form.minHeight,
            }),
            appId: this.appId || null,
            types: this.appId ? 'app' : 'platform',
            resource,
          },
        }
        resp = await this.dispatch(WidgetController.create, payload)
      } else if (this.formType === 'edit') {
        const resource = this.form.resource ? { id: this.form.resource.id } : {}
        const payload = {
          widget: {
            ...this.form,
            content: JSON.stringify({
              widthType: this.form.widthType,
              minHeight: this.form.minHeight,
            }),
            resource,
          },
        }
        resp = await this.dispatch(WidgetController.update, payload)
      }
      console.log('123')
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
<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-group--append .el-input__inner {
  border-right: 0 ;
}
</style>
