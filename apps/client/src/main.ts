import './assets/css/main.css'
import '@mdi/font/css/materialdesignicons.css'

import { PiniaVuePlugin, createPinia } from 'pinia'

import App from './App.vue'
import Vue from 'vue'
import router from './router'
import vuetify from './vuetify'

// Pinia Store
Vue.use(PiniaVuePlugin)
const pinia: any = createPinia()

new Vue({
  render: h => h(App),
  pinia,
  router,
  vuetify
}).$mount('#app')
