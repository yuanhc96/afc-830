<template>
  <pm-dialog
    :visible.sync="dialogVisible"
    :width="dialogWidth"
    :title="title"
    :showFooter="true">
    <div style="margin: 20px 0;">
      <div v-if="type !== 'handler'" v-html="content"></div>
      <pre v-else>{{ content }}</pre>
    </div>
    <el-button slot="footer" @click="cancel" size="mini" type="primary">确定</el-button>
  </pm-dialog>
</template>
<script>
import { Form } from '@lib';
export default {
  name: 'check-url',
  mixins: [Form],
  props: {
    content: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'handler'
    }
  },
  computed: {
    title() {
      return this.type === 'handler' ? '失败备注' : '调度结果'
    },
    dialogWidth() {
      return `${this.type === 'handler' ? 930 : 400}px`
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  ::v-deep .el-dialog__body {
      padding-bottom: 0 !important;
  }
  ::v-deep .el-dialog__footer.dialog-footer {
    padding: 15px 0;
    height: 62px !important;
  }
</style>