<template>
  <div class="position-relative">
    <el-button type="text" class="position-absolute text-center" style="top:0px;right:10px;z-index:1000;" @click="doMax">
      <el-tooltip content="最大化">
        <svg-icon icon-class="my-max" />
      </el-tooltip>
    </el-button>
    <div>
      <slot />
    </div>
    <el-dialog v-if="dialogVisible" :fullscreen="true" :visible.sync="dialogVisible" :title="title">
      <slot />
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'pm-maximize',
  props: {
    title: {
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      isMax: false,
    }
  },
  methods: {
    doMax() {
      this.dialogVisible = !this.dialogVisible
      this.isMax = !this.isMax
    },
    cancel() {
      this.dialogVisible = false
      this.isMax = false
    }
  }
}
</script>
<style scoped>
  ::v-deep .el-dialog__body{
    padding:10px 10px;
  }
</style>
