<template>
  <pm-dialog width="800px" title="选择岗位" :show-footer="true" :visible.sync="dialogVisible" :loading="loading" top="60px"
    :before-close="cancel">

    <div class="pl-20 pr-20">
      <div v-if="showSearch" class="top-block">
        <div style="float:right">
          <PmSearch class="float-right" style="width: 300px" :query.sync="query" default-prop="name" placeholder="搜索机构名称"
            @search="pmSearch">
            <template slot="body">
              <el-form-item label="机构编号" prop="code">
                <el-input v-model="query.code" clearable />
              </el-form-item>
              <el-form-item label="机构名称" prop="name">
                <el-input v-model="query.name" clearable />
              </el-form-item>
            </template>
          </PmSearch>
        </div>
      </div>
      <pm-table :height="height" border stripe :columns="columns" :table-data="gridList" auto-select-row
        @selection-change="selectChange">
        <div slot="code" slot-scope="scope" class="inline-action">
          <el-link v-if="allow(FuncCode.afc_f_org_edit)" @click="openEdit(scope.row)">{{ scope.row.code }}</el-link>
          <span v-else>{{ scope.row.code }}</span>
        </div>
        <div slot="action" slot-scope="scope" class="inline-action">
          <PmToolbar>
            <PmToolbarItem v-permission="FuncCode.afc_f_org_del" :disabled="isRef" type="text" size="mini"
              @click="addPosition(scope.row)">选择岗位</PmToolbarItem>
          </PmToolbar>
        </div>
      </pm-table>
      <Pagination v-if="showSearch" :selections="selections" :page-size="query.limit" :current-page.sync="query.offset" :total="gridTotal"
        @size-change="changePageSizer" @current-change="changePage" />
    </div>
  </pm-dialog>
</template>

<script>
import { OrgController } from '@controller'
import { BaseVue, List } from '@lib'

export default {
  name: '',
  components: {},
  mixins: [BaseVue, List],
  inject:['elForm'],
  props: {
    employeeCode:{
      type: String,
      default: "",
    },
    orgData: {},
    dimensionData: {},
    isRef: {
      default: function () {
        return false
      }
    }
  },
  data() {
    return {
      columns: [
        { label: '机构编号', prop: 'code', scope: 'code' },
        { label: '机构名称', prop: 'name' },
        { label: '操作', scope: 'action', width: 150 },
      ],
      loading: false,
      dialogVisible: false,
    }
  },
  computed: {
    height() {
      if (this.userInfo.attributes.isOrgManager) {
        return 'calc(100vh - 328px)'
      } else {
        return 'calc(100vh - 370px)'
      }
    },
    showSearch(){
      if(this.elForm){
        return false
      }else{
        return true
      }
    }
  },
  watch: {
    orgData(value) {
      if (value) { this.search() } else {
        this.gridData = []
      }
    },
  },
  created() {
    if (this.orgData) {
      this.search()
    }
  },
  methods: {
    handleSuccess(form, type) {
      this.search()
    },
    addPosition(row) {
      this.$emit('change', row)
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
      let Api = OrgController.queryOrgsWithPage
      if(this.employeeCode){
        payload.code = this.employeeCode
        Api = OrgController.findOrgByEmployeeCode
        if(this.elForm){
          if(this.elForm.dimensionData){
            console.log(this.elForm.dimensionData)
            payload.dimensionCode = this.elForm.dimensionData.code

          }
        }
      }
      const resp = await this.dispatch(Api, {
        dimensionId,
        ...payload
      })

      return resp
    },
    // 取消
    cancel() {
      this.dialogVisible = false
    },
    show() {
      this.dialogVisible = true
    },
    close() {
      this.dialogVisible = false
    }
  },
}
</script>
<style></style>
