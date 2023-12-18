<template>
  <div class='group-tree-div' >
  <el-tree  ref="tree"  highlight-current :data="treeData" :props="defaultProps"  @current-change="nodeChange" node-key="id" :default-expanded-keys="expandedKeys">
        <template slot-scope="{ node, data }">
          <div style="width: 150px;">
          <div class="custom-tree-node">       
            <svg-icon class="svgicon" icon-class="group" />
            <el-buttom style="width:150px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;text-align:left">{{ node.label }}</el-buttom>
          </div>
          </div>
        </template>
  </el-tree>
  </div>
</template>
<script>
import { ResGroupController } from "@controller"
import { BaseVue, _ } from "@lib"
import model from "../resource/model.js"
import GroupForm from "./form.vue"
export default {
  mixins: [BaseVue],
  components: { GroupForm },
  props: {
    appId: {
      type: String,
      default: null
    },
    groupId: {
      type: String,
      default: null
    },
    businessObjId:{
      type: String,
      default: null
    },
    resoureType: {
      type: String,
      default: null
    },
    viewType: {
      type: String,
      default: "group"
    }
  },
  data() {
    return {
      TEXT: {
        subgroup: "新建分组",
        editgroup: "编辑分组"
      },
      treeData: [],
      dialogVisible: false,
      formType: null,
      selectGroup: {},
      selectRes: "function",
      groupid: null,
      model: model,
      form: _.cloneDeep(model.group),
      query: {
        limit: 10,
        offset: 1
      },
      expandedKeys: [],
      btnLoading:false,
       defaultProps: {
          children: 'children',
          label: 'name'
        }
    };
  },
  mounted() {},
  watch: {
    viewType: {
      immediate: true,
      handler(val) {
        this.init();
      }
    },
    appId:{
        handler(val) {
        this.init();
      }
    },
    businessObjId:{
        handler(val) {
        this.init();
      }
    }
  },
  mounted(){
  },
  methods: {
    async init() {
      this.getGroups();
    },
    async getGroups() {
       let query= {
       pageIndex:0,
       pageSize:-1,
       tenantId:this.currentTenant
     }
      let payload = {
        ...query,
        appId:this.appId,
      };
      const resp = await this.dispatch(
        ResGroupController.queryResGroupsByCriteria,
        payload
      );
      let groups = _.cloneDeep(resp.data.data);
      let types = [
        { name: "功能", id: "function", icon: "el-icon-s-opportunity" },
        { name: "页面", id: "url", icon: "el-icon-wallet" },
        { name: "数据", id: "data", icon: "el-icon-s-data" }
      ];
      if (this.viewType === "group") {
        // groups.forEach(group => {
        //   group.children = _.cloneDeep(types);
        //   group.children.forEach(g => {
        //     g.parent = group;
        //   });
        // });
        this.treeData = groups;
      
      } else if (this.viewType === "type") {
        // types.forEach(r => {
        //   r.children = _.cloneDeep(groups);
        //   r.children.forEach(c => {
        //     c.parent = r;
        //   });
        // });
        this.treeData = types;
      }
      let groupId = this.groupId ? this.groupId : this.treeData[0].id

      this.expandedKeys = [groupId]
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(groupId)
      })
      this.$emit("update:groupId", groupId);
      return resp;
    },
    nodeChange(node) {
      if (node.appId) {
        this.$emit("update:groupId", node.id);
      } else {
        this.$emit("update:resoureType", node.id);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.group-tree-div{height:calc(100vh - 400px)} 
.custom-tree-node{
  display: flex;
  align-items: center;
}
.svgicon{
  width:12px;
  height:10px;
  margin-right: 10px;
}
</style>