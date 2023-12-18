<template>
  <div class="navbar">
    <!-- <TagsView :isMultiple="settings.tagsView === 'multiple'"/> -->
    <!-- <breadcrumb v-else-if="!isFullScreen" class="breadcrumb-container" />
    <div v-else class="fullscreen-header" @click="toHome">
      <span class="icon"><svg-icon icon-class="devops_logo_1" /></span>
      <span v-if="!isCollapse" class="title">{{ VueConfig.title }}</span>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Vue from 'vue'
import { BaseVue} from '@lib'
import Breadcrumb from '@/components/Breadcrumb'
import ErrorLog from '@/components/ErrorLog'
import TagsView from './TagsView.vue'
import Screenfull from '@/components/Screenfull'
export default {
  components: {
    Breadcrumb,
    TagsView,
    ErrorLog,
    Screenfull,
  },
  mixins: [BaseVue],
  computed: {
    ...mapGetters(['sidebar', 'name', 'avatar', 'roles', 'pageModel','settings']),
    isAdmin() {
      return ['sysadmin'].some(role => this.$store.getters.roles.some(r1 => r1 === role))
    },
    isFullScreen() {
      return this.pageModel === 'fullscreen'
    },
    hamburgarDisable() {
      return this.$route.name === 'dashboard' && this.currentPlatformName === null
    }
  },
  mounted() {
    if (this.hamburgarDisable) {
      // this.$store.dispatch('closeSideBar',false)
    }
  },
  data() {
    return {
      VueConfig: Vue.config,
    }
  },
  methods: {
    goSingleLoginPage(redirectUrl) {
      window.location.href = redirectUrl
    },
  }
}
</script>
<style lang="scss" scoped>
.navbar {
  line-height: 1;
  background: #ffffff;
}
</style>
