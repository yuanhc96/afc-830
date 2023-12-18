<template>
  <PmSecondaryMenu
    style="margin-top: 8px;height:100%"
    :rightTitle="false"
    :showTitle="false"
    :offsetHeight="115"
  >
    <div slot="left-title">业务对象</div>
    <div slot="left-body">
      <!-- <el-select class="mt-10 mb-10" v-model="applyId" clearable @change="applyChange" placeholder="请选择应用">
        <el-option
            v-for="item in application"
            :key="item.id"
            :label="item.name"
            :value="item.id"
        />
      </el-select>
      <PmTree :data="gridList" :searchable="false" v-model="selectNode" v-loading="BusinessObjectController.queryBusinessObjectsByCriteria.loading">
        <TreeNode slot="row" slot-scope="{ node, data }">
          <template slot="label">
            <span >{{ node.label }}</span>
          </template>
        </TreeNode>
      </PmTree> -->
      <el-tree
        :props="props"
        class="mt-10 mb-10"
        ref="tree"
        size="normal"
        node-key="id"
        :load="loadNode"
        highlight-current
        @node-click="handleNodeClick"
        :default-expanded-keys="[expandedKeys]"
        :current-node-key="currentNodeKey"
        lazy
      >
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <svg-icon
            class="svgicon"
            :icon-class="node.level === 1 ? 'apply' : 'object'"
          />
          <span>{{ node.label }}</span>
        </div>
      </el-tree>
    </div>
    <div slot="right-body" class="pl-10">
      <System
        v-bind="$props"
        v-if="currentNodeKey && type === 'businessObject'"
        :businessObjId="currentNodeKey"
        @gotoDetail="gotoDetail"
      />
    </div>
  </PmSecondaryMenu>
</template>

<script>
import { AppController, BusinessObjectController } from "@controller"
import { BaseVue, List, VueUtil } from "@lib"
import System from "./system.vue"
export default {
  name: "businessObject",
  mixins: [BaseVue, List],
  props: {
    type: {
      type: String,
    },
    currentAppId:{
      type: String,
      default:""
    }
  },
  computed:{
    ...VueUtil(this)
      .select([AppController, BusinessObjectController])
      .state(),
    appId() {
      return (this.$route.query ? this.$route.query.appId : null) || this.currentAppId || null
    }
  },
  components: { System },
  data() {
    return {
      applyId: "",
      application: [],
      apply: "",
      businessObjId: "",
      selectNode: {},
      currentNode: {},
      props: {
        label: "name",
        children: "zones",
        // isLeaf: 'leaf'
        isLeaf: (data, node) => {
          if (node.level === 2) {
            // 根据需要进行条件判断添加is-leaf类名
            return true;
          }
        },
      },
      currentNodeKey: null,
      expandedKeys: [],
    };
  },
  watch: {
    // selectNode: {
    //   immediate: true,
    //   deep: true,
    //   handler(val) {
    //     if(Object.keys(val).length==0){
    //       this.$emit('businessDetail')
    //     }
    //   },
    // }
    currentNode: {
      immediate: true,
      deep: true,
      handler(val) {
        if (Object.keys(val).length == 0) {
          this.$emit("businessDetail");
        } else {
          this.$emit("businessDetail", val.name);
        }
      },
    },
  },
  mounted() {
    //查询应用
    // this.applicationList()
    //查询业务对象
    // this.search()
  },
  activated() {
    this.search();
  },
  methods: {
    async loadNode(node, resolve) {
      if (node.level === 0) {
        // return resolve([{ name: 'region' }]);
          if(this.appId){
          this.expandedKeys = this.appId;
          const app = await  this.getAppbyId(this.appId)
          console.log(app,'app=====')
          return  resolve([app]);
        }else{
          let paload = {
          pageIndex: 0,
          pageSize: -1,
        };
        let resp = await this.dispatch(
          AppController.queryAppsByCriteria,
          paload
        );
        if (!resp.error) {
          this.expandedKeys = resp.data.data[0].id;
          return  resolve(resp.data.data);
        }

        }
        
      } else if (node.level === 1) {
        this.applyId = node.data.id;
        let paload = {
          pageIndex: 0,
          pageSize: -1,
          appId: this.applyId,
        };
        const resp = await this.dispatch(
          BusinessObjectController.queryBusinessObjectsByCriteria,
          paload
        );
        if (!resp.error) {
          if (this.applyId == this.expandedKeys) {
            this.$nextTick(() => {
              if (resp.data.data.length > 0) {
                this.currentNode = resp.data.data[0];
                this.currentNodeKey = resp.data.data[0].id;
                this.$refs.tree.setCurrentKey(resp.data.data[0].id);
              }
            });
          }
          return resolve(resp.data.data);
        }
      } else {
        return resolve([]);
      }
    },
    async applicationList() {
      let paload = {
        pageIndex: 0,
        pageSize: -1,
      };
      let resp = await this.dispatch(AppController.queryAppsByCriteria, paload);
      if (!resp.error) {
        this.application = resp.data.data;
      }
    },
    async searchBody() {
      let paload = {
        pageIndex: 0,
        pageSize: -1,
        appId: this.applyId,
      };
      const resp = await this.dispatch(
        BusinessObjectController.queryBusinessObjectsByCriteria,
        paload
      );
      return resp;
    },
    // applyChange(){
    //   //根据应用查询业务对象列表
    //   this.search()
    // },
    gotoDetail(app, tab, props) {
      app.appId = this.applyId;
      this.$emit("gotoDetail", app, tab, props);
    },
    handleNodeClick(data) {
      if (data.appId) {
        this.currentNode = data;
        this.currentNodeKey = data.id;
      } else {
        this.currentNode = {};
        this.currentNodeKey = "";
      }
    },
    async getAppbyId(id){
      let resp = await this.dispatch(AppController.findApp, {id:id});
      if (!resp.error) {
        return resp.data
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.custom-tree-node {
  display: flex;
  align-items: center;
}
.svgicon {
  width: 12px;
  height: 12px;
  margin-right: 10px;
}
</style>
