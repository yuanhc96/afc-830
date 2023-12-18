<template>
    <div>
      <el-row>
        <template v-if="content.rowLevel.and">
          <div v-for="(item,index) in content.rowLevel.and.nodes" :key="index"> 
            <condition :item="item" @rightClick="rightClick" @change="change" @deleteItem="deleteItem" :type="type" :index="index"/>
          </div>
        </template>
        <template v-if="content.rowLevel.or">
          <div v-for="(item,index) in content.rowLevel.or.nodes" :key="index"> 
            <condition :item="item" @rightClick="rightClick" @change="change" @deleteItem="deleteItem" :type="type" :index="index"/>
          </div>
        </template>
        <el-dropdown trigger="click">
          <el-button style="font-size:14px;" type="text"><i class="el-icon-plus" style="margin-right:4px;"></i>添加筛选条件</el-button>
          <el-dropdown-menu slot="dropdown" style="max-height:200px;overflow:auto;">
              <el-dropdown-item v-for="(item,index) in columnProperty" :key="index" class="text item">
                <div @click="clickItem(item)">
                  <svg-icon :icon-class="getBasePropertyIconClass(item)" class="icon"></svg-icon>
                  <span style="margin-left: 10px;">{{ item['name'] }}</span>
                </div>
              </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
    </el-row>
    <value-select :sdoData="sdoData" :index="selectIndex" :appcode="appcode" v-if="dialogVisible" :dialogVisible="dialogVisible" :row="selectContent" @cancel="cancel" @save="save"></value-select>
  </div>
</template>
  
  <script>
    // import { AppController } from '@controller';
  import { BaseVue, List, _ } from "@lib";
import Condition from './condition.vue';
import { condition, dataType, showBaseTypeData } from './model';
import ValueSelect from './value-select.vue';
  export default {
    mixins: [BaseVue, List],
    props:{
      sdoData:{
        default: Object
      },
      appcode:{
        default: String
      },
      content:{
        default: Object
      }
    },
    components:{ Condition,ValueSelect },
    data(){
      return{
        columnProperty: [],
        item: condition,
        dialogVisible: false,
        selectIndex: -1,
        // op: "=",
        selectContent: null
      }
    },
    computed:{
      type() {
        if(this.content.rowLevel.or && this.content.rowLevel.or.nodes.length>0){
          return 'or'
        }else{
          return 'and'
        }
      }
    },
    async created(){
      let columnProperty = this.sdoData.declaredProperties.filter(item=>{
        if(item.type.length>11 && item.type.substr(0,11)==='commonj.sdo'){
          item['@showType'] = item.type.substr(12,item.type.length-12)
          return item
        }
      })
      this.columnProperty = columnProperty
      if(this.content.rowLevel.and && this.content.rowLevel.and.nodes.length>0){
        this.content.rowLevel.and.nodes = this.handleInitData(this.content.rowLevel.and.nodes)
      }else if(this.content.rowLevel.or && this.content.rowLevel.or.nodes.length>0){
        this.content.rowLevel.or.nodes = this.handleInitData(this.content.rowLevel.or.nodes)
      }
      console.log('===content',this.content);//刷新问题
    },
    methods:{
      change(type,index,item){
        if(this.type !== type){
          if(type === 'or'){
            this.content.rowLevel.and.nodes[index] = item
            const data = _.cloneDeep(this.content.rowLevel.and.nodes)
            this.content.rowLevel.or = { nodes:data }
            this.content.rowLevel.and = null
          }else{
            this.content.rowLevel.or.nodes[index] = item
            const data = _.cloneDeep(this.content.rowLevel.or.nodes)
            this.content.rowLevel.and = { nodes:data }
            this.content.rowLevel.or = null
          }
        }
      },
      deleteItem(index){
        if(this.type === 'or'){
          this.content.rowLevel.or.nodes.splice(index,1)
          if(this.content.rowLevel.or.nodes.length === 0){
            this.content.rowLevel.or = null
            this.content.rowLevel.and = { nodes:[]}
          }
        }else{
          this.content.rowLevel.and.nodes.splice(index,1)
        }
      },
      clickItem(row){
        let item = _.cloneDeep(this.item)
        if(row['@showType']==='Date'||row['@showType']==='Time'||row['@showType']==='TimeStamp'){
          item.op = 'between'
        }
        item.propertyName = row['name']
        let showType = dataType[row['@showType']]?dataType[row['@showType']] :row['@showType']
        item.showType = showType
        item.typeLabel = showBaseTypeData.find(obj=>obj.value === showType).label
        if(this.type === 'or'){
          this.content.rowLevel.or.nodes.push(item)
        }else{
          this.content.rowLevel.and.nodes.push(item)
        }
      },
      getBasePropertyIconClass(property){
        let showType = dataType[property['@showType']]?dataType[property['@showType']] :property['@showType']
        let obj = showBaseTypeData.find(obj=>obj.value === showType)
        let label = obj?obj.label:'text'
        switch(label){
          case 'number':{
            return 'num'
          }
          case 'date':{
            return 'date'
          }
          case 'time':{
            return 'date'
          }
          case 'text':{
            return 'text'
          }    
        }
      },
      finish(){
        // 删除多余属性
        if(this.type === 'or'){
          if(this.content.rowLevel.or.nodes.length>0){
            this.handleTypeData(this.content.rowLevel.or.nodes).then(res=>{
              this.content.rowLevel.or.nodes = res
              this.$emit('submit',this.content)
            }).catch(err=>{
              this.$message({
                type: 'warning',
                message: '右值不能为空！'
              })
            })
          }else{
            this.$emit('submit',this.content)
          }
        }else{ 
          if(this.content.rowLevel.and.nodes.length>0){
            this.handleTypeData(this.content.rowLevel.and.nodes).then(res=>{
              this.content.rowLevel.and.nodes = res
              this.$emit('submit',this.content)
            }).catch(err=>{
              this.$message({
                type: 'warning',
                message: '右值不能为空！'
              })
            })
          }else{
            this.$emit('submit',this.content)
          }
        }
      },
      handleTypeData(arr){
        let isnull = true
        return new Promise(function(resolve, reject) {
          arr = arr.map(item=>{
            if(item.hasOwnProperty('showType')){
              delete item.showType
            }
            if(item.hasOwnProperty('typeLabel')){
              delete item.typeLabel
            }
            if(item.hasOwnProperty('orgType')){
              delete item.orgType
            }
            if(item.hasOwnProperty('valueType')){
              delete item.valueType
            }
            if(item.propertyType !== 'org'){
              delete item.propertySubType
              delete item.propertySubTypeMap
              delete item.controlContent.orgType
              delete item.controlContent.propertySubType
            }
            if(item.propertyType !== 'entity'){
              delete item.controlContent.entityName
              delete item.controlContent.entityField
            }
            if(item.propertyType !== 'org' && !item.propertyValue && !item.maxValue && !item.minValue ){
              isnull = false
            }else if(item.propertyType === 'org' && !item.propertySubTypeMap){
              isnull = false
            }else{
              return item
            }
          })
          return isnull?resolve(arr):reject()
        })
      },
      handleInitData(arr){
        arr = arr.map(item=>{
          let row = this.columnProperty.find(property=>property['name'] === item.propertyName)
          item.propertyName = row['name']
          let showType = dataType[row['@showType']]?dataType[row['@showType']] :row['@showType']
          item.showType = showType
          item.typeLabel = showBaseTypeData.find(obj=>obj.value === showType).label
          return item
        })
        return arr
      },
      rightClick(index){
        this.dialogVisible = true
        this.selectIndex = index
        if(this.type === 'or'){
          this.selectContent = this.content.rowLevel.or.nodes[index]
        }else{
          this.selectContent = this.content.rowLevel.and.nodes[index]
        }
      },
      cancel(){
        this.dialogVisible = false
      },
      save(index,form,controlContent){
        this.dialogVisible = false
        console.log('=============this.form:',form);
        if(this.type === 'or'){
          Object.assign(this.content.rowLevel.or.nodes[index],form,{controlContent:JSON.stringify(controlContent)})
        }else{
          Object.assign(this.content.rowLevel.and.nodes[index],form,{controlContent:JSON.stringify(controlContent)})
        }
      }
    }
  }
  </script>
  
  <style lang='scss' scoped>
.clearfix{
  display: flex;
  flex-direction: row;
}
  </style>