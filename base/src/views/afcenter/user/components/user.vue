<template>
  <div>
    <div v-if="isSelect">
      <SearchRemoteButton style="width:100%" :value.sync="value" placeholder="输入名称搜索" :options="options" @remoteMethod="remoteUser" @openDetail="openUser"></SearchRemoteButton>
    </div>
    <SelectUser
      @input="handleMember"
      :title="title"
      :dialogVisible.sync="memberVisible"
      v-model="member"
    ></SelectUser>
  </div>
</template>

<script>
import { EmployeeController } from "@controller"
import { BaseVue } from "@lib"
export default {
  name: "",
  mixins:[BaseVue],
  components: {},
  props: {
      options:{
        default:[]
      },
      value:{},
      isSelect:{
        default(){
          return true
        }
      },
      title:{
        default:function(){
          return "员工选择"
        }
      }
  },
  data() {
    return {
      member: { employee: { id: "", name: "" },org:{} },
      memberVisible: false,
    };
  },
  watch: {
    memberVisible:{
      handler: function(value){
        if(!value){
          this.member = { employee: { id: "", name: "" },org:{} }
        }

      }
    },
    value(value){
      this.$emit("update:value",value)
    }
  },
  computed: {},
  mounted() {},
  methods: {
    clearHandler(){
      this.$emit('clear');
    },
    visibleHandler(){
      this.memberVisible = !this.memberVisible
    },
    reset(){
      this.member = { employee: { id: "", name: "" },org:{} }
    },
    openUser(){
      this.memberVisible = true
    },
    handleChange(value){

        this.$emit('update:value',value );
      },
    handleMember(user) {
        this.$emit("update:options",[user.employee])
        this.$nextTick(()=>{
          this.$emit('update:value',user.employee.id) 
        })
        this.$emit('success', user);
    },
    // 远程搜索
    async remoteUser(param) {
      const query = {
        pageIndex: 0,
        pageSize: 99,
        name: param,
      };
      const resp = await this.dispatch(
        EmployeeController.queryEmployeesByTenantId,
        query
      );
      if (!resp.error) {
        this.options = resp.data.data;
      }
    },
  },
};
</script>
