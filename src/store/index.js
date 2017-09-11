/**
 * Created by Administrator on 2017/7/25 0025.
 */
import Vuex from 'vuex'
import Vue from 'vue'
import unread from './unread/index'

Vue.use(Vuex)

/* eslint-disable no-new */
export default new Vuex.Store({
  modules: {
    unread
  }
})
