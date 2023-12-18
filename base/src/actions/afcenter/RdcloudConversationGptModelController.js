// This file is automatically generated

// GPT模型管理

import { RdcloudConversationGptModelController } from '@controller'
export default {
  actions: {
    [RdcloudConversationGptModelController.create.method]: {
      summary: '创建模型',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/gpt-models`,
    },
    [RdcloudConversationGptModelController.deleteByIds.method]: {
      summary: '按主键集合删除(参数放body)',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/gpt-models/bulk-delete`,
    },
    [RdcloudConversationGptModelController.findRdcloudConversationGptModelByIdOrCode.method]: {
      summary: '根据id查询',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/gpt-models/find-gpt-model`,
    },
    [RdcloudConversationGptModelController.isExist.method]: {
      summary: '校验code是否重复',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/gpt-models/exist/${payload.code}`,
    },
    [RdcloudConversationGptModelController.queryRdcloudConversationGptModels.method]: {
      summary: '查询模型列表',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/gpt-models`,
    },
    [RdcloudConversationGptModelController.update.method]: {
      summary: '修改会话',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/gpt-models`,
    },
  },
}
