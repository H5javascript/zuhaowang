<template>
  <div class="messageList">
    <v-Header>
      <a href="javascript:history.go(-1)" slot="left-link" class="left-link" flex="main:center cross:center"
         flex-box="0">
        <i class="icon-left_arrow"></i>
      </a>
      <span slot="center-content">系统消息</span>
      <a href="javascript:void(0)" to="" slot="right-link" flex="main:center cross:center" class="right-link"
         flex-box="0"></a>
    </v-Header>
    <section flex-box="1" class="sys-msg-wrapper">
      <div class="message-title">{{$route.params.title?$route.params.title:'系统消息'}}</div>
      <p class="time">{{$route.params.createTime | formatDate}}</p>
      <div class="message-txt-wrapper" v-html="msgContent">
      </div>
    </section>
  </div>
</template>
<script>
  export default {
    created () {
      console.log(this.$route.params.content.replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;'))
    },
    computed: {
      msgContent () {
        return this.$route.params.content.replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  .sys-msg-wrapper {
    padding: 10px 15px;
    .message-title {
      font-size: 16px;
    }
    .time {
      color: #999;
      font-size: 10px;
      margin: 10px 0;
    }
    .message-txt-wrapper{
      line-height: 20px;
    }
  }
</style>
