//成员信息
<template>
  <div>
      <div class="top-block">
        <el-row>
            <el-col :span="12">
                <PmToolbar>
                    <PmToolbarItem plain v-permission="FuncCode.afc_f_workgroup_employee_add" @click="openAdd" icon="el-icon-plus">添加员工</PmToolbarItem>
                    </PmToolbar>
            </el-col>
            <el-col :span="12" class="text-right">
                <PmSearch 
                class="float-right"
                style="width: 300px;" 
                :query.sync="query" 
                defaultProp="name" 
                @search="pmSearch" 
                placeholder="搜索员工姓名"
                >
                    <template slot="body">
                    <el-form-item label="员工姓名" prop="name">
                        <el-input v-model="query.name" clearable />
                    </el-form-item>
                    <el-form-item label="员工编号" prop="code">
                        <el-input v-model="query.code" clearable />
                    </el-form-item>
                    </template>
                </PmSearch>
            </el-col>
        </el-row>
      </div>
    <pm-table
      :height="height"
      :columns="columns"
      :tableData="gridList"
      border
      stripe
      autoSelectRow
      @selection-change="selectChange"
    >
      
      
      <div class="inline-action" slot="code" slot-scope="scope">
        <span>{{scope.row.employee.code}}</span>
      </div>
      <div class="inline-action" slot="name" slot-scope="scope">
        <span>{{scope.row.employee.name}}</span>
      </div>
      <div class="inline-action" slot="orgName" slot-scope="scope">
        <span>{{scope.row.orgName}}</span>
      </div>
      <div class="inline-action" slot="action" slot-scope="scope">
        <PmToolbar>
            <el-link  v-permission="FuncCode.afc_f_workgroup__employee_del" @click="remove(scope.row)">删除</el-link>
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
      <SelectUser
      @input="handleMember"
      :isMultiple="true"
      :dialogVisible.sync="dialogVisible"
      v-model="member"
    ></SelectUser>
      
  </div>
</template>

<script>
import { EmployeeController, WorkGroupController } from "@controller";
import { BaseVue, List } from "@lib";
import user from "../../user/components/user";
export default {
  name: "CoframeForm",
  mixins: [BaseVue,List],
  props: {
    workGroupData:{},
    height:{
      default:'290px'
    },
    actionVisible: { type: Boolean, default: () => false },
  },
  components: {user},
  data() {

    return {
      member: [],
      memberVisible: false,
      leftArray:[],
      rightArray:[],
      data: [],
      value: [],
      columns:[
        {label: "员工编号",scope: "code"},
        {label: "姓名",scope: "name"},
        {label: "机构",scope:"orgName",},
        {label: "操作",scope:"action"},
      ]
    };
  },

  mounted() {
    
  },
  watch: {
    workGroupData(value){
      if(value){
        this.search()
      }
    },
    dialogVisible(value){
      if(!value){
        this.member = []
      }
    }
  },
  methods: {
    async handleMember(selected) {
      let resp = {};
      const employeeIds = selected.map(i=>{return i.employee.id})
      resp = await this.dispatch(
        WorkGroupController.createEmployeesInWorkgroup,
        {
          employeeIds: employeeIds,
          workGroupId: this.workGroupData.id,
        }
      );
      if (!resp.error) {
        this.$msg.success("保存成功!");
        this.$emit("success");
      }
      this.search()
    },
    // 请求员工数据
    async queryEmployees(){
     const resp = await this.dispatch(EmployeeController.queryEmployeesByTenantId,{
       ...this.query,
     })
     if(!resp.error){
       const data = []
       for (let i = 0; i <= resp.data.data.length-1; i++) {
        const employee = resp.data.data[i]

        data.push({
          key: employee.id,
          label: employee.name,
          disabled:false
        });
      }
      this.data = data
     }
    },
    // 工作组 批量添加员工
    async handleEmployees(){
      const resp = await this.dispatch(WorkGroupController.createEmployeesInWorkgroup,{
        employeeIds:this.value,
        workGroupId:this.workGroupData.id,
      })
      if(!resp.error){
        this.$msg.success("操作成功！")
      }
    },
    async searchBody() {
      const resp = await this.dispatch(WorkGroupController.queryEmployeesInWorkGroup,{
        ...this.query,
        id:this.workGroupData.id,
      })
      return resp
    },
    // 请求工作组员工数据
    async queryEmployeesByWorkGroupId(){
      
      if(!resp.error){
        const data = resp.data.data.map(i=>{
          return i.id
        })
        this.value = data
      }
    },
    async removeBody(row){
      const resp =await this.dispatch(WorkGroupController.deleteEmployeesInWorkgroup,{employeeIds:[row.employee.id],workGroupId:this.workGroupData.id})
      this.$emit("close",row.employee.id)
      this.$emit("success")
      return resp
    },
    async handleSubmit(){
      const resp = await this.$refs['employee'].validateResolve()
      console.log(resp)
      this.dialogVisible = false
      this.search()

    }
  },
};
</script>

<style lang="scss" scoped>
  ::v-deep .el-table tr td {
    height: 40px !important;
  }
    .user-form {
        width: 562px;
        margin: 0 auto;
    }
    
</style>
