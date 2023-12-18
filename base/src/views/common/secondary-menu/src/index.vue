<template>
  <div
    class="secondary-menu"
    :style="`height:calc(100vh - ${85 + offsetHeight}px)`"
    @mouseup="mouseup"
  >
    <div
      v-loading="leftDisabled"
      element-loading-spinner="none"
      element-loading-background="rgba(0, 0, 0, 0.15)"
      class="left"
      :style="`height:inherit;min-width:${realLeftWidth};width:${realLeftWidth};`"
    >
      <div style="height: inherit">
        <Hamburger
          v-if="leftTitle"
          class="hamburger"
          :toggle-click="toggleSideBar"
          :is-active="opened"
        />
        <div v-if="showTitle" :style="`height:${titleHeight}px`" class="title">
          <div v-show="!opened">
            {{ title }}
            <slot name="left-title" />
          </div>
        </div>
        <!--<div :style="`height:30px`" class="title " v-else></div>-->
        <div
          v-show="!opened"
          class="body"
          :style="`overflow-x:hidden;overflow-y:auto;height: calc(100% - ${leftTitleHeight}px);`"
        >
          <slot name="left-body" />
        </div>
        <slot v-show="!opened" name="left-footer" />
      </div>
    </div>
    <div
      v-if="allowResize"
      class="handle"
      :style="`left:${realLeftWidth};`"
      @mousedown.stop="mousedown"
      @mouseup.stop="mouseup"
    />
    <div
      class="right"
      :style="
        !resizeBegin
          ? `width:calc(100% - ${realLeftWidth});`
          : `width:calc(100% - ${beginWidth}px);`
      "
    >
      <div v-if="rightTitle" class="title" :style="`height:${titleHeight}px`">
        <slot name="right-title" />
      </div>
      <div class="body">
        <slot name="right-body" />
      </div>
    </div>
  </div>
</template>

<script>
import * as _ from "lodash";
import Hamburger from "@/components/Hamburger";

export default {
  name: "secondary-menu",
  components: { Hamburger },
  props: {
    leftDisabled: {
      default: false,
    },
    leftWidth: {
      type: String | Number,
      default: 200,
    },
    minLeftWidth: {
      type: String | Number,
      default: 180,
    },
    maxLeftWidth: {
      type: String | Number,
      default: 600,
    },
    rightTitle: {
      type: Boolean,
      default: true,
    },
    leftTitle: {
      type: Boolean,
      default: true,
    },
    leftTitleHeight: {
      type: String | Number,
      default: 40,
    },
    titleHeight: {
      type: Number,
      default: 40,
    },
    iconField: {
      type: String,
      default: "icon",
    },
    title: {
      type: Object | String,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    offsetHeight: {
      type: Number,
      default: 0,
    },
    allowResize: {
      default: true,
    },
  },
  data() {
    return {
      innerLeftWidth: 0,
      beginWidth: 0,
      resizeBegin: false,
      keyword: null,
      index: -1,
      opened: false,
    };
  },
  computed: {
    realLeftWidth() {
      if (this.opened) return "30px";
      const isPercent =
        _.isString(this.innerLeftWidth) &&
        this.innerLeftWidth.indexOf("%") > -1;
      return isPercent ? this.innerLeftWidth : this.innerLeftWidth + "px";
    },
  },
  watch: {},
  mounted() {
    const { mouseup, mousemove, leftWidth } = this;
    document.documentElement.addEventListener("mouseup", mouseup, true);
    document.documentElement.addEventListener("mousemove", mousemove, true);
    this.innerLeftWidth = leftWidth;
  },
  methods: {
    mousedown(e) {
      const { innerLeftWidth } = this;
      this.resizeBegin = true;
      this.beginWidth = innerLeftWidth;
      this.beginX = e.clientX;
    },
    mousemove(e) {
      const { resizeBegin, beginWidth, beginX, minLeftWidth, maxLeftWidth } =
        this;
      if (!resizeBegin) return;
      const width = beginWidth + (e.clientX - beginX);
      const isInside = width > minLeftWidth && width < maxLeftWidth;
      if (isInside) this.innerLeftWidth = width;
    },
    mouseup(e) {
      const { resizeBegin } = this;
      if (resizeBegin) this.resizeBegin = false;
      this.$emit("layerChanged");
    },
    toggleSideBar() {
      const { opened } = this;
      this.opened = !opened;
      this.$nextTick(() => {
        this.$emit("layerChanged");
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.secondary-menu {
  height: 100%;
  overflow: hidden;
  display: flex;

  .handle {
    min-width: 5px;
    max-width: 5px;
    cursor: col-resize;
    background: transparent;
    transition: all 0.3s ease;
    background: #eaedf1;

    &:hover {
      background: #909399;
    }
  }

  .left {
    /*background: #f3f3f3;*/
    position: relative;
    transition: width 0.3s ease;

    .hamburger {
      position: absolute;
      float: right;
      top: 5px;
      right: 5px;
      width: 16px;
      height: 16px;
      z-index: 99;
    }

    .title {
      font-weight: bold;
      font-size: 14px;
      padding: 0px 10px;
      height: 40px;
      line-height: 40px;
      background: #ffffff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    // .body {
    //   /*overflow: hidden;*/
    //   .search-input {
    //   }
    // }
  }

  > .right {
    > .title {
      height: 40px;
      padding: 6px;
      background: #eaedf1;
    }

    // .body {
    // }
  }

  .no-data-text {
    height: 40px;
    line-height: 40px;
  }

  .sameStyle {
    min-width: 140px;
    height: 32px;
    line-height: 32px;
    display: block;
    color: #333;
    padding-left: 30px;
    cursor: pointer;
    font-size: 12px;
  }

  .item-select {
    @extend .sameStyle;
    background: #ffffff;
  }

  .item {
    @extend .sameStyle;

    &:hover {
      background: #f4f6f8;
    }
  }
}
</style>
