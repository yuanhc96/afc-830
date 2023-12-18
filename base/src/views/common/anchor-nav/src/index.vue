<template>
  <div class="anchor-nav">
    <div
      v-for="(step,index) in steps"
      :key="step.name"
      :class="{item:true,select:currentIndex === index}"
      @click="anchors(index)"
    >{{ step.name }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'anchor-nav',
  props: {
    target: {},
    steps: {}
  },
  data() {
    return {
      currentIndex: 0,
      steps: 0,
      scrolltop: 0, // 滑轮 距顶部的距离
      stop: false,
    }
  },
  watch: {
    scrolltop(val) {
      for (let i = 0; i < this.steps.length; i++) {
        if ((val + 50) > this.steps[i].top) {
          this.currentIndex = i
        }
      }
    },
  },
  mounted() {
    this.getPulleyTopDistance()
  },
  methods: {
    anchors(val) {
      this.currentIndex = val
      this.pulleyRoll(this.steps[val].top, this.scrolltop)
    },

    pulleyRoll(top, distance) {
      var small_interval = (top - distance) / 50
      var i = 0
      var timer = setInterval(() => {
        this.stop = true
        i++
        distance += small_interval
        this.target.scrollTop = distance
        if (i == 50) {
          clearInterval(timer)
          this.stop = false
          this.scrolltop = this.target.scrollTop
        }
      }, 10)
    },

    getPulleyTopDistance() {
      window.addEventListener('scroll', this.updateScrollTop, true)
    },
    updateScrollTop() {
      if (!this.stop) {
        this.scrolltop = this.target.scrollTop
      }
    },
    destroyed() {
      window.removeEventListener('scroll', this.updateScrollTop)
    }
  }
}
</script>

<style lang="scss" scoped>
  .anchor-nav {
    position: fixed;
    /*border-left: 1px solid #0a76a4;*/
    /*border-top: 1px solid #0a76a4;*/
    height: 800px;
    .item {
      border-left: 3px solid transparent;
      padding: 0px 10px;
      width: 90px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      cursor: pointer;

      &:hover {
        background: #F2F6FC;
      }
    }
    .select {
      border-left: 3px solid #0a76a4;
      background: #F2F6FC;
      font-weight: 800;
      transition: all .3s ease;
    }
  }

</style>
