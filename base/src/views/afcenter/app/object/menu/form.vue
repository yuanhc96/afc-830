<template>
  <div>
    <el-form
      :ref="formRef"
      :model="form"
      :rules="validateRules"
      label-position="top"
      label-width="150px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="编码" prop="code">
            <el-input v-model="form.code" :disabled="formType==='edit'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="是否叶子菜单" prop="isLeaf">
            <!-- <Dict v-model="form.isLeaf" :disabled="formType==='edit' || params.appMenu.menuid=='objectMenu'" dicttypeid="sys_switch" /> -->
            <el-select v-model="form.isLeaf" class="w-100p" placeholder="请选择" :disabled="formType==='edit' || params.appMenu.menuid=='objectMenu'">
              <el-option v-for="item in switchOptions" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- v-if="form.isLeaf !== '0'" -->
        <el-col v-if="form.isLeaf !== '0'" :span="12">
          <el-form-item label="页面" prop="leafResource">
            <SelectUrl v-model="form.resource" :app-id="appId" :business-obj-id="businessObjId" :url="form.resource?form.resource.name:''" @selectUrl="selectUrl" />
          </el-form-item>
        </el-col>
        <el-col v-else :span="12">
          <el-form-item label="页面" prop="resource">
            <SelectUrl v-model="form.resource" :app-id="appId" :business-obj-id="businessObjId" :url="form.resource?form.resource.name:''" @selectUrl="selectUrl" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="图标" prop="menuIcon">
            <icon-select
              v-model="form.menuIcon"
              placeholder="请选择菜单图标"
              @input="iconSelect"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="显示顺序" prop="sortNo">
            <el-input v-model="form.sortNo" type="number" min="1" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="showFooter" style="border-top: 1px " class="div-near-bottom">
      <el-button type="primary" :loading="btnLoading" @click="submit">保存</el-button>
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
    loading: {
      type: Boolean,
      default: false
    },
    businessObjId: {
      type: String,
      default: null,
    },
    appId: {
      type: String,
      default: null,
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
      formRef: 'form',
      model: model,
      form: _.cloneDeep(model),
      optionsValue: '',
      isAddPptionsValue: false,
      btnLoading: false,
      colors: [
        'linear-gradient(135deg,#7ed49a,#46c26f)',
        'linear-gradient(135deg,#63d1e8,#00aed1)',
        'linear-gradient(135deg,#77abf4,#2f7deb)',
        'linear-gradient(135deg,#a782f0,#7e47eb)',
        'linear-gradient(135deg,#f18585,#eb5050)',
        'linear-gradient(135deg,#f18585,#eb5050)',
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
          { required: true, message: '请输入应用代码', trigger: 'change' },
          { validator: (rule, value, callback, source, options) => {
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
                const res = await this.dispatch(MenuController.isExist, { code: value, tenantId: this.currentTenant })
                if (res.data == true) {
                  callback(new Error(`${value}编码已存在!`))
                }
                callback()
              }, 300)
            }
          } }
        ],
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'change' },
        ],
        isLeaf: [
          { required: true, message: '请选择是否菜单', trigger: 'change' },
        ],
        leafResource: [
          { required: true, validator: checkLeafResourse, trigger: 'change' },
        ],
        resource: [
          { required: false, trigger: 'change' },
        ]
      },
    }
  },
  computed: {
    title() {
      return `${this.formType === 'add' ? '新建' : '编辑'}菜单`
    },
    denyChangeLeaf() {
      return (
        (this.params && this.params.appMenu.menuid === 'objectMenu') ||
        (this.formType === 'edit' &&
          this.form.isleaf === '0' &&
          this.menu &&
          !this.menu.isLeaf)
      )
    },
    formType() {
      if (this.form.id) {
        return 'edit'
      } else {
        return 'add'
      }
    },
  },
  watch: {
    menu: {
      immediate: true,
      handler(val) {
        this.loadData(val)
      },
    },
  },
  mounted() {},
  methods: {
    iconSelect(data) {
      // this.form.menuIcon=data
    },
    selectUrl(data) {
      this.form.resource = data
      console.log(this.form.resource)
    },
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
      // this.form = menu;
    },
    async validateResolve() {
      this.btnLoading = true
      this.$emit('update:loading', true)

      // if (this.menuConfig.isOut) {
      //   let err = "";
      //   this.menuConfig.params.forEach((item) => {
      //     if (!item.name) {
      //       err = true;
      //     }
      //   });
      //   if (err) {
      //     this.$message({
      //       type: "warning",
      //       message: "key值不能为空",
      //     });
      //     return;
      //   }
      // }
      const resp = {}
      if (!this.form.funccode) {
        this.form.funcname = null
      }
      if (this.formType === 'add') {
        const resource = this.form.resource ? { id: this.form.resource.id } : {}
        const payload = {
          menu: {
            ...this.form,
            parentId: this.params.appMenu.menuid,
            tenantId: this.currentTenant,
            resource,
            menuType: 'businessObject',
            businessObjId: this.businessObjId
          },
        }
        const resp = await this.dispatch(MenuController.create, payload)
      } else if (this.formType === 'edit') {
        const resource = this.form.resource ? { id: this.form.resource.id } : {}
        const payload = {
          menu: {
            ...this.form,
            resource
          },
        }
        const resp = await this.dispatch(MenuController.update, payload)
      }
      this.btnLoading = false
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

  },
}
</script>
<style lang="scss" scoped>
.color-picker{
  border-radius: 17px;
    cursor: pointer;
    display: inline-block;
    height: 34px;
    margin: 0 6px;
    width: 34px;
}
</style>
