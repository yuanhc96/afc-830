<template>
<el-radio-group v-model="value">
              <el-radio-button :label="color" v-for="color in colors">
                  <div class="color-picker" :style="`background-image:${color};`"/>
              </el-radio-button>
            </el-radio-group>
</template>
<script>
export default {
    props:{
        value:{}
    },
    watch:{
        value(val){
            this.$emit('input',val)
        }
    },
    data(){
        return {
              colors:[
        'linear-gradient(135deg,#7ed49a,#46c26f)',
        'linear-gradient(135deg,#63d1e8,#00aed1)',
        'linear-gradient(135deg,#77abf4,#2f7deb)',
        'linear-gradient(135deg,#a782f0,#7e47eb)',
        'linear-gradient(135deg,#f18585,#eb5050)',
      ],
        }
    }
}
</script>

<style lang="scss" scoped>
.color-picker{
  border-radius: 8px;
    cursor: pointer;
    display: inline-block;
    height: 16px;
    margin: 0 6px;
    width: 16px;
}
</style>
