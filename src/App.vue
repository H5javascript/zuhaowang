<template>
  <div class="app-wrapper" v-cloak="">
    <transition :name="transitionName">
      <router-view @loginyes="startCount()" @exitlog="exit()" flex="dir:top" class="wrapper"></router-view>
    </transition>
    <transition name="scaleTo">
      <div v-if="grabMsg.isShow" class="qiangdan-mask" flex="cross:center main:center">
        <div class="qiangdan-box" flex="dir:top cross:center main:center">
          <span class="close-btn" @click="grabMsg.isShow=false">×</span>
          <span class="icon-box" flex="main:center cross:center"><i class="icon-shandian"></i></span>
          <p class="tipWord">
            {{!!grabMsg.nick ? grabMsg.nick : ''}}发出{{!!grabMsg.gameName ? grabMsg.gameName : ''}}租号需求</p>
          <a class="qiangdan-btn" @click="qiangdanJump()" href="javascript:void(0)">抢单</a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        transitionName: 'slide-left',
        grabMsg: {
          gameName: null,
          nick: null,
          isShow: false
        },
        timer: null,
        longTimer: null
      }
    },
    created () {
      this.getGloble()
    },
    mounted () {
      this.getNewGrab()
    },
    methods: {
      getGloble () {
        if (window.localStorage.user) {
          this.$store.dispatch('getGrabOrder', {http: this.$http})
          this.$store.dispatch('getUnread', {http: this.$http})
          this.longTimer = setInterval(() => {
            this.$store.dispatch('getGrabOrder', {http: this.$http})
            this.getNewGrab()
          }, 120000)
        }
      },
      getNewGrab () {
        this.timer = setTimeout(() => {
          if (this.unread.grabMsg) {
            this.grabMsg.gameName = this.unread.grabMsg.gameName
            this.grabMsg.nick = this.unread.grabMsg.nick
            this.grabMsg.isShow = true
            clearTimeout(this.timer)
            this.timer = null
          }
        }, 1000)
      },
      exit () {
        this.grabMsg.gameName = null
        this.grabMsg.nick = null
        this.grabMsg.isShow = false
        clearInterval(this.longTimer)
        this.longTimer = null
        this.$store.commit('RESET_QIANGDAN', false)
        this.$store.commit('DELETE_QIANGDAN')
      },
      startCount () {
        this.getGloble()
        this.getNewGrab()
      },
      qiangdanJump () {
        this.$router.push('/grabOrder')
        this.grabMsg.isShow = false
      }
    },
    computed: {
      ...mapState(['unread'])
    },
    watch: {
      '$route' (to, from) {
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length
        if (toDepth === fromDepth) {
          this.transitionName = 'fade'
          return
        }
        this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "common/tool";
  .mint-msgbox-message{
    text-align: left!important;
  }
  [v-cloak] {
    display: none;
  }

  [v-cloak] > * {
    display: none;
  }

  .app-wrapper {
    height: 100%;
  }

  .wrapper {
    width: 100%;
    width: 100%;
    width: 100%;
    height: 100%;
    > section {
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
  }

  .qiangdan-mask {
    background: rgba(0, 0, 0, 0.5);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    .qiangdan-box {
      width: 216px;
      height: 271px;
      background: #fff;
      border-radius: 5px;
      position: relative;
      overflow: visible;
      color: #fff;
      .close-btn {
        text-align: center;
        line-height: 35px;
        position: absolute;
        font-size: 40px;
        width: 40px;
        height: 40px;
        background: #fff;
        color: #666;
        border-radius: 50%;
        right: -15px;
        top: -15px;
      }
      .icon-box {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: 1px solid @themeColor;
        color: @themeColor;
        font-size: 40px;
      }
      .tipWord {
        color: #666;
        margin-top: 40px;
      }
      .qiangdan-btn {
        width: 158px;
        height: 36px;
        background: @themeColor;
        color: #fff;
        line-height: 36px;
        text-align: center;
        margin-top: 20px;
      }
    }
  }

  .scaleTo-enter-active.qiangdan-mask {
    opacity: 0;
    transition: all 0.3s;
    .qiangdan-box {
      transition: all 0.3s;
      transform: scale(0);
    }
  }

  .scaleTo-enter-to.qiangdan-mask {
    opacity: 1;
    .qiangdan-box {
      transform: scale(1);
    }
  }

  .scaleTo-leave-active.qiangdan-mask {
    opacity: 1;
    transition: all 0.3s;
    .qiangdan-box {
      transition: all 0.3s;
      transform: scale(1);
    }
  }

  .scaleTo-leave-to.qiangdan-mask {
    opacity: 0;
    .qiangdan-box {
      transform: scale(0);
    }
  }

  /*淡入淡出*/
  .fade-enter-active, .fade-leave-active {
    transition: all 0.2s ease;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  /*左滑进入*/
  .slide-left-enter-active {
    transition: all 0.3s;
    transform: translateX(100%);
  }

  .slide-left-enter-to {
    transform: translateX(0%);
  }

  /*右滑进入*/
  .slide-right-enter-active {
    transition: all 0.3s;
    transform: translateX(-100%);
  }

  .slide-right-enter-to {
    transform: translateX(0%);
  }
</style>
