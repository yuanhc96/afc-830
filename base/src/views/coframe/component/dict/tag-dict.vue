<template>
  <span :class="`${type} ${type}_${value}`">{{ text }}</span>
</template>
<script>
import * as DICT from './index.js'
export default {
  props: {
    type: {
      default: 'STATUS',
      type: String,
    },
    value: {
      type: String,
      default: '',
    }
  },
  computed: {
    text() {
      return DICT[this.type][this.value]
    }
  }
}
</script>
<style lang="scss" scoped>
  @import './dict.scss'
</style>
