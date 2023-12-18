<template>
  <div class="pl-20 pr-20 pb-20">
    <!-- <down-load-file v-model="exportUrl" :tenant-id="tenantId" method="post">
      <div slot="formData">
        <input type="text" hidden :value="query.id" name="dicttypeid">
        <input type="text" hidden :value="query.name" name="dicttypename">
        <input type="text" hidden :value="tenantId" name="tenantId">
      </div>
    </down-load-file> -->
    <div class="top-block">
      <el-row>
        <el-col :span="16">
          <PmToolbar class="ml-5 ">
            <PmToolbarItem
              v-if="isshowadd"
              v-permission="FuncCode.afc_f_dicttype_add"
              plain
              icon="el-icon-plus"
              @click="openAddRoot"
            >新建类型</PmToolbarItem>
            <PmToolbarItem
              v-if="isshowaddChild"
              v-permission="FuncCode.afc_f_dicttype_add"
              plain
              icon="el-icon-plus"
              :disabled="addSonDisabled"
              @click="openAddChild"
            >新建子类型</PmToolbarItem>
            <PmToolbarItem
              v-permission="FuncCode.afc_f_dicttype_del"
              plain
              :disabled="selections.length === 0"
              @click="batchDelete"
            >批量删除</PmToolbarItem>
            <PmToolbarItem plain :disabled="selections.length == 0" @click="openi18nEdit">
              国际化配置
            </PmToolbarItem>
            <el-dropdown
              v-if="level==1"
              trigger="hover"
              placement="bottom"
              @command="exportDeal"
            >
              <el-button v-permission="FuncCode.afc_f_export_dict_data">
                导出 <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="select">按所勾选的数据</el-dropdown-item>
                <el-dropdown-item command="all">全部数据</el-dropdown-item>

              </el-dropdown-menu>
            </el-dropdown>
          </PmToolbar>
        </el-col>
        <el-col :span="8" class="text-right">
          <PmSearch
            class="float-right"
            style="width: 300px;"
            :query.sync="query"
            default-prop="name"
            placeholder="搜索类型名称"
            @search="pmSearch"
          >
            <template slot="body">
              <el-form-item label="类型名称" prop="name">
                <el-input v-model="query.name" clearable />
              </el-form-item>
              <el-form-item label="类型编号" prop="code">
                <el-input v-model="query.code" v-focus clearable />
              </el-form-item>
            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <el-table
      :id="tableId"
      ref="dictTypeTable"
      v-loading="DictTypeController.queryDictTypesByCriteria.loading"
      :height="autoTableHeight"
      border
      stripe
      :data="gridList"
      @sort-change="sortChange"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column sortable="code" label="类型编号" prop="code">
        <template slot-scope="{row}">
          <el-link @click="gotodetail(row)">{{ row.code }}</el-link>
        </template>
      </el-table-column>
      <el-table-column sortable="name" label="类型名称" prop="name" />
      <el-table-column label="字典项">
        <template slot-scope="{row}">
          <el-link @click="gotoEntry(row)">{{ row.dictEntryCount }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="子类型">
        <template slot-scope="{row}">
          <el-link @click="gotoChild(row)">{{ row.subDictTypeCount }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <PmToolbar>
            <PmToolbarItem v-permission="FuncCode.afc_f_dicttype_del" type="text" @click="remove(scope.row)">删除</PmToolbarItem>
          </PmToolbar>
        </template>
      </el-table-column>
    </el-table>
    <PmFormDialog
      width="480px"
      :title="`新建类型`"
      body-class="pt-10 pl-20 pr-20 pb-10"
      :dialog-visible.sync="dialogVisible"
      :loading="btnLoading"
      ok-text="确定"
    >
      <Form
        v-if="dialogVisible"
        slot="form"
        :parent-type.sync="parentType"
        :parent-dict="slectDict"
        :dialog-visible.sync="dialogVisible"
        :form-data="selectRow"
        :loading.sync="btnLoading"
        @success="search"
      />
    </PmFormDialog>
    <Pagination
      :selections="selections"
      :page-size="query.limit"
      :current-page.sync="query.offset"
      :total="gridTotal"
      @size-change="changePageSizer"
      @current-change="changePage"
    />
    <i18nEdit v-if="i18nDialogVisible" :i18n-dialog-visible.sync="i18nDialogVisible" :select-menus="selections" entity-name="DictType" @i18nSuccess="i18nSuccess" />
  </div>
</template>
<script>
import TreeTable from '@/components/TreeTable/index.vue'
import i18nEdit from '@/components/i18nEdit/editList.vue'
import { DictTypeController } from '@controller'
import { BaseVue, List, VueUtil, _ } from '@lib'
import ajaxUtil from '@lib/ajaxUtil'
import FileSaver from 'file-saver'
import DictIndex from '../entry/list.vue'
import Form from './form.vue'
import ImportForm from './import.vue'
export default {
  components: { Form, TreeTable, ImportForm, DictIndex, i18nEdit },
  mixins: [BaseVue, List],
  props: {
    slectDict: {
      type: Object,
      default: null
    },
    level: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      dictIds: [],
      importDialogVisible: false,
      ExportVisible: false,
      selectDictType: null,
      selections: [],
      exportUrl: null,
      parentType: null,
      btnLoading: false,
      isshowadd: true,
      isshowaddChild: true,
      i18nDialogVisible: false,

    }
  },
  computed: {
    ...VueUtil(this)
      .select([DictTypeController])
      .state(),
    tenantId() {
      return this.currentTenant
    },
    addSonDisabled() {
      return this.selections.length !== 1 || this.selections[0].subDictTypeCount !== 0
    }
  },
  watch: {
    slectDict(val) {
      this.search().then(res => {
        this.refreButtonStatus()
      })
    },
    'DictEntryController.create': 'search',
    'DictEntryController.deleteByIds': 'search',
    'DictTypeController.create': 'searchAndrefreButtonStatus',
    'DictTypeController.deleteByIds': 'searchAndrefreButtonStatus',

  },
  mounted() {
    this.search().then(res => {
      this.refreButtonStatus()
    })
  },
  methods: {
    searchAndrefreButtonStatus() {
      this.search().then(res => {
        this.refreButtonStatus()
      })
    },
    refreButtonStatus() {
      if (this.slectDict && this.gridTotal >= 1) {
        this.isshowadd = false
        if (this.gridList[0].subDictTypeCount >= 1) {
          this.isshowaddChild = false
        } else {
          this.isshowaddChild = true
        }
      } else {
        this.isshowadd = true
      }
    },
    selectOne(row) {
      this.$emit('selectOne', row)
    },
    openAddRoot() {
      this.parentType = null
      this.openAdd()
    },
    openAddChild() {
      this.parentType = this.selections[0]
      this.openAdd()
    },
    openImport() {
      this.importDialogVisible = true
    },
    handleSelectionChange(row) {
      this.selections = row
    },

    batchDelete() {
      this.confirm(`此操作将永久删除[${this.selections.length}]条数据, 是否继续?`).then(async() => {
        if (await this.deleteData(this.selections)) {
          this.pmSearch().then(res => {
            this.refreButtonStatus()
          })
        }
      }).catch(() => {})
    },
    async deleteData(rows) {
      const temps = _.cloneDeep(rows)
      temps.forEach(t => {
        delete t.parent
      })

      const listisSys = temps.filter(item => item.code.indexOf('sys_') != -1)
      const listnosys = temps.filter(item => item.code.indexOf('sys_') == -1)
      if (listisSys.length > 0) {
        const listisSyscodes = listisSys.map(i => i.code)
        let isSysString = ''
        for (const i in listisSyscodes) {
          isSysString = isSysString + listisSyscodes[i] + '、'
        }
        this.$msg.warning(`${isSysString}系统定义的业务字典不能被删除`)
      }
      const ids = listnosys.map(i => i.id)
      if (ids.length > 0) {
        const resp = await this.dispatch(DictTypeController.deleteByIds, ids)
        if (!resp.error) {
          ids
          this.$msg.success('删除成功')
          return true
        } else { return false }
      }
    },
    async removeBody(row) {
      if (row.code.indexOf('sys_') != -1) {
        // 含有sys_不能删除
        this.$msg.warning('系统定义的业务字典不能被删除')
        return
      } else {
        if (await this.deleteData([row])) {
          if (row.parent) this.expand(row.parent)
          else {
            this.pmSearch().then(res => {
              this.refreButtonStatus()
            })
          }
        }
      }
    },
    async refreshCache() {
      const resp = await this.dispatch(DictTypeController.refreshDictCache)
      if (!resp.error) {
        this.$msg.success('缓存刷新成功!')
      }
    },
    exportData() {
      this.exportUrl = '/org.gocom.components.coframe.dict.DictTypeController.exportDict.biz.ext'
    },
    async searchBody() {
      const order = this.sortBy.orderFields ? {} : { orderFields: 'createTime', orderDirection: 'DESC' }
      const parentId = this.slectDict ? this.slectDict.id : null
      const payload = {
        ...this.otherQuery(this.query),
        // levels:0,
        tenantId: this.currentTenant,
        parentId: parentId,
        ...order
      }
      const resp = await this.dispatch(DictTypeController.queryDictTypesByCriteria, payload)
      return resp
    },
    gotodetail(row) {
      row.selectTab = 'detail'
      this.goto({
        title: '类型信息' + `（${row.name}）`,
        name: `DictDetail`,
        props: {
          data: { ...row },
        }
      })
    },
    gotoEntry(row) {
      this.selectDictType = row
      row.selectTab = 'entrylist'
      this.goto({
        title: `（${row.name}）` + '字典项',
        name: `DictDetail`,
        props: {
          data: { ...row },
        }
      })
    },
    gotoChild(row) {
      const name = 'DictChildren' + this.level
      const level = Number(this.level + 1)
      console.log(name, level)
      this.goto({
        title: `（${row.name}）` + '子类型',
        name: `${name}`,
        props: {
          slectDict: row,
          level: level
        }
      })
    },
    async exportDeal(type) {
      this.dictIds = this.selections.map((i) => i.id)
      ajaxUtil.config.responseType = 'blob'
      let payload = {}
      if (type === 'all') {
      } else {
        if (this.dictIds.length < 1) {
          this.$msg.warning('请选择至少一条数据')
          return
        }
        payload = {
          ids: [...this.dictIds]
        }
      }
      const resp = await this.dispatch(
        DictTypeController.exportDictTypes,
        payload
      )
      if (!resp.error) {
        const blob = new Blob([resp.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,charset=utf-8' })
        FileSaver.saveAs(blob, `业务字典资源.xlsx`)
      }
      ajaxUtil.config.responseType = 'json'
    },
    openi18nEdit() {
      this.i18nDialogVisible = true
    },
    i18nSuccess() {
      this.$refs.dictTypeTable.clearSelection()// 删除后清空之前选择的数据
    }
  },

}
</script>
