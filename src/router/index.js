// @ts-nocheck
import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import index from '../views/index.vue'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      meta: { keepAlive: false },
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home,
    },
  ],
})

export default router
