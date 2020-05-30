import Vue from 'vue'
import Vuex from 'vuex'
import undoRedo from './plugins.js'

import state from './state'
import actions from './actions.js'
import mutations from './mutations.js'

Vue.use(Vuex)
Vue.use(undoRedo)

export default new Vuex.Store({
  state,
  mutations,
  actions
})
