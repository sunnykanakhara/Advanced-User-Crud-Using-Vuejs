import Vue from 'vue'
import Vuex from 'vuex'
import {user} from './user/user'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user
  },
  plugins: [createPersistedState({
    paths: ["user"]
  })]
})
