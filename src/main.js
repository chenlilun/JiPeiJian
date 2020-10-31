// @ts-nocheck
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/vant.js'
import api from './api/index.js'
import myUtils from './util/myUtils'
import Cookie from 'js-cookie'
/* import Es6Promise from 'es6-promise'
require('es6-promise').polyfill()
Es6Promise.polyfill() */
import { DatetimePicker } from 'vant'
Vue.use(DatetimePicker)
import { Search } from 'vant'

Vue.use(Search)
Vue.prototype.$api = api
Vue.prototype.$cookie = Cookie
Vue.prototype.$myUtils = myUtils
Vue.config.productionTip = false
var vue = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
export default vue
