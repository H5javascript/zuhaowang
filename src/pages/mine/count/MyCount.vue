<template>
  <div class="gameCount-wrapper">
    <v-Header>
      <a href="javascript:history.go(-1)" slot="left-link" class="left-link" flex="main:center cross:center"
         flex-box="0">
        <i class="icon-left_arrow"></i>
      </a>
      <span slot="center-content">我的账号</span>
      <router-link to="/mine/gameList" slot="right-link" flex="main:center cross:center" class="right-link"
                   flex-box="0" style="font-size: 14px">添加
      </router-link>
    </v-Header>
    <section flex-box="1" style="padding-top: 44px;" class="backSection" ref="countList">
      <ul class="game-count-list">
        <li class="count-item" v-for="countItem in myCountList">
          <router-link
            :to="{path:'/mine/resetGame',query:{type:'reset',gameId:countItem.gameId,recordHash:countItem.recordHash}}"
            flex="dir:left">
            <span class="game-img" flex-box="0">
              <img :src="countItem.gameIconurl" alt="">
            </span>
            <div class="count-desc" flex-box="1">
              <p class="one">{{countItem.title}}</p>
              <p class="two">{{countItem.gameServer}}</p>
              <p class="three">￥<b>{{countItem.rent}}</b>/小时 押金<b>{{countItem.deposit}}</b>元</p>
            </div>
            <div class="count-control" flex-box="0" flex="dir:top main:justify">
              <span class="link">标签</span>
              <a class="getdown" @click.stop="switchCount(countItem)" href="javasript:void(0)">{{countItem.onSale?'下架':'上架'}}</a>
            </div>
          </router-link>
        </li>
      </ul>
      <div v-if="isEmpty" flex="main:center cross:center dir:top" style="padding:10px;color:#aaa">
        <i class="icon-noData" style="font-size: 48px;margin-bottom: 15px;"></i>
        <p>对不起！您还未添加账号，请添加您的游戏账号！</p>
      </div>
      <div v-if="isload" flex="main:center cross:center" style="color:#999;padding:15px 0;">
        <mt-spinner style="margin-right: 5px;" type="fading-circle"></mt-spinner>
        加载中...
      </div>
      <p style="color:#999;padding:15px 0;text-align: center" v-if="isOver">
        没有更多了- -！
      </p>
    </section>
    <v-Footer></v-Footer>
    <div class="download-tip" flex="cross:center">
      <p flex-box="1">点击下载租号网app，就送<b>18.8</b>元</p>
      <a flex-box="0" href="javascript:void(0)" @click="download=!download">下载</a>
    </div>
    <transition name="downloadShow">
      <div v-if="download" class="alert-download-mask" @click="download=!download" flex="cross:center main:center">
        <div class="download_box" flex="main:center cross:center dir:top" @click.stop="">
          <p class="download_title">下载客户端</p>
          <a :href="android">安卓客户端下载</a>
          <a :href="ios">苹果客户端下载</a>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  import {getUserItem} from '../../../utils'
  import {Toast} from 'mint-ui'
  export default {
    props: {
      android: {
        type: String,
        default: ''
      },
      ios: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        download: false,
        myCountList: [],
        countPage: 1,
        isload: false,
        isOver: false,
        isEmpty: false
      }
    },
    mounted () {
      let scriptTag = document.createElement('script')
      scriptTag.src = 'http://s11.cnzz.com/stat.php?id=1256220035&web_id=1256220035'
      document.querySelector('.app-wrapper .wrapper').appendChild(scriptTag)
      let that = this
      this.getCount()
      this.$refs.countList.onscroll = function () {
        let wScrollY = this.scrollTop // 当前滚动条位置
        let wInnerH = this.offsetHeight // 设备窗口的高度（不会变）
        let bScrollH = this.scrollHeight // 滚动条总高度
        if (wScrollY + wInnerH >= bScrollH) {
          if (that.isload === false && that.isOver === false) {
            that.countPage++
            that.isload = true
            that.getCount()
          }
        }
      }
    },
    methods: {
      getCount () {
        this.isload = true
        this.$http.get(`api/account/game/leases?page=${this.countPage}`, {
          'headers': {
            ZHToken: getUserItem('user').token
          }
        }).then((res) => {
          this.isload = false
          /* 获取数据成功 */
          if (res.data.code === 'Ok') {
            let dataLength = res.data.data.length
            /* 判断无任何数据 */
            if (dataLength === 0 && this.countPage === 1) {
              this.isEmpty = true
              return
              /*  当前的页数不是第一页，但是无数据！ */
            } else if (dataLength < 20) {
              this.isOver = true
            }
            for (let i = 0; i < res.data.data.length; i++) {
              this.myCountList.push(res.data.data[i])
            }
          } else {
            this.isload = false
            Toast({
              message: res.data.result,
              position: 'bottom'
            })
          }
        }, () => {
          this.isload = false
          Toast({
            message: '网络错误，请刷新页面！',
            position: 'bottom'
          })
        })
      },
      switchCount (countItem) {
        this.$http.get(`api/account/game/lease/_switch?status=${countItem.onSale ? 2 : 1}&recordHash=${countItem.recordHash}`, {
          headers: {
            ZHToken: getUserItem('user').token
          }
        }).then(res => {
          if (res.data.code === 'NotFind') {
            Toast({
              message: res.data.result,
              position: 'bottom',
              duration: 2000
            })
            return false
          }
          if (res.data.code === 'Ok') {
            countItem.onSale = !countItem.onSale
          }
        })
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../common/tool";

  .game-count-list {
    .count-item {
      border-bottom: 1px solid #dcdcdc;
      > a {
        background: #fff;
        height: 80px;
        padding: 10px 15px;
        .game-img {
          width: 60px;
          height: 60px;
          border-radius: 5px;
          overflow: hidden;
          > img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        .count-desc {
          margin-left: 10px;
          .one {
            color: #666;
            font-size: 13px;
            line-height: 16px;
          }
          .two {
            font-size: 14px;
            line-height: 30px;
          }
          .three {
            font-size: 10px;
            color: #999;
            line-height: 12px;
            > b {
              color: red;
              font-weight: normal;
            }
          }
          > p {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        .count-control {
          width: 40px;
          height: 100%;
          .link {
            border: 1px solid @themeColor;
            color: @themeColor;
            text-align: center;
            border-radius: 3px;
          }
          .getdown {
            background: @themeColor;
            color: #fff;
            text-align: center;
            padding: 2px 0;
          }
        }
      }
    }
  }

  .gameCount-wrapper {
    position: relative;
    .download-tip {
      padding: 0 15px;
      position: absolute;
      height: 44px;
      background: rgba(0, 0, 0, 0.5);
      top: 44px;
      left: 0;
      width: 100%;
      color: #fff;
      font-size: 14px;
      b {
        color: red;
      }
      > a {
        width: 55px;
        height: 30px;
        line-height: 30px;
        color: #fff;
        background: #e4393c;
        border-radius: 5px;
        text-align: center;
        font-size: 16px;
      }
    }
    .alert-download-mask {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      .download_box {
        width: 80%;
        min-height: 200px;
        background: #fff;
        border-radius: 10px;
        margin-top: -50px;
        padding: 0 15px;
        > p.download_title {
          font-size: 18px;
          font-weight: bold;
        }
        > a {
          height: 48px;
          width: 100%;
          background: @themeColor;
          color: #fff;
          text-align: center;
          line-height: 48px;
          border-radius: 5px;
          &:not(:first-child) {
            margin-top: 20px;
          }
        }
      }
    }
  }

  .downloadShow-enter-active {
    opacity: 0;
    transition: all 0.3s;
    > div {
      transform: scale(0);
      transition: all 0.3s;
    }
  }

  .downloadShow-enter-to {
    opacity: 1;
    > div {
      transform: scale(1);
    }
  }

  .downloadShow-leave-active {
    opacity: 1;
    transition: all 0.3s;
    > div {
      transform: scale(1);
      transition: all 0.3s;
    }
  }

  .downloadShow-leave-to {
    opacity: 0;
    > div {
      transform: scale(0);
    }
  }
</style>
