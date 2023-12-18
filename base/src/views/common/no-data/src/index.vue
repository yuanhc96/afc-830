<template>
  <div class="text-center">
    <svg-icon icon-class="noData" :class="size" />
    <slot>
      <div style="color:#909399;">{{ text }}</div>
    </slot>
  </div>
</template>
<script>
export default {
  name: 'no-data',
  props: {
    size: {
      default: 'normal'
    },
    text: {
      default: '暂无数据'
    },
  }
}
</script>
<style scoped>
  .small {
    font-size: 60px;
  }

  .normal {
    font-size: 80px;
  }

  .large {
    font-size: 100px;
  }
</style>
