<template>
  <div class="grabList">
    <header flex-box="0" class="header-link-wrapper" flex="dir:left">
      <a @click="choiceType(false)" :class="{'current':!isCancel}" href="javascript:void(0)"
         flex="main:center cross:center">接单列表</a>
      <a @click="choiceType(true)" :class="{'current':isCancel}" href="javascript:void(0)"
         flex="main:center cross:center">取消列表</a>
    </header>
    <section flex-box="1" flex="dir:top" class="backSection">
      <div v-show="!isCancel" class="grabList-wrapper canscroll" flex-box="1">
        <ul class="grabList-ul">
          <li class="grabList-li" v-for="order in grabList">
            <div class="count-msg" flex="cross:center">
              <span class="game-img" flex-box="0">
                <img :src="order.gameLease.gameIconurl" alt="">
              </span>
              <div class="count-desc" flex-box="1">
                <p class="one">{{order.gameLease.gameServer}}</p>
                <p class="two">{{order.gameLease.title}}</p>
                <p class="three">￥<b>{{order.gameLease.rent}}</b>/小时 押金<b>{{order.gameLease.deposit}}</b>元</p>
              </div>
              <div v-if="" class="count-control" flex-box="0" flex="dir:top main:justify">
                <span class="link">会员</span>
              </div>
            </div>
            <div class="rent-time">{{order.rentTimeContent}}</div>
            <div class="shouyi">收益合计：<b class="red-txt">￥{{order.totalAmt}}</b></div>
            <div class="getOrder-btn">
              <a href="javascript:void(0)" @click="subOrder(order.rushOrderDetailId)">立即接单</a>
            </div>
          </li>
        </ul>
        <div v-if="isEmpty" flex="main:center cross:center dir:top" style="padding:10px;color:#aaa">
          <i class="icon-noData" style="font-size: 48px;margin-bottom: 15px;"></i>
          <p>对不起！您当前还没有可闪电接单的账号！</p>
        </div>
        <div v-if="isload" flex="main:center cross:center" style="color:#999;padding:15px 0;">
          <mt-spinner style="margin-right: 5px;" type="fading-circle"></mt-spinner>
          加载中...
        </div>
        <p style="color:#999;padding:15px 0;text-align: center" v-if="isOver">
          没有更多了- -！
        </p>
      </div>
      <div v-show="isCancel" class="grabCancel-wrapper canscroll" ref="cancelWrapper" flex-box="1">
        <ul class="cancel-list">
          <li class="cancel-item" v-for="order in cancelGrab.cancelList" v-if="!!order.gameLease">
            <h1 class="order-title" flex="cross:center">
              <p class="nick-name" flex-box="1"></p>
              <span class="order-status-txt quxiao" flex="0">已取消</span>
            </h1>
            <div class="count-msg" flex="cross:center">
              <span class="game-img" flex-box="0">
                <img :src="order.gameLease.gameIconurl" alt="">
              </span>
              <div class="count-desc" flex-box="1">
                <p class="one">{{order.gameLease.gameServer}}</p>
                <p class="two">{{order.gameLease.title}}</p>
                <p class="three">￥<b>{{order.gameLease.rent}}</b>/小时 押金<b>{{order.gameLease.deposit}}</b>元</p>
              </div>
              <div v-if="" class="count-control" flex-box="0" flex="dir:top main:justify">
                <span class="link">会员</span>
              </div>
            </div>
            <div class="rent-time">{{order.rentTimeContent}}&nbsp;收益合计：<b class="red-txt">{{order.totalAmt}}</b></div>
          </li>
        </ul>
        <div v-if="cancelGrab.isEmpty" flex="main:center cross:center dir:top" style="padding:10px;color:#aaa">
          <i class="icon-noData" style="font-size: 48px;margin-bottom: 15px;"></i>
          <p>对不起，您还没有取消的订单！</p>
        </div>
        <div v-if="cancelGrab.isload" flex="main:center cross:center" style="color:#999;padding:15px 0;">
          <mt-spinner style="margin-right: 5px;" type="fading-circle"></mt-spinner>
          加载中...
        </div>
        <p style="color:#999;padding:15px 0;text-align: center" v-if="cancelGrab.isOver">
          没有更多了- -！
        </p>
      </div>
    </section>
    <v-Footer></v-Footer>
  </div>
</template>
<script>
  import {Toast} from 'mint-ui'
  import {getUserItem} from '../../../utils'
  export default {
    data () {
      return {
        isCancel: false,
        grabList: [],
        countPage: 1,
        isload: false,
        isOver: false,
        isEmpty: false,
        cancelGrab: {
          firstLoad: false,
          cancelList: [],
          countPage: 1,
          isload: false,
          isOver: false,
          isEmpty: false
        }
      }
    },
    mounted () {
      let scriptTag = document.createElement('script')
      scriptTag.src = 'http://s11.cnzz.com/stat.php?id=1257953875&web_id=1257953875'
      document.querySelector('.app-wrapper .wrapper').appendChild(scriptTag)
      var that = this
      this.getGrabList()
      this.$refs.cancelWrapper.onscroll = function () {
        let wScrollY = this.scrollTop // 当前滚动条位置
        let wInnerH = this.offsetHeight // 设备窗口的高度（不会变）
        let bScrollH = this.scrollHeight // 滚动条总高度
        if (wScrollY + wInnerH >= bScrollH) {
          if (that.cancelGrab.isload === false && that.cancelGrab.isOver === false) {
            that.cancelGrab.countPage++
            that.cancelGrab.isload = true
            that.getCancelList()
          }
        }
      }
    },
    methods: {
      choiceType (type) {
        this.isCancel = type
        if (!this.cancelGrab.firstLoad) {
          this.cancelGrab.firstLoad = true
          this.getCancelList()
        }
      },
      getGrabList () {
        this.isload = true
        this.$http.get(`api/account/rush/list`, {
          headers: {
            ZHToken: getUserItem('user').token
          }
        }).then(res => {
          this.isload = false
          /* 获取数据成功 */
          if (res.data.code === 'Ok') {
            let dataLength = res.data.data.length
            /* 判断无任何数据 */
            if (dataLength === 0 && this.countPage === 1) {
              this.isEmpty = true
              return
              /*  当前的页数不是第一页，但是无数据！ */
            } else if (dataLength < 20) {
              this.isOver = true
            }
            for (let i = 0; i < res.data.data.length; i++) {
              this.grabList.push(res.data.data[i])
            }
          } else {
            this.isload = false
            Toast({
              message: res.data.result,
              position: 'bottom'
            })
          }
        }, () => {
          this.isload = false
          Toast({
            message: '网络错误，请刷新页面！',
            position: 'bottom'
          })
        })
      },
      getCancelList () {
        this.cancelGrab.isload = true
        this.$http.get(`api/account/rush/cancel/list?page=${this.cancelGrab.countPage}`, {
          headers: {
            ZHToken: getUserItem('user').token
          }
        }).then(res => {
          console.log(res)
          this.cancelGrab.isload = false
          /* 获取数据成功 */
          if (res.data.code === 'Ok') {
            let dataLength = res.data.data.length
            /* 判断无任何数据 */
            if (dataLength === 0 && this.cancelGrab.countPage === 1) {
              this.cancelGrab.isEmpty = true
              return
              /*  当前的页数不是第一页，但是无数据！ */
            } else if (dataLength < 20) {
              this.cancelGrab.isOver = true
            }
            for (let i = 0; i < res.data.data.length; i++) {
              this.cancelGrab.cancelList.push(res.data.data[i])
            }
          } else {
            this.cancelGrab.isload = false
            Toast({
              message: res.data.result,
              position: 'bottom'
            })
          }
        })
      },
      subOrder (id) {
        this.$http.get(`api/account/${id}/rush`, {
          headers: {
            ZHToken: getUserItem('user').token
          }
        }).then(res => {
          if (res.data.code === 'Ok') {
            this.$router.push('/mine/myOrder')
            this.$store.dispatch('getGrabOrder', {http: this.$http})
            Toast({
              message: '恭喜您，抢单成功！',
              position: 'bottom',
              duration: 2000
            })
          } else {
            Toast({
              message: res.data.result,
              position: 'bottom',
              duration: 2000
            })
          }
        })
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../common/tool";

  .header-link-wrapper {
    height: 44px;
    padding: 0 15px;
    background: #039BE5;
    > a {
      width: 80px;
      height: 100%;
      position: relative;
      color: #fff;
      &.current:after {
        height: 3px;
      }
      &:after {
        content: "";
        position: absolute;
        width: 100%;
        height: 0px;
        background: #fff;
        bottom: 0;
        left: 0;
        transition: all 0.2s;
      }
    }
  }

  .grabList-ul {
    > li {
      background: #fff;
    }
    .count-msg {
      height: 80px;
      padding: 10px 15px;
      .game-img {
        width: 60px;
        height: 60px;
        border-radius: 5px;
        overflow: hidden;
        > img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .count-desc {
        margin-left: 10px;
        .one {
          color: #666;
          font-size: 13px;
          line-height: 16px;
        }
        .two {
          font-size: 14px;
          line-height: 30px;
        }
        .three {
          font-size: 10px;
          color: #999;
          line-height: 12px;
          > b {
            color: red;
            font-weight: normal;
          }
        }
        > p {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
      .count-control {
        width: 40px;
        height: 100%;
        .link {
          border: 1px solid @themeColor;
          color: @themeColor;
          text-align: center;
          border-radius: 3px;
        }
        .getdown {
          background: @themeColor;
          color: #fff;
          text-align: center;
          padding: 2px 0;
        }
      }
    }
    .rent-time {
      font-size: 10px;
      height: 40px;
      line-height: 40px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      padding: 0 15px;
      border-top: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
    }
    .shouyi {
      font-size: 10px;
      padding: 0 15px;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #ddd;
      .red-txt {
        color: #e4393c;
      }
    }
    .getOrder-btn {
      padding: 5px 15px;
      > a {
        display: block;
        background: @themeColor;
        color: #fff;
        text-align: center;
        height: 36px;
        line-height: 36px;
      }
    }
  }

  .cancel-list {
    > .cancel-item {
      background: #fff;
      &:not(:first-child) {
        margin-top: 10px;
      }
      .order-title {
        height: 40px;
        padding: 0 15px;
        border-bottom: 1px solid #ddd;
        .head-img {
          width: 25px;
          height: 25px;
          overflow: hidden;
          border-radius: 50%;
          box-shadow: 0 0 5px #999;
          > img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        .nick-name {
          margin-left: 5px;
        }
        .waitConfirm {
          color: #c68900;
        }
        .jinxing {
          color: green;
        }
        .quxiao {
          color: #999;
        }
        .success {
          color: red;
        }
      }
      .count-msg {
        height: 80px;
        padding: 10px 15px;
        .game-img {
          width: 60px;
          height: 60px;
          border-radius: 5px;
          overflow: hidden;
          > img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        .count-desc {
          margin-left: 10px;
          .one {
            color: #666;
            font-size: 13px;
            line-height: 16px;
          }
          .two {
            font-size: 14px;
            line-height: 30px;
          }
          .three {
            font-size: 10px;
            color: #999;
            line-height: 12px;
            > b {
              color: red;
              font-weight: normal;
            }
          }
          > p {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        .count-control {
          width: 40px;
          height: 100%;
          .link {
            border: 1px solid @themeColor;
            color: @themeColor;
            text-align: center;
            border-radius: 3px;
          }
          .getdown {
            background: @themeColor;
            color: #fff;
            text-align: center;
            padding: 2px 0;
          }
        }
      }
      .rent-time {
        font-size: 10px;
        height: 40px;
        line-height: 40px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        padding: 0 15px;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        .red-txt {
          color: #e4393c;
        }
      }
    }
  }
</style>
