<template>
  <div>
    <div :class="businessObjId ? 'top-block notop' : 'top-block'">
      <el-row>
        <el-col :span="16">
          <PmToolbar>
            <PmToolbarItem
              v-permission="FuncCode.afc_f_role_add"
              plain
              icon="el-icon-plus"
              @click="openAdd"
            >新建角色</PmToolbarItem>
            <PmToolbarItem
              v-permission="FuncCode.afc_f_role_del"
              plain
              :disabled="selections.length == 0"
              @click="deleteClick"
            >批量删除</PmToolbarItem>
          </PmToolbar>
        </el-col>
        <el-col :span="8" class="text-right">
          <PmSearch
            ref="searchForm"
            style="width: 300px"
            class="float-right"
            :query.sync="query"
            default-prop="name"
            placeholder="搜索角色名称"
            @search="pmSearch"
          >
            <template slot="body">
              <el-form-item label="角色名称" prop="name">
                <el-input
                  v-model="query.name"
                  v-focus
                  clearable
                  @keypress.native.enter="searchEnter"
                />
              </el-form-item>
              <el-form-item label="角色编号" prop="code">
                <el-input
                  v-model="query.code"
                  clearable
                  @keypress.native.enter="searchEnter"
                />
              </el-form-item>
            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <el-table
      :id="tableId"
      v-loading="RoleController.queryRolesWithPage.loading"
      :highlight-current-row="true"
      :height="autoTableHeight"
      border
      stripe
      :data="gridList"
      @sort-change="sortChange"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
        sortable="code"
        label="编号"
        prop="code"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-link
            v-if="allow(FuncCode.afc_f_role_edit)"
            @click="gotoDetail(scope.row, 0)"
          >{{ scope.row.code }}</el-link>
          <span v-else>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column
        sortable="name"
        label="名称"
        prop="name"
        show-overflow-tooltip
      />
      <el-table-column
        label="资源权限数量"
        prop="resAmount"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-link @click="gotoDetail(scope.row, 1)">{{
            scope.row.resAmount || 0
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        v-if="type !== 'businessObject'"
        label="成员数量"
        prop="memberAmount"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-link @click="gotoDetail(scope.row, 2)">{{
            scope.row.memberAmount || 0
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="{ row }">
          <PmToolbar>
            <PmToolbarItem
              v-permission="FuncCode.afc_f_role_del"
              type="text"
              @click="remove(row)"
            >删除</PmToolbarItem>
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
    <FormDialog
      :dialog-visible.sync="dialogVisible"
      v-bind="$props"
      @success="search"
    />
  </div>
</template>

<script>
import { RoleController } from '@controller'
import { BaseVue, Form, List, VueUtil } from '@lib'
import FormDialog from '../form.vue'
export default {
  name: 'role',
  components: { FormDialog },
  mixins: [BaseVue, List, Form],
  props: {
    type: {
      type: String,
    },
    businessObjId: {
      type: String,
    },
    currentAppId: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...VueUtil(this)
      .select([RoleController])
      .state(),
    appId() {
      return (this.$route.query ? this.$route.query.appId : null) || this.currentAppId || null
    }
  },
  data() {
    return {
      tableHeight: 'calc(100vh - 204px)',
    }
  },
  watch: {
    businessObjId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.search()
        }
      },
    },
    type: {
      immediate: true,
      handler(val) {
        if (val) {
          this.search()
        }
      },
    },
  },
  mounted() {
    this.search()
  },
  activated() {
    this.search()
  },
  methods: {
    searchEnter() {
      if (this.$refs.searchForm) {
        // 高级搜索 enter
        this.$refs.searchForm.searchQuery = { ...this.query }
        this.$refs.searchForm.initOptions()
        this.$refs.searchForm.visible = false
      }
      this.pmSearch()
    },
    async searchBody() {
      if (this.appId) {
        // 查询应用角色
        const query = this.otherQuery(this.query)
        const payload = { appId: this.type, ...query }
        const resp = await this.dispatch(
          RoleController.queryAppRolesWithPage,
          payload
        )
        return resp
      } else {
        const query = this.otherQuery(this.query)
        const payload = { type: this.type, ...query }
        // 业务对象
        if (this.type == 'businessObject' && this.businessObjId) {
          payload.businessObjId = this.businessObjId
        }
        const resp = await this.dispatch(
          RoleController.queryRolesWithPage,
          payload
        )
        return resp
      }
    },
    async removeBody(row) {
      const payload = [row.id]
      const resp = await this.dispatch(RoleController.deleteByIds, payload)
      return resp
    },
    // 批量删除
    async deleteClick() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async() => {
          const payload = this.selections.map((sel) => {
            return sel.id
          })
          const resp = await this.dispatch(RoleController.deleteByIds, payload)
          if (!resp.error) {
            this.pmSearch()
            this.$msg.success('删除成功')
          }
        })
        .catch(() => {})
    },
    gotoDetail(app, tab) {
      this.$emit('gotoDetail', app, tab, this.$props)
    },
  },
}
</script>
<style lang="scss" scoped>
.notop {
  padding: 0px 0px 8px 0px !important;
}
</style>
