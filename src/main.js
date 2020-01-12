import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(ElementUI)
axios.defaults.withCredentials = true
Vue.prototype.$http = axios

new Vue({
  router,
  store,
  render: h => h(App),
  created () {
    store.commit('savePage', this)
    store.commit('updateUser')
    store.commit('updateTypes')
  }
}).$mount('#app')

router.afterEach(() => {
  document.querySelector('#page-top').scrollIntoView()
})