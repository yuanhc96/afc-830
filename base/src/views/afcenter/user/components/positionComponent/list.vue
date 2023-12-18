<template>
  <div>
    <div class="top-block mb-10">
      <el-row >
        <el-col :span="24" class="text-right">
          <div class="selectUser_search">
            <PmSearch
              style="width:100%;" 
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
      height="348px"
      :columns="columns"
      border
      :tableData="gridList"
      autoSelectRow
      @selection-change="selectChange"
    >
    </pm-table>
    <el-pagination
      :page-size.sync="query.limit"
      :current-page.sync="query.offset"
      :total="gridTotal"
      :page-sizes="[10,20,30,40]"
      @size-change="changePageSizer"
      @current-change="changePage"
      layout="total, sizes, prev, pager, next, jumper"
    />
  </div>
</template>

<script>
import { BaseVue, List } from "@lib";
import { RoleController } from "@controller";
export default {
  name: "",
  components: {},
  mixins: [BaseVue, List],
  props: {
    selectedRows:[],
    data:[],
  },
  data() {
    return {
      columns: [
        { label: "编码", prop: "code", scope: "code" },
        { label: "名称", prop: "name" },
        { label: "描述", prop: "description" },
      ],
    };
  },
  watch: {
    gridList(value){
      this.$emit("update:data",value)
    }
  },
  computed: {},
  mounted() {
    this.search();
  },
  methods: {
    // 列表 选择改变
    selectChange(selection) {
      this.$emit("update:selectedRows",selection)
    },
    async searchBody() {
      let query = this.otherQuery(this.query);
      let payload = { type: this.type, ...query };

      const resp = await this.dispatch(
        RoleController.queryRolesWithPage,
        payload
      );
      return resp;
    },
  },
};
</script>
<style></style>
