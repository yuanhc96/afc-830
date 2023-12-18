<template>
  <el-select ref="select" :value="valueTitle" :clearable="clearable" @clear="clearHandle">
    <el-option :value="valueTitle" :label="valueTitle">
      <div class="tree-list">
        <el-tree
          id="tree-option"
          ref="selectTree"
          :expand-on-click-node="false"
          :accordion="accordion"
          :data="data"
          :props="props"
          :node-key="props.value"
          :highlight-current="true"
          :default-expanded-keys="defaultExpandedKey"
          v-bind="$attrs"
          @node-click="handleNodeClick"
          v-on="$listeners"
        />
      </div>
    </el-option>
  </el-select>
</template>
<script>
export default {
  name: 'el-tree-select',
  props: {
    /* 配置项 */
    props: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          label: 'label'
        }
      }
    },
    /* 选项列表数据(树形结构的对象数组) */
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    /* 初始值 */
    value: {
      type: Number | String,
      default: () => {
        return null
      }
    },
    /* 可清空选项 */
    clearable: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    /* 自动收起 */
    accordion: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    /* 点击后自动收起 */
    autoClose: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    /* 允许点击选中 */
    allowClick: {
      type: Function,
    },
  },
  data() {
    return {
      valueId: null, // 初始值
      valueTitle: '',
      defaultExpandedKey: []
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.valueId = this.value
        if (!val) {
          this.valueTitle = null
        }
      }
    },
    data: {
      immediate: true,
      handler() {
        this.initHandle()
      }
    },
  },
  mounted() {
    //      this.initHandle()
  },

  methods: {
    getTree() {
      return this.$refs['selectTree']
    },
    // 初始化值
    initHandle() {
      this.$nextTick(() => {
        if (this.valueId) {
          this.valueTitle = this.$refs.selectTree.getNode(this.valueId).data[this.props.label] // 初始化显示
          this.$refs.selectTree.setCurrentKey(this.valueId) // 设置默认选中
          this.defaultExpandedKey = [this.valueId] // 设置默认展开
        }
        this.$nextTick(() => {
          const scrollWrap = document.querySelectorAll('.el-scrollbar .el-select-dropdown__wrap')[0]
          const scrollBar = document.querySelectorAll('.el-scrollbar .el-scrollbar__bar')
          scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;'
          scrollBar.forEach(ele => ele.style.width = 0)
        })
      })
    },
    // 切换选项
    handleNodeClick(node) {
      if (this.allowClick && !this.allowClick.call(this, node)) {
        return
      }
      this.valueTitle = node[this.props.label]
      this.valueId = node[this.props.value]
      this.$emit('input', this.valueId)
      this.defaultExpandedKey = []

      this.autoClose && this.$refs['select'].blur()
    },
    // 清除选中
    clearHandle() {
      this.valueTitle = ''
      this.valueId = null
      this.defaultExpandedKey = []
      this.clearSelected()
      this.$emit('input', null)
    },
    /* 清空选中样式 */
    clearSelected() {
      const allNode = document.querySelectorAll('#tree-option .el-tree-node')
      allNode.forEach((element) => element.classList.remove('is-current'))
    }
  },
}
</script>
<style lang="scss" scoped>
  .el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
    height: auto;
    min-height: 200px;
    max-height: 274px;
    padding: 0;
    overflow: hidden;
    overflow-y: auto;
  }

  .el-select-dropdown__item.selected {
    font-weight: normal;
  }

  .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    background: #ffffff;
  }
</style>
