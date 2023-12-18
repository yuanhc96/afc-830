<template>
  <div>
    <div class="top-block">
      <!-- <el-button type="primary" icon="el-icon-plus" @click="openAdd">新建菜单</el-button> -->
      <el-row>
        <el-col :span="16">
          <PmToolbar>
            <PmToolbarItem v-permission="FuncCode.afc_f_menu_add" plain icon="el-icon-plus" @click="openAdd">
              新建菜单
            </PmToolbarItem>
            <PmToolbarItem
              v-permission="FuncCode.afc_f_menu_del"
              plain
              :disabled="selections.length == 0"
              @click="bulkDelete"
            >
              批量删除
            </PmToolbarItem>
            <PmToolbarItem
              v-permission="FuncCode.afc_f_menu_edit"
              plain
              :disabled="selections.length == 0"
              @click="openChangeMenu"
            >
              调整菜单
            </PmToolbarItem>
            <PmToolbarItem
              plain
              :disabled="selections.length == 0"
              @click="openi18nEdit"
            >
              国际化配置
            </PmToolbarItem>
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
      :id="tableId"
      ref="menuTable"
      v-loading="MenuController.queryMenusByCriteria.loading"
      :height="autoTableHeight"
      border
      stripe
      :data="gridList"
      @sort-change="sortChange"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="编号" prop="code">
        <template slot-scope="scope">
          <el-link @click="openEdit(scope.row)">{{ scope.row.code }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" />
      <el-table-column label="是否子菜单" prop="isLeaf">
        <template slot-scope="scope">
          <span>{{ scope.row.isLeaf == "0" ? "否" : "是" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示顺序" prop="sortNo" />
      <el-table-column label="操作" width="150px">
        <template slot-scope="{ row }">
          <PmToolbar>
            <PmToolbarItem v-permission="FuncCode.afc_f_menu_del" type="text" @click="remove(row)">
              删除
            </PmToolbarItem>
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
      :title="`${selectRow ? '编辑' : '新建'}菜单`"
      :dialog-visible.sync="dialogVisible"
      :loading="btnLoading"
      width="800px"
      ok-text="确定"
      body-class="pt-10 pl-20 pr-20 pb-10"
    >
      <Form
        v-if="dialogVisible"
        slot="form"
        :params="params"
        :mark="mark"
        :is-mobile-leaf="isMobileLeaf"
        :menu="selectRow"
        :form-data="selectRow"
        :loading.sync="btnLoading"
        @success="search"
      />
    </pm-form-dialog>
    <MenuTree
      v-if="treeDialogVisible"
      :tree-dialog-visible.sync="treeDialogVisible"
      :mark="mark"
      :select-menus="selectMenus"
      @submitNode="getselectNode"
    />
    <i18nEdit v-if="i18nDialogVisible" :i18n-dialog-visible.sync="i18nDialogVisible" :select-menus="selections" entity-name="Menu" @i18nSuccess="i18nSuccess" />
  </div>
</template>
<script>
import i18nEdit from '@/components/i18nEdit/editList.vue'
import { MenuController } from '@controller'
import { BaseVue, List, VueUtil } from '@lib'
import Form from './form.vue'
import MenuTree from './menu-tree.vue'
export default {
  components: { Form, MenuTree, i18nEdit },
  mixins: [BaseVue, List],
  props: {
    menu: {},
    mark: {}
  },
  inject: ['currentAppId'],
  data() {
    return {
      optionsIsLeaf: [
        {
          value: '1',
          label: '是'
        },
        {
          value: '0',
          label: '否'
        }
      ],
      btnLoading: false,
      treeDialogVisible: false,
      i18nDialogVisible: false,
      selectMenus: [],
      query: {
        limit: 10,
        offset: 1,
        name: null,
        code: null
      }
    }
  },
  computed: {
    ...VueUtil(this)
      .select([MenuController])
      .state(),
    params() {
      if (this.menu) {
        return { appMenu: { menuid: this.menu.id }}
      } else {
        return null
      }
    },
    isMobileLeaf() {
      return this.mark === 'mobile' && this.menu && this.menu.isLeaf === '0' && this.menu.parentId === 'root'
    },
    appId() {
      return (this.$route.query ? this.$route.query.appId : null) || this.currentAppId || null
    }
  },
  watch: {
    menu: {
      immediate: true,
      handler(newV, oldV) {
        this.query.name = null
        this.query.code = null
        this.search()
      }
    },

    'MenuController.create': 'search',
    'MenuController.update': 'search',
    'MenuController.deleteByIds': 'search'
  },
  mounted() {
    //      this.search()
  },
  methods: {
    async removeBody(row) {
      const payload = [row.id]
      const resp = await this.dispatch(MenuController.deleteByIds, payload)
      return resp
    },
    async searchBody() {
      const q = this.otherQuery(this.query)
      let menuType = null
      if (this.appId) {
        menuType = this.mark && this.mark === 'mobile' ? 'mobile' : 'pc'
      } else {
        menuType = this.mark && this.mark === 'mobile' ? 'mobile' : null
      }
      const payload = {
        ...q,
        parentId: this.menu.id,
        tenantId: this.currentTenant,
        orderFields: 'sortNo',
        orderDirection: 'ASC',
        appId: this.appId || null,
        menuType
      }
      const resp = await this.dispatch(MenuController.queryMenusByCriteria, payload)
      return resp
    },
    openChangeMenu() {
      this.selectMenus = this.selections
      this.treeDialogVisible = true
    },
    getselectNode(parentNode) {
      if (parentNode) {
        // 判断目标节点是否是其本身，是->不做修改
        let menus = this.selections.filter((item) => item.id != parentNode.data.id)
        if (parentNode.data.id === 'root') {
          // 叶子节点不能转移到根节点
          menus = menus.filter((item) => item.isLeaf !== '1')
        }
        if (this.mark === 'mobile') {
        // 移动端非叶子节点不能转移
          menus = menus.filter((item) => item.isLeaf !== '0')
        }
        if (menus.length) {
          const payload = { menus: menus, parentId: parentNode.data.id }
          this.dispatch(MenuController.updateParentId, payload).then((resp) => {
            if (!resp.message) {
              this.$msg.success('调整菜单成功!')
              this.pmSearch()
            } else {
              this.$msg.error(`${resp.message}`)
            }
          })
        } else {
          this.$msg.warning('没有符合的菜单可以调整!')
        }
      }
    },

    async bulkDelete() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const payload = this.selections.map((sel) => {
            return sel.id
          })
          const resp = await this.dispatch(MenuController.deleteByIds, payload)
          if (!resp.error) {
            await this.pmSearch()
            this.$msg.success('删除成功')
          }
        })
        .catch(() => {})
    },

    openi18nEdit() {
      this.i18nDialogVisible = true
    },
    i18nSuccess() {
      this.$refs.menuTable.clearSelection()// 删除后清空之前选择的数据
    }
  }
}
</script>
