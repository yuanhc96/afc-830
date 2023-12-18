<template>
  <div :class="{'sub-body':true, 'position-relative':true,'ml-20':isOneApp ? true : false }">
    <el-tabs v-model="selectTab" :before-leave="leaveTab">
      <el-tab-pane name="app" label="应用信息">
        <el-scrollbar>
          <Form style="height:100%;margin-left:-10px" :data="data" @success="search" />
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane name="res" label="资源管理" lazy>
        <el-scrollbar>
          <ResourceManagement :select-tab="selectTab" :business-obj-id="businessObjId" :app-id="data && data.id" :data="data" v-on="$listeners" />
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane name="obj" label="业务对象管理" lazy>
        <el-scrollbar>
          <ObjectManagement :select-tab="selectTab" :data="data" v-on="$listeners" @object_res="objectres" />
        </el-scrollbar>
      </el-tab-pane>
      <!-- <el-tab-pane name="role" label="角色管理" lazy>
        <el-scrollbar>
          <roleMain :current-app-id="data && data.id" style="margin-left:-10px" />
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane name="menu" label="菜单管理" lazy>
        <el-scrollbar>
          <MenuMain tab-layout-class="pb-20 pl-10 pr-0" mark="pc" :current-app-id="data && data.id" tree-height="calc(100vh - 160px)" style="margin-left:-20px" />
        </el-scrollbar>
      </el-tab-pane> -->
    </el-tabs>
    <PmFormDialog
      width="1024px"
      :title="`编辑应用`"
      :dialog-visible.sync="dialogVisible"
    >
      <Form slot="form" :form-data="data" @success="search" />
    </PmFormDialog>
  </div>
</template>
<script>
import { AppController } from '@controller'
import { BaseVue } from '@lib'
import MenuMain from '../menu/index.vue'
import roleMain from '../role/list.vue'
import Form from './form.vue'
import ObjectManagement from './object/index'
import ResourceManagement from './resource/index'
import oneApp from './oneApp.js'
export default {
  name: 'app-detail',
  components: { ResourceManagement, ObjectManagement, Form, roleMain, MenuMain },
  mixins: [BaseVue,oneApp],
  props: {
    data: {
      default: () => {},
    },
  },
  data() {
    return {
      dialogVisible: false,
      selectTab: 'app',
      businessObjId: null,
      menuTab: 'pc',
    }
  },
  computed: {
    appId() {
      return this.$route.query ? this.$route.query.appId : null
    }
  },
  watch: {
    'data.tab': {
      deep: true,
      handler(val) {
        this.selectTab = val
      }
    }
  },
  async mounted() {
    if (!this.data) {
      this.isOneApp = true
      this.data = await this.findApp()
    }
    this.selectTab = this.data.tab
  },
  methods: {
    objectres(data) {
      console.log(data, 'detail-data')
      this.selectTab = data.tab
      this.data.id = data.id
      this.businessObjId = data.businessObjId
    },
    openEdit(data) {
      this.dialogVisible = true
    },
    leaveTab(activeName, oldActiveName) {
      console.log(activeName, 'activeName')
      this.selectTab = activeName
    }

  },
}
</script>
<style lang="scss" scoped>
  ::v-deep .el-tabs__header{
    margin-bottom:0px!important;
  }
  ::v-deep .sub-body{
    position: relative;
    margin-left: -5px;
     ::v-deep .el-scrollbar__wrap {
     overflow-x: hidden;
     max-height: calc(100vh - 95px)!important;
    }
  }
    ::v-deep .el-scrollbar__wrap {
     overflow-x: hidden;
     max-height: calc(100vh - 95px)!important;
    }
  ::v-deep .secondary-menu {
  height: calc(100vh - 95px) !important;
 }
</style>
