// This file is automatically generated

// 授权管理

import { AuthManagerController } from '@controller'
export default {
  actions: {
    [AuthManagerController.delPartyAuth.method]: {
      summary: '角色参与者解绑：支持批量',
      method: 'delete',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/auths/roles-members`,
    },
    [AuthManagerController.delPartyAuthWithBusObjInst.method]: {
      summary: '业务对象实例场景：删除授权(支持批量)',
      method: 'delete',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/auths/businessObjs/${payload.businessObjInstId}`,
    },
    [AuthManagerController.handlePartyAuth.method]: {
      summary: '角色绑定参与者：支持批量',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/auths/roles-members`,
    },
    [AuthManagerController.handleRoleResource.method]: {
      summary: '角色管理：角色-资源授权处理',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/auths/${payload.roleId}/${payload.types}/role-resources`,
    },
    [AuthManagerController.handleTransferRoleResources.method]: {
      summary: '权限调整：权限统一调整接口(转移+删除)',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/auths/process/${payload.transferType}`,
    },
    [AuthManagerController.queryMembersByObjIdWithPage.method]: {
      summary: '业务对象实例场景：分页查询角色成员列表',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/auths/businessObjs/${payload.businessObjInstId}/roles-members`,
    },
    [AuthManagerController.queryMembersWithPage.method]: {
      summary: '角色管理：分页查询角色成员列表',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/auths/roles-members`,
    },
    [AuthManagerController.queryPartysWithBusObjInst.method]: {
      summary: '业务对象实例场景：查询业务对象实例所属参与者列表',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/auths/businessObjs/${payload.businessObjInstId}/partys`,
    },
    [AuthManagerController.queryResGroupWithRole.method]: {
      summary: '角色管理：查询角色对应的全部资源(含资源分组数据)',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/auths/${payload.roleId}/res-groups`,
    },
    [AuthManagerController.queryResourcesByRole.method]: {
      summary: '角色管理：分页查询角色对应的全部资源(不含资源分组数据)',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/auths/${payload.roleId}/resources`,
    },
    [AuthManagerController.queryRolesByPartyWithBusObjInst.method]: {
      summary: '业务对象实例场景：查询参与者所属角色列表',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/auths/businessObjs/${payload.businessObjInstId}/roles`,
    },
    [AuthManagerController.queryRolesByPartyWithPage.method]: {
      summary: '参与者管理：根据参与者查询所拥有角色',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/auths/party-roles`,
    },
  },
}
