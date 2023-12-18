// This file is automatically generated

// 账号管理

import { UserController } from '@controller'
export default {
  actions: {
    [UserController.checkPassword.method]: {
      summary: '校验密码格式',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/users/${payload.password}/verify`,
    },
    [UserController.create.method]: {
      summary: '新增账号',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/users`,
    },
    [UserController.createRolesInUser.method]: {
      summary: '根据账号添加角色',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/users/${payload.userId}/roles`,
    },
    [UserController.deleteByIds.method]: {
      summary: '根据主键批量删除',
      method: 'delete',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/users`,
    },
    [UserController.deleteRolesInUser.method]: {
      summary: '账号移除角色',
      method: 'delete',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/users/${payload.userId}/roles`,
    },
    [UserController.disableEmployee.method]: {
      summary: '账号禁用',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/users/${payload.userId}/disable`,
    },
    [UserController.enableEmployee.method]: {
      summary: '账号启用',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/users/${payload.userId}/enable`,
    },
    [UserController.findUserById.method]: {
      summary: '根据ID查询账号信息',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/users/${payload.id}`,
    },
    [UserController.findUserIsExist.method]: {
      summary: '校验是否存在账号code，true存在',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/users/exist`,
    },
    [UserController.initPassword.method]: {
      summary: '重置密码',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/users/${payload.userId}/password/init`,
    },
    [UserController.queryRolesInUser.method]: {
      summary: '根据账号ID查询账号下的角色',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/users/${payload.userId}/roles`,
    },
    [UserController.queryUsers.method]: {
      summary: '条件查询账号，分页展示',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/users`,
    },
    [UserController.safetyPassword.method]: {
      summary: '密码安全策略校验',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/users/password/safety`,
    },
    [UserController.unparkUser.method]: {
      summary: '账号解锁',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/users/${payload.userId}/unpark`,
    },
    [UserController.update.method]: {
      summary: '修改账号信息',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/users`,
    },
    [UserController.updatePassword.method]: {
      summary: '修改密码',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/users/password`,
    },
  },
}
