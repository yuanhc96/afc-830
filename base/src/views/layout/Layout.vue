<template>
  <Full v-if="$route.query._full"/>
  <Frame v-else/>
</template>
<script>
import Frame from './Frame.vue'
import Full from './Full.vue'
export default {
  components:{
    Frame,
    Full,
  }
}
</script>