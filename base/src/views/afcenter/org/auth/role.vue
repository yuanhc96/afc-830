<template>
  <div>
    <Role ref="role" :dialogqueryFun="dialogqueryFun" :queryFun="queryFun" :deleteFun="deleteFun" :addFun="addFun" v-bind="$attrs" v-on="$listeners"></Role>
  </div>
</template>

<script>
import  { OrgController} from "@controller";
import Role from "@/views/afcenter/user/components/roleComponent/index"
export default {
  name: "",
  inheritAttrs:false,
  components: {Role},
  props: {
    tree:{
      default:function(){
        return {}
      }
    }
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  mounted() {},
  methods: {
      async queryFun(param){
         const resp =  await this.$refs['role'].dispatch(OrgController.queryResourceInOrg,{resourceType:'role',...param}) 
         return resp
      },
      async dialogqueryFun(param){
         const nodeArr = this.tree.getNodePath(this.$refs['role'].orgData.id)
         let orgId = ""
         if(nodeArr.length){
           orgId = nodeArr[0].id
         }
         const payload = {...param,orgId}
         const resp =  await this.$refs['role'].dispatch(OrgController.queryRolesToTree,payload) 
         return resp
      },
      async deleteFun(param){
          
          param.resources.forEach(i=>{
                i.types="role"
            })
          const resp = await this.$refs['role'].dispatch(OrgController.deleteResourceInOrg,{...param})
          return resp
      },
      async addFun(param){
        //orgId
        //   const resources =[{
        //       id:"", 
        //       types:"role"
        //   }]
            param.resources.forEach(i=>{
                i.types="role"
            })
          const resp = await this.$refs['role'].dispatch(OrgController.createResourceInOrg,{...param})
          return resp
      }
  },
};
</script>
<style></style>
