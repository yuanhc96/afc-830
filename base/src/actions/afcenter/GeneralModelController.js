// This file is automatically generated

// 应用实体控制器

import { GeneralModelController } from '@controller'
export default {
  actions: {
    [GeneralModelController.queryDataSources.method]: {
      summary: '查询应用数据源列表',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/commons/models/actions/datasources`,
    },
    [GeneralModelController.queryPersistentEntitys.method]: {
      summary: '查询当前应用内运行时sdo',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/commons/models/persistent-entitys`,
    },
    [GeneralModelController.queryWithPage.method]: {
      summary: '分页查询数据模型',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/commons/models/actions/query-with-page`,
    },
  },
}
