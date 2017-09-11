// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// author by ChenYuechuan
import Vue from 'vue'
import App from './App'
import router from './router'
import components from '@/components'
import VueResource from 'vue-resource'
import store from './store'
import filters from './utils/filter'
// import {getUserItem} from './utils'

/* 注册mint-ui的一系列用到的组件 */
import {
  DatetimePicker,
  Radio,
  Switch,
  Loadmore,
  Swipe,
  SwipeItem,
  Indicator,
  InfiniteScroll,
  Spinner,
  MessageBox
} from 'mint-ui'
Vue.component(DatetimePicker.name, DatetimePicker)
Vue.component(Radio.name, Radio)
Vue.component(Switch.name, Switch)
Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
Vue.component(Spinner.name, Spinner)
Vue.component(Loadmore.name, Loadmore)
Vue.use(InfiniteScroll)
Vue.use(VueResource)

/* 注册过滤器 */
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

const IsProduction = process.env.NODE_ENV === 'production'
/* 设置异步请求的全局拦截器 */
Vue.http.interceptors.push(function (request, next) {
  let that = this
  if (IsProduction) {
    let ajaxUrl = require('../config').dev.proxyTable['/api'].target
    request.url = request.url.replace(/api/, ajaxUrl)
  }
  if (request.url.split('/').slice(-1)[0] !== 'rush') {
    Indicator.open()
  }
  next(function (response) {
    Indicator.close()
    if (response.data.code === 'NOT_MEMBER') {
      MessageBox({
        message: '为了保障您的账号权益，开通会员后才能接单哦，点击确定前往充值页！'
      }).then(() => {
        that.$router.push('/mine/vip')
        return false
      })
    }
  })
})

/* 注册自定义组件 */
for (let key in components) {
  let name = key.replace(/(\w)/, (v) => v.toUpperCase())
  Vue.component(`v${name}`, components[key])
}

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {App}
})
