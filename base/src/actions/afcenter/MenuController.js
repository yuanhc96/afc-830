// This file is automatically generated

// 菜单管理

import { MenuController } from '@controller'
export default {
  actions: {
    [MenuController.create.method]: {
      summary: '新增菜单',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/menus`,
    },
    [MenuController.createMenuWithLowForm.method]: {
      summary: 'IDE内使用低开表单创建菜单',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/menus/create/low-form/menu`,
    },
    [MenuController.deleteByIds.method]: {
      summary: '按主键集合删除(参数放body)',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/menus/bulk-delete`,
    },
    [MenuController.findMenu.method]: {
      summary: '根据id查询',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/menus/${payload.id}`,
    },
    [MenuController.isExist.method]: {
      summary: '校验code是否重复',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/menus/exist/${payload.code}/${payload.tenantId}`,
    },
    [MenuController.queryFunctionCodesByBusinessObj.method]: {
      summary: '查询业务对象实例中当前登录用户功能码',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/menus/${payload.businessObjId}/${payload.businessObjInstId}/function`,
    },
    [MenuController.queryMenusByAppName.method]: {
      summary: '根据当前登录用户的权限获取应用菜单列表(应用菜单)',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/menus/current/app-menus/${payload.appName}`,
    },
    [MenuController.queryMenusByBusinessObjId.method]: {
      summary: '根据当前业务对象实例获取菜单列表',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/menus/${payload.businessObjId}/${payload.businessObjInstId}/menus`,
    },
    [MenuController.queryMenusByCriteria.method]: {
      summary: '分页查询菜单列表',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/menus`,
    },
    [MenuController.queryMenusByCurrentUser.method]: {
      summary: '根据当前登录用户的权限获取菜单列表',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/menus/current/menus`,
    },
    [MenuController.update.method]: {
      summary: '修改菜单-基础信息',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/menus`,
    },
    [MenuController.updateMenuBatch.method]: {
      summary: '批量修改菜单',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/menus/batch/menu`,
    },
    [MenuController.updateParentId.method]: {
      summary: '批量调整菜单',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/menus/parentMenu-change/${payload.parentId}`,
    },
  },
}
