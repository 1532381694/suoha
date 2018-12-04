import Vue from 'vue'
import App from './App.vue'
import $ from 'jquery'
//引入路由
import router from "./route"
Vue.config.productionTip = false;

import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.min.js'
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
