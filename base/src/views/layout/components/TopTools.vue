<template>
  <div class="header">
    <div class="right-menu">
      <!-- <ChooseTenant v-if="tenantAdminShow && !isFullModel" /> -->
      <ChangePassword v-model="changePasswordShow" :show-close="showClose" :dialog-visible.sync="changePasswordShow" />
      <TokenManage v-if="enableTokenManage" v-model="tokenManageShow" :show-close="true" :dialog-visible.sync="tokenManageShow" />
      <PriemtonAssistant class="right-menu-item" />
      <el-tooltip  v-if="componentLibraryUrl" content="组件库">
        <el-button type="text" @click="goComponentLibrary">
            <svg-icon
              class="right-menu-item"
              style="height:18px;width:18px;margin-bottom: -2px;color:#000;margin-left: 10px;cursor: pointer;"
              icon-class="components"
            />
        </el-button>
      </el-tooltip>
      <el-tooltip v-if="helpDocUrl" content="帮助文档">
        <el-button type="text" @click="goHelpDoc" style="margin-left:0">
          <svg-icon
            class="right-menu-item"
            style="height:18px;width:18px;margin-bottom: -3px;color:#000;margin-left: 7px;cursor: pointer;"
            icon-class="help"
          />
        </el-button>
      </el-tooltip>
        
      <MailBell />
      <el-dropdown size="default" class="avatar-container right-menu-item" trigger="click" @command="clickDropDown">
        <div class="avatar-wrapper">
          <span class="people_item">
            <!--            <img :src="people" class="peopleImg" alt="">-->
            <div class="peopleInfo" :style="`background-color: ${avatarColor}`">
              {{ userInfo.userRealName[0] }}
            </div>
            <!--            <span class="peopleName" :title="userInfo.userRealName">{{ userInfo.userRealName }}</span>-->
            <!--            <span class="arrow_down">-->
            <!--              <i class="el-icon-arrow-down" />-->
            <!--            </span>-->
          </span>
        </div>
        <el-dropdown-menu slot="dropdown" style="width: 200px" data-testId="右上角下拉菜单">
          <div class="pl-10 pr-20 pb-5" style="min-height: 40px;">
            <div class="userInfo" :style="`background-color: ${avatarColor}`">
              {{ userInfo.userRealName[0] }}
            </div>
            <div class="userInfoText pt-5" :class="{'lh-30':userOrgText ? false : true}">
              <div><strong>{{ userInfo.userRealName }}</strong></div>
              <span>{{ userOrgText }}</span>
            </div>
          </div>
          <el-dropdown-item v-if="tenantAdminShow" command="tenantAdmin"><i class="el-icon-setting mr-10" /><span>{{ $t('navbar.tenantAdmin') }}</span> </el-dropdown-item>
          <el-dropdown-item divided command="changePassword"><i class="el-icon-edit mr-10" /><span>{{ $t('navbar.changePassword') }}</span>
          </el-dropdown-item>
          <el-dropdown-item v-if="enableTokenManage" command="tokenManage">
            <svg-icon class="mr-10" style="margin-bottom:3px;width: 14px;height: 14px;" icon-class="token_manage" /><span>{{ $t('navbar.tokenManage') }}</span>
          </el-dropdown-item>
          <!--          <el-dropdown-item v-if="platform ==='portal' || isPortal" command="admin">-->
          <!--            <i class="el-icon-suitcase mr-10" /><span>{{ $t('navbar.admin') }}</span>-->
          <!--          </el-dropdown-item>-->
          <!--          <el-dropdown-item v-else-if="!isExpress" command="portal">-->
          <!--            <i class="el-icon-suitcase mr-10" /><span>{{ $t('navbar.portal') }}</span>-->
          <!--          </el-dropdown-item>-->
          <el-dropdown-item divided command="setting"><i class="el-icon-setting mr-10" /><span>{{ $t('navbar.settings') }}</span>
          </el-dropdown-item>
          <div @click="logout">
            <el-dropdown-item>
              <i class="el-icon-s-unfold mr-10" /><span>{{ $t('navbar.logOut') }}</span>
            </el-dropdown-item>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <Settings :visible.sync="personalSettingShow" />
  </div>
</template>

<script>
// import ChooseTenant from '@/components/ChooseTenant'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import { localStore } from '@/utils/sessionStore'
import ChangePassword from '@/views/afcenter/user/change-password'
// import TokenManage from '@/views/afcenter/user/token-manage'
import TokenManage from '@/views/afcenter/user/token-manage/index'
import { BaseVue } from '@lib'
// import logo from '@static/images/logo.png'
import people from '@static/images/people.png'
import store from '@util/sessionStore'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import defaultSetting from '../../../../static/settings'
import PriemtonAssistant from './PrimetonAssistant.vue'
import Settings from './Settings'
import MailBell from '../../afcenter/mail/MailBell.vue'
import { get } from 'lodash'

const AvatarBgColors = [
  [200, 173, 161], // 淡粉
  [191, 207, 207], // 水蓝灰
  [237, 220, 203], // 淡肉粉
  [186, 201, 182], // 绿灰
  [157, 154, 150], // 浅灰
  [197, 181, 176] // 淡米色
]

export default {
  components: {
    ErrorLog,
    Screenfull,
    // ChooseTenant,
    ChangePassword,
    Settings,
    TokenManage,
    PriemtonAssistant,
    MailBell
  },
  mixins: [BaseVue],
  props: {},
  data() {
    return {
      people,
      // logo,
      config: Vue.config,
      changePasswordShow: false,
      tokenManageShow: false,
      personalSettingShow: false,
      tenantAdminShow: false,
      isPortal: false,
      defaultSetting,
      showClose: true,
      avatarColor: null,
      helpDocUrl: Vue.config.helpDocUrl,
      componentLibraryUrl:Vue.config.componentLibraryUrl
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
    },
    enableTokenManage() {
      const { attributes: { userFunctionCodes = [] } = {}} = this.userInfo
      return !!userFunctionCodes.find(code => code === this.FuncCode.afc_f_access_token_person)
    },
    isExpress() {
      return Vue.config.isExpress
    },
    userOrgText() {
      return get(this.userInfo, 'attributes.orgTrees', null)
    },
  },
  watch: {},
  created() {

  },
  async mounted() {
    this.handlerPasswordPolicy()
    // this.showTenantAdmin()
    this.avatarColor = this.getUserAvatarColor()
    // const resp = await this.dispatch(OrgController.findOrgById, {
    //   id: this.userInfo.userOrgId
    // })
    // debugger
  },
  methods: {
    goHelpDoc() {
      if (this.helpDocUrl) {
        window.open(this.helpDocUrl)
      }
    },
    goComponentLibrary() {
      if (this.componentLibraryUrl) {
        window.open(this.componentLibraryUrl)
      }
    },
    getUserAvatarColor() {
      const randomIndex = Math.floor(Math.random() * AvatarBgColors.length)
      const color = AvatarBgColors[randomIndex]
      return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
    },
    handlerPasswordPolicy() {
      const passwordPolicy = store.get('passwordPolicy') || { flag: false, message: '' }
      if (passwordPolicy) {
        let message = null
        if (passwordPolicy.message !== '') {
          this.showClose = !passwordPolicy.flag
          if (passwordPolicy.flag && passwordPolicy.message === 'default_password') {
            // 首次登录强制修改
            message = '默认密码强制修改'
          } else if (passwordPolicy.flag) {
            // 超期强制修改的时间
            message = `上次更新密码距今天超过${passwordPolicy.message}天，请修改密码`
          } else if (passwordPolicy.message === 'default_password') {
            // 默认密码提醒修改
            message = '当前密码为默认密码，是否修改？'
          } else {
            // 密码超期提醒的时间
            message = `上次更新密码距今天超过${passwordPolicy.message}天，请修改密码`
          }
          this.$confirm(message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            showCancelButton: this.showClose, // 不显示取消按钮
            showClose: this.showClose,
            center: true,
            type: 'warning',
          })
            .then(async() => {
              this.changePasswordShow = true
            })
            .catch(() => {
              store.set('passwordPolicy', {
                flag: false,
                message: ''
              })
            })
        }
      }
    },
    logout() {
      localStore.set('isobjectMenu', false)
      if (Vue.config.login_type === 'sso') {
        // 如果是单点登录
        this.$store.dispatch('LogOut').then(() => {
          const { origin } = window.location
          const url = `${Vue.config.ssoLogoutUrl}?SSOLOGOUT=true&service=${encodeURIComponent(`${origin}/#/login`)}&appId=${encodeURIComponent(`${origin}/`)}`
          window.location.href = url
        })
      } else if (['normal', 'micro'].includes(Vue.config.login_type)) {
        this.$store.dispatch('LogOut').then(() => {
          window.location.href = Vue.config.logoutTo || './index.html'
        })
      }
    },
    goSingleLoginPage(redirectUrl) {
      window.location.href = redirectUrl
    },

    clickDropDown(command) {
      this.isPortal = command
      if (command === 'admin') {
        // store.set('platform', null)
        this.$store.commit('SET_PLATFORM', null)
        localStore.set('isobjectMenu', false)
        window.location.href = './index.html'
        // this.choosePlatform('admin')
      } else if (command === 'portal') {
        this.$store.commit('SET_PLATFORM', 'portal')
        window.location.href = './#/portal-index?type=private'
        localStore.set('isobjectMenu', false)
        // this.choosePlatform('admin')
      } else if (command === 'tenantAdmin') {
        store.set('platform', command)
        localStore.set('isobjectMenu', false)
        window.location.href = './index.html'
        // this.choosePlatform('admin')
      } else if (command === 'workplatform') {
        this.choosePlatform('workplatform')
      } else if (command === 'changePassword') {
        this.changePasswordShow = true
      } else if (command === 'tokenManage') {
        this.tokenManageShow = true
      } else if (command === 'setting') {
        this.personalSettingShow = true
      }
    },

  },

}
</script>
<style lang="scss" scoped>

.header {
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
      .people_item{
        height: 25px;
        font-size: 16px;
        vertical-align: middle;
        .peopleImg{
          height: 27px;
          color: #ddd;
          font-size: 16px;
          vertical-align: middle;
          display: inline-block;
        }
        .peopleInfo{
          width: 27px;
          height: 27px;
          border-radius: 20px;
          display: inline-block;
          color:white;
          font-weight: bolder;
          line-height: 27px;
          text-align: center;
          margin-right: 20px;
        }
        .peopleName {
          max-width: 75px;
          display: inline-block;
          vertical-align: middle;
          /* padding-bottom: 8px; */
          overflow-x: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
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
.userInfo {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  float: left;
  color:white;
  font-weight: bolder;
  font-size: 20px;
  line-height: 40px;
  text-align: center;
  margin-right: 7px;
}
.userInfoText{
  strong{
    font-size: 16px;
  }
  span{
    margin-top: 5px;
    color: #909090;
  }
}
.lh-30 {
  line-height:30px;
}
</style>
