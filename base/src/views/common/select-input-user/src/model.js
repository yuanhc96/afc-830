import { EmployeeController, OrgController, RoleController, SelectionComponentController } from '@controller'
import { BaseVue } from '@lib'
// EmployeeController.queryEmployeesByTenantId,条件查询员工，分页展示
// SelectionComponentController.queryOrg, 机构根节点
// SelectionComponentController.queryChildByParentId 根据机构id查出子机构
// SelectionComponentController.queryEmployeeByOrg 根据机构id查询出当前机构下所有员工

export default {
  mixins: [BaseVue],
  data() {
    return {
      
    }
  },
  methods: {
    async getEmpByName(options) {
      const resp = await this.dispatch(EmployeeController.queryEmployeesByTenantId, options)
      if (!resp.error) {
        return resp.data && resp.data.data
      }
    },
    // 维度code查询机构s
    async getOrgs(options = {}) {
      let resp = await this.dispatch(SelectionComponentController.queryOrg, options)
      if (!resp.error) {
        resp.data = this.handlerType(resp.data, 'org')
        return resp.data
      }
    },
    async getSonOrgs(parentId) {
      let resp = await this.dispatch(SelectionComponentController.queryChildByParentId, {
        parentId
      })
      if (!resp.error) {
        resp.data = this.handlerType(resp.data, 'org')
        return resp.data
      }
    },
    // 高级查询
    async getorgsByCondition (options = {}) {
      let resp = await this.dispatch(OrgController.queryOrgsByCriteria, options)
      if (!resp.error) {
        resp.data = this.handlerType(resp.data, 'org')
        return resp.data
      }
    },
    async getOrgsByIds(ids) {
      let resp = await this.dispatch(OrgController.queryOrgByIds, ids)
      if (!resp.error) {
        resp.data = this.handlerType(resp.data, 'org')
        return resp.data
      }
    },
    // 根据机构id，查询人员
    async getSonEmp(orgId) {
      let resp = await this.dispatch(SelectionComponentController.queryEmployeeByOrg, {
        orgId
      })
      resp.data = resp.data.map(i => {
        return {
          ...i.employee,
          org: i.org,
          position: i.position,
          type: 'emp'
        }
      })
      return resp.data
    },

    // 根据角色查询角色下的员工,roleCodes，roleIds,code,name
    async getEmpByRolecode(options) {
      let resp = await this.dispatch(EmployeeController.queryEmployeesByRoleCode, options)
      if (!resp.error) {
        resp.data = this.handlerType(resp.data, 'emp')
        return resp.data
      }
    },

    // 根据员工id获取员工集合
    async getEmpByIds(options) {
      const resp = await this.dispatch(EmployeeController.queryEmployeesByIds, options)
      if (!resp.error) {
        return this.handlerType(resp.data, 'emp')
      }
    },

    // 根据机构orgIds查询机构下的员工信息,分页展示
    async getEmpByOrgs(options) {
      let resp = await this.dispatch(OrgController.queryEmployeesInOrgs, {
        isFirst: '1',
        ...options,
      })
      if (!resp.error) {
        resp.data.data = this.handlerType(resp.data.data, 'emp')
        return resp.data.data
      }
    },

    // 根据集合查询机构
    async getOrgsByIds(options) {
      const resp = await this.dispatch(OrgController.queryOrgByIds, {
        isFirst: '1', //不查询子机构
        ...options
      })
      if (!resp.error) {
        resp.data = this.handlerType(resp.data, 'org')
        return resp.data
      }
    },

    // 选人组件根据数组查询角色
    async getRolesByIds(options) {
      let resp = await this.dispatch(RoleController.queryRoleByIds, options)
      if (!resp.error) {
        let { data } = resp.data
        resp.data.data = this.handlerType(data, 'role')
        return resp
      }
    },
    handlerType(data, type) {
      return data.map(i => {
        return {
          ...i,
          type
        } 
      })
    }
  }
}