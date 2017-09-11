<template>
  <div class="xieyi">
    <v-Header>
      <a href="javascript:history.go(-1)" slot="left-link" class="left-link" flex="main:center cross:center"
         flex-box="0">
        <i class="icon-left_arrow"></i>
      </a>
      <span slot="center-content">服务协议</span>
      <a href="javascript:void(0)" to="" slot="right-link" flex="main:center cross:center" class="right-link"
         flex-box="0"></a>
    </v-Header>
    <section flex-box="1" class="">
      <div class="xieyiData-wrapper" v-html="xieyiData">
      </div>
    </section>
  </div>
</template>
<script>
  import { getUserItem } from '../../../utils'
  export default {
    data () {
      return {
        xieyiData: ''
      }
    },
    created () {
      this.$http.get(`api/account/agreement`, {
        headers: {
          ZHToken: getUserItem('user').token
        }
      }).then(res => {
        if (res.data.code === 'Ok') {
          this.xieyiData = res.data.data
        }
      })
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
.xieyiData-wrapper{
  padding: 20px 15px;
  color:#000!important;
  h1{
    margin: 10px 0;
    text-align: center;
    >strong{
      font-size: 18px;
    }
  }
  strong{
    font-size:14px;
    font-weight: bold;
  }
}
</style>
