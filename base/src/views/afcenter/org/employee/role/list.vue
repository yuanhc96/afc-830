<template>
  <div>
      <div class="top-block ">
        <el-row type='flex' justify="end">
            <el-col :span="12" class="text-right">
              <div class="selectUser_search">
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
              </div>
            </el-col>
        </el-row>
      </div>
    <pm-table
      checked
      :height="height"
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
  computed: {
    height(){
      if(this.userInfo.attributes.isOrgManager){
        return "calc(100vh - 259px)"
      }else{
        return "calc(100vh - 281px)"
      }
    },
  },
  mounted() {
      this.search()
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
