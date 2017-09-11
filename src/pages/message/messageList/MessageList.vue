<template>
  <div class="messageList">
    <header class="message-header" flex-box="0" flex="dir:left">
      <a href="javascript:void(0)" @click="choiceType(true)" :class="{current:isUser}"
         flex="cross:center main:center">用户消息<b class="hongdian" v-if="unread.unreadObj.userMessageCount>0"></b></a>
      <a href="javascript:void(0)" @click="choiceType(false)" :class="{current:!isUser}"
         flex="cross:center main:center">系统消息<b class="hongdian" v-if="unread.unreadObj.sysMessageCount>0"></b>
      </a>
    </header>
    <section flex-box="1" flex="dir:top">
      <div class="user-message canscroll" ref="userWrapper" v-show="isUser" flex-box="1">
        <ul class="message-list">
          <li class="message-item" v-for="message in user.messageList">
            <router-link :to="{path:'/message/messageDetail',query:{userId:message.userId,userName:message.nick}}" flex="dir:left">
              <span flex-box="0" class="head-img">
                <img v-if="message.userIconUrl" :src="message.userIconUrl" alt="">
                <img src="../../../common/img/touxiang.png" v-else alt="">
              </span>
              <div flex="main:justify dir:top" flex-box="1">
                <p flex="main:justify">
                  <b class="nick-name">{{message.nick}}</b>
                  <b class="time">{{message.lastReplyTime | formateTime}}</b>
                </p>
                <p class="last-msg">{{message.lastContent}}</p>
              </div>
              <em v-if="message.unReadCount>0" class="unread">{{message.unReadCount}}</em>
            </router-link>
          </li>
        </ul>
        <div v-if="user.isEmpty" flex="main:center cross:center dir:top" style="padding:10px;color:#aaa">
          <i class="icon-noData" style="font-size: 48px;margin-bottom: 15px;"></i>
          <p>对不起，您还没有收到私信！</p>
        </div>
        <div v-if="user.isload" flex="main:center cross:center" style="color:#999;padding:15px 0;">
          <mt-spinner style="margin-right: 5px;" type="fading-circle"></mt-spinner>
          加载中...
        </div>
        <p style="color:#999;padding:15px 0;text-align: center" v-if="user.isOver">
          没有更多了- -！
        </p>
      </div>
      <div class="sys-message canscroll backSection" ref="sysWrapper" v-show="!isUser" flex-box="1">
        <ul class="sys-message-list">
          <li class="sys-message-item" v-for="message in sys.messageList">
            <router-link :to="{name:'sysMsgDetail',params:message}">
              <p class="time">{{message.createTime | formateTime}}</p>
              <div class="msg-box">
                <h1>{{message.title?message.title:'系统消息'}}</h1>
                <p>{{message.content | sliceStr}}</p>
              </div>
            </router-link>
          </li>
        </ul>
        <div v-if="sys.isEmpty" flex="main:center cross:center dir:top" style="padding:10px;color:#aaa">
          <i class="icon-noData" style="font-size: 48px;margin-bottom: 15px;"></i>
          <p>对不起，您还没有收到系统消息！</p>
        </div>
        <div v-if="sys.isload" flex="main:center cross:center" style="color:#999;padding:15px 0;">
          <mt-spinner style="margin-right: 5px;" type="fading-circle"></mt-spinner>
          加载中...
        </div>
        <p style="color:#999;padding:15px 0;text-align: center" v-if="sys.isOver">
          没有更多了- -！
        </p>
      </div>
    </section>
    <v-Footer></v-Footer>
  </div>
</template>
<script>
  import {getUserItem} from '../../../utils'
  import {mapState} from 'vuex'
  import {Toast} from 'mint-ui'
  export default {
    data () {
      return {
        isUser: true,
        user: {
          messageList: [],
          page: 1,
          isload: false,
          isOver: false,
          isEmpty: false
        },
        sys: {
          messageList: [],
          page: 1,
          isload: false,
          isOver: false,
          isEmpty: false,
          firstLoad: false
        }
      }
    },
    created () {
      this.getUserMessage()
    },
    mounted () {
      let that = this
      this.$refs.userWrapper.onscroll = function () {
        let wScrollY = this.scrollTop // 当前滚动条位置
        let wInnerH = this.offsetHeight // 设备窗口的高度（不会变）
        let bScrollH = this.scrollHeight // 滚动条总高度
        if (wScrollY + wInnerH >= bScrollH) {
          if (that.user.isload === false && that.user.isOver === false) {
            that.user.page++
            that.user.isload = true
            that.getUserMessage()
          }
        }
      }
      this.$refs.sysWrapper.onscroll = function () {
        let wScrollY = this.scrollTop // 当前滚动条位置
        let wInnerH = this.offsetHeight // 设备窗口的高度（不会变）
        let bScrollH = this.scrollHeight // 滚动条总高度
        if (wScrollY + wInnerH >= bScrollH) {
          if (that.sys.isload === false && that.sys.isOver === false) {
            that.sys.page++
            that.sys.isload = true
            that.getSysOrder()
          }
        }
      }
    },
    methods: {
      choiceType (type) {
        this.isUser = type
        if (!this.sys.firstLoad) {
          this.sys.firstLoad = true
          this.getSysOrder()
        }
      },
      getUserMessage () {
        this.user.isload = true
        this.$http.get(`api/account/user/message/list?page=${this.user.page}`, {
          headers: {
            ZHToken: getUserItem('user').token
          }
        }).then(res => {
          this.user.isload = false
          /* 获取数据成功 */
          if (res.data.code === 'Ok') {
            let dataLength = res.data.data.length
            /* 判断无任何数据 */
            if (dataLength === 0 && this.user.page === 1) {
              this.user.isEmpty = true
              return
              /*  当前的页数不是第一页，但是无数据！ */
            } else if (dataLength < 20) {
              this.user.isOver = true
            }
            for (let i = 0; i < res.data.data.length; i++) {
              this.user.messageList.push(res.data.data[i])
            }
          } else {
            this.user.isload = false
            Toast({
              message: res.data.result,
              position: 'bottom'
            })
          }
        }, () => {
          this.user.isload = false
          Toast({
            message: '网络错误，请刷新页面！',
            position: 'bottom'
          })
        })
      },
      getSysOrder () {
        this.sys.isload = true
        this.$http.get(`api/account/sys/message/list?page=${this.sys.page}`, {
          'headers': {
            ZHToken: getUserItem('user').token
          }
        }).then((res) => {
          this.sys.isload = false
          /* 获取数据成功 */
          if (res.data.code === 'Ok') {
            this.$store.dispatch('getUnread', {http: this.$http})
            let dataLength = res.data.data.length
            /* 判断无任何数据 */
            if (dataLength === 0 && this.sys.page === 1) {
              this.sys.isEmpty = true
              return
              /*  当前的页数不是第一页，但是无数据！ */
            } else if (dataLength < 20) {
              this.sys.isOver = true
            }
            for (let i = 0; i < res.data.data.length; i++) {
              this.sys.messageList.push(res.data.data[i])
            }
          } else {
            this.sys.isload = false
            Toast({
              message: res.data.result,
              position: 'bottom'
            })
          }
        }, () => {
          this.sys.isload = false
          Toast({
            message: '网络错误，请刷新页面！',
            position: 'bottom'
          })
        })
      }
    },
    computed: {
      ...mapState(['unread'])
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../common/tool";

  .message-header {
    height: 44px;
    padding: 0 15px;
    background: @themeColor;
    > a {
      width: 80px;
      height: 100%;
      position: relative;
      color: #fff;
      &:before {
        content: "";
        position: absolute;
        width: 100%;
        height: 0px;
        background: #fff;
        bottom: 0;
        left: 0;
        transition: all 0.2s;
      }
      &.current:before {
        height: 3px;
      }
      .hongdian {
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: red;
        right: 0px;
        top: 10px;
      }
    }
  }

  .message-list {
    .message-item {
      border-bottom: 1px solid #efefef;
      > a {
        padding: 15px;
        position: relative;
        .head-img {
          margin-right: 10px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          background: #efefef;
          box-shadow: 0 0 5px #999;
          > img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        > div {
          padding: 3px 0;
          .nick-name {
            font-size: 14px;
          }
          .time {
            font-size: 10px;
            color: #999;
            font-weight: normal;
          }
          .last-msg {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        .unread {
          position: absolute;
          right: 15px;
          bottom: 15px;
          width: 15px;
          height: 15px;
          border-radius: 8px;
          background: red;
          color: #fff;
          text-align: center;
          line-height: 15px;
          font-size: 10px;
        }
      }
    }
  }

  .sys-message-list {
    padding: 0 15px;
    padding-top: 15px;
    .sys-message-item {
      margin-bottom: 15px;
      > a {
        display: block;
        > p {
          text-align: center;
          font-size: 10px;
          margin-bottom: 8px;
          color: #999;
        }
        .msg-box {
          background: #fff;
          padding: 10px;
          border-radius: 5px;
          > h1 {
            font-size: 14px;
            font-weight: bold;
          }
          > p {
            margin-top: 5px;
            color: #999;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
