<template>
  <el-select
    v-model="dictValue"
    style="width: 100%"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <el-option v-if="emptyItemText" :label="emptyItemText" :value="null" />
    <el-option
      v-for="(value, key) in data"
      :key="key"
      :value="key"
      :label="value"
    />
  </el-select>
</template>

<script>
export default {
  name: "pm-dict",
  props: {
    value: {},
    emptyItemText: {
      default: null,
    },
    data: {
      type: Array | Object,
    },
  },
  computed: {
    dictValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  // watch: {
  //   value(val) {
  //     this.$emit("input", val);
  //   },
  // },
};
</script>

<style lang="scss" scoped>
</style>
