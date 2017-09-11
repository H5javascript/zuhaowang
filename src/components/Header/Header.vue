<template>
  <header class="header" flex="dir:left" flex-box="0">
    <slot name="left-link"></slot>
    <div flex="main:center cross:center" class="center-title" flex-box="1">
      <slot name="center-content"></slot>
    </div>
    <slot name="right-link"></slot>
  </header>
</template>
<script>

</script>
<style lang="less" rel="stylesheet/less">
  @import '../../common/tool';
  header{
    background: @themeColor;
    height:44px;
    .left-link{
      width: 44px;
      height:44px;
      color:#fff;
      >i{
        font-size: 20px;
      }
    }
    .center-title{
      color:#fff;
      height:100%;
      font-size: 14px;
    }
    .right-link{
      width: 44px;
      height:44px;
      line-height: 44px;
      text-align: center;
      color:#fff;
    }
  }
</style>
