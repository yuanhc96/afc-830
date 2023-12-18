// This file is automatically generated

// 常用语管理

import { CommonInfoController } from '@controller'
export default {
  actions: {
    [CommonInfoController.createCommonInfo.method]: {
      summary: '新增常用语',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/common-info/create`,
    },
    [CommonInfoController.deleteCommonInfo.method]: {
      summary: '根据主键id删除常用语',
      method: 'delete',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/common-info/delete`,
    },
    [CommonInfoController.findCommonInfo.method]: {
      summary: '分页查询常用语',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/common-info/find-common-info`,
    },
    [CommonInfoController.updateCommonInfo.method]: {
      summary: '修改常用语',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/common-info/update`,
    },
  },
}
