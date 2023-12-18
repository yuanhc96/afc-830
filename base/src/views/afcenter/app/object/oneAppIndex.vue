<template>
    <PmNavigation ref="nav"  :routes="routes" :allow-click="true" :cacheInclude="[]"/>
</template>
<script>
import ObjectList from './index.vue'
import ObjectDetail from '../object/detail.vue'
import Resource from "../resource/index.vue"
export default {
  name: 'object-index',
  components: {ObjectList,ObjectDetail,Resource},
  data() {
    return {
      routes: [
        {
            title: "业务对象",
            name: "detail",
            component: ObjectList,
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
      ],
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