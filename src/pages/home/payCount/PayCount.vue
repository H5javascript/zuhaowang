<template>
  <div class="vip">
    <v-Header class="">
      <a href="javascript:history.go(-1)" slot="left-link" class="left-link" flex="main:center cross:center"
         flex-box="0">
        <i class="icon-left_arrow"></i>
      </a>
      <span slot="center-content">租号网收银台</span>
      <a href="javascript:void(0)" to="" slot="right-link" flex="main:center cross:center" class="right-link"
         flex-box="0"></a>
    </v-Header>
    <section flex-box="1" class="vip-wrapper">
      <!--<h1>订单金额{{this.$route.params.}}</h1>-->
      <div class="pay-type">
        <p>支付方式</p>
        <div class="pay-type-list">
          <label class="pay-type-item" flex="dir:left cross:center">
            <span flex="main:center cross:center">
              <input type="radio" v-model="payMode" value="2" name="payType"/>
              <em></em>
            </span>
            <p>支付宝</p>
          </label>
          <label class="pay-type-item" flex="dir:left cross:center">
            <span flex="main:center cross:center">
              <input type="radio" v-model="payMode" value="1" name="payType"/>
              <em></em>
            </span>
            <p>余额支付</p>
          </label>
        </div>
      </div>
      <div class="pay-btn">
        <a href="javascript:void(0)" @click="payVip()">立即支付</a>
      </div>
    </section>
  </div>
</template>
<script>
  import {getUserItem} from '../../../utils'
  import {Toast} from 'mint-ui'
  export default {
    data () {
      return {
        payMode: 2
      }
    },
    methods: {
      payVip () {
        this.$http.post(`api/pay/${this.payMode}/game/${this.$route.query.gameId}/lease/${this.$route.query.recordHash}/h5/init`, {
          deposit: parseFloat(this.$route.query.deposit) * 100,
          hour: this.$route.query.hour,
          rent: parseFloat(this.$route.query.rent) * 100,
          sellerId: this.$route.query.sellerId,
          startTime: this.$route.query.startTime,
          totalAmt: parseFloat(this.$route.query.totalAmt) * 100
        }, {
          headers: {
            ZHToken: getUserItem('user').token
          }
        }).then(res => {
          if (res.data.code === 'Ok') {
            if (parseInt(this.payMode) === 1) {
              Toast({
                message: '下单成功，请在租用订单中查看',
                position: 'bottom',
                duration: 2000
              })
              this.$router.push({path: '/mine/payResult', query: {result: 1}})
            } else if (parseInt(this.payMode) === 2) {
              window.location.href = res.data.data.buttedUrl
            }
          } else {
            Toast({
              message: res.data.result,
              position: 'bottom',
              duration: 2000
            })
            return false
          }
        }, () => {
        })
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../common/tool";

  .vip-wrapper {
    padding: 0 15px;
    padding-top: 20px;
    > h1 {
      font-size: 16px;
    }
    .pay-type {
      margin-top: 20px;
      > p {
        font-size: 12px;
        color: #999;
        border-bottom: 1px solid #ddd;
        height: 40px;
        line-height: 40px;
      }
      .pay-type-list {
        .pay-type-item {
          height: 40px;
          border-bottom: 1px solid #ddd;
          > span {
            width: 15px;
            height: 15px;
            border: 1px solid #999;
            border-radius: 50%;
            margin-right: 5px;
            > input {
              display: none;
              &:checked + em {
                width: 9px;
                height: 9px;
                opacity: 0.5;
                border-radius: 50%;
                background: @themeColor;
              }
            }
          }
        }
      }
    }
    .pay-btn {
      margin-top: 60px;
      > a {
        display: block;
        height: 36px;
        background: @themeColor;
        color: #fff;
        text-align: center;
        line-height: 36px;
      }
    }
  }
</style>
