<template>
  <div style="max-width: 600px;">
    <el-form :ref="formRef" :model="form" :rules="validateRules" label-position="top">
      <el-form-item v-if="parentType || parentDict" label="上级类型" prop="parentid">
        <el-input v-if="parentType" v-model="parentType.code" :disabled="true" />
        <el-input v-else v-model="parentDict.code" :disabled="true" />
      </el-form-item>
      <el-form-item label="类型编号" prop="code">
        <el-input v-model="form.code" :disabled="formType==='edit'" />
      </el-form-item>
      <el-form-item label="类型名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="排序" prop="sortBy">
        <el-input v-model="form.sortBy" type="number" :min="1" clearable />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" :disabled="readonly" type="textarea" :rows="2" />
      </el-form-item>
    </el-form>
    <div v-if="showFooter" style="border-top: 1px;" class="div-near-bottom">
      <el-button v-permission="FuncCode.afc_f_dicttype_edit" type="primary" :loading="btnLoading" @click="submit">保存</el-button>
    </div>
  </div>
  <!-- <div slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div> -->
</template>
<script>
import { DictTypeController } from '@controller'
import { BaseVue, Form, _ } from '@lib'
import model from './model.js'

export default {
  components: {},
  mixins: [BaseVue, Form],
  props: {
    parentType: {},
    parentDict: {},
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let nameTimer = null
    return {
      formRef: 'form',
      showFooter: false,
      btnLoading: false,
      validateRules: {
        name: [
          { required: true, message: '字典类型名称不能为空!' },
          { min: 1, max: 255, message: '字典类型编号长度范围1~255个字符!' },
        ],
        code: [
          { required: true, message: '字典类型编号不能为空!' },
          { min: 1, max: 128, message: '字典类型编码长度范围1~128个字符!' },
          { validator: (rule, value, callback, source, options) => {
            if (this.formType === 'edit') {
              callback()
            }
            if (nameTimer !== null) {
              clearTimeout(nameTimer)
            }
            if (!value) {
              callback()
            } else if (value.indexOf('~') != -1) {
              callback(new Error(`编号不能含有～特殊字符`))
            } else if (!this.formData || value !== this.formData.code) {
              nameTimer = setTimeout(async() => {
                const res = await this.dispatch(DictTypeController.findDictTypeIsExist, { code: value, tenantId: this.currentTenant })
                if (res.data == true) {
                  callback(new Error(`${value}编号已存在!`))
                }
                callback()
              }, 300)
            }
          } }
        ],
      },
      model: model,
      form: _.cloneDeep(model),
    }
  },
  computed: {
    title() {
      return `${this.formType === 'add' ? '新建' : '编辑'}字典类型`
    },
    formType() {
      if (this.form.id) {
        return 'edit'
      } else {
        return 'add'
      }
    }
  },
  mounted() {
    if (this.formType === 'edit') {
      this.showFooter = true
    }
  },
  methods: {
    async validateResolve() {
      this.btnLoading = true
      this.$emit('update:loading', this.btnLoading)
      let resp = {}
      if (this.formType === 'add') {
        let parentId = ''
        if (this.parentType || this.parentDict) {
          if (this.parentType) {
          // 添加子项
            parentId = this.parentType.id
          } else {
            parentId = this.parentDict.id
          }
        }
        resp = await this.dispatch(DictTypeController.create, {
          payload:
             {
               dictType: {
                 ...this.form,
                 parentId: parentId,
                 tenantId: this.currentTenant || 'default'
               }
             }

        })
      } else if (this.formType === 'edit') {
        resp = await this.dispatch(DictTypeController.update, {
          payload: {
            dictType: {
              ...this.form,
            }
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
    }
  }
}
</script>
