<template>
<div>

 <div class="big_box">
            <div class="left_box">
           <TinymceEditor @changeValue="changeValue" :clickValue="clickValue"  :value.sync="contentText"  />
            </div>
            <div class="right_box">
            <el-input style="width:210px" class="p-5" placeholder="输入关键词进行搜索" v-model.trim="queryName" @keyup.enter.native="queryfilter" clearable />
            <i class="search-icon el-icon-search" style="cursor:pointer;" @click="queryfilter"></i>
           <div class="ul_div"> 
            <ul >
            <li v-for="item in queryList" @click="setValue(item.value)" :key="item.value" class="pl-10">{{ item.label}}</li>
            </ul>
            </div>
            </div>
  </div>

</div>
</template>

<script>
export default {
  components: {
    TinymceEditor: () => import('@/components/TinymceEditor/tinymceEditor.vue')
  },
  created() {
  },
  props: {
      dialogVisible:{
          default:false,
          type: Boolean,
      },
      contentText:{
         default:" ",
         type: String,
      }
  },
  data(){
    return{
    form:{
        width:200,
        height:200,
        
    },
    validateRules:{},
    list:[
        {
          value: '${code}',
          label: '当前操作者账号',
          }, 
        {
          value: '${userName}',
          label: '当前操作者姓名',
          }, 
        {
        value: '${userRealName}',
        label: '当前操作者真实姓名',
        },  
          {
          value: '${userOrgName}',
          label: '当前操作组织机构名称',
          },
          {
          value: '${userRemoteIP}',
          label: '当前操作者IP地址',
          },
          {
          value: '${currentTime}',
          label: '当前时间',
          }
         
    ],
    queryList:[],
    queryName:'',
    tinymacText:'',
    selectValue:'',
    clickValue:'',
    }
  },
  watch: {
   },
  mounted(){
   this.queryList=this.list
  },
  methods:{
    cancel(){
     this.dialogVisible = false
    this.$emit('update:dialogVisible',this.dialogVisible)
      },
    handleClose(){
      this.dialogVisible = false
      this.$emit('update:dialogVisible',this.dialogVisible)
      },
    setValue(data){
     // this.contentText =  this.contentText + data;
      this.clickValue = data
    },
    changeValue(data){
    this.$emit('submitUrl',data)    
    },
    queryfilter(){
     let data = [];
     data = this.list.filter(item => item.label.indexOf(this.queryName) != -1)
     this.queryList=data
  }
  }
}

</script>

<style scoped>
.big_box{width: 800px;height: 300px;display: flex;margin-left: 30px;padding-top:10px }
.left_box{width: 500px;height: 300px;}
.right_box{width: 250px;height: 300px;margin-left:10px;font-size: 14px;border:1px solid rgb(205, 201, 201) }
.ul_div{
height:250px;overflow-y:scroll
}
li{
cursor:pointer;
list-style: none;
padding:10px
}
li:hover{
background: rgb(212, 238, 247);
}
ul{display:inline;}
</style>