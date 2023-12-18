<template>
  <PmSecondaryMenu :offset-height="-20" :show-title="false" :right-title="false" class="pl-20">
    <div slot="left-body">
      <div class="pr-10">
        <el-tabs v-model="mark" class="pm-switch mt-8 pr-5">
          <el-tab-pane label="PC端" name="pc" />
          <el-tab-pane label="移动端" name="mobile" />
        </el-tabs>
        <Tree :key="mark + 1" :style="`height:${treeHeight}`" class="mt-10" :mark="mark" @selectNode="selectNode" />
      </div>
    </div>
    <div slot="right-body">
      <div v-if="menu" :key="mark + 2">
        <el-tabs v-model="tab" :class="tabLayoutClass">
          <el-tab-pane v-if="menu.id !=='root' && menu.id !=='appRoot'" name="info" label="菜单信息">
            <Form class="pt-20" :menu="menu" :show-footer="true" />
          </el-tab-pane>
          <el-tab-pane v-if="menu && menu.isLeaf==='0'" name="list" lazy label="子菜单列表">
            <List :mark="mark" :menu="menu" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </PmSecondaryMenu>

</template>
<script>
import Form from './form.vue'
import List from './list.vue'
import SelectUrl from './selectUrl.vue'
import Tree from './tree.vue'
export default {
  name: 'menu-menu-manager',
  components: {
    Tree,
    List,
    Form,
    SelectUrl
  },
  props: {
    mark: '',
    currentAppId: '',
    treeHeight: {
      type: String,
      default: 'calc(100vh - 120px);'
    },
    tabLayoutClass: {
      default: 'pb-20 pl-10 pr-20'
    }
  },
  provide() {
    return {
      currentAppId: this.currentAppId
    }
  },
  data() {
    return {
      menu: null,
      tab: 'info',
      dialogVisible: false
    }
  },
  watch: {
    menu(val) {
      if (val.id === 'root' || val.id === 'appRoot') {
        this.tab = 'list'
      } else {
        this.tab = 'info'
      }
    },
  },
  methods: {
    selectNode(node) {
      this.menu = node
    },
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .pm-switch .el-tabs__item{
    width:50%;
 }
 ::v-deep .secondary-menu .left .body{
    border-top:none!important;
 }
</style>
