import VueRouter, { RouteMeta } from 'vue-router'

// Pages
import Login from '@/pages/Login.vue'
import Screenshot from '@/pages/Screenshot.vue'
import Vue from 'vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/screenshot',
    name: 'Screenshot',
    component: Screenshot
  }
  // TODO: Add more routes here
]

Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to: RouteMeta, from: RouteMeta, next) => {
  // check auth?
  next()
})

export default router
