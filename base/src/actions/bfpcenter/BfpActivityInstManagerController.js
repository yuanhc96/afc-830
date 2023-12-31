// This file is automatically generated

// 活动实例管理

import { BfpActivityInstManagerController } from '@controller'
export default {
  actions: {
    [BfpActivityInstManagerController.activationActivity.method]: {
      summary: '活动实例激活',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/activity/activation`,
    },
    [BfpActivityInstManagerController.createAndStartActivityInst.method]: {
      summary: '创建并启动新的活动实例',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/activity/create-and-start`,
    },
    [BfpActivityInstManagerController.editActivityInst.method]: {
      summary: '修改活动实例',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/activity/edit`,
    },
    [BfpActivityInstManagerController.findActivityInstDetail.method]: {
      summary: '获取活动实例详请',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/activity/detail`,
    },
    [BfpActivityInstManagerController.finshActivityInst.method]: {
      summary: '活动实例完成',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/activity/finsh`,
    },
    [BfpActivityInstManagerController.getActivityInstState.method]: {
      summary: '获取活动状态',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/activity/state`,
    },
    [BfpActivityInstManagerController.hasExisRunningActivityInst.method]: {
      summary: '是否存在运行的活动实例',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/activity/has-exis-inst`,
    },
    [BfpActivityInstManagerController.queryActivityDefByProcessDefId.method]: {
      summary: '根据流程定义id获取活动实例',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/activity/by-process-def-id`,
    },
    [BfpActivityInstManagerController.queryActivityInstByProcessInstIdWithPage.method]: {
      summary: '活动实例列表',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/activity/list/by-process-inst-id`,
    },
    [BfpActivityInstManagerController.queryAllActivityDefine.method]: {
      summary: '获取所有的活动定义',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/activity/all-define`,
    },
    [BfpActivityInstManagerController.queryWithPage.method]: {
      summary: '活动实例列表',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/activity/list`,
    },
    [BfpActivityInstManagerController.reStartActivityInst.method]: {
      summary: '重启活动实例',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/activity/restart`,
    },
    [BfpActivityInstManagerController.resumeActivityInst.method]: {
      summary: '恢复活动实例',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/activity/resume`,
    },
    [BfpActivityInstManagerController.rollbackActivityInst.method]: {
      summary: '回退活动实例',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/activity/rollback`,
    },
    [BfpActivityInstManagerController.routeOtherActivityInst.method]: {
      summary: '路由到其他活动实例',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/activity/route-other`,
    },
    [BfpActivityInstManagerController.suspendActivityInst.method]: {
      summary: '挂起活动实例',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/activity/suspend`,
    },
    [BfpActivityInstManagerController.terminateActivityInst.method]: {
      summary: '终止活动实例',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/activity/terminate`,
    },
  },
}
