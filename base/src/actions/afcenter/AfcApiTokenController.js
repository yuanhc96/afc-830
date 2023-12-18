// This file is automatically generated

// 访问凭证管理

import { AfcApiTokenController } from '@controller'
export default {
  actions: {
    [AfcApiTokenController.create.method]: {
      summary: '创建token',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/afc-api-token`,
    },
    [AfcApiTokenController.delete.method]: {
      summary: '删除token',
      method: 'delete',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/afc-api-token/${payload.id}`,
    },
    [AfcApiTokenController.deleteBatch.method]: {
      summary: '批量删除token',
      method: 'delete',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/afc-api-token/batch/token`,
    },
    [AfcApiTokenController.deleteCache.method]: {
      summary: '清除指定用户缓存',
      method: 'delete',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/afc-api-token/cache/${payload.userId}`,
    },
    [AfcApiTokenController.findById.method]: {
      summary: '通过id查询token',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/afc-api-token/${payload.id}`,
    },
    [AfcApiTokenController.findByToken.method]: {
      summary: '通过token查询api-token',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/afc-api-token/${payload.token}`,
    },
    [AfcApiTokenController.queryTokens.method]: {
      summary: '查询所有token',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/afc-api-token`,
    },
    [AfcApiTokenController.queryUserTokens.method]: {
      summary: '查询指定用户的所有token',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/afc-api-token/${payload.userId}/tokens`,
    },
    [AfcApiTokenController.update.method]: {
      summary: '更新Token失效时间和备注',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/afc-api-token`,
    },
  },
}