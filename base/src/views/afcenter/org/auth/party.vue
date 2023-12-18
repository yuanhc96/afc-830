<template>
  <div>
    <div class="top-block">
      <el-row>
        <el-col :span="16">
          <PmToolbar>
            <PmToolbarItem  icon="el-icon-plus" @click="add"
              >新建角色</PmToolbarItem
            >
          </PmToolbar>
        </el-col>
        <el-col :span="8" class="text-right">
          <PmSearch
            class="float-right"
            style="width: 300px"
            :query.sync="query"
            defaultProp="name"
            @search="pmSearch"
            placeholder="搜索角色名称"
          >
            <template slot="body">
              <el-form-item label="角色名称" prop="name">
                <el-input v-model="query.name" clearable />
              </el-form-item>
            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <pm-table
      :height="height"
      :columns="columns"
      border
      :tableData="gridList"
      autoSelectRow
      @selection-change="selectChange"
    >
      <div class="inline-action" slot="action" slot-scope="scope">
        <PmToolbar>
          <PmToolbarItem size="mini" @click="remove(scope.row)"
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

    <Role :orgData="orgData" :visible.sync="visible" @success="addRoles"></Role>
  </div>
</template>

<script>
import { BaseVue, List } from "@lib";
import { RoleController, OrgController } from "@controller";
import Role from "../roleComponent";
import authForm from "./form.vue";
export default {
  name: "",
  components: { authForm, Role },
  mixins: [BaseVue, List],
  props: {
    orgData: {},
  },
  data() {
    return {
      visible: false,
      columns: [
        { label: "编码", prop: "code", scope: "code" },
        { label: "名称", prop: "name" },
        { label: "管理角色", prop: "description" },
        { label: "操作", scope: "action", width: 80 },
      ],
    };
  },
  watch: {
    orgData: {
      deep: true,
      handler: function (value) {
        if (value) {
          this.search();
        }
      },
    },
  },
  computed: {
    height(){
      if(this.userInfo.attributes.isOrgManager){
        return "calc(100vh - 259px)"
      }else{
        return "calc(100vh - 281px)"
      }
    },
  },
  mounted() {},
  methods: {
    add() {
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
    addRoles(roles){
      console.log(111,roles)
    },
    // 列表 选择改变
    selectChange(selection) {
      this.selectRow = selection;
    },
    async searchBody() {
      const { id, dimensionId } = this.orgData;
      let query = { ...this.query, orgId: id, dimensionId };
      const resp = await this.dispatch(OrgController.queryRolesInOrg, query);
      return resp;
    },
  },
};
</script>
<style></style>
