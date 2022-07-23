import Vue from 'vue'
import App from './App'

import uView from 'uview-ui'

import store from './store'
import storeMixin from './store/mixin'

import router from './common/router'

import request from './common/request'

Vue.config.productionTip = false

App.mpType = 'app'

Vue.mixin(storeMixin)

const app = new Vue({
  store,
  ...App
})

Vue.use(uView)
Vue.use(router, app)
Vue.use(request, app)

app.$mount()
