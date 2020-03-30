import Vue from 'vue'
import {Lazyload} from "vant";
import App from './App.vue'
import router from './router'
import vant from 'vant'
import axios from 'axios'
import store from "./store";
import 'vant/lib/index.css'

//自己封装的Toast
import Toast from "./components/toast/Toast";
axios.defaults.baseURL = 'http://123.207.32.32:8000/api/h3'

Vue.prototype.$http = axios
Vue.prototype.$bus = new Vue()
Vue.config.productionTip = false
Vue.use(vant)
Vue.use(Toast)
Vue.use(Lazyload)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
