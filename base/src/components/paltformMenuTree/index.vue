<template>
  <el-dialog
    title="选择平台菜单"
    :visible.sync="treeDialogVisible"
    width="500px"
    height="380px"
    append-to-body
    :before-close="handleClose"
  >
    <div style="height:380px;overflow:auto;font-size:15px">
      <div class="tree-list">
        <el-tree
          ref="tree-list"
          :props="treeProp"
          show-checkbox
          lazy
          :load="loadTree"
          :highlight-current="true"
          :expand-on-click-node="false"
          node-key="id"
          :default-expanded-keys="['root','appRoot']"
          @node-click="nodeClick"
          @check-change="handleCheckChange"

        >
          <div
            slot-scope="{ node, data }"
            style="flex: 1"
            class="custom-tree-node"
          >
            <span>
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
              />
              {{ node.label }}
            </span>

          </div>
        </el-tree>
      </div>
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
export default {
  components: { Icon },
  mixins: [BaseVue, List],
  props: {
    treeDialogVisible: {
      type: Boolean,
      default: false
    },
    selectMenus: {
      type: Object,
      default: []
    },
    mark:{},
  },
  inject: ["currentAppId"],
  data() {
    return {
      treeProp: {
        label: 'name',
        children: 'children',
        isLeaf: (data, node) => {
          if (data.isLeaf === '0') { // 根据需要进行条件判断添加is-leaf类名
            return false
          } else {
            return true
          }
        }
      },
      message: '',
      currentNode: null,
      node: null,
      resolve: null,
      dialogVisible: false,
      dropdownShow: false,
      rootTreedata: {
        id: 'root',
        code: 'appMenuTree',
        isLeaf: '0',
        name: '应用菜单树',
        sortNo: 1,
        treeLevel: 1,
        tenantId: this.currentTenant
      },
      selectNodes: [],
      

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
    appId() {
      return (this.$route.query ? this.$route.query.appId : null) || this.currentAppId || null
    }
  },
  mounted() {
    console.log('mounted---')
    this.rootTreedata.id = this.appId ? "appRoot" : "root"
    this.message = `将所选择的[${this.selectMenus[0].name}]等${this.selectMenus.length}个菜单移到`
  },
  methods: {
    async loadTree(node, resolve) {
      this.node = node
      this.resolve = resolve
      let  menuType = null
      if(this.appId){
        menuType = this.mark && this.mark === 'mobile' ? 'mobile' : 'pc' 
      }else{
        menuType = this.mark && this.mark === 'mobile' ? 'mobile' : null 
      }
      const query = {
        pageIndex: 0,
        pageSize: 999,
        orderFields: 'sortNo',
        orderDirection: 'ASC',
        tenantId: this.currentTenant,
        menuType,
        appId:this.appId || null,
      }
      if (node && node.data && node.data.id) {
        query.parentId = node.data.id
      }
      const menus = await this.dispatch(MenuController.queryMenusByCriteria, query)

      if (node && node.data && node.data.id) {
        if(this.mark === 'mobile'){
          resolve(menus.data.data)
        }else{
          resolve(menus.data.data.filter(menu=>menu.menuType !== 'mobile'))
        }
      } else {
        const rootData = this.rootTreedata
        resolve([rootData])
        this.$nextTick(() => {
          this.$refs['tree-list'].setCurrentKey(rootData.id)
          this.currentNode = this.$refs['tree-list'].getNode(rootData.id)
        })
      }
    },

    nodeClick(data, node) {
      if(this.mark==='mobile' && node && node.data.parentId !== 'root' && node.data.isLeaf === '1'){
        //mobile 的叶子节点 不能把其他节点放到此节点下
        this.$refs['tree-list'].setCurrentKey(this.currentNode.data.id)
      }else{
        this.currentNode = node
      }

    },
    handleClose() {
      this.treeDialogVisible = false
      this.$emit('update:treeDialogVisible', this.treeDialogVisible)
    },
    cancel() {
      this.treeDialogVisible = false
      this.$emit('update:treeDialogVisible', this.treeDialogVisible)
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
      if(checked){
        this.selectNodes.push(data)
      }else{
        const index = this.selectNodes.findIndex(item => item.id === data.id)
        if(index > -1){
          this.selectNodes.splice(index, 1)
        }
      }
    },
    submitNode() {
      let message = ''
      console.log(this.selectNodes,'this.selectNodes')
      const leafMenus = this.selectNodes.filter(item=>item.resource!=null)
      console.log(leafMenus,'leafMenus')
      if(leafMenus.length == 0){
        message = `所选择的菜单没有绑定页面资源，请重新选择`
      }
    if(message){
      this.$confirm(`${message}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
        return
        })
        .catch(() => {})
      }else{
          this.$emit('submitNode', leafMenus)
          this.$emit('update:treeDialogVisible', false)
      }
  }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .tree-list .el-tree-node__content {
  height: 24px;
  line-height: 24px;
}
.text-message {
  position: -webkit-sticky;
  position: sticky;
  top: 0px;
  display: inline-block;
  z-index: 999;
  background-color: #fefefe;

}
</style>
