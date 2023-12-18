// This file is automatically generated

// 低开实体数据源关联关系管理

import { LowcodeEntityDatasourceController } from '@controller'
export default {
  actions: {
    [LowcodeEntityDatasourceController.delete.method]: {
      summary: '删除低开实体数据源关联关系',
      method: 'delete',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/r-entity-datasources`,
    },
    [LowcodeEntityDatasourceController.get.method]: {
      summary: '获取低开实体数据源关联关系',
      method: 'get',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/r-entity-datasources`,
    },
    [LowcodeEntityDatasourceController.merge.method]: {
      summary: '合并低开实体数据源关联关系',
      method: 'put',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/r-entity-datasources`,
    },
    [LowcodeEntityDatasourceController.queryWithPage.method]: {
      summary: '分页查询低开实体数据源关联关系',
      method: 'get',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/r-entity-datasources/actions/query-with-page`,
    },
    [LowcodeEntityDatasourceController.save.method]: {
      summary: '保存低开实体数据源关联关系',
      method: 'post',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/r-entity-datasources`,
    },
  },
}
