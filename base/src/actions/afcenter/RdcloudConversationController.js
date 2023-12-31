// This file is automatically generated

// 会话管理

import { RdcloudConversationController } from '@controller'
export default {
  actions: {
    [RdcloudConversationController.create.method]: {
      summary: '创建会话',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/conversations`,
    },
    [RdcloudConversationController.createContent.method]: {
      summary: '创建会话内容(前端组织上下文)',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/conversations/${payload.conversationId}/gpt-content`,
    },
    [RdcloudConversationController.createContent4Template.method]: {
      summary: '创建会话内容(前端组织上下文)',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/conversations/tempalte/gpt-content`,
    },
    [RdcloudConversationController.createContentWithContext.method]: {
      summary: '创建会话内容',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/conversations/${payload.conversationId}/content`,
    },
    [RdcloudConversationController.deleteByIds.method]: {
      summary: '按主键集合删除(参数放body)',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/conversations/bulk-delete`,
    },
    [RdcloudConversationController.queryRdConversationContents.method]: {
      summary: '获取会话内容列表',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/conversations/${payload.conversationId}/contents`,
    },
    [RdcloudConversationController.queryRdConversations.method]: {
      summary: '查询会话列表',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/conversations`,
    },
    [RdcloudConversationController.update.method]: {
      summary: '修改会话',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/conversations`,
    },
    [RdcloudConversationController.updateContent.method]: {
      summary: '更新会话内容(前端组织上下文)',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/conversations/${payload.conversationId}/gpt-content`,
    },
    [RdcloudConversationController.updateContentWithContext.method]: {
      summary: '更新会话内容',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/conversations/${payload.conversationId}/content`,
    },
  },
}
