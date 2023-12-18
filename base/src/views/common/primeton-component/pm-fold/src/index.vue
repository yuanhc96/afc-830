<template>
  <div>
    <div class="pm-fold-bar">
      <i
        v-if="allowFold && arrowPosition === 'left'"
        :class="{'pm-fold-btn':true,'el-icon-arrow-down':isFold,'el-icon-arrow-right':!isFold}"
        @click="isFold = !isFold"
      />
      <span class="pm-fold-title">
        <slot v-if="$slots.title" name="title" />
        <span v-else>{{ title }}</span>
      </span>
      <i
        v-if="allowFold && arrowPosition === 'right'"
        :class="{'pm-fold-btn':true,'el-icon-arrow-down':isFold,'el-icon-arrow-left':!isFold}"
        @click="isFold = !isFold"
      />
      <slot name="extend" />
    </div>
    <div v-show="isFold">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    arrowPosition: {
      type: String,
      default: 'right'
    },
    allowFold: {
      type: Boolean,
      default: true
    },
    isFold: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    isFold(val) {
      this.$emit('update:isFold', val)
    }
  },
  methods: {
    open() {
      this.isFold = true
    },
    close() {
      this.isFold = false
    },
  }
}
</script>
<style lang="scss" scoped>
  .pm-fold-bar {
    padding-left: 10px;
    background: #f8f8f8;
    border-bottom: 1px solid #f0f0f0;
    line-height: 28px;
  }

  .pm-fold-btn {
    font-size: 13px;
    cursor: pointer;
    border-radius: 2px;
    padding: 1px;
    user-select: none;
    &:hover {
      background: #e1e1e1;
    }
  }

  .pm-fold-title {
    font-size: 14px;
    font-weight: bold;
  }
</style>
