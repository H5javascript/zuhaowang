<template>
  <router-view :android="androidUrl" :ios="ios" @exitlog="tuichu()" @loginyes="loginyes"></router-view>
</template>

<script>
  export default{
    data () {
      return {
        androidUrl: '',
        ios: ''
      }
    },
    created () {
      this.$http.get(`api/download/url`).then(res => {
        if (res.data.code === 'Ok') {
          this.androidUrl = res.data.data.androidUrl
          this.ios = res.data.data.iosUrl
        }
      })
    },
    methods: {
      tuichu () {
        this.$emit('exitlog')
      },
      loginyes () {
        this.$emit('loginyes')
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">

</style>
