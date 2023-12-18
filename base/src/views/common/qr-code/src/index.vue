<template>
  <canvas />
</template>

<script>
import QRCode from 'qrcode'

export default {
  name: 'q-r-code',
  props: {
    value: {},
    width: {
      type: Number,
      default: 140
    },
    height: {
      type: Number,
      default: 140,
    },
    colorDark: {
      default: '#000000'
    },
    colorLight: {
      default: '#ffffff'
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          this.renderQRCode()
        }
      }
    }
  },
  mounted() {
    this.renderQRCode()
  },
  methods: {
    renderQRCode() {
      if (this.value) {
        QRCode.toCanvas(this.$el, this.value, {
          width: this.width,
          height: this.height,
          colorDark: this.colorDark,
          colorLight: this.colorLight,
        })
      }
    }
  },
}
</script>

