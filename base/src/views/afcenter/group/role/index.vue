<template>
  <div class="pl-20 pr-20">
      <div class="top-block">
        <el-row>
            <el-col :span="12">
                <PmToolbar>
                    <PmToolbarItem  type="primary" icon="el-icon-plus" @click="openAdd">添加分组角色</PmToolbarItem>
                    </PmToolbar>
            </el-col>
            <el-col :span="12" class="text-right">
                <PmSearch 
                class="float-right"
                style="width: 300px;" 
                :query.sync="query" 
                defaultProp="name" 
                @search="pmSearch" 
                placeholder="搜索角色名称"
                >
                    <template slot="body">
                    <el-form-item label="角色编码" prop="code">
                        <el-input v-focus v-model="query.code" clearable />
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
      height="calc(100vh - 408px)"
      :columns="columns"
      border
      :tableData="gridList"
      autoSelectRow
      @selection-change="selectChange"
    >
    </pm-table>
    <Pagination 
        :selections="selections"
        :page-size="query.limit"
        :current-page.sync="query.offset"
        :total="gridTotal"
        @size-change="changePageSizer"
        @current-change="changePage"
    />
  </div>
</template>

<script>
import { BaseVue, List } from "@lib";
import { RoleController } from '@controller'
export default {
  name: "",
  components: {},
  mixins: [BaseVue, List],
  props: {},
  data() {
    return {
      columns: [
        { label: "编码", prop: "code", scope: "code" },
        { label: "名称", prop: "name" },
        { label: "描述", prop: "description" },
        { label: "操作", scope: "action" },
      ],
    };
  },
  watch: {},
  computed: {},
  mounted() {
      // this.search()
  },
  methods: {
    // 列表 选择改变
    selectChange(selection) {
      this.selectRow = selection;
    },
    async searchBody() {
      let query = this.otherQuery(this.query) 
      let payload = { type:this.type, ...query}
      
      const resp = await this.dispatch(RoleController.queryRolesWithPage, payload)
      return resp
    },
  },
};
</script>
<style></style>
