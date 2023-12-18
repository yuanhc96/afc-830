<template>
  <div id="app">
    <treeselect
      v-model="selectValue"
      :options="lowResTreeData"
      :max-height="200"
      :clearable="clearable"
      :searchable="searchable"
      :open-on-click="openOnClick"
      :open-on-focus="openOnFocus"
      :clear-on-select="clearOnSelect"
      :always-open="alwaysOpen"
      placeholder="请输入资源名称进行搜索..."
      :append-to-body="appendToBody"
      clearValueText="清空选择"
      noOptionsText="应用下没有此资源数据！"
      @select="changeSelect"
    >
      <div slot="value-label" slot-scope="{ node }">
        {{ toValueTiele(node) }}
      </div>
    </treeselect>
  </div>
</template>

<script>
import { LowcodeProjectController, LowcodeResourceController } from "@controller"
import { BaseVue } from "@lib"
import Treeselect from "@riophae/vue-treeselect"
import "@riophae/vue-treeselect/dist/vue-treeselect.css"
export default {
  mixins: [BaseVue],
  components: { Treeselect },
  props: {
    appCode: {
      type: String,
      default: ""
    },
    lowResType: {
      type: String,
      default: ""
    },
    value: {}
  },
  data() {
    return {
      lowResTreeData: [],
      lowcodeContributionObjs:{},
      lowcodeContributions:[],
      selectValue: null,
      clearable: true,
      searchable: true,
      openOnClick: true,
      openOnFocus: false,
      clearOnSelect: true,
      closeOnSelect: false,
      alwaysOpen: false,
      appendToBody: false
    }
  },
  async mounted() {
    await this.findContributions()
    await this.loadlowResourseTree()
  },
  watch: {
    lowResType: {
      immediate: true,
      async handler(val) {
        if (val) {
          await this.findContributions()
          await this.loadlowResourseTree()
        }
      }
    },
    value: {
      immediate: true,
      handler(val) {
        if (val) {
          let state = val.openType === "lowForm" ? val.formStatus : val.viewType
          this.selectValue = val.resourceCode + state
        }
      }
    },
    selectValue: {
      handler(val) {
        if (!val) {
          this.$emit("setLowresValue", null)
        }
      }
    }
  },
  computed: {},
  methods: {
    async loadlowResourseTree() {
      const query = {
        pageIndex: 0,
        pageSize: -1,
        tenantId: this.currentTenant,
        resourceType: "formx",
        __apiPrefix: this.appCode
      }
      let lowResTreeData = []
      const res = await this.dispatch(LowcodeResourceController.queryWithPage, query)
      //组装树结构
      if (this.lowResType === "lowForm") {
        const lowResformList = res.data.data.map((item, index) => {
          if (item.formStatus) {
            item.formStatus = JSON.parse(item.formStatus)
          }
          return item
        })
        for (let item of lowResformList) {
          item["label"] = item.name
          item["id"] = item.code
          if (item.formStatus && item.formStatus.length) {
            for (let status of item.formStatus) {
              status["label"] = status.type
              status["id"] = item.code + status.type
              status["partendName"] = item.name
              status["partendCode"] = item.code
            }
            item["children"] = item.formStatus
            lowResTreeData.push(item)
          }
        }
        for(let item of this.lowcodeContributions){
         item["children"]  = lowResTreeData.filter(con=>con.lowcodeContribution.code === item.id)
        }
        this.lowResTreeData =  this.lowcodeContributions
      } else {
        const lowResViewList = res.data.data.map((item, index) => {
          if (item.views) {
            item.views = JSON.parse(item.views)
          }
          return item
        })
        for (let item of lowResViewList) {
          item["label"] = item.name
          item["id"] = item.code
          if (item.views && item.views.length) {
            for (let status of item.views) {
              status["label"] = status.name + "视图"
              if (status.code === "default") {
                status.code = "view"
              }
              status["id"] = item.code + status.code
              status["partendName"] = item.name
              status["partendCode"] = item.code
            }
            item["children"] = item.views
            lowResTreeData.push(item)
          }
        }
        for(let item of this.lowcodeContributions){
         item["children"]  = lowResTreeData.filter(con=>con.lowcodeContribution.code === item.id)
        }
        this.lowResTreeData =  this.lowcodeContributions
      }
    },

    async findContributions(){
      const query = {
        category: 'online',
        resourceTreeVersion: -1,
        includeResources: false,
        appName: this.appCode,
        __apiPrefix: this.appCode
      }
    const res = await this.dispatch(LowcodeProjectController.getNewerResourceTree, query)
    for(let item of res.data.lowcodeContributions){
      this.lowcodeContributionObjs[item.code] = item.name
    }
    this.lowcodeContributions = res.data.lowcodeContributions.filter(item=>item.code!== 'com.primeton.gocom.lowcode.thirdpartyserver' && !item.biFolder)
    .map(item=>{
      return {
        id:item.code,
        label:item.name
      }
    })
    },
    changeSelect(node, instanceId, type) {
      if (!node.children) {
        this.$emit("setLowresValue", node)
      } else {
        this.$emit("setLowresValue", null)
      }
    },
    toValueTiele(node) {
      if (!node) {
        return
      }
      if (node.isLeaf && node.parentNode) {
        return node.parentNode.label + "(" + node.raw.label + ")"
      } else if (node.children) {
        return "请选择表单状态或视图"
      } else {
        return "请输入关键字进行搜索..."
      }
    }
  }
}
</script>
