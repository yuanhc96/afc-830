<template>
  <div>
    <el-form
      :ref="formRef"
      :model="form"
      :rules="validateRules"
      label-position="top"
      style="max-width:1024px;"
    >
      <el-row :key="formType" :gutter="20">
        <el-col :span="12">
          <el-form-item label="编号" prop="code">
            <el-input v-model.trim="form.code" v-focus="formType !== 'edit'" :disabled="formType === 'edit'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model.trim="form.name" v-focus="formType === 'edit'" />
          </el-form-item>
        </el-col>
        <el-col v-if="form.isLeaf !== '0'" :span="24">
          <el-form-item label="页面" prop="leafResource">
            <SelectUrl v-model="form.resource" class="w-100p" :mark="mark" />
          </el-form-item>
        </el-col>
        <el-col v-else :span="24">
          <el-form-item v-if="levelMenu_1" label="页面" prop="resource">
            <SelectUrl v-model="form.resource" class="w-100p" :mark="mark" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="是否叶子菜单" prop="isLeaf">
            <el-select v-model="form.isLeaf" class="w-100p" :disabled="isDisabled">
              <el-option v-for="item in switchOptions" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="levelMenu_1" :span="12">
          <el-form-item label="打开模式">
            <el-select
              v-model="form.isNewWindowOpen"
              class="w-100p"
              clearable
            >
              <el-option
                v-for="item in openTypeOptions"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="sortNo">
            <el-input
                v-model="form.sortNo"
                type="number"
                min="1"
                max="99"
                @change="numberChage()"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="图标" prop="menuIcon">
            <icon-select
              v-model="form.menuIcon"
              placeholder="请选择菜单图标"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="图标颜色" prop="description">
            <IconColorPicker v-model="form.description" />
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
import { MenuController } from '@controller'
import { BaseVue, Form, _ } from '@lib'
import model from './model.js'
import SelectUrl from './selectUrl.vue'
export default {
  components: { IconSelect, SelectUrl },
  mixins: [BaseVue, Form],
  props: {
    menu: {},
    params: {},
    currentNode: {},
    mark: {},
    isMobileLeaf: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  inject: ['currentAppId'],
  data() {
    var checkLeafResourse = (rule, value, callback) => {
      if (!this.form.resource) {
        return callback(new Error('请输入/选择页面资源'))
      }
      callback()
    }
    let nameTimer = null
    return {
      formRef: 'form',
      model: model,
      form: _.cloneDeep(model),
      optionsValue: '',
      isAddPptionsValue: false,
      btnLoading: false,
      isIframeResourse: false,
      openTypeOptions: [
        {
          code: 'fullScreen',
          name: '全屏模式',
        },
        {
          code: 'newOpenWindow',
          name: '新窗口打开',
        },
      ],
      switchOptions: [
        {
          code: '0',
          name: '否'
        },
        {
          code: '1',
          name: '是'
        }
      ],

      validateRules: {
        code: [
          { required: true, message: '请输入菜单编号', trigger: 'change' },
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
                  const res = await this.dispatch(MenuController.isExist, {
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
          { required: true, message: '请输入菜单名称', trigger: 'change' },
          // {
          //   validator: (rule, value, callback, source, options) => {
          //     if (!value) {
          //       callback();
          //     } else {
          //       const nameSize = this.getInputSize(value);
          //       if (nameSize > 8) {
          //         callback(new Error("菜单名称不能超过8个字符"));
          //       }
          //       callback();
          //     }
          //   },
          // },
        ],
        isLeaf: [
          { required: true, message: '请选择是否菜单', trigger: 'change' },
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
      return `${this.formType === 'add' ? '新建' : '编辑'}菜单`
    },
    formType() {
      if (this.form.id) {
        return 'edit'
      } else {
        return 'add'
      }
    },
    levelMenu_1() {
      return (
        (this.params && (this.params.appMenu.menuid == 'root' || this.params.appMenu.menuid == 'appRoot')) ||
        (this.form.parentId == 'root' || this.form.parentId == 'appRoot')
      )
    },
    isDisabled() {
      return (
        this.formType === 'edit' || this.isMobileLeaf ||
        (this.params && (this.params.appMenu.menuid == 'root' || this.params.appMenu.menuid == 'appRoot'))
      )
    },
    appId() {
      return (this.$route.query ? this.$route.query.appId : null) || this.currentAppId || null
    }
  },
  watch: {
    menu: {
      immediate: true,
      handler(val) {
        this.loadData(val)
      },
    },
    isMobileLeaf: {
      immediate: true,
      handler(val) {
        if (val) {
          this.form.isLeaf = '1'
        }
      }
    }
  },
  mounted() {
    console.log(this.mark, 'form')
  },
  methods: {
    addParams() {
      this.menuConfig.params.push({
        name: '',
        valie: '',
      })
    },
    addParamsOptions() {
      if (!this.optionsValue) {
        this.$msg.warning('请输入有效的值')
        return
      }
      this.menuConfig.options.push({
        name: '',
        value: this.optionsValue,
      })
      this.optionsValue = ''
      this.isAddPptionsValue = false
    },
    delParams(index) {
      this.menuConfig.params.splice(index, 1)
    },
    delOptions(index) {
      this.menuConfig.options.splice(index, 1)
    },
    async loadData(menu) {
      if (menu && menu.id) {
        const payload = { id: menu.id }
        const resp = await this.dispatch(MenuController.findMenu, payload)
        this.form = resp.data
      }
    },
    async validateResolve() {
      this.$emit('update:loading', true)
      const resp = {}
      if (!this.form.funccode) {
        this.form.funcname = null
      }
      if (this.formType === 'add') {
        const resource = this.form.resource
          ? { id: this.form.resource.id }
          : {}

        let menuType = null
        if (this.appId) {
          menuType = this.mark && this.mark === 'mobile' ? 'mobile' : 'pc'
        } else {
          menuType = this.mark && this.mark === 'mobile' ? 'mobile' : null
        }
        const payload = {
          menu: {
            ...this.form,
            parentId: this.params.appMenu.menuid,
            tenantId: this.currentTenant,
            resource,
            menuType,
            appId: this.appId || null,
          },
        }
        const resp = await this.dispatch(MenuController.create, payload)
      } else if (this.formType === 'edit') {
        const resource = this.form.resource
          ? { id: this.form.resource.id }
          : {}
        const payload = {
          menu: {
            ...this.form,
            resource,
          },
        }
        const resp = await this.dispatch(MenuController.update, payload)
      }
      this.$emit('update:loading', false)
      if (!resp.error) {
        this.$msg.success('保存成功!')
        this.$emit('success')
        this.$emit('refreshTree')
        return true
      } else {
        return false
      }
    },
    getInputSize(value) {
      if (!value) {
        return 0
      }
      const charCount = value.split('').reduce((prev, curr) => {
        // 英文字母和数字等算一个字符；这个暂时还不完善；
        if (/[a-z]|[0-9]|[,;.!@#-+/\\$%^*()<>?:"'{}~]/i.test(curr)) {
          return prev + 1
        }
        // 其他的算是2个字符
        return prev + 2
      }, 0)
      // 向上取整，防止出现半个字的情况
      return Math.ceil(charCount / 2)
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
<style lang="scss" scoped>
::v-deep .el-input-group--append .el-input__inner {
  border-right: 0 ;
}
.el-col-12 {
    height:70px;
  }
</style>

