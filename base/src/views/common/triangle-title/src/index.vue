<template>
  <div class="triangle">
    <div class="text">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {},
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.triangle {
  position: absolute;
  left: -5px;
  top: -30px;
  color: #ffffff;
  height: 0px;
  width: 0px;
  text-align: right;
  border-top: 45px solid transparent;
  border-right: 45px solid #8fa9c5;
  border-bottom: 45px solid transparent;
  transform: rotate(45deg);
  .text {
    width: 60px;
    font-size: 9px;
    transform: rotate(-90deg);
  }
}
</style>
