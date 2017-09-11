import {getUserItem} from '../../utils'
export default {
  getUnread ({commit}, {http}) {
    http.get('api/account/unread', {
      headers: {
        ZHToken: getUserItem('user').token
      }
    }).then(res => {
      let data = res.data.data
      if (res.data.code === 'NOT_MEMBER') {
        data = {
          messageCount: 0,
          orderCount: 0,
          sysMessageCount: 0,
          ticketReplyCount: 0,
          userMessageCount: 0
        }
      }
      commit('ALL_STATUS', data)
    }, () => {
    })
  },
  getGrabOrder ({commit}, {http}) {
    http.get('api/account/enable/rush', {
      headers: {
        ZHToken: getUserItem('user').token
      }
    }).then(res => {
      if (res.data.code === 'Ok') {
        let data = res.data.data
        if (data !== null) {
          commit('RESET_QIANGDAN', true)
          commit('GRABORDER_LIST', data)
        } else {
          commit('RESET_QIANGDAN', false)
          commit('DELETE_QIANGDAN')
        }
      } else {
        commit('DELETE_QIANGDAN')
      }
    }, () => {
    })
  }
}
