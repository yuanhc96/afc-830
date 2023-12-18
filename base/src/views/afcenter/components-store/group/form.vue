<template>
  <div>
    <el-form :ref="formRef" :model="form" :rules="validateRules" label-position="top" @submit.native.prevent>
      <el-row>
        <!-- <el-col :span="22">
          <el-form-item label="分组编号" prop="code">
            <el-input v-focus  v-model="form.code" :disabled="formType==='edit'"  />
          </el-form-item>
        </el-col> -->
        <el-col :span="24">
          <el-form-item label="名称" prop="name">
            <el-input v-model.trim="form.name" v-focus />
          </el-form-item>
        </el-col>
        <el-col :span="24" :class="[{'mb-20':formType==='edit'}]">
          <el-form-item label="图标" prop="iconCode">
            <icon-select v-model="form.iconCode" type="number" />
          </el-form-item>
        </el-col>
        <el-col v-if="formType==='add'" :span="24">
          <el-form-item label="上传zip包">
            <el-upload
              ref="upload"
              accept=".zip"
              class="fl"
              :http-request="uploadFile"
              :limit="1"
              :auto-upload="false"
              :before-upload="beforeAvatarUpload"
              :file-list="fileList"
            >
              <PmToolbarItem
                icon="el-icon-upload"
                plain
                type="primary"
              >上传文件
              </PmToolbarItem>
            </el-upload>
            <span class="ml-20">单个分组<span style="color:red">下载</span>的包 / 自定义开发的组件包</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { ComponentCenterController } from '@controller'
import { BaseVue, Form, VueUtil, _ } from '@lib'
import IconSelect from '../../../../components/Icon/icon-select.vue'
const form = {
  code: null,
  name: null,
  iconCode: null,
  file: null
}
export default {
  components: { IconSelect },
  mixins: [BaseVue, Form],
  props: {
    data: {},
    params: {},
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formRef: 'form',
      form: _.cloneDeep(form),
      validateRules: {
        code: [
          { required: true, message: '请输入分组编号', trigger: 'change' },
        ],
        name: [
          { required: true, message: '请输入分组名称', trigger: 'change' },
          // { validator:(rule, value, callback, source, options) => {
          //   if (value === 'chm') {
          //     callback(new Error('你这个组件库有问题,不要再上传了,联系大斌斌'))
          //   }
          //   callback(errors)
          // }, trigger: 'change' },
        ],
      },
      fileList: []
    }
  },
  mounted() {
  },
  computed: {
    ...VueUtil(this)
      .select([ComponentCenterController])
      .state(),
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
  methods: {
    beforeAvatarUpload(file) {
      console.log(file)
      const type = file.name.slice(file.name.lastIndexOf('.'))
      const isZip = type === '.zip'
      if (!isZip) {
        this.$message.error('上传文件只能是 ZIP 格式!')
      } else {
        this.fileList = [file]
      }
      console.log(this.fileList, 'this.form.file')
      return isZip
    },
    async uploadFile(obj) {
      const params = new FormData()
      params.append('code', this.form.code)
      params.append('name', this.form.name)
      params.append('file', obj.file)
      if (this.form.iconCode) {
        params.append('iconCode', this.form.iconCode)
      }
      const resp = await this.dispatch(ComponentCenterController.upload, {
        payload: params,
      })
      console.log(resp, '==resp')
      if (!resp.error) {
        this.fileList = []
        this.cancel()
        this.$msg.success('已新增，请稍后刷新组件分组')
        this.$emit('success')
      } else {
      }
    },

    async validateResolve() {
      if (this.formType === 'add') {
        const { uploadFiles } = this.$refs['upload']._data
        if (!uploadFiles.length) {
          this.warningMessage('请上传组件 ZIP 包')
          return
        } else {
          this.form.code = uploadFiles[0].name.slice(0, uploadFiles[0].name.lastIndexOf('.'))
        }
        const isExit = await this.dispatch(ComponentCenterController.existenceByCode, {
          code: this.form.code
        })
        if (isExit.data) {
          this.$confirm('文件名重复, 是否覆盖?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(async() => {
              this.$emit('update:loading', true)
              await this.$refs['upload'].submit()
            })
            .catch(() => {
              this.form.code = null
            })
        } else {
          this.$emit('update:loading', true)
          await this.$refs['upload'].submit()
        }
      } else if (this.formType === 'edit') {
        this.$emit('update:loading', true)
        const params = {
          name: this.form.name,
        }
        if (this.form.iconCode) {
          params.iconCode = this.form.iconCode
        }
        const resp = await this.dispatch(ComponentCenterController.updateBasicInfo, {
          id: this.form.id,
          params
        })
        this.cancel()
        if (!resp.error) {
          this.$msg.success('保存成功!')
          this.$emit('success')
        } else {
        }
      }
    },
    cancel() {
      this.$emit('update:loading', false)
      this.$emit('update:formData', null)
      this.$emit('update:dialogVisible', false)
      this.fileList = []
      setTimeout(() => {
        this.form = _.cloneDeep(form || {})
        this.$nextTick(() => {
          this.$refs[this.formRef] && this.$refs[this.formRef].clearValidate()
        })
      }, 300)
    }
  }
}
</script>
