<template>
  <div class="menu-wrapper custom-menu-wrapper">
    <template v-for="item in routes">
      <el-submenu v-if="item && item.children && item.children.length > 0" :key="item.path" :index="item.path">
        <template slot="title">
          <pm-icon v-if="item.meta && item.meta.icon" :value="item.meta.icon"></pm-icon>
          <span class="span-over" style="margin-left: -1px" :title="item.meta && item.meta.title">{{ item.meta && item.meta.title }}</span>
        </template>
      
        <sidebar-item :parent-path="(parentPath ? parentPath + '/' : '') + item.path" :routes="item.children" :collapse="isCollapse" />
      </el-submenu>
      <el-menu-item v-else-if="!item.hiddenMenu && item.alwaysShow" :key="item.name" :route="getQuery(item)" :index="(parentPath ? parentPath + '/' : '') + item.path" :class="{ 'border-line': item.showIcon }" @click="nodeClick(item)">
        <pm-icon v-if="item.showIcon && item.meta && item.meta.icon" :value="item.meta.icon"></pm-icon>
        <span v-else class="placeholder" />
        <span v-if="item.meta && item.meta.title" class="span-over" slot="title" :title="generateTitle(item.meta.title)">{{ generateTitle(item.meta.title) }}</span>
      </el-menu-item>
    </template>
  </div>
</template>
<script>
import Icon from '@/components/Icon/icon'
import { generateTitle } from '@/utils/i18n'
import { BaseVue } from '@lib'
import { toQueryObject } from '@util/tools.js'

export default {
  name: 'sidebar-item',
  components: { Icon },
  mixins: [BaseVue],
  props: {
    routes: {
      type: Array,
      default: () => [],
    },
    parentPath: {
      type: String,
      default: '',
    },
    collapse: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},
  methods: {
    hasOneShowingChildren(children) {
      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    },
    getQuery(menu) {
      return menu.query ? { path: (this.parentPath ? this.parentPath + '/' : '') + menu.path, query: toQueryObject(menu.query) } : null
    },
    nodeClick(menu) {
      this.openProcess(menu)
    },
    openProcess(menu) {
      if (menu.meta.resource) {
        const appCode = menu.meta.resource.appCode
        const content = JSON.parse(menu.meta.resource.content)
        const { openType, processDefName } = content
        if (openType === 'process') {
          const frameworkWin = this.$router.resolve({
            path: '/module/bfp/page/bfp_proc_framework',
            query: {
              processDefName,
              pageType: 'start',
              appName: appCode,
            },
          })
          window.open(frameworkWin.href, '_blank')
        }
      }
    },
    generateTitle,
  },
}
</script>
<style lang="scss">
//  全局样式
.custom-menu-wrapper {
  padding: 0 17px;
  .el-menu-item {
    margin-top: 7px;
    border-radius: 6px;
    &:first-child {
      margin-top: 0;
    }
  }
  .el-tooltip {
    padding: 0 !important;
  }
  .el-submenu__title:hover,.el-menu-item:hover {
    color: var(--menuItemActiveText) !important;
    i {
      color: var(--menuItemActiveText) !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.el-menu--collapse .el-submenu > .el-submenu__title span {
  height: 0;
  width: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
}
.placeholder {
  display: inline-block;
  width: 16px;
  height: 16px;
}
.span-over {
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 10px !important;
  margin-top: -2px;
  width: auto;
  display: inline-block;
}
</style>
