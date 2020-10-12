// @ts-nocheck
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/vant.js'
import api from './api/index.js'
import myUtils from './util/myUtils'

/* import Es6Promise from 'es6-promise'
require('es6-promise').polyfill()
Es6Promise.polyfill() */

Vue.prototype.$api = api
Vue.prototype.$myUtils = myUtils
Vue.config.productionTip = false
var vue = new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
export default vue
