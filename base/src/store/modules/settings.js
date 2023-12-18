import variables from '@/styles/element-variables.scss'

// import defaultSettings from '../../../static/js/settings'
import Cookie from 'js-cookie'
import _ from 'lodash'

// const { showSettings, tagsView, fixedHeader, sidebarLogo, homePage } = defaultSettings
// console.log('🚀 ~ file: settings.js ~ line 9 ~ defaultSettings', defaultSettings)

const state = {
  theme: variables.theme,
  // showSettings: showSettings,
  tagsView: Cookie.get('tagsView') || 'single',
  mainCenter: Cookie.get('mainCenter') || 'full',
  menuSize: Cookie.get('menuSize') || 'default',
  menuMode: Cookie.get('menuMode') || 'normal',
  fontScale: Cookie.get('fontScale') || '1',
  // fixedHeader: fixedHeader,
  // sidebarLogo: sidebarLogo,
  // homePage: homePage,
  userSettingFavoriteId: null,
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  setUserBaseConfig({ commit }, data) {
    if (data) {
      try {
        data.favoriteContent = JSON.parse(data.favoriteContent)
      } catch (e) {
        console.log('json parse error')
      }
      commit('CHANGE_SETTING', {
        key: 'userSettingFavoriteId',
        value: data.favoriteId,
      })
      _.forEach(data.favoriteContent, (value, key) => {
        commit('CHANGE_SETTING', {
          key: key,
          value: value,
        })
      })
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

