<template>
  <WujieVue v-if="url" :name="url" :url="url" width="100%" height="100%" 
    :afterMount="afterMount"/>
</template>
<script>
export default {
  name:'wujie-router',
  props:{
    url:{
      default: ''
    }
  },
  created() {
    const interval = setInterval(() => {
        if (this.$route.meta.remote) { // vue-router 无法监听 props变化 ，故这里手动监听meta.remote属性
          const {remotePath, url } = this.$route.meta.remote
          this.url = remotePath + '#' + url
          clearInterval(interval)
        }
      }, 5)
  },
  data() {
    return {
      afterMount:(appWindow)=>{
        console.log('+++++++++++++', appWindow)
      }
    }
  },
};
</script>
  