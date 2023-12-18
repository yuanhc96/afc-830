<template>
  <div>
    <form id="myForm" ref="myForm" :method="method" target="myFrame">
      <slot name="formData" />
    </form>
    <iframe ref="download" name="myFrame" style="display: none" frameborder="0" />
  </div>
</template>
<script>
import { OtherUtil } from '@lib'
export default {
  name: 'pm-download',
  props: {
    value: {},
    method: {
      default: 'get',
    }
  },
  watch: {
    value(url) {
      this.download(url)
    }
  },
  methods: {
    download(url) {
      if (url) {
        if (['chrome', 'firefox', 'safari'].includes(OtherUtil.getBrowse().name)) {
          this.$refs['myForm'].action = url
          this.$refs['myForm'].submit()
          //            this.$refs['download'].src = url
        } else {
          window.open(url)
        }
      }
      this.$emit('input', null)
    }
  }
}
</script>
