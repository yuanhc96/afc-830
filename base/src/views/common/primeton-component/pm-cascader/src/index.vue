<template>
  <el-cascader
    v-model="value"
    v-bind="$attrs"
    :props="props"
    :options="data"
    v-on="$listeners"
  />
</template>
<script>
import { BaseVue } from '@lib'
import List from '../../common/list.js'
export default {
  name: 'pm-cascader',
  mixins: [BaseVue, List],
  props: {
    props: {
      type: Object,
      default: { expandTrigger: 'hover' }
    }
  }
}
</script>
