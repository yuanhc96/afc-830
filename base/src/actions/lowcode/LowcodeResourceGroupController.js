// This file is automatically generated

// 低开资源分组管理

import { LowcodeResourceGroupController } from '@controller'
export default {
  actions: {
    [LowcodeResourceGroupController.create.method]: {
      summary: '创建低开资源分组',
      method: 'post',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/resource-groups`,
    },
    [LowcodeResourceGroupController.delete.method]: {
      summary: '根据id删除低开资源分组信息(支持批量删除)',
      method: 'delete',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/resource-groups`,
    },
    [LowcodeResourceGroupController.existsByCode.method]: {
      summary: '校验code是否重复',
      method: 'get',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/resource-groups/exist`,
    },
    [LowcodeResourceGroupController.get.method]: {
      summary: '根据id或者code查询资源分组',
      method: 'get',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/resource-groups/${payload.id}`,
    },
    [LowcodeResourceGroupController.queryWithPage.method]: {
      summary: '分页查询低开资源分组列表',
      method: 'get',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/resource-groups`,
    },
    [LowcodeResourceGroupController.update.method]: {
      summary: '修改低开资源分组',
      method: 'put',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/resource-groups`,
    },
  },
}
