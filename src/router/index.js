import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  }, {
    path: '/index',
    name: 'index',
    component: () => import('@/views/Index.vue')
  }, {
    path: '/type',
    name: 'type',
    component: () => import('@/views/Type.vue')
  }, {
    path: '/item',
    name: 'item',
    component: () => import('@/views/Item.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
