<template>
    <div>
        <el-form ref="form" :model="content.columnLevel" label-width="90px" size="mini" >
            <el-row class="mt-10">
                <el-form-item label="隐藏字段：">
                    <el-select multiple v-model="content.columnLevel.propertyNames" @change="handleChange" style="width:100%;">
                        <el-option
                            v-for="item in columnProperty"
                            :key="item['@id']"
                            :label="item['@name']"
                            :value="item['@id']"
                        />
                    </el-select>
                </el-form-item>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import { LowcodeResourceController } from "@controller";
export default {
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
    data(){
        return{
            columnProperty: [],
        }
    },
    async created(){
        let payload = { id:this.sdoData.URI,appName:this.appcode,__apiPrefix: this.appcode }
        let resp = await this.dispatch(LowcodeResourceController.getDetails,payload)
        if(resp.data){
            let content = JSON.parse(resp.data.content)
            let node = content.nodes.find(item=>item['@name'] == this.sdoData.name)
            this.columnProperty = node.columnProperty
        }
    },
    methods:{
        finish(){
            let propertyNames = this.content.columnLevel.propertyNames
            if(propertyNames && Array.isArray(propertyNames)){
                this.content.columnLevel.propertyNames = propertyNames.split(',')
            }
            this.$emit('submit',this.content)
        }
    }
}
</script>

<style lang='scss' scoped>

</style>