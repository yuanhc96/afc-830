import _ from 'lodash'
// 记录表单状态 false 未变 true 变动

const formStatus = {
  state: {
    release: false,
    build: false,
    dicts: {},

  },
  mutations: {
    SET_FORM_STATUS: (state, status) => {
      _.forEach(status, (value, key) => {
        state[key] = value
      })
    },
    ADD_DICT: (state, { key, value }) => {
      if (value === null && state.dicts[key]) { return }
      state.dicts[key] = value
      state.dicts = _.cloneDeep(state.dicts)
    },
  },
  actions: {
    setFormStatus({ commit }, status) {
      commit('SET_FORM_STATUS', status)
    },
    addDict({ commit }, dict) {
      commit('ADD_DICT', dict)
    },
  },
}

export default formStatus
