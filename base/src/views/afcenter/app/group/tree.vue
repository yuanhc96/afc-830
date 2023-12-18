<template>
  <div style="width:200px;">
    <TreeFilterInput v-model="filterText" placeholder="检索分组名" />
    <PmTree
      ref="treeBox"
      class="mt-10"
      :data="treeData"
      node-key="id"
      :searchable="false"
      :default-expanded-keys="expandedKeys"
      @current-change="nodeChange"
    >
      <TreeNode slot="row" slot-scope="{ node, data }">
        <template slot="label">
          <div style="width:150px;">
            <div class="custom-tree-node">
              <svg-icon class="svgicon" icon-class="group" />
              <el-buttom style="width:150px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;text-align:left">{{
                node.label }}</el-buttom>
            </div>
          </div>
        </template>
        <template slot="more">
          <el-dropdown
            v-if="viewType === 'group' && !data.icon"
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
                v-permission="FuncCode.afc_f_resgroup_edit"
                class="ml-10 mr-10"
                icon="el-icon-edit"
                command="updateNode"
                @click.native="openAdd('editgroup', node)"
              >编辑</el-dropdown-item>
              <el-dropdown-item
                v-permission="FuncCode.afc_f_resgroup_del"
                class="ml-10 mr-10"
                icon="el-icon-delete"
                command="removeNode"
                @click.native="removeNode(node)"
              >删除</el-dropdown-item>

            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </TreeNode>
    </PmTree>
    <div class="pr-20">
      <el-button
        v-if="viewType === 'group'"
        v-permission="FuncCode.afc_f_resgroup_add"
        plain
        class="w-100p"
        icon="el-icon-plus"
        @click="openAdd('subgroup', null)"
      >新建分组</el-button>
    </div>
    <pm-form-dialog
      width="480px"
      :title="`${TEXT[formType]}`"
      :dialog-visible.sync="dialogVisible"
      ok-text="确定"
      :loading="btnLoading"
      body-class="pt-10 pl-20 pr-20 pb-10"
    >
      <GroupForm
        v-if="formType === 'subgroup' && dialogVisible"
        slot="form"
        :type="selectRes"
        :appid="appId"
        :business-obj-id="businessObjId"
        :loading.sync="btnLoading"
        @success="getGroups"
      />
      <GroupForm
        v-if="formType === 'editgroup' && dialogVisible"
        slot="form"
        :data="selectGroup"
        :loading.sync="btnLoading"
        @success="getGroups"
      />
    </pm-form-dialog>
  </div>
</template>
<script>
import { ResGroupController } from '@controller'
import { BaseVue, _ } from '@lib'
import model from '../resource/model.js'
import GroupForm from './form.vue'
export default {
  components: { GroupForm },
  mixins: [BaseVue],
  props: {
    appId: {
      type: String,
      default: null
    },
    groupId: {
      type: String,
      default: null
    },
    businessObjId: {
      type: String,
      default: null
    },
    resoureType: {
      type: String,
      default: null
    },
    viewType: {
      type: String,
      default: 'group'
    }
  },
  data() {
    return {
      TEXT: {
        subgroup: '新建分组',
        editgroup: '编辑分组'
      },
      filterText: '',
      treeData: [],
      dialogVisible: false,
      formType: null,
      selectGroup: {},
      selectRes: 'function',
      groupid: null,
      model: model,
      form: _.cloneDeep(model.group),
      query: {
        limit: 10,
        offset: 1
      },
      name: null,
      expandedKeys: [],
      btnLoading: false
    }
  },
  watch: {
    // viewType: {
    //   immediate: true,
    //   handler(val) {
    //     this.init()
    //   }
    // },
    filterText(val) {
      this.treeData = this.treelist.filter(res => res.name.indexOf(val.trim()) != -1)
    },
  },
  mounted() {
    this.$watch(function() {
      return this.appId + this.viewType
    }, {
      immediate: true,
      handler(val) {
        this.init()
      }
    })
  },
  methods: {
    async init() {
      this.getGroups()
    },
    async getGroups() {
      this.query.limit = 999
      const payload = {
        appId: this.appId,
        ...this.query
      }
      const resp = await this.dispatch(
        ResGroupController.queryResGroupsByCriteria,
        payload
      )
      const groups = _.cloneDeep(resp.data.data)
      const types = [
        { name: '功能', id: 'function', icon: 'el-icon-s-opportunity' },
        { name: '页面', id: 'url', icon: 'el-icon-wallet' },
        { name: '数据', id: 'data', icon: 'el-icon-s-data' }
      ]
      if (this.viewType === 'group') {
        // groups.forEach(group => {
        //   group.children = _.cloneDeep(types);
        //   group.children.forEach(g => {
        //     g.parent = group;
        //   });
        // });
        this.treelist = groups
        this.treeData = groups
      } else if (this.viewType === 'type') {
        // types.forEach(r => {
        //   r.children = _.cloneDeep(groups);
        //   r.children.forEach(c => {
        //     c.parent = r;
        //   });
        // });
        this.treeData = types
      }
      this.$nextTick(() => {
        this.$refs['treeBox'].setCurrentKey(this.treeData[0].id)
      })
      this.$emit('update:groupId', this.treeData[0].id)
      this.expandedKeys = [this.treeData[0].id]
      return resp
    },
    openAdd(formType, e) {
      this.dialogVisible = true
      this.formType = formType
      if (formType === 'editgroup') {
        this.selectGroup = e.data
      }
    },
    removeNode(e) {
      this.confirm('确定要删除吗?').then(async() => {
        const defaultGroup = this.appId + '_public_group'
        if (e.data.code === defaultGroup) {
          this.$msg.error('默认分组不能删除!')
          this.$emit('error')
          return
        }
        const payload = [e.data.id]
        const resp = await this.dispatch(
          ResGroupController.deleteByIds,
          payload
        )
        if (!resp.error) {
          this.getGroups()
        }
      })
    },
    nodeChange(node) {
      if (node.appId) {
        this.$emit('update:groupId', node.id)
      } else {
        this.$emit('update:resoureType', node.id)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pm-tree {
  height: calc(100vh - 208px);
  overflow-y: auto;
}

::v-deep .hamburger {
  display: none !important;
}

.custom-tree-node {
  display: flex;
  align-items: center;
}

.svgicon {
  width: 12px;
  height: 10px;
  margin-right: 10px;
}

::v-deep .is-leaf.el-tree-node__expand-icon {
  display: none;
}
</style>
