// This file is automatically generated

// 工作组管理

import { WorkGroupController } from '@controller'
export default {
  actions: {
    [WorkGroupController.create.method]: {
      summary: '新增工作组',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/work-groups`,
    },
    [WorkGroupController.createEmployeesInWorkgroup.method]: {
      summary: '批量添加工作组员工',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/work-groups/employees`,
    },
    [WorkGroupController.createRolesInWorkGroup.method]: {
      summary: '工作组添加角色',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/work-groups/${payload.workGroupId}/roles`,
    },
    [WorkGroupController.deleteByIds.method]: {
      summary: '根据主键集合批量删除工作组',
      method: 'delete',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/work-groups`,
    },
    [WorkGroupController.deleteEmployeesInWorkgroup.method]: {
      summary: '批量删除工作组员工',
      method: 'delete',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/work-groups/employees`,
    },
    [WorkGroupController.deleteRolesInWorkGroup.method]: {
      summary: '工作组移除角色',
      method: 'delete',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/work-groups/${payload.workGroupId}/roles`,
    },
    [WorkGroupController.findWorkGroupById.method]: {
      summary: '根据主键查询工作组信息',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/work-groups/info/${payload.id}`,
    },
    [WorkGroupController.findWorkGroupIsExist.method]: {
      summary: '校验当前租户下是否存在工作组编码或工作组名称，true存在',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/work-groups/exist`,
    },
    [WorkGroupController.queryEmployeesInWorkGroup.method]: {
      summary: '根据工作组ID条件查询工作组员工,分页展示',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/work-groups/employees`,
    },
    [WorkGroupController.queryRolesInWorkGroup.method]: {
      summary: '条件查询工作组下的角色',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/work-groups/${payload.workGroupId}/roles`,
    },
    [WorkGroupController.queryWorkGroupsByCriteria.method]: {
      summary: '按条件查询工作组，分页，排序展示',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/work-groups`,
    },
    [WorkGroupController.update.method]: {
      summary: '修改工作组信息',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/work-groups`,
    },
  },
}