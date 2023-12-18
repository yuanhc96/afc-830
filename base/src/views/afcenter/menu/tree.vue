<template>
  <div class="tree-list">
    <el-tree
      ref="tree-list"
      :props="treeProp"
      lazy
      :load="loadTree"
      :highlight-current="true"
      :expand-on-click-node="false"
      node-key="id"
      :default-expanded-keys="['root','appRoot']"
      @node-click="nodeClick"
    >
      <div
        slot-scope="{ node, data }"
        style="flex: 1"
        class="custom-tree-node"
        @mouseover="mouseover(data)"
        @mouseleave="mouseout(data)"
      >
     
        <span class="span-over" :title="node.label">
          <!-- <icon v-if="data.menuIcon" :path="data.menuIcon"></icon> -->
          <pm-icon v-if="data.menuIcon" :value="data.menuIcon"></pm-icon>
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
        <span v-show="data.dropdownShow" class="pr-10" style="float: right;margin-top: 10px;">
          <el-dropdown
            size="medium"
            trigger="click"
            placement="bottom-start"
            @command="clickMoreButton"
          >
            <span class="el-dropdown-link">
              <i class="el-icon-more"></i>
              <!-- <i v-if="data.id != 'root'"  class="el-icon-thumb"></i> -->
            </span>
            <el-dropdown-menu size="medium" slot="dropdown">
              <el-dropdown-item
                v-if="data && data.isLeaf === '0'"
                class="ml-10 mr-10"
                icon="el-icon-plus"
                command="updateNode"
                @click.native="openAdd()"
                >新建子菜单
              </el-dropdown-item>
              <el-dropdown-item
                class="ml-10 mr-10"
                icon="el-icon-delete"
                command="removeNode"
                @click.native="removeNode()"
                >删除
              </el-dropdown-item>
              <el-dropdown-item
                class="ml-10 mr-10"
                icon="el-icon-refresh"
                command="removeNode"
                @click.native="refreshNode"
                >刷新
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </div>
    </el-tree>

    <pm-form-dialog
      width="860px"
      :title="`新建菜单`"
      data-testId="UITest-dialog-新建菜单"
      :dialog-visible.sync="dialogVisible"
      okText="确定"
    >
      <Form slot="form" :mark="mark" :params="params" :isMobileLeaf="isMobileLeaf" v-if="dialogVisible" />
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
  props:['mark'],
  inject: ["currentAppId"],
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
        id: "root",
        code: "appMenuTree",
        isLeaf: "0",
        name: this.mark ==='mobile' ? '移动端菜单树' : 'pc端菜单树',
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
    },
    isMobileLeaf(){
      return (
        this.mark==='mobile' && this.currentNode && this.currentNode.data.isLeaf === '0' && this.currentNode.parent.data && this.currentNode.parent.data.id==="root"
      );
    },
    appId() {
      return (this.$route.query ? this.$route.query.appId : null) || this.currentAppId || null
    },
    ...VueUtil(this)
      .select([ MenuController])
      .state(),

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
  mounted(){
    this.rootTreedata.id = this.appId ? "appRoot" : "root"
  },
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
      let  menuType = null
      if(this.appId){
        menuType = this.mark && this.mark === 'mobile' ? 'mobile' : 'pc' 
      }else{
         menuType = this.mark && this.mark === 'mobile' ? 'mobile' : null 
      }
      
      let query= {
       pageIndex:0,
       pageSize:-1,
       orderFields: 'sortNo',
       orderDirection: 'ASC',
       tenantId:this.currentTenant,
       appId:this.appId || null,
       menuType,
     }
      if (node && node.data && node.data.id ) {
       query.parentId = node.data.id
      }
     const menus = await this.dispatch(MenuController.queryMenusByCriteria,query)
     
     if ( node && node.data && node.data.id) {  
       if(this.mark === 'mobile'){
        resolve(menus.data.data)
       }else{
        resolve(menus.data.data.filter(menu=>menu.menuType !== 'mobile'))
       }
      } else {
        // let payload ={id:'root'}
        // const resp = await this.dispatch(MenuController.findMenu, payload);
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
           let payload = {
              pageIndex:0,
              pageSize:-1,
            }
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
    allowDrag(draggingNode) { 
      return draggingNode.data.id!=='root';
    },
    allowDrop(draggingNode, dropNode, type) {
      if(type != 'inner' && dropNode.data.id==='root' ){
        return false
      }else if(type == 'inner' && dropNode.data.isLeaf=='1'){
        return false
      }else{
        return true
      }
    },
   async handleDrop(draggingNode,dropNode,dropType,ev){ 
          var paramData = []
          var data = dropType != "inner" ? dropNode.parent.data : dropNode.data
          var nodeData = dropNode.level == 1 && dropType != "inner" ? data : data.children
          nodeData.forEach(element => {
            //element.pid = dropNode.level == 1 ? "" : data.id
            element.pid =  data.id
          })
          nodeData.forEach((element, i) => {
            var dept = {
              ...element
            };
           paramData.push(dept)
         })
       for(var item of paramData){
       await this.menuUpdate(item)
       } 
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
    }
     
  }
}
</script>
<style lang="scss" scoped>
.tree-list {
  width: 220px;
  overflow-y: auto;
  .custom-tree-node {
    width: 100%;
  }
}
::v-deep .tree-list .el-tree-node__content {
  height: 24px;
  line-height: 24px;
}
.span-over {
      overflow: hidden; 
      text-overflow: ellipsis; 
      -o-text-overflow: ellipsis;
      white-space:nowrap;
      width:75%;
      display:inline-block;
      margin-top: 10px;
}
</style>
