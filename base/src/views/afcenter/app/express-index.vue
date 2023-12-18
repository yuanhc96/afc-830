<template>
    <PmNavigation ref="nav"  :routes="routes" :allow-click="true" :cacheInclude="[]"/>
</template>
<script>
import AppDetail from "./detail.vue"
import AppList from "./list.vue"
import ObjectDetail from './object/detail.vue'
import Resource from "./resource/index.vue"
export default {
  components: { AppList, AppDetail ,ObjectDetail,Resource},
  data() {
    return {
      routes: [
       
            {
              title: "应用详情",
              name: "detail",
              component: AppDetail,
              children: [
                {
                  title: "业务对象编辑",
                  name: "object",
                  component: ObjectDetail,
                },
                {
                  title: "应用资源编辑",
                  name: "resource",
                  component: Resource,
                },
              ],
            },
          ]
      }
  },
  mounted() {
    this.init()
  },
  methods: {

    init() {
     
    },
  },
}
</script>
<style lang="scss" scoped>
  ::v-deep .el-tabs--card .el-tabs__item{
    height:28px;
    line-height:28px;
  }
</style>