// This file is automatically generated

// job-api处理器

import { JobApiController } from '@controller'
export default {
  actions: {
    [JobApiController.api.method]: {
      summary: 'api',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/job/api/${payload.uri}`,
    },
  },
}
