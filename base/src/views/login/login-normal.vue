<template>
  <div
    v-loading="loginLoading"
    class="login-container"
    element-loading-text="登录加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    style="background-image:url(../../../static/images/home/bg1.jpg);"
  >
    <!-- <el-image fit="cover" :src="currentBgSrc" alt="" style="width: 100%;height: 100%;"></el-image> -->
    <!-- 添加普元logo区域 -->

    <div style="border-top: 1px" class="div-near-top-left z_index">
      <img
        v-if="loginLogoVisible"
        :src="primetonLogo"
        class="primetonLogo"
      >
    </div>

    <div style="border-top: 1px;" class="div-near-top-right z_index language ">
      <img src="../../../static/images/language.svg" style="margin-right: -10px;" alt="">
      <el-select v-model="currentLang" placeholder="请选择" style="width:120px" @change="selectChange">
        <el-option v-for="item in languageOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <div
      class="login-container z_index"
    >
      <div class="title-container">
        <h3 class="title">
          <span>
            ADP&MASA系统
          </span>
        </h3>
      </div>
      <div style="background:url(../../../static/images/home/form-frame.png) 0 0 /438px 435px no-repeat;">
        <div style="color: #fff; border-left: 3px solid #0ad4f3;height: 20px; font-size: 16px; padding-left: 5px;margin: 35px;">
          账号登录
        </div>
        <el-form
        ref="loginForm"
        :auto-complete="!isRemember ? 'off' : 'on'"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            :auto-complete="!isRemember ? 'off' : 'on'"
            placeholder="请输入账号"
            @keypress.enter.native="handleLogin"
          >
          <span slot="prepend">
            <img src="../../../static/images/home/account.png" alt="" style="margin:10px; height: 30px;">
          </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            :type="passwordType"
            :auto-complete="!isRemember ? 'off' : 'on'"
            placeholder="请输入密码"
            @keypress.enter.native="handleLogin"
          >
          <span slot="prepend">
            <img src="../../../static/images/home/password.png" alt="" style="margin:10px; height: 30px;">
          </span>
          </el-input>
          <span class="show-pwd" @click="showPwd">
            <i v-if="passwordType === 'password'" style="font-size:20px" class="iconfont icon-Notvisible1" />
            <i v-else class="el-icon-view" />
          </span>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item v-if="showVerifiedCode" prop="verifyCode" style="width:50%">
          <span class="svg-container svg-container_login"><i class="el-icon-key" /></span>
          <el-input
            v-model="loginForm.verifyCode"
            auto-complete="off"
            placeholder="验证码"
            @keypress.enter.native="handleLogin"
          />
        </el-form-item>
        <div v-if="showVerifiedCode" v-loading="verifiedLoading" class="fr img-box" @click="getVerificationCode">
          <img :src="imgSrc" alt="请检查网络">
        </div>
        <div class="scanning">
          <el-checkbox v-model="isRemember">记住密码</el-checkbox>
        </div>
        <!-- 拖动验证模块 -->
        <!-- <el-collapse-transition>
        <SlideVerify v-if="showVerification" v-model="verification" :width="365" @success="handleLogin" />
      </el-collapse-transition> -->

        <!-- 不需要滑块验证 登录按钮直接调用 handleLogin-->
        <el-button
          size="small"
          type="primary"
          style="width:100%;margin-bottom:10px; background-color:#4ba5fd;"
          :loading="loading"
          @click.native.prevent="handleLogin"
        >{{ $t('login.logIn') }}

        </el-button>
      </el-form>
      </div>
      
    </div>
      
    <!-- <div class="text-center copyright z_index">
      <el-tooltip class="item" effect="dark" :content="buildInfos" placement="top">
        <span> {{ recordLabel }}</span>
      </el-tooltip>
    </div> -->
  </div>
</template>

<script>
import { getKey, getThirdParty, getVerifiedCode, isMustChangePsword, login, loginByScanning, oauthLogin } from '@/api/login.js'
import Vue from 'vue'
// import SlideVerify from '@/components/SlideVerify/index'
import { getOriginUrl, removeOriginUrl } from '@/utils/auth'
import primetonLogo from '@static/images/home/tianma_logo.png'
import defaultSetting from '@static/settings'
import store from '@util/sessionStore'
import Cookies from 'js-cookie'
import JSENcrypt from 'jsencrypt'
export default {
  name: 'login',
  // components: { SlideVerify },
  data() {
    let loginForm = {
      code: '',
      password: '',
      verifyCode: null
    }
    if (process.env.NODE_ENV === `development`) {
      loginForm = {
        code: 'admin',
        password: '111111',
        verifyCode: null
      }
    }
    return {
      showVerifiedCode: false,
      loginForm: loginForm,
      loginRules: {
        code: [
          { required: true, message: '账号是必填项' },
        ],
        password: [
          { required: true, message: '密码是必填项' },
        ],
        verifyCode: [
          { required: true, message: '验证码是必填项' },
          { min: 4, max: 4, message: '验证码必须是4位数' }
        ],
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      primetonLogo,
      defaultSetting,
      imgSrc: '',
      verifiedLoading: false,
      loginLoading: false,
      ProTitle: Vue.config.title,
      loginBgSwitch: Vue.config.loginBgSwitch,
      recordLabel: Vue.config.recordLabel,
      loginLogoVisible: Vue.config.loginLogoVisible,
      loginType: false, // true为认证登录页面
      target_uri_callback: '',
      languageOptions: [{
        value: 'zh_CN',
        label: '中文(简体)'
      }, {
        value: 'en_US',
        label: 'English(US)'
      }
      ],
      currentLang: Cookies.get('language') || 'zh_CN',
      showScan: true,
      srcList: [
        '../../../static/images/home/login-left0.svg',
        '../../../static/images/home/login-left1.svg',
        '../../../static/images/home/login-left2.svg',
        '../../../static/images/home/login-left3.svg',
        '../../../static/images/home/login-left4.svg',
        '../../../static/images/home/login-left5.svg',
        '../../../static/images/home/login-left6.svg',
      ],
      currentBgSrc: '',
      isRemember: false,
      buildInfos: JSON.stringify(Vue.config.buildInfos) || Vue.config.recordLabel, 
      loginPageTitlePrefixLogo: Vue.config.loginPage.titlePrefixLogo || '../../../static/images/home/logo-afc.svg'
    }
  },
  watch: {},
  mounted() {
    this.showScan = Vue.config.ableScan
    const { search, hash, href } = window.location
    const mustArr = ['client_id', '?redirect_uri', 'token']
    if (mustArr.every(i => href.indexOf(i) !== -1)) {
      const target_url = decodeURIComponent(href)
      this.loginType = true
      this.ProTitle = 'Auth Login'
      const index = target_url.indexOf('?redirect_uri')
      this.target_uri_callback = target_url.substring(index + 14)
      // console.log('target_uri_callback====',this.target_uri_callback)
    } else {
      this.handlerScan(search || hash)
    }
    this.showVerifiedCode = store.get('showVerifiedCode') || false
    if (this.showVerifiedCode) {
      this.getVerificationCode()
    }
  },
  created() {
    // 根据日期更换背景图
    if (this.loginBgSwitch) {
      const date = new Date().getDay()
      this.currentBgSrc = this.srcList[date]
    } else {
      this.currentBgSrc = this.srcList[0]
    }
    store.set('system', null)
    this.$store.commit('SET_PLATFORM', null)
  },
  destroyed() {
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    rsaKey(publicKey, password) {
      const encrypt = new JSENcrypt()
      encrypt.setPublicKey(publicKey)
      return encrypt.encrypt(password)
    },
    getVerificationCode() {
      getVerifiedCode().then(res => {
        this.$set(this, 'imgSrc', res.data)
      })
        .catch(error => {
          this.$msg.error(`${error.data && error.data.message || '获取验证码失败!'}`)
        })
    },
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          this.loading = true

          // showVerifiedCode 判断是否要检验验证码
          if (this.showVerifiedCode) {
            // 如果校验结果错误，直接return，抛错--验证码错误
          }
          getKey().then(res => {
            const { data, type } = res.data
            let password = this.loginForm.password
            if (type === 'RSA') {
              password = this.rsaKey(data, this.loginForm.password)
            } else if (type === 'SM2') {
              password = sm2Encrypt(password, data, 0)
            }
            const loginForm = {
              user: {
                code: this.loginForm.code,
                password,
              }
            }
            if (this.showVerifiedCode) {
              this.$set(loginForm, 'verifyCode', this.loginForm.verifyCode)
            }
            if (this.loginType) {
              const target_url = decodeURIComponent(window.location.href)
              const clientIdStr = target_url.substring(target_url.indexOf('client_id') + 10)
              const clientId = clientIdStr.substring(0, clientIdStr.indexOf('&'))
              const token = target_url.substring(target_url.indexOf('token') + 6)
              this.$set(loginForm, 'clientId', clientId)
              this.$set(loginForm, 'token', token)
              oauthLogin(loginForm).then(resp => {
                this.showVerifiedCode = false
                store.set('showVerifiedCode', false)
                window.location.href = this.target_uri_callback
                console.log(resp, '登录成功')
              }).catch(error => {
                this.$msg.error(`${error.data && error.data.message || '登录失败!'}`)
                if (error.data.errorCode === '100301' || error.data.errorCode === '100308') {
                  store.set('showVerifiedCode', true)
                  this.$nextTick(async() => {
                    await this.getVerificationCode()
                    this.showVerifiedCode = true
                  })
                }
                this.loading = false
              })
            } else {
              login(loginForm).then(resp => {
                this.$store
                  .dispatch('LoginByUsername', {
                    ...resp.data,
                    code: this.loginForm.code,
                  })
                  .then(() => {
                    this.showVerifiedCode = false
                    store.set('showVerifiedCode', false)
                    isMustChangePsword().then(res => {
                      store.set('passwordPolicy', res.data)
                      if (store.get('lastRoute')) {
                        this.$router.push(store.get('lastRoute'))
                        store.set('lastRoute', null)
                      } else if (Vue.config.homePage && Vue.config.homePage === 'portal') {
                        this.$store.commit('SET_PLATFORM', 'portal')
                        // this.$router.push('portal-index')
                        this.$router.push({ path: 'portal-index', query: { type: 'private' }})
                      } else {
                        this.$store.commit('SET_PLATFORM', null)
                        const url = getOriginUrl() || './index.html'
                        removeOriginUrl()
                        window.location.href = url
                      }
                    })
                  })
              })
                .catch(error => {
                  this.$msg.error(`${error.data && error.data.errorLocalizedMessage || '登录失败!'}`)
                  this.loading = false
                  if (error.data.errorCode === '100301' || error.data.errorCode === '100319' || error.data.errorCode === '100308' || error.data.errorCode === '100307') {
                    store.set('showVerifiedCode', true)
                    this.$nextTick(async() => {
                      await this.getVerificationCode()
                      this.showVerifiedCode = true
                    })
                  }
                })
            }
          }).catch(error => {
            this.$msg.error(`${error.data && error.data.message || '获取加密失败!'}`)
            this.loading = false
          })
        }
      })
    },
    redirectScan() {
      getThirdParty()
        .then((res) => {
          window.location.href = res.data
        })
        .catch(error => {
          this.$msg.error(`${error.data && error.data.errorLocalizedMessage || '获取扫码失败!'}`)
        })
    },
    handlerScan(val) {
      const index = val.indexOf('?')
      if (val.indexOf('?') !== -1) {
        this.loginLoading = true
        let data = val.slice(index + 1).split('&')
        data = data.map(i => {
          const item = i.split('=')
          return {
            [item[0]]: item[1]
          }
        })
        const obj = {
          code: null,
          state: null
        }
        data.forEach(i => {
          obj.code = i.code || i.authCode || obj.code
          obj.state = i.state || obj.state
        })
        loginByScanning(obj)
          .then((res) => {
            this.$store
              .dispatch('LoginByUsername', {
                ...res.data,
                code: res.data.userName,
              })
              .then(() => {
                isMustChangePsword().then(res => {
                  store.set('passwordPolicy', res.data)
                  window.location.href = './index.html'
                })
              })
          })
          .catch((error) => {
            this.$msg.error(`${error.data && error.data.message || '扫码登录失败!'}`)
            window.location.href = './index.html'
            this.loginLoading = false
          })
      }
    },
    selectChange(val) {
      Cookies.set('language', val)
      location.reload()
    }
  },
}
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg: #2d3a4b;
  $light_gray: #eee;
  @import '~@/styles/variables.scss';

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 80%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: #000000;
        height: 47px;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px #EFEFEF inset !important;
          -webkit-text-fill-color: #000000 !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      // background: #EFEFEF;
      background: transparent;
      border-radius: 4px;
      color: #454545;
    }
     .el-icon-loading {
      height: unset !important;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #4E93FD;
  $light_gray: #eee;
  .login-container {
    display: flex;
    position: fixed;
    height: 100%;
    width: 100%;
    background-size: cover;
    .left,.right {
      flex: 1;
      text-align: center; /* 水平居中 */
      display: flex;
      justify-content: center; /* 水平居中 */
      align-items: center; /* 垂直居中 */
    }
    .left{
      background:#edf9fb;
    }
    .right {
      max-width: 800px;
      background:#fdffff;
    }
    .language{
     ::v-deep .el-input input {
        color: #3672aa !important;

      }
    }
    .login-container {
      .login-form {
        width: 437px;
        padding: 0px 35px 15px 35px;
      }
      width: 437px;
      padding: 65px 35px 15px 35px;
      position: absolute;
      top: 25%;
      left: 50%;
      transform: translateX(-50%);
      
      // margin: auto 100px;
      ::v-deep .el-form-item__content {
        // background: #eaf0ff !important;
        background: transparent;
        border: 2px solid #91c0d9;
        border-radius: 8px;
      }
      ::v-deep .el-input-group__append, ::v-deep .el-input-group__prepend {
        border: none;
        padding: 0px 5px;
        background: transparent;
      }
      .el-form-item__content .el-input-group {
          display: flex;
      }
      ::v-deep .el-input input {
        padding-left: 45px;
      }
      ::v-deep input.el-input__inner {
        color: #fff !important;
      }
      .scanning {
        text-align: left;
        margin-bottom: 20px;
        .el-checkbox, ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
          color: #1092e0;
        }
        .el-link.el-link--primary {
            color: #4E93FD;
        }
      }
      .el-form-item {
        span {
          i {
            color: #1b5189;
            font-weight: 700;
          }
          .el-icon-key {
            color: #1092e0;
            font-size: 33px;
            margin-left: 12px;
          }
        }
      }
    }
    .el-form-item {
      .el-select {
        width: 90%;
        ::v-deep .el-input__icon {
          margin-right: -119px;
        }
      }
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title-container {
      width: 470px;
      position: absolute;
      top: 0px;
      left: 0px;
      .title {
        font-size: 30px;
        color: #01a5d5;
        margin: -10px auto;
        text-align: center;
        font-weight: normal;
      }
      .set-language {
        color: #fff;
        position: absolute;
        top: 5px;
        right: 0px;
      }
      img{
        height: 50px;
      }
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    .thirdparty-button {
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
  }

  .primetonLogo {
    width: 520px;
    margin: 40px;
  }

  .el-form .el-button--primary {
    height: 45px;
    border-radius: 4px;
    font-size: 16px;
    background: #3672aa;
  }

  .el-form-item--mini.el-form-item {
    margin-bottom: 25px;
  }

  .copyright {
    position: absolute;
    bottom: 15px;
    width: 100%;
    font-size: 14px;
    color: #355fa4;
    text-align: center;
  }
  .img-box {
    height: 40px;
    background-color: #dcdfe6;
    position: absolute;
    // bottom: 115px;
    top: 320px;
    right: 5px
  }
  ::v-deep .el-input__suffix-inner {
    display: none !important;
  }
  .z_index {
    z-index: 2;
  }
  .ml--35 {
    margin-left: -35px;
  }

</style>
