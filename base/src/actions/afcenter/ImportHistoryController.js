// This file is automatically generated

// 导入历史记录管理

import { ImportHistoryController } from '@controller'
export default {
  actions: {
    [ImportHistoryController.downloadImportLog.method]: {
      summary: '导入日志下载',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/import-history/download-import-log`,
    },
    [ImportHistoryController.queryImportHistoriesByCriteria.method]: {
      summary: '分页查询导入历史列表',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/import-history`,
    },
  },
}