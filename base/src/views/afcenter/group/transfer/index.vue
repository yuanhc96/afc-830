<template>
  <div class="transfer-frame">
    <el-form>
      <el-form-item label="人员">
        <el-select
          v-model="value"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { EmployeeController, WorkGroupController } from "@controller";
import { BaseVue, List } from "@lib";
export default {
  mixins: [List, BaseVue],
  name: "",
  components: {},
  props: {
    workGroupData: {},
  },
  data() {
    return {
      options: [],
      value: [],
      loading: false,
    };
  },
  watch: {},
  computed: {},
  mounted() {},
  methods: {
    async searchBody() {
      let query = this.otherQuery(this.query);
      let payload = { type: this.type, ...query };
      //业务对象
      if (this.type == "businessObject" && this.businessObjId) {
        payload.businessObjId = this.businessObjId;
      }
      const resp = await this.dispatch(
        EmployeeController.queryEmployeesByTenantId,
        payload
      );
      return resp;
    },
    // select远程
    async remoteMethod(query) {
      if (query !== "") {
        this.query = this.otherQuery({ ...this.query, name: query });
        this.loading = true;
        await this.search();
        this.loading = false;
        this.options = this.gridList;
      } else {
        this.options = [];
      }
    },

    async validateResolve() {
      let resp = {};
      resp = await this.dispatch(
        WorkGroupController.createEmployeesInWorkgroup,
        {
          employeeIds: [this.value],
          workGroupId: this.workGroupData.id,
        }
      );
      if (!resp.error) {
        this.$msg.success("保存成功!");
        this.$emit("success");
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
<style language="scss" scoped></style>
