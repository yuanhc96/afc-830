<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" v-if="item.meta.title" :key="item.path">
        <span v-if="item.redirect === 'noredirect' || index == levelList.length - 2" class="no-redirect">{{ generateTitle(item.meta.title) }}</span>
        <router-link v-else :to="item.redirect || item.path">{{ generateTitle(item.meta.title) }}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { generateTitle } from '@/utils/i18n'

export default {
  data() {
    return {
      levelList: null,
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    },
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    generateTitle,
    getBreadcrumb() {
      const matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      //      if (first && first.name !== 'dashboard') {
      //        matched = [{ path: '/dashboard', meta: { title: 'dashboard' } }].concat(matched)
      //      }
      this.levelList = matched
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 35px;
    margin-left: 10px;
    .no-redirect {
      color: #1B2737;
      cursor: text;
    }
    .router-link-active {
      color: #1B2737;
    }
  }
</style>
