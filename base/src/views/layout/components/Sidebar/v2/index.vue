<template>
  <div class="menu-box" @mouseleave="handleMouseleave">
    <!-- 第1级菜单 -->
    <div class="menu-container first-menu-container" v-bind:class="{ expand: isExpand }">
      <div class="mask"></div>
      <div class="menu-item first-menu-item" :open-delay="1" v-bind:class="{ active: currentPath.includes(item.path) }" v-for="item in routes" :key="item.value" @mouseover="handleMouseover(item, 1)" @click="handleClickMenu(item)">
        <el-popover transition="el-zoom-in-center" v-if="!isExpand && secondMenu && secondMenu.length === 0" popper-class="custom-popper" placement="right" trigger="hover" :content="item.meta && item.meta.title" :visible-arrow="false">
          <div class="icon-box" slot="reference">
            <pm-icon v-if="item.meta && item.meta.icon" :value="item.meta.icon"></pm-icon>
          </div>
        </el-popover>
        <div v-else class="icon-box" slot="reference">
          <pm-icon v-if="item.showIcon && item.meta && item.meta.icon" :value="item.meta.icon"></pm-icon>
        </div>
        <div class="label-box">
          <span>{{ generateTitle(item.meta && item.meta.title) }}</span>
          <i class="el-icon-arrow-right" v-if="item.children && item.children.length > 0"></i>
        </div>
      </div>
      <div class="btn-expand" @click="handleClickExpand">
        <i class="el-icon-s-unfold"></i>
      </div>
    </div>
    <!-- 第二级菜单 -->
    <div class="menu-container second-menu-container" v-bind:class="{ expand: isExpand, hover: secondMenu && secondMenu.length > 0 }">
      <div class="menu-item second-menu-item" key="all" @mouseover="handleMouseover({ value: 'all' }, 2)">
        <div class="label-box">
          <span>全部</span>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
      <div class="menu-item second-menu-item" v-bind:class="{ active: currentPath.includes(item.path) }" v-for="item in secondMenu" :key="item.value" @mouseover="handleMouseover(item, 2)" @click="handleClickMenu(item)">
        <div class="label-box">
          <span>{{ generateTitle(item.meta && item.meta.title) }}</span>
        </div>
      </div>
    </div>
    <!-- 第三级菜单 -->
    <div
      class="menu-container third-menu-container"
      v-bind:class="{
        expand: isExpand,
        hover: thirdMenu.length > 0 || (currentSecondItem && currentSecondItem.value === 'all'),
        all: currentSecondItem && currentSecondItem.value === 'all',
      }"
    >
      <div v-if="currentSecondItem && currentSecondItem.value === 'all'" class="search-box">
        <el-input v-model="keyWord" prefix-icon="el-icon-search" placeholder="搜索..."></el-input>
      </div>
      <ul v-if="currentSecondItem.value !== 'all'">
        <li class="third-menu-item" v-bind:class="{ active: currentPath.includes(item.path) }" v-for="item in [currentSecondItem]" :key="item.value">
          <div>
            <div class="sub-item" v-for="subItem in item.children" :key="subItem.value">
              <a @click="handleClickMenu(subItem)" v-bind:class="{ active: currentPath.includes(subItem.path), leaf: subItem.isLeaf }">
                <span>{{ generateTitle(subItem.meta && subItem.meta.title) }}</span>
              </a>
            </div>
          </div>
        </li>
      </ul>
      <ul v-else class="all-menu-item">
        <li class="third-menu-item" v-bind:class="{ active: currentPath.includes(route.path) }" v-for="route in filterAllMenu" :key="route.value">
          <div>
            <a class="first-title" @click="handleClickMenu(route)" v-bind:class="{ active: currentPath.includes(route.path), leaf: route.isLeaf }">
              <span>{{ generateTitle(route.meta && route.meta.title) }}</span>
            </a>
            <div class="sub-item-box" v-for="item in route.children" :key="item.value">
              <a class="second-title" @click="handleClickMenu(item)" v-bind:class="{ active: currentPath.includes(item.path), leaf: item.isLeaf  }">
                <span>{{ generateTitle(item.meta && item.meta.title) }}</span>
              </a>
              <div class="sub-item" v-for="subItem in item.children" :key="subItem.value">
                <a class="third-title" @click="handleClickMenu(subItem)" v-bind:class="{ active: currentPath.includes(subItem.path), leaf: subItem.isLeaf }">
                  <span>{{ generateTitle(subItem.meta && subItem.meta.title) }}</span>
                </a>
              </div>
            </div>
          </div>
          <hr />
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { BaseVue } from '@lib'
import { mapGetters } from 'vuex'
import Icon from '@/components/Icon/icon'
import { getLink, treeToList, getTreeListByLeaf, listToTree } from '@util/treeList.js'
import { toQueryObject } from '@util/tools.js'
import { generateTitle } from '@/utils/i18n'
export default {
  name: 'custom-menu',
  mixins: [BaseVue],
  components: { Icon },
  data() {
    return {
      secondMenu: [],
      thirdMenu: [],
      currentFirstItem: {},
      currentSecondItem: {},
      keyWord: '',
      currentPath: [],
    }
  },

  computed: {
    ...mapGetters(['permission_routers', 'sidebar']),
    parentPath() {
      return this.$route.matched[0].path
    },
    currentPath() {
      return this.$route.path.split('/').filter(item => item) || []
    },
    routes() {
      const route = this.permission_routers.find(route => route.path === this.$route.matched[0].path)
      return route && route.children ? route.children.filter(item => !item.hiddenMenu) : route ? [route] : []
    },

    isExpand() {
      return this.sidebar.opened
    },
    menuDisable() {
      return !(this.$route.name === 'dashboard' && this.platform === null)
    },
    theme() {
      return this.$store.state.settings.theme
    },
    filterAllMenu() {
      // if (!this.keyWord) {
      //   return this.routes
      // }
      // 获取所有列表
      const allList = treeToList(this.routes)
      // 获取所有叶子结点
      const leafList = treeToList(this.routes, true)
      // 过滤相应的叶子结点
      const filterList = leafList.filter(item => item.meta && item.meta.title.indexOf(this.keyWord) !== -1)
      // 根据叶子结点对应的链条
      const result = getTreeListByLeaf(filterList, allList)
      // list 转化为树
      return listToTree(result)
    },
  },
  methods: {
    // 用户点击展开按钮
    handleClickExpand() {
      this.$store.dispatch('toggleSideBar')
    },
    /**
     * 用户点击菜单项
     * item, 当前菜单
     */
    handleClickMenu(item) {
      // 特殊处理
      if (item && item.meta && item.meta.resource) {
        const appCode = item.meta.resource.appCode
        const content = JSON.parse(item.meta.resource.content)
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

      if (!(item.children && item.children.length)) {
        const allList = treeToList(this.routes)
        const linkList = getLink(allList, item)
        const result = linkList.map(ele => {
          return ele.path
        })
        this.currentPath = [this.parentPath, ...result]
        this.$router
          .push({
            path: (this.currentPath && this.currentPath.filter(item => item).join('/')) || '/',
            query: toQueryObject(item.query),
          })
          .catch(() => {})
        this.handleMouseleave()
      }
    },
    // 鼠标移入
    handleMouseover(item, level) {
      // hover第一级菜单
      if (level === 1) {
        this.thirdMenu = []
        this.keyWord = ''
        this.secondMenu = (item.children && item.children.filter(ele => !ele.hiddenMenu)) || []
        this.currentFirstItem = item || {}
      }
      // hover第2级菜单，才会赋值，展示3级菜单
      if (level === 2) {
        this.thirdMenu = (item.children && item.children.filter(ele => !ele.hiddenMenu)) || []
        this.currentSecondItem = item || {}
      }
    },
    // 鼠标移开重置
    handleMouseleave() {
      this.keyWord = ''
      this.secondMenu = []
      this.thirdMenu = []
      this.currentFirstItem = {}
      this.currentSecondItem = {}
    },
    generateTitle,
  },
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
<style lang="scss">
.custom-popper {
  width: auto !important;
  padding: 3px 6px !important;
  background-color: rgba(21, 57, 85, 0.73) !important;
  color: #e1e4e6 !important;
  border-radius: 0 !important;
  font-size: 12px !important;
  min-width: auto !important;
  border: none !important;
}
</style>
