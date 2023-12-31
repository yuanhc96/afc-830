// This file is automatically generated

// suppliermgr

import { SuppliermgrController } from '@controller'
export default {
  actions: {
    [SuppliermgrController.approvetest.method]: {
      summary: '新增审批示例',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/com.primeton.suppliermgr.approvetest.biz.ext`,
    },
    [SuppliermgrController.recalltest.method]: {
      summary: '撤回示例',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/com.primeton.suppliermgr.recalltest.biz.ext`,
    },
  },
}
