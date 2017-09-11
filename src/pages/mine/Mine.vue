<template>
  <div class="mine">
    <section flex-box="1" class="mine">
      <div v-if="!islogin" flex="dir:top cross:center main:center" class="header-back not-login clearfix">
        <span class="head-img-default" flex="main:center cross:center"><i class="icon-wode"></i></span>
        <div class="btn-group" flex="main:center">
          <router-link to="/mine/login">登录</router-link>
          <router-link to="/mine/register">注册</router-link>
        </div>
      </div>
      <div v-if="islogin" class="already-login">
        <div class="personal-msg" flex="dir:left">
          <span flex-box="0" class="head-img">
            <img v-if="user.userIcon" :src="user.userIcon" alt="">
            <img v-else="" src="../../common/img/touxiang.png" alt="">
          </span>
          <div flex-box="1" class="name-group" flex="dir:top">
            <p flex-box="1" class="nick-name">{{user.nick}}</p>
            <p flex-box="0">绑定手机：{{user.mobile}}</p>
            <p flex-box="0">余额：{{user.balance}}</p>
          </div>
          <router-link to="/mine/editMsg" flex-box="0" class="edit-btn">
            <i class="icon-xie"></i>
          </router-link>
        </div>
        <div class="vip-msg" flex="dir:left cross:center">
          <div flex-box="1" class="vip-left-tip" flex="dir:top">
            <span v-if="user.vip" flex="cross:center"><i class="icon-vip" style="margin-right: 3px;font-size: 18px"></i>正式会员</span>
            <span v-else="" flex="cross:center"><i class="icon-vip"
                                                   style="margin-right: 3px;font-size: 18px"></i>体验会员</span>
            <span v-if="user.vip" class="lastdate" style="margin-top: 3px;">会员到期：{{user.vipEndTime | formatDate}}</span>
          </div>
          <router-link class="vip-btn" v-if="!user.vip" flex-box="0" to="/mine/vip">购买会员</router-link>
          <router-link class="vip-btn" v-if="user.vip" flex-box="0" to="/mine/vip">续费会员</router-link>
        </div>
      </div>
      <div v-if="islogin" class="mine-menu">
        <ul class="menu-ul">
          <li v-if="item.iscanshow" v-for="item in mineMenu">
            <router-link flex="cross:center main:justify" :to="item.path">
              <p>{{item.name}}
                <b class="hongdian" v-if="item.statusName=='order'&&unread.unreadObj.orderCount>0">{{unread.unreadObj.orderCount}}</b>
                <b class="hongdian" v-if="item.statusName=='ticket'&&unread.unreadObj.ticketReplyCount>0">{{unread.unreadObj.ticketReplyCount}}</b>
              </p>
              <i flex-box="0" :class="item.icon"></i>
            </router-link>
          </li>
        </ul>
      </div>
    </section>
    <v-Footer></v-Footer>
    <span @click="getGift()" v-if="user.vip" v-bind:style="{top:giftTop+'px',left:giftLeft+'px'}"
          @touchmove.stop.prevent="moving()"
          class="gift-icon">
    </span>
    <transition name="toscale">
      <div class="hongbao-mask" v-if="hasHongbao" flex="cross:center main:center">
        <!--<div class="hongbao-mask" v-if="" flex="cross:center main:center">-->
        <div class="hongbao-box">
          <div class="zhongjiang clearfix">
            <h1 class="">恭喜获得大红包</h1>
            <p class="tip">新人专享</p>
            <span class="get-hongbao" @click="choujiang()">新人专享</span>
          </div>
          <span class="close-btn" @click="hasHongbao=!hasHongbao">
          <i class="icon-shibai"></i>
        </span>
          <div class="hongbao-back">
            <img src="../../common/img/hongbao.png" alt="">
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  import {getUserItem, saveUserItem} from '../../utils'
  import {mapState} from 'vuex'
  import {Toast, MessageBox} from 'mint-ui'
  import config from '../../../config'
  export default {
    data () {
      return {
        hasHongbao: false,
        mineMenu: [
          {
            name: '发布账号',
            icon: 'icon-addcount',
            path: '/mine/gameList',
            iscanshow: false
          },
          {
            name: '我的订单',
            icon: 'icon-dingdan',
            path: '/mine/myOrder',
            iscanshow: true,
            statusName: 'order'
          },
          {
            name: '我的账号',
            icon: 'icon-zhengjia',
            path: '/mine/mycount',
            iscanshow: true
          },
          {
            name: '我的钱包',
            icon: 'icon-qianbao',
            path: '/mine/myWallet',
            iscanshow: true
          },
          {
            name: '客服中心',
            icon: 'icon-kefu',
            path: '/mine/service',
            iscanshow: true,
            statusName: 'ticket'
          },
          {
            name: '修改密码',
            icon: 'icon-mima',
            path: '/mine/setPword',
            iscanshow: false
          },
          {
            name: '设置',
            icon: 'icon-shezhi',
            path: '/mine/setting',
            iscanshow: true
          }
        ],
        islogin: false,
        user: {
          balance: '',
          createTime: '',
          id: '',
          loginName: '',
          mobile: '',
          nick: '',
          vip: '',
          userIcon: ''
        },
        giftTop: 200,
        giftLeft: 200,
        toast: false
      }
    },
    methods: {
      moving (e) {
        if (event.touches[0].clientY > event.target.clientHeight / 2 && event.touches[0].clientY < (window.innerHeight - event.target.clientHeight / 2)) {
          this.giftTop = event.touches[0].clientY - event.target.clientHeight / 2
        }
        if (event.touches[0].clientX > event.target.clientWidth / 2 && event.touches[0].clientX < (window.innerWidth - event.target.clientWidth / 2)) {
          this.giftLeft = event.touches[0].clientX - event.target.clientWidth / 2
        }
      },
      setUser () {
        if (window.localStorage.user) {
          this.islogin = true
        }
        if (window.localStorage.user) {
          this.$http.get(`api/account/info`, {
            headers: {
              ZHToken: getUserItem('user').token
            }
          }).then(res => {
            if (res.data.code === 'Ok') {
              let newUserInfo = {
                token: getUserItem('user').token,
                user: res.data.data
              }
              saveUserItem(newUserInfo)
              let userObj = getUserItem('user').user
              this.user.balance = userObj.balance
              this.user.createTime = userObj.createTime
              this.user.id = userObj.id
              this.user.loginName = userObj.loginName
              this.user.mobile = userObj.mobile
              this.user.nick = userObj.nick
              this.user.vip = userObj.vip
              this.user.vipEndTime = userObj.vipEndTime
              this.hasHongbao = userObj.showVipAward
              this.user.userIcon = userObj.iconUrl ? userObj.iconUrl : ''
              this.islogin = true
              this.mineMenu.filter(menuitem => {
                return menuitem.iscanshow === false
              }).map(item => {
                item.iscanshow = true
              })
            }
          })
        }
      },
      choujiang () {
        this.$http.get(`api/account/vip/award`, {
          headers: {
            ZHToken: getUserItem('user').token
          }
        }).then(res => {
          if (res.data.code === 'Ok') {
            Toast({
              message: '恭喜您，获得18.8的现金红包！',
              iconClass: 'icon icon-chenggong'
            })
            this.setUser()
          }
        })
      },
      getGift () {
        this.$http.get(`api/account/luckydraw/prepare`, {
          headers: {
            ZHToken: getUserItem('user').token
          }
        }).then(res => {
          if (res.data.code === 'Ok') {
            window.location.href = `${config.dev.proxyTable['/api'].target}/account/goto/luckydraw?sess=${res.data.data}`
          }
        })
      }
    },
    created () {
      if (window.localStorage.user) {
        this.$store.dispatch('getUnread', {http: this.$http})
      }
      this.setUser()
      this.toast = window.localStorage.toast
    },
    mounted () {
      let scriptTag = document.createElement('script')
      scriptTag.src = 'http://s11.cnzz.com/stat.php?id=1257953883&web_id=1257953883'
      document.querySelector('.app-wrapper .wrapper').appendChild(scriptTag)
      this.giftLeft = window.innerWidth - 60
      if (this.toast === 'true' && getUserItem('user').user.vip === false) {
        MessageBox.alert('你已进入24小时体验期，请尽快升级正式会员，方可正式享受会员服务。为方便体验交易流程，体验期一切信息订单模拟正式会员流程发出，成为正式会员后体验期自动终止，期间流程不代表最终服务情况哦。').then(() => {
          window.localStorage.toast = false
        })
      }
    },
    computed: {
      ...mapState(['unread'])
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../common/tool";

  .mine {
    .not-login {
      position: absolute;
      top: 0;
      bottom: 49px;
      bottom: 49px;
      left: 0;
      right: 0;
      background: @themeColor;
      .head-img-default {
        width: 70px;
        height: 70px;
        margin: 0 auto;
        margin-top: -100px;
        border-radius: 50%;
        background: #fff;
        color: #979797;
        > i {
          font-size: 42px;
        }
      }
      .btn-group {
        margin-top: 20px;
        > a {
          width: 80px;
          height: 26px;
          line-height: 24px;
          border: 1px solid #fff;
          color: #fff;
          text-align: center;
          margin: 0 20px;
        }
      }
    }
    .already-login {
      background: @themeColor;
      padding-top: 40px;
      .personal-msg {
        padding: 0 20px;
        .head-img {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          overflow: hidden;
          background: #fff;
          > img {
            display: block;
            height: 100%;
            width: 100%;
          }
        }
        .name-group {
          margin-left: 10px;
          color: #fff;
          padding: 3px 0;
          .nick-name {
            font-size: 16px;
          }
        }
        .edit-btn {
          font-size: 20px;
          color: #fff;
          > i {
          }
        }
      }
      .vip-msg {
        background: #0089CC;
        height: 44px;
        margin-top: 25px;
        padding: 0 15px;
        .vip-left-tip {
          > span {
            color: #fff;
          }
          .lastdate {
            font-size: 10px;
          }
        }
        .vip-btn {
          width: 80px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          border: 1px solid #fff;
          border-radius: 3px;
          color: #fff;
        }
      }
    }
    .mine-menu {
      > ul {
        padding: 0 20px;
        > li {
          border-bottom: 1px solid #F3F3F3;
          > a {
            height: 70px;
            width: 100%;
            overflow: visible;
            > p {
              position: relative;
              font-size: 13px;
              line-height: 20px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: visible;
              > .hongdian {
                position: absolute;
                right: -15px;
                top: -15%;
                width: 15px;
                height: 15px;
                border-radius: 50%;
                color: #fff;
                font-weight: normal;
                text-align: center;
                line-height: 15px;
                font-size: 8px;
                background: red;
                border-radius: 50%;
              }
            }
            > i {
              font-size: 18px;
            }
          }
        }
      }
    }
    .gift-icon {
      position: fixed;
      top: 200px;
      right: 50px;
      width: 45px;
      height: 54px;
      background: url("../../common/img/gift.png") 0 0 no-repeat;
    }
  }

  .hongbao-mask {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    background: rgba(0, 0, 0, 0.5);
    .hongbao-box {
      position: relative;
      width: 216px;
      height: 271px;
      overflow: visible;
      .zhongjiang {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 2;
        width: 100%;
        height: 100%;
        text-align: center;
        > h1 {
          color: #FFED52;
          margin-top: 130px;
          font-size: 20px;
        }
        > .tip {
          color: #B02A03;
          font-size: 14px;
        }
        > span {
          font-size: 14px;
          display: block;
          line-height: 40px;
          margin-top: 20px;
          color: #F1420F;
        }
      }
      .close-btn {
        position: absolute;
        width: 50px;
        height: 50px;
        font-size: 48px;
        right: -20px;
        top: -20px;
        color: #fff;
        border-radius: 50%;
        z-index: 3;
        > i {
          display: block;
        }
      }
      .hongbao-back {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        height: 100%;
        z-index: 0;
        > img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .toscale-enter-active.hongbao-mask {
    opacity: 0;
    transition: all 0.3s;
    .hongbao-box {
      transition: all 0.3s;
      transform: scale(0);
    }
  }

  .toscale-enter-to.hongbao-mask {
    opacity: 1;
    .hongbao-box {
      transform: scale(1);
    }
  }

  .toscale-leave-active.hongbao-mask {
    opacity: 1;
    transition: all 0.3s;
    .hongbao-box {
      transition: all 0.3s;
      transform: scale(1);
    }
  }

  .toscale-leave-to.hongbao-mask {
    opacity: 0;
    .hongbao-box {
      transform: scale(0);
    }
  }
</style>
