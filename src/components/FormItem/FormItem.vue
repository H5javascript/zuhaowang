<template>
  <label class="form-item" flex="dir:left">
    <span class="item-name"></span>
    <div v-if="formItem">

    </div>
  </label>
</template>
<script>
  export default {
    props: {
      formItem: {
        type: Object,
        default: {}
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  .form-item {
    height:30px;
    background: green;
  }
</style>
