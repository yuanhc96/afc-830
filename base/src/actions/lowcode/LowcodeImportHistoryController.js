// This file is automatically generated

// 低开导入记录管理

import { LowcodeImportHistoryController } from '@controller'
export default {
  actions: {
    [LowcodeImportHistoryController.queryWithPage.method]: {
      summary: '分页查询导入日志列表',
      method: 'get',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/import-history`,
    },
  },
}
