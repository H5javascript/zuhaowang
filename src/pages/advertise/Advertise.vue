<template>
  <div class="advertise">
    <h1 class="advertise-title">您有一个新的订单啦！</h1>
    <p class="advertise-tips">会员下载客户端就送<b>18.8</b>元</p>
    <div class="down-load-list">
      <a :href="android">安卓客户端下载</a>
      <router-link to="/mine">进入网页版</router-link>
      <a :href="ios">苹果客户端下载</a>
      <a @click="backWord=!backWord" href="javascript:void(0)">错误反馈（有奖）</a>
    </div>
    <transition name="scaleToback">
      <div v-if="backWord" @click="backWord=!backWord" class="back-word-mask" flex="main:center cross:center">
        <div @click.stop='' class="back-word">
          <p class="title" style="color:red">感谢您参与租号网反馈，一经采用核实，奖励200元RMB</p>
          <div class="phoneNum-input" flex="dir:left cross:center">
            <span class="name" flex-box="0">手机号</span>
            <div flex-box="1">
              <input type="tel" placeholder="方便我们联系您" v-model="phoneNum"/>
            </div>
          </div>
          <div class="back-word-box">
            <textarea rows="10" placeholder="您的宝贵意见，就是我们进步的源泉" v-model="backtext"></textarea>
          </div>
          <div class="submit-btn">
            <a href="javascript:void(0)" @click="submitBack">问题提交</a>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui'
  export default{
    data () {
      return {
        backWord: false,
        phoneNum: '',
        backtext: '',
        android: '',
        ios: ''
      }
    },
    created () {
      this.$http.get('api/download/url').then(res => {
        if (res.data.code === 'Ok') {
          this.android = res.data.data.androidUrl
          this.ios = res.data.data.iosUrl
        }
      })
    },
    mounted () {
      let scriptTag = document.createElement('script')
      scriptTag.src = 'http://s11.cnzz.com/stat.php?id=1257953899&web_id=1257953899'
      document.querySelector('.app-wrapper .wrapper').appendChild(scriptTag)
    },
    methods: {
      submitBack () {
        if (this.phoneNum === '' || !(/^1[34578]\d{9}$/.test(this.phoneNum))) {
          Toast({
            message: '手机号码格式错误,请重新输入！',
            position: 'bottom'
          })
          return false
        }
        if (this.backtext === '') {
          Toast({
            message: '反馈内容不能为空',
            position: 'bottom'
          })
          return false
        }
        if (this.backtext.length < 10) {
          Toast({
            message: '反馈内容不能为少于10个字符',
            position: 'bottom'
          })
          return false
        }
        this.$http.get(`api/account/error/back?content=${this.backtext}&mobile=${this.phoneNum}`).then(res => {
          if (res.data.code === 'Ok') {
            Toast({
              message: '您的反馈已提交成功！',
              iconClass: 'icon icon-chenggong'
            })
            this.backWord = false
            this.phoneNum = ''
            this.backtext = ''
          } else {
            Toast({
              message: res.data.result,
              iconClass: 'icon icon-shibai'
            })
          }
        })
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/tool";

  .advertise {
    text-align: center;
    padding: 24px 15px;
    .advertise-title {
      font-size: 24px;
    }
    .advertise-tips {
      font-size: 14px;
      margin-top: 10px;
      > b {
        color: red;
      }
    }
    .down-load-list {
      margin-top: 30px;
      > a {
        border-radius: 3px;
        font-size: 16px;
        margin-bottom: 20px;
        display: block;
        height: 48px;
        line-height: 48px;
        background: @themeColor;
        color: #fff;
      }
    }
  }

  .back-word-mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    .back-word {
      margin-top: -100px;
      min-height: 400px;
      width: 80%;
      border-radius: 10px;
      background: #efefef;
      padding: 15px;
      text-align: left;
      .title {
        font-size: 10px;
        font-weight: bold;
      }
      .phoneNum-input {
        height: 36px;
        margin-top: 10px;
        background: #fff;
        border-radius: 5px;
        padding: 0 10px;
        .name {
          width: 50px;
          color: #000;
        }
        > div {
          > input {
            width: 100%;
          }
        }
      }
      .back-word-box {
        margin-top: 10px;
        background: #fff;
        border-radius: 5px;
        padding: 10px;
        > textarea {
          width: 100%;
        }
      }
      .submit-btn {
        > a {
          display: block;
          height: 36px;
          color: #fff;
          line-height: 36px;
          text-align: center;
          background: @themeColor;
          margin-top: 20px;
          border-radius: 5px;
        }
      }
    }
  }

  .scaleToback-enter-active {
    opacity: 0;
    transition: all 0.5s ease;
    .back-word {
      transform: scale(0);
      transition: all 0.5s ease;
    }
  }

  .scaleToback-enter-to {
    opacity: 1;
    .back-word {
      transform: scale(1);
    }
  }

  .scaleToback-leave-active {
    opacity: 1;
    transition: all 0.5s ease;
    .back-word {
      transform: scale(1);
      transition: all 0.5s ease;
    }
  }

  .scaleToback-leave-to {
    opacity: 0;
    .back-word {
      transform: scale(0);
    }
  }
</style>
