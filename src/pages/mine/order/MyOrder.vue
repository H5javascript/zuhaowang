<template>
  <div class="orderPage">
    <v-Header>
      <a href="javascript:history.go(-1)" slot="left-link" class="left-link" flex="main:center cross:center"
         flex-box="0">
        <i class="icon-left_arrow"></i>
      </a>
      <span slot="center-content">我的订单</span>
      <a href="javascript:void(0)" to="" slot="right-link" flex="main:center cross:center" class="right-link"
         flex-box="0"></a>
    </v-Header>
    <section flex-box="1" style="padding-top: 44px;" class="backSection" flex="dir:top">
      <div class="select-order-type" flex-box="0">
        <a href="javascript:void(0)" :class="{'active':orderType==1}" @click="choiceType(1)">出租订单</a>
        <a href="javascript:void(0)" :class="{'active':orderType==2}" @click="choiceType(2)">租用订单</a>
      </div>
      <div class="use-wrapper order-wrapper canscroll" ref="usewrapper" v-show="orderType==1" flex-box="1">
        <ul class="use-list order-list">
          <li class="use-item order-item" v-for="order in use.orderList" v-if="!!order.gameLease">
            <h1 class="order-title" flex="cross:center">
              <!--<span class="head-img" flex-box="0">-->
              <!--<img v-if="order.userIconUrl" :src="order.userIconUrl" alt="">-->
              <!--<img v-else='' src="../../../common/img/touxiang.png" alt="">-->
              <!--</span>-->
              <p class="nick-name" flex-box="1"></p>
              <span class="order-status-txt waitConfirm" v-if="order.status===2" flex="0">待确认</span>
              <span class="order-status-txt jinxing" v-else-if="order.status===3" flex="0">订单进行中</span>
              <span class="order-status-txt quxiao" v-else-if="order.status===4" flex="0">已取消</span>
              <span class="order-status-txt success" v-else-if="order.status===5" flex="0">交易完成</span>
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
            <div class="rent-time">{{order.rentTimeContent}}&nbsp;<br>收益合计：<b class="red-txt">￥{{order.totalAmt}}</b>&nbsp;时间：<b
              class="red-txt">{{order.rentTime}}</b></div>
            <div class="order-control" flex="main:justify">
              <a href="javascript:void(0)" v-if="order.status===2" @click="cancelOrder(order)">取消</a>
              <a class="qr-btn" href="javascript:void(0)" v-if="order.status===2" @click="inputCount(order)">确认订单</a>
            </div>
          </li>
        </ul>
        <div v-if="use.isEmpty" flex="main:center cross:center dir:top" style="padding:10px;color:#aaa">
          <i class="icon-noData" style="font-size: 48px;margin-bottom: 15px;"></i>
          <p>对不起，您还没有出租订单！</p>
        </div>
        <div v-if="use.isload" flex="main:center cross:center" style="color:#999;padding:15px 0;">
          <mt-spinner style="margin-right: 5px;" type="fading-circle"></mt-spinner>
          加载中...
        </div>
        <p style="color:#999;padding:15px 0;text-align: center" v-if="use.isOver">
          没有更多了- -！
        </p>
      </div>
      <div class="used-wrapper order-wrapper canscroll" ref="usedwrapper" v-show="orderType==2" flex-box="1">
        <ul class="used-list order-list">
          <li class="used-item order-item" v-for="order in used.orderList" v-if="!!order.gameLease">
            <h1 class="order-title" flex="cross:center">
              <!--<span class="head-img" flex-box="0">-->
              <!--<img v-if="order.userIconUrl" :src="order.userIconUrl" alt="">-->
              <!--<img v-else='' src="../../../common/img/touxiang.png" alt="">-->
              <!--</span>-->
              <p class="nick-name" flex-box="1"></p>
              <span class="order-status-txt waitConfirm" v-if="order.status===2" flex="0">待确认</span>
              <span class="order-status-txt jinxing" v-else-if="order.status===3" flex="0">订单进行中</span>
              <span class="order-status-txt quxiao" v-else-if="order.status===4" flex="0">已取消</span>
              <span class="order-status-txt success" v-else-if="order.status===5" flex="0">交易完成</span>
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
              <div class="count-control" flex-box="0" flex="dir:top main:justify">
                <span class="link">标签</span>
              </div>
            </div>
            <div class="rent-time">{{order.rentTimeContent}}&nbsp;<br>消费合计：<b class="red-txt">￥{{order.totalAmt}}</b>&nbsp;时间：<b
              class="red-txt">{{order.rentTime}}</b></div>
            <div class="order-control">
              <a href="javascript:void(0)" v-if="order.status===3&&order.showConfirm" @click="qrReceive(order)">确认收货</a>
              <a href="javascript:void(0)" v-if="order.status===3&&order.showCancel"
                 @click="cancelReceive(order)">取消收货</a>
              <a href="javascript:void(0)" v-if="order.status===3&&!order.showCancel&&!order.showConfirm"
                 @click="seeCount(order)">查看</a>
            </div>
          </li>
        </ul>
        <div v-if="used.isEmpty" flex="main:center cross:center dir:top" style="padding:10px;color:#aaa">
          <i class="icon-noData" style="font-size: 48px;margin-bottom: 15px;"></i>
          <p>对不起，您还没有租用订单！</p>
        </div>
        <div v-if="used.isload" flex="main:center cross:center" style="color:#999;padding:15px 0;">
          <mt-spinner style="margin-right: 5px;" type="fading-circle"></mt-spinner>
          加载中...
        </div>
        <p style="color:#999;padding:15px 0;text-align: center" v-if="used.isOver">
          没有更多了- -！
        </p>
      </div>
    </section>
    <transition name="intoScale">
      <div v-if="countBox.isShow" class="qr-order-mask" flex="main:center cross:center">
        <div class="qr-order-form" flex="dir:top">
          <h1 flex-box="0">{{countBox.isSeller?'再次输入确认账号和密码':'查看租用账号和密码'}}</h1>
          <div flex-box="1" class="form-wrapper">
            <label class="form-item" flex="dir:left cross:center">
              <span flex-box="0">账号：</span>
              <div flex-box="1"><input v-model="countBox.countNumber" style="width: 100%" :disabled="!countBox.isSeller"
                                       type="text"></div>
            </label>
            <label class="form-item" flex="dir:left cross:center">
              <span flex-box="0">密码：</span>
              <div flex-box="1">
                <input v-model="countBox.passWord" style="width: 100%"
                       :disabled="!countBox.isSeller" type="text">
              </div>
            </label>
          </div>
          <div class="footer-btn" flex-box="0" flex="box:mean">
            <a href="javascript:void(0)" @click="countBox.isShow=!countBox.isShow">关闭</a>
            <a v-if="countBox.isSeller" href="javascript:void(0)" @click="qrOrder()">确认</a>
          </div>
        </div>
      </div>
    </transition>
    <div class="download-tip" flex="cross:center">
      <p flex-box="1">点击下载租号网app，就送<b>18.8</b>元</p>
      <a flex-box="0" href="javascript:void(0)" @click="download=!download">下载</a>
    </div>
    <transition name="downloadShow">
      <div v-if="download" class="alert-download-mask" @click="download=!download" flex="cross:center main:center">
        <div class="download_box" flex="main:center cross:center dir:top" @click.stop="">
          <p class="download_title">下载客户端</p>
          <a :href="android">安卓客户端下载</a>
          <a :href="ios">苹果客户端下载</a>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  import {getUserItem} from '../../../utils'
  import {Toast, MessageBox} from 'mint-ui'
  export default {
    props: {
      android: {
        type: String,
        default: ''
      },
      ios: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        download: false,
        use: {
          orderList: [],
          page: 1,
          isload: false,
          isOver: false,
          isEmpty: false
        },
        used: {
          firstLoad: false,
          orderList: [],
          page: 1,
          isload: false,
          isOver: false,
          isEmpty: false
        },
        orderType: 1,
        countBox: {
          isShow: false,
          isSeller: true,
          countNumber: '',
          gameLeaselogId: null,
          passWord: '',
          controlCount: null
        }
      }
    },
    created () {
      this.$store.dispatch('getUnread', {http: this.$http})
      this.getUseOrder()
    },
    mounted () {
      let scriptTag = document.createElement('script')
      scriptTag.src = 'http://s11.cnzz.com/stat.php?id=1257806764&web_id=1257806764'
      document.querySelector('.app-wrapper .wrapper').appendChild(scriptTag)
      let that = this
      this.$refs.usewrapper.onscroll = function () {
        let wScrollY = this.scrollTop // 当前滚动条位置
        let wInnerH = this.offsetHeight // 设备窗口的高度（不会变）
        let bScrollH = this.scrollHeight // 滚动条总高度
        if (wScrollY + wInnerH >= bScrollH) {
          if (that.use.isload === false && that.use.isOver === false) {
            that.use.page++
            that.use.isload = true
            that.getUseOrder()
          }
        }
      }
      this.$refs.usedwrapper.onscroll = function () {
        let wScrollY = this.scrollTop // 当前滚动条位置
        let wInnerH = this.offsetHeight // 设备窗口的高度（不会变）
        let bScrollH = this.scrollHeight // 滚动条总高度
        if (wScrollY + wInnerH >= bScrollH) {
          if (that.used.isload === false && that.used.isOver === false) {
            that.used.page++
            that.used.isload = true
            that.getUsedOrder()
          }
        }
      }
    },
    methods: {
      choiceType (type) {
        this.orderType = type
        if (type === 1) {
          this.countBox.isSeller = true
        } else {
          this.countBox.isSeller = false
        }
        if (!this.used.firstLoad) {
          this.used.firstLoad = true
          this.getUsedOrder()
        }
      },
      getUseOrder () {
        this.use.isload = true
        this.$http.get(`api/account/game/lease/use/list?page=${this.use.page}`, {
          'headers': {
            ZHToken: getUserItem('user').token
          }
        }).then((res) => {
          this.use.isload = false
          /* 获取数据成功 */
          if (res.data.code === 'Ok') {
            let dataLength = res.data.data.length
            /* 判断无任何数据 */
            if (dataLength === 0 && this.use.page === 1) {
              this.use.isEmpty = true
              return
              /*  当前的页数不是第一页，但是无数据！ */
            } else if (dataLength < 20) {
              this.use.isOver = true
            }
            for (let i = 0; i < res.data.data.length; i++) {
              this.use.orderList.push(res.data.data[i])
            }
          } else {
            this.use.isload = false
            Toast({
              message: res.data.result,
              position: 'bottom'
            })
          }
        }, () => {
          this.use.isload = false
          Toast({
            message: '网络错误，请刷新页面！',
            position: 'bottom'
          })
        })
      },
      getUsedOrder () {
        this.used.isload = true
        this.$http.get(`api/account/game/lease/used/list?page=${this.used.page}`, {
          'headers': {
            ZHToken: getUserItem('user').token
          }
        }).then((res) => {
          this.used.isload = false
          /* 获取数据成功 */
          if (res.data.code === 'Ok') {
            let dataLength = res.data.data.length
            /* 判断无任何数据 */
            if (dataLength === 0 && this.used.page === 1) {
              this.used.isEmpty = true
              return
              /*  当前的页数不是第一页，但是无数据！ */
            } else if (dataLength < 20) {
              this.used.isOver = true
            }
            for (let i = 0; i < res.data.data.length; i++) {
              this.used.orderList.push(res.data.data[i])
            }
          } else {
            this.used.isload = false
            Toast({
              message: res.data.result,
              position: 'bottom'
            })
          }
        }, () => {
          this.used.isload = false
          Toast({
            message: '网络错误，请刷新页面！',
            position: 'bottom'
          })
        })
      },
      inputCount (gameOrder) {
        this.countBox.controlCount = gameOrder
        this.countBox.gameLeaselogId = gameOrder.gameLeaseLogId
        this.$http.get(`api/account/game/lease/lessor/confirm/prepare?status=${gameOrder.status}&gameLeaselogId=${gameOrder.gameLeaseLogId}`, {
          headers: {
            ZHToken: getUserItem('user').token
          }
        }).then(res => {
          console.log(res)
          if (res.data.code === 'Ok') {
            this.countBox.countNumber = res.data.data.account
            this.countBox.passWord = res.data.data.password
            this.countBox.isShow = true
          } else {
            Toast({
              message: '操作失败，请重新确认！',
              position: 'bottom',
              duration: 2000
            })
          }
        })
      },
      qrOrder () {
        if (this.countBox.countNumber === '' || this.countBox.passWord === '') {
          Toast({
            message: '请完整填写当前所要租出的账号和密码',
            position: 'bottom',
            duration: 2000
          })
          return false
        }
        this.$http.post(`api/account/game/lease/lessor/confirm`, {
          account: this.countBox.countNumber,
          gameLeaselogId: this.countBox.gameLeaselogId,
          password: this.countBox.passWord,
          status: 2
        }, {
          headers: {
            ZHToken: getUserItem('user').token
          }
        }).then(res => {
          if (res.data.code === 'Ok') {
            this.countBox.controlCount.status = 3
            Toast({
              message: '确认出租成功',
              position: 'bottom',
              duration: 2000
            })
          } else {
            Toast({
              message: '操作失败，请重新操作',
              position: 'bottom',
              duration: 2000
            })
          }
          this.countBox.isShow = false
        })
      },
      cancelOrder (order) {
        MessageBox.confirm('确定取消出租此订单吗?').then(action => {
          if (action === 'confirm') {
            this.$http.get(`api/account/game/lease/lessor/cancel?status=${order.status}&gameLeaselogId=${order.gameLeaseLogId}`, {
              headers: {
                ZHToken: getUserItem('user').token
              }
            }).then(res => {
              if (res.data.code === 'Ok') {
                Toast({
                  message: '取消成功',
                  position: 'bottom',
                  duration: 2000
                })
                order.status = 4
              } else {
                Toast({
                  message: '取消失败，请重新操作！',
                  position: 'bottom',
                  duration: 2000
                })
              }
            })
          }
        })
      },
      qrReceive (order) {
        MessageBox.confirm('是否确认收货?').then(action => {
          if (action === 'confirm') {
            this.$http.get(`api/account/game/lease/lessee/confirm?status=${order.status}&gameLeaselogId=${order.gameLeaseLogId}`, {
              headers: {
                ZHToken: getUserItem('user').token
              }
            }).then(res => {
              if (res.data.code === 'Ok') {
                Toast({
                  message: '确认收货成功',
                  position: 'bottom',
                  duration: 2000
                })
                order.status = 5
                order.showCancel = false
                order.showConfirm = false
              } else {
                Toast({
                  message: '确认收货失败，请重新操作！',
                  position: 'bottom',
                  duration: 2000
                })
              }
            })
          }
        })
      },
      cancelReceive (order) {
        MessageBox.confirm('是否取消收货?').then(action => {
          if (action === 'confirm') {
            this.$http.get(`api/account/game/lease/lessee/cancel?status=${order.status}&gameLeaselogId=${order.gameLeaseLogId}`, {
              headers: {
                ZHToken: getUserItem('user').token
              }
            }).then(res => {
              if (res.data.code === 'Ok') {
                Toast({
                  message: '取消成功',
                  position: 'bottom',
                  duration: 2000
                })
                order.status = 4
              } else {
                Toast({
                  message: '取消失败，请重新操作！',
                  position: 'bottom',
                  duration: 2000
                })
              }
            })
          }
        })
      },
      seeCount (order) {
        this.$http.get(`api/account/game/lease/lessee/read?status=${order.status}&gameLeaselogId=${order.gameLeaseLogId}`, {
          headers: {
            ZHToken: getUserItem('user').token
          }
        }).then(res => {
          if (res.data.code === 'Ok') {
            this.countBox.countNumber = res.data.data.account
            this.countBox.passWord = res.data.data.password
            this.countBox.isShow = true
          } else {
            Toast({
              message: '查看失败，请重新操作！',
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

  .select-order-type {
    margin: 10px 0;
    padding: 0 15px;
    > a {
      display: inline-block;
      width: 80px;
      height: 30px;
      background: #fff;
      line-height: 30px;
      text-align: center;
      margin-right: 5px;
      &.active {
        background: @themeColor;
        color: #fff;
      }
    }
  }

  .order-wrapper {
    .order-list {
      > .order-item {
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
          min-height: 40px;
          line-height: 20px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          padding: 5px 15px;
          border-top: 1px solid #ddd;
          border-bottom: 1px solid #ddd;
          .red-txt {
            color: #e4393c;
          }
        }
        .order-control {
          text-align: right;
          padding: 0px 15px;
          > a {
            display: inline-block;
            border: 1px solid @themeColor;
            border-radius: 3px;
            height: 30px;
            width: 80px;
            line-height: 30px;
            text-align: center;
            margin: 5px 0;
            background: @themeColor;
            color: #fff;
          }
        }
      }
    }
  }

  .qr-order-mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    .qr-order-form {
      margin-top: -40px;
      width: 80%;
      min-height: 200px;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 0 15px #333;
      > h1 {
        font-size: 14px;
        height: 40px;
        line-height: 40px;
        padding: 0 15px;
        background: @themeColor;
        color: #fff;
      }
      .form-wrapper {
        > .form-item {
          padding: 0 15px;
          height: 50px;
          > span {
            width: 40px;
          }
          > div {
            border-bottom: 1px solid #999;
            padding: 0 5px;
          }
        }
      }
      .footer-btn {
        height: 50px;
        border-top: 1px solid #ddd;
        > a {
          text-align: center;
          height: 100%;
          line-height: 50px;
          font-size: 14px;
          color: #666;
          &:not(:first-child) {
            border-left: 1px solid #ddd;
          }
        }
      }
    }
  }

  .intoScale-enter-active {
    opacity: 0;
    transition: all 0.2s ease;
    > .qr-order-form {
      transform: scale(0);
      transition: all 0.2s ease;
    }
  }

  .intoScale-enter-to {
    opacity: 1;
    > .qr-order-form {
      transform: scale(1);
    }
  }

  .intoScale-leave-active {
    opacity: 1;
    transition: all 0.2s ease;
    > .qr-order-form {
      transform: scale(1);
      transition: all 0.2s ease;
    }
  }

  .intoScale-leave-to {
    opacity: 0;
    > .qr-order-form {
      transform: scale(0);
    }
  }
  input[disabled]{color:#000;opacity:1}
  .orderPage{
    position: relative;
    .download-tip {
      padding: 0 15px;
      position: absolute;
      height: 44px;
      background: rgba(0, 0, 0, 0.5);
      top: 44px;
      left: 0;
      width: 100%;
      color: #fff;
      font-size: 14px;
      b{
        color:red;
      }
      > a {
        width: 55px;
        height: 30px;
        line-height: 30px;
        color: #fff;
        background: #e4393c;
        border-radius: 5px;
        text-align: center;
        font-size: 16px;
      }
    }
    .alert-download-mask{
      position: absolute;
      width: 100%;
      height:100%;
      top: 0;
      left: 0;
      right: 0;
      bottom:0;
      background: rgba(0,0,0,0.6);
      .download_box{
        width: 80%;
        min-height: 200px;
        background: #fff;
        border-radius: 10px;
        margin-top: -50px;
        padding: 0 15px;
        >p.download_title{
          font-size: 18px;
          font-weight: bold;
        }
        >a{
          height:48px;
          width: 100%;
          background: @themeColor;
          color:#fff;
          text-align: center;
          line-height: 48px;
          border-radius: 5px;
          &:not(:first-child){
            margin-top: 20px;
          }
        }
      }
    }
  }
  .downloadShow-enter-active{
    opacity: 0;
    transition: all 0.3s;
    >div{
      transform: scale(0);
      transition: all 0.3s;
    }
  }
  .downloadShow-enter-to{
    opacity: 1;
    >div{
      transform: scale(1);
    }
  }
  .downloadShow-leave-active{
    opacity: 1;
    transition: all 0.3s;
    >div{
      transform: scale(1);
      transition: all 0.3s;
    }
  }
  .downloadShow-leave-to{
    opacity: 0;
    >div{
      transform: scale(0);
    }
  }
</style>
