<template>
  <section
    id="appMain"
    class="app-main"
    :style="`height:calc(100vh - ${
      isFullScreen || !showSidebar ? '52' : '51'
    }px);z-index: ${isNormal ? 'auto' : '0'}`"
  >
      <PmKeepAlive
        :include="includes"
        :autoClear="true"
        :cacheKeys="cacheKeys"
      >
      <router-view :key="key" />
    </PmKeepAlive>
    <hamburger
      v-show="showSidebar && isNormal"
      class="hamburger-container"
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
    />
  </section>
</template>

<script>
import Hamburger from '@/components/Hamburger'
import PmKeepAlive from '@/components/KeepAlive/index'
import { mapGetters } from 'vuex'
export default {
  name: 'app-main',
  components: { Hamburger , PmKeepAlive},
  computed: {
    ...mapGetters(['sidebar', 'pageModel']),
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    },
    isNormal() {
      return this.$store.state.settings.menuMode === 'normal'
    },
    isFullScreen() {
      return this.pageModel === 'fullscreen'
    },
    cacheKeys() {
      return this.$store.state.tagsView.visitedViews.map(view => view.path)
    },
    includes(){
      if(this.$store.state.settings.tagsView === 'multiple') {
        return [
          ...this.cachedViews,
          'high-code-entry-router',
          'low-code-entry-router',
          'secondary-layout',
          'wujie-router',
        ]
      }else{
        return []
      }
    }
  },
  props: {
    showSidebar: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
  },
}
</script>
<style>
.app-main {
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  float: left;
  margin: 0px;
  background: #ffffff;
  /* border: 1px solid #DADEE4; */
  position: relative;
}
</style>
