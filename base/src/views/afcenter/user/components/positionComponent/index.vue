<template>
  <el-dialog
    :visible.sync="visible"
    title="编辑岗位"
    append-to-body
    width="1000px"
    :close-on-click-modal="false"
  >
    <div class="body ml-10 mr-10">
      <el-row :gutter="10">
        <el-col class="h-100" :span="11">
          <div class="block">
            <RoleList :data.sync="unroleList" :selectedRows.sync="selections.unroleList" />
          </div>
        </el-col>
        <el-col :span="2">
          <div class="move_btns">
            <el-button
              type="primary"
              :disabled="disabledTurnRightOrg"
              icon="el-icon-arrow-right"
              circle
              @click="addRole"
            ></el-button>
            <el-button
              type="primary"
              :disabled="disabledTurnLeftOrg"
              icon="el-icon-arrow-left"
              circle
              @click="deleteRole"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-d-arrow-right"
              v-if="type != 'user' && type != 'emp'"
              @click="addAllRoles"
              circle
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-d-arrow-left"
              @click="deleteAllRoles"
              circle
            ></el-button>
          </div>
        </el-col>
        <el-col class="h-100" :span="11">
          <el-table
            tooltip-effect="dark"
            style="width: 100%"
            height="100%"
            border
            :data="roleList"
            @selection-change="changeAuthorized"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column label="已添加岗位" prop="name" />
          </el-table>
        </el-col>
      </el-row>
    </div>
    <el-row slot="footer" type="flex" justify="center">
      <el-button type="primary" @click="submit">确定</el-button>
      <el-button @click="close">取消</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
import { BaseVue, List } from "@lib";
import { OrgController, RoleController } from "@controller";
import RoleList from "./list.vue";
export default {
  mixins: [BaseVue, List],
  props: {
    data: {
      default: {},
    },
    orgData: {},
    visible: false,
    roles: [],
  },
  components: { RoleList },
  data() {
    return {
      roleData: null,
      roleList: [],
      unroleList: [],
      types: {
        OrgOrganization: "org",
        OrgRole: "role",
        OrgEmployee: "emp",
        user: "user",
      },
      selections: {
        roleList: [],
        unroleList: [],
      },
    };
  },
  computed: {
    actionType() {
      if (this.data && Object.keys(this.data).length > 0) {
        return "edit";
      } else {
        return "add";
      }
    },
    roleInfo() {
      const query = {
        pageIndex: 0,
        pageSize: 10,
        orgId: this.orgData.id,
      };
      if (this.actionType === "edit") {
        query.employeeId = this.data.employee.id;
      }
      return query;
    },
  },
  watch: {
    data: {
      immediate: true,
      handler(value) {
        if (value && !value.employee) {
          this.data.employee = { ...value };
        }
        this.loadData();
      },
    },
    visible: {
      handler(value) {
        if (value && this.actionType === "add") {
          this.loadData();
        }
      },
    },
  },
  mounted() {},
  methods: {
    submit(){
      this.$emit("success",this.roleList)
      this.close();
    },
    close(){
      this.$emit("update:visible",false)
    },
    changeAuthorized(items) {
      this.selections.roleList = items;
    },
    changeUnauthorized(items) {
      this.selections.unroleList = items;
    },
    async loadData() {
      this.loadroleList();
      this.loadUnroleList();
      this.selections.roleList = [];
      this.selections.unroleList = [];
    },
    async deleteAllRoles() {
      this.selections.roleList = this.roleList;
      this.deleteRole();
    },
    addAllRoles() {
      this.selections.unroleList = this.unroleList;
      this.addRole();
    },
    addRole() {
      if (this.selections.unroleList.length > 0) {
          this.roleList=[...this.selections.unroleList]
      }
    },
    deleteRole() {
      if (this.selections.roleList.length > 0) {
        const ids = this.selections.roleList.map(i=>{
          return i.id
        })
        this.roleList = this.roleList.filter(i=>{return !ids.includes(i.id)} )
      }
    },
    async loadroleList() {
      if (this.actionType === "add") {
        return;
      }
      const resp = await this.dispatch(OrgController.queryRolesInOrg, {
        ...this.roleInfo,
      });

      if (!resp.error) {
        this.roleList = resp.data.data.map((i) => {
          return i.role;
        });
      }
    },
    async loadUnroleList() {
      if (this.orgData) {
        const query = { ...this.roleInfo };
        delete query.employeeId;
        const resp = await this.dispatch(RoleController.queryRolesByCriteria, {
          ...query,
        });
        if (!resp.error) {
          this.unroleList = resp.data.data;
        }
      }
    },
    getSelected() {
      return this.roleList;
    },
  },
};
</script>
<style lang="scss" scoped>
.body  {
   .el-row {
    height: 420px;
    .selectUser_table {
      .el-row {
        height: 50px;
      }
    }
    .block {
      height: 100%;
      overflow: auto;
      border: 1px solid #ddd;
      border-top: none;
    }
    .block_right {
      .el-tree-node__content {
        .item {
          // height: 40px;
          width: 100%;
          i {
            // line-height: 35px;
            font-size: 20px;
            color: #ddd;
          }
        }
      }
    }
    .right_title {
      border: 1px solid #ddd;
      background: #eaf0ff;
      color: #8f8888;
      padding-left: 10px;
      height: 28px;
    }
    .move_btns {
      width: 54px;
      margin: 0 auto;
      margin-top: 100px;
      text-align: center;
      :nth-child(2) {
        margin: 15px 0 0;
      }
      :nth-child(3) {
        margin: 40px 0 0;
      }
      :nth-child(4) {
        margin: 15px 0 0;
      }
    }
  }
}
.h-100 {
  height: 100%;
}
.el-tree-node {
  role: relative;
  padding-left: 16px;
}
.el-tree-node::before {
  border-left: 1px dashed #4386c6;
  bottom: 0px;
  height: 100%;
  top: -20px;
  width: 1px;
}
.el-tree-node::after {
  border-top: 1px dashed #4386c6;
  height: 20px;
  top: 17px;
  width: 24px;
}
</style>
