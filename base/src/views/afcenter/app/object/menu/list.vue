<template>
  <div class="pl-10 pr-10 ">
    <div class="top-block">
      <!-- <el-button type="primary" icon="el-icon-plus" @click="openAdd">新建菜单</el-button> -->
      <el-row>
        <el-col :span="16">
          <PmToolbar class="ml-5 ">
            <PmToolbarItem v-permission="FuncCode.afc_f_menu_add" plain icon="el-icon-plus" @click="openAdd">新建菜单</PmToolbarItem>
            <PmToolbarItem v-permission="FuncCode.afc_f_menu_del" plain :disabled="selections.length==0" @click="bulkDelete">批量删除</PmToolbarItem>
            <PmToolbarItem v-permission="FuncCode.afc_f_menu_edit" plain :disabled="selections.length==0" @click="openChangeMenu">调整菜单</PmToolbarItem>
          </PmToolbar>

        </el-col>
        <el-col :span="8" class="text-right">
          <PmSearch
            class="float-right"
            style="width: 300px"
            :query.sync="query"
            default-prop="name"
            placeholder="搜索菜单名称"
            @search="pmSearch"
          >
            <template slot="body">
              <el-form-item label="菜单名称" prop="name">
                <el-input v-model="query.name" clearable />
              </el-form-item>
              <el-form-item label="菜单编号" prop="code">
                <el-input v-model="query.code" v-focus clearable />
              </el-form-item>

            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-loading="MenuController.queryMenusByCriteria.loading"
      height="calc(100vh - 256px)"
      :data="gridList"
      border
      stripe
      @sort-change="sortChange"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="菜单编号" prop="code">
        <template slot-scope="scope">
          <el-link @click="openEdit(scope.row)">{{ scope.row.code }}</el-link>

        </template>
      </el-table-column>
      <el-table-column label="菜单名称" prop="name" />
      <el-table-column label="是否子菜单" prop="isLeaf">
        <template slot-scope="scope">
          <span>{{ scope.row.isLeaf=='0'?'否':'是' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示顺序" prop="sortNo" />
      <el-table-column label="操作" width="100px">
        <template slot-scope="{ row }">
          <PmToolbar>
            <PmToolbarItem v-permission="FuncCode.afc_f_menu_del" type="text" @click="remove(row)">删除</PmToolbarItem>
          </PmToolbar>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :selections="selections"
      :page-size="query.limit"
      :current-page.sync="query.offset"
      :total="gridTotal"
      @size-change="changePageSizer"
      @current-change="changePage"
    />
    <pm-form-dialog
      :title="`${selectRow ? '编辑':'新建'}菜单`"
      :dialog-visible.sync="dialogVisible"
      :loading="btnLoading"
      width="860px"
      ok-text="确定"
    >
      <Form slot="form" :app-id="appId" :business-obj-id="businessObjId" :params="params" :menu="selectRow" :form-data="selectRow" :loading.sync="btnLoading" @success="search" />
    </pm-form-dialog>
    <MenuTree v-if="treeDialogVisible" :business-obj-id="businessObjId" :tree-dialog-visible.sync="treeDialogVisible" @submitNode="getselectNode" />

  </div>
</template>
<script>
import { MenuController } from '@controller'
import { BaseVue, List, VueUtil } from '@lib'
import Form from './form.vue'
import MenuTree from './menu-tree.vue'
export default {
  components: { Form, MenuTree },
  mixins: [BaseVue, List],
  props: {
    menu: {},
    businessObjId: {
      type: String,
      default: null,
    },
    appId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      optionsIsLeaf: [
        {
          value: '1',
          label: '是'
        }, {
          value: '0',
          label: '否'
        },
      ],
      btnLoading: false,
      treeDialogVisible: false
    }
  },
  computed: {
    ...VueUtil(this)
      .select([MenuController])
      .state(),
    params() {
      if (this.menu) {
        return { 'appMenu': { 'menuid': this.menu.id }}
      } else {
        return null
      }
    },
  },
  watch: {
    menu: {
      immediate: true,
      handler: 'search',
    },
    'MenuController.create': 'search',
    'MenuController.update': 'search',
    'MenuController.deleteByIds': 'search'
  },
  mounted() {
    this.search()
  },
  methods: {
    async removeBody(row) {
      const payload = [row.id]
      const resp = await this.dispatch(MenuController.deleteByIds, payload)
      return resp
    },
    async searchBody() {
      const q = this.otherQuery(this.query)
      const payload = {
        parentId: this.menu.id,
        menuType: 'businessObject',
        businessObjId: this.businessObjId,
        orderFields: 'sortNo',
        orderDirection: 'ASC',
        ...q
      }
      const resp = await this.dispatch(MenuController.queryMenusByCriteria, payload)
      return resp
    },
    openChangeMenu() {
      this.treeDialogVisible = true
    },
    getselectNode(parentNode) {
      // 判断目标节点是否是其本身，是->不做修改
      const isSelf = this.selections.filter(item => item.id === parentNode.data.id)
      if (isSelf.length > 0) {
        this.$msg.warning(`${parentNode.data.name}所选父节点为其本身节点,不做修改`)
      }
      const menus = this.selections.filter(item => item.id != parentNode.data.id)
      const payload = { menus: menus, parentId: parentNode.data.id }
      this.dispatch(MenuController.updateParentId, payload).then(resp => {
        if (!resp.error) {
          this.$msg.success('调整菜单成功!')
          this.pmSearch()
        }
      })
    },
    async bulkDelete() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async() => {
        const payload = this.selections.map(sel => {
          return sel.id
        })
        const resp = await this.dispatch(MenuController.deleteByIds, payload)
        if (!resp.error) {
          this.pmSearch()
          this.$msg.success('删除成功')
        }
      })
        .catch(() => {

        })
    },
  }
}
</script>
