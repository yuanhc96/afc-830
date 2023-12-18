<template>
  <div>
    <el-form
      :ref="formRef"
      label-width="130px"
      class="user-form classify-form"
      :model="form"
      :rules="validateRules"
    >
      <el-form-item v-if="!form.code" label="员工" prop="employeeId">
        <el-select
          v-model.trim="form.employeeId"
          filterable
          remote
          reserve-keyword
          placeholder="输入人员名称搜索"
          :remote-method="remoteUser"
          :loading="loading"
        >
          <el-option
            v-for="(item, index) in managerOpts"
            :key="index"
            :label="item.name"
            :value="item.id"
          >
          </el-option> </el-select
        ><el-button
          @click="openManager({ id: 'chargerId', name: 'chargerId' })"
          icon="el-icon-search"
          class="action-button"
        ></el-button>
      </el-form-item>
      <el-form-item v-if="!form.code" label="岗位" prop="positionIds">
        <el-select
          v-model.trim="form.positionIds"
          filterable
          remote
          multiple
          reserve-keyword
          placeholder="请输入岗位搜索"
          :remote-method="remotePosition"
          :loading="loading"
        >
          <el-option
            v-for="(item, index) in positionOptions"
            :key="index"
            :label="item.name"
            :value="item.id"
          >
          </el-option> </el-select
        ><el-button
          @click="openPosition"
          icon="el-icon-search"
          class="action-button"
        ></el-button>
      </el-form-item>
    </el-form>
    <!-- <Position
      :orgData="orgData"
      :data.sync="formData"
      ref="position"
      :visible.sync="positionVisible"
      @success="successHandler"
    ></Position> -->
    <SelectTypes
      ref="position"
      :activeName="type"
      :positionSearch="positionqueryFun"
      :dialog-visible.sync="positionVisible"
      title="选择岗位"
      :isMultiple="true"
      :partyTypes="partyTypes"
      @sure="successHandler"
    /> 
    <SelectUser
      @input="handleManager"
      :dialogVisible.sync="managerDialogVisible"
      v-model="manager"
    ></SelectUser>
  </div>
</template>

<script>
import {
EmployeeController, OrgController, PositionController
} from "@controller";
import { BaseVue, Form, _ } from "@lib";
import Position from "./position/components/index.vue";
import model from "./userModel.js";
export default {
  name: "",
  mixins: [BaseVue, Form],
  inject:["parentRef"],
  components: { Position },
  props: {
    dimensionData: {},
    orgData: {},
    validate:{
      type:Boolean,
      default: false,
    }
  },
  data() {
    return {
      managerOpts: [],
      manager: { employee: { id: "", name: "" }, org: {} },
      positionVisible: false,
      positionOptions: [],
      formProp: "chargerId",
      managerDialogVisible: false,
      chargerDialogVisible: false,
      orgVisible: false,
      mainFlag: false,
      options: [],
      marOptions: [],
      charOptions: [],
      formRef: "groupform",
      form: _.cloneDeep(model),
      model: model,
      validateRules: {
        employeeId: [
          { required: true, message: "请选择员工", trigger: "change" },
        ],
        positionIds:[{required: true,message:'请选择岗位',trigger:"change"
        }]
      },
      partyTypes: [{code: 'position', name: '岗位'}]
    };
  },
  watch: {
    formType(value) {
      if (value === "add") this.form = _.clone(model);
    },
    manFlag(value) {
      if (!value) {
        // this.form.mainDimensionOrgId = "";
      }
    },
    orgVisible(value) {
      if (value) {
        this.$nextTick(() => {
          this.$refs.orgTree && this.$refs.orgTree.refreshTree();
        });
      }
    },
    managerDialogVisible(value) {
      if (!value) {
        this.manager = { employee: { id: "", name: "" }, org: {} };
      }
    },
    dialogVisible(value) {
      if (!value) {
        this.managerOpts = [];
        this.positionOptions = [];
      }
    },
    // form:{
    //   immediate:true,
    //   handler: function (value){
    //     // if(value){
    //     //   debugger
    //     //   value.employeeId&&(this.marOptions=[{id:value.employeeId,name:value.employee.name}])
    //     // }
    //   }
    // }
  },
  computed: {
    title() {
      return `${this.formType === "add" ? "新建" : "编辑"}组织维度`;
    },
    formType() {
      if (this.formData) {
        return "edit";
      } else {
        return "add";
      }
    },
  },
  mounted() {},
  methods: {
    successHandler(positions) {
      const ids = positions.map((i) => {
        return i.id;
      });
      this.positionOptions = positions;
      this.$nextTick(() => {
        this.form.positionIds = ids;
        });
      this.positionVisible = false;
    },
    openPosition() {
      this.positionVisible = true;
    },
    handleManager(selected) {
      this.managerOpts = [
        { id: selected.employee.id, name: selected.employee.name },
      ];
      this.$nextTick(() => {
        this.form.employeeId = selected.employee.id;
      });
    },
    openManager(prop) {
      this.formProp = prop;
      this.managerDialogVisible = true;
    },
    hidden(type) {
      // 调用组织人员修改方法
    },
    handleSuccess() {},
    openTree() {
      this.orgVisible = true;
    },
    // 远程搜索-岗位
    async remotePosition(query) {
      if (query !== "") {
        this.loading = true;
        let payload = { ...this.query, name: query };
        const resp = await this.dispatch(
          PositionController.queryPositionsByCriteria,
          payload
        );
        if (!resp.error) {
          this.positionOptions = resp.data.data;
        }
        this.loading = false;
      } else {
        this.positionOptions = [];
      }
    },
    // 远程搜索
    async remoteUser(param) {
      const query = {
        pageIndex: 0,
        pageSize: 99,
        name: param,
      };
      const resp = await this.dispatch(
        EmployeeController.queryEmployeesByTenantId,
        query
      );
      if (!resp.error) {
        this.managerOpts = resp.data.data;
        this.options = resp.data.data;
      }
    },
    async validateResolve() {
      let resp = {};
      if (this.formType === "add") {
        resp = await this.dispatch(OrgController.updatePositionsInOrg, {
          ...this.form,
          orgId: this.orgData.id,
        });
        this.cancel();
      } else if (this.formType === "edit") {
        resp = await this.dispatch(OrgController.updatePositionsInOrg, {
          required: true,
          org: {
            ...this.form,
          },
        });
      }
      if (!resp.error) {
        this.$msg.success("保存成功!");
        this.$emit("success");
        return true;
      } else {
        return false;
      }
    },
    async positionqueryFun(param){
      const nodeArr = this.parentRef.tree.getNodePath(this.orgData.id)
      let orgId = ""
      if(nodeArr.length){
        orgId = nodeArr[0].id
      }
      const payload = {...param,orgId}
      const resp =  await this.$refs['position'].dispatch(OrgController.queryPositionsToTree,payload) 
      return resp
    },
  },
};
</script>

<style lang="scss" scoped>
 .action-button{
   display: inline;
   height: 32px;
   //  border-left: none;
   font-size: 14px;
   border-bottom-left-radius:0 ;
   border-top-left-radius:0 ;
   .el-icon-search{
    font-size: 12px;
   }
 }
 ::v-deep .user-form{
   .el-input__inner{
     border-right: none;
     border-bottom-right-radius:0 ;
     border-top-right-radius:0 ;
   }
 }
</style>
