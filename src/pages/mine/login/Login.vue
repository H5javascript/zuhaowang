<template>
  <div class="login">
    <v-Header>
      <a href="javascript:history.go(-1)" slot="left-link" class="left-link" flex="main:center cross:center"
         flex-box="0">
        <i class="icon-left_arrow"></i>
      </a>
      <span slot="center-content">登录</span>
      <a href="javascript:void(0)" to="" slot="right-link" flex="main:center cross:center" class="right-link"
         flex-box="0"></a>
    </v-Header>
    <section flex-box="1" class="">
      <div class="login-form clearfix">
        <label flex="dir:left cross:center">
          <span flex-box="0">手机号</span>
          <input flex-box="1" placeholder="请输入您的手机号码" v-model="mobileNum" type="tel">
        </label>
        <label flex="dir:left cross:center">
          <span flex-box="0">密码</span>
          <input flex-box="1" placeholder="请输入您的密码" v-model="password" type="password">
        </label>
        <div class="submit-btn">
          <a href="javascript:void(0)" @keyup.enter="login()" @click="login()">登录</a>
        </div>
        <div class="bottom-link" flex="main:justify">
          <router-link to="/mine/forgetPword">忘记密码</router-link>
          <router-link to="/mine/register">快速注册</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import {saveUserItem} from '../../../utils'
  import {Toast} from 'mint-ui'
  export default{
    data () {
      return {
        mobileNum: '',
        password: ''
      }
    },
    methods: {
      login () {
        var that = this
        this.$http.post('api/login', {
          deviceId: '登录',
          mobileNum: that.mobileNum,
          password: that.password
        }).then((res) => {
          if (res.data.code === 'Ok') {
            saveUserItem(res.data.data)
            window.localStorage.toast = true
            this.$store.dispatch('getUnread', {http: this.$http})
            this.$router.push('/mine')
            this.$emit('loginyes')
          } else {
            Toast({
              message: res.data.result,
              position: 'bottom',
              duration: 1000
            })
          }
        })
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../../common/tool";

  .login-form {
    padding-top: 75px;
    padding-left: 15px;
    padding-right: 15px;
    > label {
      height: 30px;
      border-bottom: 1px solid #ccc;
      margin-bottom: 30px;
      > span {
        width: 45px;
        color: #999;
        font-size: 13px;
        line-height: 20px;
      }
      > input {
        border: none;
      }
      .qr-code-btn {
        height: 30px;
        margin-bottom: -1px;
        width: 70px;
        background: @themeColor;
        text-align: center;
        line-height: 30px;
        color: #fff;
        transition: all 0.5s ease;
      }
    }
    .submit-btn {
      margin-top: 35px;
      > a {
        display: block;
        width: 100%;
        height: 36px;
        background: @themeColor;
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 36px;
      }
    }
    .bottom-link{
      margin-top: 10px;
      >a{
        color:@themeColor;
      }
    }
  }
</style>
