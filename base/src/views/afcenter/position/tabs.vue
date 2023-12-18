<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane name="first" :label="tabMapping[activeName]">
        <position
          key="editPosition"
          ref="position"
          :form-data="formData"
          @success="submitHandler"
        ></position>
      </el-tab-pane>
      <el-tab-pane name="second" :label="tabMapping[activeName]">
        <Role :params="params" :funcCode="funcCode" :apiName="apiName" height="445px"></Role>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import position from "./positionForm.vue";
import Role from '@/views/afcenter/user/components/roleComponent/index'
import {BaseVue} from '@lib'
export default {
  name: "",
  mixins: [BaseVue, ],
  components: { position, Role },
  props: {
    tabData: {},
    activeName: "first",
  },
  data() {
    return {
      formData: null,
      apiName:{
        query:"PositionController.query",
        delete:"PositionController.delete",
        create:"PositionController.create",
      },
      tabMapping:{
        first:'岗位详情',
        second:'角色管理',
      },
      params:{
        query:{},
        delete:{
          path:{},
          key:''
        },
        create:{
          path:{},
          key:""
        },
        status:""
      },
    };
  },
  computed:{
     funcCode(){
        return {add:this.FuncCode.afc_f_position_role_add,
        del:this.FuncCode.afc_f_position_role_del,}
      },
  },
  watch: {
     activeName:{
      immediate:true,
      handler(){
        this.$emit('update:dialogTitle', this.tabMapping[this.activeName])
      }
    },
    tabData: {
      deep: true,
      immediate: true,
      handler(value) {
        if (value === null) {
          this.formData = null;
        } else {
          this.formData = { ...value };
        }
         if(value){
        this.params.query = {
          positionId:value.id
        }
        this.params.delete = {
          path:{positionId:value.id},
          key:"roleIds"
        }
        this.params.create = {
          path:{positionId:value.id},
          key:"roleIds"
        }
        this.params.statusKey="userId"
      }
      },
    },
  },
  methods: {
    submitHandler(){
      this.$emit('success')
    },
    cancel() {
      this.$emit("update:formData", null);
      this.$refs.position && this.$refs.position.cancel();
    },
    handleClick(arg) {
      if (arg.name === "second")
        this.$refs.userForm &&
          this.$refs.userForm.queryEmployeesByWorkGroupId();
    },
    validateResolve() {
      this.$refs.position && this.$refs.position.submit();
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-tabs__content{
  padding-top:0px
}
::v-deep .el-tabs__header{
 display:none;
}
</style>
