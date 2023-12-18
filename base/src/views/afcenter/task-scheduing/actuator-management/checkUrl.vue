<template>
  <pm-dialog
    :visible.sync="dialogVisible"
    width="300px"
    title="注册节点"
    :showFooter="true">
    <div style="margin: 20px 0;" v-if="currentRegistryList.length">
      <div v-for="(registry, index) in currentRegistryList" :key="index" style="margin:10px">
        {{ index + 1 }}. {{ registry }}
      </div>
    </div>
    <div style="margin: 20px 0;" v-else>
      暂无数据
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
    currentRegistryList: {
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