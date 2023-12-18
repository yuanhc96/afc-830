<template>
  <el-dialog
    title="导出设置"
    :visible.sync="resExportdialogVisible"
    width="800px"
    append-to-body
    :before-close="handleClose"
  >
    <div
      style="
          width: 800px;
          height: 100px;
          display: table-cell;
          text-align: center;
          vertical-align: middle;
        "
    >
      <!-- <el-button
          type="primary"
          style="height: 40px; margin: 0 100px 0 0"
          @click="exportDeal('select')"
          >按所勾选的数据进行处理</el-button
        > -->
      <el-button
        type="primary"
        style="height: 40px"
        @click="exportDeal('all')"
      >按查询出的全部数据进行处理</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
AppController,
BusinessObjectController, FunctionCodeToolsController
} from '@controller'
import { BaseVue } from '@lib'
import ajaxUtil from '@lib/ajaxUtil'
import FileSaver from 'file-saver'
export default {
  mixins: [BaseVue],
  props: {
    resExportdialogVisible: {
      type: Boolean,
      default: false,
    },
    appid: {
      type: String,
      default: 'appid',
    },
    businessObjId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {

    }
  },
  watch: {

  },
  mounted() {

  },
  methods: {
    async exportDeal(type) {
      ajaxUtil.config.responseType = 'blob'
      const obj =
        this.businessObjId == null ? {} : { businessObjId: this.businessObjId }
      let payload = {}
      if (type === 'all') {
        // state=2
        payload = {
          state: 2,
          appId: this.appid,
          resType: 'function',
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
          resType: 'function',
          ...obj,
        }
      }
      const resp = await this.dispatch(
        FunctionCodeToolsController.exportAppResources,
        payload
      )
      if (!resp.error) {
        ajaxUtil.config.responseType = 'json'
        const blob = new Blob([resp.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,charset=utf-8' })
        if (this.businessObjId) {
          const BusinessObject = await this.dispatch(
            BusinessObjectController.findBusinessObject,
            { id: this.businessObjId }
          )
          FileSaver.saveAs(
            blob,
            `业务对象-${BusinessObject.data.name}-功能码.xlsx`
          )
        } else {
          const app = await this.dispatch(AppController.findApp, {
            id: this.appid,
          })
          FileSaver.saveAs(blob, `应用-${app.data.name}-功能码.xlsx`)
        }
      }
      this.handleClose()
    },
    handleClose() {
      this.resExportdialogVisible = false
      this.$emit('update:resExportdialogVisible', this.resExportdialogVisible)
    },
  }
}

</script>

