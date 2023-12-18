<template>
  <div>
    <el-input
      v-if="!disabled"
      v-model="text"
      :type="password ? 'password' : 'text'"
      :size="size"
      auto-complete="new-password"
      autocomplete="new-password"
      v-bind="$attrs"
      @change="changeValue"
    >
      <el-button slot="append" @click="switchType">
        <i v-if="!password" class="el-icon-view" />
        <svg-icon v-else icon-class="eye" />
      </el-button>
    </el-input>
    <div v-else>
      <span v-if="!password">{{ value }}</span> <span v-else>******</span>
      <el-button class="float-right" type="text" @click="switchType">
        <i v-if="!password" class="el-icon-view" />
        <svg-icon v-else icon-class="eye" />
      </el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'pm-input-password',
  components: {},
  mixins: [],
  props: {
    size: {},
    disabled: {
      default: false,
    },
    value: {},
  },

  data() {
    return {
      password: true,
      text: null,
    }
  },
  computed: {},
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.text = val
      }
    }
  },
  mounted() {
  },
  methods: {
    switchType() {
      this.password = !this.password
    },
    changeValue(val) {
      this.$emit('input', val)
    },
  },
}
</script>
