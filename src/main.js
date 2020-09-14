// @ts-nocheck
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/vant.js'
import DemoSection from './components/DemoSection.vue';
import {NavBar} from 'vant';
import {List} from 'vant';
import api from './api/index.js'

import myUtils from "./util/myUtils";
import {Col, Row} from 'vant';
import {Tag} from 'vant';
import {Collapse, CollapseItem} from 'vant';
import {Popup} from 'vant';
import {Toast} from "vant";
import {Divider} from 'vant';
import {Tab, Tabs} from 'vant';
// import $ from 'jquery';

Vue.use(Tab);
Vue.use(Tabs)
Vue.use(Divider);
Vue.use(Toast)
Toast.setDefaultOptions({duration: 4000});
Vue.use(Popup);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Tag);
Vue.use(Col);
Vue.use(Row);
Vue.use(NavBar);
Vue.use(List);
import {Step, Steps} from 'vant';

Vue.use(Step);
Vue.use(Steps);
Vue.prototype.$api = api
Vue.prototype.$myUtils = myUtils
Vue.config.productionTip = false
Vue.component(DemoSection.name, DemoSection);
var vue = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
export default vue

// var vue = new Vue({
//   el: '#app',
//   router,
//   components: { App },
//   template: '<App/>'
// })
// export default vue
