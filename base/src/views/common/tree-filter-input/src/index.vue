<template>
  <div class="mt-10 ">
    <el-input
      v-bind="$attrs"
      v-model="value"
      clearable
    >
    <i class=" el-input__icon el-icon-search" slot="suffix"></i>
    </el-input>
  </div>
</template>
<script>
export default {
    props:{
        value:{}
    },
    watch:{
        value(val) {
            this.$emit('input', val)
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep input.el-input__inner{
   // border: none!important;
   height:32px;
   line-height:32px;
}
</style>