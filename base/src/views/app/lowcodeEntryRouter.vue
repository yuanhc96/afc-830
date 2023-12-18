<template>
 <LowcodeEntry v-if="isExist" v-bind="$attrs" v-on="$listeners"/>
</template>
<script>
import LowcodeEntry from './lowcodeEntry.vue'
export default {
  name: 'low-code-entry-router',
  components: { LowcodeEntry },
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
