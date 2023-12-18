<template>
  <el-dialog :visible.sync="dialogVisible" width="640px" title="导入字典" append-to-body>
    <div>
      <el-form ref="importForm" :rules="rules" :model="uploadData" label-width="120px">
        <el-form-item label="导入文件">
          <el-upload
            ref="upload"
            name="file"
            :headers="headers"
            :action="uploadUrl"
            :data="uploadData"
            :on-change="fileChange"
            :before-upload="beforeUpload"
            :on-success="localUploadSuccess"
            :on-error="uploadError"
            :on-remove="handleRemove"
            :limit="1"
            accept="xls"
            :auto-upload="false"
          >
            <el-button type="primary" icon="el-icon-upload">点击上传导入文件 (.xls格式)</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="注：">
          导入时将根据主键匹配覆盖已存在的数据。
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { BaseVue, Form } from '@lib'
export default {
  name: 'dict-import',
  mixins: [BaseVue, Form],
  data() {
    return {
      uploadUrl: '/org.gocom.components.coframe.dict.DictManager.importDict.biz.ext',
      rules: {
      },
      uploadData: {
      }
    }
  },
  methods: {
    async submit() {
      this.$refs['upload'].submit()
    },
    beforeUpload(file) {
      var error = null
      if (!/\.xls$/.test(file.name)) {
        error = '请导入 .xls 文件!'
      } else if (file.size / 1024 / 1024 > 200) {
        error = '上传文件大小不能超过 200MB'
      }
      if (error) {
        this.$msg.warning(error)
        this.loading = false
        return false
      }
      this.loading = true
      return true
    },

    uploadSuccess() {
      this.dialogVisible = false
      this.$emit('update:dialogVisible', false)
      this.$msg.success('导入字典成功!')
      this.$emit('success')
    },
    uploadError(data) {
      this.$msg.error(data.message || data.error || '导入字典失败!')
    },
    localUploadSuccess(data) {
      this.loading = false
      if (data.reCode === '-1') {
        this.uploadError(data)
      } else {
        this.uploadSuccess()
      }
    },
  }
}
</script>
