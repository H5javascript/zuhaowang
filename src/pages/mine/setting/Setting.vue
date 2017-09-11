<template>
  <div class="setting-wrapper">
    <v-Header>
      <a href="javascript:history.go(-1)" slot="left-link" class="left-link" flex="main:center cross:center"
         flex-box="0">
        <i class="icon-left_arrow"></i>
      </a>
      <span slot="center-content">设置</span>
      <a href="javascript:void(0)" to="" slot="right-link" flex="main:center cross:center" class="right-link"
         flex-box="0"></a>
    </v-Header>
    <section flex-box="1" class="">
      <ul class="setting-list">
        <li class="setting-item">
          <router-link flex="dir:left cross:center" to="/mine/about">
            <p flex-box="1">关于我们</p>
            <i flex-box="0" class="icon-right-arrow"></i>
          </router-link>
        </li>
        <li class="setting-item">
          <router-link flex="dir:left cross:center" to="/mine/xieyi">
            <p flex-box="1">服务协议</p>
            <i flex-box="0" class="icon-right-arrow"></i>
          </router-link>
        </li>
      </ul>
      <div class="submit-btn">
        <a href="javascript:void(0)" @click="quitLogin()">退出登录</a>
      </div>
    </section>
  </div>
</template>
<script>
  import { removeUser } from '../../../utils'
  export default {
    methods: {
      quitLogin () {
        removeUser('user')
        window.localStorage.removeItem('toast')
        this.$router.push('/mine')
        this.$store.commit('DELETE_UNREAD')
        this.$emit('exitlog')
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../common/tool";

  .setting-list {
    > li {
      border-bottom: 1px solid #ddd;
      > a {
        padding-left: 15px;
        height: 50px;
        > i {
          width: 50px;
          height: 50px;
          font-size: 18px;
          text-align: center;
          line-height: 50px;
          color: #999;
        }
      }
    }
  }

  .setting-wrapper {
    .submit-btn {
      margin-top: 50px;
      padding: 0 15px;
      > a {
        display: block;
        height: 36px;
        color: #fff;
        background: @themeColor;
        text-align: center;
        line-height: 36px;
      }
    }
  }
</style>
