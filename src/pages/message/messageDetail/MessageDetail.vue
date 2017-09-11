<template>
  <div class="messageList">
    <v-Header>
      <a href="javascript:history.go(-1)" slot="left-link" class="left-link" flex="main:center cross:center"
         flex-box="0">
        <i class="icon-left_arrow"></i>
      </a>
      <span slot="center-content">{{$route.query.userName}}</span>
      <a href="javascript:void(0)" to="" slot="right-link" flex="main:center cross:center" class="right-link"
         flex-box="0"></a>
    </v-Header>
    <section flex-box="1" class="backSection" flex="dir:top">
      <mt-loadmore flex-box="1" :auto-fill="true" :bottom-all-loaded="allLoaded" class="canscroll" :top-method="loadTop"
                   :max-distance="150" @top-status-change="handleTopChange" ref="loadmore">
        <div slot="top" class="mint-loadmore-top">
          <span class="showClass" v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }"><i
            class="icon-xiala"></i></span>
          <mt-spinner v-show="topStatus === 'loading'"
                      style="margin-right: 5px;display: inline-block;vertical-align: middle"
                      type="fading-circle"></mt-spinner>
        </div>
        <ul class="scroll-wrapper" flex="dir:bottom" style="width: 100%;height:100%">
          <li v-for="item in MsgList">
            <div v-if="item.fromUserId == myUserId" flex="dir:right">
              <span class="head-img" flex-box="0">
                <img v-if="item.userIconUrl" :src="item.userIconUrl" alt="">
                <img v-else="" src="../../../common/img/touxiang.png" alt="">
              </span>
              <div flex-box="1" class="msg-box right">
                <span>{{item.content}}</span>
                <b class="time-link">{{item.createTime | formateTime}}</b>
              </div>
            </div>
            <div v-else flex="dir:left">
              <span class="head-img" flex-box="0">
                <img v-if="item.userIconUrl" :src="item.userIconUrl" alt="">
                <img v-else="" src="../../../common/img/touxiang.png" alt="">
              </span>
              <div class="msg-box left" flex-box="1">
                <span>{{item.content}}</span>
                <b class="time-link">{{item.createTime | formateTime}}</b>
              </div>
            </div>
          </li>
        </ul>
      </mt-loadmore>
    </section>
    <div class="bottom-editor" flex-box="0" flex="dir:left cross:center">
      <input type="text" flex-box="1" v-model="sendMsgTxt">
      <a href="javascript:void(0)" flex-box="0" @click="sendMsg()">发送</a>
    </div>
  </div>
</template>
<script>
  import { getUserItem } from '../../../utils'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        MsgList: [],
        allLoaded: false,
        topStatus: '',
        myUserId: null,
        page: 1,
        sendMsgTxt: ''
      }
    },
    methods: {
      loadTop: function () {  // 刷新数据的操作
        this.getMsg()
      },
      handleTopChange: function (status) {
        this.topStatus = status
      },
      scrollToBottom () {
        this.$refs.loadmore.$el.scrollTop = this.$refs.loadmore.$el.scrollHeight
      },
      getMsg () {
        this.$http.get(`api/account/${this.$route.query.userId}/user/message?page=${this.page}`, {
          headers: {
            ZHToken: getUserItem('user').token
          }
        }).then(res => {
          res.data.data.map(item => {
            this.MsgList.push(item)
          })
          if (this.page === 1) {
            this.$store.dispatch('getUnread', {http: this.$http})
            this.$nextTick(() => {
              this.scrollToBottom()
            })
          } else if (this.page > 1) {
            this.$refs.loadmore.onTopLoaded()
          }
          this.page++
        }, () => {
        })
      },
      sendMsg () {
        if (this.sendMsgTxt === '') {
          Toast({
            message: '发送内容不能为空！',
            position: 'bottom',
            durationL: 1000
          })
          return false
        }
        this.$http.post('api/message/user/reply', {
          content: this.sendMsgTxt,
          toUserId: this.$route.query.userId
        }, {
          headers: {
            ZHToken: getUserItem('user').token
          }
        }).then(res => {
          if (res.data.code === 'Ok') {
            this.$store.dispatch('getUnread', {http: this.$http})
            this.MsgList.unshift({
              content: this.sendMsgTxt,
              createTime: new Date().getTime(),
              fromUserId: getUserItem('user').user.id,
              toUserId: this.$route.query.userId,
              userIconUrl: getUserItem('user').user.iconUrl
            })
            this.sendMsgTxt = ''
            this.$nextTick(() => {
              this.scrollToBottom()
            })
          }
        }, () => {
        })
      }
    },
    created () {
      this.getMsg()
      this.myUserId = getUserItem('user').user.id
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../common/tool";

  .showClass {
    transition: all 0.2s;
    display: inline-block;
    vertical-align: middle;
  }

  .showClass.rotate {
    transform: rotate(180deg);
    color: red;
  }

  .bottom-editor {
    height: 44px;
    background: #f8f8f8;
    border-top: 1px solid #d4d4d4;
    padding: 0 15px;
    > input {
      height: 30px;
      background: #fff;
      border-radius: 5px;
      -webkit-appearance: none;
      border: 1px solid #dadada;
      padding: 0 5px;
    }
    > a {
      margin-left: 10px;
      width: 50px;
      height: 30px;
      background: @themeColor;
      text-align: center;
      line-height: 30px;
      border-radius: 5px;
      color: #fff;
    }
  }

  .scroll-wrapper {
    padding: 0 15px;
    overflow: visible;
    > li {
      overflow: visible;
      margin: 15px 0;
      > div {
        overflow: visible;
        .head-img {
          overflow: visible;
          width: 40px;
          height: 40px;
          overflow: hidden;
          border-radius: 50%;
          box-shadow: 0 0 3px #333;
          > img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        .msg-box {
          position: relative;
          overflow: visible;
          > span {
            padding: 10px;
            background: #fff;
            border-radius: 10px;
            word-break: break-all;
            word-wrap:break-word;
          }
          >.time-link{
            position: absolute;
            top:100%;
            margin-top: -3px;
            font-weight: normal;
            color: #999;
            font-size: 8px;
          }
        }
        .msg-box.left {
          margin-left: 15px;
          > span {
            float: left;
          }
          >.time-link{
            left: 0;
          }
        }
        .msg-box.right {
          margin-right: 15px;
          > span {
            float: right;
          }
          >.time-link{
            right: 0;
          }
        }
      }
    }
  }
</style>
