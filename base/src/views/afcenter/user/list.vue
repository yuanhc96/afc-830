<template>
  <div class="pl-20 pr-20 pb-20">
    <div class="top-block">
      <el-row>
        <el-col :span="16">
          <PmToolbar>
            <PmToolbarItem
              v-permission="FuncCode.afc_f_user_add"
              icon="el-icon-plus"
              :disabled="enableOpt"
              plain
              @click="openAdd"
            >新建账号</PmToolbarItem>
          </PmToolbar>
        </el-col>
        <el-col :span="8" class="text-right">
          <PmSearch
            class="float-right"
            style="width: 300px"
            :query.sync="query"
            default-prop="code"
            placeholder="搜索账号"
            @search="pmSearch"
          >
            <template slot="body">
              <el-form-item label="账号" prop="code">
                <el-input v-model="query.code" clearable />
              </el-form-item>
              <el-form-item label="是否锁定" prop="isLock">
                <el-select v-model="query.isLock" style="width:100%" placeholder="">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <pm-table
      :id="tableId"
      :height="autoTableHeight"
      border
      stripe
      :columns="columns"
      :table-data="gridList"
      auto-select-row
      @selection-change="selectChange"
    >
      <div

        slot="status"
        slot-scope="scope"
        class="inline-action"
      >
        <span>{{ scope.row.status === "1" ? "启用" : "禁用" }}</span>
      </div>
      <div

        slot="block"
        slot-scope="scope"
        class="inline-action"
      >
        <span>{{ scope.row.isLock === "0" ? "未锁定" : "锁定" }}</span>
      </div>
      <div slot="code" slot-scope="scope" class="inline-action">
        <el-link v-if="allow(FuncCode.afc_f_user_edit)" @click="editOpen(scope.row,'first')">{{ scope.row.code }}</el-link>
        <span v-else>{{ scope.row.code }}</span>
      </div>
      <div slot="name" slot-scope="scope" class="inline-action">
        {{
          scope.row.name
        }}
      </div>
      <div slot="roleCount" slot-scope="scope" class="inline-action">
        <el-link @click="editOpen(scope.row,'second')">{{ scope.row.roleCount }}</el-link>
      </div>
      <div slot="action" slot-scope="scope" class="inline-action">
        <PmToolbar>
          <PmToolbarItem
            type="text"
            size="mini"
            @click="remove(scope.row)"
          >删除</PmToolbarItem>
          <PmToolbarItem type="text" size="mini" @click="openDisable(scope.row)">{{
            scope.row.status === "1" ? "禁用" : "启用"
          }}</PmToolbarItem>
          <PmToolbarItem type="text" size="mini" @click="resetPassword(scope.row)">
            重置密码
          </PmToolbarItem>
          <!-- <PmToolbarGroup type="text" v-if="scope.row.isLock==='1'"> -->
          <PmToolbarItem v-if="scope.row.isLock==='1'" v-permission="FuncCode.afc_f_unpark_user_edit" type="text" size="mini" @click="openBlock(scope.row)">解锁</PmToolbarItem>
          <!-- </PmToolbarGroup> -->
        </PmToolbar>
      </div>
    </pm-table>
    <Pagination
      :selections="selections"
      :page-size="query.limit"
      :current-page.sync="query.offset"
      :total="gridTotal"
      @size-change="changePageSizer"
      @current-change="changePage"
    />
    <PmFormDialog
      width="480px"
      top="60px"
      :title="'新建账号'"
      :loading="btnLoding"
      :dialog-visible.sync="dialogVisible"
      ok-text="确定"
      body-class="pt-10 pl-20 pr-20 pb-10"
    >
      <Form slot="form" :form-data="selectRow" :dialog-visible="dialogVisible" @success="search" />
    </PmFormDialog>
    <Tabs
      :title="activeName === 'first' ? '账号' : '角色'"
      :show-footer="activeName === 'first'"
      :dialog-visible.sync="editVisible"
      :active-name="activeName"
      :items="items"
      :width="activeName === 'first' ? '480px' : '800px'"
      body-class="pl-0 pr-0"
    >
      <Form slot="form" :form-data.sync="selectRow2" :dialog-visible="editVisible" @success="search" />
      <Role
        slot="role"
        style="margin-top: -10px;"
        :params="params"
        :func-code="funcCode"
        :api-name="apiName"
        height="calc(100vh - 315px)"
        class="pb-10"
      />
    </Tabs>
    <el-dialog title="禁用账号" :visible.sync="disableShow">
      <p><span>是否禁用员工：</span><span><el-switch v-model="disableFlag" /></span></p>
      <template slot="footer">
        <el-button @click="statusWrap(false)">取消</el-button>
        <el-button type="primary" @click="statusWrap(true)">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { UserController } from '@controller'
import { BaseVue, List, VueUtil } from '@lib'
import Account from './account.vue'
import Role from './components/roleComponent/index.vue'
import Form from './form'
import Tabs from './tabs.vue'
export default {
  name: 'user-list',
  components: { Form, Tabs, Role, Account },
  mixins: [BaseVue, List],
  props: {
    orgData: {},
    dimensionData: {},
  },
  data() {
    return {
      options: [{ label: '未锁定', value: '0' }, { label: '已锁定', value: '1' }],
      apiName: {
        query: 'UserController.queryRole',
        delete: 'UserController.deleteRole',
        disable: 'UserController.disable',
        enable: 'UserController.enable',
        create: 'UserController.create',
      },
      disableFlag: false,
      selectRow2: null,
      editVisible: false,
      params: {
        query: {},
        delete: {
          path: {},
          key: ''
        },
        create: {
          path: {},
          key: ''
        },
        status: ''
      },
      items: [
        { label: '详情', name: 'first', slot: 'form' },
        { label: '角色', name: 'second', slot: 'role' },
      ],
      activeName: 'first',
      columns: [
        { label: '账号', prop: 'code', scope: 'code' },
        { label: '所属员工', scope: 'name' },
        { label: '所属机构', prop: 'orgName' },
        { label: '角色数量', prop: 'roleCount', scope: 'roleCount' },
        { label: '是否禁用', scope: 'status' },
        { label: '是否锁定', scope: 'block' },
        { label: '操作', scope: 'action', width: '200px' },
      ],
      disableShow: false,
      opeRow: null,
    }
  },
  computed: {
    ...VueUtil(this)
      .select([UserController])
      .state(),
    btnLoding() {
      return this.UserController.update.loading || this.UserController.create.loading
    },
    funcCode() {
      return { add: this.FuncCode.afc_f_user_role_add,
        del: this.FuncCode.afc_f_user_role_del }
    },
  },
  watch: {
    editVisible(val) {
      if (!val) {
        this.selectRow = null
        this.search()
      }
    },
    selectRow2: {
      immediate: true,
      handler: function(value) {
        if (value) {
          this.params.query = {
            userId: value.id
          }
          this.params.delete = {
            path: { userId: value.id },
            key: 'roleIds'
          }
          this.params.create = {
            path: { userId: value.id },
            key: 'roleIds'
          }
          this.params.statusKey = 'userId'
        }
      }
    }

  },
  mounted() {
    this.search()
  },
  methods: {
    async openBlock(row) {
      const resp = await this.dispatch(UserController.unparkUser, { userId: row.id })
      if (!resp.error) {
        this.$msg.success('操作成功')
        this.search()
      }
    },
    resetPassword(row) {
      this.$confirm('此操作将初始化密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async() => {
        const resp = await this.dispatch(UserController.initPassword, { userId: row.id })
        if (!resp.error) {
          this.$msg.success('操作成功!')
        }
      }).catch()
    },
    editOpen(row, activeName) {
      if (activeName) {
        this.activeName = activeName
      }
      this.selectRow2 = row
      if (activeName === 'first') {
        this.items = [{ label: '详情', name: 'first', slot: 'form' }]
      } else if (activeName === 'second') {
        this.items = [{ label: '角色', name: 'second', slot: 'role' }]
      }
      this.editVisible = true
    },
    openDisable(row) {
      this.opeRow = row
      if (this.opeRow.status !== '1') {
        this.handleStatus()
      } else { this.disableShow = true }
    },
    statusWrap(value) {
      if (value) {
        this.handleStatus()
      }
      this.disableFlag = false
      this.disableShow = false
    },
    async handleStatus() {
      let resp
      if (this.opeRow.status === '1') {
        resp = await this.dispatch(UserController.disableEmployee, {
          userId: this.opeRow.id,
          isDisableEmp: this.disableFlag,
        })
      } else {
        resp = await this.dispatch(UserController.enableEmployee, {
          userId: this.opeRow.id,
        })
      }
      if (!resp.error) {
        this.$msg.success('操作成功！')
        this.search()
      }
    },
    handleSuccess(form) {
      this.search()
      this.dialogVisible = false
      this.emit('success', form)
    },
    // 列表 选择改变
    selectChange(selection) {
      this.selectRow = selection
    },
    async searchBody() {
      const payload = { ...this.query }
      const resp = await this.dispatch(UserController.queryUsers, payload)
      return resp
    },
    async removeBody(row) {
      const resp = await this.dispatch(UserController.deleteByIds, [row.id])
      return resp
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep  .el-tabs__header {
    display: none !important;
}
</style>
