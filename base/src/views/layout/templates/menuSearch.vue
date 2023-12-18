<template>
  <div class="menu-search">
    <el-col>
      <el-autocomplete
      class="inline-input"
      v-model="valueKey"
      :fetch-suggestions="querySearch"
      clearable
      placeholder="搜索菜单名称"
      @select="handleSelect"
      @focus="focused = true"
      @blur="inputBlur"
      >
      <div slot="prefix">
          <i class="el-icon-search" />
      </div>
    </el-autocomplete>
      <div
        v-if="valueKey.length >0 && focused && resultMenus.length"
        class="suggestions"
      >
        <div class="text">猜你想搜</div>
        <el-tag
          v-for="(item,index) of resultMenus"
          :key="index"
          type="info"
          class="m-5"
          size="small"
          style="border-radius: 15px"
          @click="toMenu(item)"
        >
          <el-link :underline="false" type="info">
            {{ item.meta.title }}</el-link>
        </el-tag>
        <hr class="line">
        <el-tree
          ref="tree"
          class="filter-tree"
          :data="menusTree"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span v-if="node.isLeaf || (data.parentId ==='root' && data.meta && data.meta.resource )" class="weight700">
              <pm-icon
                v-if="data.meta && data.meta.icon"
                :value="data.meta.icon"
              />

              {{ prefix(data.meta.title)
              }}<span v-if="data.meta.title.indexOf(valueKey) !== -1" class="highlight">{{ valueKey }}</span>{{ suffix(data.meta.title) }}
              <i class="el-icon-right" style="font-size: 14px;font-weight: 700;" />
            </span>
            <span v-else>
              <pm-icon
                v-if="data.meta && data.meta.icon"
                :value="data.meta.icon"
              />
              {{ data.meta.title }}
            </span>
          </span>
        </el-tree>
      </div>
      <div
        v-if="valueKey.length > 0 && focused && resultMenus.length == 0"
        class="suggestions"
      >
        <div class="nomessage-text">无匹配结果</div>
      </div>
    </el-col>
  </div>
</template>
<script>
import { BaseVue } from '@lib'
import { replaceValueByUser, toQueryObject } from '@util/tools.js'
import { mapGetters } from 'vuex'
import { localStore } from '@/utils/sessionStore'

export default {
  name: 'menu-search',
  components: {},
  mixins: [BaseVue],
  props: {},
  computed: {
    ...mapGetters(['permission_routers']),
    appId() {
      return (this.$route.query ? this.$route.query.appId : null) || null
    },
    permissionRoutersMenus() {
      return this.permission_routers.filter(
        (menu) =>
          menu.isNewWindowOpen ||
          (!menu.hidden && menu.children && menu.children.length > 0)
      )
    },
    menusTree() {
      return this.permissionRoutersMenus
    },
  },
  data() {
    return {
      valueKey: '',
      focused: false,
      resultMenus: [],
      defaultProps: {
        children: 'children',
      },
      commonMenu:[]
    }
  },
  watch: {
    valueKey: {
      handler(val) {
        if (val && val.length > 0) {
          this.resultMenus = this.findMenuWithKey(val)
          setTimeout(() => {
            this.$refs.tree && this.$refs.tree.filter(val)
          }, 500)
        }
      },
    },
    focused: {
      immediate: true,
      handler(val) {
        if (val) {
          setTimeout(() => {
            this.$refs.tree && this.$refs.tree.filter(this.valueKey)
          }, 300)
        }
      },
    },
  },
  created() {
    this.commonMenu = localStore.get('commonMenu') || []
  },
  methods: {
    querySearch(queryString, cb) {
        const results = queryString ? this.commonMenu.filter(this.createFilter(queryString)) : this.commonMenu;
        cb(results);
    },
    createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
    },
    handleSelect(item) {
      setTimeout(() => {
        this.focused = true
      }, 200)
    },
    saveCommonMenu(){
      localStore.set('commonMenu',this.commonMenu)
    },
    inputBlur() {
      setTimeout(() => {
        this.focused = false
      }, 200)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.hiddenMenu === undefined && data.meta.title.indexOf(value) !== -1
    },
    handleNodeClick(data, node) {
      if (data.parentId === 'root') {
        if (data.isNewWindowOpen) {
          this.newWindowOpen(data)
        } else {
          this.toMenu(data)
        }
      }
      // 叶子结点
      if (!data.children) {
        this.toMenu(data)
      }
    },
    findMenuWithKey(keyword) {
      const resultArray = []
      for (const item of this.permissionRoutersMenus) {
        this.findObjectsWithKeyword(item, keyword, resultArray)
      }
      return resultArray.filter(item => ((item.parentId === 'root' && item.meta && item.meta.resource) || !item.children) && item.hiddenMenu === undefined)
    },
    findObjectsWithKeyword(obj, keyword, result) {
      if (obj.meta && obj.meta.title && obj.meta.title.includes(keyword)) {
        result.push(obj)
      }
      if (obj.children && obj.children.length > 0) {
        for (const child of obj.children) {
          this.findObjectsWithKeyword(child, keyword, result)
        }
      }
    },
    toMenu(menu) {
      if(this.commonMenu.findIndex(m=> m.id === menu.id)==-1){
        this.commonMenu.push({...menu,value:menu.meta.title})
      } 
      this.saveCommonMenu()
      if (menu.meta.resource) {
        const content = JSON.parse(menu.meta.resource.content)
        const { openType } = content
        if (openType === 'process') {
          this.openProcess(menu)
        } else {
          this.toRoute(menu)
        }
      }
    },
    toRoute(item) {
      let menuPath = ''
      const resultArray = []
      this.findRoutePaths(
        this.permissionRoutersMenus,
        item.name,
        '',
        resultArray
      )
      menuPath = resultArray.length ? resultArray[0] : ''
      const query = item.query ? toQueryObject(item.query) : null
      menuPath = item.parentId === 'root' ? menuPath + '/index' : menuPath
      menuPath && this.$router.push({ path: menuPath, query: query })
      this.focused = false
    },
    findRoutePaths(data, name, currentPath = '', result = []) {
      for (const item of data) {
        const newPath = currentPath + item.path
        if (item.name === name) {
          result.push(newPath)
        }
        if (item.children && item.children.length > 0) {
          this.findRoutePaths(item.children, name, newPath + '/', result)
        }
      }
    },
    openProcess(menu) {
      if (menu.meta.resource) {
        const appCode = menu.meta.resource.appCode
        const content = JSON.parse(menu.meta.resource.content)
        const { processDefName } = content
        const frameworkWin = this.$router.resolve({
          path: '/module/bfp/page/bfp_proc_framework',
          query: {
            processDefName,
            pageType: 'start',
            appName: appCode
          }
        })
        window.open(frameworkWin.href, '_blank')
      }
    },
    newWindowOpen(menu) {
      if (menu.meta.resource) {
        const content = JSON.parse(menu.meta.resource.content)
        const { openType, url, params } = content
        if (openType === 'iframe') {
          let currentUrl = ''
          if (params) {
            if (params.indexOf('${') !== -1) {
              const curParams = replaceValueByUser(params)
              currentUrl = `${url}${curParams}`
            } else {
              currentUrl = `${url}${params}`
            }
          } else {
            currentUrl = url
          }
          window.open(currentUrl)
          this.$router.back(-1)
        }
      }
    },
    prefix(value) {
      const array = value.split(this.valueKey)
      return array[0] || ''
    },
    suffix(value) {
      const array = value.split(this.valueKey)
      return array[1] || ''
    },
  },
}
</script>

<style lang="scss" scoped>
.menu-search {
  .el-icon-search {
    padding-left: 10px;
  }
  .suggestions {
    z-index: 9999;
    background: #fff;
    width: 430px;
    min-height: 100px;
    max-height: calc(100vh - 60px);
    overflow: auto;
    position: absolute;
    top: 40px;
    border: 1px solid #eaf0ff;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3); /* 添加阴影效果 */

    border-radius: 6px;
    padding: 0.4rem;
    list-style-type: none;

    &.align-right {
      right: 0;
    }
    .text {
      font-size: 12px;
      color: #808383;
      margin-left: 10px;
    }
    .line {
      border: none;
      height: 1px;
      background-color: #dcdfe6; /* 设置线的颜色 */
    }
    .nomessage-text {
      font-size: 14px;
      text-align: center;
      font-weight: 500;
      color: #909399;
      padding-top: 25px;
    }
  }
  .highlight {
    color: #1890ff;
  }
  .weight700 {
    font-weight: 700;
  }
}
.suggestions .el-tag:hover{
  color: #3B69B6;
  border-color: #c4d2e9;
  background-color: #ebf0f8;
}
.suggestions .el-tag:hover .el-link.el-link--info{
  color: #3B69B6;
} 
</style>
