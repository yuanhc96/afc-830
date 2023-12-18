<template>
  <div style="max-width:600px">
    <el-form :ref="formRef" :model="form" :rules="validateRules" label-position="top">
      <el-row :gutter="22">
        <el-col :span="24">
          <el-form-item v-if="formType === 'add'" label="字典类型" prop="dictType">
            <el-select v-if="parentEntry || upEntry" v-model="byDictTypeId" style="width: 100%" placeholder="请选择">
              <el-option v-for="item in DicttypeList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <el-input v-else v-model="dictType.name" disabled="true" />
          </el-form-item>

          <el-form-item v-else label="字典类型" prop="dictType">
            <el-input v-if="dict" v-model="dict.name" disabled="true" />
          </el-form-item>
        </el-col>
        <el-col v-if="parentEntry || upEntry || (dictType && dictType.levels != 0)" :span="24">
          <el-form-item label="上级字典项" prop="updictEntry">
            <el-input v-if="parentEntry" v-model="parentEntry.code" disabled="true" />
            <el-input v-else-if="upEntry" v-model="upEntry.code" disabled="true" />
            <el-select v-else v-model="byDictEntryId" class="w-500px" placeholder="请选择">
              <el-option v-for="item in byDictEntryList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="编号" prop="code">
            <el-input v-model="form.code" :disabled="formType === 'edit'" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="sortBy">
            <el-input v-model="form.sortBy" type="number" :min="1" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="颜色" prop="extend">
            <el-color-picker
              v-model="form.extend"
              show-alpha
              :predefine="predefineColors"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述" prop="description">
            <el-input v-model="form.description" :disabled="readonly" type="textarea" :rows="2" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div v-if="showFooter" style="border-top: 1px" class="div-near-bottom">
      <el-button v-permission="FuncCode.afc_f_dictentry_edit" type="primary" :loading="btnLoading" @click="submit">
        保存
      </el-button>
    </div>
  </div>
</template>
<script>
import { DictEntryController, DictTypeController } from '@controller'
import { BaseVue, Form, _ } from '@lib'
import model from './model.js'

export default {
  mixins: [BaseVue, Form],
  props: {
    parentEntry: {},
    dictType: {},
    upEntry: {},
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let nameTimer = null
    var checkdictType = (rule, value, callback) => {
      if (this.parentEntry) {
        if (!this.byDictTypeId) {
          return callback(new Error('业务字典类型必填项'))
        }
      }
      callback()
    }
    var checkdictEntry = (rule, value, callback) => {
      if (!this.parentEntry && !this.upEntry && this.byDictEntryList.length == 0) {
        return callback(new Error('上级业务字典必填项'))
      }
      if (this.byDictEntryList.length > 0) {
        if (!this.byDictEntryId) {
          return callback(new Error('上级业务字典必填项'))
        }
      }

      callback()
    }

    return {
      formRef: 'form',
      dict: null,
      showFooter: false,
      btnLoading: false,
      DicttypeList: [],
      byDictTypeId: null,
      byDictEntryId: null,
      byDictEntryList: [],
      predefineColors: [
        '#FF7875',
        '#FF9C6E',
        '#FFA940',
        '#FFC53D',
        '#FFEC3D',
        '#FF0000',
        '#73D13D',
        '#13C202',
        '#1890FF',
        '#2F54EB',
        '#B37FEB',
        '#ff9999',
        '#C1C1C1',
        '#607E8A',
        '#455A64'
      ],
      validateRules: {
        name: [
          { required: true, message: '字典名称不能为空!' },
          { min: 1, max: 255, message: '字典编号长度范围1~255个字符!' }
        ],
        code: [
          { required: true, message: '字典编号不能为空!' },
          { min: 1, max: 128, message: '字典编号长度范围1~128个字符!' },
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
              } else if (value.indexOf('~') != -1) {
                callback(new Error(`编号不能含有～特殊字符`))
              } else if (!this.formData || value !== this.formData.code) {
                nameTimer = setTimeout(async() => {
                  const res = await this.dispatch(DictEntryController.findDictEntryIsExist, {
                    code: value,
                    tenantId: this.currentTenant,
                    parentId:
                      (this.parentEntry && this.parentEntry.id) ||
                      (this.upEntry && this.upEntry.id) ||
                      this.byDictEntryId ||
                      null,
                    dictTypeId: this.byDictTypeId || this.dictType.id || null
                  })
                  if (res.data == true) {
                    callback(new Error(`${value}编号已存在!`))
                  }
                  callback()
                }, 300)
              }
            }
          }
        ],
        dictType: {
          required: true,
          validator: checkdictType,
          trigger: 'change'
        },
        updictEntry: {
          required: true,
          validator: checkdictEntry,
          trigger: 'change'
        }
      },
      model: model,
      form: _.cloneDeep(model)
    }
  },
  computed: {
    title() {
      return `${this.formType === 'add' ? '新建' : '编辑'}字典项`
    },
    oldParentDict() {
      if (this.form && this.form.parentId) {
        return { dicttypeid: this.form.parentId }
      } else if (this.parentEntry) {
        return { dicttypeid: this.parentEntry.dictid }
      }
    },

    formType() {
      if (this.form.id) {
        this.$emit('update:parentEntry', null)
        return 'edit'
      } else {
        return 'add'
      }
    }
  },
  watch: {
    form: {
      handler(newVal, oldVal) {
        if (this.form.id) {
          const payload = { id: this.form.dictTypeId }
          this.dispatch(DictTypeController.getDictTypeById, payload).then((res) => {
            this.dict = res.data
          })
        }
      },
      deep: true
    }
    // dictType: {
    //   immediate: true,
    //   handler(val) {
    //     if (!this.form.eosDictType.id) {
    //       if (this.parentEntry) {
    //         this.form.eosDictType = { dictypeid: null }
    //       } else {
    //         this.form.eosDictType = _.cloneDeep(val)
    //       }
    //     }
    //   }
    // }
  },
  mounted() {
    if (this.formType === 'edit') {
      this.showFooter = true
    }
    if (this.dictType) {
      if (this.dictType.levels != 0) {
        const payload = {
          dictTypeId: this.dictType.parentId
        }
        this.dispatch(DictEntryController.queryDictEntrysByCriteria, payload).then((res) => {
          if (res.data.data.length > 0) {
            this.byDictEntryId = res.data.data[0].id
            this.byDictEntryList = res.data.data
          }
        })
      }
    }
    if (this.parentEntry) {
      const payload = { parentId: this.parentEntry.dictTypeId }
      this.dispatch(DictTypeController.queryDictTypesByParentId, payload).then((res) => {
        this.DicttypeList = res.data
        this.byDictTypeId = res.data[0].id
      })
    } else {
      if (this.upEntry) {
        const payload = { parentId: this.upEntry.dictTypeId }
        this.dispatch(DictTypeController.queryDictTypesByParentId, payload).then((res) => {
          this.DicttypeList = res.data
          this.byDictTypeId = res.data[0].id
        })
      }
    }

    if (this.form.id) {
      const payload = { id: this.form.dictTypeId }
      this.dispatch(DictTypeController.getDictTypeById, payload).then((res) => {
        this.dict = res.data
      })
    }
  },
  methods: {
    save(isContinue) {
      if (isContinue) {
        this.sumbieAndContine()
      } else {
        this.submit()
      }
    },
    async sumbieAndContine() {
      this.$emit('update:loading', true)
      const resp = await this.addDict()
      this.$emit('update:loading', false)
      if (!resp.error) {
        this.$msg.success('保存成功!')
        this.$emit('success', resp.data.data)
        this.$refs['form'].resetFields()
      }
    },
    async addDict() {
      let parentId = ''
      if (this.parentEntry || this.upEntry || this.byDictEntryId) {
        if (this.byDictEntryId) {
          parentId = this.byDictEntryId
        } else if (this.parentEntry) {
          // 添加子项
          parentId = this.parentEntry.id
        } else {
          parentId = this.upEntry.id
        }
      }
      const payload = {
        dictEntry: {
          ...this.form,
          parentId: parentId,
          dictTypeId: this.byDictTypeId == null ? this.dictType.id : this.byDictTypeId,
          tenantId: this.currentTenant
        }
      }
      const resp = await this.dispatch(DictEntryController.create, payload)
      return resp
    },
    async validateResolve() {
      let resp = {}
      this.$emit('update:loading', true)
      if (this.formType === 'add') {
        resp = await this.addDict()
      } else if (this.formType === 'edit') {
        delete this.form.parent
        const payload = {
          dictEntry: {
            ...this.form
          }
        }
        resp = await this.dispatch(DictEntryController.update, payload)
      }
      this.$emit('update:loading', false)
      this.$emit('update:dialogVisible', false)

      if (!resp.error) {
        this.$msg.success('保存成功!')
        this.$emit('success', resp.data.data)
        return true
      } else {
        return false
      }
    }
  }
}
</script>
