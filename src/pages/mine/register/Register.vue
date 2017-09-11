<template>
  <div class='register'>
    <v-Header>
      <a href='javascript:history.go(-1)' slot='left-link' class='left-link' flex='main:center cross:center'
         flex-box='0'>
        <i class='icon-left_arrow'></i>
      </a>
      <span slot='center-content'>注册</span>
      <a href='javascript:void(0)' to='' slot='right-link' flex='main:center cross:center' class='right-link'
         flex-box='0'></a>
    </v-Header>
    <div class='login-form clearfix'>
      <h1 style="color:red;text-align: center; font-size: 16px;margin: 20px 0;margin-bottom: 35px;">
        注册成功并上架赠送20元现金红包</h1>
      <label flex='dir:left cross:center'>
        <input flex-box='1' placeholder='请输入手机号码进行注册' v-model='registerForm.mobileNum' type='tel'>
      </label>
      <label flex='dir:left cross:center'>
        <input flex-box='1' placeholder='请输入密码' v-model='registerForm.password' type='password'>
      </label>
      <label flex='dir:left cross:center'>
        <input flex-box='1' placeholder='请重复输入密码' v-model='registerForm.passwordAgain' type='password'>
      </label>
      <!--<label flex='dir:left cross:center'>-->
      <!--<input flex-box='1' placeholder='请输入验证码' v-model='registerForm.valicode' type='number'>-->
      <!--<a href='javascript:void(0)' class='qr-code-btn' @click='getQrCode()' :class="{'disabled-faded':disabledClick}">{{qrCodeTxt}}</a>-->
      <!--</label>-->
      <div class="agreement" flex="main:center cross:center">
        <label>
          <input type="checkbox" v-model="agreement"/>
          <span flex="cross:center main:center" :class="{selected:agreement}">
            <i v-if="agreement" class="icon-gou"></i>
          </span>
        </label>
        <router-link to="/mine/xieyi">《租号网用户注册协议》</router-link>
      </div>
      <div class='submit-btn'>
        <a href='javascript:void(0)' style="transition: all 0.2s ease" @click='registCount()'>确定</a>
      </div>
    </div>
  </div>
</template>

<script>
  import {saveUserItem} from '../../../utils'
  import {Toast} from 'mint-ui'
  export default{
    data () {
      return {
        disabledClick: false,
        agreement: false,
        registerForm: {
          mobileNum: '',
          password: '',
          passwordAgain: '',
          valicode: ''
        }
      }
    },
    mounted () {
      let scriptTag = document.createElement('script')
      scriptTag.src = 'http://s11.cnzz.com/stat.php?id=1257060291&web_id=1257060291'
      document.querySelector('.app-wrapper .wrapper').appendChild(scriptTag)
    },
    methods: {
      registCount () {
        let that = this
        if (that.registerForm.mobileNum === '') {
          Toast({
            message: '请输入您的手机号码！',
            iconClass: 'icon icon-shibai'
          })
          return false
        } else if (!(/^1[34578]\d{9}$/.test(that.registerForm.mobileNum))) {
          Toast({
            message: '您的手机号码格式不正确，请重新输入！',
            iconClass: 'icon icon-shibai'
          })
          return false
        } else if (that.registerForm.password === '' || that.registerForm.password.length < 6) {
          Toast({
            message: '密码长度必须大于等于6！',
            iconClass: 'icon icon-shibai'
          })
          return false
        } else if (that.registerForm.passwordAgain === '' || that.registerForm.passwordAgain !== that.registerForm.password) {
          Toast({
            message: '请仔细输入您的重复密码！',
            iconClass: 'icon icon-shibai'
          })
          return false
        }
        if (this.agreement === false) {
          Toast({
            message: '勾选同意协议才能注册哦！'
          })
          return false
        }
        this.$http.post('api/account/h5/register', {
          'mobileNum': that.registerForm.mobileNum,
          'password': that.registerForm.password
        }).then((res) => {
          if (res.data.code === 'Ok') {
            this.$http.post('api/login', {
              deviceId: '登录',
              mobileNum: that.registerForm.mobileNum,
              password: that.registerForm.password
            }).then((res) => {
              if (res.data.code === 'Ok') {
                saveUserItem(res.data.data)
                this.$store.dispatch('getUnread', {http: this.$http})
                window.localStorage.toast = true
                this.$router.push('/mine/gameList')
              } else {
                Toast({
                  message: res.data.result,
                  position: 'bottom',
                  duration: 1000
                })
              }
            })
          } else {
            Toast({
              message: res.data.result,
              position: 'bottom'
            })
          }
        }, (err) => {
          console.log(err)
        })
      }
    }
  }
</script>

<style lang='less' rel='stylesheet/less'>
  @import "../../../common/tool";

  .disabled-faded {
    opacity: 0.5;
  }

  .agreement {
    > label {
      > span {
        width: 18px;
        height: 18px;
        border: 1px solid #999;
        margin-right: 5px;
        > i {
          color: @themeColor;
        }
        &.selected {
          border-color: @themeColor;
        }
      }
      > input {
        display: none;
      }
    }
    > a {
      color: @themeColor;
    }
  }

  .login-form {
    padding-top: 15px;
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
    .bottom-link {
      margin-top: 10px;
      > a {
        color: @themeColor;
      }
    }
  }
</style>
