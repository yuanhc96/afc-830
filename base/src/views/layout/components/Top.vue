<template>
  <div class="header clearfix">
    <div class="logo" :style="`background:${theme}`">
      <img :src="logo">
      <span class="t1">{{ defaultSettings.navTitle }}</span>
      <span class="t2">{{ defaultSettings.navSubTitle }}</span>
    </div>
    <div class="right-menu">
      <!-- <ChooseTenant v-if="tenantAdminShow && !isFullModel" /> -->
      <ChooseWorkList class="right-menu-item" />
      <ChooseProject class="right-menu-item" />
      <ChooseWorkPlatform class="right-menu-item" />
      <ChangePassword v-model="changePasswordShow" :dialog-visible.sync="changePasswordShow" />
      <el-dropdown size="default" class="avatar-container right-menu-item" trigger="click" @command="clickDropDown">
        <div class="avatar-wrapper">
          <span>
            <img :src="people" class="peopleImg" alt="">
            {{ userInfo.userId }}
            <i class="el-icon-arrow-down" />
          </span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="tenantAdminShow" command="tenantAdmin"><i
            class="el-icon-setting"
          />{{ $t('navbar.tenantAdmin') }} </el-dropdown-item>
          <el-dropdown-item command="admin"><i class="el-icon-setting" /> {{ $t('navbar.admin') }}

          </el-dropdown-item>
          <el-dropdown-item command="changePassword"><i class="el-icon-edit" /> {{ $t('navbar.changePassword') }}
          </el-dropdown-item>
          <div @click="logout">
            <el-dropdown-item divided>
              <span style="display:block;"><i class="el-icon-close" /> {{ $t('navbar.logOut') }}</span>
            </el-dropdown-item>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
// import ChooseTenant from '@/components/ChooseTenant'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import ChangePassword from '@/views/afcenter/user/change-password'

import {
BaseVue
} from '@lib'
import logo from '@static/images/logo.png'
import people from '@static/images/people.png'
import store from '@util/sessionStore'
import Vue from 'vue'
import {
mapGetters
} from 'vuex'
export default {
  components: {
    ErrorLog,
    Screenfull,
    // ChooseTenant,
    ChangePassword
  },
  mixins: [BaseVue],
  props: {},
  data() {
    return {
      people,
      logo,
      config: Vue.config,
      changePasswordShow: false,
      personalSettingShow: false,
      tenantAdminShow: false,
      defaultSettings
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'name', 'avatar', 'roles', 'pageModel']),
    isAdmin() {
      return ['sysadmin'].some(role => this.$store.getters.roles.some(r1 => r1 === role))
    },
    isFullScreen() {
      return this.pageModel === 'fullscreen'
    },
    currentPlatformName() {
      if (this.platform === 'admin' || this.platform === 'tenant') {
        return '管理平台'
      } else if (this.platform === 'tenantAdmin') {
        return '租户管理平台'
      } else if (this.platform === 'workplatform') {
        return '我的工作台'
      } else return null
    },
    hamburgarDisable() {
      return this.$route.name === 'dashboard' && this.currentPlatformName === null
    }
  },
  watch: {},
  created() {},
  mounted() {
    // this.showTenantAdmin()
  },
  methods: {
    logout() {
      if (Vue.config.login_type === 'single') {
        // 如果是单点登录需要调用后端接口，使后台登录状态改为注销才能彻底注销用户
      } else if (['normal', 'micro'].includes(Vue.config.login_type)) {
        this.$store.dispatch('LogOut').then(() => {
          this.$router.push({
            name: 'login'
          })
        }).catch(() => {
          this.$router.push({
            name: 'login'
          })
        })
      }
    },
    goSingleLoginPage(redirectUrl) {
      window.location.href = redirectUrl
    },
    clickDropDown(command) {
      if (command === 'admin' || command === 'tenantAdmin') {
        store.set('platform', command)
        window.location.href = './index.html'
        // this.choosePlatform('admin')
      } else if (command === 'workplatform') {
        this.choosePlatform('workplatform')
      } else if (command === 'changePassword') {
        this.changePasswordShow = true
      } else if (command === 'setting') {
        this.personalSettingShow = true
      }
    },

  },
}

</script>
<style lang="scss" scoped>
  .logo {
    float: left;
    padding-left: 25px;
    font-weight: bold;

    img {
      display: inline-block;
      vertical-align: middle;
      height: 36px;
      margin-right: 10px;
    }
    span {
      display: inline-block;
      vertical-align: middle;
      line-height: 50px;
    }
  }

  .t1 {
    font-size: 24px;
    color: #2987F7;
  }

  .t2 {
    font-size: 20px;
    color: #000000;
    margin-left: 10pxy;
  }

  .header {
    background: #ffffff;
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    position: relative;

    .fullscreen-header {
      /*background: #409eff;*/
      cursor: pointer;
      height: 50px;
      width: 200px;
      float: left;
      opacity: .8;

      /*border-bottom-right-radius: 100%;*/
      .icon {
        /*background: #409eff;*/
        /*border-radius: 25%;*/
        display: inline-block;
        width: 39px;
        height: 39px;
        line-height: 39px;
        text-align: center;
        font-size: 28px;
        margin-left: 10px;
      }

      .title {
        font-size: 22px;
        color: #409eff;
        /*font-weight: 600;*/
      }
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      user-select: none;
      float: right;
      height: 100%;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        margin: 0 0px;
      }

      .screenfull {
        height: 50px;
        line-height: 50px;
        transform: translate(0, 10px);
      }

      .international {
        vertical-align: top;
      }

      .theme-switch {
        vertical-align: 15px;
        transform: translate(0, 10px);
      }

      .avatar-container {
        cursor: pointer;
        padding: 0px 8px;

        // &:hover {
        //   background: #dcdfe6;
        // }
        span {
          color: #444549;
          font-size: 16px;

          .peopleImg {
            width: 26px;
            height: 26px;
            vertical-align: middle;
            margin-right: 3px;
          }
        }

      }
    }

    .workplatform {
      font-size: 14px;
      width: 80px;
      color: #606266;
      text-align: center;
      cursor: pointer;

      &:hover {
        background: #dcdfe6;
      }
    }
  }

</style>
