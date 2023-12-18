<template>


  <el-dialog
  title="选择父节点"
  :visible.sync="treeDialogVisible"
  width="800px"
  append-to-body
  :before-close="handleClose">
  
  <span v-if="currentNode" class="pb-20" style="color:#00A8FF;font-weight:bold">已选节点:{{currentNode.data.name}}</span>
  <div class="tree-list">
    <el-tree ref="tree-list" 
    :props="treeProp" 
    lazy 
    :load="loadTree" 
    :highlight-current="true" 
    :expand-on-click-node="false" 
    node-key="id" 
    :default-expanded-keys="['objectMenu']" 
    @node-click="nodeClick" 
   >
      <div
        slot-scope="{ node, data }"
        style="flex: 1"
        class="custom-tree-node"
      >
        <span>
          <icon v-if="data.menuIcon" :path="data.menuIcon"></icon>
          <i
            v-else
            :class="
              data.id === 'root'
                ? 'el-icon-files'
                : data.isLeaf === '1'
                ? 'el-icon-menu'
                : 'el-icon-folder-opened'
            "
          ></i>
          {{ node.label }}
        </span>
       
      </div>
    </el-tree>
    </div>
     <span slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="submitNode">确 定</el-button>
  </span>
</el-dialog>

</template>
<script>
import Icon from '@/components/Icon/icon'
import { MenuController } from '@controller'
import { BaseVue, List } from '@lib'
import Form from './form.vue'
export default {
  components: { Form , Icon},
  mixins: [BaseVue, List],
  props: {
    treeDialogVisible: {
        type:Boolean,
        default:false
    },
    businessObjId:{
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
  mounted(){

  },
  methods: {   
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
    
    
    nodeClick(data, node) {
      this.currentNode = node
      this.$emit('selectNode', data)
    },
    async  menuUpdate(data){
     data.parentId = data.pid
       let payload = {
            menu: {
              ...data
            },
        },
        resp = await this.dispatch(MenuController.update,payload);
        if (!resp.error) {
        this.$msg.success("转移成功!");
        this.$emit('success')       
        }
    },
    handleClose(){
      this.treeDialogVisible = false
      this.$emit('update:treeDialogVisible',this.treeDialogVisible)
    },
    cancel(){
      this.treeDialogVisible = false
      this.$emit('update:treeDialogVisible',this.treeDialogVisible)
    },
    submitNode(){
         this.$emit('submitNode', this.currentNode)
         this.treeDialogVisible = false
         this.$emit('update:treeDialogVisible',this.treeDialogVisible)
    }
     
  }
}
</script>
<style lang="scss" scoped>
::v-deep .tree-list .el-tree-node__content {
  height: 24px;
  line-height: 24px;
}
</style>
