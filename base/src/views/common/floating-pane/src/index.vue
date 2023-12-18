<template>
  <div class="pane position-relative">
    <div class="floating" :style="`height:${height};`">
      <div v-if="isMax" key="max" class="max">
        <slot name="max" />
      </div>
      <div v-else key="min" class="min">
        <slot name="min" />
      </div>
      <div class="handler" @click="expand">
        <el-tooltip :content="isMax?'收起':'展开'" transition="null">
          <i v-if="isMax" class="el-icon-arrow-up" />
          <i v-else class="el-icon-arrow-down" />
        </el-tooltip>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isMax: {
      default: false,
    },
    maxHeight: {
      default: false,
    },
    minHeight: {
      default: false,
    },
  },
  data() {
    return {
      height: '40px',
    }
  },
  watch: {
    isMax(val) {
      if (val) {
        this.height = this.maxHeight || '800px'
      } else {
        this.height = this.minHeight || '40px'
      }
    }
  },
  methods: {
    expand() {
      this.isMax = !this.isMax
    }
  }
}
</script>
<style lang="scss" scoped>
  .pane {
    z-index: 1000;
    background: #E4E7ED;
    .floating {
      position: absolute;
      background: #E4E7ED;
      /*background: rgba(30, 207, 207, 0.95);*/
      width: 100%;
      border-bottom: 1px solid #d0d0d0;
      transition: height .3s ease;
      .handler {
        cursor: pointer;
        width: 50px;
        border: 1px solid #d0d0d0;
        border-top: transparent;
        background: #ffffff;
        border-bottom-left-radius: 20%;
        border-bottom-right-radius: 20%;
        text-align: center;
        position: absolute;
        bottom: -14px;
        left: 50%;
        transition: all .3s ease;
        .arrow {
          transform: rotate(90deg);
        }
        &:hover {
          background: #d0d0d0;
        }
      }
    }

  }

</style>
