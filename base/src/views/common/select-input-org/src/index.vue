<template>
  <div class="select-main">
    <treeselect
      :flat="isMultiple"
      searchPromptText="请输入"
      noChildrenText="无节点"
      noResultsText="无数据"
      valueFormat="object"
      :limit="1"
      :async="true"
      append-to-body
      :normalizer="normalizer"
      :default-options="true"
      :load-options="loadOptions"
      :auto-load-root-options="false"
      :multiple="isMultiple"
      placeholder="请输入..."
      v-model="multipleValue"
      :max-height="200"
      @select="changeSelect"
      @deselect="deselect"
      :class="{'is_dialog': isDialog}"
    >
        <div slot="option-label" slot-scope="{ node }">{{ node.raw.name + " (" +node.raw.code + ')' }}</div>
        <div slot="value-label" slot-scope="{ node }">{{ node.raw.name + " (" +node.raw.code + ')' }}</div>
    </treeselect>
    <el-button v-if="isDialog" type="primary" icon="el-icon-more" clearable @click="openDialog" />
    <detail
      v-model="multipleValue"
      :dialog-visible.sync="dialogVisible"
      :is-multiple="isMultiple"
      :rangeMode="rangeMode"
      :rangeData="rangeData"
      :tenantId="tenantId"
    />
  </div>
</template>
<script>
import { _, BaseVue } from '@lib'
import Model from'./model'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Detail from './detail.vue'

export default {
  name: 'search-input-org',
  components: { Treeselect, Detail },
  mixins: [BaseVue, Model],
  props: {
    value: {},
    isMultiple: {
      type: Boolean,
      default: true
    },
    tenantId: {
      type: String,
      default: null
    },
    // 模式:'dimension',维度;'rootOrgs'指定机构ids,codes为根;'orgs'指定机构ids,codes平铺
    rangeMode: {
      type: Number,
      default: 'dimension'
    },
    // {dimensionCode: 'def_dimension'}
    // {ids: [...]}
    // {codes: [...]}
    rangeData: {
      type: Object,
      default: {dimensionCode: 'def_dimension'}
    },
    isDialog: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      multipleValue: null,
      //  去掉children=[]的children属性
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
      },
      dialogVisible: false
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (this.isMultiple) {
          if (val && _.isArray(val)) {
            this.multipleValue = _.cloneDeep(val)
          } else {
            this.multipleValue = []
          }
        } else {
          if (val && val.id) {
            this.multipleValue = _.cloneDeep(val)
          } else {
            this.multipleValue = {}
          }
        }
      }
    }
  },
  mounted() {
  },
  methods: {
    openDialog() {
      this.dialogVisible = true
      // this.$emit('input', this.value)
      // this.$emit('submit')
    },
    async loadOptions({ action, parentNode, searchQuery, callback }) {
      let parentId = null
      let nodes = null
      if (parentNode) {
        parentId = parentNode.id
      }
     if (action === 'ASYNC_SEARCH') {
        if (searchQuery) {
          // 搜索,ids根节点
          const ids = this.rootData.map(i => i.id)
          const data = await this.getOrgsByIds({
            tenantId: this.tenantId,
            ids,
            name: searchQuery,
            isFirst: this.rangeMode === 'orgs' ? '1' : '0' // 是否查询子机构
          })
          nodes = data.map(i => {
            return {
              ...i,
              children: []
            }
          })
        } else {
          let data = []
          if (this.rangeMode === 'dimension') {
            data = await this.getOrgs({
              ...this.rangeData,
              tenantId: this.tenantId
            })
          } else {
            data = await this.getOrgsByIds({
              ...this.rangeData,
              tenantId: this.tenantId
            })
          }
          nodes = data.map(i => {
            if (this.rangeMode === 'orgs') {
              return i
            } else {
              return {
                ...i,
                children: null,
              }
            }
          })
          this.rootData = _.cloneDeep(nodes)
        }
      } else if (action === 'LOAD_CHILDREN_OPTIONS') {
        const data = await this.getSonOrgs(parentId)
        nodes = data.map(i => {
          return {
            ...i,
            children: null,
          }
        })
      }
      if (parentNode && !searchQuery) {
        parentNode.children = nodes
        callback()
      } else {
        callback(null, nodes)
      }
    },
    changeSelect(node, instanceId, type) {
      // console.log(node, instanceId, 'changeSelect')
    },
    deselect(node, instanceId) {
      // console.log(node, instanceId, 'deselect')
      // this.changeSelect(node, instanceId, 'del')
    },
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .select-main {
    position: relative;
    .el-button {
      position: absolute;
      right: 0px;
      top: 0;
    }
  }
  .is_dialog.vue-treeselect {
    padding-right: 43px;
  }
  button.el-button.el-button--primary.el-button--mini {
    height: 32px;
  }
  
</style>