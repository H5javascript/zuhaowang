<template>
  <div>
    <v-Header>
      <a href="javascript:history.go(-1)" slot="left-link" class="left-link" flex="main:center cross:center"
         flex-box="0">
        <i class="icon-left_arrow"></i>
      </a>
      <span slot="center-content">游戏列表</span>
      <a href="javascript:void(0)" to="" slot="right-link" flex="main:center cross:center" class="right-link"
         flex-box="0"></a>
    </v-Header>
    <section flex-box="1" class="">
      <h1 style="color:red;text-align: center; font-size: 16px;margin: 20px 0;">完成上架，立即赠送20元现金红包！</h1>
      <ul class="game-list clearfix">
        <li class="game-item" v-for="game in gameList" :key="game.id" flex="dir:top main:center cross:center">
          <router-link :to="{path:'/mine/addGame',query:{gameId:game.id}}">
          <!--<router-link to='/mine/addGame'>-->
            <img :src="game.iconUrl" alt="">
          </router-link>
          <p class="game-name">{{game.name}}</p>
        </li>
      </ul>
    </section>
  </div>
</template>
<script>
  import {getUserItem} from '../../../utils'
  import {Indicator, Toast} from 'mint-ui'
  export default {
    data () {
      return {
        gameList: []
      }
    },
    created () {
      this.$http.get('api/game/games', {
        'headers': {
          'ZHToken': getUserItem('user').token
        }
      }).then((res) => {
        if (res.data.code === 'Ok') {
          Indicator.close()
          this.gameList = res.data.data
        } else {
          Toast({
            message: res.data.result,
            position: 'bottom'
          })
        }
      }, () => {
        Indicator.close()
        Toast({
          message: '网络错误，请刷新页面！',
          position: 'bottom'
        })
      })
    },
    mouted () {
      let scriptTag = document.createElement('script')
      scriptTag.src = 'http://s11.cnzz.com/stat.php?id=1256262254&web_id=1256262254'
      document.querySelector('.app-wrapper .wrapper').appendChild(scriptTag)
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  .game-list {
    padding-top: 10px;
    > li {
      float: left;
      width: 25%;
      height: 80px;
      > a {
        width: 55px;
        height: 55px;
        overflow: hidden;
        border-radius: 50%;
        > img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .game-name{
        color:#999;
        margin-top: 3px;
      }
    }
  }
</style>
