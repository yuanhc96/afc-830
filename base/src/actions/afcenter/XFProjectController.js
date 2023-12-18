// This file is automatically generated

// 讯飞集成-工程管理

import { XFProjectController } from '@controller'
export default {
  actions: {
    [XFProjectController.createProject.method]: {
      summary: '创建工程接口',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/integration/apps`,
    },
    [XFProjectController.deleteProject.method]: {
      summary: '删除工程接口',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/integration/apps/bulk-delete`,
    },
    [XFProjectController.getLogFileNames.method]: {
      summary: '查看工程的运行日志文件名称列表',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/integration/loggers/file-names`,
    },
    [XFProjectController.getLogs.method]: {
      summary: '查看工程的运行日志内容',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/integration/loggers`,
    },
    [XFProjectController.queryUsersWithPage.method]: {
      summary: '查看整个应用的用户列表',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/integration/users`,
    },
    [XFProjectController.updateProject.method]: {
      summary: '修改工程接口',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/integration/apps`,
    },
  },
}