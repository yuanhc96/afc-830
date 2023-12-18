<template>
  <div class="logo-box" @click="gotoPlatform">
    <div v-if="title == 'AFCenter'" class="logo_real svgicon" />
    <svg-icon v-else class="svg-back" icon-class="back" />
    <!-- <span v-if="title!=='AFCenter'" class="t1 text-ellipsis" :title="title">{{title}}</span> -->
    <span class="t2 text-ellipsis" />
  </div>
</template>
<script>
import router from '@/router'
// import store from '@/store/index.js'
import { localStore } from '@/utils/sessionStore'
import { getQueryVariable } from '@/utils/tools'
import { AppController } from '@controller'
import { BaseVue } from '@lib'
export default {
  mixins: [BaseVue],
  data() {
    return {
      title: 'AFCenter'
    }
  },
  async mounted() {
    const businessObjInstNama = localStore.get('businessObjInstNama')
    const appId = getQueryVariable('appId')
    if (localStore.get('isobjectMenu')) {
      if (businessObjInstNama) {
        this.title = businessObjInstNama
      }
    } else if (appId) {
      const app = await this.getAppbyId(appId)
      this.title = app.name
    } else {
      this.title = 'AFCenter'
    }
  },
  methods: {
    gotoPlatform() {
    // const appId = getQueryVariable('appId')
    // if(this.title !=='AFCenter' || appId) {
    //   return;
    // }
      const { origin } = location
      // 业务对象返回
      if (localStore.get('isobjectMenu')) {
        localStore.set('isobjectMenu', false)
        // 拼装路由后，再跳转
        this.setRouter()
        window.location.href = localStore.get('returnPlatformRouter') || origin
        window.location.reload()
      // window.location.href = '/'
      }
      // else if(appId){
      //   window.location.href = localStore.get('returnPlatformRouter') || origin
      //   window.location.reload()
      // }
    },
    async getAppbyId(id) {
      const resp = await this.dispatch(AppController.findApp, { id: id })
      if (!resp.error) {
        return resp.data
      }
    },
    setRouter() {
      this.$store.dispatch('GetUserInfo').then(res => {
        this.$store.dispatch('GenerateRoutes').then(() => {
          router.addRoutes(this.$store.getters.addRouters)
          this.$store.dispatch('setNeedGetPermission', false)
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.logo-box {
  cursor: pointer;
  line-height: 1;
  // margin-top: 15px;
  // margin-left: 13px;
  font-weight: bold;
  display: flex;
  align-items: center;
  .t1 {
    font-size: 20px;
    width: 100px;
    margin-top: 15px;
    color: #909191;
  }

  .t2 {
    font-size: 20px;
    margin-top: 15px;
    color: #000000;
    margin-left: 10px;
  }

  .svgicon {
    width: 138px;
    height: 50px;
    vertical-align: middle;
    margin: 0px 0px 0 23px;
  }

  .svg-back {
    margin-left: 20px;
    width: 40px;
    height: 40px;
  }
}
</style>
