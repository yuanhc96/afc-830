<template>
  <div class="main">
    <el-image
      :src="bgPng"
      :fit="cover"
    />
  </div>
</template>
<script>
import bgPng from '../../../../static/images/AFC_8.2.png'
export default {
  components: { },
  data() {
    return {
      bgPng
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.main {
  margin: 240px;
  margin-top: calc(50vh - 200px);
  .el-image {
    margin: 0 auto;
    display: block;
  }
}
</style>
