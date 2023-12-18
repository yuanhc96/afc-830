<template>
  <div>
    <el-input
      v-model="value"
      :placeholder="placeholder"
      class="input-with-select"
      clearable
      @keypress.native.enter="submit"
    >
      <el-button slot="append" icon="el-icon-search" clearable @click="submit" />
    </el-input>
    <input id="hiddenText" type="text" style="display:none"> <!--防止回车刷新页面-->
  </div>
</template>
<script>
import { _ } from '@lib'
export default {
  name: 'search-input',
  props: {
    immediate: false,
    value: {},
    placeholder: {
      default: '检索...'
    },
  },
  mounted() {
    if (this.immediate) {
      this.$watch('value', _.debounce(this.submit, 150))
    }
  },
  methods: {
    submit() {
      this.$emit('input', this.value)
      this.$emit('submit')
    }
  }
}
</script>
