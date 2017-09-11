<template>
  <div>
    <v-Header>
      <a href="javascript:history.go(-1)" slot="left-link" class="left-link" flex="main:center cross:center"
         flex-box="0">
        <i class="icon-left_arrow"></i>
      </a>
      <span slot="center-content">信息设置</span>
      <a href="javascript:void (0)" slot="right-link" flex="main:center cross:center" class="right-link"
         flex-box="0" style="font-size: 14px"><span @click="saveMsg">保存</span></a>
    </v-Header>
    <section flex-box="1">
      <div class="big-head-img">
        <span class="head-img-show">
          <img v-if="icon!=''" :src="icon" alt="">
          <img v-else="" src="../../../common/img/touxiang.png" alt="">
        </span>
        <label class="upload-btn" flex="cross:center main:center">
          <i class="icon-xiangji"></i>
          <input @change="setHeadImg()" ref="imgFile" style="display: none" type="file"/>
        </label>
      </div>
      <div class="form-list">
        <label class="input-item" flex="cross:center">
          <input type="text" v-model="nick">
        </label>
        <label class="phone-number-reset" flex="dir:left cross:center">
          <p flex-box="1">{{mobile}}</p>
          <i flex-box="0" class="icon-right-arrow"></i>
        </label>
      </div>
    </section>
  </div>
</template>
<script>
  import {getUserItem} from '../../../utils'
  import {Toast, Indicator} from 'mint-ui'
  export default {
    data () {
      return {
        icon: '',
        nick: '',
        mobile: '',
        saveShow: false
      }
    },
    created () {
      this.icon = getUserItem('user').user.iconUrl ? getUserItem('user').user.iconUrl : ''
      this.nick = getUserItem('user').user.nick
      this.mobile = getUserItem('user').user.mobile
    },
    methods: {
      setHeadImg () {
        Indicator.open()
        let that = this
        let file = this.$refs.imgFile.files[0]
        let fileReader
        fileReader = new FileReader()
        fileReader.readAsDataURL(file)
        fileReader.onload = function () {
          Indicator.close()
          console.log(this.result)
          that.icon = this.result
        }
      },
      saveMsg () {
        if (this.nick === '') {
          Toast({
            message: '对不起，您的用户昵称不能为空！',
            position: 'bottom',
            duration: 2000
          })
          return false
        }
        this.$http.post(`api/account/myinfo/modify`, {
          icon: this.icon.split(',')[1],
          nick: this.nick
        }, {
          headers: {
            ZHToken: getUserItem('user').token
          }
        }).then(res => {
          if (res.data.code === 'Ok') {
            this.$router.push('/mine')
          } else {
            Toast({
              message: res.data.result,
              position: 'bottom',
              duration: 2000
            })
          }
        })
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../common/tool";

  .big-head-img {
    position: relative;
    .head-img-show {
      display: block;
      width: 100%;
      height: 100vw;
      > img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .upload-btn {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 50px;
      height: 50px;
      font-size: 20px;
    }
  }

  .form-list {
    padding: 0 15px;
    > label {
      border-bottom: 1px solid #ddd;
      height: 50px;
      > input {
        width: 100%;
      }
    }
  }
</style>
