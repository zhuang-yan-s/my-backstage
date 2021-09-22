import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入全局css样式
import '../public/css/global.min.css'

// 引入element-ui
import 'element-ui/lib/theme-chalk/index.css';
import './plugins/index'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
