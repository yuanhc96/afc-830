<template>
    <PmSecondaryMenu class="ml-20" :showTitle="false" :offset-height="-30" :right-title="false">
    <div slot="left-body" >
      <GroupTree  :groupId.sync="groupId" />
    </div>
    <div slot="right-title" />
    <div slot="right-body">   
        <SysVariablesList class="mr-20" :groupid="groupId" />        
    </div>
  </PmSecondaryMenu>
</template>
<script>
import { ResGroupController } from "@controller";
import { BaseVue, Form, _ } from "@lib";
import GroupTree from './group/tree.vue';
import SysVariablesList from "./list.vue";
import model from "./model.js";
export default {
  components: { SysVariablesList,GroupTree},
  mixins: [BaseVue, Form, SysVariablesList],
  props: {
    data: {},
  },
  data() {
    return {
      TEXT: {
        subgroup: "新建分组",
        editgroup: "编辑分组",
      },
      dialogVisible: false,
      formType: null,
      selectGroup: {},
      groupId: null,
      model: model,
      form: _.cloneDeep(model.group),
    };
  },
  watch: {
    businessObjId(res){
      this.businessObjId=res     
    },
  },
  mounted() {
   // this.UndefaultGroup()
  },
  methods: {
    async init() {
      // let res = await this.search();
    },
      //查询默认分组code查询分组
      async UndefaultGroup(){
          let res = await  this.searGroupbyCode()
          if (!res.error && res.data.data.length > 0) {
            let group = res.data.data[0];
            this.groupId = group.id;
          }
      },
      async searGroupbyCode() {
          const query = _.cloneDeep(this.query);
          query.pageSize = 999;
          let payload = {
            appId: this.appId,
            code: this.appId+'_public_group',
            ...query
          };
          const resp = await this.dispatch(
            ResGroupController.queryResGroupsByCriteria,
            payload
          );
          return resp;
    },
    openAdd(formType, e) {
      this.dialogVisible = true;
      this.formType = formType;
      if (formType === "editgroup") {
        this.selectGroup = e.data;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
  ::v-deep .hamburger{
    display: none !important;
  }
  .viewBtn{
    margin-left:-10px;
    margin-top:-10px;
  }
  ::v-deep .el-tabs--card .el-tabs__item {
    height: 40px !important;
    line-height: 40px !important;
  }
  ::v-deep .el-scrollbar__thumb {
    display: none !important;
  }
  ::v-deep .secondary-menu .left .body{
    border-top:none!important;
  }
</style>