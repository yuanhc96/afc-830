<template>
  <div class="image_container">
    <el-upload
      class="upload-button"
      accept=".BMP,.JPG,.JPEG,.PNG,.GIF"
      :http-request="uploadMethod"
      :file-list="fileList"
      >
      <el-button icon="el-icon-upload" type="primary"  plain >上传图片</el-button>
    </el-upload>
    <div v-for="(src, index) in fileData"
      :key="index"
      class="image_content"
      @mouseenter="imageEnter(src)"
      @mouseleave="imageLeave(src)">
      <el-image
        :src="svgUrl(src.code, 'notIcon', 'image')" 
        :preview-src-list="previewSrcList"
      >
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
      <div v-if="src.showAction" class="action">
        <span
          title="复制代码"
          class="copy_class"
          v-clipboard:copy="copyLabel"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          @click="format(src, 'use')">
          <svg-icon class="svgicon hover_none" icon-class="copy-use" />
          <svg-icon class="svgicon hover_has" icon-class="copy-use-hover" />
        </span>
        <span
          title="复制下载链接"
          class="copy_class"
          v-clipboard:copy="copyLabel"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          @click="format(src, 'link')">
          <svg-icon class="svgicon hover_none" icon-class="copy-link" />
          <svg-icon class="svgicon hover_has" icon-class="copy-link-hover" />
        </span>
        <i class="el-icon-delete fl" title="删除" @click="deleteItem([src.id], 'notIcon')"></i>
        <a
          class="table_download"
          :href="fileUrl(src.fileId) + headersParam"
        >
          <i class="el-icon-download" title="下载"></i>
        </a>
      </div>
    </div>
  </div> 
</template>
<script>
import { BaseVue, Form } from "@lib";
import model from "./model.js";
export default {
  components: {},
  mixins: [BaseVue, Form, model],
  props: {
    groupId: {
      type: String
    },
  },
  data() {
    return {
      typeId: 'image',
      fileData: [],
      fileList: [],
      copyLabel: ''
    };
  },
  computed: {
    previewfileData() {
      if (!this.fileData || !this.fileData.length) {
        return []
      } else {
        return this.fileData.map(i => this.svgUrl(i.code, 'notIcon', 'image'))
      }
    }
  },
  watch: {
    groupId:{
      immediate:true,
      async handler(val){
        if(val){
          await this.getData()
        }
      }
    }
  },
  methods: {
    imageEnter(src) {
      this.$set(src, 'showAction', true)
    },
    imageLeave(src) {
      this.$set(src, 'showAction', false)
    },
    format(src, type) {
      if (type === 'use') {
        const use = this.svgUrl(src.code, 'notIcon', 'image')
        this.copyLabel = `<img src="${use}" alt="加载失败">`
      } else {
        const link = this.fileUrl(src.fileId) + this.headersParam
        this.copyLabel = `<a href="${link}" ><i class="el-icon-download" title="下载" /></a>`
      }
    }
  },
};
</script>
<style lang="scss" scoped>
  .image_container {
    margin: 10px 0px 20px;
    min-height: 500px;
  }
  .image_content {
    margin-bottom: 10px;
    margin-right: 10px;
    width: 120px;
    height: 120px;
    float: left;
    position: relative;
    .el-image {
      width: 120px;
      height: 120px;
      border-radius: 3px;
    }
    .action {
      padding-top: 35px;
      width: 120px;
      height: 120px;
      border-radius: 3px;
      background-color:rgba(13, 10, 49, 0.9);
      position: absolute;
      left: 0;
      bottom: 0;
      i {
        cursor: pointer;
        font-size: 20px;
        color: #fff;
        font-weight: 500;
        margin: 10px 20px;
        &:hover {
          color: #62a4e7;
        }
      }
      .copy_class {
        .svgicon {
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
          line-height: 72px;
          margin: 0px 18px 13px 20px;
        }
        .hover_none {
          display: inline-block;
        }
        .hover_has {
          display: none;
        }
        &:hover {
          .hover_none {
            display: none;
          }
          .hover_has {
            display: inline-block;
          }
        }
      }
    }
  }
  
</style>