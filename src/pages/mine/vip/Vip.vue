<template>
  <div class="vip">
    <v-Header class="">
      <a href="javascript:history.go(-1)" slot="left-link" class="left-link" flex="main:center cross:center"
         flex-box="0">
        <i class="icon-left_arrow"></i>
      </a>
      <span slot="center-content">会员充值</span>
      <a href="javascript:void(0)" to="" slot="right-link" flex="main:center cross:center" class="right-link"
         flex-box="0"></a>
    </v-Header>
    <section flex-box="1" class="vip-wrapper">
      <div class="pay-logo">
        <img src="../../../common/img/bao.png" alt="">
      </div>
      <p class="warning">为保护好你的帐号，平台要求每个用户购买托管保障服务。仅需49元/年享受正式会员托管服务以及最高3000元赔付保障。</p>
      <p class="call-alert" @click="alertWarning()">会员服务详情</p>
      <h1>服务费：49元/年</h1>
      <div></div>
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
        <a href="javascript:void(0)" @click="payVip()">立即支付</a>
      </div>
    </section>
  </div>
</template>
<script>
  import {getUserItem} from '../../../utils'
  import {MessageBox} from 'mint-ui'
  export default {
    data () {
      return {
        vip: {
          vendor: 2,
          price: 49,
          type: 2
        }
      }
    },
    mounted () {
      let scriptTag = document.createElement('script')
      scriptTag.src = 'http://s11.cnzz.com/stat.php?id=1257806770&web_id=1257806770'
      document.querySelector('.app-wrapper .wrapper').appendChild(scriptTag)
    },
    methods: {
      payVip () {
        this.$http.post(`api/pay/${this.vip.vendor}/h5/recharge/init`, {
          price: this.vip.price * 10 * 10,
          typ: this.vip.type
        }, {
          headers: {
            ZHToken: getUserItem('user').token
          }
        }).then(res => {
          if (res.data.code === 'Ok') {
            window.location.href = res.data.data
          }
        }, () => {
        })
      },
      alertWarning () {
        MessageBox({
          message: '1.盗号封号享受赔付最高3000元的保障租号方原因导致封号3天以内赔付100元7天以内赔付300元30天以内赔付500元终身封号赔付1000元出现盗号根据帐号价值赔付200-3000元不等<br/>' +
          '2.同时赠送一年订单短信推送服务让你不错过任何一条订单<br/>' +
          '3.享受工单快速响应<br/>' +
          '4.享受站内消息发送<br/>' +
          '5.享受专属电话客服介入服务支付成功代表同意以上服务方案'
        }).then(() => {
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
      margin: 10px 0;
    }
    .pay-type {
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
    .warning {
      margin-top: 5px;
    }
    .call-alert {
      color: red;
    }
    .pay-logo {
      width: 20%;
      height: 15vm;
      margin: 0 auto;
      > img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
