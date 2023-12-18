<template>
  <el-transfer
    v-model="value"
    v-bind="$attrs"
    :data="_options"
    :props="{key:valueField,label:labelField}"
    v-on="$listeners"
  />
</template>
<script>
import { BaseVue } from '@lib'
import List from '../../common/list.js'
export default {
  name: 'pm-transfer',
  mixins: [BaseVue, List],
  props: {
    props: {
      type: Object,
      default: {
        key: 'key',
        label: 'label',
        disabled: false,
      }
    },

    options: {
      default: [],
      type: Array,
    },
  },
  computed: {
    _options() {
      return this.data || this.options
    }
  },
  watch: {
  },
  mounted() {
  },

  methods: {
  }
}
</script>
<style lang="scss" scoped>
</style>
