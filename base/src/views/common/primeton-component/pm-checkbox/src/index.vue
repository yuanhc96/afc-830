<template>
  <el-checkbox-group v-model="value" v-bind="$attrs" v-on="$listeners">
    <template v-if="checkboxType === 'button'">
      <el-checkbox-button v-for="item in _options" :key="item[valueField]" :label="item[valueField]">
        {{ item[labelField] }}
      </el-checkbox-button>
    </template>
    <template v-else>
      <el-checkbox
        v-for="item in _options"
        :key="item[valueField]"
        :border="checkboxType === 'border'"
        :label="item[valueField]"
      >
        {{ item[labelField] }}
      </el-checkbox>
    </template>
  </el-checkbox-group>
</template>
<script>
import { BaseVue } from '@lib'
import List from '../../common/list.js'
export default {
  name: 'pm-checkbox',
  mixins: [BaseVue, List],
  props: {
    checkboxType: {
      default: 'normal',
      type: String,
    },
  },
  data() {
    return {
      data: []
    }
  },
  computed: {
    _options() {
      return this.data || this.options
    }
  },
}
</script>
<style lang="scss" scoped>

</style>
