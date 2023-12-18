const _import = require('./_import_' + process.env.NODE_ENV)
import { loadRemoteComponent } from '@/utils/loadRemote.js'
export default [
  {
    path: '/login',
    name: 'login',
    component: true ? _import('login/index') : () => {
      return loadRemoteComponent({
        url: 'http://localhost:9000/bfp/remoteEntry.js',
        scope: 'bfp',
        module: `./bfp/login`,
      })
    },
    hidden: true,
  },
  {
    path: '/auth',
    name: 'auth',
    component: _import('login/index'),
    hidden: true,
  },
  { path: '/app/:appName/module/:module/page/:page', component: _import('app/highcodeEntry'), hidden: true },
  { path: '/module/:module/page/:page', component: _import('app/entry'), hidden: true },
  { path: '/app/:module/module/:page', component: _import('app/entry'), hidden: true }, // 兼容老规则
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  { path: '/dict', component: _import('coframe/dict/index'), hidden: true },
  { path: '/org', component: _import('afcenter/org/index'), hidden: true },
  {
    path:'/station_mail',component:_import('layout/Layout'),isNewWindowOpen:false,hidden:true,meta:{isFullScreenShow:true},children:[{
      path:'index',
      component: _import('afcenter/mail/index'),
      meta:{}
    }]
  },
  { path: '/app', component: _import('afcenter/app/index'), hidden: true },
  { path: '/source_store', component: _import('afcenter/source-store/index'), hidden: true },
  { path: '/components_store', component: _import('afcenter/components-store/index'), hidden: true },
  { path: '/components_store/preview', component: _import('afcenter/components-store/markdown-doc'), hidden: true },
  { path: '/dispatching_record/logDetailPage', component: _import('afcenter/task-scheduing/dispatching-record/logDetailPage'), hidden: true },
  { path: '/task-management/editor', component: _import('afcenter/task-scheduing/task-management/editor'), hidden: true }

  // { path: '*',  redirect: '/404', hidden: true },
]
