<template>
  <el-tooltip :disabled="!showSelectorTooltip || !selectorTooltipContent" :content="selectorTooltipContent">
    <el-select
      v-model="finalValue"
      v-bind="$attrs"
      :multiple="false"
      :clearable="clearable"
      :disabled="disabled"
      @clear="clearHandle"
    >
      <el-input
        v-model="filterText"
        class="ide-tree-select__input"
        clearable
        :placeholder="placeholder"
      />
      <el-option value="default" label="default" class="ide-tree-select__options" :style="`min-width: ${dropdownWidth}px`">
        <el-tree
          ref="ide-tree-select"
          class="ide-tree-select__tree"
          :show-checkbox="false"
          :accordion="accordion"
          :data="options"
          :props="props"
          node-key="id"
          :lazy="lazyTree"
          :load="treeLoadMethod"
          :default-expand-all="defaultExpandAll"
          :default-expanded-keys="defaultExpandKeys"
          :expand-on-click-node="false"
          :check-on-click-node="true"
          :default-checked-keys="checkedKeys"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
          @hook:mounted="treeMounted = true"
        >
          <template slot-scope="{ node, data }" class="custom-tree-node">
            <slot :node="node" :data="data" name="tree-node-label" />
          </template>
        </el-tree>
      </el-option>
    </el-select>
  </el-tooltip>
</template>

<script>
export default {
  name: 'tree-select',
  props: {
    /* 配置项 */
    props: {
      type: Object,
      default: () => {
        return {
          value: 'id', // ID字段名
          label: 'label', // 显示名称
          children: 'children', // 子级字段名
          pathLabel: 'pathLabel',
        }
      }
    },
    /* 选项列表数据(树形结构的对象数组) */
    options: {
      type: Array,
      default: () => { return [] }
    },
    checkFilter: {
      type: Function,
      default: () => { return true }
    },
    /* 初始值 */
    value: {
      type: Number | String | Array,
      default: () => { return null }
    },
    /* 可清空选项 */
    clearable: {
      type: Boolean,
      default: () => { return true }
    },
    disabled: {
      type: Boolean,
      default: () => { return false }
    },
    /* 自动收起 */
    accordion: {
      type: Boolean,
      default: () => { return false }
    },
    /* 默认全部展开 */
    defaultExpandAll: {
      type: Boolean,
      default: () => { return false }
    },
    /* 默认展开项 */
    defaultExpandKeys: {
      type: Array,
      default: null
    },
    placeholder: {
      type: String,
      default: () => { return '检索关键字' }
    },
    dropdownWidth: {
      default: 700
    },
    showPath: {
      default: false
    },
    lazyTree: {
      default: false,
    },
    treeLoadMethod: {
      type: Function,
      default: null
    },
    showSelectorTooltip: {
      default: false
    },
    selectorTooltipField: {
      default: null
    }
  },
  data() {
    return {
      treeMounted: false,
      filterText: '',
      valueId: Array.isArray(this.value) ? null : this.value, // 初始值
      valueTitle: '',
      defaultExpandedKey: [],
      checkedKeys: Array.isArray(this.value) ? [this.value] : [],
      selectorTooltipContent: null,
    }
  },
  computed: {
    finalValue: {
      get() {
        return this.valueTitle || this.valueId
      },
      set(val) {

      }
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.valueId = this.value
        this.initHandle()
      }
    },
    filterText(val) {
      this.$refs['ide-tree-select'].filter(val)
    },
    treeMounted: {
      immediate: true,
      handler(val) {
        if (val) {
          this.initHandle()
          this.$refs['ide-tree-select'].setCurrentKey(this.valueId)
        }
      }
    },
    options: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val && val.length > 0 && this.valueId && this.$refs['ide-tree-select']) {
          this.$nextTick(() => {
            this.initHandle()
            this.$refs['ide-tree-select'].setCurrentKey(this.valueId)
          })
        }
      }
    }
  },

  methods: {
    getNodeLabel(key) {
      let node = null
      if (this.$refs['ide-tree-select'] && (node = this.$refs['ide-tree-select'].getNode(key)) !== null) {
        return node.data[this.props.label]
      } else {
        return null
      }
    },
    // 初始化值
    initHandle() {
      if (this.valueId && this.$refs['ide-tree-select']) {
        const selectNode = this.$refs['ide-tree-select'].getNode(this.valueId)
        if (selectNode) {
          this.valueTitle = selectNode.data[this.showPath ? this.props.pathLabel : this.props.label] // 初始化显示\
          this.selectorTooltipContent = this.selectorTooltipField ? selectNode.data[this.selectorTooltipField] : null
        }
      }
    },
    // 切换选项
    handleNodeClick(nodeData, node) {
      if (node.isLeaf) {
        this.$emit('input', nodeData.id)
        this.$emit('change', nodeData)
      } else {
        this.$refs['ide-tree-select'].setCurrentKey(this.valueId || null)
      }
    },
    // 清除选中
    clearHandle(node) {
      this.valueTitle = ''
      this.selectorTooltipContent = null
      this.valueId = null
      this.defaultExpandedKey = []
      this.$emit('input', null)
      this.$emit('change', null)
    },
    filterNode(value, data) {
      if (!value) return true
      return data[this.props.label].toLowerCase().indexOf(value.toLowerCase()) !== -1
    }
  },
}
</script>
<style lang="scss" scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
  min-height: 34px;
  height: 210px;
  padding: 0;
  overflow: hidden;
  overflow-Y: auto;
}
.ide-tree-select__options.el-select-dropdown__item.selected{
  font-weight: normal;
}
ul li ::v-deep.el-tree .el-tree-node__content{
  height:auto;
  padding: 0 20px;
}
::v-deep .ide-tree-select__tree .el-tree-node.is-current{
  color: #409EFF;
  font-weight: 700;
}
.ide-tree-select__input{
  padding: 0px 5px 5px 5px;
  box-sizing: border-box;
}
::v-deep .el-tag__close.el-icon-close{
  display: none!important;
}
.ide-tree-select__options.hover{
  background-color: white;
}
</style>
