<template>
  <div>
    <v-Header>
      <a href="javascript:history.go(-1)" slot="left-link" class="left-link" flex="main:center cross:center"
         flex-box="0">
        <i class="icon-left_arrow"></i>
      </a>
      <span slot="center-content">{{$route.query.gameServer}}</span>
      <a href="javascript:void(0)" to="" slot="right-link" flex="main:center cross:center" class="right-link"
         flex-box="0"></a>
    </v-Header>
    <section flex-box="1" class="">
      <div class="count-introl" flex="dir:left">
        <span class="game-img" flex-box="0">
          <img :src="$route.query.gameIconurl" alt="">
        </span>
        <div class="count-desc" flex-box="1">
          <p class="one">{{$route.query.gameServer}}</p>
          <p class="two">{{$route.query.title}}</p>
          <p class="three">￥<b>{{$route.query.rent}}</b>/小时 押金<b>{{$route.query.deposit}}</b>元</p>
        </div>
        <div class="count-control" flex-box="0" flex="dir:top main:justify">
          <span class="link">{{$route.query.vip ? '会员' : '标签'}}</span>
        </div>
      </div>
      <div class="count-price">
        <div class="price-box" flex="box:mean">
          <span flex="dir:top cross:center main:center">
            <p class="price-num">{{countMsg.rent}}元</p>
            <p>时租</p>
          </span>
          <span flex="dir:top cross:center main:center">
            <p class="price-num">{{countMsg.dailyrent}}元</p>
            <p>日租</p>
          </span>
          <span flex="dir:top cross:center main:center">
            <p class="price-num">{{countMsg.weeklyRent}}元</p>
            <p>周租</p>
          </span>
        </div>
      </div>
      <div class="count-detail">
        <div class="count-params">
          <h1 class="title">账号参数</h1>
          <ul class="params-list clearfix">
            <li class="params-item" flex="main:justify" v-for="shortParam in countMsg.gameDefOptionsUp">
              <span class="key">{{shortParam.labelName}}</span>
              <p class="value">{{shortParam.labelValue}}</p>
            </li>
          </ul>
        </div>
        <div class="count-desc" v-if="countMsg.gameDefOptionsDown>0">
          <h1 class="title">账号描述</h1>
          <div class="desc-list">
            <div class="desc-item" v-for="longParam in countMsg.gameDefOptionsDown">
              <h1 class="desc-key">{{longParam.labelName}}</h1>
              <p class="desc-value">{{longParam.labelValue}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="seller-msg" flex="dir:left cross:center">
        <span class="seller-head-img" flex-box="0">
          <img :src="countMsg.sellerIdIconUrl" alt="">
        </span>
        <p class="" flex-box="1">{{countMsg.sellerIdNick}}的小店</p>
      </div>
    </section>
    <footer class="footer-buy" v-if="nowId!=countMsg.sellerId" flex-box="0" flex="box:mean">
      <a href="javascript:void(0)" @click="contactUser()" flex="main:center cross:center" class="contact">联系店家</a>
      <a href="javascript:void(0)" flex="main:center cross:center" @click="rentCount()" class="iwant">我要租</a>
    </footer>
    <transition name="rentInto">
      <div v-if="order.isopenOrder" class="qr-order-page backSection" flex="dir:top">
        <v-Header>
          <a href="javascript:void(0)" @click="rentCount()" slot="left-link" class="left-link"
             flex="main:center cross:center"
             flex-box="0">
            <i class="icon-left_arrow"></i>
          </a>
          <span slot="center-content">{{$route.query.gameServer}}</span>
          <a href="javascript:void(0)" to="" slot="right-link" flex="main:center cross:center" class="right-link"
             flex-box="0"></a>
        </v-Header>
        <section flex-box="1" class="canscroll">
          <div class="count-introl" flex="dir:left">
            <span class="game-img" flex-box="0">
              <img :src="$route.query.gameIconurl" alt="">
            </span>
            <div class="count-desc" flex-box="1">
              <p class="one">{{$route.query.gameServer}}</p>
              <p class="two">{{$route.query.title}}</p>
              <p class="three">￥<b>{{$route.query.rent}}</b>/小时 押金<b>{{$route.query.deposit}}</b>元</p>
            </div>
            <div class="count-control" flex-box="0" flex="dir:top main:justify">
              <span class="link">{{$route.query.vip ? '会员' : '标签'}}</span>
            </div>
          </div>
          <div class="buy-mode">
            <label class="select-item" flex="dir:left cross:center">
              <span flex-box="0" class="select-name">租赁模式</span>
              <select flex-box="1" v-model="order.rentTypeVal">
                <option v-for="(item,index) in order.rentType" :value='`${index}`'>{{item}}</option>
              </select>
              <i class="icon-right-arrow"></i>
            </label>
            <label class="select-item" flex="dir:left cross:center">
              <span flex-box="0" class="select-name">游戏时间</span>
              <select flex-box="1" v-model="order.gameTimeVal">
                <option v-for="(item,index) in order.timeNumber[order.rentTypeVal]" :value='index'>{{item}}</option>
              </select>
              <i class="icon-right-arrow"></i>
            </label>
            <label class="select-item" flex="dir:left cross:center">
              <span flex-box="0" class="select-name">开始时间</span>
              <input flex-box="1" unselectable="on" onfocus="this.blur()" readonly @click="open('picker1')"
                     :value="value" placeholder="请选择开始时间"/>
              <i class="icon-right-arrow"></i>
            </label>
          </div>
          <div class="price-calc">
            <div class="price-item" flex="main:justify cross:center">
              <span class="item-name">租金总额</span>
              <b>￥{{price.total}}</b>
            </div>
            <div class="price-item" flex="main:justify cross:center">
              <span class="item-name">押金</span>
              <b>￥{{this.$route.query.deposit}}</b>
            </div>
          </div>
          <p class="tips">{{order.tipsTxt}}</p>
        </section>
        <footer class="order-qr" flex-box="0" flex="dir:left">
          <div flex-box="1">实付款：￥{{price.totalAmt}}</div>
          <a @click="submitOrder()" href="javascript:void(0)" flex-box="0">提交订单</a>
        </footer>
        <mt-datetime-picker
          ref="picker1"
          type="datetime"
          v-model="value1"
          year-format="{value}"
          month-format="{value} 月"
          date-format="{value} 日"
          :startDate="startDate"
          :endDate="endDate"
          @confirm="handleChange">
        </mt-datetime-picker>
      </div>
    </transition>
  </div>
</template>
<script>
  import { getUserItem } from '../../../utils'
  import { Toast } from 'mint-ui'
  import dateFormat from 'dateformat'
  export default {
    data () {
      return {
        countMsg: {
          dailyrent: '',
          gameDefOptionsDown: [],
          gameDefOptionsUp: [],
          rent: '',
          sellerId: '',
          sellerIdIconUrl: '',
          sellerIdNick: '',
          weeklyRent: ''
        },
        nowId: null,
        order: {
          isopenOrder: false,
          tipsTxt: '',
          rentTypeVal: 0,
          gameTimeVal: 0,
          rentType: ['包时', '包天'],
          timeNumber: [
            ['请选择游戏时间', '1小时', '2小时', '3小时', '4小时', '5小时', '6小时', '7小时', '8小时', '9小时'],
            ['请选择游戏时间', '1天', '2天', '3天', '4天', '5天', '6天', '7天']
          ]
        },
        pickerValue: '',
        value: '',
        value1: null,
        startDate: new Date(new Date().getTime() + 31 * 60 * 1000),
        endDate: new Date(new Date().getFullYear() + 5 + ''),
        price: {
          deposit: '',
          total: 0,
          totalAmt: 0
        },
        totalHour: null,
        submitTime: null
      }
    },
    created () {
      this.nowId = getUserItem('user').user.id
      this.$http.get(`api/game/${this.$route.query.gameId}/lease/${this.$route.query.recordHash}`).then((res) => {
        this.countMsg.dailyrent = res.data.data.dailyrent
        this.countMsg.gameDefOptionsDown = res.data.data.gameDefOptionsDown
        this.countMsg.gameDefOptionsUp = res.data.data.gameDefOptionsUp
        this.countMsg.rent = res.data.data.rent
        this.countMsg.sellerId = res.data.data.sellerId
        this.countMsg.sellerIdIconUrl = res.data.data.sellerIdIconUrl
        this.countMsg.sellerIdNick = res.data.data.sellerIdNick
        this.countMsg.weeklyRent = res.data.data.weeklyRent
      }, () => {
      })
      this.$http.get(`api/game/${this.$route.query.gameId}/lease/${this.$route.query.recordHash}/prepare`, {
        headers: {
          ZHToken: getUserItem('user').token
        }
      }).then(res => {
        if (res.data.code === 'Ok') {
          this.order.tipsTxt = res.data.data
        }
      }, () => {
      })
    },
    methods: {
      submitOrder () {
        var submitObj = {
          deposit: this.price.deposit,
          hour: this.totalHour,
          rent: this.price.total,
          sellerId: this.countMsg.sellerId,
          startTime: this.submitTime + '',
          totalAmt: this.price.totalAmt,
          gameId: this.$route.query.gameId,
          recordHash: this.$route.query.recordHash
        }
        for (var key in submitObj) {
          if (submitObj[key] === '') {
            Toast({
              message: '对不起，您未选择订单的详细规格，请仔细检查后提交订单！',
              position: 'bottom',
              duration: 2000
            })
            return false
          }
        }
//        console.log(JSON.stringify(submitObj))
        this.$router.push({
          path: '/home/payCount',
          query: submitObj
        })
      },
      open (picker) {
        this.$refs[picker].open()
      },
      handleChange (value) {
        this.date1 = value.toString()
        this.value = dateFormat(new Date(this.date1), 'yyyy-mm-dd HH:MM')
        this.submitTime = new Date(dateFormat(new Date(this.date1).getTime())).getTime() + ''
      },
      contactUser () {
        if (getUserItem('user')) {
          if (getUserItem('user').user.vip === true) {
            this.$router.push({
              path: '/message/messageDetail',
              query: {userId: this.countMsg.sellerId, userName: this.countMsg.sellerIdNick}
            })
          } else {
            this.$router.push('/mine/vip')
          }
        } else {
          this.$router.push('/mine/login')
        }
      },
      getOrder () {
        let hour
        if (parseInt(this.order.gameTimeVal) === 0) {
          return false
        } else {
          if (parseInt(this.order.rentTypeVal) === 0) {
            hour = parseInt(this.order.gameTimeVal)
          } else if (parseInt(this.order.rentTypeVal) === 1) {
            hour = parseInt(this.order.gameTimeVal) * 24
          }
        }
        this.totalHour = hour
        this.$http.get(`api/game/${this.$route.query.gameId}/lease/${this.$route.query.recordHash}/prepare/rent?hour=${hour}`, {
          headers: {
            ZHToken: getUserItem('user').token
          }
        }).then(res => {
          if (res.data.code === 'Ok') {
            this.price.deposit = res.data.data.deposit
            this.price.total = res.data.data.total
            this.price.totalAmt = res.data.data.totalAmt
          }
        })
      },
      rentCount () {
        this.order.isopenOrder = !this.order.isopenOrder
      }
    },
    computed: {
      mode () {
        return this.order.rentTypeVal
      },
      totalTime () {
        return this.order.gameTimeVal
      }
    },
    watch: {
      mode () {
        this.getOrder()
      },
      totalTime () {
        this.getOrder()
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../common/tool";

  .count-price {
    padding: 0 15px;
    margin: 10px 0;
    .price-box {
      border-radius: 10px;
      border: 1px solid #979797;
      padding: 10px 0;
      > span:not(:first-child) {
        border-left: 1px solid #979797;
      }
      > span {
        > p:last-child {
          color: #979797;
          font-size: 10px;
        }
      }
    }
  }

  .count-introl {
    background: #fff;
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

  .count-detail {
    padding: 0 15px;
    .title {
      line-height: 55px;
      color: #666;
      font-size: 16px;
    }
    .count-params {
      .params-list {
        border-top: 1px solid #e7e7e7;
        > li {
          line-height: 45px;
          float: left;
          width: 50%;
          border-bottom: 1px solid #e7e7e7;
          border-right: 1px solid #e7e7e7;
          .key {
            color: #999;
          }
          &:nth-child(2n+1) {
            padding-right: 5px;
          }
          &:nth-child(2n+2) {
            padding-left: 5px;
            border-right: none;
          }
        }
      }
    }
    .desc-list {
      .desc-item {
        color: #999;
        margin-bottom: 10px;
        .desc-key {
          font-size: 14px;
        }
        .desc-value {
        }
      }
    }
  }

  .seller-msg {
    margin-top: 20px;
    padding: 0 15px;
    .seller-head-img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 10px;
      > img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    > p {
      font-size: 14px;
    }
  }

  .footer-buy {
    height: 40px;
    > a {
      height: 100%;
      font-size: 16px;
    }
    .contact {
      border: 1px solid #ddd;
    }
    .iwant {
      background: @themeColor;
      color: #fff;
    }
  }

  .qr-order-page {
    position: fixed;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .buy-mode {
    padding: 0 15px;
    background: #fff;
    > label {
      height: 50px;
      &:not(:last-child) {
        border-bottom: 1px solid #ddd;
      }
      > span {
        width: 50px;
      }
      > select {
        direction: rtl;
      }
      > input {
        text-align: right;
        color: #666;
      }
      > i {
        font-size: 18px;
        color: #999;
        margin-left: 5px;
      }
    }
  }

  .price-calc {
    padding: 0 15px;
    margin-top: 20px;
    background: #fff;
    > .price-item {
      height: 50px;
      &:not(:last-child) {
        border-bottom: 1px solid #ddd;
      }
      > b {
        font-weight: normal;
        color: red;
      }
    }
  }

  .tips {
    color: #999;
    font-size: 10px;
    padding: 0 15px;
    margin-top: 5px;
  }

  .order-qr {
    height: 44px;
    > div {
      line-height: 44px;
      text-align: right;
      padding-right: 15px;
      background: #fff;
      border-top: 1px solid #ddd;
      color: @themeColor;
      font-size: 16px;
    }
    > a {
      background: @themeColor;
      color: #fff;
      text-align: center;
      line-height: 44px;
      width: 100px;
      font-size: 16px;
    }
  }

  .rentInto-enter-active {
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.5s ease;
  }

  .rentInto-leave-active {
    transition: all 0.5s ease;
    transform: translateX(0%);
    opacity: 1;
  }

  .rentInto-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }

  .rentInto-enter-to {
    transform: translateX(0);
    opacity: 1;
  }
</style>
