<template>
  <div id="user-manage" class="mr-20">
    <PmDownload v-model="url" />
    <div class="top-block">
      <el-row>
        <el-col :span="12">
          <PmToolbar>
            <PmToolbarItem
              v-permission="FuncCode.afc_f_position_add"
              :disabled="!positionType"
              plain
              icon="el-icon-plus"
              @click="action('add')"
            >新建岗位</PmToolbarItem>
            <!-- <PmToolbarItem icon="el-icon-delete" @click="info('delete')"
              >删除</PmToolbarItem
            > -->
            <!-- <PmToolbarItem icon="el-icon-download" @click="info('delete')"
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
            placeholder="搜索岗位名称"
            @search="pmSearch"
          >
            <template slot="body">
              <el-form-item label="岗位编号" prop="code">
                <el-input v-model="query.code" clearable />
              </el-form-item>
              <el-form-item label="岗位名称" prop="name">
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
      :table-data="this.gridData.data"
      :header-row-style="{color: 'red','font-size': '14px','font-weight': 'bold'}"
      @current-change="handleCurrentChange"
      @sort-change="sortChange"
    >
      <div slot="code" slot-scope="scope" class="inline-action">
        <el-link v-permission="FuncCode.afc_f_position_edit" @click="action('destail',scope.row)">{{ scope.row.code }}</el-link>
      </div>
      <div slot="role" slot-scope="scope" class="inline-action">
        <el-link @click="action('role',scope.row)">{{ scope.row.roleCount }}</el-link>
      </div>
      <div slot="action" slot-scope="scope" class="inline-action">
        <PmToolbar>
          <PmToolbarItem
            v-permission="FuncCode.afc_f_position_del"
            type="text"
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
      :title="(formData?'编辑':'新建')+'岗位'"
      ok-text="确定"
      :dialog-visible.sync="actionVisible"
      width="480px"
      :loading="btnLoading"
      body-class="pt-10 pl-20 pr-20 pb-10"
    >
      <PositionForm v-if="actionVisible" ref="addForm" slot="form" :form-data="formData" :position-type="positionType" @success="search" />
    </PmFormDialog>
    <pm-dialog ref="userDialog" top="60px" :show-footer="tabName === 'first'" :visible.sync="tabsVisible" :title="dialogTitle" :width="tabName === 'first' ? '480px': '800px'">
      <positionTabs v-if="tabsVisible" ref="persionTabs" :dialog-title.sync="dialogTitle" :tab-data="formData" :active-name.sync="tabName" @success="success" />
      <div slot="footer" class="footer-action">
        <el-button @click="handleSubmit('cancel')">取消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </pm-dialog>
  </div>
</template>
<script>
import { PositionController } from '@controller'
import { BaseVue, List, VueUtil } from '@lib'
import PositionForm from './positionForm.vue'
import positionTabs from './tabs.vue'
export default {
  name: 'user', // 和菜单代码一致即可开启页面缓存
  components: { PositionForm, positionTabs },
  mixins: [BaseVue, List],
  props: {
    positionType: ''
  },
  data() {
    return {
      tabsVisible: false,
      tabName: '',
      dialogTitle: '',
      data: [
        {
          name: 'zzr',
        },
      ],
      addAttrs: {
        name: 'zzr',
      },
      model: {},
      columns: [
        { label: '编号', prop: 'code', scope: 'code' },
        { label: '名称', prop: 'name', scope: 'name' },
        // { label: "岗位类型", prop: "types" },
        { label: '职责', prop: 'obligation' },
        { label: '角色数量', prop: 'roleCount', scope: 'role' },
        { label: '描述', prop: 'description' },
        { label: '操作', scope: 'action' },
      ],
      formVisible: false,
      actionVisible: false,
      actionTitle: '',
      url: '',
      formData: null,
    }
  },
  computed: {
    ...VueUtil(this)
      .select([PositionController])
      .state(),
    btnLoading() {
      return this.PositionController.update.loading || this.PositionController.create.loading
    }
  },
  watch: {
    positionType() {
      this.search()
    },
    tabsVisible(value) {
      if (!value) {
        this.search()
      }
    }
  },
  created() {},
  mounted() {
    this.search()
  },
  methods: {
    //
    async handleSubmit(type) {
      if (type === 'cancel') {
        this.$refs.persionTabs.cancel()
        this.tabsVisible = false
      } else {
        this.$refs.persionTabs.validateResolve()
      }
    },
    success() {
      this.tabsVisible = false
      this.search()
    },
    // 岗位 查询
    async searchBody() {
      const resp = await this.dispatch(PositionController.queryPositionsByCriteria, {
        ...this.query,
        types: this.positionType
      })
      return resp
    },
    // 删除岗位
    async removeBody(row) {
      const resp = await this.dispatch(PositionController.deleteByIds,
        [row.id]
      )
      return resp
    },
    // handleCurrentChange(value) {
    //   this.formData = value;
    // },
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
    showDetail(row) {
      this.currentRow = row
      // this.formVisible = true;
    },
    // 操作区功能
    action(type, row) {
      if (type === 'add') {
        this.formData = null
        this.actionVisible = true
        this.$refs.addForm && this.$refs.addForm.resetForm()
        this.actionTitle = '添加'
      } else if (type === 'edit') {
        this.actionVisible = true
        this.actionTitle = '编辑'
        this.formData = { ...row }
      } else {
        this.formData = { ...row }
        switch (type) {
          case 'destail':
            this.tabName = 'first'
            break
          case 'role':
            this.tabName = 'second'
            break
        }
        this.tabsVisible = true
      }
    },
  },
}
</script>
<style lang="scss" scoped>
#user-manage {
  .search-field {
    width: 200px;
  }
  ::v-deep .th{
    color: 'red';
    font-size: 14px;
    font-weight: bold
  }
  ::v-deep .inline-action {
    .el-button--text {
      padding-left: 0px;
      padding-right: 0px;
    }
  }
}
::v-deep .el-table-column--selection{

  .cell{
    text-overflow: unset;
  }
}
</style>
