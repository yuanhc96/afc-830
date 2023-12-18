<template>
  <div>
    <PmSecondaryMenu class="ml-20" :show-title="false" :offset-height="-30" :right-title="false">
      <div slot="left-body">
        <div v-if="!isOrgManager">
          <div class="org-bar">
            <el-select
              v-model="value"
              class="search-action"
              filterable
              reserve-keyword
              :remote-method="remoteMethod"
              :loading="loading"
              @change="handleChange"
            >
              <el-option
                v-for="(item, index) in gridList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <div class="pr-6" style="margin-top:-0.5px">
              <el-button
                style="height:28px"
                v-permission="FuncCode.afc_f_dimension_query"
                @click="openAdd"
              >维度维护</el-button>
            </div>
            <!-- <PmToolbar class="org-bar text-right pr-10">
                <PmToolbarItem
                  v-permission="FuncCode.afc_f_dimension_query"
                  @click="openAdd"
                >维度维护</PmToolbarItem>
              </PmToolbar> -->
          </div>
        </div>
        <!-- 加虚根，注释 -->
        <!-- <PmToolbarItem
              plain
              icon="el-icon-plus"
              class=" action-add"
              v-permission="FuncCode.afc_f_org_add"
              v-if="!isOrgManager"
              @click="action('add', null, 'dimension')"
              >新建组织机构</PmToolbarItem
            > -->
        <TreeFilterInput v-model="filterText" class="filter-input mt-10" placeholder="检索组织机构" />
        <el-tree
          v-if="nodestroyTree"
          ref="tree"
          v-loading="treeLoading"
          class="mt-10"
          lazy
          :load="loadNode"
          :data="treeData"
          :props="props"
          node-key="id"
          highlight-current
          :expand-on-click-node="false"
          :current-node-key="
            defaultExpanded.length > 0 ? defaultExpanded[0] : ''
          "
          data-testId="组织机构树"
          @node-click="handleNodeClick"
        >
          <TreeNode slot-scope="{ node, data }">
            <template slot="label">
              <span>{{ node.label }}</span>
            </template>
            <template slot="more">
              <el-dropdown
                size="medium"
                trigger="click"
                placement="bottom-start"
                @command="clickMoreButton"
              >
                <span class="el-dropdown-link">
                  <i class="el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown" size="medium" data-testId="组织机构树下拉菜单">
                  <el-dropdown-item
                    v-permission="FuncCode.afc_f_org_edit"
                    class="ml-10 mr-10"
                    icon="el-icon-edit"
                    :disabled="delDisable"
                    @click.native="action('edit', node)"
                  >编辑</el-dropdown-item>
                  <el-dropdown-item
                    v-permission="FuncCode.afc_f_org_add"
                    class="ml-10 mr-10"
                    icon="el-icon-plus"
                    :disabled="delDisable || isRef"
                    @click.native="action('add', node)"
                  >新建下级机构</el-dropdown-item>
                  <el-dropdown-item
                    v-if="node.data.type !== 'root'"
                    v-permission="FuncCode.afc_f_org_del"
                    class="ml-10 mr-10"
                    icon="el-icon-delete"
                    :disabled="delDisable"
                    command="removeNode"
                    @click.native="removeNode(node, data)"
                  >删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </TreeNode>
        </el-tree>
      </div>
      <div slot="right-body" class="pl-10 pr-20">
        <el-tabs v-model="activeName" @table-click="handleClick">
          <el-tab-pane v-if="showOrgInfo" lazy label="本级机构" name="first">
            <orgInfo
              ref="selfOrg"
              :dimension-data="dimensionData"
              :form-data="selectedOrg"
              @success="handleSuccess"
            />
          </el-tab-pane>
          <el-tab-pane lazy :label="secondLabel" name="second">
            <OrgList
              ref="orgList"
              class="mr-20"
              :is-ref="delDisable || isRef"
              :dimension-data="dimensionData"
              :org-data="selectedOrg"
              @success="handleSuccess"
            />
          </el-tab-pane>
          <el-tab-pane v-if="showEmp" lazy :label="employeeInfoLabel" name="employeeInfo">
            <employeeList
              class="mr-20"
              :dimension-data="dimensionData"
              :org-data="selectedOrg"
              :disabled="delDisable"
            />
          </el-tab-pane>
          <el-tab-pane v-if="showRole" lazy label="角色设置" name="third">
            <Role
              ref="role"
              class="mr-20"
              :func-code="funcCode"
              :dialogquery-fun="dialogqueryFun"
              :org-data="selectedOrg"
              :clearable="true"
              :enable-opt="enableOpt"
              :params="params"
              :api-name="apiName"
              height="calc(100vh - 214px)"
            />
          </el-tab-pane>
          <el-tab-pane v-if="showAuth" lazy label="分级管理设置" name="fourth">
            <AuthList class="mr-20" :org-data="selectedOrg" :tree="$refs.tree" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </PmSecondaryMenu>

    <el-dialog :visible.sync="dialogVisible" width="800px" top="60px" :title="`组织维度维护`">
      <dimensionList
        :visible="dialogVisible"
        @success="successHandler"
      />
      <template slot="footer">
        <el-button @click="dialogVisible=false">取消</el-button>
      </template>
    </el-dialog>
    <PmFormDialog
      :dialog-visible.sync="orgVisible"
      :title="`${actionType==='add' ? '新建' : '编辑'}组织机构`"
      :loading="btnloading"
      ok-text="确定"
      top="60px"
      width="800px"
    >
      <orgForm
        v-if="orgVisible"
        slot="form"
        :dialog-visible.sync="orgVisible"
        :loading.sync="btnloading"
        :form-data="formData"
        :org-data="orgData"
        :dimension-data="dimensionData"
        @updateLoading="(value)=>{btnloading=value}"
        @success="handleSuccess"
      />
    </PmFormDialog>
  </div>
</template>

<script>
// import Party from "./auth/party.vue";
import Role from '@/views/afcenter/user/components/roleComponent/index'
import { DimensionController, OrgController, TenantController } from '@controller'
import { BaseVue, List, _ } from '@lib'
import AuthList from './auth/list.vue'
import dimensionList from './dimension/list.vue'
import employeeList from './employee/index.vue'
import orgForm from './form.vue'
import orgInfo from './info.vue'
import OrgList from './list.vue'
export default {
  provide() {
    return {
      maindimensionId: this.getMainDimensionId,
      getDimensionData: this.getDimensionData,
      parentRef: this.$refs
    }
  },
  name: 'org',
  components: {
    Role,
    // Party,
    OrgList,
    AuthList,
    orgForm,
    employeeList,
    orgInfo,
    dimensionList,
  },
  mixins: [BaseVue, List],
  props: {},
  data() {
    return {

      actionType: 'add',
      btnloading: false,
      mainRefArr: [],
      disableArray: [],
      treeLoading: false,
      defaultDim: {},
      apiName: {
        query: 'OrgController.query',
        delete: 'OrgController.delete',
        create: 'OrgController.create',
      },
      params: {
        query: {},
        delete: {
          path: {},
          key: '',
        },
        create: {
          path: {},
          key: '',
        },
        status: '',
      },
      currentNode: {},
      defaultExpanded: [],
      nodestroyTree: false,
      selectedOrg: null,
      orgQuery: {
        pageIndex: 0,
        pageSize: 999,
        dimensionId: '',
        parentCode: '',
      },
      orgVisible: false,
      orgData: null,
      dimensionData: null,
      value: '', // 当前维度id
      options: [],
      loading: false,
      data: [],
      activeName: 'first',
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf',
      },
      query: {
        pageSize: 999,
      },
      filterText: '',
      treeData: [],
      initData: [],
      filterData: [],
      ExpandedKey: []
    }
  },
  computed: {
    showOrgInfo() {
      return this.selectedOrg && this.selectedOrg.type !== 'root'
    },
    showRole() {
      return this.dimensionData ? this.dimensionData.code == 'def_dimension' && this.selectedOrg && this.selectedOrg.type !== 'root' : false
    },
    isMainRoot() {
      return this.dimensionData && this.dimensionData.code == 'def_dimension' && this.selectedOrg && this.selectedOrg.type === 'root'
    },
    secondLabel() {
      return this.isMainRoot ? '全部机构' : '下级机构'
    },
    employeeInfoLabel() {
      return this.isMainRoot ? '全部员工' : '员工信息'
    },
    formData() {
      if (this.actionType == 'add') {
        return null
      } else {
        return this.selectedOrg
      }
    },
    funcCode() {
      return {
        add: this.FuncCode.afc_f_org_role_add,
        del: this.FuncCode.afc_f_org_role_del,
      }
    },
    height() {
      if (this.isOrgManager) {
        return 'calc(100vh - 259px)'
      } else {
        return 'calc(100vh - 281px)'
      }
    },
    showAuth() {
      if (this.dimensionData && this.dimensionData.code == 'def_dimension') {
        return this.selectedOrg && this.selectedOrg.orgLevel === '1'
      } else {
        return false
      }
    },
    showEmp() {
      // 其他维度的虚根不需要显示人员信息
      return !(this.dimensionData && this.dimensionData.code !== 'def_dimension' && this.selectedOrg && this.selectedOrg.type === 'root')
    },
    isRef() {
      return this.currentNode ? !!this.currentNode.mainDimensionOrgId : false || this.delDisable
    },
    formType() {
      if (this.orgData === null) {
        return 'add'
      } else {
        return 'edit'
      }
    },
    enableOpt() {
      if (this.dimensionData?.code !== 'def_dimension' || !this.selectedOrg) {
        return true
      } else {
        return false
      }
    },
    delDisable() {
      if (!this.currentNode || !this.$refs.tree) {
        return false
      }

      const node = this.$refs.tree.getNode(this.currentNode)
      if (!node) {
        return false
      } else {
        function iteraFun(node) {
          if (!node.parent) {
            return false
          } else if (node.parent?.data?.mainDimensionOrgId) {
            return true
          } else {
            return iteraFun(node.parent)
          }
        }
        return iteraFun(node)
      }
    },
    // 是否机构管理员
    isOrgManager() {
      return this.userInfo && this.userInfo.attributes && this.userInfo.attributes.isOrgManager
    }
  },
  watch: {
    showRole(value) {
      if (!value && this.activeName === 'third') {
        this.activeName = 'first'
      }
    },
    showAuth(value) {
      if (!value && this.activeName === 'fourth') {
        this.activeName = 'first'
      }
    },
    showEmp(value) {
      if (!value && this.activeName === 'employeeInfo') {
        this.activeName = 'first'
      }
    },
    dimensionData: {
      handler: function(value) {
        if (value && !this.nodestroyTree) {
          this.nodestroyTree = true
        } else {
          if (value) {
            this.nodestroyTree = false
            this.$nextTick(() => {
              this.nodestroyTree = true
            })
          }
        }
      },
    },
    selectedOrg: {
      immediate: true,
      handler: function(value) {
        if (value) {
          this.params.query = {
            orgId: value.id,
          }
          this.params.delete = {
            path: { orgId: value.id },
            key: 'roleIds',
          }
          this.params.create = {
            path: { orgId: value.id },
            key: 'roleIds',
          }
          this.params.statusKey = 'userId'
        } else {
          this.$refs.selfOrg && this.$refs.selfOrg.clearValidate()
        }
      },
    },
    orgVisible(value) {
      if (!value) {
        this.orgData = null
      }
    },
    filterText: {
      immediate: true,
      handler(val) {
        this.ExpandedKey = []
        if (!val || val.length >= 2) {
          this.treeLoading = true
          this.$set(this, 'treeData', [])
          // 防抖
          this.deb(this, val)
        }
      }
    }
  },
  created() {
    // window.$vue = this
  },
  async mounted() {
    await this.queryDimension()
    const defaultDim = this.options.find((i) => {
      return i.code === 'def_dimension'
    })
    this.defaultDim = defaultDim
    this.value = defaultDim.id
    this.dimensionData = defaultDim
  },
  methods: {
    // 添加、删除维度
    async successHandler(id) {
      await this.search()
      if (id) {
        if (id === this.value) {
          this.$nextTick(async() => {
            this.value = this.defaultDim.id
            const payload = {
              parentId: null,
              dimensionId: this.defaultDim.id,
              pageIndex: 0,
              pageSize: 999,
            }
            const resp = await this.searchOrg(payload)
            this.$nextTick(() => {
              resp.data.data.forEach((item) => {
                this.$refs.tree.root && this.$refs.tree.append(item, this.$refs.tree.root)
              })
            })
          })
        }
      }
    },
    async dialogqueryFun(param) {
      const nodeArr = this.$refs.tree.getNodePath(this.$refs['role'].orgData.id)
      let orgId = ''
      if (nodeArr.length) {
        orgId = nodeArr[0].id
      }
      const payload = { ...param, orgId }
      const resp = await this.$refs['role'].dispatch(OrgController.queryRolesToTree, payload)
      return resp
    },
    iteraTree() {
      const node = this.$refs.tree.getNode(this.currentNode.id)
      function iteraFun(node) {
        if (!node.parent) {
          return false
        } else if (node.parent.mainDimensionOrgId) {
          return true
        } else {
          iteraFun(node.parent)
        }
      }
      return iteraFun(node)
    },
    async removeHandler() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async() => {
          const resp = await this.dispatch(DimensionController.deleteByIds, [
            this.dimensionData.id,
          ])
          if (!resp.error) {
            this.dimensionData = { ...this.defaultDim }
            this.value = this.dimensionData.id
          }
        })
        .catch()
    },
    async handleSuccess(form, type) {
      const node =
        this.currentNode && Object.keys(this.currentNode).length > 0
          ? this.currentNode
          : this.selectedOrg
      let data
      if (node.data) {
        data = node.data
      } else {
        data = node
      }
      const { code, id, dimensionId } = data
      const payload = {
        parentId: this.selectedOrg.type !== 'root' ? id : null,
        dimensionId,
        pageIndex: 0,
        pageSize: 999,
      }
      const resp = await this.searchOrg(payload)
      // 添加子机构
      if (type === 'add') {
        if (!resp.error) {
          this.$refs.tree.updateKeyChildren(id, resp.data.data)
        }
      } else {
        // 机构编辑处理
        const node = this.$refs.tree.getNode(form.id)
        // 上级机构调整
        if (form.parentId !== 'orgRoot' && form.parentId !== node?.parent?.data?.id && form.orgLevel !== '0') {
          node.remove()
          this.$nextTick(() => {
            let nodeKey = null
            if (this.isOrgManager) {
              nodeKey = form.parentId
              if (!form.parentId) {
                this.initData = [form]
              }
            } else {
              nodeKey = form.parentId === 'orgRoot' ? null : form.parentId || this.initData[0].id
              if (form.parentId === 'orgRoot') {
                this.initData = [form]
              }
            }
            this.$refs.tree.append(form, nodeKey)
          })
        } else {
          if (this.currentNode?.data?.id === form.id) {
            this.selectedOrg = form
          }
          if (!this.currentNode) {
            this.selectedOrg = form
          }
          node.data = form
        }
      }
      this.$refs.orgList && this.$refs.orgList.search()
    },
    getMainDimensionId() {
      return this.options.find((i) => {
        return i.code == 'def_dimension'
      })
    },
    getDimensionData() {
      return this.dimensionData
    },
    // 查询维度
    async queryDimension() {
      await this.search()
      this.options = this.gridList
    },
    uniqWith(src, data) {
      const arr = [...src]
      arr.push(...data)
      const dupArr = _.uniqWith(arr, _.isEqual)
      return [...dupArr]
    },
    // 加载节点
    async loadNode(node, resolve) {
      // 机构的条件查询
      if (this.ExpandedKey.length) {
        if (!this.isOrgManager && node.level === 1 || this.isOrgManager && node.level === 0) {
          const nodes = this.filterData.filter(i => !i.parentId)
          return resolve(nodes)
        } else {
          const nodes = this.filterData.filter(i => i.parentId === node.data.id)
          return resolve(nodes)
        }
      }
      //  const arr = [...this.roleList]
      //     arr.push(...this.selections.unroleList)
      //     const dupArr = _.uniqWith(arr, _.isEqual)
      this.treeLoading = true
      await this.queryDimension()
      const defaultDim = this.options.find((i) => {
        if (this.value) {
          return i.id === this.value
        } else {
          return i.code === 'def_dimension'
        }
      })
      // 租户管理员的根节点为公司
      if (!this.isOrgManager && node.level === 0) {
        const resp = await this.dispatch(TenantController.findTenant, {
          id: this.currentTenant
        })
        if (!resp.error) {
          const nodeData = resp.data
          nodeData.id = 'tenant_' + nodeData.id
          nodeData.orgName = nodeData.orgName || '公司'
          this.initData = [{
            ...nodeData,
            tenantName: nodeData.name,
            name: nodeData.orgName,
            type: 'root',
            dimensionId: defaultDim.id,
            parentId: 'orgRoot',
            orgLevel: '0'
          }]
          this.treeLoading = false
          this.$nextTick(async() => {
            const cunrrent = await this.$refs.tree.getNode(nodeData.id)
            this.$refs.tree.setCurrentNode(cunrrent.data)
            this.handleNodeClick(cunrrent.data, cunrrent)
          })
          return resolve(this.initData)
        }
      } else if (!this.isOrgManager && node.level === 1 || this.isOrgManager && node.level === 0) {
        const query = {
          ...this.orgQuery,
          dimensionId: defaultDim.id,
          parentId: null,
        }
        const resp = await this.dispatch(
          OrgController.queryChildOrgsWithPage,
          query
        )
        this.treeLoading = false
        if (!resp.error) {
          this.data = resp.data.data
          if (this.isOrgManager) {
            this.initData = this.data
            this.$nextTick(async() => {
              const cunrrent = await this.$refs.tree.getNode(this.initData[0].id)
              this.$refs.tree.setCurrentNode(cunrrent.data)
              this.handleNodeClick(cunrrent.data, cunrrent)
            })
          }
          return resolve(this.data)
        }
        return resolve([])
      } else {
        const { id, dimensionId } = node.data
        const payload = {
          parentId: id,
          dimensionId,
          pageIndex: 0,
          pageSize: 999,
        }
        const resp = await this.searchOrg(payload)
        this.treeLoading = false
        if (!resp.error) {
          return resolve(resp.data.data)
        }
      }
    },
    // 条件查询树
    deb: _.debounce(
      (_that, val) => {
        if (!_that.filterText.length || !val) {
          _that.$set(_that, 'treeData', _that.initData)
          _that.treeLoading = false
        } else if (val.length >= 2) {
          _that.filterTreeData(val)
        }
      },
      300, // 延迟时间
    ),
    async filterTreeData(val) {
      this.treeLoading = true
      const resp = await this.dispatch(OrgController.queryAllOrgsToTree, {
        dimensionId: this.value,
        name: val,
        pageIndex: -1,
        pageSize: -1
      })
      this.treeLoading = false
      if (!resp.error) {
        // if (!resp.data.length) {
        //   return this.$set(this, 'treeData', [])
        // }
        const treeRoot = resp.data.filter(i => !i.parentId)
        const treeData = [{
          ...this.initData[0],
          children: treeRoot
        }]
        this.filterData = resp.data
        const handlerTreeData = (item) => {
          item.id && this.ExpandedKey.push(item.id)
          item.children.forEach(i => {
            this.filterData.forEach(j => {
              if (j.parentId && j.parentId === i.id) {
                if (!i.children) i.children = []
                i.children.push(j)
              }
            })
            if (i.children && i.children.length) {
              i = handlerTreeData(i)
            } else {
              i.leaf = true
            }
          })
          return item
        }
        if (!this.isOrgManager) {
          treeData[0] = handlerTreeData(treeData[0])
        } else {
          handlerTreeData({ children: treeRoot })
          this.ExpandedKey.push(treeRoot[0].id)
        }
        this.$set(this, 'treeData', this.initData)
        this.$nextTick(async() => {
          await this.ExpandedKey.forEach(item => {
            this.$refs.tree.getNode(item).expand()
          })
        })
      }
    },
    // 查询组织机构
    async searchOrg(payload) {
      const resp = await this.dispatch(
        OrgController.queryChildOrgsWithPage,
        payload
      )
      return resp
    },
    async queryOrgs(query) {
      const resp = await this.dispatch(
        OrgController.queryChildOrgsWithPage,
        query
      )
      if (!resp.error) {
        this.data = resp.data.data
      }
    },
    action(type, node, level) {
      this.actionType = type
      this.orgVisible = true
      this.currentNode = node.data.type === 'root' ? null : node
      const data = node ? { ...node.data } : null
      data && delete data.zones
      if (node.data.type === 'root') {
        this.orgData = data
      } else if (type === 'edit') {
        // this.orgData = node.data;
        this.selectedOrg = data
      } else if (level === 'second') {
        this.selectedOrg = data
      } else if (type === 'add') {
        this.orgData = data
      }
    },
    handleAddNode(form) {
      if (this.formType === 'add') {
        this.$refs.tree.append(form, this.$refs.tree.root)
      }
    },
    updateNodeChildren(chilren) {
      this.$refs.tree.updateKeyChildren(this.currentNode.id, chilren)
    },
    async removeNode(node, data) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async() => {
          const resp = await this.dispatch(OrgController.deleteByIds, [
            data.id,
          ])
          if (!resp.error) {
            this.$msg.success('删除成功!')
            this.orgData = null
            this.selectedOrg = null
            this.$refs.tree.remove(node)
            const parent = node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex((d) => d.id === data.id)
            children.splice(index, 1)
          }
        })
        .catch(() => {})
    },
    handleChange(value) {
      this.dimensionData = this.gridList.find((i) => {
        return i.id === value
      })
      this.$refs.selfOrg.clearValidate()
      this.selectedOrg = null
      this.disableArray = []
    },
    // 查询
    async searchBody() {
      const resp = await this.dispatch(
        DimensionController.queryDimensionsWithPage,
        { pageSize: 999, pageIndex: 0, name: this.query.name }
      )
      return resp
    },
    // 远程搜索
    async remoteMethod(query) {
      if (query !== '') {
        this.query.name = query
        this.loading = true
        await this.search()
        this.options = this.gridList
        this.loading = false
      } else {
        this.options = []
      }
    },
    handleClick() {},
    handleNodeClick(nodeData, node) {
      // 上级机构
      if (nodeData.type === 'root') {
        this.activeName = 'second'
      } else {
        this.activeName = 'first'
      }
      if (node.parent.data) {
        this.orgData = { ...node.parent.data }
      } else {
        this.orgData = { ...nodeData }
      }
      const copy = { ...nodeData }
      this.currentNode = nodeData
      delete copy.zones
      this.selectedOrg = copy
    },
  },
}
</script>
<style lang="scss" scoped>
.search-action {
  width: 160px;
}
.form-item {
  font-size: 14px;
  margin: 0 auto;
  margin-bottom: 10px;
  line-height: 28px;
  .form-label {
    vertical-align: middle;
    float: left;
  }
  width: 400px;
  .form-content {
    position: relative;
    margin-left: 60px;
    width: 100%;
    border-bottom: 1px solid #eee;
    height: 30px;
    font-weight: 400px;
  }
}
.org-bar {
  border: none;
  height: 40px;
  line-height: 40px;
  font-weight: 700;
  display:flex;
  span {
    font-size: 14px;
    padding-left: 6px;
    padding-right: 4px;
  }
}
.action-add{
  border-color: var(--tagBg);
  color: var(--tagBg);
  margin: 5px;
  width:calc(100% - 10px)
}
::v-deep .secondary-menu .left .body{
  border-top:none;
}
.filter-input {
}
</style>
