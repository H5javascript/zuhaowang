<template>
  <div class="add-game">
    <v-Header>
      <a href="javascript:history.go(-1)" slot="left-link" class="left-link" flex="main:center cross:center"
         flex-box="0">
        <i class="icon-left_arrow"></i>
      </a>
      <span slot="center-content">填写信息</span>
      <a href="javascript:void(0)" to="" slot="right-link" flex="main:center cross:center" class="right-link"
         flex-box="0"></a>
    </v-Header>
    <section flex-box="1" class="backSection">
      <h1 style="color:red;text-align: center; font-size: 16px;line-height:50px;background: #fff;">完成上架，立即赠送20元现金红包！</h1>
      <div class="form-wrapper">
        <div v-for="formItem in formObj">
          <label v-if="formItem.labelName=='区'" flex="dir:left cross:center">
            <span class="item-name" flex-box="0">{{formItem.labelName}}</span>
            <div class="input-box" flex-box="1">
              <select v-model="formItem.labelValue">
                <option value="-1" selected>请选择{{formItem.labelName}}</option>
                <option v-for="(optionItem,index) in formItem.optionValues[1]" :value="optionItem">{{optionItem}}
                </option>
              </select>
            </div>
            <i v-if="formItem.labelType ===2" flex-box="0" class="icon-right-arrow"
               style="font-size: 14px;color:#999"></i>
          </label>
          <label v-else-if="formItem.labelName=='服务器'" flex="dir:left cross:center">
            <span class="item-name" flex-box="0">{{formItem.labelName}}</span>
            <div class="input-box" flex-box="1">
              <select v-model="formItem.labelValue">
                <option value="-1" selected>请选择{{formItem.labelName}}</option>
                <option v-for="(optionItem,index) in formItem.optionValues[formObj[quIndex].labelValue]"
                        :value="optionItem">{{optionItem}}
                </option>
              </select>
            </div>
            <i v-if="formItem.labelType ===2" flex-box="0" class="icon-right-arrow"
               style="font-size: 14px;color:#999"></i>
          </label>
          <label v-else="" flex="dir:left cross:center">
            <span class="item-name" flex-box="0">{{formItem.labelName}}</span>
            <div class="input-box" flex-box="1" v-if="formItem.labelType ===1">
              <input v-model="formItem.labelValue" :placeholder="`请输入${formItem.labelName}`" type="text"/>
            </div>
            <div class="input-box" flex-box="1" v-else-if="formItem.labelType ===2">
              <select v-model="formItem.labelValue">
                <option value="-1" selected>请选择{{formItem.labelName}}</option>
                <option v-for="(optionItem,index) in formItem.optionValues[1]" :value="optionItem">{{optionItem}}
                </option>
              </select>
            </div>
            <div class="input-box" flex-box="1" v-else-if="formItem.labelType ===3">
              <input v-model="formItem.labelValue" placeholder="密码可接单后再输入" type="password">
            </div>
            <div class="input-box" flex-box="1" v-else-if="formItem.labelType ===4">
              <input v-model="formItem.labelValue" :placeholder="`请输入${formItem.labelName}`" type="number">
            </div>
            <i v-if="formItem.labelType ===2" flex-box="0" class="icon-right-arrow"
               style="font-size: 14px;color:#999"></i>
          </label>
        </div>
      </div>
      <div class="submit-form">
        <a href="javascript:void(0)" @click="submitForm()">下一步</a>
      </div>
      <p class="tips">点击下一步，表示您已阅读并同意</p>
      <p class="tips">
        <router-link to="/mine/xieyi">《托管保障服务》</router-link>
      </p>
    </section>
  </div>
</template>
<script>
  import { getUserItem } from '../../../utils'
  import Vue from 'vue'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        formObj: [],
        quIndex: null,
        fuwuqiIndex: null
      }
    },
    created () {
      if (this.$route.query.type === 'reset') {
        this.$http.get(`api/account/game/${this.$route.query.gameId}/lease/${this.$route.query.recordHash}`, {
          headers: {
            ZHToken: getUserItem('user').token
          }
        }).then((res) => {
          if (res.data.code === 'Ok') {
            res.data.data.map((item, index) => {
              if (item.labelName === '区') {
                this.quIndex = index
              }
              if (item.labelName === '服务器') {
                this.fuwuqiIndex = index
              }
              return item
            })
            this.formObj = res.data.data
          } else {
            Toast({
              message: res.data.result,
              position: 'bottom'
            })
          }
        }, () => {
          Toast({
            message: '网络错误，请刷新重试！',
            position: 'bottom'
          })
        })
        return false
      }
      this.$http.get(`api/game/${this.$route.query.gameId}/defs`, {
        headers: {
          ZHToken: getUserItem('user').token
        }
      }).then((res) => {
        if (res.data.code === 'Ok') {
          res.data.data.map((item, index) => {
            if (item.labelName === '区') {
              this.quIndex = index
            }
            if (item.labelName === '服务器') {
              this.fuwuqiIndex = index
            }
            if (item.labelType === 2) {
              Vue.set(item, 'labelValue', -1)
            } else {
              Vue.set(item, 'labelValue', '')
            }
            return item
          })
          this.formObj = res.data.data
        } else {
          Toast({
            message: res.data.result,
            position: 'bottom'
          })
        }
      }, () => {
        Toast({
          message: '网络错误，请刷新重试！',
          position: 'bottom'
        })
      })
    },
    mounted () {
      let scriptTag = document.createElement('script')
      scriptTag.src = 'http://s11.cnzz.com/stat.php?id=1257090216&web_id=1257090216'
      document.querySelector('.app-wrapper .wrapper').appendChild(scriptTag)
    },
    methods: {
      submitForm () {
        let newForm = JSON.stringify(this.formObj)
        let newFormObj = JSON.parse(newForm)
        newFormObj.map(item => {
          if (item.optionValues) {
            delete item.optionValues
          }
          return item
        })
        for (let i = 0; i < newFormObj.length; i++) {
          if (newFormObj[i].labelValue === '-1' || newFormObj[i].labelValue === -1) {
            Toast({
              message: `请选择${newFormObj[i].labelName}`,
              position: 'bottom'
            })
            return false
          } else if (newFormObj[i].labelName !== '密码' && newFormObj[i].labelValue === '') {
            Toast({
              message: `请填写${newFormObj[i].labelName}`,
              position: 'bottom'
            })
            return false
          }
        }
        let submitUrl = `api/account/game/${this.$route.query.gameId}/lease/add`
        if (this.$route.query.type === 'reset' && this.$route.query.recordHash) {
          submitUrl = submitUrl + `?recordHash=${this.$route.query.recordHash}`
        }
        this.$http.post(submitUrl, newFormObj, {
          headers: {
            ZHToken: getUserItem('user').token
          }
        }).then((res) => {
          if (res.data.code === 'Ok') {
            this.$router.push('/mine/mycount')
          } else {
            Toast({
              message: res.data.result,
              position: 'bottom'
            })
          }
        }, (err) => {
          console.log(err)
        })
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../common/tool";

  .form-wrapper {
    > div {
      padding: 0 15px;
      background: #fff;
      &:not(:last-child) {
        > label {
          border-bottom: 1px solid #ddd;
        }
      }
      > label {
        height: 60px;
        .item-name {
          width: 80px;
          color: #999;
        }
        select, input {
          border: none;
          width: 100%;
          -webkit-appearance: none;
          background: transparent;
          > option {
            direction: ltr;
          }
          &:focus {
            border: none;
          }
          /* webkit 浏览器*/
          &::-webkit-input-placeholder {
            color: #00f;
          }
          &::-webkit-input-placeholder {
            color: #333;
          }
          &::-webkit-input-placeholder {
            color: #333;
          }
          /* 火狐浏览器 */
          &::-moz-placeholder {
            color: #00f;
          }
          &::-moz-placeholder {
            color: #333;
          }
          &::-moz-placeholder {
            color: #333;
          }
        }
        select {
          direction: rtl;
        }
        input {
          text-align: left;
        }
      }
    }
  }

  .submit-form {
    margin-top: 20px;
    padding: 0 15px;
    padding-bottom: 20px;
    > a {
      display: block;
      line-height: 36px;
      text-align: center;
      background: @themeColor;
      color: #fff;
    }
  }

  .tips {
    &:last-child {
      margin-bottom: 20px;
      margin-top: 5px;
      font-size: 12px;
    }
    text-align: center;
    > a {
      color: @themeColor;
    }
  }
</style>
