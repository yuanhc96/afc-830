<template>
  <Portal />
</template>

<script>
import { loadRemoteComponent } from '@/utils/loadRemote.js'
import store, { localStore } from '@util/sessionStore'

export default {
  name: 'portal-index',
  components: { Portal: () => {
    return loadRemoteComponent({
      url: './portal/remoteEntry.js',
      scope: 'portal',
      module: `./index`,
    })
  } },
  mounted() {
    // store.set('platform', 'portal')
    this.$store.commit('SET_PLATFORM', 'portal')
    localStore.set('isobjectMenu', false)
  }

}
</script>

<style scoped>

</style>
