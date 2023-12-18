<template>
  <div>
    <Position :dialogqueryFun="dialogqueryFun" ref="position" :queryFun="queryFun" :deleteFun="deleteFun" :addFun="addFun" v-bind="$attrs" v-on="$listeners"></Position>
  </div>
</template>

<script>
import Position from "@/views/afcenter/org/employee/position/index"
import  { OrgController} from "@controller";
export default {
  name: "",
  components: {Position},
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
         const resp =  await this.$refs['position'].dispatch(OrgController.queryResourceInOrg,{resourceType:'position',...param}) 
         return resp
      }, 
    async dialogqueryFun(param){
         const nodeArr = this.tree.getNodePath(this.$refs['position'].orgData.id)
         let orgId = ""
         if(nodeArr.length){
           orgId = nodeArr[0].id
         }
         const payload = {...param,orgId}
         const resp =  await this.$refs['position'].dispatch(OrgController.queryPositionsToTree,payload) 
         return resp
      },
      async deleteFun(param){
        param.resources.forEach(i=>{
                i.types="position"
            })
          const resp = await this.$refs['position'].dispatch(OrgController.deleteResourceInOrg,{...param})
          return resp
      },
      async addFun(param){
        //orgId
        //   const resources =[{
        //       id:"", 
        //       types:"role"
        //   }]
            param.resources.forEach(i=>{
                i.types="position"
            })
          const resp = await this.$refs['position'].dispatch(OrgController.createResourceInOrg,{...param})
          return resp
      }

  },
};
</script>
<style></style>
