<template>
  <div id="app">
    <treeselect
      v-model="selectValue"
      :options="lowResTreeData"
      :max-height="250"
      :clearable="clearable"
      :searchable="searchable"
      :open-on-click="openOnClick"
      :open-on-focus="openOnFocus"
      :clear-on-select="clearOnSelect"
      :always-open="alwaysOpen"
      :default-expand-level="1"
      placeholder="请输入资源名称进行搜索..."
      :append-to-body="appendToBody"
      clearValueText="清空选择"
      noOptionsText="应用下没有报表资源数据！"
      @select="changeSelect"
    >
      <div slot="value-label" slot-scope="{ node }">
        {{ toValueTiele(node) }}
      </div>
    </treeselect>
  </div>
</template>

<script>
import { DictTypeController, LowcodeResourceController } from "@controller"
import { BaseVue } from "@lib"
import Treeselect from "@riophae/vue-treeselect"
import "@riophae/vue-treeselect/dist/vue-treeselect.css"
import { mapGetters } from "vuex"
export default {
  mixins: [BaseVue],
  components: { Treeselect },
  props: {
    appCode: {
      type: String,
      default: ""
    },
    value: {}
  },
  data() {
    return {
      lowResTreeData: [],
      selectValue: null,
      clearable: true,
      searchable: true,
      openOnClick: true,
      openOnFocus: false,
      clearOnSelect: true,
      closeOnSelect: false,
      alwaysOpen: false,
      appendToBody: false,
      dicttypeid: "BI_RESOURCE_TYPE",
      dictType: {}
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val) {
          this.selectValue = val.biId
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
  computed: {
    ...mapGetters(["dicts"])
  },
  async mounted() {
    await this.loadDictData()
    for (let item of this.dicts[this.dicttypeid]) {
      this.dictType[item.code] = item.name
    }
    await this.loadlowResourseTree()
  },
  methods: {
    async loadDictData() {
      if (!this.dicttypeid) {
        return
      }
      if (!this.dicts[this.dicttypeid]) {
        const resp = await this.dispatch(DictTypeController.queryDictTypesByCriteria, {
          code: this.dicttypeid,
          tenantId: this.currentTenant
        })
        if (!resp.error) {
          this.$store.commit("ADD_DICT", {
            key: this.dicttypeid,
            value: resp.data.data.length ? resp.data.data[0].dictEntrys : []
          })
        }
      }
    },
    async loadlowResourseTree() {
      const query = {
        appName: this.appCode,
        biResourceType: null,
        tenantId: this.currentTenant,
        __apiPrefix: this.appCode
      }
      let BiResTreeData = []
      const res = await this.dispatch(LowcodeResourceController.queryBIResources, query)
      //组装树结构
      if (res.data) {
        for (let k in res.data) {
          let partent = { id: k, label: this.dictType[k] }
          let childrenData = res.data[k].map((item) => {
            return {
              id: item.id,
              code: ["cockpit", "freelayout"].includes(k) ? `board_${item.id}` : `${k}_${item.id}`,
              type: k,
              typeName: this.dictType[k],
              label: item.name
            }
          })
          partent.children = childrenData
          BiResTreeData.push(partent)
        }
      }
      this.lowResTreeData = BiResTreeData
    },
    changeSelect(node, instanceId, type) {
      if (!node.children) {
        this.$emit("setBiResValue", node)
      } else {
        this.$emit("setBiResValue", null)
      }
    },
    toValueTiele(node) {
      if (!node) {
        return
      }
      if (node.isLeaf && node.parentNode) {
        return node.parentNode.label + "(" + node.raw.label + ")"
      } else if (node.children) {
        return "请选择报表资源"
      } else {
        return "请输入关键字进行搜索..."
      }
    }
  }
}
</script>
