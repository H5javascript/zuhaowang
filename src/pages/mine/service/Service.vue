<template>
  <div>
    <v-Header>
      <a href="javascript:history.go(-1)" slot="left-link" class="left-link" flex="main:center cross:center"
         flex-box="0">
        <i class="icon-left_arrow"></i>
      </a>
      <span slot="center-content">我的工单</span>
      <a href="javascript:void(0)" to="" slot="right-link" flex="main:center cross:center" class="right-link"
         flex-box="0"></a>
    </v-Header>
    <section flex-box="1" flex="dir:top" class="backSection">
      <div class="select-type" flex-box="0">
        <a href="JavaScript:void(0)" @click="choiceType(1)" :class="{current:isForm==1}">提交工单</a>
        <a href="JavaScript:void(0)" @click="choiceType(2)" :class="{current:isForm==2}">我的工单</a>
        <a href="JavaScript:void(0)" @click="choiceType(3)" :class="{current:isForm==3}">常见问题</a>
      </div>
      <div class="my-form-wrapper" ref="myFormWrapper" flex-box="1" v-show="isForm==1">
        <label class="form-item" flex="dir:left cross:center">
          <select flex-box="1" v-model="gongdanForm.type">
            <option value="0" style="color:#999">请选择您要提交的工单类型</option>
            <option v-for="type in gongdanList" :value="type">{{type}}</option>
          </select>
          <i flex-box="0" class="icon-right-arrow"></i>
        </label>
        <div class="textarea-wrapper">
          <textarea v-model="gongdanForm.content" placeholder="请输入工单内容"></textarea>
        </div>
        <p class="tips">提交工单详情后，租号网管理员将7*24内回复您。</p>
        <div class="submit-btn">
          <a href="javascript:void(0)" @click="submitGongdan()">提交</a>
        </div>
        <div class="service-tip" v-html="customService" style="padding: 0 15px;margin-top: 10px;color:#999">
        </div>
      </div>
      <div class="my-form-list canscroll" flex-box="1" v-show="isForm==2">
        <ul class="my-form-ul">
          <li class="my-form-item" v-for="item in myQues.list">
            <router-link to="/message/sysMsgDetail">
              <p class="time">{{item.createTime | formateTime}}</p>
              <div class="msg-box">
                <p><b>提问：</b>{{item.question | sliceStr}}</p>
                <p v-if="!!item.reply"><b>回复：</b>{{item.reply | sliceStr}}</p>
                <div class="status-box" :class="{uncomplete:item.status == 1,complete:item.status == 2}"></div>
              </div>
            </router-link>
          </li>
        </ul>
        <div v-if="myQues.isEmpty" flex="main:center cross:center dir:top" style="padding:10px;color:#aaa">
          <i class="icon-noData" style="font-size: 48px;margin-bottom: 15px;"></i>
          <p>对不起，您目前还没有提交过工单！</p>
        </div>
        <div v-if="myQues.isload" flex="main:center cross:center" style="color:#999;padding:15px 0;">
          <mt-spinner style="margin-right: 5px;" type="fading-circle"></mt-spinner>
          加载中...
        </div>
        <p style="color:#999;padding:15px 0;text-align: center" v-if="myQues.isOver">
          没有更多了- -！
        </p>
      </div>
      <div class="question-wrapper canscroll" flex-box="1" v-show="isForm==3">
        <ul class="question-ul">
          <li v-for="question in alwaysQues" class="question-item">
            <router-link :to="{path: '/mine/detailQuestion', query:{title:question.question,content:question.reply}}">
              <p style="font-size: 14px;"><b>{{question.question}}</b></p>
              <p style="color:#999">{{question.reply}}</p>
            </router-link>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
<script>
  import {getUserItem} from '../../../utils'
  import {Toast} from 'mint-ui'
  export default {
    data () {
      return {
        gongdanForm: {
          content: '',
          type: 0
        },
        customService: '',
        isForm: 1,
        gongdanList: [],
        myQues: {
          list: [],
          page: 1,
          isload: false,
          isOver: false,
          isEmpty: false,
          firstLoad: false
        },
        alwaysQues: []
      }
    },
    created () {
      this.$http.get(`api/account/ticket`, {
        headers: {
          ZHToken: getUserItem('user').token
        }
      }).then(res => {
        if (res.data.code === 'Ok') {
          this.gongdanList = res.data.data.ticketTypes
          this.customService = res.data.data.customService
        }
      }, () => {
      })
      this.$http.get(`api/account/ticket/sys/questions`, {
        headers: {
          ZHToken: getUserItem('user').token
        }
      }).then(res => {
        if (res.data.code === 'Ok') {
          this.alwaysQues = res.data.data
        }
      }, () => {
      })
    },
    mounted () {
      let that = this
      this.$refs.myFormWrapper.onscroll = function () {
        let wScrollY = this.scrollTop // 当前滚动条位置
        let wInnerH = this.offsetHeight // 设备窗口的高度（不会变）
        let bScrollH = this.scrollHeight // 滚动条总高度
        if (wScrollY + wInnerH >= bScrollH) {
          if (that.myQues.isload === false && that.myQues.isOver === false) {
            that.myQues.page++
            that.myQues.isload = true
            that.getGongdanList()
          }
        }
      }
    },
    methods: {
      choiceType (type) {
        this.isForm = type
        if (!this.myQues.firstLoad) {
          this.myQues.firstLoad = true
          this.getGongdanList()
          this.$store.dispatch('getUnread', {http: this.$http})
        }
      },
      getGongdanList () {
        this.myQues.isload = true
        this.$http.get(`api/account/ticket/list?page=${this.myQues.page}`, {
          'headers': {
            ZHToken: getUserItem('user').token
          }
        }).then((res) => {
          this.myQues.isload = false
          /* 获取数据成功 */
          if (res.data.code === 'Ok') {
            let dataLength = res.data.data.length
            /* 判断无任何数据 */
            if (dataLength === 0 && this.myQues.page === 1) {
              this.myQues.isEmpty = true
              return
              /*  当前的页数不是第一页，但是无数据！ */
            } else if (dataLength < 20) {
              this.myQues.isOver = true
            }
            for (let i = 0; i < res.data.data.length; i++) {
              this.myQues.list.push(res.data.data[i])
            }
          } else {
            this.myQues.isload = false
          }
        }, () => {
          this.myQues.isload = false
        })
      },
      submitGongdan () {
        if (this.gongdanForm.content === '') {
          Toast({
            message: '工单内容不能为空',
            position: 'bottom',
            duration: 2000
          })
          return false
        }
        if (this.gongdanForm.type === '0') {
          Toast({
            message: '工单类型不能为空',
            position: 'bottom',
            duration: 2000
          })
          return false
        }
        this.$http.post(`api/account/ticket/new`, this.gongdanForm, {
          headers: {
            ZHToken: getUserItem('user').token
          }
        }).then(res => {
          if (res.data.code === 'Ok') {
            this.gongdanForm.content = ''
            this.gongdanForm.type = '0'
            Toast({
              message: '工单提交成功,进入我的工单列表查看解决进度！',
              position: 'bottom',
              duration: 2000
            })
          }
        }, () => {
        })
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../common/tool";

  .select-type {
    margin: 10px 0;
    padding: 0 15px;
    > a {
      display: inline-block;
      width: 80px;
      height: 30px;
      background: #fff;
      text-align: center;
      line-height: 30px;
      margin-right: 5px;
      &.current {
        background: @themeColor;
        color: #fff;
      }
    }
  }

  .my-form-wrapper {
    .form-item {
      height: 50px;
      border-bottom: 1px solid #ddd;
      padding-left: 15px;
      background: #fff;
      > select {
        border: none;
        -webkit-appearance: none;
        background: transparent;
        &:focus {
          border: none;
          outline: none;
        }
      }
      > i {
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        font-size: 18px;
        color: #aaa;
      }
    }
    .textarea-wrapper {
      padding: 10px 15px;
      background: #fff;
      > textarea {
        -webkit-appearance: none;
        width: 100%;
        min-height: 100px;
        border: none;
        &:focus {
          border: none;
          outline: none;
        }
      }
    }
    .tips {
      padding-left: 15px;
      margin-top: 10px;
      font-size: 10px;
      color: #999;
    }
    .submit-btn {
      margin-top: 20px;
      padding: 0 15px;
      > a {
        display: block;
        width: 100%;
        height: 36px;
        line-height: 36px;
        color: #fff;
        text-align: center;
        background: @themeColor;
      }
    }
  }

  .my-form-ul {
    padding: 0 15px;
    padding-top: 15px;
    .my-form-item {
      margin-bottom: 15px;
      > a {
        display: block;
        > p {
          text-align: center;
          font-size: 10px;
          margin-bottom: 8px;
          color: #999;
        }
        .msg-box {
          background: #fff;
          padding: 10px;
          padding-top: 35px;
          border-radius: 5px;
          position: relative;
          overflow: hidden;
          > .status-box {
            position: absolute;
            right: 0;
            top: 0;
            width: 100%;
            height: 25px;
            text-align: center;
            line-height: 25px;
            color: #fff;
            &.uncomplete {
              background: rgba(255, 0, 0, 0.29);
              &:before {
                content: "待解决"
              }
            }
            &.complete {
              background: rgba(0, 128, 0, 0.33);
              &:before {
                content: "已解决"
              }
            }
          }
          > h1 {
            font-size: 16px;
            font-weight: bold;
          }
          > p {
            color: #999;
            font-size: 14px;
            &:not(:first-child) {
              margin-top: 5px;
            }
          }
        }
      }
    }
  }

  .question-ul {
    > li {
      background: #fff;
      border-bottom: 1px solid #ddd;
      > a {
        display: block;
        padding: 5px 15px;
        p {
          line-height: 30px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }
</style>
