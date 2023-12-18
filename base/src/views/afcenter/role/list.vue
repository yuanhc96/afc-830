<template>
    <PmNavigation ref="nav" :routes="routes" :allow-click="true" :cacheInclude="cache" :noBackInclude="noBackInclude"/>
</template>
<script>
import RoleDetail from "./detail.vue"
import RoleList from "./index.vue"
import Business from './tabs/business.vue'
import System from './tabs/system.vue'
export default {
  components: { RoleList, RoleDetail },
  props:{
    currentAppId:{
      type:String,
      default:""
    }
  },
  data() {
    return {
      routes: [
        {
          title: "角色管理",
          name:"role",
          component: RoleList,
          redirect:System,
          props:{
              active:'platform',
              currentAppId:this.currentAppId || null,
          },
          children:[
            {
              title: "角色详情",
              name: "detail1",
              component: RoleDetail
            },
            {
              title: "业务对象",
              name:"businessObject",
              component: RoleList,
              redirect:Business,
              props:{
                active:'businessObject'
              },
              children: [
                  {
                    title: "角色详情",
                    name: "detail2",
                    component: RoleDetail
                  }
              ]
            }
          ]
        },
      ],
      cache:['role','businessObject'],
      noBackInclude:['businessObject']
    }
  }
}
</script>
