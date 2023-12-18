<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-tabs  v-model="selectTab">
          <el-tab-pane name="detail" label="基本信息">
            <Form class="mt-20" :parent-type.sync="parentType" :form-data="data" @success="search"/>
          </el-tab-pane>
          <el-tab-pane name="entrylist" label="字典项" lazy>
            <DictIndex  v-on="$listeners"  :dict-type="data" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Form from "./form.vue";
import DictIndex from '../entry/list.vue'
export default {
  components: { DictIndex,Form },
  name:'DictDetail',
  props: {
    data: {
      default: () => {
        selectTab:'detail'
      },
    },
  },
  data() {
    return {
     selectTab:'detail'
    };
  },
  watch:{
    data:{
      handler(val){
        this.selectTab = val.selectTab
      }
    }
  },
  mounted(){
  },
  methods: {
   
  },
};
</script>
<style lang="scss" scoped>
  ::v-deep .el-tabs__header{
    margin-bottom:0px!important;
  }
</style>