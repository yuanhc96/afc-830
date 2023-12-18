<template>
  <div class="tinymce-editor">
    <Editor
      :id="editorId"
      v-model="value"
      :init="editorInit"
      :disabled="disabled"
      @onClick="handleClick"
    />
  </div>
</template>

<script>
// 引入组件

import tinymce from "tinymce/tinymce";

import Editor from "@tinymce/tinymce-vue";

// 引入富文本编辑器主题的js和css

import "tinymce/themes/silver/theme.min.js";

import "tinymce/skins/ui/oxide/skin.min.css";

// 扩展插件
import "tinymce/icons/default/icons"; //图标

import "tinymce/plugins/image";

import "tinymce/plugins/link";

import "tinymce/plugins/code";

import "tinymce/plugins/table";

import "tinymce/plugins/lists";

import "tinymce/plugins/wordcount"; // 字数统计插件

export default {
  name: "TinymceEditor",

  components: { Editor },

  props: {
    id: {
      type: String,

      default: "tinymceEditor",
    },

    value: {
      type: String,

      default: "",
    },
    disabled: {
      type: Boolean,

      default: false,
    },
    clickValue: {
      type: String,

      default: "",
    },
    plugins: {
      type: [String, Array],

      default: "link lists image code table wordcount",
    },

    toolbar: {
      type: [String, Array],

      default:
        "bold italic underline strikethrough | fontsizeselect | forecolor | alignleft aligncenter alignright alignjustify",
    },
  },

  data() {
    return {
      editorInit: {
        // language_url: "/tinymce/langs/zh_CN.js",

        // language: "zh_CN",

        // skin_url: "/tinymce/skins/ui/oxide",

        height: 300,

        plugins: this.plugins,

        toolbar: this.toolbar,
        flag: true,

        statusbar: true, // 底部的状态栏
        menubar: false, // 最上方的菜单
        branding: false, // 水印“Powered by TinyMCE”
        images_upload_handler: (blobInfo, success, failure) => {
          this.$emit("handleImgUpload", blobInfo, success, failure);
        },
      },

      editorId: this.id,

      editorValue: "",
    };
  },
  watch: {
    value(data) {
      this.$emit("changeValue", data);
    },
    clickValue(data) {
      //在光标位置插入内容
      //tinymce.activeEditor.execCommand("mceInsertContent", false, value);
      // var ed = tinymce.get("tinymceEditor");
      // var range = ed.selection.getRng();
      // var divNode = ed.getDoc().createElement("span");
      // divNode.innerHTML = data;
      // range.insertNode(divNode);
      this.$emit("changeValue", this.value + data);
    },
  },

  mounted() {
    tinymce.init({});
  },

  methods: {
    handleClick(e) {
      this.$emit("onClick", e, tinymce);
    },

    clear() {
      this.editorValue = "";
    },
    getSimpleText(html) {
      if (html) {
        var re1 = new RegExp("<.+?>", "g"); //匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
        var msg = html.replace(re1, ""); //执行替换成空字符
        return msg;
      } else {
        return "";
      }
    },
  },
};
</script>
