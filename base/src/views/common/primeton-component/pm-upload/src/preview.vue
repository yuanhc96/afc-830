<template>
  <pm-dialog
    class="body-no-padding"
    append-to-body
    top="30px"
    :close-on-click-modal="false"
    :title="attachment? attachment.fileName :''"
    :visible.sync="dialogVisible"
    @close="cancel"
  >
    <CodeEditor
      v-if="dialogVisible"
      ref="code-editor"
      v-model="fileContent"
      max-width="100%"
      :options="{ readOnly: true, wordWrap: 'on' }"
      :height="workspaceRealHeightNum - 240"
    />
    <div slot="footer">
      <el-button type="text" @click="cancel">关 闭</el-button>
    </div>
  </pm-dialog>
</template>

<script>
import { BaseVue , _} from '@lib'
export default {
  name: 'text-attachment-overview',
  mixins: [BaseVue],
  props: {
    dialogVisible: {
      default: false,
    },
    fileContent: {},
    getFileContent: {
      type: Function
    },
    attachment: {}
  },
  watch: {
    attachment: {
      deep: true,
      async handler(val) {
        if (this.getFileContent) {
          this.fileContent = await this.getFileContent(val)
        }
      }
    },
    fileContent: {
      handler(val) {
        this.$refs['code-editor'].setValue(this.fileContent)
      }
    }
  },
  methods: {
    cancel() {
      this.fileContent = null
      this.$emit('update:dialogVisible', false)
    },
  }
}
</script>
