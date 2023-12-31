<template>
  <div :style="`min-height:${height}px;position:relative;`">
    <template v-if="!disabled">
      <MonacoEditor
        v-if="!dialogVisible"
        ref="monaco"
        class="monaco-border"
        :language="language"
        :height="height"
        :code="value"
        :theme="theme"
        :options="editorOptions"
        @codeChange="onCodeChang"
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
      <ClipButton v-if="clipable" :class="clipBtnClass" :data="value" />
      <pm-dialog
        :close-on-click-modal="false"
        :title="label"
        fullscreen="true"
        :visible.sync="dialogVisible"
        :append-to-body="true"
        :width="maxWidth"
        class="body-no-padding"
      >
        <slot slot="title" name="title-slot" />
        <MonacoEditor
          v-if="dialogVisible"
          ref="monaco-max"
          class="monaco-border"
          :language="language"
          :height="workspaceRealHeightNum - 125"
          :code="value"
          :theme="theme"
          :options="editorOptions"
          @codeChange="onCodeChang"
        />
        <el-button v-if="maxable" type="text" @click="cancel">
          <svg-icon :class="maxableBtnClass" icon-class="window-min" />
        </el-button>
        <el-button type="text" @click="top">
          <svg-icon :class="topBtnClass" icon-class="top" />
        </el-button>
        <el-button type="text" @click="bottom">
          <svg-icon :class="bottomBtnClass" icon-class="bottom" />
        </el-button>
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
import _ from 'lodash'
import { BaseVue } from '@lib'
import MonacoEditor from '@/libs/monaco/Monaco.vue'

export default {
  name: 'code-editor',
  components: { MonacoEditor },
  mixins: [BaseVue],
  props: {
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
  },

  data() {
    return {
      dialogVisible: false,
      oldLineCount: 0,
      lineCount: 0,
    }
  },
  computed: {
    clipBtnClass() {
      if (this.dialogVisible) {
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
      if (this.dialogVisible) {
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
    topBtnClass() {
      if (this.dialogVisible) {
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
      if (this.dialogVisible) {
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
    dialogVisible(val) {
      this.$emit('update:consoleIsInMax', val)
    }
  },
  methods: {
    onCodeChang(editor) {
      this.$emit('input', editor.getValue())
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
      return this.dialogVisible ? this.$refs['monaco-max'].getEditor() : this.$refs['monaco'].getEditor()
    },
    getPosition() {
      return this.getEditor().getPosition()
    },
    getScrolledVisiblePosition(lineNumber) {
      return this.getEditor().getScrolledVisiblePosition({ lineNumber: lineNumber })
    },
    isFullScreen() {
      return this.dialogVisible
    },
    getHeight() {
      return this.dialogVisible ? workspaceRealHeightNum - 125 : this.height
    },

    cancel() {
      this.dialogVisible = false
    },
    max() {
      this.dialogVisible = true
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
    left: 0px;
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

  .monaco-border {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
</style>
