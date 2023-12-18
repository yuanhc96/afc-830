<template>
<div class="position-relative">
<!-- <el-input :read-only="true">
      <el-button slot="append" v-bind="$attrs" type="primary" icon="el-icon-more" @click="open" />
</el-input> -->


<el-autocomplete
     class="w-100p"
      v-model="url"
      :fetch-suggestions="querySearch"
      placeholder="请输入页面名称关键字/选择页面资源"
      :trigger-on-focus="false"
      @select="handleSelect"
    >
    <el-button slot="suffix" v-bind="$attrs" type="text" icon="el-icon-search" @click="open" />
  </el-autocomplete>
<i v-if="item && item.funcname" class="el-icon-close position-absolute clear" @click="clear" />
  <el-dialog
  title="选择页面"
  :visible.sync="dialogVisible"
  width="800px"
  top="60px"
  append-to-body
  :before-close="handleClose">
  <PmSecondaryMenu :rightTitle="false" :offsetHeight="115" :left-width="200" style="height: calc(100vh - 350px);">
    <div slot="left-title"  >
    <span class="ml-10">  资源分组 </span>
   
    </div>
    <div slot="left-body" >
            <GroupTree v-if="dialogVisible" :appId="appId" :businessObjId="businessObjId" :groupId.sync="groupId" :resoureType.sync="resoureType"/>
    </div>
    <div slot="right-body" class="pt-0 pl-10">
              <UrlList v-if="dialogVisible" @returnSelectUrl="returnSelectUrl"  :businessObjId="businessObjId"  :groupid="groupId" />        
    </div>
  </PmSecondaryMenu>
  
  <span slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="submitUrl">确 定</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
import { BaseVue, List } from '@lib'
import UrlList from "../../resource/res-url.vue";
import GroupTree from '../../group/group-tree.vue'
import {
  ResourceController,ResGroupController,
} from '@controller'
export default {
  components: {  UrlList, GroupTree },
  mixins: [BaseVue, List],
  props:{ 
    type:{
      type: String,
    },
    url:{
      type: String,
    },
    businessObjId:{
      type: String,
      default: null,
    },
    appId:{
      type: String,
      default: null,
    },
  },
  data(){
    return{
      dialogVisible:false,
      applyId: '',
      application:[],
      apply: '',
      selectNode:{},
      appId:null,
      groupId:null,
      resoureType:'url',
      props: {
          label: 'name',
          children: 'zones',
          isLeaf: 'leaf'
          // isLeaf: (data,node) =>{
          //   if(node.level === 2){ // 根据需要进行条件判断添加is-leaf类名
          //     return true
          //   }
          // }
        },
      currentNodeKey: null,
      expandedKeys: [],
      selectUrl:null,
      appList:[],
      resUrl:null,
      appProps: { 
	        value: 'id',
	        label: 'name',
          hasChildren: 'hasChildren',
          children: 'children',
          checkStrictly: true,
          lazy: true, // 此处必须为true
          lazyLoad: (node, resolve) => {

           if (node.data.id ) {this.getBusinessObject(node.data,resolve)}
           }
        },
        restaurants: [],
        state1: '',
        state2: ''
    }
  },
  watch: {
    selectNode: {
      immediate: true,
      deep: true,
      handler(val) {
        //选中某个业务对象
        this.currentNodeKey = this.selectNode.id
      },
    },
    dialogVisible:{
       handler(val) {
         this.dialogVisible=val
       }
    }
  },
   mounted() {
  
  },
  methods:{
    open() {
      this.dialogVisible = true
    },
    async getUrlList(name) {
            const q = {
              pageIndex:0,
              pageSize:999
            }
            let payload = 
            {...q,name:name,types:'url',businessObjId:this.businessObjId}
            const resp = await this.dispatch(ResourceController.queryResourcesByCriteria,payload)
            return resp.data.data
        },
    async querySearch(queryString, cb) {
       var list = [{}];
       var results =await this.getUrlList(queryString)
        for(let i of results){
          let group = await  this.dispatch(ResGroupController.findResGroup,{id:i.resGroupId})
          let groupName=group.data.name
          i.value = '['+ groupName+'] '+i.name;
        }
         list = results
        cb(list);
      },
      handleSelect(item) {
       // this.selectUrl=item.id
        this.$emit('selectUrl',item)
      },
      
    submitUrl(){
     this.$emit('selectUrl',this.resUrl)
     this.dialogVisible = false
    },
    returnSelectUrl(data){
        //this.url=data.name
        this.resUrl=data
    },
    cancel(){
     this.dialogVisible = false
      },
    handleClose(){
      this.dialogVisible = false
      },
   
      selectRes(data){
          console.log(data,'data')
      }
     
    }
}
</script>
<style lang="scss" scoped>
::v-deep .hamburger{
  display: none !important;
}
</style>
