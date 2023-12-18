<template>
  <div v-loading="loading">
    <div class="log_container" v-html="content"></div>
  </div>
</template>
<script>
import { JobLogController } from '@controller';
import { BaseVue } from '@lib';
export default {
  name: 'log',
  mixins: [BaseVue],
 
  data() {
    return {
      content: '',
      loading: false
    }
  },
  created() {
    document.title = '执行日志'
  },
  mounted() {
    const { href } = window.location
    const string = href.slice(href.indexOf('?')+ 1)
    const logId = string.slice(string.indexOf('logId=') + 6)
    this.getData(logId)
  },
  computed: {
    apiPrefix() {
      if(Vue.config.isExpress){
        return `/`
      } else {
        return '/afc/'
      }
    }
  },
  methods: {
    async getData(logId) {
      this.loading = true
      const resp = await this.dispatch(JobLogController.logDetailCat, {
        logId,
        fromLineNum: 1
      })
      this.loading = false
      const { code, content, msg } = resp.data
      // this.content = "2023-06-07 14:56:30 [com.xxl.job.core.thread.JobThread#run]-[133]-[xxl-job, JobThread-6-1686120990260] <br>----------- xxl-job job execute start -----------<br>----------- Param:\n2023-06-07 14:56:30 [com.xxl.job.core.thread.JobThread#run]-[179]-[xxl-job, JobThread-6-1686120990260] <br>----------- xxl-job job execute end(finish) -----------<br>----------- Result: handleCode=200, handleMsg = null\n2023-06-07 14:56:30 [com.xxl.job.core.thread.TriggerCallbackThread#callbackLog]-[197]-[xxl-job, executor TriggerCallbackThread] <br>----------- xxl-job job callback finish.\n"
      if (code === 200) {
        this.content = content?.logContent
      } else {
        this.$msg.error(msg)
      }
      this.content = this.content +  '<br><br><span style="color:green;"> [Load Log Finish]<span>'
    }
  },
}
</script>
<style lang="scss" scoped>
  .log_container {
    margin: 20px 50px;
    padding: 15px;
    min-height: 150px;
    font-size: 13px;
    line-height: 1.42857143;
    color: #333;
    font-family: Menlo,Monaco,Consolas,"Courier New",monospace;
    word-break: break-all;
    word-wrap: break-word;
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>