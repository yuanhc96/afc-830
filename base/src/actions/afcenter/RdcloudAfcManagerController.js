// This file is automatically generated

// Afcenter控制台管理

import { RdcloudAfcManagerController } from '@controller'
export default {
  actions: {
    [RdcloudAfcManagerController.queryEmployeeByAIRole.method]: {
      summary: '获取所有拥有AI权限的用户',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/afcenter/chatgpt-role-users`,
    },
    [RdcloudAfcManagerController.queryMenusByCurrentUser.method]: {
      summary: '根据当前登录用户的权限获取菜单列表',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/afcenter/current/menus`,
    },
  },
}