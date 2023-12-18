<template>
  <div class="pb-20 pl-20 pr-20 padding">
    <el-tabs v-model="tab" @tab-click="handleClick">
      <el-tab-pane name="template" label="模版管理">
        <Template />
      </el-tab-pane>
      <el-tab-pane name="model" label="模型管理">
        <Model />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { BaseVue, List } from '@lib'
import Template from './tabs/template'
import Model from './tabs/model'
export default {
  name: 'role',
  components: {
    Template, Model
  },
  mixins: [BaseVue, List],
  props: {
    active: {
      type: String
    },
    currentAppId:{
      type: String,
      default:""
    }
  },
  data() {
    return {
      tab: 'template',
    }
  },

  methods: {

  }
}
</script>
<style lang='scss' scoped>
::v-deep .secondary-menu .left {
  height: calc(100vh - 135px) !important;
}
.padding{
  margin-left: -5px !important;
}
</style>
