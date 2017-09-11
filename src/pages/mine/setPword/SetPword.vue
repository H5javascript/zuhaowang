<template>
  <div class="setPword">
    <v-Header>
      <a href="javascript:history.go(-1)" slot="left-link" class="left-link" flex="main:center cross:center"
         flex-box="0">
        <i class="icon-left_arrow"></i>
      </a>
      <span slot="center-content">修改密码</span>
      <a href="javascript:void(0)" to="" slot="right-link" flex="main:center cross:center" class="right-link"
         flex-box="0"></a>
    </v-Header>
    <section flex-box="1" class="backSection">
      <div class="setPword-form-wrapper">
        <label class="form-item" flex="dir:left cross:center">
          <span flex-box="0">原密码</span>
          <input flex-box="1" v-model="oldPw" type="password" placeholder="请输入原密码">
        </label>
        <label class="form-item" flex="dir:left cross:center">
          <span flex-box="0">新密码</span>
          <input flex-box="1" v-model="newPw" type="password" placeholder="请输入新密码">
        </label>
        <label class="form-item" flex="dir:left cross:center">
          <span flex-box="0">确认新密码</span>
          <input flex-box="1" v-model="newPwAgain" type="password" placeholder="请重复输入新密码">
        </label>
      </div>
      <div class="submit-btn">
        <a href="javascript:void(0)" @click="setPword()">提交</a>
      </div>
    </section>
  </div>
</template>
<script>
  import {getUserItem, removeUser} from '../../../utils'
  import {Toast} from 'mint-ui'
  export default {
    data () {
      return {
        oldPw: '',
        newPw: '',
        newPwAgain: ''
      }
    },
    methods: {
      setPword () {
        if (this.newPw !== this.newPwAgain) {
          Toast({
            message: '您两次输入的密码不一致，请重新输入！',
            position: 'bottom',
            duration: 2000
          })
          this.newPw = ''
          this.newPwAgain = ''
          return false
        }
        this.$http.get(`api/account/modifypass?originalPassword=${this.oldPw}&newPassword=${this.newPw}`, {
          headers: {
            ZHToken: getUserItem('user').token
          }
        }).then(res => {
          if (res.data.code === 'Ok') {
            removeUser('user')
            Toast({
              message: '密码修改成功！',
              position: 'bottom',
              duration: 2000
            })
            this.$router.push('/mine/login')
          }
        }, () => {
        })
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../common/tool";

  .setPword-form-wrapper {
    background: #fff;
    .form-item {
      height: 50px;
      padding: 0 15px;
      > span {
        width: 60px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        margin-right: 10px;
      }
      &:not(:last-child) {
        border-bottom: 1px solid #ddd;
      }
    }
  }

  .setPword {
    .submit-btn {
      margin-top: 50px;
      padding: 0 15px;
      > a {
        display: block;
        height: 36px;
        color: #fff;
        background: @themeColor;
        text-align: center;
        line-height: 36px;
      }
    }
  }
</style>
