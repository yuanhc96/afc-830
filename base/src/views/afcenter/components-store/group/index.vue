<template>
  <div>
    <TreeFilterInput v-model="filterText" placeholder="检索分组名" />
    <PmTree
      ref="treeBox"
      v-loading="treeLoading"
      class="mt-10"
      :data="treeData"
      node-key="id"
      :searchable="false"
      :default-expanded-keys="expandedKeys"
      :default-checked-keys="[defaultCheckedKeys]"
      @current-change="nodeChange"
    >
      <TreeNode slot="row" slot-scope="{ node, data }">
        <template slot="label">
          <div style="width:150px;">
            <div class="custom-tree-node">
              <svg-icon class="svgicon" icon-class="group" />
              <el-tooltip class="item" effect="light" :content="node.label + ' ( ' + data.version + ' )'" placement="bottom">
                <el-buttom style="width:150px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;text-align:left">{{ node.label + ' ( ' + data.version + ' )' }}</el-buttom>
              </el-tooltip>
            </div>
          </div>
        </template>
        <template slot="more">
          <el-dropdown
            size="medium"
            trigger="click"
            placement="bottom-start"
            @command="clickMoreButton"
          >
            <span class="el-dropdown-link">
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown" size="medium">
              <el-dropdown-item
                class="ml-10 mr-10"
                icon="el-icon-edit"
                command="updateNode"
                @click.native="openEdit(data)"
              >编辑</el-dropdown-item>
              <el-dropdown-item
                class="ml-10 mr-10"
                icon="el-icon-delete"
                command="removeNode"
                @click.native="removeNode(data)"
              >删除</el-dropdown-item>
              <el-dropdown-item
                class="ml-10 mr-10"
                icon="el-icon-download"
                command="export"
                @click.native="handleExport(data.code)"
              >下载</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </TreeNode>
    </PmTree>
    <pm-form-dialog
      width="480px"
      :title="dialogTitle"
      :dialog-visible.sync="dialogVisible"
      ok-text="确定"
      :loading="btnLoading"
      body-class="pt-10 pl-20 pr-20 pb-10"
    >
      <GroupForm
        slot="form"
        :form-data="selectRow"
        :loading.sync="btnLoading"
        @success="success"
      />
    </pm-form-dialog>
  </div>
</template>
<script>
import { ComponentCenterController } from '@controller'
import { BaseVue, List } from '@lib'
// import model from "../model.js"
import GroupForm from './form.vue'
export default {
  components: { GroupForm },
  mixins: [BaseVue, List],
  props: {
    group: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      filterText: '',
      treeData: [],
      dialogVisible: false,
      form: {
        name: null,
        code: null
      },
      query: {
        limit: 10,
        offset: 1
      },
      expandedKeys: [],
      defaultCheckedKeys: null,
      btnLoading: false,
      fileList: [],
    }
  },
  computed: {
    appId() {
      return this.$route.query ? this.$route.query.appId : null
    },
    dialogTitle() {
      return `${this.selectRow ? '编辑' : '新增'}分组`
    }
  },
  watch: {
    filterText(val) {
      this.treeData = this.treelist.filter(res => res.name.indexOf(val.trim()) != -1)
    },
  },
  mounted() {
    this.dialogVisible = false
    this.getGroups()
  },
  methods: {
    success() {
      this.getGroups()
      this.dialogVisible = false
    },
    async getGroups() {
      this.treeLoading = true
      this.query.limit = 999
      const payload = {
        ...this.query,
      }
      const resp = await this.dispatch(
        ComponentCenterController.queryWithPage,
        payload
      )
      this.treeLoading = false
      if (!resp.error) {
        this.treelist = resp.data.data
        if (this.filterText) {
          this.treeData = this.treelist.filter(res => res.name.indexOf(val.trim()) != -1)
        } else {
          this.treeData = resp.data.data
        }
        this.expandedKeys = [resp.data.data[0]?.id]
        if (!this.defaultCheckedKeys) {
          this.$emit('update:group', resp.data.data[0] || {})
          this.defaultCheckedKeys = resp.data.data[0]?.id
          this.$nextTick(() => {
            this.$refs['treeBox'].setCurrentKey(this.defaultCheckedKeys)
          })
        }
        return resp
      }
    },
    removeNode(data) {
      this.confirm('确定要删除吗?').then(async() => {
        const payload = { ids: [data.id] }
        const resp = await this.dispatch(
          ComponentCenterController.deletes,
          payload
        )
        if (!resp.error) {
          this.getGroups()
        }
      })
    },
    nodeChange(node) {
      this.$emit('update:group', node)
    },
    handleExport(code) {
      this.$emit('export', 'part', code)
    }
  }
}
</script>

<style lang="scss" scoped>

.pm-tree {
  height: calc(100vh - 238px);
  overflow-y: auto;
}
::v-deep .hamburger{
  display: none !important;
}
.add-btn{
  width: 190px;
}
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
