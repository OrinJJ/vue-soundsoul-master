// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import axios from 'axios'
import vueAplayer from 'vue-aplayer'

Vue.use(vueAplayer) //音乐播放插件
Vue.prototype.$axios = axios;  //写成原型属性，
Vue.config.productionTip = false
Vue.use(ElementUI)
window.eventBus = new Vue();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  render: h => h(App)
  // 是下面内容的简写
  // render: function (createElement) {
  //   return createElement(App);
  // }
})
