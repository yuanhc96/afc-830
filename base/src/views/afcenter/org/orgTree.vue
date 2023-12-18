<template>
  <el-tree v-if="treeVisible" :props="props" :load="loadNode" lazy @node-click="handleClick"> </el-tree>
</template>

<script>
import { List, BaseVue } from "@lib";
import { DimensionController, OrgController } from "@controller";
export default {
  name: "",
  inject: ["maindimensionId"],
  components: {},
  mixins: [BaseVue, List],
  props: {
    visible: false,
    dimensionData: {},
  },
  data() {
    return {
      currentNode:null,
      treeVisible: true,
      orgQuery: {
        pageIndex: 0,
        pageSize: 10,
        dimensionId: "",
        parentCode: "",
      },
      props: {
        label: "name",
        children: "zones",
        isLeaf: "leaf",
      },
    };
  },
  watch: {},
  computed: {},
  mounted() {},
  methods: {
    handleClick(node){
      this.currentNode = node
    },
    getNodeData(){
      return this.currentNode
    },
    refreshTree() {
        this.treeVisible=false
        this.$nextTick(()=>{
            this.treeVisible=true
        })
    },
    // 查询组织机构
    async searchOrg(payload) {
      if (!payload) {
        const {id} = this.maindimensionId()
        payload = {
          ...this.orgQuery,
          dimensionId: id,
        
        };
      }
      const resp = await this.dispatch(
        OrgController.queryChildOrgsWithPage,
        payload
      );
      return resp;
    },
    // 加载节点
    async loadNode(node, resolve) {
      if (node.level === 0) {
        const {id} = this.maindimensionId()
        const query = {
          ...this.orgQuery,
          dimensionId: id,
        
        };
        const resp = await this.dispatch(
          OrgController.queryChildOrgsWithPage,
          query
        );
        if (!resp.error) {
          this.data = resp.data.data;
          return resolve(this.data);
        }
        return resolve([]);
      }
      if (node.level > 2) return resolve([]);
      const { id, dimensionId } = node.data;
      let payload = {
        parentId: id,
        dimensionId,
        pageIndex: 0,
        pageSize: 10,
      };
      const resp = await this.searchOrg(payload);
      if (!resp.error) {
        resolve(resp.data.data);
      }
    },
  },
};
</script>
<style></style>
