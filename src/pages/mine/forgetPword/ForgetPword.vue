<template>
  <div class='register'>
    <v-Header>
      <a href='javascript:history.go(-1)' slot='left-link' class='left-link' flex='main:center cross:center'
         flex-box='0'>
        <i class='icon-left_arrow'></i>
      </a>
      <span slot='center-content'>找回密码</span>
      <a href='javascript:void(0)' to='' slot='right-link' flex='main:center cross:center' class='right-link'
         flex-box='0'></a>
    </v-Header>
    <div class='login-form clearfix'>
      <label flex='dir:left cross:center'>
        <input flex-box='1' placeholder='请输入手机号码' v-model='registerForm.mobileNum' type='tel'>
      </label>
      <label flex='dir:left cross:center'>
        <input flex-box='1' placeholder='请输入密码' v-model='registerForm.password' type='password'>
      </label>
      <label flex='dir:left cross:center'>
        <input flex-box='1' placeholder='请重复输入密码' v-model='registerForm.passwordAgain' type='password'>
      </label>
      <label flex='dir:left cross:center'>
        <input flex-box='1' placeholder='请输入验证码' v-model='registerForm.valicode' type='number'>
        <a href='javascript:void(0)' class='qr-code-btn' @click='getQrCode()' :class="{'disabled-faded':disabledClick}">{{qrCodeTxt}}</a>
      </label>
      <div class='submit-btn'>
        <a href='javascript:void(0)' @click='registCount()'>确定</a>
      </div>
    </div>
  </div>
</template>

<script>
  import {Toast, MessageBox} from 'mint-ui'
  export default{
    data () {
      return {
        qrCodeTxt: '获取验证码',
        disabledClick: false,
        codeSeconds: 60,
        timer: null,
        registerForm: {
          mobileNum: '',
          password: '',
          passwordAgain: '',
          valicode: ''
        }
      }
    },
    methods: {
      getQrCode () {
        let that = this
        let _codeNumber = this.codeSeconds
        if (this.disabledClick === true) {
          return
        }
        this.$http.get(`api/account/sendmobcode?mobileNum=${that.registerForm.mobileNum}&bizTyp=找回密码`)
          .then((response) => {
            console.log(response)
            if (response.data.code === 'Ok') {
              Toast({
                message: '发送验证码成功，请注意查收！',
                iconClass: 'icon icon-chenggong'
              })
            } else {
              Toast({
                message: response.data.result,
                iconClass: 'icon icon-shibai'
              })
              this.qrCodeTxt = '获取验证码'
              this.codeSeconds = _codeNumber
              this.disabledClick = false
              clearTimeout(that.timer)
            }
          }, () => {
            Toast({
              message: '网络错误，请重试',
              iconClass: 'icon icon-shibai'
            })
            this.qrCodeTxt = '获取验证码'
            this.codeSeconds = _codeNumber
            this.disabledClick = false
            clearTimeout(that.timer)
          })
        this.disabledClick = true
        this.qrCodeTxt = `剩余${this.codeSeconds}s`
        this.timer = setInterval(() => {
          if (this.codeSeconds > 1) {
            this.codeSeconds--
            this.qrCodeTxt = `剩余${this.codeSeconds}s`
          } else {
            this.qrCodeTxt = '获取验证码'
            this.codeSeconds = _codeNumber
            this.disabledClick = false
            clearTimeout(that.timer)
          }
        }, 1000)
      },
      registCount () {
        let that = this
        if (that.registerForm.mobileNum === '') {
          Toast({
            message: '请输入您的手机号码！',
            iconClass: 'icon icon-chenggong'
          })
          return
        } else if (that.registerForm.password === '') {
          Toast({
            message: '请输入您的密码！',
            iconClass: 'icon icon-chenggong'
          })
          return
        } else if (that.registerForm.passwordAgain === '' || that.registerForm.passwordAgain !== that.registerForm.password) {
          Toast({
            message: '请仔细输入您的重复密码！',
            iconClass: 'icon icon-chenggong'
          })
          return
        } else if (that.registerForm.valicode === '') {
          Toast({
            message: '请输入您的验证码！',
            iconClass: 'icon icon-chenggong'
          })
          return
        }
        this.$http.get(`api/account/resetpass?bizTyp=找回密码&mobileNum=${this.registerForm.mobileNum}&password=${this.registerForm.password}&verifyCode=${this.registerForm.valicode}`).then((res) => {
          if (res.data.code === 'Ok') {
            console.log(res)
            MessageBox.alert(res.data.result).then(action => {
              this.$router.push('/mine/login')
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
  .disabled-faded {
    opacity: 0.5;
  }
</style>
