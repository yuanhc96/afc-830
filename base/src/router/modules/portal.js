import Layout from '../../views/layout/Layout'
// import { loadRemoteComponent } from '@/utils/loadRemote.js'
const _import = require('../_import_' + process.env.NODE_ENV)

export default [
  {
    path: '/portal-index',
    component: Layout,
    redirect: '',
    children: [
      {
        path: '',
        component: _import('portal/index'),
        name: 'portal-index',
        meta: { title: '门户', noCache: true },
      },
    ],
  },
]
