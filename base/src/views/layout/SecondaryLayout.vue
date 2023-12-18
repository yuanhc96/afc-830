<template>
  <router-view v-bind="$attrs" v-if="isExist" />
</template>
<script>

export default {
  name: 'secondary-layout',
  computed:{
    isExist(){
      return this.$store.state.settings.tagsView !== 'multiple' ||  this.$store.state.tagsView.visitedViews.find(view => view.name === this.code)
    }
  },
  data() {
    return {
      code: '',
    }
  },
  created() {
    this.code = this.$route.name
  },
}
</script>
