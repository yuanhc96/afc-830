<template>
  <el-dialog
    v-el-drag-dialog="draggable && !fullscreen"
    v-bind="$attrs"
    :title="title"
    :visible.sync="visible"
    :append-to-body="appendToBody"
    :close-on-click-modal="closeOnClickModal"
    :show-close="showClose"
    :fullscreen=" fullscreen === 'disable' ? false : fullscreen"
    @closed="closed"
    v-on="$listeners"
  >
    <template slot="title">
      <div>
        <slot name="title">
          <span>{{ title }}</span>
        </slot>
        <!-- <span v-if="" > -->
        <el-button v-if="fullscreen !==' disable' && showFullScreenButton !== false" style="position: absolute; right: 40px; top: 10px; " type="text" @click="switchFullscreen">
          <slot name="icon">
            <i class="el-icon-full-screen mr-10" style="font-size:16px;line-height: 21px" />
          </slot>
          <!-- <svg-icon style="font-size:14px;" :icon-class="fullscreen?'window-min':'window-max'" /> -->
        </el-button>
        <!-- </span> -->
      </div>
    </template>
    <div class="pm-dialog__body" :style="`max-height: calc(100vh - ${showFooter ?(fullscreen?footerHeight:footerHeight+200) : 200}px);`">
      <slot />
    </div>
    <div v-if="showFooter" slot="footer">
      <slot name="footer" />
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'pm-dialog',
  directives: {
    'el-drag-dialog': {
      bind(el, binding) {
        const dialogHeaderEl = el.querySelector('.el-dialog__header')
        const dragDom = el.querySelector('.el-dialog')
        dialogHeaderEl.style.cssText += ';cursor:move;'
        dragDom.style.cssText += ';top:0px;'

        // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        const getStyle = (function() {
          if (window.document.currentStyle) {
            return (dom, attr) => dom.currentStyle[attr]
          } else {
            return (dom, attr) => getComputedStyle(dom, false)[attr]
          }
        })()

        dialogHeaderEl.onmousedown = e => {
          // 鼠标按下，计算当前元素距离可视区的距离
          const disX = e.clientX - dialogHeaderEl.offsetLeft
          const disY = e.clientY - dialogHeaderEl.offsetTop

          const dragDomWidth = dragDom.offsetWidth
          const dragDomheight = dragDom.offsetHeight

          const screenWidth = document.body.clientWidth
          const screenHeight = document.body.clientHeight

          const minDragDomLeft = dragDom.offsetLeft
          const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth

          const minDragDomTop = dragDom.offsetTop
          const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight

          // 获取到的值带px 正则匹配替换
          let styL = getStyle(dragDom, 'left')
          let styT = getStyle(dragDom, 'top')

          if (styL.includes('%')) {
            styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100)
            styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100)
          } else {
            styL = +styL.replace(/\px/g, '')
            styT = +styT.replace(/\px/g, '')
          }

          document.onmousemove = function(e) {
            // 通过事件委托，计算移动的距离
            let left = e.clientX - disX
            let top = e.clientY - disY

            // 边界处理
            if (-left > minDragDomLeft) {
              left = -minDragDomLeft
            } else if (left > maxDragDomLeft) {
              left = maxDragDomLeft
            }

            if (-top > minDragDomTop) {
              top = -minDragDomTop
            } else if (top > maxDragDomTop) {
              top = maxDragDomTop
            }

            // 移动当前元素
            dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`
          }

          document.onmouseup = function(e) {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    }
  },
  props: {
    title: { type: String, default: '' },
    appendToBody: { type: Boolean, default: true },
    closeOnClickModal: { type: Boolean, default: false },
    draggable: { type: Boolean, default: true },
    fullscreen: { type: Boolean, default: false },
    footerHeight: { type: Number, default: 60 },
    showFooter: { type: Boolean, default: true },
    showFullScreenButton: { type: Boolean, default: false },
    showClose: { type: Boolean, default: true },
    visible: { type: Boolean, default: false },
  },
  computed: {
    fullscreenDialogHeight() {
      return document.body.clientHeight
    }
  },
  watch: {
    visible(val) {
      this.$emit('update:visible', val)
    }
  },
  methods: {
    show() {
      this.$emit('update:visible', true)
    },
    hidden() {
      this.$emit('update:visible', false)
    },
    switchFullscreen() {
      const newScreenStatue = !this.fullscreen
      this.$emit('update:fullscreen', newScreenStatue)
      this.fullscreen = newScreenStatue
    },
    // eslint-disable-next-line
    closed(done) {
      if (this.fullscreen !== 'disable') {
        this.$emit('update:fullscreen', false)
      }
    }
  }
}
</script>

<style scoped lang="scss">
  ::v-deep .el-dialog__body {
    height: calc(100% - 84px);
    padding-bottom: 0px;
  }

  ::v-deep .el-dialog.is-fullscreen {
    left: 0 !important;
  }

  .pm-dialog__body {
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 0px;
  }
  ::v-deep .is-fullscreen {
    left: 0 !important;
    top: 0 !important;
  }
</style>
