<template>
  <div>
    <v-Header class="gray-back">
      <a href="javascript:history.go(-1)" slot="left-link" class="left-link" flex="main:center cross:center"
         flex-box="0">
        <i class="icon-left_arrow"></i>
      </a>
      <span slot="center-content">我的余额</span>
      <a href="javascript:void(0)" to="" slot="right-link" flex="main:center cross:center" class="right-link"
         flex-box="0"></a>
    </v-Header>
    <section flex-box="1" class="">
      <div class="my-balance-show" flex="main:center cross:center">
        <div>
          <p>余额（元）</p>
          <p class="rmb-number">{{balance}}</p>
        </div>
      </div>
      <div class="wallet-control" flex="box:mean cross:center">
        <router-link to="/mine/tixian">提现</router-link>
        <router-link to="/mine/deposit">充值</router-link>
      </div>
    </section>
  </div>
</template>
<script>
  import {getUserItem, saveUserItem} from '../../../utils'
  import {Toast} from 'mint-ui'
  export default {
    data () {
      return {
        balance: ''
      }
    },
    created () {
      this.$http.get('api/account/balance', {
        headers: {
          'ZHToken': getUserItem('user').token
        }
      }).then((res) => {
        if (res.data.code === 'Ok') {
          this.balance = res.data.data
        } else {
          Toast({
            message: res.data.result,
            position: 'bottom'
          })
        }
      }, () => {
        Toast({
          message: '网络错误，请刷新页面！',
          position: 'bottom'
        })
      })
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
          }
        })
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  .my-balance-show {
    background: #3E3E3E;
    color: #fff;
    height: 160px;
    > div {
      text-align: center;
      .rmb-number {
        font-size: 24px;
        margin-top: 25px;
      }
    }
  }

  .wallet-control {
    height: 40px;
    background: #434343;
    > a {
      color: #fff;
      text-align: center;
      font-size: 14px;
      &:not(:first-child) {
        border-left: 1px solid #fff;
      }
    }
  }

  .gray-back {
    background: #3E3E3E;
  }
</style>
