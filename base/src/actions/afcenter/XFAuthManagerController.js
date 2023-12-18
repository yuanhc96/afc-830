// This file is automatically generated

// 讯飞集成-授权管理

import { XFAuthManagerController } from '@controller'
export default {
  actions: {
    [XFAuthManagerController.handlePartyAuth.method]: {
      summary: '工程授权：用户绑定角色',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/integration/auths/${payload.projectCode}/role-users`,
    },
    [XFAuthManagerController.queryRolesByProject.method]: {
      summary: '查询工程内角色列表',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/integration/auths/${payload.projectCode}/roles`,
    },
    [XFAuthManagerController.queryUsersWithPage.method]: {
      summary: '查询工程内用户列表(可按角色条件查询)',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/integration/auths/${payload.projectCode}/users`,
    },
  },
}
