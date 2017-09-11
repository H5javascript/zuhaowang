<template>
  <div class="detailQus">
    <v-Header>
      <a href="javascript:history.go(-1)" slot="left-link" class="left-link" flex="main:center cross:center"
         flex-box="0">
        <i class="icon-left_arrow"></i>
      </a>
      <span slot="center-content">常见问题</span>
      <a href="javascript:void(0)" to="" slot="right-link" flex="main:center cross:center" class="right-link"
         flex-box="0"></a>
    </v-Header>
    <section flex-box="1" flex="dir:top">
      <div class="quesWrapper">
        <h1>{{title}}</h1>
        <div class="content-box" v-html="content">
        </div>
      </div>
    </section>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        title: '',
        content: ''
      }
    },
    created () {
      this.title = this.$route.query.title
      this.content = this.$route.query.content
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../common/tool";

  .quesWrapper {
    padding: 15px;
    > h1 {
      font-size: 16px;
      font-weight: bold;
    }
    .content-box{
      margin-top: 20px;
    }
  }
</style>
