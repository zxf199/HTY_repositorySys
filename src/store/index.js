import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state = {
  data: null,
  customerInfo: null,
  comments: '',
  commentsVal: '',
  hasSelectedRow: []
}
const getters = {
  getState (state) {
    return state.data
  },
  getCustomerInfo (state) {
    return state.customerInfo
  },
  getSelectedRow (state) {
    return state.hasSelectedRow
  }
}
const mutations = {
  getInfo (state, num) {
    state.data = num
  },
  setCustomerInfo (state, data) {
    state.customerInfo = data
  }
}
const actions = {
  setInfo (context, num) {
    context.commit('getInfo', num)
  },
  setCusInfo (context, data) {
    context.commit('setCustomerInfo', data)
  }
}
const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

export default store
