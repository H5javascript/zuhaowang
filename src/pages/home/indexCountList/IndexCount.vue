<template>
  <div>
    <v-Header>
      <a href="javascript:history.go(-1)" slot="left-link" class="left-link" flex="main:center cross:center"
         flex-box="0">
        <i class="icon-left_arrow"></i>
      </a>
      <span slot="center-content">游戏号列表</span>
      <a href="javascript:void(0)" to="" slot="right-link" flex="main:center cross:center" class="right-link"
         flex-box="0"></a>
    </v-Header>
    <section flex-box="1" class="" ref="countList">
      <ul class="game-count-list">
        <li class="count-item" v-for="countItem in myCountList">
          <a @click="toDeteail(countItem)" href="javascript:void(0)" flex="dir:left">
            <span class="game-img" flex-box="0">
              <img :src="countItem.gameIconurl" alt="">
            </span>
            <div class="count-desc" flex-box="1">
              <p class="one">{{countItem.gameServer}}</p>
              <p class="two">{{countItem.title}}</p>
              <p class="three">￥<b>{{countItem.rent}}</b>/小时 押金<b>{{countItem.deposit}}</b>元</p>
            </div>
            <div class="count-control" flex-box="0" flex="dir:top main:justify">
              <span class="link">{{countItem.vip?'会员':'标签'}}</span>
            </div>
          </a>
        </li>
      </ul>
      <div v-if="isEmpty" flex="main:center cross:center dir:top" style="padding:10px;color:#aaa">
        <i class="icon-noData" style="font-size: 48px;margin-bottom: 15px;"></i>
        <p>对不起！您选择的当前的服务器无可租用账号！</p>
      </div>
      <div v-if="isload" flex="main:center cross:center" style="color:#999;padding:15px 0;">
        <mt-spinner style="margin-right: 5px;" type="fading-circle"></mt-spinner>
        加载中...
      </div>
      <p style="color:#999;padding:15px 0;text-align: center" v-if="isOver">
        没有更多了- -！
      </p>
    </section>
  </div>
</template>
<script>
  import {Toast} from 'mint-ui'
  export default {
    data () {
      return {
        myCountList: [],
        countPage: 1,
        isload: false,
        isOver: false,
        isEmpty: false
      }
    },
    mounted () {
      let that = this
      this.getCountList()
      this.$refs.countList.onscroll = function () {
        let wScrollY = this.scrollTop // 当前滚动条位置
        let wInnerH = this.offsetHeight // 设备窗口的高度（不会变）
        let bScrollH = this.scrollHeight // 滚动条总高度
        if (wScrollY + wInnerH >= bScrollH) {
          if (that.isload === false && that.isOver === false) {
            that.countPage++
            that.isload = true
            that.getCountList()
          }
        }
      }
    },
    methods: {
      getCountList () {
        this.isload = true
        this.$http.get(`api/game/${this.$route.query.gameId}/lease/list?quName=${this.$route.query.quName}&serverName=${this.$route.query.serverName}&page=${this.countPage}`).then(res => {
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
      toDeteail (countItem) {
        if (window.localStorage.user) {
          this.$router.push({path: '/home/detailCount', query: countItem})
        } else {
          this.$router.push('/mine/login')
          Toast({
            message: '请先登录',
            position: 'bottom'
          })
        }
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
</style>
