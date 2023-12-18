<template>
  <div class="mr-20">
    <div class="top-block">
      <el-row>
        <el-col :span="16">
          <PmToolbar class="ml-5">
            <PmToolbarItem
              plain
              v-permission="FuncCode.afc_f_resource_add"
              icon="el-icon-plus"
              @click="openFunc('addFunction', null)"
              >新建数据</PmToolbarItem
            >
            <PmToolbarItem
              plain
              :disabled="multipleSelection.length == 0"
              @click="bulkDelete"
              >批量删除</PmToolbarItem
            >
            <PmToolbarItem
              plain
              v-permission="FuncCode.afc_f_resource_edit_types"
              :disabled="multipleSelection.length == 0"
              @click="openFunc('selectGroup', null)"
              >转移分组</PmToolbarItem
            >
          </PmToolbar>

          <el-dialog title="选择分组" :visible.sync="groupEnable" width="25%">
            <el-select v-model="selectGroup" placeholder="请选择分组">
              <el-option
                v-for="item in groups"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <div style="margin-top: 10%; margin-left: 20%">
              <el-button type="primary" @click="closeGroup">取消</el-button>
              <el-button type="success" @click="submitGroup">确定</el-button>
            </div>
          </el-dialog>
        </el-col>
        <el-col :span="8" class="text-right">
          <PmSearch
            class="float-right"
            style="width: 300px"
            :query.sync="query"
            defaultProp="name"
            @search="pmSearch"
            placeholder="搜索数据名称"
          >
            <template slot="body">
              <el-form-item label="数据名称" prop="name">
                <el-input v-model="query.name" clearable />
              </el-form-item>
              <el-form-item label="数据编号" prop="code">
                <el-input v-focus v-model="query.code" clearable />
              </el-form-item>
            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-loading="loading"
      :id="tableId" 
      :data="gridList"
      :height="autoTableHeight"
      border
      stripe
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column sortable="code" label="编号" prop="code">
        <template slot-scope="{ row }">
          <el-link @click="openFunc('editFunction', row)">{{
            row.code
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        sortable="name"
        label="数据名称"
        prop="name"
      ></el-table-column>
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
    <DataFrom
        slot="form"
        :formType="formType"
        :params="parameter"
        :appCode="appCode"
        :form-data="formType==='editFunction'?selectRow:null"
        :businessObjId="businessObjId"
        @success="success"
        v-if="dataVisible"
        :dialogVisible.sync="dataVisible"
      />
    <pm-form-dialog
      width="480px"
      :showFooter="true"
      :title="`${TEXT[formType]}`"
      :dialog-visible.sync="dialogVisible"
      :loading="btnLoading"
      okText="确定"
    >
    <template v-if="dialogVisible">
      <SelectGroup
        slot="form"
        :tableData="groups"
        :loading.sync="btnLoading"
        :multipleSelection="multipleSelection"
        @pmsuccess="pmSearch"
      />
      </template>
    </pm-form-dialog>
  </div>
</template>
<script>
import { ResGroupController, ResourceController } from "@controller"
import { BaseVue, List, VueUtil } from "@lib"
import SelectGroup from "../group/selectGroup.vue"
import DataFrom from "./data-form.vue"
export default {
  components: { DataFrom, SelectGroup },
  mixins: [BaseVue, List],
  props: {
    type: {
      type: String,
      default: "type",
    },
    appid: {
      type: String,
      default: "appid",
    },
    groupid: {
      type: String,
      default: "groupid",
    },
    businessObjId: {
      type: String,
      default: null,
    },
    appCode:{
      type: String,
    }
  },
  data() {
    return {
      query: {},
      TEXT: {
        addFunction: "新建数据",
        editFunction: "编辑数据",
        selectGroup: "选择分组",
      },
      dialogVisible: false,
      dataVisible: false,
      formType: null,
      parameter: {},
      groupEnable: false,
      multipleSelection: [],
      selectGroup: null,
      groups: [],
      btnLoading: false,
    };
  },
  watch: {
    type(val) {
      this.search();
    },
    groupid(val) {
      this.search();
    },
    businessObjId(res) {
      this.businessObjId = res;
      this.search();
    },
  },
  mounted() {
    this.search();
  },
  computed: {
    ...VueUtil(this)
      .select([ ResGroupController, ResourceController ])
      .state(),
    loading() {
      return this.ResourceController.queryResourcesByCriteria.loading;
    },
  },
  methods: {
    openFunc(formType, value) {
      this.formType = formType;
      if (formType === "editFunction") {
        this.dataVisible = true
        this.selectRow = value;
      }
      if (formType === "addFunction") {
        this.dataVisible = true
        this.parameter = {
          appId: this.appid,
          type: this.type,
          resGroupId: this.groupid,
        };
      }
      if (formType === "selectGroup") {
        this.dialogVisible = true;
        this.changeGroups();
      }
    },
    async searchBody() {
      const q = this.otherQuery(this.query);
      let payload =
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
            };
      const resp = await this.dispatch(
        ResourceController.queryResourcesByCriteria,
        payload
      );
      return resp;
    },
    async removeBody(row) {
      let payload = [row.id];
      const resp = await this.dispatch(ResourceController.deleteByIds, payload);
      return resp;
    },
    async bulkDelete() {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const payload = this.multipleSelection.map((sel) => {
            return sel.id;
          });
          const resp = await this.dispatch(
            ResourceController.deleteByIds,
            payload
          );
          if (!resp.error) {
            this.pmSearch();
            this.$msg.success("删除成功")
          }
        })
        .catch(() => {});
    },
    async searchGroup() {
      let query = {
        pageIndex: 0,
        pageSize: 999,
      };
      let payload = { appId: this.appid, ...query };
      const resp = await this.dispatch(
        ResGroupController.queryResGroupsByCriteria,
        payload
      );
      return resp.data.data;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    async changeGroups() {
      const groups = await this.searchGroup();
      this.groups = groups;
    },
    success(){
      this.dataVisible = false
      this.search()
    }
  },
};
</script>