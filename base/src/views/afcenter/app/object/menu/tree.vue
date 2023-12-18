<template>
  <div class="tree-list">
    <el-tree ref="tree-list" :props="treeProp" lazy :load="loadTree" :highlight-current="true"
      :expand-on-click-node="false" node-key="id" :default-expanded-keys="['objectMenu']" @node-click="nodeClick">
      <div slot-scope="{ node, data }" style="flex: 1" class="custom-tree-node" @mouseover="mouseover(data)"
        @mouseleave="mouseout(data)">
        <span>
          <icon v-if="data.menuIcon" :path="data.menuIcon"></icon>
          <i v-else
            :class="data.id === 'objectMenu' ? 'el-icon-files' : (data.isLeaf === '1' ? 'el-icon-menu' : 'el-icon-folder-opened')"></i>
          {{ node.label }}
        </span>
        <span v-show="data.dropdownShow" class="pr-10" style="float:right ">
          <el-dropdown size="medium" trigger="click" placement="bottom-start" @command="clickMoreButton">
            <span class="el-dropdown-link">
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu size="medium" slot="dropdown">
              <el-dropdown-item v-if="data && data.isLeaf === '0'" class="ml-10 mr-10" icon="el-icon-plus"
                command="updateNode" @click.native="openAdd()">新建子菜单
              </el-dropdown-item>
              <el-dropdown-item class="ml-10 mr-10" icon="el-icon-delete" command="removeNode"
                @click.native="removeNode()">删除
              </el-dropdown-item>
              <el-dropdown-item class="ml-10 mr-10" icon="el-icon-refresh" command="removeNode"
                @click.native="refreshNode">刷新
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </div>
    </el-tree>

    <pm-form-dialog width="860px" :title="`新建菜单`" :dialog-visible.sync="dialogVisible" okText="确定">
      <Form slot="form" :params="params" :appId="appId" :businessObjId="businessObjId" v-if="dialogVisible" />
    </pm-form-dialog>
  </div>
</template>
<script>
import { MenuController } from '@controller'
import { BaseVue, List, VueUtil } from '@lib'
// import Criteria from './criteria.js'
import Icon from '@/components/Icon/icon'
import Form from './form.vue'
export default {
  components: { Form , Icon},
  mixins: [BaseVue, List],
  props: {
    businessObjId:{
      type: String,
      default: null,
    },
    appId:{
      type: String,
      default: null,
    },
  },
  data() {
    return {
      treeProp: {
        label: 'name',
        children: 'children',
        isLeaf: (data,node) =>{
            if(data.isLeaf === '0'){ // 根据需要进行条件判断添加is-leaf类名
              return false
            }else{
              return true
            }
          }
      },
      currentNode: null,
      node: null,
      resolve: null,
      dialogVisible: false,
      dropdownShow:false,
      rootTreedata:{
        id: "objectMenu",
        code: "objectMenuTree",
        isLeaf: "0",
        name: "业务对象菜单树",
        sortNo: 1,
        treeLevel: 1,
        tenantId: this.currentTenant
      }
    }
  },
  computed: {
    ...VueUtil(this)
      .select([MenuController])
      .state(),
    params() {
      if (this.currentNode) {
        return {
          appMenu: {
            menuid: this.currentNode.data.id
          }
        }
      } else {
        return null
      }
    }
  },
  watch: {
    'MenuController.create': 'refreshNode',
    'MenuController.update': 'refreshParentNode',
    'MenuController.deleteByIds': 'refreshParentNode',
    'MenuController.updateParentId':{
      handler(){
          this.refreshNode({})
          this.refreshParentNode({})
      }
    }
  },
  mounted() {},
  methods: {   
    openAdd() {
      this.dialogVisible = true
    },
    refreshNode(tag) {
if (!tag.loading) {
        this.currentNode.loaded = false
        this.currentNode.expand()
      }
    },
    refreshParentNode(tag) {
      if (!tag.loading) {
        this.currentNode.parent.loaded = false
        this.currentNode.parent.expand()
      }
    },
    async loadTree(node, resolve) {      
      this.node = node
      this.resolve = resolve
      let query= {
       pageIndex:0,
       pageSize:999,
       menuType:'businessObject',
       businessObjId:this.businessObjId,
       orderFields: 'sortNo',
       orderDirection: 'ASC',
     }
      if (node && node.data && node.data.id ) {
       query.parentId = node.data.id
      }
     const menus = await this.dispatch(MenuController.queryMenusByCriteria,query)
     
     if ( node && node.data && node.data.id) {  
         resolve(menus.data.data)
      } else {
        const rootData = this.rootTreedata;
        resolve([rootData])
        this.$nextTick(() => {
        this.$refs['tree-list'].setCurrentKey(rootData.id)
        this.$emit('selectNode', rootData)
        this.currentNode= this.$refs['tree-list'].getNode(rootData.id)
        })
      }
     
    },
    // 右键点击
    rightClick(MouseEvent, object, node, element) {
      // debugger
      // 鼠标右击触发事件
      this.currentNode = node
      this.$emit('selectNode', node.data)
      this.$refs['tree-list'].setCurrentKey(node.data.id)
    },
    nodeClick(data, node) {
      console.log(node,'node')
      this.currentNode = node
      this.$emit('selectNode', data)
    },
    async removeNode() {
      this.confirm('确定要删除吗?').then(async() => {
      let payload = [this.currentNode.data.id]
        const resp = await this.dispatch(MenuController.deleteByIds, payload)
        if (!resp.error) {
          this.currentNode.parent.loaded = false
          this.currentNode.parent.expand()
          // this.currentNode = null
          // this.$emit('nodeClick', null)
          //  let payload = {
          //     pageIndex:0,
          //     pageSize:-1,
          //   }
          //const menus = await this.dispatch(MenuController.queryMenusByCriteria,payload)
          const rootData = this.rootTreedata;
          this.$nextTick(() => {
            this.$refs['tree-list'].setCurrentKey(rootData.id)
            this.$emit('selectNode', rootData)
          })
           
        }
      })
    },
    //鼠标事件
    mouseover (data) { // 移入
      this.$set(data, 'dropdownShow', true)
    },
    mouseout (data) { // 移除
      this.$set(data, 'dropdownShow', false)
    },
  }
}
</script>
<style lang="scss" scoped>
.tree-list {
  width: 220px;
  height: calc(100vh - 160px);
  overflow-y: auto;
  .custom-tree-node {
    width: 100%;
  }
}
::v-deep .tree-list .el-tree-node__content {
  height: 24px;
  line-height: 24px;
}
</style>
