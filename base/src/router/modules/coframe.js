import FuncCode from '@/permission/FuncCode'
const _import = require('../_import_' + process.env.NODE_ENV)

export default [
  {
    path: '',
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
]
