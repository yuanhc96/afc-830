<template>
  <div>
    <el-form :ref="formRef" :model="form" :rules="validateRules" label-position="top">
      <el-row>
        <el-col :span="24">
          <el-form-item label="编码" prop="code">
            <el-input v-model.trim="form.code" v-focus :disabled="formType === 'edit'" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="名称" prop="name">
            <el-input v-model.trim="form.name" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="分类" prop="types">
            <el-select id="select" v-model="form.types" style="width: 100%" :popper-append-to-body="false" placeholder="请选择" :disabled="formType === 'edit'">
              <el-option
                v-for="item in typeOptions"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="formType === 'add'" :span="24">
          <el-form-item label="上传模板" prop="fileList">
            <el-upload
              ref="upload"
              name="file"
              :http-request="uploadFile"
              :headers="headers"
              :on-change="fileChange"
              :on-remove="handleRemove"
              :limit="1"
              :file-list="form.fileList"
              :auto-upload="false"
            >
              <el-button size="small" type="primary">选择文件</el-button><span class="ml-10" />
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24" >
          <el-form-item label="描述信息" prop="description">
            <el-input v-model.trim="form.description" type="textarea" :rows="2" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { DictTypeController, LowcodeAppTemplateController } from '@controller'
import { BaseVue, Form, _ } from '@lib'
import { mapGetters } from 'vuex'

export default {
  name: 'detail',
  components: {},
  mixins: [BaseVue, Form],
  props: {
    data: {
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let codeTimer = null
    return {
      formRef: 'form',
      form: {
        id: null,
        code: null,
        name: null,
        types: null,
        description: '',
        fileList: []
      },
      loading: false,
      validateRules: {
        code: [{ required: true, message: '请输入模板编码', trigger: 'change' },
          { validator: (rule, value, callback, source, options) => {
            if (codeTimer !== null) {
              clearTimeout(codeTimer)
            }
            codeTimer = setTimeout(async() => {
              if (!value || this.formType == 'edit') {
                callback()
              } else {
                const count = await this.dispatch(LowcodeAppTemplateController.existenceByCode, { code: value })
                console.log(count)
                if (count && count.data) {
                  callback(new Error(`${value}模板编码已存在!`))
                }
                callback()
              }
            }, 300)
          }
          }
        ],
        name: [{ required: true, message: '请输入模板名称', trigger: 'change' }],
        type: [{ required: true, message: '请输入分类', trigger: 'change' }],
        fileList: [{ required: true, message: '请选择文件', trigger: 'change' }]
      },
      dicttypeid: '', // TODO类型
      typeOptions: [],
      uploadUrl: '/afc/api/afc/lc-app-templates/actions/import-file',
    }
  },
  computed: {
    ...mapGetters(['dicts']),
    formType() {
      console.log(this.form, this.form && !this.form.id, '=====form')
      if (this.form && !this.form.id) {
        return 'add'
      } else {
        return 'edit'
      }
    },
  },
  watch: {
    dicts: {
      immediate: true,
      handler(val) {
        if (val) {
          this.typeOptions = this.dicts[this.dicttypeid] || []
          if (this.typeOptions.length > 0) {
            const dictType = {}
            this.typeOptions.map(item => {
              dictType[item.code] = item.name
            })
            this.statusDict = dictType
          }
        }
      },
    },
  },
  created() {
    // this.loadDicts()
  },
  methods: {
    submit() {
      this.$refs[this.formRef].validate(async valid => {
        if (valid) {
          this.validateResolve()
        } else {

        }
      })
    },
    async validateResolve() {
      this.$emit('update:loading', true)
      if (this.formType === 'add') {
        await this.$refs['upload'].submit()
      } else {
        const resp = await this.dispatch(LowcodeAppTemplateController.rename, {
          appTemplate: this.form,
          id: this.form.id
        })
        this.$emit('update:loading', false)
        if (!resp.error) {
          this.$msg.success('修改成功!')
          this.$emit('success')
        }
      }
    },
    async loadDicts() {
      if (!this.dicttypeid) {
        return
      }
      if (!this.dicts.hasOwnProperty(this.dicttypeid)) {
        this.$store.commit('ADD_DICT', { key: this.dicttypeid, value: null })
        const resp = await this.dispatch(
          DictTypeController.queryDictTypesByCriteria,
          {
            code: this.dicttypeid,
            tenantId: this.currentTenant,
          }
        )
        if (!resp.error) {
          this.$store.commit('ADD_DICT', {
            key: this.dicttypeid,
            value: resp.data.data.length ? resp.data.data[0].dictEntrys : [],
          })
        }
      }
    },
    fileChange(file, fileList) {
      this.form.fileList = fileList
    },
    handleRemove(currFile, fileList) {
      this.form.fileList = fileList
    },
    async uploadFile(obj) {
      const form = {
        ..._.cloneDeep(this.form),
        fileList: null
      }
      const params = new FormData()
      params.append('multipartFile', obj.file)
      const res = await this.dispatch(LowcodeAppTemplateController.createByFile, {
        payload: params,
        params: form
      })
      this.$emit('update:loading', false)
      if (!res.error) {
        this.$msg.success('新建成功')
        this.$emit('success')
      }
    },
  },
}
</script>
<style lang="scss" scoped>
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
  width: 500px;
  margin-top: 10px;
  border-color: var(--tagBg);
  color: var(--tagBg);
}
.button-addmic:hover {
  color: var(--tagBg) !important;
  border-color: var(--tagBg) !important;
}
/*按钮点击*/
.button-addmic:focus {
  color: var(--tagBg) !important;
  border-color: var(--tagBg) !important;
}
::v-deep .app-input .el-input__inner::placeholder {
  color: red !important;
}
.micro-item {
  width: 100%;
}
.micro-item-div {
  width: 800px;
}
.micro-item-div:hover {
  background: #f5f5f5;
  .icon-del {
    display: inline-flex;
  }
}
</style>
