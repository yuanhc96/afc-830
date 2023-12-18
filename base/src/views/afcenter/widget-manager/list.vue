<template>
  <div class="pl-20 pr-20">
    <div class="top-block">
      <el-row>
        <el-col :span="16">
          <PmToolbar>
            <PmToolbarItem
              v-permission="FuncCode.afc_f_menu_add"
              plain
              icon="el-icon-plus"
              @click="openAdd"
            >
              新建widget
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
            placeholder="搜索widget名称"
            @search="pmSearch"
          >
            <template slot="body">
              <el-form-item label="widget名称" prop="name">
                <el-input v-model="query.name" clearable />
              </el-form-item>
              <el-form-item label="widget编号" prop="code">
                <el-input v-model="query.code" v-focus clearable />
              </el-form-item>
            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <el-table
      :id="tableId"
      ref="widgetTable"
      v-loading="WidgetController.queryWithPage.loading"
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
      <el-table-column label="绑定角色" prop="roleCount">
        <template slot-scope="scope">
          <el-link @click="openPremission(scope.row)">{{
            scope.row.roleCount
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="{ row }">
          <PmToolbar>
            <PmToolbarItem
              v-permission="FuncCode.afc_f_menu_del"
              type="text"
              @click="remove(row)"
            >
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
      :title="`${selectRow ? '编辑' : '新建'}widget`"
      :dialog-visible.sync="dialogVisible"
      :loading="btnLoading"
      width="480px"
      top="60px"
      ok-text="确定"
      body-class="pt-10 pl-20 pr-20 pb-10"
    >
      <Form
        v-if="dialogVisible"
        slot="form"
        :mark="mark"
        :data="selectRow"
        :loading.sync="btnLoading"
        @success="search"
      />
    </pm-form-dialog>
    <el-dialog
      ref="positionDialog"
      append-to-body
      width="800px"
      top="60px"
      :visible.sync="premissionDialogVisible"
      title="授权"
    >
      <Role
        v-if="premissionDialogVisible"
        style="margin-top: -10px"
        height="460px"
        :widget-id="widgetId"
      />
    </el-dialog>
    <i18nEdit
      v-if="i18nDialogVisible"
      :i18n-dialog-visible.sync="i18nDialogVisible"
      :select-menus="selections"
      entity-name="Widget"
      @i18nSuccess="i18nSuccess"
    />
  </div>
</template>
<script>
import { WidgetController } from '@controller'
import { BaseVue, List, VueUtil } from '@lib'
import Form from './form.vue'
import Role from './role-list/index.vue'
import i18nEdit from '@/components/i18nEdit/editList.vue'
export default {
  components: { i18nEdit, Form, Role },
  mixins: [BaseVue, List],
  props: {
    mark: {},
  },
  data() {
    return {
      i18nDialogVisible: false,
      btnLoading: false,
      premissionDialogVisible: false,
      selectWidgets: [],
      query: {
        limit: 10,
        offset: 1,
        name: null,
        code: null,
      },
      widgetId: null,
    }
  },
  computed: {
    ...VueUtil(this).select([WidgetController]).state(),
    appId() {
      return this.$route.query ? this.$route.query.appId : null
    },
  },
  watch: {
    menu: {
      immediate: true,
      handler(newV, oldV) {
        this.query.name = null
        this.query.code = null
        this.search()
      },
    },
  },
  mounted() {
    // this.search()
  },
  methods: {
    i18nSuccess() {
      this.selections = []
      this.$refs.widgetTable.clearSelection()// 删除后清空之前选择的数据
    },
    openi18nEdit() {
      this.i18nDialogVisible = true
    },
    async removeBody(row) {
      const codes = [row.code]
      const resp = await this.dispatch(WidgetController.delete, { codes })
      return resp
    },
    async searchBody() {
      const q = this.otherQuery(this.query)
      const payload = {
        ...q,
        codes: q.code,
        tenantId: this.currentTenant,
        orderFields: 'sortNo',
        orderDirection: 'ASC',
        types: this.appId ? 'app' : 'platform',
      }
      if (this.appId) {
        payload.appIds = [this.appId]
      }
      const resp = await this.dispatch(WidgetController.queryWithPage, payload)
      return resp
    },
    async bulkDelete() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const codes = this.selections.map((sel) => {
            return sel.code
          })
          const resp = await this.dispatch(WidgetController.delete, { codes })
          if (!resp.error) {
            await this.pmSearch()
            this.$msg.success('删除成功')
          }
        })
        .catch(() => {})
    },
    openPremission(row) {
      this.widgetId = row.id
      this.premissionDialogVisible = true
    },
    closePosition() {
      this.premissionDialogVisible = false
      this.pmSearch()
    },
  },
}
</script>
