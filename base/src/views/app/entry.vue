<template>
  <RemoteComponent
    v-if="page && module && remotePath"
    :page="page"
    :module="module"
    :remote-path="remotePath"
    v-bind="$route.query"
  />
</template>
<script>
import RemoteComponent from '@/components/RemoteComponent/index.vue'
export default {
  name: 'remote-entry',
  components: { RemoteComponent },
  data() {
    return {
      module: '',
      page: '',
      remotePath: '/',
      appName: this.$route.params.appCode || this.$route.query.appName,
    }
  },
  provide() {
    return {
      appName: this.appName
    }
  },
  async created() {
    const { module, page } = this.$route.params
    const { _remoteUrl } = this.$route.query
    this.module = module
    this.page = page
    this.remotePath = _remoteUrl || '/'
  },
}
</script>
