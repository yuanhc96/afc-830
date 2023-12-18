import { localStore } from '@/utils/sessionStore'
import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../views/layout/Layout'
import Portal from './modules/portal.js'
import staticRouter from './static.js'
const _import = require('./_import_' + process.env.NODE_ENV)
Vue.use(Router)

const redirectPath = () => {
  if (localStore.get('isobjectMenu')) {
    return 'objectDashboard'
  } else {
    return 'dashboard'
  }
}

export const asyncRouterMap = [
  {
    path: '',
    component: Layout,
    redirect: redirectPath(),
    children: [
      {
        path: 'dashboard',
        component: _import('dashboard/index'),
        name: 'dashboard',
        meta: { title: '概要', icon: 'dashboard', noCache: true },
      },
    ],
  },
  {
    path: '/appMenu',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: _import('dashboard/index'),
        name: 'dashboard',
        meta: { title: '概要', icon: 'dashboard', noCache: true },
      },
    ],
  },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  ...Portal,
  // { path: '*', redirect: '/404', hidden: true },
]

export default new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: staticRouter.concat(asyncRouterMap), // If u wan't to pass login, take effect this line
})
