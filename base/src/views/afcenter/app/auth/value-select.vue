<template>
    <pm-dialog
      width="800px"
      title="值选择器"
      :showFooter="true"
      :visible.sync="dialogVisible"
      :loading="loading"
      :before-close="cancel">
      <el-form :model="controlContent" label-width="100px" style="height:300px;">
          <el-row>
              <el-col :span="22">
                  <el-form-item label="右值类型：" prop="type">
                      <el-radio-group v-model="controlContent.type" @change="changeType">
                        <el-radio v-for="item in options" :key="item.type" :label="item.type" style="padding-right: 20px;" :disabled="item.disabled">{{ item.name }}</el-radio>
                      </el-radio-group>
                  </el-form-item> 
              </el-col>
          </el-row>
          <div v-if="controlContent.type==='constant'">
              <el-row>
                  <el-col :span="22">
                      <el-form-item label="常量：">
                        <div v-if="valueType==='number'" style="width: 100%;display: flex;flex-direction: row;">
                            <!-- <el-input-number style="width: 100%;" controls-position="right" v-model="form.propertyValue"></el-input-number> -->
                            <pm-number v-model="form.propertyValue" style="width: 100%;" placeholder="请输入数字"></pm-number>
                        </div>
                        <div v-else-if="valueType==='range'" style="width: 100%;display: flex;flex-direction: row;">
                            <pm-number-range style="width: 100%;" placeholder="数字区间" v-model="form.minValue" :value2.sync="form.maxValue"></pm-number-range>
                        </div>
                        <div v-else-if="valueType==='date'" style="width: 100%;display: flex;flex-direction: row;">
                            <pm-date-picker class="" v-model="form.propertyValue" clearable
                            placeholder="请选择日期" :style='{"width":"100%"}' type="datetime" format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"></pm-date-picker>
                        </div>
                        <div v-else-if="valueType==='dateRange'" style="width: 100%;display: flex;flex-direction: row;">
                            <pm-date-picker-range class="" v-model="form.minValue" clearable
                            placeholder="日期区间" :style='{"width":"100%"}'
                            type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :value2.sync="form.maxValue"></pm-date-picker-range>
                        </div>
                        <div v-else-if="valueType==='time'" style="width: 100%;display: flex;flex-direction: row;">
                            <pm-date-picker class="" v-model="form.propertyValue" clearable
                            placeholder="请选择时间" :style='{"width":"100%"}' type="datetime" format="HH:mm:ss"
                            value-format="HH:mm:ss"></pm-date-picker>
                        </div>
                        <div v-else-if="valueType==='timeRange'" style="width: 100%;display: flex;flex-direction: row;">
                            <el-time-picker
                                style="width: 100%;"
                                is-range
                                format="HH:mm:ss"
                                value-format="HH:mm:ss"
                                v-model="timeRanges"
                                @change="timeRangesChange"
                                range-separator="至"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                placeholder="选择时间范围">
                            </el-time-picker>
                        </div>
                        <el-input v-else placeholder="请输入内容" v-model="form.propertyValue"></el-input>
                      </el-form-item> 
                  </el-col>
              </el-row>
          </div>
          <div v-if="controlContent.type==='dict'">
              <el-row>
                  <el-form-item label="字典类型：">
                      <el-select v-model="dicttypeid" placeholder="请选择" style="width: 100%;" @change="changeDictType">
                          <el-option
                              v-for="item in dictTypes"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id"
                              />
                      </el-select>
                  </el-form-item> 
              </el-row>
              <el-row>
                  <el-form-item label="值：">
                      <el-select :multiple="isMultiple" style="width: 100%;" v-model="controlValue" placeholder="请选择" @change="changeSelect">
                          <el-option
                              v-for="item in dictOptions"
                              :key="item.code"
                              :label="item.name"
                              :value="item.code"
                              />
                      </el-select>
                  </el-form-item> 
              </el-row>
          </div>
          <el-row v-if="controlContent.type==='entity'">
            <el-form-item label="选择实体：">
                <!-- <el-select v-model="entityName" filterable clearable placeholder="请选择" style="width: 100%;" @change="changeEntityType">
                    <el-option
                        v-for="item in entityList"
                        :key="item.entityName"
                        :label="item.name"
                        :value="item.entityName"
                    />
                </el-select> -->
                <SelectEntity clearable style="width:100%;" :appName="appcode" placeholder="请选择" :persistent="true" :sdoTypeOnly="true" v-model="entityName" @change="changeEntityType"/>
            </el-form-item>
            <el-form-item label="显示字段：">
                <el-select v-model="entityField" clearable placeholder="请选择" style="width: 100%;" @change="changeEntityField">
                    <el-option
                        v-for="(item,index) in entityFields"
                        :key="index"
                        :label="item.name"
                        :value="item.name"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="值字段：">
                <!-- <el-input v-model="row.propertyName"></el-input> -->
                <el-select v-model="formEntityField" placeholder="请选择" style="width: 100%;">
                    <el-option
                        v-for="(item,index) in entityFields"
                        :key="index"
                        :label="item.name"
                        :value="item.name"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="值：">
                <el-select :multiple="isMultiple" v-model="controlValue" placeholder="请选择" @change="changeSelect" style="width: 100%;">
                    <el-option
                        v-for="(item,index) in entityValue"
                        :key="index"
                        :label="item"
                        :value="item"
                    />
                </el-select>
            </el-form-item>
          </el-row>
          <el-row v-if="controlContent.type==='org'">
            <el-form-item label="选择类型：">
                <el-select v-model="orgType" placeholder="请选择" style="width:100%;">
                    <el-option
                        v-for="item in propertySubOptions"
                        :key="item.type"
                        :label="item.name"
                        :value="item.type"
                    />
                </el-select>
            </el-form-item>
            <el-form-item :label="orgSubLabel" v-if="orgType">
                <el-select v-model="propertySubType" placeholder="请选择" style="width:100%;" @change="changeOrgType">
                    <el-option
                        v-for="item in orgOptions"
                        :key="item.type"
                        :label="item.name"
                        :value="item.type"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="部门：" v-if="propertySubType&&(propertySubType==='specific_org'||propertySubType==='specific_org_and_child')">
              <pm-select-org class="" :props="{ 'multiple': true }" clearable @selectedSuccess="selectedSuccess"
              placeholder="请输入机构选择" :style='{"width":"100%"}' icon="el-icon-more" size="mini" type="primary"
             :entityModel.sync="controlContent.controlValue" :show-all-levels="true" :selectTypes='[]' separator="," showMode="input"
              ></pm-select-org>
            </el-form-item>
            <el-form-item label="用户：" v-if="propertySubType&&(propertySubType==='specific_user')">
                <pm-select-user class="" :props="{ 'multiple': true }" clearable @selectedSuccess="selectedSuccess"
              placeholder="请输入人员选择" :style='{"width":"100%"}' icon="el-icon-more" size="mini" type="primary"
              :show-all-levels="true" separator="," showMode="input" :selectTypes='[]'
              :entityModel.sync="controlContent.controlValue"></pm-select-user>
            </el-form-item>
          </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancel">取消</el-button>
          <el-button size="mini" type="primary" @click="save">确定</el-button>
      </span>
    </pm-dialog>
  </template>
  
  <script>
  import SelectEntity from '@/components/SelectEntity/data-type-selector.vue';
import { AppController, DictEntryController, DictTypeController } from '@controller';
import { orgOptions, propertySubOptions, propertyTypeOptions, userOptions } from './model';
  export default {
    components: { SelectEntity },
      props:{
          dialogVisible:{
              type: Boolean
          },
          index:{
              type: Number
          },
          row:{
              type: Object
          },
          appcode:{
            type: String
          },
          sdoData:{
            type: Object
          }
      },
      data(){
          return{
              options:_.cloneDeep(propertyTypeOptions),
              form:{ propertyValue:null,propertyType:'constant' },
              dictTypes: null,
              dicttypeid: null,
              dictOptions: [],
              entityList:null,
              entityName:'',
              entityField:'',
              entityValue:[],
              controlContent:null,
              // controlContent: this.row.controlContent || { type:'constant',controlValue:null },
              controlValue:[],
              isMultiple: this.row.op==='='||this.row.op==='<>',
              valueType:'common',
              propertySubOptions: propertySubOptions,
              orgOptions: orgOptions,
              orgType:'',
              propertySubType:'',
              entityFields: [],
              orgSubLabel:'',
              timeRanges: [new Date(0,0,0,0,0,0), new Date()],
              formEntityValue: [],
              formEntityField:''
          }
      },
      watch:{
          'dicttypeid':{
              handler(){
                  this.dispatch(DictEntryController.queryDictEntrysByDictTypeId, {dictTypeId:this.dicttypeid}).then(res=>{
                      this.dictOptions = res.data
                  })
              }
          },
          'controlContent.type':{
             immediate: true,
              handler(val){
                this.form.propertyType = val
                  if(val !== 'org'){
                      if((!this.dictTypes) && (val === 'dict')){
                        this.getDictTypes()
                      }else if((!this.entityList) && (val === 'entity')){ 
                        this.getEntityList()
                      }
                  }
              }
          },
        'entityName':{
            handler(val){
                this.controlContent.entityName = val
                if(val){
                    if(this.entityList){
                        let sdoData = this.entityList.find(item=>item.entityName === val)
                        let columnProperty = sdoData.declaredProperties.filter(item=>{
                            if(item.type.length>11 && item.type.substr(0,11)==='commonj.sdo'){
                                item['@showType'] = item.type.substr(12,item.type.length-12)
                                return item
                            }
                        })
                        this.entityFields = columnProperty
                        if(!this.entityFields.find(item=>item['name'] === this.formEntityField)){
                            this.formEntityField = ''
                        }
                    }
                }
            }
          },
          'entityField':{
            // immediate: true,
            handler(val){
                this.controlContent.entityField = val
                if(val){
                    this.getEntityValue()
                }
            }
          },
          'orgType':{
            handler(val){
               this.controlContent['orgType'] = val
               if(val){
                    this.form.propertySubType = val
                    if(val === 'sub_org'){
                        this.orgOptions = orgOptions
                        this.orgSubLabel = '机构类型：'
                    }else{
                        this.orgOptions = userOptions
                        this.orgSubLabel = '用户类型：'
                    }
               }
            }
          },
          'propertySubType':{
            handler(val){
                this.controlContent['propertySubType'] = val
            }
          },
      },
      created(){
          this.initData()
      },
      methods:{
        timeRangesChange(e){
            this.timeRanges = e
            this.form.minValue = e[0]
            this.form.maxValue = e[1]
        },
        async getEntityList(){
            let payload = { appCode:this.appcode }
            this.entityList = await this.querySdoTypes(payload)

        },
        getEntityValue(){
            let payload = { params:{entityName:this.entityName,pageIndex:0,pageSize:-1},appCode:this.appcode,__apiPrefix: this.appcode }
            this.dispatch(AppController.queryModelsWithPage,payload).then(res=>{
                // this.entityValue = res.data.data
                this.formEntityValue = res.data.data
                let values = res.data.data.map(item=>item[this.entityField])
                this.entityValue = Array.from(new Set(values))
            })
        },
        initData(){
          let row = _.cloneDeep(this.row)
          this.controlContent = row.controlContent || { type:'constant',controlValue:null }
          if((this.controlContent.controlValue)&&(typeof this.controlContent.controlValue==='object') && (this.controlContent.controlValue.length>0)){
            this.controlContent.controlValue.map(item=>{
                  if(row.controlContent.type === 'dict'){
                    this.dicttypeid = item.dictTypeId
                    if(this.isMultiple){
                        this.controlValue.push(item.code) //字典类型时
                    }else{
                        this.controlValue = item.code //字典类型时
                    }
                  }else{
                    if(this.isMultiple){
                        if(this.controlContent.type === 'entity'){
                            this.entityName = this.controlContent.entityName
                            this.entityField = this.controlContent.entityField
                            this.controlValue.push(item)
                            this.formEntityField = this.row.propertyName || ''
                        }
                    }else{
                        if(this.controlContent.type === 'entity'){
                            this.entityName = this.controlContent.entityName
                            this.entityField = this.controlContent.entityField
                            this.controlValue = item
                            this.formEntityField = this.row.propertyName || ''
                        }
                    }
                  }
              })
          }else{
            this.controlValue = this.controlContent.controlValue
            this.form = { ...row }
            delete this.form.controlContent
            if(this.controlContent.type === 'entity'){
                this.formEntityField = this.row.propertyName || ''
            }
          }
          if(this.controlContent.type === 'org'){
                this.orgType = this.controlContent.orgType
                this.propertySubType = this.controlContent.propertySubType
            }
            if(this.form.typeLabel === 'number' || this.form.typeLabel === 'date' || this.form.typeLabel === 'time'){
                if(this.form.op === '='||this.form.op === '<>'||this.form.op === '>'||this.form.op === '<'||this.form.op === '>='||this.form.op === '<='){
                    this.valueType = this.form.typeLabel === 'number'?'number':(this.form.typeLabel === 'data'?'date':'time')
                    // options:[{ type:'constant',name:'常量',disabled:false },{ type:'dict',name:'业务字典',disabled:false },{ type:'entity',name:'实体',disabled:false },{ type:'org',name:'组织',disabled:false }],
                    if((this.form.op !== '=') &&(this.form.op !== '<>')){
                        this.options = this.options.map(item=>{
                            if(item.type==='constant'){
                                item.disabled = false
                            }else{
                                item.disabled = true
                            }
                            return item
                        })
                    }
                }else if(this.form.op === 'between' || this.form.op === 'not_between'){
                    this.valueType = this.form.typeLabel === 'number'?'range':(this.form.typeLabel === 'date'?'dateRange':'timeRange')
                    if(this.valueType === 'timeRange'){
                        if(this.form.minValue){
                            this.timeRanges = [this.form.minValue,this.form.maxValue]
                        }
                    }
                    if((this.form.op !== '=') &&(this.form.op !== '<>')){
                        this.options = this.options.map(item=>{
                            if(item.type==='constant'){
                                item.disabled = false
                            }else{
                                item.disabled = true
                            }
                            return item
                        })
                    }
                }else{
                    this.valueType = 'common'
                }  
            }else if(this.form.typeLabel === 'text'){
                if(this.form.op === 'start_with'||this.form.op === 'end_with'){
                    if((this.form.op !== '=') &&(this.form.op !== '<>')){
                        this.options = this.options.map(item=>{
                            if(item.type==='constant'){
                                item.disabled = false
                            }else{
                                item.disabled = true
                            }
                            return item
                        })
                    }
                }
            }

        },
        async querySdoTypes(payload) {
            return (await this.dispatch(AppController.queryPersistentEntitys, payload)).data
        },
          async getDictTypes(){
              let payload = {}
              const resp = await this.dispatch(DictTypeController.queryDictTypesByCriteria, payload)
              console.log(resp);
              if (!resp.error) {
                  this.dictTypes = resp.data.data
              }
          },
          changeSelect(e){
            if(this.controlContent.type!=='constant'){
                this.form.minValue = ''
                this.form.maxValue = ''
            }
            if(this.isMultiple){
                this.form.propertyValue = e.join(',')
                if(this.controlContent.type === 'entity'){
                    let arr = []
                    this.form.propertyValue = this.formEntityValue.map(item=>{
                        e.map(select=>{
                            if(item[this.entityField] === select){
                                arr.push(item[this.formEntityField])
                            }
                        })
                    })
                    this.form.propertyValue = arr.join(',')
                }
            }else{
                this.form.propertyValue = e
                if(this.controlContent.type === 'entity'){
                    let arr = []
                    this.form.propertyValue = this.formEntityValue.map(item=>{
                        if(item[this.entityField] === e){
                            arr.push(item[this.formEntityField])
                        }
                    })
                    this.form.propertyValue = arr.join(',')
                }
            }

            let controlValue = []
            if(this.controlContent.type === 'dict'){
                controlValue = this.handleControlValue(e,'code',this.dictOptions)
            }else{
                if(this.controlContent.type === 'org'){
                    controlValue = this.handleControlValue(e,'type',this.orgOptions)
                }else{
                    controlValue = this.handleControlValue(e,'',this.entityValue)
                }
            }
            this.controlContent.controlValue = controlValue
          },
          changeDictType(){
            this.controlValue = []
          },
          changeEntityType(e){
            this.entityField = ''
            this.controlValue = []
          },
          changeEntityField(e){
            this.controlValue = []
          },
          selectedSuccess(e){
            this.controlContent.controlValue = e
            if(e.length>0){
                let ids = e.map(item=>item.id)
                let propertySubTypeMap = {}
                propertySubTypeMap[this.controlContent.propertySubType] = ids.join(',')
                this.form.propertySubTypeMap = propertySubTypeMap
            }
          },
          handleControlValue(propertyValue,key,options){
            let data = []
            if(this.isMultiple){ 
                propertyValue.map(value=>{
                    options.map(item=>{
                        if(item === value ||item[key] === value){
                            data.push(item)
                        }
                    })
                })
            }else{
                if(key){
                    data.push(options.find(item=>item[key] === propertyValue))
                }else{
                    data.push(options.find(item=>item === propertyValue))
                }
            }
            // formEntityField
            return data
          },
          changeType(e){
            if(this.row.controlContent.type === e){
                this.initData()
            }else{
                if(e==='constant'){
                    this.controlValue = ''
                    this.form.propertyValue = ''
                }else{
                    this.controlValue = []
                    this.controlContent.controlValue = []
                    if(e === 'dict'){
                        this.dicttypeid = ''
                    }else if(e === 'entity'){
                        this.entityName = ''
                        this.entityField = ''
                        this.formEntityField = this.row.propertyName || ''
                    }else{
                        this.orgType = ''
                        this.propertySubType = ''
                    }
                }
            }
          },
          changeOrgType(e){
            this.propertySubType = e
            this.controlContent.controlValue = []
            let propertySubTypeMap = {}
            propertySubTypeMap[e] = (e!=='specific_user'&&e!=='specific_org')?e:''
            Object.assign(this.form,{ propertySubTypeMap:propertySubTypeMap })
            this.$forceUpdate()
          },
          cancel(){
              this.$emit('cancel')
          },
          save(){
              this.$emit('save',this.index,this.form,this.controlContent)
          }
      }
  }
  </script>
  
  <style scoped lang="scss">
  .checks{
      display: flex;
      flex-direction: row;
      align-items: center;
  }
    ::v-deep .el-dialog .el-dialog__footer{
    height: 50px !important;
    }
  </style>
  

