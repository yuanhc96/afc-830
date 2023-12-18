<template>
  <div>
    <el-tabs v-model="selectTab" >
      <el-tab-pane name="detail" label="基本信息">
        <From class="mt-10"  :form-data="object"  @success="search" />
      </el-tab-pane>
      <el-tab-pane name="resourse" label="资源管理">
        <ResourceManagement :selectTab="selectTab" :businessObjId="businessObjId" :appId="data.data.appId" :data="object"/>
      </el-tab-pane>
      <el-tab-pane name="menu" label="菜单管理">
        <ObjectMenuManager :businessObjId="businessObjId" :appId="data.data.appId" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ResourceManagement from "../resource/index.vue";
import From from "./from.vue";
import ObjectMenuManager from "./menu/index.vue";
export default {
  components: { ResourceManagement,From,ObjectMenuManager},
  props: {
    data: {
      default: () => {},
    },
  },
  data() {
    return {
      dialogVisible: false,
      selectTab:'detail',
      businessObjId:null,
      object:null,
    };
  },
  created(){
    this.selectTab=this.data.tab
    this.object=this.data.data
    this.businessObjId=this.data.businessObjId
  },
};
</script>
<style lang="scss" scoped>
  ::v-deep .el-tabs__header{
    margin-bottom:0px!important;
  }
</style>