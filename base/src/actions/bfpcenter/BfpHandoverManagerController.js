// This file is automatically generated

// 交接管理

import { BfpHandoverManagerController } from '@controller'
export default {
  actions: {
    [BfpHandoverManagerController.deleteAgent.method]: {
      summary: '复杂删除代理',
      method: 'delete',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/handover`,
    },
    [BfpHandoverManagerController.exeSimpleHandover.method]: {
      summary: '简单交接',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/handover/simple`,
    },
    [BfpHandoverManagerController.handoverProDef.method]: {
      summary: '复杂交接流程定义',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/handover/prodef`,
    },
    [BfpHandoverManagerController.handoverWItem.method]: {
      summary: '复杂交接工作项',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/handover/workitem`,
    },
    [BfpHandoverManagerController.queryAgent.method]: {
      summary: '代理查询',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/handover/agent`,
    },
    [BfpHandoverManagerController.queryHandoverWorklist.method]: {
      summary: '普通查询列表',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/handover/worklist`,
    },
    [BfpHandoverManagerController.queryProDef.method]: {
      summary: '流程定义查询',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/handover/query/prodef`,
    },
    [BfpHandoverManagerController.queryWorkitem.method]: {
      summary: '工作项查询',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/handover/query/workitem`,
    },
  },
}