<template>
  <div>
    <div class="hamburger in" v-if="isActive" :src="hamSrc2" alt="" @click="toggleClick">
       <i  class="el-icon-arrow-left"></i>
    </div>
    <div class="hamburger out" v-else :src="hamSrc1" alt="" @click="toggleClick">
        <i class="el-icon-arrow-right"></i>
    </div>
  </div>
</template>

<script>
import hamSrc1 from '@static/images/hamSrc1.png'
import hamSrc2 from '@static/images/hamSrc2.png'
export default {
  name: 'hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      hamSrc1,
      hamSrc2
    }
  }
}
</script>

<style scoped lang="scss">
  $iconWidth: 18px;
  .hamburger {
    display: inline-block;
    cursor: pointer;
    position: fixed;
    width: $iconWidth;
    height: $iconWidth;
    top: 45%;
    background: var(--menuItemActiveBr);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    cursor: pointer;
    /* width: 16px; */
    /* height: 45px; */
    /* transform: rotate(180deg); */
    /* transition: 0.38s; */
    /* transform-origin: 50% 50%; */
  }
  .in {
    margin-left: -$iconWidth;
  }
  .out {
    margin-left: -$iconWidth;
  }

  /* .hamburger.is-active {
    transform: rotate(0deg);
  } */
</style>
