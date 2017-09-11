<template>
  <div>
    <v-Header>
      <a href="javascript:history.go(-1)" slot="left-link" class="left-link" flex="main:center cross:center"
         flex-box="0">
        <i class="icon-left_arrow"></i>
      </a>
      <span slot="center-content">提现</span>
      <a href="javascript:void (0)" slot="right-link" flex="main:center cross:center" class="right-link"
         flex-box="0" style="font-size: 14px"></a>
    </v-Header>
    <section flex-box="1" class="tixian backSection">
      <div class="tixian-number" flex="dir:left cross:center">
        <span flex-box="0">提现金额：</span>
        <input flex-box="1" type="number" v-model="tixianPrice" placeholder="请输入您要提现的金额">
      </div>
      <p class="tips">提现金额必须为50的整数倍，最低50元</p>
      <div v-if="!alipay.hasAliCount" class="bind-count">
        <a class="block-btn" href="javascript:void(0)" @click="alipay.isShow=!alipay.isShow">绑定支付宝账户</a>
      </div>
      <div v-if="alipay.hasAliCount" class="tixian-control-panel">
        <h1 class="title">提现到支付宝账户：</h1>
        <label class="select-count" flex="dir:left">
          <div class="checkbox" flex-box="0">
            <input type="checkbox" :checked="tixianCount">
            <span class="icon-zhifubao"></span>
          </div>
          <div class="count-desc" @click="alipay.isShow = !alipay.isShow" flex="dir:top main:justify" flex-box="1">
            <p>姓名：{{alipay.aliPayName}}</p>
            <p>账号：{{alipay.aliPayAccount}}</p>
          </div>
        </label>
        <hr class="split-bar"/>
        <div class="get-code">
          <p class="user-phone">用户手机号：{{phoneNumber}}</p>
          <div class="code-form" flex="dir:left cross:center">
            <input type="number" v-model="valiCode" flex-box="1">
            <span flex-box="0" @click="getValiCode()"
                  :class="{disabled:tixianObj.isStart}">{{tixianObj.getCodeBtntxt}}</span>
          </div>
        </div>
        <div class="tixian-tip">
          <p>余额提现要求说明：</p>
          <p>1、余额账户的资金可进行提现，目前每天只能发起一次提现申请，取消后可再次申请</p>
          <p>2、支付宝提现手续费1%</p>
        </div>
        <div class="tixian-qr">
          <a href="javascript:void(0)" @click="tixian()" class="block-btn">确定</a>
        </div>
      </div>
    </section>
    <transition name="intoScale">
      <div v-if="alipay.isShow" class="qr-order-mask" flex="main:center cross:center">
        <div class="qr-order-form" flex="dir:top">
          <h1 flex-box="0">请输入您要绑定的支付宝账户和用户名</h1>
          <div flex-box="1" class="form-wrapper">
            <label class="form-item" flex="dir:left cross:center">
              <span flex-box="0">账号：</span>
              <div flex-box="1">
                <input v-model="alipay.aliPayAccount" style="width: 100%" type="text">
              </div>
            </label>
            <label class="form-item" flex="dir:left cross:center">
              <span flex-box="0">用户名：</span>
              <div flex-box="1">
                <input v-model="alipay.aliPayName" style="width: 100%" type="text"/>
              </div>
            </label>
          </div>
          <div class="footer-btn" flex-box="0" flex="box:mean">
            <a href="javascript:void(0)" @click="alipay.isShow=!alipay.isShow">关闭</a>
            <a href="javascript:void(0)" @click="bindAli()">确认</a>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  import {Toast} from 'mint-ui'
  import {getUserItem} from '../../../utils'
  export default {
    data () {
      return {
        alipay: {
          isShow: '',
          aliPayAccount: '',
          aliPayName: '',
          hasAliCount: false
        },
        tixianCount: false,
        phoneNumber: getUserItem('user').user.mobile,
        tixianPrice: '',
        valiCode: '',
        tixianObj: {
          count: 60,
          isStart: false,
          getCodeBtntxt: '获取验证码'
        },
        timer: null
      }
    },
    methods: {
      getTixian () {
        this.$http.post(`api/account/withdraw/prepare`, {}, {
          headers: {
            ZHToken: getUserItem('user').token
          }
        }).then(res => {
          if (res.data.data === null) {
            return false
          }
          this.alipay.hasAliCount = true
          this.alipay.aliPayAccount = res.data.data.aliPayAccount
          this.alipay.aliPayName = res.data.data.aliPayName
        })
      },
      getValiCode () {
        if (this.tixianObj.isStart === true) {
          return false
        }
        let price = parseFloat(this.tixianPrice)
        let balance = parseFloat(getUserItem('user').user.balance)
        if (price % 50 !== 0) {
          Toast({
            message: '对不起，您输入的金额不正确或者不是50的整数倍，请重新输入',
            position: 'bottom',
            duration: 2000
          })
          return false
        }
        if (price > balance) {
          Toast({
            message: '对不起，您的余额不足，请重新输入提现金额',
            position: 'bottom',
            duration: 2000
          })
          return false
        }
        let that = this
        this.$http.get('api/account/sendmobcode?bizTyp=提现', {
          headers: {
            ZHToken: getUserItem('user').token
          }
        }).then(res => {
          if (res.data.code === 'Ok') {
            Toast({
              message: '获取验证码成功，请注意查收！',
              position: 'bottom',
              duration: 2000
            })
            let totalSeconds = that.tixianObj.count
            that.tixianObj.getCodeBtntxt = `剩余${totalSeconds}s`
            this.timer = setInterval(() => {
              if (totalSeconds > 1) {
                totalSeconds = totalSeconds - 1
                that.tixianObj.getCodeBtntxt = `剩余${totalSeconds}s`
              } else {
                clearInterval(that.timer)
                that.timer = null
                that.tixianObj.getCodeBtntxt = '获取验证码'
                that.tixianObj.isStart = false
                return false
              }
            }, 1000)
          } else {
            Toast({
              message: res.data.result,
              position: 'bottom',
              duration: 2000
            })
            return false
          }
        })
      },
      bindAli () {
        if (!(/^1[34578]\d{9}$/.test(this.alipay.aliPayAccount)) && !(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(this.alipay.aliPayAccount))) {
          Toast({
            message: '账户格式不正确，请重新输入！',
            position: 'bottom',
            duration: 2000
          })
          return false
        } else if (this.alipay.aliPayName === '') {
          Toast({
            message: '用户名为空，请重新填写！',
            bottom: 'bottom',
            duration: 2000
          })
          return false
        }
        this.$http.get(`api/account/bind/alipay?account=${this.alipay.aliPayAccount}&name=${this.alipay.aliPayName}`, {
          headers: {
            ZHToken: getUserItem('user').token
          }
        }).then(res => {
          if (res.data.code === 'Ok') {
            Toast({
              message: '设置成功',
              position: 'bottom',
              duration: 2000
            })
            this.alipay.hasAliCount = true
            this.alipay.isShow = false
          } else {
            Toast({
              message: res.data.result,
              position: 'bottom',
              duration: 2000
            })
          }
        })
      },
      tixian () {
        if (this.valiCode === '') {
          Toast({
            message: '验证码不能为空',
            position: 'bottom',
            duration: 2000
          })
        }
        this.$http.post(`api/account/withdraw`, {
          amount: parseFloat(this.tixianPrice) * 100,
          bizTyp: '提现',
          verifyCode: this.valiCode
        }, {
          headers: {
            ZHToken: getUserItem('user').token
          }
        }).then(res => {
          if (res.data.code === 'Ok') {
            Toast({
              message: '您的申请已经提交，24小时内处理完毕！',
              position: 'bottom',
              duration: 2000
            })
            window.history.go(-1)
          } else {
            Toast({
              message: res.data.result,
              position: 'bottom',
              duration: 2000
            })
          }
        })
      }
    },
    created () {
      this.getTixian()
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../common/tool";

  .tixian {
    &-number {
      height: 50px;
      padding: 0 15px;
      background: #fff;
      > span {
        width: 70px;
      }
      > input {
        border: none;
      }
    }
    .tips {
      padding: 0 15px;
      font-size: 10px;
      line-height: 40px;
    }
    .block-btn {
      display: block;
      width: 100%;
      height: 36px;
      background: @themeColor;
      color: #fff;
      text-align: center;
      line-height: 36px;
    }
    .bind-count {
      padding: 0 15px;
    }
    .tixian-control-panel {
      padding: 10px 0;
      padding-bottom: 0;
      background: #fff;
      .title {
        color: #999;
        font-size: 14px;
        color: #000;
        padding: 0 15px;
      }
      .select-count {
        padding: 0 15px 10px 15px;
        margin-top: 15px;
        .checkbox {
          width: 30px;
          font-size: 0;
          color: @themeColor;
          > span {
            font-size: 18px;
          }
        }
        .count-desc {
          height: 40px;
          > p {
          }
        }
      }
      .split-bar {
        height: 20px;
        margin: 0;
        background: #efefef;
        border: none;
      }
      .get-code {
        > p {
          height: 50px;
          line-height: 50px;
          padding: 0 15px;
          border-bottom: 1px solid #eee;
        }
        .code-form {
          height: 50px;
          padding: 0 15px;
          > input {
            border: none;
          }
          > span {
            color: @themeColor;
            width: 80px;
            text-align: center;
            border-left: 1px solid #ddd;
          }
        }
      }
      .tixian-tip {
        background: #efefef;
        padding: 10px 15px;
        line-height: 18px;
        font-size: 10px;
        color: #999;
      }
      .tixian-qr {
        padding: 0 15px;
        background: #efefef;
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
            width: 50px;
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
</style>
