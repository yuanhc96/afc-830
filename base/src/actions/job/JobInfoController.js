// This file is automatically generated

// job-info处理器

import { JobInfoController } from '@controller'
export default {
  actions: {
    [JobInfoController.add.method]: {
      summary: 'add',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/job-info`,
    },
    [JobInfoController.nextTriggerTime.method]: {
      summary: 'nextTriggerTime',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/job-info/nextTriggerTime`,
    },
    [JobInfoController.pageList.method]: {
      summary: 'pageList',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/job-info/pageList`,
    },
    [JobInfoController.pause.method]: {
      summary: 'pause',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/job-info/actions/showdown/${payload.id}`,
    },
    [JobInfoController.remove.method]: {
      summary: 'remove',
      method: 'delete',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/job-info/${payload.id}`,
    },
    [JobInfoController.start.method]: {
      summary: 'start',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/job-info/actions/start/${payload.id}`,
    },
    [JobInfoController.triggerJob.method]: {
      summary: 'triggerJob',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/job-info/trigger/${payload.id}`,
    },
    [JobInfoController.update.method]: {
      summary: 'update',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/job-info`,
    },
  },
}
