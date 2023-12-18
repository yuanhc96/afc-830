<template>
  <div>
      <div class="top-block">
        <el-row>
            <el-col :span="16">
                <PmToolbar>
                    <PmToolbarItem   icon="el-icon-plus" @click="openAdd">添加角色</PmToolbarItem>
                    </PmToolbar>
            </el-col>
            <el-col :span="8" class="text-right">
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
      :id="tableId"
      :height="autoTableHeight"
      border stripe
      :columns="columns"
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
    <el-dialog :visible.sync="dialogVisible" append-to-body width="800px">
      <roleList :workGroupData="workGroupData" ></roleList>
      <div slot="footer"> 
        <el-button type="primary" @click="dialogVisible=false">取消</el-button>
        <el-button @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { BaseVue, List } from "@lib";
import { RoleController } from '@controller'
import roleList from './list.vue'
export default {
  name: "",
  components: {roleList},
  mixins: [BaseVue, List],
  props: {
    userId:"",
  },
  data() {
    return {
      dialogVisible:false,
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
      
      const resp = await this.dispatch(RoleController.queryRolesWhitPage, payload)
      return resp
    },
  },
};
</script>
<style></style>
