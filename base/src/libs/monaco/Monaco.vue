<template>
  <div v-loading="editorLoading" :style="style" />
</template>

<script>
var debounce = require('lodash.debounce')
var monacoLoader = require('./MonacoLoader')

export default {
  props: {
    width: { type: [String, Number], default: '100%' },
    height: { type: [String, Number], default: '100%' },
    code: { type: String, default: '' },
    originalCode: { type: String, default: '' },
    modifiedCode: { type: String, default: '' },
    mode: { type: String, default: 'normal' },
    srcPath: { type: String, default: './static/monaco-editor' },
    language: { type: String, default: 'javascript' },
    theme: { type: String, default: 'vs-dark' }, // vs, hc-black
    folding: { type: Boolean, default: true },
    options: {
      type: Object,
      default: () => {
      }
    },
    highlighted: {
      type: Array,
      default: () => [
        {
          number: 0,
          class: ''
        }
      ]
    },
    changeThrottle: { type: Number, default: 0 }
  },
  data() {
    return {
      editorLoading: false,
      defaults: {
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: 'line',
        automaticLayout: false,
        glyphMargin: true
      }
    }
  },
  computed: {
    style() {
      const { width, height } = this
      const fixedWidth = width.toString().indexOf('%') !== -1 ? width : `${width}px`
      const fixedHeight = height.toString().indexOf('%') !== -1 ? height : `${height}px`
      return {
        width: fixedWidth,
        height: fixedHeight
      }
    },
    editorOptions() {
      return Object.assign({}, this.defaults, this.options, {
        value: this.code,
        language: this.language,
        theme: this.theme,
        defaultEOL: 0,
        folding: this.folding
      })
    }
  },
  watch: {
    highlighted: {
      handler(lines) {
        this.highlightLines(lines)
      },
      deep: true
    },
    modifiedCode(val) {
      this.editor.getModifiedEditor().setValue(val)
    },
    originalCode(val) {
      this.editor.getOriginalEditor().setValue(val)
    }
  },
  mounted() {
    this.fetchEditor()
  },
  beforeDestroy() {
    this.destroyMonaco()
  },
  methods: {
    highlightLines(lines) {
      if (!this.editor) {
        return
      }
      lines.forEach(line => {
        const className = line.class
        const highlighted = this.$el.querySelector(`.${className}`)

        if (highlighted) {
          highlighted.classList.remove(className)
        }

        const number = parseInt(line.number)
        if ((!this.editor && number < 1) || isNaN(number)) {
          return
        }

        const selectedLine = this.$el.querySelector(`.view-lines [linenumber="${number}"]`)
        if (selectedLine) {
          selectedLine.classList.add(className)
        }
      })
    },
    editorHasLoaded(editor, monaco) {
      this.editor = editor
      this.monaco = monaco
      this.editor.onDidChangeModelContent(event => this.codeChangeHandler(editor, event))
      this.$emit('mounted', editor)
    },
    codeChangeHandler: function(editor) {
      if (this.codeChangeEmitter) {
        this.codeChangeEmitter(editor)
      } else {
        this.codeChangeEmitter = debounce(function(editor) {
          this.$emit('codeChange', editor)
        }, this.changeThrottle)
        this.codeChangeEmitter(editor)
      }
    },
    fetchEditor() {
      monacoLoader.load(this.srcPath, this.createMonaco)
    },
    createModel(code) {
      return window.monaco.editor.createModel(code)
    },
    formatValue() {
      this.editorLoading = true
      setTimeout(() => {
        this.editor.getAction(['editor.action.format']).run().then(() => {
          this.editorLoading = false
        })
      }, 100)
    },
    find() {
      this.editorLoading = true
      setTimeout(() => {
        if(!this.editor) {
          return
        }
        this.editor.getAction(['actions.find']).run().then(() => {
          this.editorLoading = false
        })
      }, 100)
    },
    foldAll() {
      this.editorLoading = true
      setTimeout(() => {
        if(!this.editor) {
          return
        }
        this.editor.getAction(['editor.foldAll']).run().then(() => {
          this.editorLoading = false
        })
      }, 100)
    },
    unfoldAll() {
      this.editorLoading = true
      setTimeout(() => {
        if(!this.editor) {
          return
        }
        this.editor.getAction(['editor.unfoldAll']).run().then(() => {
          this.editorLoading = false
        })
      }, 100)
    },
    wordWrap() {
      this.editorLoading = true
      setTimeout(() => {
        if(!this.editor) {
          return
        }
        this.editor.getAction(['editor.action.toggleWordWrap']).run().then(() => {
          this.editorLoading = false
        })
      }, 100)
    },
    getEditor() {
      return this.editor
    },
    setValue(val) {
      if (this.editor && this.editor.setValue) {
        this.editor.setValue(val)
      }
    },
    createMonaco() {
      if (this.mode === 'diff') {
        this.editor = window.monaco.editor.createDiffEditor(this.$el, this.editorOptions)
        this.editor.setModel({
          original: this.createModel(this.originalCode),
          modified: this.createModel(this.modifiedCode)
        })
      } else if (this.mode === 'normal') {
        this.editor = window.monaco.editor.create(this.$el, this.editorOptions)
        //        const textModel = this.createModel(this.code)
        //        textModel._EOL = '\n'
        //        textModel._options.defaultEOL = 0
        //        this.editor.setModel(textModel)
      }
      this.editorHasLoaded(this.editor, window.monaco)
    },
    destroyMonaco() {
      if (this.editor) {
        this.editor.dispose()
      }
    },
    updateOptions(options) {
      if (options) {
        this.editor.updateOptions({ ...options })
      }
    },
  }
}
</script>
