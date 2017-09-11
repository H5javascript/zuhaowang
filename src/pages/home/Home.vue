<template>
  <div class="home">
    <header @click="slideMenuSwitch=!slideMenuSwitch" class="header-search" flex-box="0" flex="cross:center">
      <div flex="cross:center" class="search-box">
        <i class="icon-sousuo"></i>
        <p>搜索区服、关键字</p>
      </div>
    </header>
    <section flex-box="1" class="">
      <div class="banner-wrapper">
        <mt-swipe>
          <mt-swipe-item v-for="recommend in recommends" :key="recommend.index">
            <a :href="recommend.url" class="img-box">
              <img :src="recommend.imgUrl" alt="">
            </a>
          </mt-swipe-item>
        </mt-swipe>
      </div>
      <div class="data-count-wrapper" flex="box:mean">
        <span flex="dir:top main:center cross:center">
          <b>{{countNum.userCount}}</b>
          <p>账号总量</p>
        </span>
        <span flex="dir:top main:center cross:center">
          <b>{{countNum.tradeAmount}}</b>
          <p>交易总金额</p>
        </span>
        <span flex="dir:top main:center cross:center">
          <b>{{countNum.orderCount}}</b>
          <p>总订单量</p>
        </span>
      </div>
      <div class="tuijian-wrapper">
        <h1 class="hot-game-title" flex="box:mean cross:center">
          <span class="left">热门游戏</span>
          <span @click="slideMenuSwitch=!slideMenuSwitch" class="right">筛选</span>
        </h1>
        <ul class="hot-game-list">
          <li v-for="game in games" @click="tuijian(game)" :key="game.id">
            <a href="javascript:void(0)">
              <img :src="game.converPicUrl" alt="game.name">
            </a>
          </li>
        </ul>
      </div>
    </section>
    <v-Footer></v-Footer>
    <transition name="rtol">
      <div v-if="slideMenuSwitch" @click="slideMenuSwitch=!slideMenuSwitch" class="slide-menu-mask">
        <div @click.stop="" class="slide-menu" flex="dir:left">
          <div flex-box="0" class="left-game-name">
            <a @click="selectGame(server)" v-for="server in quServers" :class="{select:server.id === eachGameServer.id}"
               href="javascript:void(0)"
               flex="cross:center main:center">{{server.name}}</a>
          </div>
          <div flex-box="1" class="right-server-name">
            <div class="qu-list clearfix">
              <a href="javascript:void(0)" v-for="(serverItem,index) in eachGameServer.qus" @click="quIndex=index" :class="{current:index == quIndex}">{{serverItem.name}}</a>
            </div>
            <div class="serverWrapper">
              <ul  v-if="eachGameServer.length!==0" class="clearfix">
                <li v-for="serverName in eachGameServer.qus[quIndex].servers">
                  <router-link
                    :to="{path:'/home/indexCount',query:{gameId:eachGameServer.id,quName:eachGameServer.qus[quIndex].name,serverName:serverName.name}}">
                    {{serverName.name}}
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  import '../../common/tool.less'
  import { Indicator } from 'mint-ui'
  export default {
    data () {
      return {
        games: [],
        countNum: {
          userCount: 0,
          tradeAmount: 0,
          orderCount: 0
        },
        slideMenuSwitch: false,
        quServers: [],
        eachGameServer: [],
        recommends: [],
        quIndex: 0
      }
    },
    mounted () {
      let scriptTag = document.createElement('script')
      scriptTag.src = 'http://s11.cnzz.com/stat.php?id=1257875694&web_id=1257875694'
      document.querySelector('.app-wrapper .wrapper').appendChild(scriptTag)
    },
    created () {
      Indicator.open()
      let that = this
      this.$http.get('api/home').then((res) => {
        let data = res.data.data
        that.games = data.games
        that.quServers = data.quServers
        that.recommends = data.recommends
        that.countNum.userCount = data.userCount
        that.countNum.tradeAmount = data.tradeAmount
        that.countNum.orderCount = data.orderCount
        that.eachGameServer = data.quServers[0]
        Indicator.close()
      }, (err) => {
        Indicator.close()
        console.log(err)
      })
    },
    methods: {
      selectGame (server) {
        this.eachGameServer = server
        this.quIndex = 0
      },
      tuijian (game) {
        this.quIndex = 0
        let selectgame = this.quServers.filter(item => {
          return item.id === game.id
        })
        this.eachGameServer = selectgame[0]
        this.slideMenuSwitch = !this.slideMenuSwitch
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../common/tool";
  .header-search {
    height: 44px;
    background: @themeColor;
    padding: 0 15px;
    .search-box {
      width: 100%;
      height: 30px;
      border-radius: 8px;
      padding: 0 10px;
      background: #037DB8;
      color: #039BE5;
      > i {
        font-size: 14px;
      }
      > p {
        line-height: 14px;
        margin-left: 5px;
      }
    }
  }
  .banner-wrapper {
    height: 150px;
    background: #dcdcdc;
    .img-box {
      display: block;
      width: 100%;
      height: 100%;
      > img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
  .data-count-wrapper {
    height: 60px;
    border-bottom: 1px solid #F3F3F3;
    > span {
      height: 100%;
      > b {
        font-size: 16px;
        font-weight: normal;
      }
      > p {
        color: #999;
        font-size: 10px;
      }
    }
  }
  .tuijian-wrapper {
    padding: 0 15px;
    .hot-game-title {
      height: 40px;
      .left {
        font-size: 14px;
        line-height: 20px;
      }
      .right {
        color: #999;
        text-align: right;
      }
    }
    .hot-game-list {
      > li {
        margin-bottom: 6px;
        > a {
          display: block;
          height: 130px;
          > img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  .slide-menu-mask {
    position: fixed;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    z-index: 1;
    .slide-menu {
      position: absolute;
      left: 50px;
      right: 0;
      height: 100%;
      background: #fff;
      box-shadow: 0 0 10px #000;
      > div {
        height: 100%;
      }
      .left-game-name {
        width: 100px;
        background: #F7F7F7;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        > a {
          width: 100%;
          height: 50px;
          font-size: 14px;
          border-bottom: 1px solid #fff;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          position: relative;
          &.select:before {
            content: " ";
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            border-left: 3px solid @themeColor;
          }
        }
      }
      .right-server-name {
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        .serverWrapper {
          padding: 0 15px;
          margin-bottom: 10px;
          > h1 {
            line-height: 36px;
            font-size: 14px;
            color: #999;
          }
          > ul {
            > li {
              float: left;
              width: 32%;
              line-height: 26px;
              text-align: center;
              margin-top: 5px;
              padding: 0 3px;
              background: #F7F7F7;
              > a {
                display: block;
                width: 100%;
                height: 100%;
                font-size: 7px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
              &:not(:nth-child(3n+1)) {
                margin-left: 2%;
              }
            }
          }
        }
        .qu-list {
          padding: 15px;
          > a {
            float: left;
            width: 32%;
            text-align: center;
            line-height: 26px;
            height: 26px;
            margin-bottom: 3px;
            font-size: 10px;
            &:not(:nth-child(3n+1)) {
              margin-left: 2%;
            }
            &.current{
              background: @themeColor;
              color: #fff;
            }
          }
        }
      }
    }
  }
  .rtol-enter-active.slide-menu-mask {
    opacity: 0;
    transition: 0.3s all ease;
    > .slide-menu {
      transform: translateX(100%);
      transition: 0.3s all ease;
    }
  }
  .rtol-enter-to.slide-menu-mask {
    opacity: 1;
    > .slide-menu {
      transform: translateX(0%);
    }
  }
  .rtol-leave-active.slide-menu-mask {
    opacity: 1;
    transition: 0.3s all ease;
    > .slide-menu {
      transform: translateX(0%);
      transition: 0.3s all ease;
    }
  }
  .rtol-leave-to.slide-menu-mask {
    opacity: 0;
    > .slide-menu {
      transform: translateX(100%);
    }
  }
</style>
