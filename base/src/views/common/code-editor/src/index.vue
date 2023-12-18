<template>
  <div :style="`min-height:${height}px;position:relative;`">
    <template v-if="!disabled">
      <component
        :is="editType"
        v-if="!fullscreen"
        ref="monaco"
        v-model="value"
        class="monaco-border"
        :language="language"
        :height="height"
        :code="value"
        :theme="theme"
        :options="editorOptions"
        @codeChange="onCodeChang"
        @aceCodeChang="onAceCodeChang"
      />
      <el-button v-if="maxable" type="text" @click="max">
        <svg-icon :class="maxableBtnClass" icon-class="my-max" />
      </el-button>
      <el-button type="text" @click="top">
        <svg-icon :class="topBtnClass" icon-class="priority-highest" />
      </el-button>
      <el-button type="text" @click="bottom">
        <svg-icon :class="bottomBtnClass" icon-class="priority-low" />
      </el-button>
      <el-button type="text" @click="format">
        <svg-icon :class="formatBtnClass" :icon-class="formatCodeSvg" />
      </el-button>
      <a :download="`${downloadFileTitle}.txt`" :href="blobFileObj">
        <svg-icon :class="exportBtnClass" style="top:115px;left: 7px;font-size:20px;" icon-class="download" />
      </a>
      <ClipButton v-if="clipable" :class="clipBtnClass" :data="value" />
      <pm-dialog
        v-if="fullscreen"
        :close-on-click-modal="false"
        :title="label"
        :fullscreen.sync="fullscreen"
        :visible.sync="fullscreen"
        :append-to-body="true"
        :width="maxWidth"
        class="body-no-padding"
        @close="closeAll"
      >
        <slot slot="title" name="title-slot" />
        <component
          :is="editType"
          v-if="fullscreen"
          ref="monaco-max"
          v-model="value"
          class="monaco-border"
          :language="language"
          :height="workspaceRealHeightNum - 125"
          :code="value"
          :theme="theme"
          :options="editorOptions"
          @codeChange="onCodeChang"
          @aceCodeChang="onAceCodeChang"
        />
        <el-button type="text" @click="cancel">
          <svg-icon :class="maxableBtnClass" icon-class="window-min" />
        </el-button>
        <el-button type="text" @click="top">
          <svg-icon :class="topBtnClass" icon-class="top" />
        </el-button>
        <el-button type="text" @click="bottom">
          <svg-icon :class="bottomBtnClass" icon-class="bottom" />
        </el-button>
        <el-button type="text" @click="format">
          <svg-icon :class="formatBtnClass" :icon-class="formatCodeSvg" />
        </el-button>
        <a :download="`${downloadFileTitle}.txt`" :href="blobFileObj">
          <svg-icon :class="exportBtnClass" style="top:175px;left: 7px;font-size:20px;" icon-class="download" />
        </a>
        <ClipButton v-if="clipable" :class="clipBtnClass" :data="value" />
        <span slot="footer"> <el-button @click="cancel">关闭</el-button> </span>
      </pm-dialog>
    </template>
    <div v-else>
      <pre style="max-height:400px;overflow: auto;">{{ value }}</pre>
    </div>
  </div>
</template>

<script>
import { BaseVue } from '@lib'
import Monaco from '@lib/monaco/Monaco.vue'
export default {
  name: 'code-editor',
  components: { Monaco },
  mixins: [BaseVue],
  props: {
    editType: {
      type: String,
      default: 'Monaco',
      validator(val) {
        return ['Monaco'].includes(val)
      }
    },
    clipable: {
      type: Boolean,
      default: true,
    },
    maxable: {
      type: Boolean,
      default: true,
    },
    maxWidth: {
      default: '860px',
    },
    label: {
      type: String,
      default: '脚本',
    },
    defaultValue: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String,
      default: 'javascript',
    },
    theme: {
      type: String,
      default: 'vs',
    },
    height: {
      type: String | Number,
      default: 180,
    },
    options: {
      type: Object,
    },
    value: {},
    downloadFileTitle: {
      default: '下载文件'
    },
    refreshFlag: {
      default: null
    }
  },
  data() {
    return {
      fullscreen: false,
      oldLineCount: 0,
      lineCount: 0,
      workspaceRealHeightNum: document.body.clientHeight
    }
  },
  computed: {
    blobFileObj() {
      if (this.value) {
        return URL.createObjectURL(new Blob([this.value]))
      } else {
        return null
      }
    },
    clipBtnClass() {
      if (this.fullscreen) {
        if (this.theme === 'vs') {
          return 'common-btn clip-btn clip-btn-full btn-dark'
        } else {
          return 'common-btn clip-btn clip-btn-full btn-light'
        }
      } else {
        if (this.theme === 'vs') {
          return 'common-btn clip-btn btn-dark'
        } else {
          return 'common-btn clip-btn btn-light'
        }
      }
    },
    maxableBtnClass() {
      if (this.fullscreen) {
        if (this.theme === 'vs') {
          return 'common-btn max-btn max-btn-full btn-dark'
        } else {
          return 'common-btn max-btn max-btn-full btn-light'
        }
      } else {
        if (this.theme === 'vs') {
          return 'common-btn max-btn btn-dark'
        } else {
          return 'common-btn max-btn btn-light'
        }
      }
    },
    exportBtnClass() {
      if (this.fullscreen) {
        if (this.theme === 'vs') {
          return 'common-btn btn-dark'
        } else {
          return 'common-btn btn-light'
        }
      } else {
        if (this.theme === 'vs') {
          return 'common-btn btn-dark'
        } else {
          return 'common-btn btn-light'
        }
      }
    },
    topBtnClass() {
      if (this.fullscreen) {
        if (this.theme === 'vs') {
          return 'common-btn top-btn top-btn-full btn-dark'
        } else {
          return 'common-btn top-btn top-btn-full btn-light'
        }
      } else {
        if (this.theme === 'vs') {
          return 'common-btn top-btn btn-dark'
        } else {
          return 'common-btn top-btn btn-light'
        }
      }
    },
    bottomBtnClass() {
      if (this.fullscreen) {
        if (this.theme === 'vs') {
          return 'common-btn bottom-btn bottom-btn-full btn-dark'
        } else {
          return 'common-btn bottom-btn bottom-btn-full btn-light'
        }
      } else {
        if (this.theme === 'vs') {
          return 'common-btn bottom-btn btn-dark'
        } else {
          return 'common-btn bottom-btn btn-light'
        }
      }
    },
    formatBtnClass() {
      if (this.fullscreen) {
        if (this.theme === 'vs') {
          return 'common-btn format-btn format-btn-full btn-dark'
        } else {
          return 'common-btn format-btn format-btn-full btn-light'
        }
      } else {
        if (this.theme === 'vs') {
          return 'common-btn format-btn btn-dark'
        } else {
          return 'common-btn format-btn btn-light'
        }
      }
    },
    formatCodeSvg() {
      if (this.fullscreen) {
        if (this.theme === 'vs') {
          return 'format-code-white'
        } else {
          return 'format-code-black'
        }
      } else {
        if (this.theme === 'vs') {
          return 'format-code-white'
        } else {
          return 'format-code-black'
        }
      }
    },
    editorOptions() {
      return {
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: 'line',
        automaticLayout: true,
        glyphMargin: true,
        wordWrap: 'off',
        ...this.options,
      }
    },
  },
  watch: {
    refreshFlag: {
      deep: true,
      immediate: true,
      handler(val) {
        this.refreshValue()
      },
    },
  },
  methods: {
    closeAll() {
      this.$emit('closeAll')
      this.fullscreen = false
    },
    onAceCodeChang(value) {
      this.$emit('input', value)
    },
    onCodeChang(editor) {
      this.$emit('input', editor.getValue())
    },
    getLanguage() {
      return this.language
    },
    getLanguages() {
      const monaco = this.getMonaco()
      return monaco.monaco.languages.getLanguages().map(item => item.id)
    },
    appendValue(value) {
      try {
        const model = this.getModel()
        this.oldLineCount = model._lines.length
        model.setValue(model.getValue() + value)
        this.lineCount = model._lines.length
      } catch (e) {
        console.log(e)
      }
    },
    setValue(value) {
      try {
        const model = this.getModel()
        this.oldLineCount = model._lines.length
        model.setValue(value)
        this.lineCount = model._lines.length
      } catch (e) {
        console.log(e)
      }
    },
    getModel() {
      try {
        return this.getEditor().getModel()
      } catch (e) {
        return {}
      }
    },
    getEditor() {
      return this.fullscreen ? this.$refs['monaco-max'].getEditor() : this.$refs['monaco'].getEditor()
    },
    getMonaco() {
      return this.fullscreen ? this.$refs['monaco-max'] : this.$refs['monaco']
    },
    getPosition() {
      return this.getEditor().getPosition()
    },
    getScrolledVisiblePosition(lineNumber) {
      return this.getEditor().getScrolledVisiblePosition({ lineNumber: lineNumber })
    },
    refreshValue() {
      // editor无法感知外部value改变，所以提供此方法刷新value
      if (this.$refs['monaco']) {
        this.$refs['monaco'].setValue(this.value)
      } else if (this.$refs['monaco-max']) {
        this.$refs['monaco-max'].setValue(this.value)
      }
    },
    isFullScreen() {
      return this.fullscreen
    },
    getHeight() {
      return this.fullscreen ? this.workspaceRealHeightNum - 125 : this.height
    },
    cancel() {
      this.fullscreen = false
    },
    max() {
      this.fullscreen = true
    },
    top() {
      this.getEditor().revealLine(1)
    },
    bottom() {
      const editor = this.getEditor()
      if (editor) {
        editor.revealLine(this.lineCount | editor.getModel()._lines.length | 1)
      }
    },
    format() {
      if (this.$refs['monaco']) {
        this.$refs['monaco'].formatValue()
      } else if (this.$refs['monaco-max']) {
        this.$refs['monaco-max'].formatValue()
      }
    },
    find() {
      if (this.$refs['monaco']) {
        this.$refs['monaco'].find()
      } else if (this.$refs['monaco-max']) {
        this.$refs['monaco-max'].find()
      }
    },
    foldAll() {
      if (this.$refs['monaco']) {
        this.$refs['monaco'].foldAll()
      } else if (this.$refs['monaco-max']) {
        this.$refs['monaco-max'].foldAll()
      }
    },
    unfoldAll() {
      if (this.$refs['monaco']) {
        this.$refs['monaco'].unfoldAll()
      } else if (this.$refs['monaco-max']) {
        this.$refs['monaco-max'].unfoldAll()
      }
    },
    wordWrap() {
      if (this.$refs['monaco']) {
        this.$refs['monaco'].wordWrap()
      } else if (this.$refs['monaco-max']) {
        this.$refs['monaco-max'].wordWrap()
      }
    },
    updateOptions(options) {
      if (this.$refs['monaco']) {
        this.$refs['monaco'].updateOptions(options)
      } else if (this.$refs['monaco-max']) {
        this.$refs['monaco-max'].updateOptions(options)
      }
    },
    setLabel(label) {
      this.label = label
    }
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .common-btn {
    z-index: 100;
    position: absolute;
    left: 10px;
    font-size:25px;
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.4);
    }
  }

  .btn-dark {
    color: #0a76a4;
  }

  .btn-light {
    color: #ffffff;
  }

  .max-btn {
    font-size:15px;
    top: 10px;
  }

  .max-btn-full {
    top:70px;
  }

  .clip-btn {
    font-size: 15px;
    left: 9px;
    top: 30px;
  }

  .clip-btn-full {
    top: 90px;
  }

  .top-btn {
    left: 5px;
    top: 65px;
  }

  .top-btn-full {
    top: 125px;
  }

  .bottom-btn {
    left: 5px;
    top: 90px;
  }

  .bottom-btn-full {
    top: 150px;
  }

  .format-btn{
    font-size: 20px;
    left: 9px;
    top: 150px;
  }

  .format-btn-full{
    top: 210px;
  }

  .monaco-border {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
</style>
