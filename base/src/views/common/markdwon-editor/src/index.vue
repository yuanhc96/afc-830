<template>
  <div>
    <mavon-editor v-model="value" style="height: 100%" />
  </div>
</template>

<script>
export default {
  name: 'markdown-editor',
  props: {
    value: {}
  }
}
</script>

<style scoped>

</style>
