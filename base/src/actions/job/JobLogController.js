// This file is automatically generated

// job-log处理器

import { JobLogController } from '@controller'
export default {
  actions: {
    [JobLogController.clearLog.method]: {
      summary: 'clearLog',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/job-logs/actions/clear-log`,
    },
    [JobLogController.getJobsByGroup.method]: {
      summary: 'getJobsByGroup',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/job-logs/jobs/${payload.jobGroup}`,
    },
    [JobLogController.logDetailCat.method]: {
      summary: 'logDetailCat',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/job-logs/${payload.logId}/detail-cat`,
    },
    [JobLogController.logKill.method]: {
      summary: 'logKill',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/job-logs/actions/${payload.id}/kill`,
    },
    [JobLogController.pageList.method]: {
      summary: 'pageList',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/job-logs`,
    },
  },
}
