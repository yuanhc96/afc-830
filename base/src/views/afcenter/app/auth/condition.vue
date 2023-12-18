<template>
    <div>
        <el-row class="mt-10">
            <el-col :span="24" style="text-align: right;">
                <i class="el-icon-close" @click="deleteItem"></i>
            </el-col>
        </el-row>
        <el-row class="mt-10">
            <el-col :span="6" class="pr-10">
                <el-input v-model="item.propertyName" disabled></el-input>
            </el-col>
            <el-col :span="4" class="pr-10">
                <el-select size="mini" v-model="item.op" @change="handleChange" style="width:100%;">
                    <el-option
                        v-for="item in operators"
                        :key="item.k"
                        :label="item.t"
                        :value="item.k"
                    />
                </el-select>
            </el-col>
            <el-col :span="14">
                <div v-if="item.controlContent.type==='constant'">
                    <div v-if="valueType==='number'" style="width: 100%;display: flex;flex-direction: row;">
                        <!-- <el-input-number style="width: 100%;" controls-position="right" v-model="item.propertyValue"></el-input-number> -->
                        <pm-number class="" v-model="item.propertyValue" style="width: 100%;" placeholder="请输入数字"></pm-number>
                        <el-button slot="append" icon="el-icon-more" @click="rightClick"></el-button>
                    </div>
                    <div v-else-if="valueType==='range'" style="width: 100%;display: flex;flex-direction: row;">
                        <pm-number-range style="width: 100%;" placeholder="数字区间" v-model="item.minValue" :value2.sync="item.maxValue"></pm-number-range>
                        <el-button slot="append" icon="el-icon-more" @click="rightClick"></el-button>
                    </div>
                    <div v-else-if="valueType==='date'" style="width: 100%;display: flex;flex-direction: row;">
                        <pm-date-picker class="" v-model="item.propertyValue" clearable
                        placeholder="请选择日期" :style='{"width":"100%"}' type="datetime" format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"></pm-date-picker>
                        <el-button slot="append" icon="el-icon-more" @click="rightClick"></el-button>
                    </div>
                    <div v-else-if="valueType==='dateRange'" style="width: 100%;display: flex;flex-direction: row;">
                        <pm-date-picker-range class="" v-model="item.minValue" clearable
                        placeholder="日期区间" :style='{"width":"100%"}'
                        type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :value2.sync="item.maxValue"></pm-date-picker-range>
                        <el-button slot="append" icon="el-icon-more" @click="rightClick"></el-button>
                    </div>
                    <div v-else-if="valueType==='time'" style="width: 100%;display: flex;flex-direction: row;">
                        <pm-time-select class="" v-model="item.propertyValue" :clearable="true"
                            placeholder="请选择时间" :style='{"width":"100%"}'
                        format="HH:mm:ss" value-format="HH:mm:ss"
                        :picker-options='{"selectableRange":"00:00:00-23:59:59"}'></pm-time-select>
                        <el-button slot="append" icon="el-icon-more" @click="rightClick"></el-button>
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
                        <el-button slot="append" icon="el-icon-more" @click="rightClick"></el-button>
                    </div>
                    <el-input v-else placeholder="请输入内容" v-model="item.propertyValue">
                        <el-button slot="append" icon="el-icon-more" @click="rightClick"></el-button>
                    </el-input>
                </div>
                <div class="tags" v-else-if="item.controlContent.type==='org'">
                    <template v-if="item.controlContent.propertySubType!=='specific_user'&&item.controlContent.propertySubType!=='specific_org'">
                        <div>
                            <el-tag
                                @close="closeTag(tag,index)"
                                closable>
                                {{ getOrgName() }}
                            </el-tag>
                        </div>
                        <el-button icon="el-icon-more" @click="rightClick"></el-button>
                    </template>
                    <template v-else>
                        <div>
                            <el-tag
                                v-for="(tag,index) in item.controlContent.controlValue"
                                :key="index"
                                @close="closeTag(tag,index)"
                                closable>
                                {{ tag.name }}
                            </el-tag>
                        </div>
                        <el-button icon="el-icon-more" @click="rightClick"></el-button>
                    </template>
                </div>
                <div v-else-if="item.controlContent.type === 'entity'" class="tags">
                    <div>
                        <el-tag
                            v-for="(tag,index) in item.controlContent.controlValue"
                            :key="index"
                            @close="closeTag(tag,index)"
                            closable>
                            {{ tag }}
                        </el-tag>
                    </div>
                    <el-button icon="el-icon-more" @click="rightClick"></el-button>
                </div>
                <div v-else class="tags">
                    <div>
                        <el-tag
                            v-for="(tag,index) in item.controlContent.controlValue"
                            :key="index"
                            @close="closeTag(tag,index)"
                            closable>
                            {{ tag.name }}
                        </el-tag>
                    </div>
                    <el-button icon="el-icon-more" @click="rightClick"></el-button>
                </div>
            </el-col>
        </el-row>
        <el-row class="mt-10">
            <el-col :span="24">
                <div class="order">
                    <span style="white-space: pre;" class="line"></span>
                    <el-dropdown v-if="index==0" @command="handleCommand">
                        <span class="text">
                            <span style="white-space: pre;">{{ type=='or'?'或':'且'}}</span>
                            <i class="el-icon-arrow-down"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="or">或</el-dropdown-item>
                            <el-dropdown-item command="and">且</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <span v-else style="white-space: pre;" class="text">{{ type=='or'?'或':'且'}}</span>
                    <span style="white-space: pre;" class="line"></span>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { dateOperators, numberOperators, operators, orgOptions, textOperators, userOptions } from './model';
const numOps = ['=','<>','>','<','>=','<=']
const rangeOps = ['between','not_between']
export default {
    props:{
        item:{
            type: Object
        },
        type:{
            type: String
        },
        index:{
            type: Number
        }
    },
    data(){
        return{
            operators:operators,
            showOps: false,
            names:'',
            // op:this.item.op,
            showType: '',
            typeLabel:'',
            valueType:'common', //common number range
            timeRanges: [new Date(0,0,0,0,0,0), new Date()]
        }
    },
    watch:{
        'item.controlContent':{
            immediate: true,
            handler(val){
                if(val){
                    if(typeof val === 'string'){
                        this.item.controlContent = val && JSON.parse(val)||{}
                    }
                }
            }
        },
        'item.op':{
            // immediate:true,
            handler(val){
                if(this.item.typeLabel === 'number'){
                    if(numOps.indexOf(val) > -1){
                        this.valueType = 'number'
                    }else if(rangeOps.indexOf(val) > -1){
                        this.valueType = 'range'
                    }  
                }else if(this.item.typeLabel === 'date'){
                    if(numOps.indexOf(val) > -1){
                        this.valueType = 'date'
                    }else if(rangeOps.indexOf(val) > -1){
                        this.valueType = 'dateRange'
                    } 
                }else if(this.item.typeLabel === 'time'){
                    if(numOps.indexOf(val) > -1){
                        this.valueType = 'time'
                    }else if(rangeOps.indexOf(val) > -1){
                        this.valueType = 'timeRange'
                    } 
                }
                this.item.controlContent = {
                    type:"constant",
                    controlValue:''
                }
                this.item.propertyValue = ''
            }
        },
        'valueType':{
            handler(val){
                console.log('==============valueType:',val);
            }
        },
        'item.minValue':{
            immediate: true,
            handler(val){
                if(val){
                    this.$set(this.timeRanges,0,val)
                }
            }
        },
        'item.maxValue':{
            immediate: true,
            handler(val){
                if(val){
                    this.$set(this.timeRanges,1,val)
                }
            }
        },
    },
    created(){
        if(this.item.typeLabel === 'number'){
            this.operators = numberOperators
            if(numOps.indexOf(this.item.op) > -1){
                this.valueType = 'number'
            }else if(rangeOps.indexOf(this.item.op) > -1){
                this.valueType = 'range'
            }else{
                this.valueType = 'common'
            }  
        }else if(this.item.typeLabel === 'date'){
            // this.operators = numberOperators
            this.operators = dateOperators
            if(numOps.indexOf(this.item.op) > -1){
                this.valueType = 'date'
            }else if(rangeOps.indexOf(this.item.op) > -1){
                this.valueType = 'dateRange'
            } 
        }else if(this.item.typeLabel === 'time'){
            // this.operators = numberOperators
            this.operators = dateOperators
            if(numOps.indexOf(this.item.op) > -1){
                this.valueType = 'time'
            }else if(rangeOps.indexOf(this.item.op) > -1){
                this.valueType = 'timeRange'
                if(this.item.minValue){
                    this.timeRanges = [this.item.minValue,this.item.maxValue]
                }
            } 
        }else if(this.item.typeLabel === 'text'){
            this.operators = textOperators
        }
    },
    methods:{
        timeRangesChange(e){
            this.timeRanges = e
            this.item.minValue = e[0]
            this.item.maxValue = e[1]
        },
        handleChange(value){
            // if(this.item.op !== value){
            //     this.item.controlContent.controlValue = null
            //     this.item.controlContent.type = 'constant'
            //     this.$forceUpdate()
            // }
        },
        //切换或与
        handleCommand(type){
            this.type = type
            this.$emit('change',type,this.index,this.item)
        },
        deleteItem(){
            this.$emit('deleteItem',this.index)
        },
        rightClick(){
            this.$emit('rightClick',this.index)
        },
        closeTag(value,index){
            if(value){
                this.item.controlContent.controlValue.splice(index,1)
                if(this.item.propertyValue){
                    let temp = this.item.propertyValue.split(',')
                    temp.splice(index,1)
                    this.item.propertyValue = temp.join(',')
                    if(!this.item.propertyValue){
                        this.reset()
                    }
                }
                if(this.item.controlContent.type==='org'){
                    if((this.item.controlContent.propertySubType === 'specific_org'||this.item.controlContent.propertySubType === 'specific_user')&&this.item.propertySubTypeMap[this.item.controlContent.propertySubType]){
                        let orgValues = this.item.propertySubTypeMap[this.item.controlContent.propertySubType].split(',')
                        orgValues.splice(index,1)
                        this.item.propertySubTypeMap[this.item.controlContent.propertySubType] = orgValues.join(',')
                        if(!this.item.propertySubTypeMap[this.item.controlContent.propertySubType]){
                            delete this.item.propertySubTypeMap
                            this.reset()
                        }
                    }
                }
            }
        },
        reset(){
            this.item.controlContent.type='constant'
            this.item.valueType = 'common'
        },
        getOrgName(){
            let options = this.item.controlContent.orgType==='sub_org'?orgOptions:userOptions
           return options.find(item=>item.type===this.item.controlContent.propertySubType).name
        }
    }
}
</script>

<style lang='scss' scoped>
.pr-10{
    padding-right: 10px;
}
.top-content{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    line-height: 30px;
}
::v-deep .el-input-group__append {
    cursor: pointer;
    background-color: #fff !important;
    border-color: #DDDFDF !important;
}
.order{
    height: 20px;
    line-height: 20px;
    
  }
  .line{
    display: inline-block;
    padding-top: 3px;
    width: calc(50% - 30px);
    border-top: 1px solid #E7E7E7;
  }
  .text{
    vertical-align: middle;
    width: 50px;
    display: inline-block;
    text-align: center;
  }
  .tags{
    width: 100%;
    // height: 28px;
    line-height: 28px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border: 1px solid #E7E7E7;
  }
  .tags ::v-deep .el-button{
    border: none;
    border-left: 1px solid #E7E7E7;
  }
</style>