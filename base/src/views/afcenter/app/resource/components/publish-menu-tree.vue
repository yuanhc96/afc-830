<template>
  <div class="position-relative">
    <el-input
      v-model="slectMenu"
      readonly
      class="w-100p"
      placeholder="选择菜单父节点"
    >
      <el-button
        slot="append"
        v-bind="$attrs"
        type="primary"
        icon="el-icon-more"
        @click="open"
      />
    </el-input>

    <el-dialog
      v-if="dialogVisible"
      title="选择父节点菜单"
      :visible.sync="dialogVisible"
      width="500px"
      height="380px"
      append-to-body
      :before-close="handleClose"
    >
    <span
          v-if="currentNode"
          class="text-message mb-20"
          style="color: #00a8ff; font-weight: bold"
          >新建菜单到（{{ currentNode.data.name }}）节点下</span
        >
      <div style="height: 380px; overflow: auto; font-size: 15px">

        <div class="tree-list">
          <el-tree
            ref="tree-list"
            :props="treeProp"
            lazy
            :load="loadTree"
            :highlight-current="true"
            :expand-on-click-node="false"
            node-key="id"
            :default-expanded-keys="['root', 'appRoot']"
            @node-click="nodeClick"
          >
            <div
              slot-scope="{ node, data }"
              style="flex: 1"
              class="custom-tree-node"
            >
            <div @mouseover="mouseover(data)" @mouseleave="mouseout(data)">
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
              <el-tooltip class="item" effect="dark" content="添加非叶子菜单" placement="top">
                <i v-show="showPlusIcon(data)" class="el-icon-plus" style="float: right;margin-top: 5px; margin-right: 10px;" @click.stop="toViewShow(data)" />
              </el-tooltip>
            </div>

            </div>
          </el-tree>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitNode">确 定</el-button>
      </span>
    </el-dialog>
    <publishMenuForm v-if="menuDialogVisible" :menu-dialog-visible.sync="menuDialogVisible" :menu-form="menuForm" :appId="appId" :parent-menu="parentMenu" @addMenuSuccess="addMenuSuccess"></publishMenuForm>
  </div>
</template>

<script>
import { MenuController } from '@controller'
import publishMenuForm from './publish-menu-form.vue'
export default {
  components: { publishMenuForm },
  props: {
    mark: {},
    appId:{
      type:String,
      default:null
    },
    menuForm:{
      type:Object,
      default:()=>{
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      menuDialogVisible:false,
      parentMenu:{},
      slectMenu: null,
      treeProp: {
        label: "name",
        children: "children",
        isLeaf: (data, node) => {
          if (data.isLeaf === "0") {
            // 根据需要进行条件判断添加is-leaf类名
            return false
          } else {
            return true
          }
        },
      },
      message: "",
      currentNode: null,
      node: null,
      resolve: null,
      dialogVisible: false,
      dropdownShow: false,
      rootTreedata: {
        id: "root",
        code: "appMenuTree",
        isLeaf: "0",
        name: "平台菜单树",
        sortNo: 1,
        treeLevel: 1,
        tenantId: this.currentTenant,
      },
    }
  },
  computed: {
    params() {
      if (this.currentNode) {
        return {
          appMenu: {
            menuid: this.currentNode.data.id,
          },
        }
      } else {
        return null
      }
    },
    // appId() {
    //   return this.$route.query ? this.$route.query.appId : null
    // },
  },
  mounted() {
  },
  methods: {
    refreshNode(tag) {
       if (!tag.loading) {
        this.currentNode.loaded = false
        this.currentNode.expand()
      }
    },
    open() {
      this.rootTreedata.id = this.appId ? "appRoot" : "root"
      this.rootTreedata.name = this.appId ? "应用菜单树" : "平台菜单树"
      this.dialogVisible = true
    },
    async loadTree(node, resolve) {
      this.node = node
      this.resolve = resolve
      let menuType = null
      if (this.appId) {
        menuType = this.mark && this.mark === "mobile" ? "mobile" : "pc"
      } else {
        menuType = this.mark && this.mark === "mobile" ? "mobile" : null
      }
      const query = {
        pageIndex: 0,
        pageSize: 999,
        orderFields: "sortNo",
        orderDirection: "ASC",
        tenantId: this.currentTenant,
        menuType,
        appId: this.appId || null,
      }
      if (node && node.data && node.data.id) {
        query.parentId = node.data.id
      }
      const menus = await this.dispatch(
        MenuController.queryMenusByCriteria,
        query
      )
      if (node && node.data && node.data.id) {
        if (this.mark === "mobile") {
          resolve(menus.data.data)
        } else {
          resolve(menus.data.data.filter((menu) => menu.menuType !== "mobile"))
        }
      } else {
        const rootData = this.rootTreedata
        resolve([rootData])
        this.$nextTick(() => {
          this.$refs["tree-list"].setCurrentKey(rootData.id)
          this.currentNode = this.$refs["tree-list"].getNode(rootData.id)
        })
      }
    },

    nodeClick(data, node) {
      if (
        node.data.isLeaf === "1"
      ) {
        //mobile 的叶子节点 不能把其他节点放到此节点下
        this.$refs["tree-list"].setCurrentKey(this.currentNode.data.id)
      } else {
        this.currentNode = node
      }
    },
    handleClose() {
      this.dialogVisible = false
    },
    cancel() {
      this.dialogVisible = false
    },
    submitNode() {
      this.slectMenu =  this.currentNode.data.name
      this.$emit('selectParentNode', this.currentNode)
      this.dialogVisible = false

    },
    showPlusIcon(data){
      return  (data.viewShow && data.isLeaf === '0' && data.id !=='root' && this.mark==='pc') || (data.viewShow && this.mark==='mobile' && data.id === 'root') 
    },
    mouseover(data) { // 移入
      this.$set(data, 'viewShow', true)
    },
    mouseout(data) { // 移除
      this.$set(data, 'viewShow', false)
    },
    toViewShow(data) {
      this.parentMenu = data
      this.menuDialogVisible = true
    },
    addMenuSuccess(){
      this.menuDialogVisible = false
      this.refreshNode({})
    }
  },
}
</script>
<style lang="scss" scoped>

::v-deep .tree-list .el-tree-node__content {
  height: 24px;
  line-height: 24px;
}
</style>
