// This file is automatically generated

// BFP流程定义管理

import { BfpProcessManagerController } from '@controller'
export default {
  actions: {
    [BfpProcessManagerController.deleteProcessById.method]: {
      summary: '根据流程定义id删除定义信息（包含流程实例）',
      method: 'delete',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/manager/delete-process`,
    },
    [BfpProcessManagerController.deleteProcessDefine.method]: {
      summary: '删除流程定义',
      method: 'delete',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/manager/bps`,
    },
    [BfpProcessManagerController.exportProcess.method]: {
      summary: '导出流程',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/manager/application/process/export`,
    },
    [BfpProcessManagerController.getAllProcessByProcessDefName.method]: {
      summary: '通过流程定义名称获取所有流程定义版本信息',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/manager/all-process`,
    },
    [BfpProcessManagerController.importProcess.method]: {
      summary: '导入文件解析流程',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/manager/application/process/import`,
    },
    [BfpProcessManagerController.publishProcess.method]: {
      summary: '发布某流程定义模板的指定版本',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/manager/publish-process`,
    },
    [BfpProcessManagerController.queryAuditLog.method]: {
      summary: '查询审计日志',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/manager/audit`,
    },
    [BfpProcessManagerController.queryAutoActivityInException.method]: {
      summary: '查询异常活动',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/manager/exception`,
    },
    [BfpProcessManagerController.queryBpsTenant.method]: {
      summary: '查询bps多租户信息',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/manager/bps/tenant`,
    },
    [BfpProcessManagerController.queryProcessDefineInfosByAppCode.method]: {
      summary: '根据应用编码查询应用下全部流程',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/manager/application/process/defs`,
    },
    [BfpProcessManagerController.queryProcessDefinesInAppSum.method]: {
      summary: '获取应用流程数量',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/manager/application/process/count`,
    },
    [BfpProcessManagerController.unpublishProcess.method]: {
      summary: '取消某流程定义的发布',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/manager/unpublish-process`,
    },
    [BfpProcessManagerController.updateAppBpsTenants.method]: {
      summary: '更新应用绑定的流程租户信息',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/manager/application/process/tenant`,
    },
    [BfpProcessManagerController.updateProcessDefinesApp.method]: {
      summary: '更新流程定义应用信息',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/bfp/configcenter/manager/application/process/change`,
    },
  },
}