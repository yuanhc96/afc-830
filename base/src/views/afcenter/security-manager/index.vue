<template>
  <div>
    <PmSecondaryMenu :offset-height="-30" :show-title="false" :right-title="false">

      <div slot="left-body" class="ml-20 ">
        <div class="org-bar">
          <el-select
            v-model="value"
            class="search-action mt-10 mb-10"
            filterable
            reserve-keyword
            placeholder="请输入关键词"
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
        </div>
        <TreeFilterInput
          v-model="filterText"
          class="filter-input"
          placeholder="检索组织结构"
        />
        <el-tree
          v-if="nodestroyTree"
          ref="tree"
          v-loading="treeLoading"
          class="mt-10"
          lazy
          :load="loadNode"
          :default-expanded-keys="defaultExpandedKeys"
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
          </TreeNode>
        </el-tree>
      </div>
      <div slot="right-body" class="pl-10 pr-20  pb-20">
        <!-- employeeList -->
        <List
          :dimension-data="dimensionData"
          :org-data="selectedOrg"
          :disabled="delDisable"
        />
      </div>
    </PmSecondaryMenu>
  </div>
</template>

<script>
// import Party from "./auth/party.vue";

import {
  DimensionController,
  OrgController,
  TenantController,
} from '@controller'
import { BaseVue, List, _ } from '@lib'
import Employee from './list.vue'

export default {
  provide() {
    return {
      maindimensionId: this.getMainDimensionId,
      getDimensionData: this.getDimensionData,
      parentRef: this.$refs,
    }
  },
  name: 'org',
  components: { List: Employee },
  mixins: [BaseVue, List],
  props: {},
  data() {
    return {
      nodestroyTree: false,
      defaultDim: {},
      currentNode: {},
      orgData: null,
      defaultExpanded: [],
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf',
      },
      treeData: [],
      initData: [],
      filterData: [],
      treeLoading: false,
      ExpandedKey: [],
      filterText: '',
      selectedOrg: null,
      value: '', // 当前维度id
      query: {
        pageSize: 999,
        loading: false,
        options: [],
        dimensionData: null,
      },
      dimensionData: null,
      defaultExpandedKeys: []
    }
  },
  computed: {
    funcCode() {
      return {
        add: this.FuncCode.afc_f_org_role_add,
        del: this.FuncCode.afc_f_org_role_del,
      }
    },
    // 是否机构管理员
    isOrgManager() {
      return (
        this.userInfo &&
        this.userInfo.attributes &&
        this.userInfo.attributes.isOrgManager
      )
    },
  },
  watch: {
    // selectedOrg(){
    //   console.trace("demo")
    //   debugger

    // },
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
      },
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
    // 查询组织机构
    async searchOrg(payload) {
      const resp = await this.dispatch(
        OrgController.queryChildOrgsWithPage,
        payload
      )
      return resp
    },
    // 查询
    async searchBody() {
      const resp = await this.dispatch(
        DimensionController.queryDimensionsWithPage,
        { pageSize: 999, pageIndex: 0, name: this.query.name }
      )
      return resp
    },
    async filterTreeData(val) {
      this.treeLoading = true
      const resp = await this.dispatch(OrgController.queryAllOrgsToTree, {
        dimensionId: this.value,
        name: val,
        pageIndex: -1,
        pageSize: -1,
      })
      this.treeLoading = false
      if (!resp.error) {
        // if (!resp.data.length) {
        //   return this.$set(this, 'treeData', [])
        // }
        const treeRoot = resp.data.filter((i) => !i.parentId)
        const treeData = [
          {
            ...this.initData[0],
            children: treeRoot,
          },
        ]
        this.filterData = resp.data
        const handlerTreeData = (item) => {
          item.id && this.ExpandedKey.push(item.id)
          item.children.forEach((i) => {
            this.filterData.forEach((j) => {
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
          await this.ExpandedKey.forEach((item) => {
            this.$refs.tree.getNode(item).expand()
          })
        })
      }
    },
    deb: _.debounce(
      (_that, val) => {
        if (!_that.filterText.length || !val) {
          _that.$set(_that, 'treeData', _that.initData)
          _that.treeLoading = false
        } else if (val.length >= 2) {
          _that.filterTreeData(val)
        }
      },
      300 // 延迟时间
    ),
    handleNodeClick(nodeData, node) {
      // 上级机构
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
    // 查询维度
    async queryDimension() {
      await this.search()
      this.options = this.gridList
    },
    // 加载节点
    async loadNode(node, resolve) {
      // 机构的条件查询
      if (this.ExpandedKey.length) {
        if (
          (!this.isOrgManager && node.level === 1) ||
          (this.isOrgManager && node.level === 0)
        ) {
          const nodes = this.filterData.filter((i) => !i.parentId)
          return resolve(nodes)
        } else {
          const nodes = this.filterData.filter(
            (i) => i.parentId === node.data.id
          )
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
          id: this.currentTenant,
        })
        if (!resp.error) {
          const nodeData = resp.data
          nodeData.id = 'tenant_' + nodeData.id
          this.defaultExpandedKeys.push(nodeData.id)
          nodeData.orgName = nodeData.orgName || '公司'
          this.initData = [
            {
              ...nodeData,
              tenantName: nodeData.name,
              name: nodeData.orgName,
              type: 'root',
              dimensionId: defaultDim.id,
              parentId: 'orgRoot',
              orgLevel: '0',
            },
          ]
          this.treeLoading = false
          this.$nextTick(async() => {
            const cunrrent = await this.$refs.tree.getNode(nodeData.id)
            this.$refs.tree.setCurrentNode(cunrrent.data)
            this.handleNodeClick(cunrrent.data, cunrrent)
          })
          return resolve(this.initData)
        }
      } else if (
        (!this.isOrgManager && node.level === 1) ||
        (this.isOrgManager && node.level === 0)
      ) {
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
              const cunrrent = await this.$refs.tree.getNode(
                this.initData[0].id
              )
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
    handleChange(value) {
      this.dimensionData = this.gridList.find((i) => {
        return i.id === value
      })
      this.$refs.selfOrg.clearValidate()
      this.selectedOrg = null
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
  },
}
</script>
<style lang="scss" scoped>
.filter-input {
  margin-top:0px
}
.search-action {
  width: 100%;
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
  font-weight: 700;
  span {
    font-size: 14px;
    padding-left: 6px;
    padding-right: 4px;
  }
}
.action-add {
  border-color: var(--tagBg);
  color: var(--tagBg);
  margin: 5px;
  width: calc(100% - 10px);
}

::v-deep .org-bar .el-input__inner{
  height: 32px;
}
</style>
