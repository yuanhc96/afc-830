<template>
  <div class="pb-20" >
    <div class="top-block">
      <el-row>
        <el-col :span="12">
          <PmToolbar>
            <el-button @click="openAdd" plain  icon="el-icon-plus">
              添加角色
            </el-button>
          </PmToolbar>
        </el-col>
        <el-col :span="12" class="text-right">
          <PmSearch
            class="float-right"
            style="width: 300px"
            :query.sync="query"
            defaultProp="name"
            @search="pmSearch"
            placeholder="搜索角色名称"
          >
            <template slot="body">
              <el-form-item label="角色编号" prop="code">
                <el-input v-model="query.code" clearable />
              </el-form-item>
              <el-form-item label="角色名称" prop="name">
                <el-input v-model="query.name" clearable />
              </el-form-item>
            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <pm-table
      :id="tableId"
      :height="height"
      border stripe
      :columns="columns"
      :tableData="gridList"
      autoSelectRow
      @selection-change="selectChange"
      v-loading="loading"
    >
      <div class="inline-action" slot="action" slot-scope="scope">
        <PmToolbar>
          <PmToolbarItem type="text" size="mini" @click="remove(scope.row)"
            >删除</PmToolbarItem
          >
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
    <select-types
      :dialog-visible.sync="dialogVisible"
      :orgData="orgData"
      :dialogqueryFun="dialogqueryFun"
      :isMultiple="true"
      :partyTypes="partyTypes"
      title="添加角色"
      @sure="handleSuccess"
    ></select-types>
  </div>
</template>

<script>
import { PortalController } from "@controller"
import { BaseVue, List } from "@lib"
export default {
  components: {},
  mixins: [BaseVue, List],
  props: {
    portalId: {
      default: {},
    },
    height: {
      default: function () {
        return "calc(100vh - 408px)"
      },
    },
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      columns: [
        { label: "角色编号", prop: "code", scope: "code" },
        { label: "角色名称", prop: "name", scope: "name" },
        { label: "操作", scope: "action", width: 120 },
      ],
      partyTypes: [{ code: "role", name: "角色" }],
    }
  },
  watch: {},
  computed: {},
  mounted() {
    this.search()
  },
  methods: {
    async handleSuccess(form) {
      let resp
      const ids = form.map((i) => {
        return i.id
      })
      resp = await this.dispatch(PortalController.bindRoleWidgets, {
        roleIds:ids,
        id: this.portalId,
      })
      if (!resp.error) {
        this.$msg.success("添加成功")
        this.dialogVisible = false
        this.search()
        this.$emit("success")
      }
    },
    // 列表 选择改变
    selectChange(selection) {
      this.selectRow = selection
    },
    async searchBody() {
      const q = this.otherQuery(this.query)
      const payload = {
        ...q,
        id:this.portalId,
        tenantId: this.currentTenant,
      }
      const resp = await this.dispatch(PortalController.queryRolesByPortalIdWithPage,payload)
      return resp
    },
    async removeBody(row) {
        let resp  
        resp = await this.dispatch(PortalController.unbindRolePortals, {
          roleIds:[row.id],
          id: this.portalId,
        })
      this.$msg.success("删除成功")
      return resp
    },
  },
}
</script>
<style></style>
