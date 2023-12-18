<template>
  <div v-if="!loginType" class="text-center mt-50 f-20"><i class="el-icon-loading" />登录跳转中...</div>
  <div v-else-if="loginType === 'normal'">
    <component :is="loginType" :url="loginUrl" />
  </div>
  <div v-else-if="loginType === 'micro'">
    <RemoteComponent
      v-if="loginPage.page"
      :page="loginPage.page"
      
      :module="loginPage.module"
      :remote-path="loginPage.remotePath"
      v-bind="$route.query"
    />
  </div>
  <div v-else-if="loginType === 'sso'">
    <SSO :url="ssoLoginUrl"></SSO>
  </div>
</template>
<script>
import { BaseVue} from '@lib'
import { setLoginType } from '@/utils/auth.js'
import Vue from 'vue'
import RemoteComponent from '@/components/RemoteComponent/index.vue'

import Normal from './login-normal.vue'
import IAM from './login-iam.vue'
import SSO from './sso.vue'
import Cookie from 'js-cookie'
import { localStore } from '@/utils/sessionStore'
import { removeWatermark } from '@/utils/watermark'

export default {
  name: 'index',
  components: { Normal, IAM, RemoteComponent, SSO },
  mixins: [BaseVue],
  props: {},

  data() {
    return {
      loginType: '',
      loginUrl: '',
      ssoLoginUrl: '',
      loginPage: {}
    }
  },
  computed: {},
  mounted() {
    const { loginPage, login_type, ssoLoginUrl } = Vue.config
    this.loginType = login_type
    this.loginPage = loginPage
    this.ssoLoginUrl = ssoLoginUrl
   
    setLoginType(login_type)
    Cookie.get('theme') || Cookie.set('theme', 'blue')
    localStore.set('uniqueId', '')
    localStore.set('menus' || [])
    removeWatermark()
  }

}
</script>
