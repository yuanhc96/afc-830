<template>
    <div class="selectUserTree">
        <el-select
            v-if="update"
            style="width: 100%"
            v-model="value"
            :filterable="collapseTags"
            :multiple="multiple"
            clearable
            remote
            reserve-keyword
            :collapse-tags="collapseTags"
            class="placeholder"
            :remote-method="(query) => remoteMethod(query)"
            :loading="loading"
            :placeholder="placeholder"
            @visible-change="visibleChange($event)"
            @change="handleChange($event)"
            :disabled="disabled"
        >
            <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            />
        </el-select>
        <el-button
            :disabled="disabled"
            class="treeBtn"
            icon="el-icon-search"
            @click="openDetail"
        ></el-button>
        </div>

</template>

<script>
export default {
    name: 'select-button',
    data(){
        return{
          update: true  
        }
    },
    props:{
        multiple:{
            type:Boolean,
            default:false
        },
        value: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: '请输入'
        },
        loading:{
            type: Boolean,
            default: false
        },
        options:{
            type:Array,
            default: []
        },
        disabled:{
            type:Boolean,
            default:false
        },
        collapseTags:{
            type:Boolean,
            default:true
        },
    },
    watch: {
        multiple(){ //单个监控
            this.update = false
            setTimeout(()=>{
                this.update = true
            },50)
        }
    },
    mounted(){
        
    },
    methods:{
        remoteMethod(value){
            this.$emit('remoteMethod',value)
        },
        visibleChange(visible){
            // if (!visible) {
            //     this.options = []
            //     this.$emit("update:options",[])
            // }
        },
        handleChange(value){
            this.$emit("update:value",value)
            this.$emit('handleChange',value)
        },
        openDetail(){
            this.$emit('openDetail')
        }
       
    }
}
</script>

<style lang='scss' scoped>
::v-deep .el-input__inner {
  height: 32px;
}
::v-deep .el-input__suffix{
  padding: 0 6px;
}
.selectUserTree {
  display: flex;
  flex-direction: row;
  >>> .el-select .el-input__inner {
    border-top-right-radius: 0px !important;
    border-bottom-right-radius: 0px !important;
    border-right-color: transparent !important;
    height: 28px;
  }
}
.selectUserTree ::v-deep .el-input__inner:hover,
.selectUserTree ::v-deep .el-input__inner:focus,
.selectUserTree ::v-deep .el-select .el-input.is-focus .el-input__inner {
  border-right-color: var(--tagBg) !important;
  border-right-width: 1px !important;
}
.selectUserTree ::v-deep  .el-button{
      color: #000 !important;
  }
.treeBtn {
  border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
  border-left-color: transparent !important;
  height:28px!important;
}

</style>
