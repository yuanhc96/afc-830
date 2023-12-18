<template>
  <div>
    <pm-table
      height="calc(100vh - 377px)"
      :columns="columns"
      :table-data="gridList"
      auto-select-row
      @selection-change="selectChange"
      border
      stripe
    >
      <div
        v-if="!enableOpt"
        slot="status"
        slot-scope="scope"
        class="inline-action"
      >
        <span>{{ scope.row.status === "1" ? "启用" : "禁用" }}</span>
      </div>

      <div slot="action" slot-scope="scope" class="inline-action">
        <PmToolbar>
          <PmToolbarItem type="text" size="mini" @click="openDisable(scope.row)">{{
            scope.row.status === "1" ? "禁用" : "启用"
          }}</PmToolbarItem>
          <PmToolbarItem v-if="scope.row.isLock==='1'" type="text" size="mini" @click="handleStatus(scope.row)">解锁</PmToolbarItem>
          <PmToolbarItem type="text" size="mini" @click="resetPassword(scope.row)">
            重置密码
          </PmToolbarItem>
        </PmToolbar>
      </div>
    </pm-table>
    <PmFormDialog :dialog-visible.sync="dialogVisible" width="800px" />
    <el-dialog title="禁用账号" append-to-body :visible.sync="disableShow">
      <p><span>是否禁用员工：</span><span><el-switch v-model="disableFlag" /></span></p>
      <template slot="footer">
        <el-button @click="statusWrap(false)">取消</el-button>
        <el-button type="primary" @click="statusWrap(true)">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { EmployeeController, UserController } from '@controller'
import { BaseVue, List } from '@lib'
export default {
  name: '',
  components: {},
  mixins: [BaseVue, List],
  props: {
    userData: {},
  },
  data() {
    return {
      columns: [
        { label: '编码', prop: 'code' },
        { label: '名称', prop: 'name' },
        { label: '状态', prop: 'status', scope: 'status' },
        { label: '操作', scope: 'action', width: 150 },
      ],
      disableFlag: false,
      disableShow: false,
      opeRow: null,
    }
  },
  computed: {},
  watch: {
    userData: {
      handler: function(value) {
        if (value) {
          this.search()
        }
      }
    }
  },
  created() {
    this.search()
  },
  methods: {
    // 禁用/启用 员工和账号
    async handleStatus() {
      let resp
      if (this.opeRow.status === '1') {
        resp = await this.dispatch(UserController.disableEmployee, {
          userId: this.opeRow.id,
          isDisableEmp: this.disableFlag
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
      const payload = { employeeId: this.userData.id }
      const resp = await this.dispatch(
        EmployeeController.queryUsersInEmployee,
        payload
      )
      return resp
    },
    async removeBody(row) {
      // const resp = await this.dispatch(OrgController.deleteByIds, [row.id]);
      // return resp;
    },
  },
}
</script>
<style></style>
