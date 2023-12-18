<template>
  <pm-dialog
    width="480px"
    :show-footer="true"
    :title="title"
    :visible.sync="dialogVisible"
    :before-close="cancel"
  >
    <el-form v-if="type==='addFunction'||type==='editFunction'" :key="type" :model="form" :rules="validateRules" label-position="top">
      <el-col :span="24">
        <el-form-item label="编号" prop="code">
          <el-input v-model.trim="form.code" v-focus="type!=='editFunction'" :disabled="type==='editFunction'" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="form.name" v-focus="type==='editFunction'" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="实体" prop="content">
          <!-- <el-select :disabled="type==='editFunction'" style="width:100%;" filterable clearable v-model="content.entityName" placeholder="请选择" @change="changeEntity">
                <el-option
                  v-for="item in entityList"
                  :key="item.entityName"
                  :label="item.name+'-'+item.entityName"
                  :value="item.entityName"
                >
                <span style="float: left">{{ item.contributionLabel }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}-{{item.entityName}}</span>
                </el-option>
              </el-select> -->
          <SelectEntity v-model="content.entityName" :disabled="type==='editFunction'" style="width:100%;" :app-name="appCode" placeholder="请选择" :persistent="true" :sdo-type-only="true" @change="changeEntity" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="2" />
        </el-form-item>
      </el-col>
    </el-form>
    <component :is="formComponent" v-else ref="form" :content="content" style="max-height:500px;min-height: 100px;overflow: auto;" :sdo-data="sdoData" :appcode="appCode" @submit="submit" />
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button size="mini" type="primary" :loading="loading" @click="save">{{ okText }}</el-button>
    </div>
  </pm-dialog>
</template>
<script>
import SelectEntity from '@/components/SelectEntity/data-type-selector.vue'
import { AppController, FunctionManager, ResourceController } from '@controller'
import { BaseVue, Form, VueUtil, _ } from '@lib'
import ConditionColumn from '../auth/condition-column.vue'
import ConditionRow from '../auth/condition-row.vue'
import model from './model.js'
export default {
  components: { ConditionRow, ConditionColumn, SelectEntity },
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
    appCode: {
      type: String
    },
    formType: {
      type: String
    },
    dialogVisible: {
      type: Boolean
    }

  },
  data() {
    const codeTimer = null
    let nameTimer = null
    return {
      TEXT: {
        addFunction: '新建数据',
        editFunction: '编辑数据',
        rowStep: '数据规则',
        columnStep: '列权限配置'
      },
      model: model,
      form: _.cloneDeep(model.dataResource),
      validateRules: {
        code: [
          { required: true, message: '请输入数据编号', trigger: 'change' },
          { validator: (rule, value, callback, source, options) => {
            if (this.type === 'editFunction') {
              callback()
            }
            if (nameTimer !== null) {
              clearTimeout(nameTimer)
            }
            if (!value) {
              callback()
            } else if (!this.formData || value !== this.formData.code) {
              nameTimer = setTimeout(async() => {
                const res = await this.dispatch(ResourceController.isExist, { code: value, tenantId: this.currentTenant })
                console.log(res, 'res')
                if (res.data == true) {
                  callback(new Error(`${value}编号已存在!`))
                }
                callback()
              }, 300)
            }
          } }
        ],
        name: [
          { required: true, message: '请输入数据名称', trigger: 'change' },
        ]
      },
      entityList: [],
      sdoData: null,
      type: this.formType,
      title: '',
      okText: '',
      formComponent: '',
      content: { entityName: '' },
    }
  },
  computed: {
    ...VueUtil(this)
      .select([AppController, FunctionManager, ResourceController])
      .state(),
    loading() {
      return this.ResourceController.create.loading || this.ResourceController.update.loading
    }
  },
  watch: {
    businessObjId(res) {
      this.businessObjId = res
    },
    type: {
      immediate: true,
      handler(val) {
        if (val) {
          this.title = this.TEXT[val]
          switch (val) {
            case 'addFunction': {
              this.okText = '下一步'
              break
            }
            case 'editFunction': {
              this.okText = '下一步'
              break
            }
            case 'rowStep': {
              this.okText = '保存'
              this.formComponent = 'ConditionRow'
              break
            }
            // case 'columnStep':{
            //   this.okText = '确定'
            //   this.formComponent = 'ConditionColumn'
            //   break
            // }
          }
        }
      }
    }
  },
  async created() {
    const payload = { appCode: this.appCode }
    this.entityList = await this.querySdoTypes(payload)
    if (this.form.content && this.type === 'editFunction') {
      this.content = JSON.parse(this.form.content)
      this.sdoData = this.entityList.find(item => item.entityName == this.content.entityName)
    } else {
      this.content = this.form.content
    }
  },
  methods: {
    async querySdoTypes(payload) {
      return (await this.dispatch(AppController.queryPersistentEntitys, payload)).data
    },
    async remoteValidateCode(funccode) {
      const resp = await this.dispatch(FunctionManager.validateFunction, {
        payload: { 'template': { funccode }}
      })
      if (!resp.error) {
        return resp.data.data === 0
      } else { return false }
    },
    changeEntity(node) {
      this.sdoData = this.entityList.find(item => item.entityName == node.entityName)
      if (this.form.content) {
        const content = typeof this.form.content === 'string' ? JSON.parse(this.form.content) : this.form.content
        if (content.entityName !== node.entityName) {
          this.content = { ...this.model.dataResource.content, ...{ entityName: node.entityName }}
        }
      }
    },
    cancel() {
      this.$emit('update:dialogVisible', false)
      this.form = _.cloneDeep(model.dataResource)
    },
    async save() {
      // if (this.type === 'editFunction') {
      //   resp = await this.dispatch(ResourceController.update, {
      //     resource: {
      //       ...this.form,
      //     }
      //   })
      //   this.loading = false
      //   if (!resp.error) {
      //     this.$msg.success('保存成功!')
      //     this.$emit('success')
      //   }
      // }else{
      if (!this.content.entityName) {
        this.$message({
          type: 'warning',
          message: '请选择实体！'
        })
        return
      }
      if (this.type === 'rowStep') {
        this.$refs.form.finish()
      } else {
        this.type = 'rowStep'
      }
    },
    async submit(content) {
      let resp
      if (this.formType === 'editFunction') {
        resp = await this.dispatch(ResourceController.update, {
          resource: {
            ...this.form,
            content: JSON.stringify(content),
          }
        })
        if (!resp.error) {
          this.$msg.success('保存成功!')
          this.$emit('success')
        }
      } else {
        this.form.resGroupId = this.params.resGroupId
        this.form.tenantId = this.currentTenant
        const parameter = this.businessObjId == null ? { appId: this.params.appId } : { businessObjId: this.businessObjId }
        resp = await this.dispatch(ResourceController.create, {
          payload: {
            resource: {
              ...this.form,
              ...parameter,
              content: JSON.stringify(content),
              types: this.params.type
            }
          }
        })
        if (!resp.error) {
          this.$msg.success('保存成功!')
          this.$emit('success')
        }
      }
      this.form = _.cloneDeep(model.dataResource)
    }
  }
}
</script>
<style scoped>
::v-deep .el-dialog .el-dialog__footer{
  height: 72px !important;
}
</style>
