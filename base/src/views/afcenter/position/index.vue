<template>
  <div class="position-manage">
    <pm-secondary-menu class="ml-20" :offset-height="27" :showTitle="false" :right-title="false">
      <div slot="left-body" class="layout-left">
        <TreeFilterInput
          v-model="filterText"
          placeholder="检索岗位类型"
        />
        <el-tree
          ref="tree"
          v-loading="PositionController.queryPositionTypes.loading"
          class="tree mt-10"
          :props="props"
          :data="data"
          highlight-current
          node-key="id"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
        >
          <TreeNode slot-scope="{ node,data }">
            <template slot="label">
              <el-tooltip :open-delay="1000" :disabled="!data.description" :content="data.description">
              <span> {{ node.label }}</span>
              </el-tooltip>
                <span> ({{data.code}})</span>
            </template>
          </TreeNode>
        </el-tree>
      </div>
      <div slot="right-body">
        <position-list class="pl-10 pr-20" :position-type="selectNode?selectNode.id:''" />
      </div>
    </pm-secondary-menu>
  </div>
</template>
<script>
import { PositionController } from '@controller'
import { BaseVue, VueUtil } from '@lib'
import employeeList from './employee/list'
import positionList from './list.vue'
export default {
  name: 'position',
  components: { 'position-list': positionList, 'employee-list': employeeList },
  mixins: [BaseVue], // 和菜单代码一致即可开启页面缓存
  data() {
    return {
      filterText: '',
      actionType: '',
      positionType: '',
      activeName: 'first',
      currentComponent: '',
      defaultIds: [],
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf',
      },
      selectNode: null,
      info: {},
      nodeData: null,
      data: [],
      query: {
        pageSize: 10,
        pageIndex: 0,
      },
    }
  },
  watch: {
    selectNode: {
      handler(value) {
        if (value) {
          this.info = { ...value }
        }
      }
    },
    filterText(val) {
      this.$refs.tree.filter(val.trim())
    },
  },
  created() {},
  mounted() {
    this.searchBody()
  },
  computed: {
    ...VueUtil(this)
      .select([PositionController])
      .state(),
    nodeForm() {
      if (this.actionType === 'add') {
        return null
      } else {
        return this.selectNode
      }
    }
  },
  methods: {
    handleNodeClick(data) {
      this.selectNode = { ...data }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 岗位分类 查询
    async searchBody() {
      const resp = await this.dispatch(PositionController.queryPositionTypes, { ...this.query })
      if (!resp.error) {
        this.data = resp.data.data
        if (this.data.length) {
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(this.data[0].id)
            this.selectNode = { ...this.data[0] }
          })
        }
      }
    },
    // 岗位类型 删除
    async removeNode(node, data) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async() => {
          const resp = await this.dispatch(PositionController.deletePositionTypes, { id: data.id })
          if (!resp.error) {
            this.$msg.success('删除成功!')
            this.searchBody()
          }
        })
        .catch(() => {
        })
    },
  },
}
</script>
<style scoped lang="scss">
 .position-manage{
   .secondary-menu {
     height: calc(100vh - 62px) !important;
   }
   .form-item{
     font-size:14px;
     margin: 0 auto;
     line-height: 28px;
     .form-label{
       vertical-align: middle;
       float: left;
     }
     width: 400px;
     .form-content{
       position: relative;
       margin-left:60px;
       width: 100%;
       border-bottom: 1px solid #eee;
       height: 30px;
       font-weight: 400px;
     }
   }
    
 }
 ::v-deep .secondary-menu .left .body {
       border-top:none;
    }
</style>
