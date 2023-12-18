<template>
  <el-dialog
    title="选择父节点"
    :visible.sync="treeDialogVisible"
    width="500px"
    height="380px"
    append-to-body
    :before-close="handleClose"
  >
  <span v-if="currentNode" class="text-message mb-20" style="color:#00A8FF;font-weight:bold">{{ message }}[{{ currentNode.data.name }}]节点下</span>

    <div style="height:380px;overflow:auto;font-size:15px">
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
import Form from './form.vue'
export default {
  components: { Form, Icon },
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
    appId() {
      return (this.$route.query ? this.$route.query.appId : null) || this.currentAppId || null
    }
  },
  mounted() {
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
    submitNode() {
      let message = ''
      const parentNode = this.currentNode
      // 判断目标节点是否是其本身，是->不做修改
      const isSelf = this.selectMenus.filter((item) => item.id === parentNode.data.id)
        if (isSelf.length > 0) {
          message +=`${parentNode.data.name}所选父节点为其本身节点,不做修改;
          `
        }
        if (parentNode.data.id === "root") {
          //叶子节点不能转移到根节点
          const leafMenus = this.selectMenus
            .filter((item) => item.isLeaf === "1")
          const leafMenuStr = leafMenus.length ? leafMenus.map((item) => {
              return item.name
            })
            .join("、") : ''
          if(leafMenuStr) {
            message +=`${leafMenuStr}叶子节点不能移到应用菜单树下;
            `
          }
        }
        if(this.mark === 'mobile'){
        //移动端非叶子节点不能转移
          const noLeafMenus = this.selectMenus
            .filter((item) => item.isLeaf === "0")
          const noLeafMenusStr = noLeafMenus.length ? noLeafMenus.map((item) => {
              return item.name
            })
            .join("、") : ''
          if(noLeafMenusStr) {
            message +=`${noLeafMenusStr}移动端非叶子节点不能转移`
          }
        }
    if(message){
      this.$confirm(`${message}`, "提示", {
        confirmButtonText: "继续",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
        this.$emit('submitNode', this.currentNode)
        this.treeDialogVisible = false
        this.$emit('update:treeDialogVisible', this.treeDialogVisible)
        })
        .catch(() => {})
    }else{
        this.$emit('submitNode', this.currentNode)
        this.treeDialogVisible = false
        this.$emit('update:treeDialogVisible', this.treeDialogVisible)
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
