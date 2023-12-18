<template>
  <div id="group-manage" class="pl-20 pr-20 pb-20">
    <PmDownload v-model="url" />
    <div class="top-block">
      <el-row>
        <el-col :span="12">
          <PmToolbar>
            <PmToolbarItem
              v-permission="FuncCode.afc_f_workgroup_add"
              plain
              icon="el-icon-plus"
              @click="action('add')"
            >新建工作组</PmToolbarItem>
            <!-- <PmToolbarItem icon="el-icon-delete" @click="remove(null)"
              >删除</PmToolbarItem
            > -->
            <!-- <PmToolbarItem
              icon="el-icon-download"
              @click="handleImport('delete')"
              >导入</PmToolbarItem
            >
            <PmToolbarItem icon="el-icon-upload" @click="download()"
              >导出</PmToolbarItem
            > -->
          </PmToolbar>
        </el-col>
        <el-col :span="12" class="text-right">
          <PmSearch
            class="float-right"
            style="width: 300px"
            :query.sync="query"
            default-prop="name"
            placeholder="搜索工作组名称"
            @search="pmSearch"
          >
            <template slot="body">
              <el-form-item label="工作组编号" prop="code">
                <el-input v-model="query.code" clearable />
              </el-form-item>
              <el-form-item label="工作组名称" prop="name">
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
        <el-link v-if="allow(FuncCode.afc_f_workgroup_edit)" @click="userManager(scope.row,'code')">{{
          scope.row.code
        }}</el-link>
        <span v-else>{{ scope.row.code }}</span>
      </div>
      <div slot="roleCount" slot-scope="scope" class="inline-action">
        <el-link @click="userManager(scope.row,'roleCount')">{{
          scope.row.roleCount
        }}</el-link>
      </div>
      <div slot="employeeCount" slot-scope="scope" class="inline-action">
        <el-link @click="userManager(scope.row,'employeeCount')">{{
          scope.row.employeeCount
        }}</el-link>
      </div>
      <div slot="action" slot-scope="scope" class="inline-action">
        <PmToolbar>
          <PmToolbarItem
            v-permission="FuncCode.afc_f_workgroup_del"
            type="text"
            size="mini"
            @click="remove(scope.row)"
          >删除</PmToolbarItem>
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
      :title="actionTitle + '工作组'"
      ok-text="确定"
      :dialog-visible.sync="actionVisible"
      width="480px"
      :loading="btnLoading"
      body-class="pt-10 pl-20 pr-20 pb-10"
    >
      <work-group-form v-if="actionVisible" slot="form" :form-data="formData" @submit="search" />
    </PmFormDialog>
    <PmFormDialog
      title="导入工作组"
      ok-text="确定"
      :dialog-visible.sync="importVisible"
      width="800px"
    >
      <div slot="form">
        <import-dialog />
      </div>
    </PmFormDialog>

    <pm-dialog
      ref="userDialog"
      :show-footer="tabName === 'first'"
      :visible.sync="userDialogVisible"
      :title="dialogTitle"
      class="tabsDialog"
      top="60px"
      :width="tabName === 'first' ?'480px':'800px'"
    >
      <person-form v-if="userDialogVisible" ref="persionForm" :dialog-title.sync="dialogTitle" :form-data="editData" :active-name.sync="tabName" @search="search" @success="success" />
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="hidden('cancel')">取消</el-button>
        <el-button size="mini" type="primary" @click="hidden">确定</el-button>
      </div>
    </pm-dialog>

  </div>
</template>
<script>
import { WorkGroupController } from '@controller'
import { BaseVue, List, VueUtil } from '@lib'
import importDialog from './importDialog.vue'
import personForm from './personForm.vue'
import workGroupForm from './workGroupForm.vue'
export default {
  name: 'working-group', // 和菜单代码一致即可开启页面缓存
  components: {
    'import-dialog': importDialog,
    'person-form': personForm,
    workGroupForm,
  },
  mixins: [BaseVue, List],
  data() {
    return {
      importVisible: false,
      formData: null,
      editData: null,
      data: [
        {
          name: 'zzr',
        },
      ],
      addAttrs: {
        name: 'zzr',
      },
      model: {},
      tableData: [],
      tabName: 'first',
      columns: [
        { label: '编号', prop: 'code', scope: 'code' },
        { label: '名称', prop: 'name' },
        { label: '负责人', prop: 'managerEmpName' },
        { label: '角色数量', prop: 'roleCount', scope: 'roleCount' },
        { label: '成员数量', prop: 'employeeCount', scope: 'employeeCount' },
        { label: '描述', prop: 'description' },
        { label: '操作', scope: 'action' },
      ],
      formVisible: false,
      actionVisible: false,
      actionTitle: '',
      userDialogVisible: false,
      url: '',
    }
  },
  computed: {
    ...VueUtil(this)
      .select([WorkGroupController])
      .state(),
    btnLoading() {
      return this.WorkGroupController.update.loading || this.WorkGroupController.create.loading
    }
  },
  watch: {
    actionVisible: {
      immediate: true,
      handler: function(value) {
        if (!value) {
          this.formData = null
        }
      }
    },
    // 会有异步顺序问题
    // userDialogVisible(value){
    //   if(!value){
    //     this.search()
    //   }
    // }
  },
  mounted() {
    this.search()
  },
  created() {},
  methods: {

    // 工作组 删除
    async removeBody(row) {
      const resp = await this.dispatch(WorkGroupController.deleteByIds, [row.id]
      )
      return resp
    },
    success() {
      this.search()
      this.userDialogVisible = false
    },
    hidden(type) {
      // 调用组织人员修改方法
      if (type !== 'cancel') {
        this.$refs.persionForm.validateResolve()
        // this.$refs.persionForm.cancel()
      } else {
        this.userDialogVisible = false
      }
    },
    // 列表 选择改变
    selectChange(selections) {
      this.selections = selections
    },
    // 工作组 查询
    async searchBody() {
      const resp = await this.dispatch(WorkGroupController.queryWorkGroupsByCriteria, {
        ...this.query
      })
      return resp
    // if(!resp.error){
    //   this.tableData = resp.data.data
    // }
    },
    // 弹窗 人员管理
    userManager(row, type) {
      this.userDialogVisible = true
      switch (type) {
        case 'roleCount':
          this.tabName = 'third'
          break
        case 'employeeCount':
          this.tabName = 'second'
          break
        default:
          this.tabName = 'first'
      }
      this.$nextTick(() => {
        this.editData = { ...row }
      })
    },
    // 处理导入
    handleImport() {
      // this.importVisible = true;
    },
    // 下载
    download() {
      this.url =
        'https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original'
    },
    // 提示
    info(text) {
      this.$msg.info(text)
    },

    // 跳转到权限页面
    showDetail(row, type) {
      if (type === 'edit') {
        this.formVisible = true
      } else {
        // 跳转页面
        this.$router.push('/menu_auth/menu_auth') // row
        console.log(row)
      }
    },
    async validateResolve() {
      const res = await this.dispatch(WorkGroupController.create, {
        ...this.formData,
      })
      return true
    },
    // 操作区功能
    action(type, row) {
      this.actionVisible = true
      if (type === 'add') {
        this.actionTitle = '新建'
      } else {
        this.actionTitle = '编辑'
        this.editData = { ...row }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body{
  padding-top:0px !important;
}
::v-deep .el-table-column--selection {
  .cell {
    text-overflow: unset;
  }

}
 ::v-deep .pm-dialog__body{
    overflow-y: hidden;
  }
</style>
