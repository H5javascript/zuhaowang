import * as types from './types'
export default {
  [types.MESSAGE_LIST] (state, unread) {
    state.unreadObj = unread
  },
  [types.GRABORDER_LIST] (state, grabMsg) {
    state.grabMsg = grabMsg
  },
  [types.RESET_QIANGDAN] (state, qiangdanBoolean) {
    state.isShowQiangdan = qiangdanBoolean
  },
  [types.DELETE_QIANGDAN] (state) {
    delete state.grabMsg
  },
  [types.DELETE_UNREAD] (state) {
    console.log(state.unreadObj)
    for (var key in state.unreadObj) {
      state.unreadObj[key] = 0
    }
  }
}
