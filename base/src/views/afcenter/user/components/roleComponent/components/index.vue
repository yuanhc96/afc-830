<template>
  <el-dialog
    :visible.sync="visible"
    title="添加角色"
    append-to-body
    width="800px"
    @closed="close"
    :close-on-click-modal="false"
  >
    <div class="body ml-10 mr-10 mt-20">
      <el-row :gutter="10">
        <el-col :span="11">
          <RoleList ref="roleList" :businessObjId="businessObjId" :dialogqueryFun="dialogqueryFun" :orgData="orgData" v-if="visible" :data.sync="unroleList" :selectedRows.sync="selections.unroleList" />
        </el-col>
        <el-col :span="2">
          <div class="move_btns">
            <!-- <el-button
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
            ></el-button> -->
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
        <el-col :span="11">
          <div class="right_title p-5">
            <span>已添加角色</span>
          </div>
          <div class="block">
            <el-table
            class="selected"
            tooltip-effect="dark"
            height="399px"
            :show-header="false"
            :data="roleList"
            @selection-change="changeAuthorized"
          >
            <!-- <el-table-column type="selection" width="55" /> -->
            <el-table-column  prop="name" />
            <el-table-column width="80px">
              <template slot-scope="{row}">
                <el-button type="text" icon="el-icon-delete" @click="removeRow(row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-row slot="footer" class="dialog-footer">
      <el-button v-if="showPreview" @click="previewStep">上一步</el-button>
      <el-button v-else @click="close">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
import { BaseVue, List, _ } from "@lib";
import { OrgController, RoleController  } from "@controller";
import RoleList from "./list.vue";
export default {
  mixins: [BaseVue, List],
  props: {
    data: {
      default: {},
    },
    params: {
      default(){
        return { 
         orgId:""
        }
      },
    },
    orgData:{},
    dialogqueryFun:{},
    showPreview:{
      type: Boolean,
      default: false
    },
    visible: false,
    roles: [],
    businessObjId:{
      type:String,
    }
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
      preview:false //el-dialog close方法重复调用，标记状态
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
        ...this.params
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
        if(!value){
          this.roleList = []
        }
        if (value && this.actionType === "add") {
          this.loadData();
        }
      },
    },
    'selections.unroleList': {
      immediate: true,
      deep: true,
      handler(val) {
        this.roleList = val
      }
    }
  },
  mounted() {},
  methods: {
    submit(){
      this.$emit("success",this.roleList)
    },
    close(){
      if (this.$listeners['cancel']&&this.preview==false) {
        this.$emit('cancel')
      }
      if(this.preview==true){
        this.preview = false
      }
      this.$emit("update:visible",false)
    },
    previewStep(){
      this.preview = true
      this.$emit('previewStep')
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
      this.$refs.roleList.toggleSelections('none')
    },
    addAllRoles() {
      this.selections.unroleList = _.cloneDeep(this.unroleList);
      this.addRole();
      this.$refs.roleList.toggleSelections('all')
    },
    addRole() {
      if (this.selections.unroleList.length > 0) {
          const arr = [...this.roleList]
          arr.push(...this.selections.unroleList)
          const dupArr = _.uniqWith(arr, _.isEqual)
          this.roleList=[...dupArr]
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
      // if (this.actionType === "add") {
      //   return;
      // }
      // const resp = await this.dispatch(OrgController.queryRolesInOrg, {
      //   ...this.roleInfo,
      // });

      // if (!resp.error) {
      //   this.roleList = resp.data.data.map((i) => {
      //     return i.role;
      //   });
      // }
    },
    async loadUnroleList() {
      if (this.params) {
        let query = { ...this.roleInfo };
        delete query.employeeId;
        if(this.businessObjId){
          query = { businessObjId:this.businessObjId ,...query}
        }
        const resp = await this.dispatch(RoleController.queryRolesWithPage,query);
        if (!resp.error) {
          this.unroleList = resp.data.data;
        }
      }
    },
    getSelected() {
      return this.roleList;
    },
    removeRow(row) {
      const index = _.indexOf(this.selections.unroleList.map(i => i.id), row.id)
      this.selections.unroleList.splice(index, 1)
      this.$refs.roleList.toggleSelections(row)
    }
  },
};
</script>
<style lang="scss" scoped>
::v-deep .selected {
  .el-table__cell {
    padding-left: 20px;
  }
}
.body  {
   .el-row {
    .block {
      height: 400px;
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
      background: #f5f5f5;
      color: #8f8888;
      padding-left: 10px;
      height: 32px;
    }
    .move_btns {
      width: 54px;
      margin: 0 auto;
      margin-top: 170px;
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
  position: relative;
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
