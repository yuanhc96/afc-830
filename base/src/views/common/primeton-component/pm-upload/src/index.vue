<template>
  <div>
    <template>
      <transition-group name="fade" mode="out-in" tag="div">
        <div
          v-for="attachment in fileList"
          :key="`attachment-${attachment.fileId}`"
          class="thumbnail mt-5 mr-10"
          v-loading="removeLoading && removeFileId === attachment.fileId"
        >
          <i
            v-if="editable"
            class="close el-icon-close"
            @click.stop="removeAttachment(attachment)"
          />
          <play-video
            v-if="isVideo(attachment.fileType)"
            height="80"
            :source-type="`video/${getValue(attachment,'fileType','mp4')==='ogv'?'ogg':getValue(attachment,'fileType','mp4')}`"
            :source-src="attachment.url"
          />
          <el-image
            v-else-if="isImage(attachment.fileType)"
            class="attachment-img"
            fit="scale-down"
            :src="attachment.url"
            :preview-src-list="attachmentsImages"
          />
          <div v-else class="attachment-other">
          <div class="body">文件</div>
          <div :class="`footer file-${attachment.fileType}`">.{{attachment.fileType}}</div>

            <el-button v-if="isText(attachment.fileType)" class="view" type="text" icon="el-icon-view" @click="openView(attachment)"></el-button>
            <a class="download" :href="attachment.url" target="_blank">
              <i class="el-icon-download"></i>
            </a>
          </div>
          <div class="mt-5">
            <el-tooltip :content="attachment.fileName">
              <span>
                {{ shortFileName(attachment.fileName) }}
              </span>
            </el-tooltip>
          </div>
        </div>
      </transition-group>
    </template>
    <el-upload
      ref="upload"
      v-loading="uploading"
      :disabled="!editable"
      class="artifact-upload mt-10"
      :headers="headers"
      name="attachements"
      :before-upload="beforeUpload"
      :action="uploadUrl"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="uploadSuccess"
      :show-file-list="false"
      drag
      multiple
    >
      <i class="el-icon-upload"/>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip"/>
    </el-upload>
    <Preview :dialogVisible.sync="attachmentOverview"
             :attachment="attachmentToOverview"
             :getFileContent="getFileContent"
    ></Preview>
  </div>
</template>
<script>
import { BaseVue, _ } from '@lib'
import * as auth from '@/utils/auth'
import Util from './util.js'
import Preview from './preview.vue'

export default {
  name: 'pm-select',
  mixins: [BaseVue],
  components: { Preview },
  props: {
    editable: {
      default: true
    },
    getFileUrl: {  // 文件实体中获取路径
      type: Function,
      default: (file) => { return file.url || 'no-url!' },
    },
    uploadUrl: {  // 上传 url
      type: String,
      required: true,
    },
    removeAction: { // 删除文件实现
      type: Function,
      required: true,
    },
    removeLoading: {
      default: false,
      required: true,
    },
    fileList: {// 文件列表
      type: Array,
      default: [],
    },
    getFileContent: {
      type: Function,
    },
    responseField: {  // 文件列表返回字段
      type: String,
      default: 'attachments',
    },
  },
  computed: {
    attachmentsImages() {
      return this.fileList.filter(item => Util.isImage(item.fileType)).map(item => this.getFileUrl(item))
    },
  },
  filters: {
    isImageFilter({fileType}) {
      return Util.isImage(fileType)
    }
  },
  data() {
    return {
      headers: {
        Authorization: auth.getToken(),
      },
      uploading: false,
      uploadLoading: false,
      removeFileId: null,
      attachmentOverview: false,
      attachmentToOverview : null,
      isImage: Util.isImage,
      isVideo: Util.isVideo,
      isText: Util.isText,
    }
  },
  watch: {
    value(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    openView(file) {
      this.previewAttachment(file)
    },
    shortFileName(name) {
      if (name.length >= 18) {
        return name.substring(0, 8) + '...' + name.substring(name.length - 7, name.length)
      } else {
        return name
      }
    },
    uploadSuccess(response, file, fileList) {
      this.fileList = response[this.responseField].map(attachment => {
        return {
          ...attachment,
          url: this.getFileUrl(attachment)
        }
      })
      this.uploading = false
      this.$emit('update:fileList', this.fileList)
    },
    beforeUpload() {
      // 上传附件前刷新token
      this.uploading = true
      this.headers.Authorization = auth.getToken()
    },
    async previewAttachment(attachment) {
      this.attachmentToOverview = _.cloneDeep(attachment)
      this.attachmentOverview = true
    },
    removeAttachment(attachment) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async() => {
        this.removeFileId = attachment.fileId
        const resp = await this.removeAction(attachment)
        if (!resp.error) {
          this.fileList.splice(this.fileList.findIndex(a => a.fileId === attachment.fileId), 1)
        }
        this.removeFileId = null
      })
    },
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep .el-upload-dragger {
    height: 72px;
  }

  ::v-deep .mini .el-upload__text {
    height: 16px;
  }

  ::v-deep .el-upload-dragger .el-icon-upload {
    font-size: 40px;
    padding: 0px;
    margin: 0px;
  }
  .error{
    color: #bd5050;
  }
  .thumbnail {
    position: relative;
    height: 80px;

    display: inline-block;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    background: #f2f6fc;

    .close {
      position: absolute;
      top: -9px;
      right: -9px;
      width: 18px;
      height: 18px;
      line-height: 18px;
      border-radius: 100%;
      background: #bd5050;
      color: #ffffff;
      text-align: center;
      opacity: 0;
      transition: all 0.3s ease;
      z-index: 1000;
    }

    &:hover {
      .close {
        opacity: 1;
        transform: rotate(-90deg);
      }

      background: #ebeef5;
    }

    .attachment-img {
      height: inherit;
      width: 120px;
      &:hover {
        outline: 2px dotted gray;
      }
    }
    .attachment-other{
      height: inherit;
      min-width: 120px;
      width: 100%;
      position: relative;
      .body{
        line-height: 70px;
        font-size: 40px;
        color:gray;
        opacity: .5;
        text-align: center;
      }
      .footer{
        background: #080808;
        color: #fff;
        position: absolute;
        font-size: 12px;
        width: 100%;
        height: 16px;
        line-height: 16px;
        bottom: 0px;
        opacity: 0.6;
        transition: all .3s ease;
      }
      &:hover{
        .footer{
          opacity: 1;
        }
      }
      .download{
        position: absolute;
        bottom: 0px;
        right: 0px;
        cursor: pointer;
        color:#ffffff!important;
      }
      .view{
        position: absolute;
        bottom: -6px;
        left: 0px;
        cursor: pointer;
        color:#ffffff;
      }
    }
    .file-xls, .file-xlsx{
      background: rgb(16,124,45)!important;
    }
    .file-doc, .file-docx{
      background: rgb(0,168,238)!important;
    }
    .file-html{
      background: rgb(221,81,69)!important;
    }
  }
</style>
