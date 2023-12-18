<template>
  <HighcodeEntry v-if="isExist"  v-bind="$attrs" v-on="$listeners"/>
</template>
<script>
import HighcodeEntry from './highcodeEntry.vue'
export default {
  name: 'high-code-entry-router',
  components: { HighcodeEntry },
  computed:{
    isExist() {
     return this.$store.state.settings.tagsView !== 'multiple' ||  this.$store.state.tagsView.visitedViews.find(view => view.name === this.code)
    },
  },
  created() {
    this.code = this.$route.name
  },
  data() {
    return {
      code: ''
    }
  },
}
</script>
