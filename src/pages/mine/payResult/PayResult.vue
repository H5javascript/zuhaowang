<template>
  <div class="payResult" flex="dir:top">
    <header flex-box="0" flex="cross:center main:center">
      <h1>支付结果</h1>
    </header>
    <div flex="main:center cross:center" flex-box="1" class="payResult-wrapper">
      <div class="status-wrapper">
        <div class="icon-box" :class="{'success':status}">
          <i :class="{'icon-chenggong':status,'icon-shibai':!status}"></i>
        </div>
        <p class="status-txt">{{status?'支付成功':'支付失败'}}</p>
        <router-link class="back-center-btn" to="/mine">返回个人中心</router-link>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        status: 0
      }
    },
    created () {
      if (parseInt(this.$route.query.result) === 1) {
        this.status = true
      } else if (parseInt(this.$route.query.result) === 2) {
        this.status = false
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../common/tool";

  .payResult {
    header {
      height: 44px;
      background: @themeColor;
      color: #fff;
      font-size: 14px;
    }
    .payResult-wrapper {
      padding: 0 15px;
      .status-wrapper {
        text-align: center;
        margin-top: -100px;
        width: 100%;
        .icon-box > i {
          font-size: 64px;
        }
        .icon-box {
          &.success {
            color: green;
          }
        }
        > p {
          margin-top: 10px;
          font-size: 16px;
        }
      }
    }
    .back-center-btn{
      margin-top: 20px;
      background: @themeColor;
      color:#fff;
      display: block;
      width: 100%;
      height:36px;
      line-height: 36px;
    }
  }
</style>
