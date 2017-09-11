<template>
  <footer class="footer" flex-box="0" flex="box:mean">
    <router-link to="/home" flex="dir:top cross:center main:center">
      <i class="icon-shouye"></i>
      <span>首页</span>
    </router-link>
    <router-link to="/message" flex="dir:top cross:center main:center">
      <i class="icon-xiaoxi"></i>
      <span>消息</span>
      <b v-if="unread.unreadObj.messageCount>0" class="unread-num">{{unread.unreadObj.messageCount }}</b>
    </router-link>
    <router-link to="/grabOrder" flex="dir:top cross:center main:center">
      <i class="icon-shandian"></i>
      <span>接单</span>
      <b v-if="unread.unreadObj.sdOrderCount>0" class="unread-num">{{unread.unreadObj.sdOrderCount}}</b>
    </router-link>
    <router-link to="/mine" flex="dir:top cross:center main:center">
      <i class="icon-wode"></i>
      <span>我的</span>
    </router-link>
  </footer>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    computed: {
      ...mapState(['unread'])
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../common/tool";

  .footer {
    height: 49px;
    background: #fff;
    border-top: 1px solid #C8C8C8;
    > a {
      height: 100%;
      color: #AFAFAF;
      position: relative;
      >.unread-num{
        position: absolute;
        right: 25%;
        top:10%;
        width: 25px;
        height:15px;
        border-radius: 8px;
        background: red;
        color:#fff;
        text-align: center;
        line-height: 15px;
        font-size: 10px;
      }
      > i {
        font-size: 24px;
      }
      &.active-class {
        color: @themeColor;
      }
    }
  }
</style>
