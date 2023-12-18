<template>
  <div style="position:relative;height:50px;overflow:visible;padding-left:15px;padding-right:15px;">
    <div @click="toLeft" class="btn left" v-show="scrollLeft > 20 "><i class="el-icon-arrow-left"></i></div>
    <div id="h-scroll-root">
      <div class="inner" id="h-scroll-inner" @wheel="onwheel">
        <slot />
      </div>
    </div>
    <div @click="toRight"  class="btn right" v-show="showRightBtn"><i class="el-icon-arrow-right"></i></div>
  </div>
</template>
<script>
import { debounce } from 'lodash';
export default {
  mounted() {
     window.addEventListener('resize', debounce(this.onwheel, 100))    
     this.onwheel()
  },
  data() {
    return {
        scrollLeft: 0,
        wi : 0,
        innerWidth:0,
        showRightBtn: false,
    }
  },
  methods: {
    toLeft(){
        let table = document.getElementById("h-scroll-root");
        table.scrollLeft = 0;
        this.scrollLeft = 0
        this.onwheel()
    },
    toRight(){
        let element = document.getElementById("h-scroll-inner");
        let table = document.getElementById("h-scroll-root");
        this.innerWidth =
          element.style.width ||
          element.clientWidth ||
          element.offsetWidth ||
          element.scrollWidth;
        let right = this.innerWidth - table.offsetWidth;
        table.scrollLeft = right
        this.scrollLeft = right
        this.showRightBtn = false
    },
    onwheel(event) {
        let element = document.getElementById("h-scroll-inner");
        let table = document.getElementById("h-scroll-root");
        this.innerWidth =
          element.style.width ||
          element.clientWidth ||
          element.offsetWidth ||
          element.scrollWidth;
        let right = this.innerWidth - table.offsetWidth;
        if(event){
            if (table.scrollLeft < right && event.deltaY > 0) {
                event.preventDefault();
                let left = table.scrollLeft + 50;
                table.scrollLeft = left;
            }
            if (table.scrollLeft > 0 && event.deltaY < 0) {
                event.preventDefault();
                let left = table.scrollLeft - 50;
                table.scrollLeft = left;
            }
        }
        this.scrollLeft = table.scrollLeft
        if(table.scrollLeft + 15 >= right){
            this.showRightBtn = false
        }else{
            this.showRightBtn = true
        }
    }
  },
};
</script>
<!-- <style>
.fade-enter-active, .fade-leave-active {
    transition: opacity .3s
}
.fade-enter-to, .fade-leave-to {
    opacity: 0
}
</style> -->
<style lang="scss" scoped>

.btn {
position: absolute;
  top: 0px;
  width: 15px;
  text-align: center;
  height: 50px;
  z-index:100;
  transition: all .3 ease;
  line-height: 50px;
  color:#fff;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all .3s ease;
  &:hover{
    background: rgba(255, 255, 255, 0.5);
  }
  &.left{
    left: 0px;
  }
  &.right{
    right: 0px;
  }
}

#h-scroll-root {
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
}
.inner {
  width: max-content;
  height: 52px;
}
</style>