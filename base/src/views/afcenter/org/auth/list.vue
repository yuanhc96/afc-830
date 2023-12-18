<comment>
//分级授权
</comment>
<template>
  <div>
    <div class="top-block">
      <el-row>
        <el-col :span="16">
          <PmToolbar>
            <PmToolbarItem
              v-permission="FuncCode.afc_f_org_manager_employee_add"
              plain
              icon="el-icon-plus"
              @click="openAdd"
            >添加管理员</PmToolbarItem>
            <PmToolbarItem
              v-if="!userInfo.attributes.isOrgManager"
              plain
              @click="editOpen('first')"
            >管理权限设置</PmToolbarItem>
          </PmToolbar>
        </el-col>
        <el-col :span="8" class="text-right">
          <PmSearch
            class="float-right"
            style="width: 300px"
            :query.sync="query"
            default-prop="name"
            placeholder="搜索管理员姓名"
            @search="pmSearch"
          >
            <template slot="body">
              <el-form-item label="管理员名称" prop="name">
                <el-input v-model="query.name" clearable />
              </el-form-item>
              <el-form-item label="管理员编号" prop="code">
                <el-input v-model="query.code" clearable />
              </el-form-item>
            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <pm-table
      :id="tableId"
      :height="autoTableHeight"
      :columns="columns"
      :table-data="gridList"
      border
      stripe
      auto-select-row
      @selection-change="selectChange"
    >
      <div
        slot="status"
        slot-scope="scope"
        class="inline-action"
      >
        <span>{{ scope.row.status === "1" ? "启用" : "禁用" }}</span>
      </div>
      <div slot="action" slot-scope="{row}" class="inline-action">
        <PmToolbar>
          <PmToolbarItem
            v-permission="FuncCode.afc_f_org_manager_employee_del"
            size="mini"
            type="text"
            @click="remove(row)"
          >删除</PmToolbarItem>
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
    <Member ref="member" :is-select="false" title="添加管理员" @success="addHandler" />
    <Tabs body-class="" :show-footer="false" :dialog-visible.sync="editVisible" title="权限管理设置" :items="items" :active-name="activeName" width="800px">
      <Role slot="role" :tree="tree" :org-data="orgData" :func-code="funcCode" :clearable="true" :params="params" :api-name="apiName" height="calc(75vh - 260px)" :ext-api="{}" />
      <Position slot="position" :show-pb20="false" :tree="tree" :org-data="orgData" :func-code="funcCode" :clearable="true" :params="positionParam" :api-name="positionApi" :ext-api="{}" height="calc(75vh - 260px)" />
    </Tabs>
  </div>
</template>

<script>
import Member from '@/views/afcenter/user/components/user'
import Tabs from '@/views/afcenter/user/tabs'
import { OrgController } from '@controller'
import { BaseVue, List } from '@lib'
import authForm from './form.vue'
import Position from './position.vue'
import Role from './role.vue'
export default {
  name: '',
  components: { authForm, Member, Tabs, Role, Position },
  mixins: [BaseVue, List],
  props: {
    orgData: {},
    tree: {
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      apiName: {
        query: 'EmployeeController.query',
        delete: 'EmployeeController.delete',
        create: 'EmployeeController.create',
      },
      positionParam: {
        employeeId: '',
        orgId: '',
        type: 'obj',
        create: {},
        delete: {},
        query: {}
      },
      positionApi: {
        query: 'orgResourceQuery',
        delete: 'employeeDelete',
        create: 'employeeCreate',
      },
      params: {
        query: {},
        delete: {
          path: {},
          key: ''
        },
        create: {
          path: {},
          key: ''
        },
        status: ''
      },
      editVisible: false,
      selectRow2: null,
      items: [
        { label: '角色', name: 'first', slot: 'role', lazy: true },
        { label: '岗位', name: 'second', slot: 'position', lazy: true },
      ],
      activeName: 'first',
      columns: [
        { label: '机构管理员', prop: 'code' },
        { label: '机构管理员姓名', prop: 'name' },
        // { label: "管理组织", prop: "orgName" },
        { label: '操作', scope: 'action', width: 80 },
      ],
    }
  },
  computed: {
    funcCode() {
      return { add: this.FuncCode.afc_f_org_manager_resource_add,
        del: this.FuncCode.afc_f_org_manager_resource_del }
    },
    height() {
      if (this.userInfo.attributes.isOrgManager) {
        return 'calc(100vh - 259px)'
      } else {
        return 'calc(100vh - 281px)'
      }
    },
  },
  watch: {
    orgData: {
      handler: function(value) {
        if (value) {
          this.search()
        } else {
          this.gridData = []
        }
      }
    },
    formData: {
      handler: function(value) {
        this.positionParam.query = { orgId: this.orgData.id }
      }
    }
  },
  mounted() {
    // this.search();
  },
  created() {
    if (this.orgData) {
      this.search()
    }
  },
  methods: {
    editOpen() {
      this.editVisible = true
    },
    openAdd() {
      this.dialogVisible = true
      this.$refs.member.visibleHandler()
    },
    async addHandler({ employee }) {
      const resp = await this.dispatch(OrgController.createManagerInOrg, { orgId: this.orgData.id, employeeId: employee.id })
      if (!resp.error) {
        this.$msg.success('操作成功!')
        this.search()
      }
    },
    // 列表 选择改变
    selectChange(selection) {
      this.selectRow = selection
    },
    async searchBody() {
      const query = { orgId: this.orgData.id, ...this.query }
      const resp = await this.dispatch(OrgController.queryManagerInOrg,
        query
      )
      if (!resp.error) {
        resp.data.data = resp.data.data.map(i => {
          return { ...i, orgName: this.orgData.name }
        })
      }
      return resp
    },
    async removeBody(row) {
      const resp = await this.dispatch(OrgController.deleteManagerInOrg, { employeeId: row.id, orgId: this.orgData.id })
      return resp
    }
  },
}
</script>
<style></style>
