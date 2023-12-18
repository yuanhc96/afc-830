<template>
  <div>
    <div class="top-block">
      <el-row>
        <el-col :span="16">
          <PmToolbar>
            <PmToolbarItem
              v-permission="FuncCode.afc_f_org_add"
              icon="el-icon-plus"
              plain
              :disabled="enableOpt || isRef"
              @click="openAdd"
            >新建机构</PmToolbarItem>
            <PmToolbarItem v-if="orgData&&orgData.orgLevel=='0'" plain icon="el-icon-download" @click="OrgExport()">导出</PmToolbarItem>
          </PmToolbar>
        </el-col>
        <el-col :span="8" class="text-right">
          <PmSearch
            class="float-right"
            style="width: 300px"
            :query.sync="query"
            default-prop="name"
            placeholder="搜索机构"
            @search="pmSearch"
          >
            <template slot="body">
              <el-form-item label="机构编号" prop="code">
                <el-input v-model="query.code" clearable />
              </el-form-item>
              <el-form-item label="机构名称" prop="name">
                <el-input v-model="query.name" clearable />
              </el-form-item>
            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <pm-table
      :id="tableId"
      height="calc(100vh - 214px)"
      border
      stripe
      :columns="columns"
      :table-data="gridList"
      auto-select-row
      @selection-change="selectChange"
    >
      <!-- <div v-if="!enableOpt" class="inline-action" slot="status" slot-scope="scope">
        <span>{{scope.row.status==='1'?'启用':'禁用'}}</span>
      </div> -->
      <div slot="code" slot-scope="scope" class="inline-action">
        <el-link v-if="allow(FuncCode.afc_f_org_edit)" @click="openEdit(scope.row)">{{ scope.row.code }}</el-link>
        <span v-else>{{ scope.row.code }}</span>
      </div>
      <div slot="action" slot-scope="scope" class="inline-action">
        <PmToolbar>
          <PmToolbarItem
            v-permission="FuncCode.afc_f_org_del"
            :disabled="isRef"
            type="text"
            size="mini"
            @click="remove(scope.row)"
          >删除</PmToolbarItem>
          <!-- <PmToolbarItem :disabled="isRef" type="text"  size="mini" @click="handleStatus(scope.row)"
            >{{scope.row.status==='1'?'禁用':'启用'}}</PmToolbarItem
          > -->
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
      :dialog-visible.sync="dialogVisible"
      :title="addTile"
      ok-text="确定"
      width="800px"
      top="60px"
      :loading="loading"
      body-class="pt-10 pl-20 pr-20 pb-10"
    >
      <auth-form v-if="dialogVisible" slot="form" :org-data="orgData" :dialog-visible="dialogVisible" :loading.sync="loading" :disabled="isRef" :form-data="selectRow" :dimension-data="dimensionData" @success="handleSuccess" />
    </PmFormDialog>
  </div>
</template>

<script>
import { OrgController } from '@controller'
import { BaseVue, List } from '@lib'
import ajaxUtil from '@lib/ajaxUtil'
import FileSaver from 'file-saver'
import authForm from './form.vue'
export default {
  name: '',
  components: { authForm },
  mixins: [BaseVue, List],
  inject: ['parentRef'],
  props: {
    orgData: {},
    dimensionData: {},
    isRef: {
      default: function() {
        return false
      }
    }
  },
  data() {
    return {
      columns: [
        { label: '编号', prop: 'code', scope: 'code' },
        { label: '名称', prop: 'name' },
        // { label: "状态", prop: "status" ,scope:"status"},
        { label: '负责人', prop: 'managerName' },
        { label: '分管领导', prop: 'chargerName' },
        { label: '操作', scope: 'action', width: 150 },
      ],
      loading: false
    }
  },
  computed: {
    height() {
      if (this.userInfo.attributes.isOrgManager) {
        return 'calc(100vh - 186px)'
      } else {
        return 'calc(100vh - 208px)'
      }
    },
    addTile() {
      if (this.selectRow) {
        return `编辑机构`
      } else {
        return `新建机构`
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
    }
  },
  watch: {
    orgData(value) {
      if (value) { this.search() } else {
        this.gridData = []
      }
    },
    dimensionData(value) {
      if (value) this.gridData = []
    }
  },
  created() {
    if (this.orgData) {
      this.search()
    }
  },
  methods: {
    async handleStatus(row) {
      let resp
      if (row.status === '1') {
        resp = await this.dispatch(OrgController.disableOrg, {
          orgId: row.id,
        })
      } else {
        resp = await this.dispatch(OrgController.enableOrg, {
          orgId: row.id,
        })
      }
      if (!resp.error) {
        this.$msg.success('操作成功！')
        this.search()
      }
    },
    handleSuccess(form, type) {
      this.search()
      this.dialogVisible = false
      this.$emit('success', form, type)
    },
    // 列表 选择改变
    selectChange(selection) {
      this.selectRow = selection
    },
    async searchBody() {
      const query = this.otherQuery(this.query)
      const { id, dimensionId } = this.orgData
      const parentId = this.orgData.type === 'root' ? null : id
      const payload = { parentId, dimensionId, ...query }
      // 业务对象
      if (this.type == 'businessObject' && this.businessObjId) {
        payload.businessObjId = this.businessObjId
      }
      let resp = null
      if (this.orgData.type === 'root') {
        resp = await this.dispatch(OrgController.queryOrgsWithPage, {
          dimensionId,
          ...query
        })
      } else {
        resp = await this.dispatch(
          OrgController.queryChildOrgsWithPage,
          payload
        )
      }
      return resp
    },
    async removeBody(row) {
      const resp = await this.dispatch(OrgController.deleteByIds, [
        row.id,
      ])
      if (!resp.error) {
        this.parentRef.tree.remove({ id: row.id })
      }
      return resp
    },
    async OrgExport() {
      ajaxUtil.config.responseType = 'blob'
      let payload = {}
      payload = {
        dimensionId: this.dimensionData.id,
      }
      const resp = await this.dispatch(
        OrgController.exportOrg,
        payload
      )
      ajaxUtil.config.responseType = 'json'
      if (!resp.error) {
        const blob = new Blob([resp.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,charset=utf-8' })
        FileSaver.saveAs(blob, `${this.dimensionData.name}维度-组织机构信息.xlsx`)
      }
    }
  },
}
</script>
<style lang="scss" scoped>
</style>
