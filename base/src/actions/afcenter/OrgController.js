// This file is automatically generated

// 机构管理

import { OrgController } from '@controller'
export default {
  actions: {
    [OrgController.create.method]: {
      summary: '新增机构',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs`,
    },
    [OrgController.createManagerInOrg.method]: {
      summary: '设置机构管理员',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/${payload.orgId}/manager/${payload.employeeId}`,
    },
    [OrgController.createResourceInOrg.method]: {
      summary: '设置机构管理员管理的资源',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/${payload.orgId}/resource`,
    },
    [OrgController.createRolesInOrg.method]: {
      summary: '机构添加角色',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/${payload.orgId}/roles`,
    },
    [OrgController.deleteByIds.method]: {
      summary: '根据主键集合批量删除机构',
      method: 'delete',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs`,
    },
    [OrgController.deleteEmployeeInOrg.method]: {
      summary: '删除指定维度下机构的员工信息',
      method: 'delete',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/${payload.orgId}/${payload.employeeId}/employee/${payload.dimensionId}`,
    },
    [OrgController.deleteEmployeesInOrg.method]: {
      summary: '机构下的指定员工删除岗位',
      method: 'delete',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/${payload.orgId}/positions`,
    },
    [OrgController.deleteManagerInOrg.method]: {
      summary: '删除机构管理员',
      method: 'delete',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/${payload.orgId}/manager/${payload.employeeId}`,
    },
    [OrgController.deleteResourceInOrg.method]: {
      summary: '删除机构某个管理员管理的资源',
      method: 'delete',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/${payload.orgId}/resource`,
    },
    [OrgController.deleteRolesInOrg.method]: {
      summary: '机构移除角色',
      method: 'delete',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/${payload.orgId}/roles`,
    },
    [OrgController.disableOrg.method]: {
      summary: '机构禁用',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/${payload.orgId}/disable`,
    },
    [OrgController.empUpload.method]: {
      summary: '人员导入',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/${payload.importSetting}/import-emp`,
    },
    [OrgController.enableOrg.method]: {
      summary: '机构启用',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/${payload.orgId}/enable`,
    },
    [OrgController.exportEmp.method]: {
      summary: '人员导出',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/emp-export`,
    },
    [OrgController.exportEmpModel.method]: {
      summary: '人员模板导出',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/emp-export-model`,
    },
    [OrgController.exportOrg.method]: {
      summary: '导出机构',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/export`,
    },
    [OrgController.exportOrgModel.method]: {
      summary: '导出机构模板',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/export-model`,
    },
    [OrgController.findMainOrgByEmployeeCode.method]: {
      summary: '根据员工编码查询指定维度(默认主维度)下的所属主机构',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/main/emp-code`,
    },
    [OrgController.findOrgByEmployeeCode.method]: {
      summary: '根据员工编码查询指定维度(默认主维度)下的所属机构',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/info/emp-code`,
    },
    [OrgController.findOrgById.method]: {
      summary: '根据id查询机构',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/info/${payload.id}`,
    },
    [OrgController.findOrgIsExist.method]: {
      summary: '校验当前租户下是否存在机构code，true存在',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/exist`,
    },
    [OrgController.orgUpload.method]: {
      summary: '机构导入',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/${payload.importSetting}/import-org`,
    },
    [OrgController.queryAllEmployees.method]: {
      summary: '条件查询维度下所有员工，分页展示',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/employees`,
    },
    [OrgController.queryAllOrgsToTree.method]: {
      summary: '按条件查询机构，分页展示(树)，机构管理员过滤',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/childs/tree`,
    },
    [OrgController.queryChildOrgsWithPage.method]: {
      summary: '条件查询出直属子机构列表,分页展示,排序',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/childs`,
    },
    [OrgController.queryEmpExports.method]: {
      summary: '查询人员导出列表',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/emp-export/query`,
    },
    [OrgController.queryEmployeesInOrg.method]: {
      summary: '根据机构ID查询机构下的员工信息,分页展示',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/${payload.orgId}/employees`,
    },
    [OrgController.queryEmployeesInOrgs.method]: {
      summary: '根据机构查询机构下的员工信息,分页展示',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/org/employees`,
    },
    [OrgController.queryManagerInOrg.method]: {
      summary: '条件查询分级授权(二级管理员)信息',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/managers`,
    },
    [OrgController.queryOrgByIds.method]: {
      summary: '根据集合查询机构',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/array`,
    },
    [OrgController.queryOrgsByCriteria.method]: {
      summary: '条件查询机构信息',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs`,
    },
    [OrgController.queryOrgsWithPage.method]: {
      summary: '条件查询所有机构信息',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/all-org`,
    },
    [OrgController.queryPositionsInOrg.method]: {
      summary: '查询机构下员工的岗位信息,分页展示',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/${payload.orgId}/positions/${payload.employeeId}`,
    },
    [OrgController.queryPositionsToTree.method]: {
      summary: '按条件查询岗位，分页展示(树),机构管理员过滤',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/positions/tree`,
    },
    [OrgController.queryResourceInOrg.method]: {
      summary: '查询机构管理员管理的资源',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/${payload.orgId}/resource/${payload.resourceType}`,
    },
    [OrgController.queryRolesInOrg.method]: {
      summary: '查询机构下的角色,分页展示',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/${payload.orgId}/roles`,
    },
    [OrgController.queryRolesToTree.method]: {
      summary: '按条件查询角色，分页展示(树),机构管理员过滤',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/roles/tree`,
    },
    [OrgController.queryUsersByOrgId.method]: {
      summary: '根据机构ID查询机构下的用户信息,分页展示',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/${payload.orgId}/users`,
    },
    [OrgController.switchMainPositionInOrg.method]: {
      summary: '机构下的指定员工切换主岗位',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/${payload.orgId}/positions/switch`,
    },
    [OrgController.update.method]: {
      summary: '修改机构信息',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs`,
    },
    [OrgController.updatePositionsInOrg.method]: {
      summary: '机构下的指定员工添加岗位',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/orgs/${payload.orgId}/positions`,
    },
  },
}
