<template>
  <el-dialog :visible.sync="historyDialogVisible" width="850px" title="历史导入记录" :before-close="handleClose" append-to-body>
    <div class="pl-20 pr-20 pb-20 ">
      <el-table
        v-loading="loading"
        height="calc(100vh - 350px)"
        :data="gridList"
        @sort-change="sortChange"
        @selection-change="selectionChange"
      >
        <el-table-column label="导入操作人" prop="operator" width="100px" />
        <el-table-column label="客户端IP" prop="clientAddress" width="130px" />
        <el-table-column sortable="createTime" label="导入时间" prop="createTime" width="160px" />
        <el-table-column label="导入结果" prop="importResult" />
        <el-table-column v-if="showDownload" label="导入日志" prop="fileId" width="120px">
          <template slot-scope="{row}">
            <el-link v-permission="FuncCode.afc_f_import_log_download" @click="downloadLog(row)">日志下载</el-link>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :page-size="query.limit"
        :current-page.sync="query.offset"
        :total="gridTotal"
        @size-change="changePageSizer"
        @current-change="changePage"
      />
    </div>
  </el-dialog>
</template>
<script>
import { ImportHistoryController } from '@controller'
import { BaseVue, List, VueUtil } from '@lib'
import ajaxUtil from '@lib/ajaxUtil'
import FileSaver from 'file-saver'
export default {
  name: 'import-history',
  mixins: [BaseVue, List],
  props: {
    historyDialogVisible: {
      type: Boolean,
      default: false,
    },
    importType: {
      type: String,
      default: null,
    }
  },
  data() {
    return {
    }
  },
  computed: {
    ...VueUtil(this)
      .select([ ImportHistoryController])
      .state(),
    loading() {
      return this.ImportHistoryController.queryImportHistoriesByCriteria.loading
    },
    showDownload() {
      return !['material', 'component_center'].includes(this.importType)
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    async searchBody() {
      const q = this.otherQuery(this.query)
      const order = this.sortBy.orderFields ? {} : { orderFields: 'createTime', orderDirection: 'DESC' }
      const payload = { ...q, ...order, importTypes: this.importType }
      const resp = this.dispatch(ImportHistoryController.queryImportHistoriesByCriteria, payload)
      return resp
    },
    async downloadLog(row) {
      ajaxUtil.config.responseType = 'blob'
      let payload = {}
      payload = {
        fileId: row.fileId,
      }
      const resp = await this.dispatch(
        ImportHistoryController.downloadImportLog,
        payload
      )
      ajaxUtil.config.responseType = 'json'
      if (resp) {
        const blob = new Blob([resp.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,charset=utf-8' })
        FileSaver.saveAs(
          blob,
          `${this.importType}_${row.createTime}导入日志下载.xlsx`
        )
      } else {
        this.$msg.warning(`文件不存在！`)
      }
    },
    handleClose() {
      this.historyDialogVisible = false
      this.$emit('update:historyDialogVisible', this.historyDialogVisible)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
