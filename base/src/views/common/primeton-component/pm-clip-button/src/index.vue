<template>
  <el-button
    v-if="!hasSlots"
    v-clipboard:copy="data"
    v-clipboard:success="clipboardSuccess"
    type="text"
  ><i class="el-icon-copy-document" /></el-button>
  <div v-else v-clipboard:copy="data" v-clipboard:success="clipboardSuccess" style="cursor: pointer" title="点击复制"><slot /></div>
</template>

<script>
import clip from '@/utils/clipboard' // use clipboard directly
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive

export default {
  name: 'clip-button',
  directives: {
    clipboard,
  },
  props: {
    data: {
      type: String,
      default: '',
    },
  },
  computed: {
    hasSlots() {
      return !!this.$slots.default
    }
  },

  methods: {
    handleCopy(text, event) {
      clip(text, event)
    },
    clipboardSuccess() {
      this.$message({
        message: '已将内容复制到剪贴板',
        type: 'success',
        duration: 1500,
      })
    },
  },
}
</script>
