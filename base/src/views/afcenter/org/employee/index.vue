<comment>
// 员工信息
</comment>
<template>
  <div>
    <div class="top-block">
      <el-row>
        <el-col :span="16">
          <PmToolbar>
            <PmToolbarItem
              v-if="!isRootNode"
              v-permission="FuncCode.afc_f_employee_add"
              icon="el-icon-plus"
              plain
              :style="{'margin-right':isMain?'3px':'6px'}"
              :disabled="enableOpt"
              @click="openEmployee"
            >新建员工</PmToolbarItem>
            <PmToolbarGroup v-if="!isRootNode&&this.isMain" style="margin-right:5px">
              <PmToolbarItem
                v-permission="FuncCode.afc_f_employee_add"
                plain
                :disabled="enableOpt"
                @click="openSelect"
              >选择已有员工</PmToolbarItem>
            </PmToolbarGroup>
            <PmToolbarItem plain icon="el-icon-download" @click="EmployeeExport()">导出</PmToolbarItem>
            <PmToolbarItem plain @click="openDownload()">导出记录</PmToolbarItem>
            <!-- <span class="download-more" @click="openDownload"><i class="el-icon-more"  ></i></span> -->
          </PmToolbar>
        </el-col>
        <el-col :span="8" class="text-right">
          <PmSearch
            class="float-right"
            style="width: 300px"
            :query.sync="query"
            default-prop="name"
            placeholder="搜索员工姓名"
            @search="pmSearch"
          >
            <template slot="body">
              <el-form-item label="员工编号" prop="code">
                <el-input v-model="query.code" clearable />
              </el-form-item>
              <el-form-item label="员工姓名" prop="name">
                <el-input v-model="query.name" clearable />
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
      <div slot="code" slot-scope="scope" class="inline-action">
        <el-link v-if="allow(FuncCode.afc_f_employee_edit)" @click="handleClick('base',scope.row)">{{ scope.row.code }}</el-link>
        <span v-else>{{ scope.row.code }}</span>
      </div>
      <div slot="gender" slot-scope="scope" class="inline-action">
        <span>{{ genderTypes[scope.row.gender] || '未知' }}</span>
      </div>
      <div slot="status" slot-scope="scope" class="inline-action">
        <!-- <el-select v-model="scope.row.status" @change="stausChange(scope.row.status,scope.row)" placeholder="">
          <el-option v-for="(item,index) in statusOptions" :key="index" :value="item.value" :label="item.label"></el-option>
        </el-select> -->
        <span>{{ scope.row.status==='1'?"启用":"禁用" }}</span>
      </div>
      <div slot="position" slot-scope="scope" class="inline-action">
        <el-link @click="handleClick('position',scope.row)">{{ scope.row.positionName }}</el-link>
      </div>
      <div slot="action" slot-scope="{row}" class="inline-action">
        <PmToolbar>
          <PmToolbarItem v-permission="FuncCode.afc_f_employee_add" size="mini" :disabled="disabled" type="text" @click="openDisable(row)">{{ row.status==='1'?"禁用":"启用" }}</PmToolbarItem>
          <PmToolbarItem v-permission="FuncCode.afc_f_employee_add" size="mini" :disabled="disabled" type="text" @click="remove(row)">删除</PmToolbarItem>
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
      :title="`${selectRow ? '编辑' : '新建'}员工`"
      :dialog-visible.sync="dialogVisible"
      ok-text="确定"
      width="800px"
      top="30px"
      :loading="btnLoading"
      body-class="pt-10 pl-20 pr-20 pb-10"
    >
      <Form
        slot="form"
        style="margin-top: 0;margin-bottom: 0;"
        :is-root-node="isRootNode"
        :form-data="selectRow"
        :org-data="newOrgData"
        @success="closeAdd"
      />
    </PmFormDialog>
    <!--  -->
    <PmFormDialog
      :title="`${selectRow ? '编辑' : '新建'}员工`"
      :dialog-visible.sync="employeeVisible"
      ok-text="确定"
      top="60px"
      :loading="btnLoading"
      width="800px"
    >
      <UserForm
        slot="form"
        :form-data="selectRow"
        :org-data="newOrgData"
        @success="search"
      />
    </PmFormDialog>
    <PmFormDialog
      title="选择已有员工"
      :dialog-visible.sync="selectVisible"
      ok-text="确定"
      :loading="btnLoading"
      width="800px"
    >
      <UserForm
        slot="form"
        :validate="isMain"
        :form-data="selectRow"
        :org-data="newOrgData"
        @success="closeAdd"
      />
    </PmFormDialog>
    <pm-dialog
      ref="positionDialog"
      width="800px"
      :visible.sync="positionVisible"
      title="员工管理"
      top="60px"
    >
      <employeeTabs
        ref="employeeTabs"
        :is-root-node="isRootNode"
        :disabled="disabled"
        :org-data="newOrgData||orgData"
        :form-data="selectRow2"
        :tab-name.sync="activeName"
        :dialog-visible="positionVisible"
        :dimension-data="dimensionData"
        style="margin-top: -10px"
        :employee-data="selectRow2"
        @success="tabsSuccess"
      />
      <div slot="footer">
        <el-button
          :disabled="false"
          size="mini"
          @click="closePosition('cancel')"
        >关闭</el-button>
        <el-button v-show="buttonVisibel" :loading="btnLoading" size="mini" type="primary" @click="hidden">确定</el-button>
      </div>
    </pm-dialog>
    <el-dialog title="禁用员工" :visible.sync="disableShow">
      <p><span>是否禁用全部账号：</span><span><el-switch v-model="disableFlag" /></span></p>
      <template slot="footer">
        <el-button @click="statusWrap(false)">取消</el-button>
        <el-button type="primary" @click="statusWrap(true)">确定</el-button>
      </template>
    </el-dialog>
    <el-dialog width="800px" top="60px" title="导出记录" :visible.sync="downloadVisible">
      <DownloadList :dialog-visible="downloadVisible" :data="{dimension:dimensionData,org:newOrgData}" />
    </el-dialog>
  </div>
</template>

<script>
import { DictTypeController, EmployeeController, OrgController } from '@controller'
import { BaseVue, List, VueUtil } from '@lib'
import ajaxUtil from '@lib/ajaxUtil'
import { mapGetters } from 'vuex'
import DownloadList from './downloadList.vue'
import Form from './form.vue'
import Position from './position/index.vue'
import employeeTabs from './tabs'
import UserForm from './userForm.vue'
// import authForm from "../form.vue";
export default {
  name: '',
  inject: ['getDimensionData'],
  components: { Form, Position, UserForm, employeeTabs, DownloadList },
  mixins: [BaseVue, List],
  props: {
    orgData: {},
    dimensionData: {},
    disabled: {
      default: function() {
        return false
      }
    }

  },
  data() {
    return {
      downloadVisible: false,
      dicttypeid: 'gender',
      genderTypes: {},
      selectRow2: null,
      employeeVisible: false,
      addEmployee: false,
      statusOptions: [
        { label: '禁用', value: '0' },
        { label: '正式', value: '1' },
        { label: '试用', value: '2' },
        { label: '临时', value: '3' },
      ],
      positionVisible: false,
      employeeData: null,
      selectVisible: false,
      activeName: 'base',
      columns: [
        { label: '编号', prop: 'code', scope: 'code', width: '150px' },
        { label: '姓名', prop: 'name', width: '150px' },
        { label: '性别', scope: 'gender', width: '150px' },
        { label: '岗位信息', prop: 'positionName', scope: 'position', 'show-overflow-tooltip': true },
        // { label: "岗位信息", prop: "managerId" },
        { label: '操作', scope: 'action', width: 120 },
      ],
      newOrgData: {}, // 根节点的机构Id需要重新获取
      disableFlag: false,
      disableShow: false,
      opeRow: null,
    }
  },
  watch: {
    positionVisible(value) {
      if (!value) {
        this.search()
      }
    },
    orgData: {
      immediate: true,
      deep: true,
      handler(value) {
        this.newOrgData = _.cloneDeep(this.orgData)
        if (value) this.search()
      }
    },
    dimensionData(value) {
      if (value) this.gridData = []
    },
    dicts: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          const objectType = this.dicts[this.dicttypeid] || []
          this.genderTypes = {}
          for (const item of objectType) {
            this.genderTypes[item.code] = item.name
          }
        }
      }
    },
  },
  computed: {
    ...VueUtil(this)
      .select([EmployeeController, OrgController, DictTypeController])
      .state(),
    btnLoading() {
      return this.EmployeeController.create.loading || this.EmployeeController.update.loading
    },
    height() {
      if (this.userInfo.attributes.isOrgManager) {
        return 'calc(100vh - 186px)'
      } else {
        return 'calc(100vh - 208px)'
      }
    },
    // 判断主维度
    enableOpt() {
      if (this.orgData && this.dimensionData && this.dimensionData.id !== this.orgData.dimensionId) {
        return true
      } else if (!this.orgData) {
        return true
      } else {
        return false
      }
    },
    buttonVisibel() {
      return this.activeName === 'base' || this.activeName === 'info'
    },
    isRootNode() {
      return this.orgData && this.orgData.type === 'root'
    },
    isMain() {
      const dimension = this.getDimensionData()
      return dimension.code === 'def_dimension'
    },
    ...mapGetters(['dicts'])
  },
  created() {
    if (this.orgData) {
      this.search()
      this.loadDictData()
    }
  },
  methods: {
    async removeBody(row) {
      const resp = await this.dispatch(OrgController.deleteEmployeeInOrg, { orgId: this.orgData.id, employeeId: row.id, dimensionId: this.dimensionData.id })
      return resp
    },
    openDisable(row) {
      this.opeRow = row
      if (this.opeRow.status !== '1') {
        this.options()
      } else { this.disableShow = true }
    },
    statusWrap(value) {
      if (value) {
        this.options()
      }
      this.disableFlag = false
      this.disableShow = false
    },
    tabsSuccess() {
      this.positionVisible = false
      this.search()
    },
    openSelect() {
      this.selectVisible = true
    },
    openEmployee() {
      const dimension = this.getDimensionData()
      if (dimension.code === 'def_dimension') {
        this.dialogVisible = true
      } else {
        this.employeeVisible = true
      }
    },
    openAdd() {
      if (this.isMain) {
        this.addEmployee = true
      } else { this.openEmployee() }
    },
    closeAdd() {
      this.addEmployee = false
      this.search()
    },
    async stausChange(value, row) {
      const resp = await this.dispatch(EmployeeController.updateStatusEmployee, {
        employeeId: row.id,
        status: value
      })
      if (!resp.error) {
        this.$msg.success('状态修改成功！')
      }
    },
    // 关闭岗位弹窗
    closePosition() {
      // this.$refs.positionDialog.hidden()
      this.positionVisible = false
      this.search()
    },
    // 编辑岗位
    async openPosition(row) {
      if (this.isRootNode) {
        const org = await this.getOrgData(row)
        this.newOrgData.id = org.id
      }
      this.positionVisible = true
      this.selectRow = row
    },
    openEdit(row) {
      this.selectRow = row
      this.dialogVisible = true
    },
    // 员工code点击事件
    async handleClick(name, row) {
      this.activeName = name
      if (this.isRootNode) {
        const org = await this.getOrgData(row)
        this.newOrgData = org.data
      }
      this.positionVisible = true
      this.selectRow2 = { ...row }
    },
    // 虚拟节点下查询机构
    async getOrgData(row) {
      return await this.dispatch(OrgController.findOrgByEmployeeCode, {
        code: row.code,
        tenantId: this.currentTenant
      })
    },
    hidden(type) {
      if (type === 'cancel') {
        this.positionVisible = false
      } else {
        if (this.activeName === 'base') {
          this.$refs['employeeTabs'].submit()
        } else if (this.activeName === 'info') {
          this.$refs['employeeTabs'].$refs['detailInfo'].submit()
        }
        // this.positionVisible = false
      }
    },
    // 禁用|启用
    async options() {
      let resp
      if (this.opeRow.status === '1') {
        resp = await this.dispatch(EmployeeController.disableEmployee, {
          employeeId: this.opeRow.id,
          isDisableAllUser: this.disableFlag,
        })
      } else {
        resp = await this.dispatch(EmployeeController.enableEmployee, {
          employeeId: this.opeRow.id
        })
      }
      if (!resp.error) {
        this.$msg.success('操作成功')
        this.search()
      }
    },
    // 列表 选择改变
    selectChange(selection) {
      this.selectRow = selection
    },
    async searchBody() {
      const query = { ...this.query }
      const { id, dimensionId } = this.orgData
      let resp = null
      // 根节点查询所有的员工信息
      if (this.isRootNode) {
        resp = await this.dispatch(OrgController.queryAllEmployees, {
          ...query,
          dimensionId
        })
      } else {
        const orgId = this.isRootNode ? null : id
        const payload = { orgId: orgId, dimensionId, ...query }
        resp = await this.dispatch(
          OrgController.queryEmployeesInOrg,
          payload
        )
      }

      return resp
    },
    openDownload() {
      this.downloadVisible = true
    },
    EmployeeDownload() {

    },
    async EmployeeExport() {
      ajaxUtil.config.responseType = 'blob'
      let payload = {}
      payload = {
        dimensionId: this.dimensionData.id,
        code: this.orgData.parentId == 'orgRoot' ? null : this.orgData.code,
        pageIndex: -1,
        pageSize: -1,
      }
      let resp = null
      resp = await this.dispatch(
        OrgController.exportEmp,
        payload
      )
      ajaxUtil.config.responseType = 'json'
      if (!resp.error) {
        this.$msg.success('正在导出，请稍候下载!')
      } else {
        this.$msg.error(`系统出错,请确认是否有执行方法的权限`)
      }
    },
    async loadDictData() {
      if (!this.dicttypeid) {
        return
      }
      if (!this.dicts[this.dicttypeid]) {
        const resp = await this.dispatch(DictTypeController.queryDictTypesByCriteria, {
          code: this.dicttypeid,
          tenantId: this.currentTenant
        })
        if (!resp.error) {
          this.$store.commit('ADD_DICT', {
            key: this.dicttypeid,
            value: resp.data.data.length ? resp.data.data[0].dictEntrys : []
          })
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep .inline-action{
  .el-input__inner{
    border-style: none;
  }
}
.download-more{
    vertical-align: bottom;
    height: 32px;
    display: inline-block;
    border: 1px solid #dcdfe6;
    border-left: none;
    padding: 8px 7px 0px 7px;
    padding-top: 9px;
    position: relative;
    left: -6px;
    background-color: #ffffff;
    &:hover{
      background-color: rgb(245, 245, 245);
    }
    cursor: pointer;
}
</style>
