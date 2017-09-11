import Vue from 'vue'
import Router from 'vue-router'

/*  这里是首页模块的所有页面 */
import HomeRoot from '../pages/home/HomeRoot.vue'
import Home from '../pages/home/Home.vue'
import IndexCount from '../pages/home/indexCountList/IndexCount.vue'
import DetailCount from '../pages/home/detailCount/DetailCount.vue'
import PayCount from '../pages/home/payCount/PayCount.vue'

/*  这里是消息模块的所有页面 */
import MessageRoot from '../pages/message/MessageRoot.vue'
import MessageList from '../pages/message/messageList/MessageList.vue'
import MessageDetail from '../pages/message/messageDetail/MessageDetail.vue'
import SysMessageDetail from '../pages/message/messageDetail/SysMessageDetail.vue'

/* 这里是抢单模块的所有页面 */
import GrabRoot from '../pages/grabOrder/GrabRoot.vue'
import GrabList from '../pages/grabOrder/grabList/GrabList.vue'

/*  这里是我的模块的所有页面 */
import Mine from '../pages/mine/Mine.vue'
import MineRoot from '../pages/mine/MineRoot.vue'
import Login from '../pages/mine/login/Login.vue'
import Register from '../pages/mine/register/Register.vue'
import MyWallet from '../pages/mine/wallet/MyWallet.vue'
import MyCount from '../pages/mine/count/MyCount.vue'
import MyOrder from '../pages/mine/order/MyOrder.vue'
import Setting from '../pages/mine/setting/Setting.vue'
import Service from '../pages/mine/service/Service.vue'
import GameList from '../pages/mine/gameList/GameList.vue'
import AddGame from '../pages/mine/addGameForm/AddGame.vue'
import SetPword from '../pages/mine/setPword/SetPword.vue'
import ForgetPword from '../pages/mine/forgetPword/ForgetPword.vue'
import Vip from '../pages/mine/vip/Vip.vue'
import EditMsg from '../pages/mine/editMsg/EditMsg.vue'
import Deposit from '../pages/mine/deposit/Deposit.vue'
import Tixian from '../pages/mine/tixian/Tixian.vue'
import Xieyi from '../pages/mine/xieyi/Xieyi.vue'
import About from '../pages/mine/about/About.vue'
import DetailQustion from '../pages/mine/service/DetailQuestion.vue'
import PayResult from '../pages/mine/payResult/PayResult.vue'

/*  推广页  */
import Advertise from '../pages/advertise/Advertise.vue'

Vue.use(Router)

import {Toast} from 'mint-ui'

const router = new Router({
  routes: [
    {
      path: '/',
      component: Home,
      meta: {
        isrequireLog: false
      }
    },
    {
      path: '/home',
      component: HomeRoot,
      children: [
        {
          path: '/',
          component: Home,
          meta: {
            isrequireLog: false
          }
        },
        {
          path: 'indexCount',
          component: IndexCount,
          meta: {
            isrequireLog: false
          }
        },
        {
          path: 'detailCount',
          component: DetailCount,
          meta: {
            isrequireLog: false
          }
        },
        {
          path: 'payCount',
          component: PayCount,
          name: 'detailCount',
          meta: {
            isrequireLog: true
          }
        }
      ]
    },
    {
      path: '/grabOrder',
      component: GrabRoot,
      meta: {
        isrequireLog: true
      },
      children: [
        {
          path: '/',
          component: GrabList,
          meta: {
            isrequireLog: true
          }
        }
      ]
    },
    {
      path: '/message',
      component: MessageRoot,
      meta: {
        isrequireLog: true
      },
      children: [
        {
          path: '/',
          component: MessageList,
          meta: {
            isrequireLog: true
          }
        },
        {
          path: 'messageDetail',
          component: MessageDetail,
          meta: {
            isrequireLog: true
          }
        },
        {
          path: 'sysMsgDetail',
          name: 'sysMsgDetail',
          component: SysMessageDetail,
          meta: {
            isrequireLog: true
          }
        }
      ]
    },
    {
      path: '/mine',
      component: MineRoot,
      children: [
        {
          path: '/',
          component: Mine,
          meta: {
            isrequireLog: false
          }
        },
        {
          path: 'login',
          component: Login,
          meta: {
            isrequireLog: false,
            logincantinto: true
          }
        },
        {
          path: 'register',
          component: Register,
          meta: {
            isrequireLog: false,
            logincantinto: true
          }
        },
        {
          path: 'myCount',
          component: MyCount,
          meta: {
            isrequireLog: true
          }
        },
        {
          path: 'myWallet',
          component: MyWallet,
          meta: {
            isrequireLog: true
          }
        },
        {
          path: 'myOrder',
          component: MyOrder,
          meta: {
            isrequireLog: true
          }
        },
        {
          path: 'setting',
          component: Setting,
          meta: {
            isrequireLog: true
          }
        },
        {
          path: 'service',
          component: Service,
          meta: {
            isrequireLog: true
          }
        },
        {
          path: 'detailQuestion',
          component: DetailQustion,
          meta: {
            isrequireLog: true
          }
        },
        {
          path: 'gamelist',
          component: GameList,
          meta: {
            isrequireLog: true
          }
        },
        {
          path: 'addGame',
          component: AddGame,
          meta: {
            isrequireLog: true
          }
        },
        {
          path: 'resetGame',
          component: AddGame,
          meta: {
            isrequireLog: true
          }
        },
        {
          path: 'setPword',
          component: SetPword,
          meta: {
            isrequireLog: true
          }
        },
        {
          path: 'forgetPword',
          component: ForgetPword,
          meta: {
            isrequireLog: false
          }
        },
        {
          path: 'forgetPword',
          component: ForgetPword,
          meta: {
            isrequireLog: false
          }
        },
        {
          path: 'vip',
          component: Vip,
          meta: {
            isrequireLog: true
          }
        },
        {
          path: 'editMsg',
          component: EditMsg,
          meta: {
            isrequireLog: true
          }
        },
        {
          path: 'xieyi',
          component: Xieyi,
          meta: {
            isrequireLog: false
          }
        },
        {
          path: 'about',
          component: About,
          meta: {
            isrequireLog: true
          }
        },
        {
          path: 'deposit',
          component: Deposit,
          meta: {
            isrequireLog: true
          }
        },
        {
          path: 'tixian',
          component: Tixian,
          meta: {
            isrequireLog: true
          }
        },
        {
          path: 'payResult',
          component: PayResult,
          meta: {
            isrequireLog: true
          }
        }
      ]
    },
    {
      path: '/advertise',
      component: Advertise,
      meta: {
        isrequireLog: false
      }
    }
  ],
  linkActiveClass: 'active-class'
})
router.beforeEach((to, from, next) => {
  if (window.localStorage.user) {
    if (to.meta.logincantinto) {
      next('/home')
    } else if (to.meta.logincantinto === undefined) {
      next()
    }
  } else {
    if (to.meta.isrequireLog) {
      next({path: '/mine/login'})
      Toast({
        message: '请先登录！',
        iconClass: 'icon icon-shibai',
        duration: 1000
      })
    } else {
      next()
    }
  }
})

export default router
