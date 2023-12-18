<template>
  <el-dialog
    :title="`查询日志(${logTitle})`"
    :visible.sync="dialogVisible"
    :fullscreen="true"
    append-to-body
    @closed="close"
  >
    <div>
      <DispatchingRecord :defaultQuery="defaultQuery"/>
    </div>
  </el-dialog>
</template>
<script>
import DispatchingRecord from '../../dispatching-record/index'
export default {
  components: {DispatchingRecord},
  props: {
    dialogVisible:{
      type:Boolean,
      default:false
    },
    logTitle:{
      type:String,
      default:""
    },
    defaultQuery:{
      type:Object,
      default:()=>{
        return {}
      }
    }
  },
  data() {
    return {
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    close(){
      this.$emit('update:dialogVisible',false)
    }
  },
}
</script>
<style lang="scss" scoped>
</style>
