// 切换成在线组件库
import { loadRemoteComponent } from '@/utils/loadRemote.js'
import {
  DictEntryController,
  DictTypeController,
  EmployeeController,
  LowcodeDataSourceController,
  LowcodeModelController, MaterialGroupController, OrgController,
  PositionController,
  RoleController,
  SelectionComponentController, SourceMaterialController,
  WorkGroupController,
} from '@controller'
// import { BaseVue } from '@lib'
import { getQueryVariable } from '@/utils/tools'
import PmClipButton from 'primeton-ui/lib/pm-clip-button'
import PmContextmenu from 'primeton-ui/lib/pm-context-menu'
import PmContextmenuItem from 'primeton-ui/lib/pm-context-menu-item'
// import PmDialog from 'primeton-ui/lib/pm-dialog'
import PmDropMenu from 'primeton-ui/lib/pm-drop-menu'
import PmDropMenuItem from 'primeton-ui/lib/pm-drop-menu-item'
import PmFormDialog from 'primeton-ui/lib/pm-form-dialog'
import PmList from 'primeton-ui/lib/pm-list'
// import PmNavigation from 'primeton-ui/lib/pm-navigation'
// import PmPagination from 'primeton-ui/lib/pm-pagination'
// import PmSearch from 'primeton-ui/lib/pm-search'
import PmHamburger from 'primeton-ui/lib/pm-hamburger'
import PmSecondaryMenu from 'primeton-ui/lib/pm-secondary-menu'
// import PmSelect from 'primeton-ui/lib/pm-select'
import PmSplit from 'primeton-ui/lib/pm-split'
import PmTable from 'primeton-ui/lib/pm-table'
import PmToolbar from 'primeton-ui/lib/pm-toolbar'
import PmToolbarGroup from 'primeton-ui/lib/pm-toolbar-group'
import PmToolbarItem from 'primeton-ui/lib/pm-toolbar-item'
import PmTree from 'primeton-ui/lib/pm-tree'
import Vue from 'vue'
Vue.use(PmDropMenu)
Vue.use(PmDropMenuItem)
// Vue.use(PmSearch)
Vue.use(PmFormDialog)
Vue.use(PmTable)
// Vue.use(PmDialog)
Vue.use(PmList)
// Vue.use(PmPagination)
Vue.use(PmContextmenu)
Vue.use(PmContextmenuItem)
// Vue.use(PmNavigation)
Vue.use(PmSecondaryMenu)
Vue.use(PmHamburger)
Vue.use(PmToolbar)
Vue.use(PmToolbarGroup)
Vue.use(PmToolbarItem)
Vue.use(PmTree)
Vue.use(PmSplit)
// Vue.use(PmSelect)
Vue.use(PmClipButton)
Vue.prototype.Controllers = {
  DictEntryController,
  LowcodeModelController,
  MaterialGroupController,
  SourceMaterialController,
  EmployeeController, OrgController, SelectionComponentController, RoleController, PositionController,
  WorkGroupController,
  LowcodeDataSourceController,
  DictTypeController
}
loadRemoteComponent({
  url: `./components/remoteEntry.js`,
  scope: 'components',
  module: [getQueryVariable('platform') === 'm_' ? './mobile_config' : './config'],
}).then(re => {
  Promise.all([re]).then(d => {
  //   Vue.mixin(BaseVue) // 注册后混入基础类
  })
})

