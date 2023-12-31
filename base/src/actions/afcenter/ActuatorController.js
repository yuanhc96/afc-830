// This file is automatically generated

// 资源扫描

import { ActuatorController } from '@controller'
export default {
  actions: {
    [ActuatorController.getActuatorMappings.method]: {
      summary: '获取java方法与功能码资源的关系表',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/actuator/${payload.resType}/funcode-mappings/${payload.mode}`,
    },
    [ActuatorController.queryAppHealth.method]: {
      summary: '查询指定应用的健康检测信息',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/actuator/apps/health`,
    },
    [ActuatorController.queryAppIsEnable.method]: {
      summary: '查询当前应用状态是否可用',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/actuator/app/current/health`,
    },
    [ActuatorController.resourceLoader.method]: {
      summary: '通过指定资源uri获取资源信息',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/actuator/resource-loader`,
    },
  },
}
