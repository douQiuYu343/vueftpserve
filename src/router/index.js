import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Index from '../views/index/Index.vue'
import Setting from "../views/index/Area/Setting/Setting.vue";
import Notice from "../views/index/Area/Notice/Notice.vue";
import FastNetdisk from "../views/index/Area/Netdisk/FastNetdisk.vue";
import FristNetdisk from "../views/index/Area/Netdisk/FristNetdisk.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/Index',
    name: 'Index',
    component: Index,
    children:[
      {
        path:'Setting',
        name:'Setting',
        component:Setting
      },
      {
        path: 'Notice',
        name:'Notice',
        component: Notice
      },
      {
        path: 'FastNetdisk',
        name: 'FastNetdisk',
        component: FastNetdisk
      },
      {
        path: 'FristNetdisk',
        name: 'FristNetdisk',
        component: FristNetdisk
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
