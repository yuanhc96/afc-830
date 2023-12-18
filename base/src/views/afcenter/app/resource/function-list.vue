<template>
  <div class="mr-20">
    <div class="top-block">
      <el-row>
        <el-col :span="14">
          <PmToolbar class="ml-5">
            <PmToolbarItem
              v-permission="FuncCode.afc_f_resource_add"
              plain
              icon="el-icon-plus"
              @click="openFunc('addFunction', null)"
            >新建功能</PmToolbarItem>
            <PmToolbarItem
              plain
              :disabled="multipleSelection.length == 0"
              @click="bulkDelete"
            >批量删除</PmToolbarItem>
            <PmToolbarItem
              v-permission="FuncCode.afc_f_resource_edit_types"
              plain
              :disabled="multipleSelection.length == 0"
              @click="openFunc('selectGroup', null)"
            >转移分组</PmToolbarItem>
            <PmToolbarGroup>
              <PmToolbarItem
                plain
                icon="el-icon-upload"
                @click="openfunImport()"
              >导入</PmToolbarItem>
              <el-tooltip
                class="item"
                effect="dark"
                :content="
                  businessObjId
                    ? '导出此业务对象下全部功能资源.xlsx'
                    : '导出此应用下全部功能资源.xlsx'
                "
                placement="top"
              >
                <!-- <PmToolbarItem plain icon="el-icon-download" @click="resExport()">导出</PmToolbarItem> -->
                <PmToolbarItem
                  v-permission="FuncCode.afc_f_export_app_resource_data"
                  plain
                  icon="el-icon-download"
                  @click="resExport()"
                >导出</PmToolbarItem>
              </el-tooltip>
            </PmToolbarGroup>
          </PmToolbar>
        </el-col>
        <el-col :span="10" class="text-right">
          <PmSearch
            :query.sync="query"
            default-prop="name"
            style="width: 300px;"
            class="float-right"
            placeholder="搜索功能名称"
            @search="pmSearch"
          >
            <template slot="body">
              <el-form-item label="功能名称" prop="name">
                <el-input v-model="query.name" clearable />
              </el-form-item>
              <el-form-item label="功能编号" prop="code">
                <el-input v-model="query.code" v-focus clearable />
              </el-form-item>
            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <el-table
      :id="tableId"
      v-loading="loading"
      :height="autoTableHeight"
      :highlight-current-row="true"
      border
      stripe
      :data="gridList"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column sortable="code" label="编号" prop="code">
        <template slot-scope="{ row }">
          <el-link @click="openFunc('editFunction', row)">{{
            row.code
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        sortable="name"
        label="功能名称"
        prop="name"
      />
      <!-- <el-table-column sortable="createUser" label="创建人" prop="createUser"></el-table-column>
      <el-table-column sortable="createTime" label="创建时间" prop="createTime"></el-table-column> -->
      <el-table-column label="操作" width="150px">
        <template slot-scope="{ row }">
          <PmToolbar>
            <PmToolbarItem type="text" @click="remove(row)">删除</PmToolbarItem>
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
      width="480px"
      :title="`${TEXT[formType]}`"
      :dialog-visible.sync="dialogVisible"
      :loading="btnLoading"
      ok-text="确定"
      body-class="pt-10 pl-20 pr-20 pb-10"
    >
      <template v-if="dialogVisible">
        <FuncFrom
          v-if="formType === 'addFunction'"
          slot="form"
          :params="parameter"
          :business-obj-id="businessObjId"
          :loading.sync="btnLoading"
          @success="search"
        />
        <FuncFrom
          v-if="formType === 'editFunction'"
          slot="form"
          :form-data="selectRow"
          :loading.sync="btnLoading"
          @success="search"
        />
        <SelectGroup
          v-if="formType === 'selectGroup'"
          slot="form"
          :table-data="groups"
          :multiple-selection="multipleSelection"
          :loading.sync="btnLoading"
          @pmsuccess="pmSearch"
        />
      </template>
    </pm-form-dialog>
    <FunctionImport
      v-if="importDialogVisible"
      :import-dialog-visible.sync="importDialogVisible"
      :appid="appid"
      :groupid="groupid"
      :business-obj-id="businessObjId"
    />
    <ResExport
      :res-exportdialog-visible.sync="resExportdialogVisible"
      :appid="appid"
      :business-obj-id="businessObjId"
    />
  </div>
</template>
<script>
import {
  AppController,
  BusinessObjectController,
  FunctionCodeToolsController,
  ResGroupController,
  ResourceController
} from '@controller'
import { BaseVue, List, VueUtil } from '@lib'
import ajaxUtil from '@lib/ajaxUtil'
import FileSaver from 'file-saver'
import SelectGroup from '../group/selectGroup.vue'
import FuncFrom from './function-form.vue'
import FunctionImport from './function-import/function-import.vue'
import ResExport from './resExport.vue'
export default {
  components: { FuncFrom, SelectGroup, ResExport, FunctionImport },
  mixins: [BaseVue, List],
  props: {
    type: {
      type: String,
      default: 'type',
    },
    appid: {
      type: String,
      default: 'appid',
    },
    groupid: {
      type: String,
      default: 'groupid',
    },
    businessObjId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      query: {},
      TEXT: {
        addFunction: '新建功能',
        editFunction: '编辑功能',
        selectGroup: '选择分组',
      },
      resExportdialogVisible: false,
      dialogVisible: false,
      funExportdialogVisible: false,
      importDialogVisible: false,
      formType: null,
      parameter: {},
      groupEnable: false,
      multipleSelection: [],
      selectGroup: null,
      groups: [],
      btnLoading: false,
    }
  },
  watch: {
    groupid(val) {
      this.search()
    },
    businessObjId(res) {
      this.businessObjId = res
      this.search()
    },
    'FunctionCodeToolsController.importFunCodesFromFIleOrUrl': 'search',
  },
  mounted() {
    this.search()
  },
  computed: {
    ...VueUtil(this)
      .select([AppController,
        BusinessObjectController,
        FunctionCodeToolsController,
        ResGroupController,
        ResourceController])
      .state(),
    loading() {
      return this.ResourceController.queryResourcesByCriteria.loading
    },
  },
  methods: {
    openfunImport() {
      this.importDialogVisible = true
    },
    openFunc(formType, value) {
      this.dialogVisible = true
      this.formType = formType
      if (formType === 'editFunction') {
        this.selectRow = value
      }
      if (formType === 'addFunction') {
        this.parameter = {
          appId: this.appid,
          type: this.type,
          resGroupId: this.groupid,
        }
      }
      if (formType === 'selectGroup') {
        this.changeGroups()
      }
    },
    async searchBody() {
      const q = this.otherQuery(this.query)
      const payload =
        this.businessObjId == null
          ? {
            appId: this.appid,
            types: this.type,
            resGroupId: this.groupid,
            ...q,
          }
          : {
            businessObjId: this.businessObjId,
            types: this.type,
            resGroupId: this.groupid,
            ...q,
          }
      // let payload = {appId:this.appid,businessObjId:this.businessObjId,types:this.type,resGroupId:this.groupid,...q}
      const resp = await this.dispatch(
        ResourceController.queryResourcesByCriteria,
        payload
      )
      return resp
    },
    async removeBody(row) {
      const payload = [row.id]
      const resp = await this.dispatch(ResourceController.deleteByIds, payload)
      return resp
    },
    async bulkDelete() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async() => {
          const payload = this.multipleSelection.map((sel) => {
            return sel.id
          })
          const resp = await this.dispatch(
            ResourceController.deleteByIds,
            payload
          )
          if (!resp.error) {
            this.pmSearch()
            this.$msg.success('删除成功')
          }
        })
        .catch(() => {})
    },
    async searchGroup() {
      const query = {
        pageIndex: 0,
        pageSize: 999,
      }
      const payload = { appId: this.appid, ...query }
      const resp = await this.dispatch(
        ResGroupController.queryResGroupsByCriteria,
        payload
      )
      return resp.data.data
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async changeGroups() {
      const groups = await this.searchGroup()
      this.groups = groups
    },
    // 导出功能码excel
    async resExport() {
      ajaxUtil.config.responseType = 'blob'
      const payload = {
        appId: this.appid,
        resType: 'function',
      }
      payload.params = this.businessObjId
        ? { businessObjId: this.businessObjId }
        : null
      const resp = await this.dispatch(
        FunctionCodeToolsController.exportAppResources,
        payload
      )
      ajaxUtil.config.responseType = 'json'
      if (!resp.error) {
        const blob = new Blob([resp.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,charset=utf-8',
        })
        if (this.businessObjId) {
          const BusinessObject = await this.dispatch(
            BusinessObjectController.findBusinessObject,
            { id: this.businessObjId }
          )
          FileSaver.saveAs(
            blob,
            `业务对象-${BusinessObject.data.name}-功能码资源.xlsx`
          )
        } else {
          const app = await this.dispatch(AppController.findApp, {
            id: this.appid,
          })
          FileSaver.saveAs(blob, `应用-${app.data.name}-功能码资源.xlsx`)
        }
      }
    },
    tofunExport() {
      this.resExportdialogVisible = true
    },
    handleClose() {
      this.funExportdialogVisible = false
    },
    // 导出功能码JSON文件
    async exportDeal() {
      const type = 'all'
      ajaxUtil.config.responseType = 'blob'
      const obj =
        this.businessObjId == null ? {} : { businessObjId: this.businessObjId }
      let payload = {}
      if (type === 'all') {
        // state=2
        payload = {
          state: 2,
          appId: this.appid,
          ...obj,
        }
      } else {
        // state传1
        const ids = this.multipleSelection.map((i) => i.id)
        console.log(ids, 'ids')
        if (ids.length < 1) {
          this.$msg.warning('请选择至少一条数据')
          return
        }
        payload = {
          state: 1,
          ids: ids,
          appId: this.appid,
          ...obj,
        }
      }
      const resp = await this.dispatch(
        FunctionCodeToolsController.exportFunctionCodes,
        payload
      )
      if (!resp.error) {
        ajaxUtil.config.responseType = 'json'
        const blob = new Blob([resp.data], {
          type: 'application/json,charset=utf-8',
        })
        if (this.businessObjId) {
          const BusinessObject = await this.dispatch(
            BusinessObjectController.findBusinessObject,
            { id: this.businessObjId }
          )
          FileSaver.saveAs(
            blob,
            `业务对象-${BusinessObject.data.name}-功能码.json`
          )
        } else {
          const app = await this.dispatch(AppController.findApp, {
            id: this.appid,
          })
          FileSaver.saveAs(blob, `应用-${app.data.name}-功能码.json`)
        }
      }
      this.handleClose()
    },
  },
}
</script>
<style lang="scss" scoped>
</style>
