<template>
  <i v-if="type === 'font' || type === 'ele'" :class="iconValue" :style="iconStyle" />
  <img
    v-else
    fit="scale-down"
    :src="svgUrl(iconValue)"
    :class="className"
    :style="iconStyle"
  >
</template>
<script>
import { HtmlUtil } from '@lib';
import model from './model';
export default {
  name: 'PmIcon',
  mixins: [model],
  props: {
    // font 是code,svg是fileId
    value: {},
    className: {
      type: String,
      default: ''
    },
    myStyle: {
      type: Object,
      default: () => ({})
    },
    color: {
      type: String,
      default: ''
    },
    // apiPrefix: {
    //   type: String,
    //   default: '/afc'
    // }
  },
  computed: {
    type() {
      if (!this.value || this.value.startsWith('el-icon-')) {
        return 'ele'
      } else if (this.value.indexOf(',') === -1) {
        return 'font'
      } else if (this.value.split(',').length) {
        return this.value.split(',')[2]
      }
    },
    iconValue() {
      if (this.type === 'ele') {
        return this.value
      } else if (this.value.indexOf(',') === -1) {
        return this.className + ' iconfont icon-' + this.value
      } else if (this.type === 'font') {
        return this.className + ' iconfont icon-' + this.value.split(',')[0]
      } else if (this.type === 'svg') {
        return this.value.split(',')[0]
      }
    },
    iconStyle() {
      return {
        ...this.myStyle,
        color: this.color
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val && val.indexOf(',') !== -1 && this.type === 'font') {
          HtmlUtil.dynamicLoadCss(this.cssLoadUrl(val.split(',')[1]))
        }
      }
    }
  },
  mounted() {
  }
}
</script>
<style lang="scss" scoped>
i{
  display: inline-block;
  min-width: 1em;
  min-height: 1em;
}
</style>
