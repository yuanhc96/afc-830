// This file is automatically generated

// 租户管理

import { TenantController } from '@controller'
export default {
  actions: {
    [TenantController.create.method]: {
      summary: '新增租户',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/tenants`,
    },
    [TenantController.disable.method]: {
      summary: '禁用租户',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/tenants/${payload.id}/disable`,
    },
    [TenantController.enable.method]: {
      summary: '启用租户',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/tenants/${payload.id}/enable`,
    },
    [TenantController.findTenant.method]: {
      summary: '根据id查询租户',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/tenants/${payload.id}`,
    },
    [TenantController.findTenantByIds.method]: {
      summary: '根据ID集合查询租户',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/tenants/detail`,
    },
    [TenantController.isExist.method]: {
      summary: '根据name和code校验租户',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/tenants/exist`,
    },
    [TenantController.queryTenantsByCriteria.method]: {
      summary: '根据条件查询租户',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/tenants`,
    },
    [TenantController.update.method]: {
      summary: '更新租户',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/tenants`,
    },
  },
}
