<template>
  <div class="tree-list">
    <el-input v-if="searchable" v-model="keyword" placeholder="检索..." clearable>
      <i
        slot="suffix"
        class="el-icon-search el-input__icon"
      />
    </el-input>
    <PmContextmenu ref="contextmenu" theme="default">
      <PmContextmenuItem class="menu-item" @click="refreshNode"><i class="el-icon-refresh"/> 刷新</PmContextmenuItem>
    </PmContextmenu>
    <el-tree
      ref="tree-list"
      size="normal"
      highlight-current
      :node-key="treeProps.id"
      :data="data"
      :filter-node-method="filterNode"
      :props="treeProps"
      :expand-on-click-node="false"
      :current-node-key="currentNodeKey"
      :default-expanded-keys="defaultExpandedKeys"
      v-bind="$attrs"
      :lazy="lazy"
      :load="lazyAction"
      @node-click="handleNodeClick"
      @node-contextmenu="rightClick"
      v-contextmenu:contextmenu
    >
      <div slot-scope="{ node, data }" class="custom-tree-node">
        <slot :data="data" name="row">
          <div class="name" :class="putGrayData.includes(node.key) ? 'gray' : ''">
            <svg-icon v-if="data.icon" :icon-class="data.icon" />
            {{ node.label }}
          </div>
          <div v-if="!data.isLock" class="btns">
            <el-button
              v-if="$listeners.edit && editable"
              class="hover-shadow"
              type="text"
              icon="el-icon-edit"
              @click="edit(data)"
            />
            <el-button
              v-if="$listeners.remove && removable"
              class="hover-shadow"
              type="text"
              icon="el-icon-delete"
              @click="remove(data)"
            />
          </div>
        </slot>
      </div>
    </el-tree>

  </div>
</template>
<script>
export default {
  name: 'tree-list',
  props: {
    lazyAction: {
      type: Function,
    },
    value: {
      default: Object,
      default: null,
    },
    editable: {
      type: Boolean,
      default: true,
    },
    searchable: {
      type: Boolean,
      default: true,
    },
    removable: {
      type: Boolean,
      default: true,
    },
    lazy: {
      type: Boolean,
      default: true,
    },
    contextMenuEnable: {
      type: Boolean,
      default: true,
    },
    defaultExpandedKeys: {
      type: Array,
      default: () => ([])
    },
    treeProps: {
      type: Object,
      default: () => ({
        id: 'id',
        label: 'name',
        children: 'children',
        isLeaf: 'isLeaf',
      }),
    },
    data: {
      type: Array,
      default: () => ([])
    },
    putGrayData: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      currentNodeKey: null,
      currentNode: null,
      keyword: null,
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val && val[this.treeProps.id]) {
          this.$nextTick(() => {
            this.setCurrentKey(val[this.treeProps.id])
          })
        }
      }
    },
    keyword(val) {
      this.$refs['tree-list'].filter(val)
    },
  },
  methods: {
    refreshNode(tag) {
      if (!tag.loading) {
        this.currentNode.loaded = false
        this.currentNode.expand()
      }
    },
    // 右键点击
    rightClick(MouseEvent, object, node, element) { // 鼠标右击触发事件
      if (!this.contextMenuEnable) {
        return
      }
      this.currentNode = node
      this.$emit('selectNode', node.data)
      this.$refs['tree-list'].setCurrentKey(node.data.id)
      // this.$refs['cm'].show(MouseEvent)
    },
    filterNode(value, data) {
      if (!value) return true
      return data[this.treeProps.label].toLowerCase().indexOf(value.toLowerCase()) !== -1
    },
    setCurrentKey(key) {
      this.$refs['tree-list'].setCurrentKey(key)
      this.currentNodeKey = key
      this.$forceUpdate()
    },
    handleNodeClick(data, node) {
      this.currentNode = node
      // this.$refs['cm'].close()
      this.$emit('input', data)
    },
    add() {
      this.$emit('add')
    },
    edit(row) {
      this.$emit('edit', row)
    },
    remove(row) {
      this.$emit('remove', row)
    },
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .tree-list {
    ::v-deep .el-input__inner {
      border-radius: 0;
      border-right:none;
      border-left:none;
      border-top:none;
    }
    ::v-deep .el-button + .el-button {
      margin-left: 0px;
    }
    .custom-tree-node {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 14px;
      padding-right: 8px;
      .icon {
        position: absolute;
      }
      .name {
        flex-grow: 3;
      }
      .gray {
        color: #BDBDBD
      }
      .btns {
        opacity: 0;
        transition: all .3s ease;
        text-align: right;
        flex-grow: 2;
      }
      &:hover {
        .btns {
          color: #0a76a4;
          opacity: 1;
        }
      }
    }
  }

</style>
