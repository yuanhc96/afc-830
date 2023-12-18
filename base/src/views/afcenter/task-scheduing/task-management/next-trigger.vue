<template>
  <pm-dialog
    :visible.sync="dialogVisible"
    width="300px"
    title="最近执行时间"
    :showFooter="true">
    <div style="margin: 20px 0;">
      <div v-for="(triggerTime, index) in triggerTimeLists" :key="index" style="margin:10px">
        {{ triggerTime }}
      </div>
    </div>
    <el-button slot="footer" @click="cancel" size="mini" type="primary">确定</el-button>
  </pm-dialog>
</template>
<script>
import { Form } from '@lib';
export default {
  name: 'next-trigger',
  mixins: [Form],
  props: {
    triggerTimeLists: {
      type: Array,
      default: () => []
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