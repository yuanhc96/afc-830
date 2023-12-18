<template>
  <div>
    <div class="top-block">
      <el-row >
        <el-col :span="24" class="text-right">
          <div class="selectUser_search">
            <PmSearch
              style="width:100%;" 
              :query.sync="query"
              defaultProp="name"
              @search="pmSearch"
              placeholder="搜索岗位名称"
            >
              <template slot="body">
                <el-form-item label="岗位编码" prop="code">
                  <el-input v-focus v-model="query.code" clearable />
                </el-form-item>
                <el-form-item label="岗位名称" prop="name">
                  <el-input v-model="query.name" clearable />
                </el-form-item>
              </template>
            </PmSearch>
          </div>
        </el-col>
      </el-row>
    </div>
    <pm-table
      height="328px"
      checked
      :columns="columns"
      border
      :tableData="gridList"
      autoSelectRow
      :header-cell-class-name="cellHandler"
      :cell-class-name="cellHandler"
      @selection-change="selectChange"
    >
     <div
        
        class="inline-action"
        slot="status"
        slot-scope="scope"
      >
        <span>{{ scope.row.status === "1" ? "启用" : "禁用" }}</span>
      </div>
    </pm-table>
    <el-pagination
      :page-size.sync="query.limit"
      :current-page.sync="query.offset"
      :total="gridTotal"
      :page-sizes="[10,20,30,40]"
      @size-change="changePageSizer"
      @current-change="changePage"
      layout="total,prev, pager, next, jumper"
    />
  </div>
</template>

<script>
import { BaseVue, List } from "@lib";
import { PositionController } from "@controller";
export default {
  name: "",
  components: {},
  mixins: [BaseVue, List],
  props: {
    selectedRows:[],
    data:[],
    dialogqueryFun:{},
    orgData:{}
  },
  data() {
    return {
      columns: [
        { label: "编码", prop: "code", },
        { label: "名称", prop: "name" },
        { label: "状态", scope: "status", },
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
    cellHandler(cell){
      if(cell.column.type==="selection"){
        return "selection"
      }
    },
    // 列表 选择改变
    selectChange(selection) {
      this.$emit("update:selectedRows",selection)
    },
    async searchBody() {
       if(this.dialogqueryFun){
        const resp = await this.dialogqueryFun.call(this,{orgId:this.orgData.id,...this.query})
        // resp.data.data = resp.data.data.map(i=>{return i.role})
        
        return  resp
       }
      let query = this.otherQuery(this.query);
      let payload = { type: this.type, ...query };

      const resp = await this.dispatch(
        PositionController.queryPositionsByCriteria,
        payload
      );
      return resp;
    },
  },
};
</script>
<style scoped lang="scss">
  ::v-deep .selection{
    .cell{
      padding: 0px!important;
      text-align: center;
    }
  }
</style>
