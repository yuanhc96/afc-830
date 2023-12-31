// This file is automatically generated

// 资源代理管理

import { ResourceProxyController } from '@controller'
export default {
  actions: {
    [ResourceProxyController.createResource.method]: {
      summary: '创建资源信息',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/afc-proxy/resource/create-resource`,
    },
    [ResourceProxyController.findMenuByCode.method]: {
      summary: '根据菜单code查询菜单信息',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/afc-proxy/resource/find-menu-by-code`,
    },
    [ResourceProxyController.findResourceByCode.method]: {
      summary: '根据资源code查询资源信息',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/afc-proxy/resource/find-resource-by-code`,
    },
  },
}
