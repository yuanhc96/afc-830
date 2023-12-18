<template>
  <div v-loading="loading">
    <iframe id="child" ref="Iframe" :src="url" class="iframe" frameborder="0" />
  </div>
</template>
<script>
import ajaxUtil from '@/libs/ajaxUtil'
import { replaceValueByUser } from "@util/tools.js"
import localStore from "store"
import { mapGetters } from "vuex"
export default {
  name: "iframe",
  computed: {
    ...mapGetters(["userInfo"]),
    path() {
      return this.urlConfig
        ? this.$route.meta.origin.indexOf("?") > -1
          ? this.$route.meta.origin + `&${this.getParams()}`
          : this.$route.meta.origin + `?${this.getParams()}`
        : this.$route.path;
    },
    urlConfig() {
      return this.$route.meta.resource
        ? JSON.parse(this.$route.meta.resource.content)
        : { url: "" };
    },
    url() {
      if(this.urlConfig.biType && ['cockpit','freelayout'].includes(this.urlConfig.biType)){
        //报表资源
      this.getBiResUrl(this.urlConfig)
      return this.BiUrl 
      }else{
        if(this.urlConfig.params){
          console.log(this.urlConfig,'this.urlConfig')
          if(this.urlConfig.params.indexOf('${') !== -1){
            let params = replaceValueByUser(this.urlConfig.params)
            return `${this.urlConfig.url}${params}`
          }else{
            return `${this.urlConfig.url}${this.urlConfig.params}`
          }
        }else{
          return this.urlConfig.url;
        }
      }
    },
  },
  data(){
    return{
      BiUrl:'',
      loading: false,
    }
  },
  watch: {},
  created() {
    console.log(this.$route.meta);
  },
  mounted() {
  // this.iframeLoad();
  },
  methods: {
    getParams() {
      return Array.isArray(this.urlConfig.params)
        ? this.urlConfig.params
            .map((item) => {
              item.value === "{uniqueId}" &&
                (item.value = localStore.get("uniqueId"));
              item.value === "{userId}" && (item.value = this.userInfo.userId);
              return item;
            })
            .reduce((str, v, k) => {
              return str + `${v.name}=${v.value}&`;
            }, "")
        : "";
    },
    //获取BI token
    getBIToken(payload){
      return ajaxUtil.ajax({
        url: `/api/afc/bi-api-token?appCode=${payload.appCode}`,
        method: 'get',
        data: payload,
      })
    },
    getBiResUrl(BiResContent){
      let url = ''
        this.getBIToken({appCode:this.urlConfig.appCode}).then((res) => {
        if(res){
          const baseUrl = res.data.url
          const token = res.data.token
          const bus_token = res.data.bus_token
          const biId = BiResContent.biId
          const htmlType = 'cockpit' === BiResContent.biType ? 'cockpit':'render'
          const params = BiResContent.params ? `&${BiResContent.params}` : '' 
          url = `${baseUrl}/${htmlType}.html?boardId=${biId}&token=${token}&bus_token=${bus_token}${params}&mode=1&showExport=true`
        }
        console.log(url,'url')
        this.BiUrl = url
        })
    },
    iframeLoad(){
      this.loading = true;
      const iframe = this.$refs.Iframe;
      if (iframe.attachEvent) { // IE
        iframe.attachEvent('onload', () => { this.loading = false; });
      } else { 
        iframe.onload =  () => { this.loading = false; };
      }
    }

  },
};
</script>
<style lang="scss" scoped>
.iframe {
  width: 100%;
  height: calc(100vh - 95px);
}
</style>
