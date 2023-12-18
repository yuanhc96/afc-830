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
            >新建页面</PmToolbarItem>
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
            <el-tooltip
              class="item"
              effect="dark"
              :content="
                businessObjId
                  ? '导出此业务对象下全部页面资源.xlsx'
                  : '导出此应用下全部页面资源.xlsx'
              "
              placement="top"
            >
              <PmToolbarItem
                v-permission="FuncCode.afc_f_export_app_resource_data"
                plain
                icon="el-icon-download"
                @click="resExport()"
              >导出</PmToolbarItem>
            </el-tooltip>
          </PmToolbar>
        </el-col>
        <el-col :span="10" class="text-right">
          <PmSearch
            :query.sync="query"
            default-prop="name"
            style="width: 300px;"
            class="float-right"
            placeholder="搜索页面名称"
            @search="pmSearch"
          >
            <template slot="body">
              <el-form-item label="页面名称" prop="name">
                <el-input v-model="query.name" clearable />
              </el-form-item>
              <el-form-item label="页面编号" prop="code">
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
      :height="height"
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
        label="页面名称"
        prop="name"
      />
      <el-table-column label="页面类型">
        <template slot-scope="{row}">
          <Dict v-model="row.openType" dicttypeid="sys_open_types" mode="view" />
        </template>
      </el-table-column>
      <!-- <el-table-column sortable="createUser" label="创建人" prop="createUser"></el-table-column>
      <el-table-column sortable="createTime" label="创建时间" prop="createTime"></el-table-column> -->
      <el-table-column label="操作" width="150px">
        <template slot-scope="{ row }">
          <PmToolbar>
            <PmToolbarItem type="text" @click="remove(row)">删除</PmToolbarItem>
            <PmToolbarItem type="text" @click="publishMenu(row)">发布菜单</PmToolbarItem>
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
      width="800px"
      :title="`${TEXT[formType]}`"
      :dialog-visible.sync="dialogVisible"
      :loading="btnLoading"
      ok-text="确定"
      body-class="pt-10 pl-20 pr-20 pb-10"
    >
      <template v-if="dialogVisible">
        <UrlFrom
          v-if="formType === 'addFunction' && dialogVisible"
          slot="form"
          :business-obj-id="businessObjId"
          :params="parameter"
          :app-id="appid"
          :loading.sync="btnLoading"
          @success="search"
        />
        <UrlFrom
          v-if="formType === 'editFunction' && dialogVisible"
          slot="form"
          :form-data="selectRow"
          :loading.sync="btnLoading"
          :app-id="appid"
          @success="search"
        />
        <SelectGroup
          v-if="formType === 'selectGroup'"
          slot="form"
          :table-data="groups"
          :multiple-selection="multipleSelection"
          @pmsuccess="pmSearch"
        />
      </template>
    </pm-form-dialog>
    <PublishMenu :dialog-visible.sync="publishMenuDialogVisible" :resourse="resourse" :resourse-id="resourseId" :app-code="appCode" />
  </div>
</template>
<script>
import {
  AppController,
  BusinessObjectController, DictTypeController, FunctionCodeToolsController,
  ResGroupController,
  ResourceController
} from '@controller'
import { BaseVue, List, VueUtil } from '@lib'
import ajaxUtil from '@lib/ajaxUtil'
import FileSaver from 'file-saver'
import { mapGetters } from 'vuex'
import SelectGroup from '../group/selectGroup.vue'
import PublishMenu from './components/publish-menu.vue'
import UrlFrom from './url-form'
export default {
  components: { UrlFrom, SelectGroup, PublishMenu },
  mixins: [BaseVue, List],
  props: {
    type: {
      type: String,
      default: null,
    },
    appid: {
      type: String,
      default: null,
    },
    appCode: {
      default: null,
    },
    groupid: {
      type: String,
      default: null,
    },
    businessObjId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      dicttypeid: 'sys_open_types',
      query: {},
      TEXT: {
        addFunction: '新建页面',
        editFunction: '编辑页面',
        selectGroup: '选择分组',
      },
      dialogVisible: false,
      publishMenuDialogVisible: false,
      formType: null,
      parameter: {},
      groupEnable: false,
      multipleSelection: [],
      selectGroup: null,
      groups: [],
      urlId: null,
      btnLoading: false,
      openTypes: {},
      resourse: {},
      resourseId: ''
    }
  },
  watch: {
    type(val) {
      if (val === 'url') {
        this.search()
      }
    },
    groupid(val) {
      if (this.type === 'url' && val) {
        this.query.offset = 1
        this.search()
      }
    },
    businessObjId(res) {
      this.businessObjId = res
      this.search()
    },
    dicts: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          const objectType = this.dicts[this.dicttypeid] || []
          this.openTypes = {}
          for (const item of objectType) {
            this.openTypes[item.code] = item.name
          }
        }
      }
    },
  },
  mounted() {
    this.loadDictData()
    this.search()
  },
  computed: {
    ...mapGetters(['dicts']),
    ...VueUtil(this)
      .select([AppController,
        BusinessObjectController, DictTypeController, FunctionCodeToolsController,
        ResGroupController,
        ResourceController])
      .state(),
    loading() {
      return this.ResourceController.queryResourcesByCriteria.loading
    },
    height() {
      return this.businessObjId ? `calc(100vh - 256px)` : this.autoTableHeight
    },
    ...mapGetters(['dicts']),
  },
  methods: {
    openFunc(formType, value) {
      this.dialogVisible = true
      this.formType = formType
      if (formType === 'editFunction') {
        this.selectRow = value
        this.urlId = value.id
      }
      if (formType === 'addFunction') {
        this.parameter = {
          appId: this.appid,
          type: this.type,
          resGroupId: this.groupid,
        }
      }
      if (formType === 'selectGroup') {
        this.parameter = {
          appId: this.appid,
          type: this.type,
          resGroupId: this.groupid,
        }
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
      const resp = await this.dispatch(
        ResourceController.queryResourcesByCriteria,
        payload
      )
      for (const item of resp.data.data) {
        const content = JSON.parse(item.content)
        const openType = content ? content.openType : ''
        item.urlType = this.openTypes[openType]
        item.openType = openType
      }
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
    async resExport() {
      ajaxUtil.config.responseType = 'blob'
      const payload = {
        appId: this.appid,
        resType: 'url',
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
            `业务对象-${BusinessObject.data.name}-页面资源.xlsx`
          )
        } else {
          const app = await this.dispatch(AppController.findApp, {
            id: this.appid,
          })
          FileSaver.saveAs(blob, `应用-${app.data.name}-页面资源.xlsx`)
        }
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
    publishMenu(item) {
      this.resourse = item
      this.resourseId = item.id
      this.publishMenuDialogVisible = true
    }
  },
}
</script>
