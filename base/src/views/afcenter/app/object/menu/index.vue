<template>
  <PmSecondaryMenu :offset-height="90" :show-title="false" :right-title="false" style="height: calc(100vh - 100px);">
    <div slot="left-body">
      <Tree class="mt-10" :app-id="appId" :business-obj-id="businessObjId" @selectNode="selectNode" />
    </div>
    <div slot="right-title" />
    <div slot="right-body" class="pl-10">
      <div v-if="menu">
        <el-tabs v-model="tab">
          <el-tab-pane v-if="menu.id !=='objectMenu'" name="info" label="菜单信息">
            <Form :app-id="appId" :business-obj-id="businessObjId" class="pt-10 pr-20" :menu="menu" :show-footer="true" />
          </el-tab-pane>
          <el-tab-pane v-if="menu && menu.isLeaf==='0'" name="list" lazy label="子菜单列表">
            <List :business-obj-id="businessObjId" :app-id="appId" style="margin-left: -10px;" class="mr-10" :menu="menu" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </PmSecondaryMenu>

</template>
<script>
import Tree from './tree.vue'
import List from './list.vue'
import Form from './form.vue'
import SelectUrl from './selectUrl.vue'
export default {
  name: 'object-menu-manager',
  components: {
    Tree,
    List,
    Form,
    SelectUrl
  },
  props: {
    businessObjId: {
      type: String,
      default: null,
    },
    appId: {
      type: String,
      default: null,
    },
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
      if (val.id === 'objectMenu') {
        this.tab = 'list'
      } else {
        this.tab = 'info'
      }
    }
  },
  methods: {
    selectNode(node) {
      this.menu = node
    },
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-tabs--card .el-tabs__item {
    height: 40px !important;
    line-height: 40px !important;
}
  </style>
