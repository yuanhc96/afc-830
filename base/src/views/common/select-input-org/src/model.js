import { EmployeeController, OrgController, SelectionComponentController } from '@controller'
import { BaseVue } from '@lib'
// EmployeeController.queryEmployeesByTenantId,条件查询员工，分页展示
// SelectionComponentController.queryOrg, 机构根节点
// SelectionComponentController.queryChildByParentId 根据机构id查出子机构
// SelectionComponentController.queryEmployeeByOrg 根据机构id查询出当前机构下所有员工
// OrgController.queryOrgByIds 根据id集合查询机构

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
    async getOrgs(options = {}) {
      const resp = await this.dispatch(SelectionComponentController.queryOrg, options)
      if (!resp.error) {
        return resp.data
      }
    },
    async getSonOrgs(parentId) {
      const resp = await this.dispatch(SelectionComponentController.queryChildByParentId, {
        parentId
      })
      if (!resp.error) {
        return resp.data
      }
    },
    // 高级查询
    async getorgsByCondition (options = {}) {
      const resp = await this.dispatch(OrgController.queryOrgsByCriteria, options)
      if (!resp.error) {
        return resp.data
      }
    },
    // 根据集合查询机构
    async getOrgsByIds(options) {
      const resp = await this.dispatch(OrgController.queryOrgByIds, {
        isFirst: '1', //不查询子机构
        ...options
      })
      if (!resp.error) {
        return resp.data
      }
    }
  }
}