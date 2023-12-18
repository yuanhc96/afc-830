<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-tabs  v-model="selectTab">
          <el-tab-pane name="detail" label="基本信息">
            <Form class="mt-20"  :dict-type="dictType" :form-data="data" @success="search" />
          </el-tab-pane>
          <el-tab-pane name="entrylist" v-if="isshowEntrylist" label="子字典">
          <EntryIndex  v-on="$listeners" :dictType="dictType" :selectEntry="data" :isshowAddRoot="isshowAddRoot" :level="level" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Form from "./form.vue";
import EntryIndex from './list.vue'
export default {
  components: { EntryIndex,Form },
  props: {
    data: {
      default: () => {},
    },
    dictType:{},
    isshowAddRoot:{
      type:Boolean,
      default:true
    },
    level:{
      type: Number,
      default: 1
    },
    isshowEntrylist:{
      type:Boolean,
      default:true
    }
  },
  data() {
    return {
     selectTab:'detail'
    };
  },
  watch: {
    data(val){
       this.selectTab=this.data.selectTab
    }
  },
  mounted(){
    this.selectTab=this.data.selectTab
    
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