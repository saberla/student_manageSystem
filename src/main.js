import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import elementUI, { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

// axios请求拦截器
axios.interceptors.request.use(config => {
  if (localStorage.getItem('loginToken')) {
    // 请求统一设置header
    config.headers.Authorization = localStorage.getItem('loginToken')
  }
  return config
}, error => {
  return Promise.reject(error)
})

// axios响应拦截器
axios.interceptors.response.use(response => {
  return response.data
}, error => {
  // console.log('看一看', error.response)
  const { status } = error.response
  if (status === 401) { // token失效
    Message.error('token失效，请重新登录')
    // 清除token
    localStorage.removeItem('loginToken')
    router.push('/')
  }
  return Promise.reject(error)
})

Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(elementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
