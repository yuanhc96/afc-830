<template>
  <div class="icon_container">
    <el-upload
      class="upload-button"
      :class="{'mr-100':iconType === 'svg'}"
      accept=".zip,.rar,.arj"
      :http-request="uploadMethod"
      :file-list="fileList"
    >
      <el-button
        plain     
        type="primary"     
        icon="el-icon-plus"
        >新建font图标</el-button
      >
    </el-upload>
    <div v-if="iconType === 'svg'" class="upload-button">
      <el-upload
        :accept="acceptType"
        :http-request="uploadMethod"
        :file-list="fileList"
        >
        <el-button icon="el-icon-upload"  plain >上传svg</el-button>
      </el-upload>
    </div>
    <div
      class="item"
      v-for="(icon, index) in fileData"
      :key="icon.fileId || index"
      @mouseenter="imageEnter(icon)"
      @mouseleave="imageLeave(icon)">
      <span v-if="iconType === 'system' || iconType === 'font'" class="item_icon">
        <!-- <el-tooltip :enterable="false" :open-delay="200" effect="dark" :content="icon.font_class" placement="bottom-start"> -->
          <i :class="`iconfont icon-${icon.font_class}`" />
        <!-- </el-tooltip> -->
      </span>
      <span v-else class="item_img">
        <img
          fit="scale-down"
          :src="svgUrl(icon.code, 'svg', 'icon')"
          style="height: 35px; width:35px;display: inline-block;"
        >
      </span>

      <span class="one_warp" :title="icon.name || icon">{{icon.name || icon}}</span>
      <div v-show="icon.showAction" class="action" :class="iconType + '_action'">
        <span
          title="复制类名"
          class="copy_class"
          v-clipboard:copy="icon.font_class || icon.name"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError">
            <svg-icon class="svgicon hover_none" icon-class="copy-name" />
            <svg-icon class="svgicon hover_has" icon-class="copy-name-hover" />
          </span>
        <span
          title="复制代码"
          class="copy_class"
          v-clipboard:copy="copyLabel"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          @click="format(icon)">
            <svg-icon class="svgicon hover_none" icon-class="copy-use" />
            <svg-icon class="svgicon hover_has" icon-class="copy-use-hover" />
          </span>
        <i v-if="iconType === 'svg'" class="el-icon-delete" title="删除" @click="deleteItem([icon.id], 'svg')"></i>
        <a
          v-if="iconType === 'svg'"
          class="table_download"
          :href="fileUrl(icon.fileId) + headersParam"
        >
          <i class="el-icon-download" title="下载"></i>
        </a>
      </div>
     
    </div>
    
  </div>       
</template>
<script>
import { BaseVue, Form, HtmlUtil } from "@lib";
import model from "./model.js";
// import clipboard from '@/directive/clipboard/index.js'
export default {
  components: {},
  mixins: [BaseVue, Form, model, HtmlUtil],
  props: {
    groupId: {
      type: String
    },
    currentGroupCode: {
      type: String
    },
    content: {
      type: Array | undefined
    }
  },
  data() {
    return {
      typeId: 'icon',
      fileData: [],
      fileList: [],
      copyLabel: ''
    };
  },
  computed: {
    // 当前分组是font 还是svg,system为本地文件
    iconType() {
      if(this.content) {
        return 'system'
      } else if (!this.fileData.length || this.fileData[0].iconType === 'svg') {
        return 'svg'
      } else {
        return 'font'
      }
    },
    acceptType() {
      return '.svg'
      // if (this.iconType === 'font') {
      //   return '.zip,.rar,.arj'
      // } else if (this.iconType === 'svg') {
        // return '.svg'
      // } else {
      //   return '.zip,.rar,.arj,.svg'
      // }
    }
  },
  watch: {
    content:{
      immediate:true,
      deep:true,
      async handler(val){
        if (val) {
        this.fileData = val.map(icon => {
          return {
            ...icon,
            showAction: false
          }
        })
      } else {
        if (this.groupId) {
          await this.getData()
        }
        if (this.iconType === 'font' && !val) {
          // css的接口
          HtmlUtil.dynamicLoadCss(this.cssLoadUrl(this.currentGroupCode))
        }
      }
        }
    },
    groupId: {
      immediate: true,
      async handler(val) {
        if (val && !this.content) {
          await this.getData()
          if (this.iconType === 'font') {
            // css的接口
            HtmlUtil.dynamicLoadCss(this.cssLoadUrl(this.currentGroupCode))
          }
        }
      }
    },
  },
  async mounted() {
    console.log(this.content, '====content')
    if (this.content) {
      this.fileData = this.content.map(icon => {
        return {
          ...icon,
          showAction: false
        }
      })
    } else {
      if (this.groupId) {
        await this.getData()
      }
      if (this.iconType === 'font' && !this.content) {
        // css的接口
        HtmlUtil.dynamicLoadCss(this.cssLoadUrl(this.currentGroupCode))
      }
    }
  },
  methods: {
    imageEnter(icon) {
      this.$set(icon, 'showAction', true)
    },
    imageLeave(icon) {
      this.$set(icon, 'showAction', false)
    },
    
    format(icon) {
      if (this.iconType === 'svg') {
        const use = this.svgUrl(icon.code, 'svg', 'icon')
        this.copyLabel = `<img src="${use}" alt="加载失败">`
      } else {
        const value = this.iconType === 'system' ? icon.font_class : `${icon.font_class},${this.currentGroupCode},font`
        this.copyLabel = `<pm-icon value='${value}' />`
      }
    }
  },
};
</script>
<style lang="scss" scoped>
@import '~@/assets/iconfont/iconfont.css';
  .icon_container {
    margin: 10px 0px 20px -20px;
    min-width: 800px;
    height: calc(100vh - 170px);
    overflow: auto;
    // width: 1000px;
    .item, .item_upload {
      padding-top: 10px;
      height: 75px;
      width: 80px;
      position: relative;
      float: left;
      margin: 0 10px 10px 20px;
      text-align: center;
      ::v-deep .el-upload--picture-card {
        width: 55px;
        height: 55px;
        line-height: 80px;
        i {
          font-size: 45px;
        }
      }
      i {
        font-size: 35px;
      }
      .item_icon {
        width: 35px;
        height: 35px;
        line-height: 55px;
        display: inline-block;
      }
      .item_img {
        line-height: 32px;
      }
      .one_warp {
        display: inline-block;
        width: 80px;
        overflow-x: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
      }
      .action {
        width: 80px;
        height: 75px;
        margin-top: 20px;
        background-color:rgba(13, 10, 49, 0.9);
        position: absolute;
        left: 0;
        bottom: 0px;
        // line-height: 89px;
        padding-top: 12px;
        border-radius: 5px;
        i{
          cursor: pointer;
          font-size: 18px;
          color: #fff;
          font-weight: 400;
          line-height: 47px;
          margin: 0px 5px;
          &:hover {
            color: #4f9dec;
          }
        }
        .copy_class {
          .svgicon {
            cursor: pointer;
            font-size: 14px;
            // color: #fff;
            font-weight: 700;
            line-height: 72px;
            margin: 0px 4px 0px 7px;
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
      .system_action, .font_action {
        padding-top: 32px;
      }
    }
    .item {
      border: dashed 1px #ddd;
      border-radius: 5px;
    }
  }
</style>