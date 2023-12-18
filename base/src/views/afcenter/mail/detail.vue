<template>
  <el-container class="mail_wrap detail">
    <el-header>
      <div class="title">
        <h1>
          {{ message.messageTitle }}
        </h1>
      </div>
      <time class="date">
        {{ message.sendTime }}
      </time>
    </el-header>
    <el-main>
      <div v-if="message.messageOpenType!=='url_popover'" v-dompurify-html="message.messageContext" class="context" />
      <iframe v-else width="100%" style="height:60vh" :src="message.messageUrl" frameborder="0" />
    </el-main>
  </el-container>
</template>

<script>
import { StationMessageController } from '@controller'
import VueDompurifyHtml from 'vue-dompurify-html'
import Vue from 'vue'
Vue.use(VueDompurifyHtml)
export default {

  inject: ['updateCount'],
  name: '',
  components: {},
  props: {
    message: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {
    this.readMail()
  },
  beforeDestroy() {
    this.$emit('showMessage', false)
  },
  methods: {
    readMail() {
      if (this.message.stationStatus == '0') {
        this.dispatch(StationMessageController.haveRead, { ids: [this.message.id] }).then(resp => {
          this.updateCount()
        }
        )
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.detail{
    margin-top: 20px;
    border: 1px solid #E1E6EB;
    height:calc(100vh - 200px);
}
.title{
      text-align: center;
    border-bottom: 1px solid #E1E6EB;
    h1{
      margin: 0 0 5px 0;
    }
    // margin-bottom: 20px;
}
.date{
  display: block;
  width: 100%;
  text-align: center;
}
</style>
