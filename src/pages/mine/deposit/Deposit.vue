<template>
  <div>
    <v-Header>
      <a href="javascript:history.go(-1)" slot="left-link" class="left-link" flex="main:center cross:center"
         flex-box="0">
        <i class="icon-left_arrow"></i>
      </a>
      <span slot="center-content">充值</span>
      <a href="javascript:void (0)" slot="right-link" flex="main:center cross:center" class="right-link"
         flex-box="0" style="font-size: 14px"></a>
    </v-Header>
    <section flex-box="1" class="backSection deposit">
      <div class="balance">当前余额：{{depositObj.balance}}元</div>
      <div class="deposit-option">
        <label class="deposit-item" v-for="item in depositObj.depositOption">
          <input type="radio" name="depositOption" :value="item.idx" v-model="qrDeposit.depositOption">
          <span>{{`${item.price/100}元`}}</span>
        </label>
      </div>
      <p class="tips">提示：充值金额必须为100的整数倍，仅支持<em>支付宝充值</em></p>
      <div class="pay-type">
        <p>支付方式</p>
        <div class="pay-type-list">
          <label class="pay-type-item" flex="dir:left cross:center">
            <span flex="main:center cross:center">
              <input type="radio" checked value="支付宝" name="payType"/>
              <em></em>
            </span>
            <p>支付宝</p>
          </label>
        </div>
      </div>
      <div class="pay-btn">
        <a href="javascript:void(0)" @click="payDeposit()">立即支付</a>
      </div>
    </section>
  </div>
</template>
<script>
  import {getUserItem} from '../../../utils'
  export default {
    data () {
      return {
        depositObj: {
          balance: '',
          depositOption: []
        },
        qrDeposit: {
          depositOption: 0
        }
      }
    },
    methods: {
      payDeposit () {
        this.$http.post(`api/pay/2/h5/recharge/init`, {
          idx: this.depositObj.depositOption[this.qrDeposit.depositOption].idx,
          price: this.depositObj.depositOption[this.qrDeposit.depositOption].price,
          typ: 1
        }, {
          headers: {
            ZHToken: getUserItem('user').token
          }
        }).then(res => {
          if (res.data.code === 'Ok') {
            window.location.href = res.data.data
          }
        })
      }
    },
    created () {
      this.$http.get(`api/account/recharge/prepare`, {
        headers: {
          ZHToken: getUserItem('user').token
        }
      }).then(res => {
        if (res.data.code === 'Ok') {
          this.depositObj.balance = res.data.data.balance
          this.depositObj.depositOption = res.data.data.payItemVos
        }
      })
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import '../../../common/tool';

  .deposit {
    .balance {
      height: 50px;
      line-height: 50px;
      padding: 0 15px;
      margin-bottom: 10px;
      background: #fff;
    }
    .deposit-option {
      padding: 10px 15px;
      background: #fff;
      font-size: 0;
      .deposit-item {
        display: inline-block;
        width: 31%;
        height: 36px;
        &:not(:nth-child(3n+1)) {
          margin-left: 3.5%;
          margin-bottom: 10px;
        }
        > input {
          display: none;
          &:checked + span {
            border-color: @themeColor;
            color: @themeColor;
          }
        }
        > span {
          display: block;
          width: 100%;
          height: 100%;
          border: 1px solid #666;
          line-height: 36px;
          text-align: center;
          border-radius: 5px;
          font-size: 12px;
          transition: all 0.5s ease;
        }
      }
    }
    .tips {
      line-height: 24px;
      font-size: 10px;
      padding: 0 15px;
      color: #999;
      > em {
        color: @themeColor;
      }
    }
    .pay-type {
      background: #fff;
      > p {
        font-size: 12px;
        padding: 0 15px;
        color: #999;
        border-bottom: 1px solid #ddd;
        height: 40px;
        line-height: 40px;
      }
      .pay-type-list {
        .pay-type-item {
          height: 40px;
          border-bottom: 1px solid #ddd;
          padding: 0 15px;
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
      margin-top: 20px;
      padding: 0 15px;
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
