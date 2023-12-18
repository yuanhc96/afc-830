<template>
  <div class="pl-10 pr-10">
    <div class="top-block">
      <el-row>
        <el-col :span="16">
          <PmToolbar class="ml-5 ">
            <PmToolbarItem v-permission="FuncCode.afc_f_water_mark_whitelist_add" plain icon="el-icon-plus" @click="openSelectUser">添加白名单</PmToolbarItem>
          </PmToolbar>

        </el-col>
        <el-col :span="8" class="text-right">
          <PmSearch class="float-right" :query.sync="query" default-prop="name" placeholder="搜索员工姓名" style="width: 300px" @search="pmSearch">
            <template slot="body">
              <el-form-item label="员工编号" prop="code">
                <el-input v-model="query.code" clearable />
              </el-form-item>
              <el-form-item label="员工姓名" prop="name">
                <el-input v-model="query.name" clearable />
              </el-form-item>
            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-loading="EmployeeController.queryEmployeesByTenantId.loading"
      height="calc(100vh - 211px)"
      border
      stripe
      :data="gridList"
      @sort-change="sortChange"
      @selection-change="selectionChange"
    >
      <el-table-column label="员工编号" prop="employee.code" />
      <el-table-column label="姓名" prop="employee.name" />
      <el-table-column label="组织机构" prop="org.name" />
      <el-table-column label="职务" prop="position.name" />
      <el-table-column label="操作" width="150px">
        <template slot-scope="{row}">
          <PmToolbar>
            <PmToolbarItem v-permission="FuncCode.afc_f_water_mark_whitelist_del" type="text" @click="removeWMEmple(row)">删除</PmToolbarItem>
          </PmToolbar>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :selections="selections"
      :page-size="query.limit"
      :current-page.sync="query.offset"
      :total="gridTotal"
      @size-change="changePageSizer"
      @current-change="changePage"
    />
    <!-- <el-row :gutter="0" class="pagination">
      <el-col :span="12" class="pt-10 pl-10">
        &nbsp;<span v-show="selections.length > 0">已选中 {{ selections.length }} 条</span>
      </el-col>
      <el-col :span="12" class="text-right">
        <pagination
          :page-size="query.limit"
          :current-page.sync="query.offset"
          :total="gridTotal"
          @size-change="changePageSizer"
          @current-change="changePage"
        />
      </el-col>
    </el-row> -->
    <SelectUser
      v-model="selected"
      :is-multiple="true"
      :dialog-visible.sync="userDialogVisible"
      @input="handleInput"
    />
  </div>
</template>
<script>
import { localStore } from '@/utils/sessionStore'
import { dealWaterMark } from '@/utils/watermark'
import { EmployeeController, SafetyWhitelistController } from '@controller'
import { BaseVue, List, VueUtil } from '@lib'
export default {
  mixins: [BaseVue, List],
  computed: {
    ...VueUtil(this)
      .select([EmployeeController, SafetyWhitelistController])
      .state(),
  },
  data() {
    return {
      authConfigVisible: false,
      authData: {},
      userId: '',
      selected: [],
      userDialogVisible: false,
    }
  },
  // watch: { // 监测查询条件变化，自动触发查询方法
  //   query: {
  //     deep: true,
  //     immediate: true,
  //     handler: 'search'
  //   }
  // },
  mounted() {
    this.search()
  },
  methods: {
    openAuthConfig(selectRow) {
      this.authData = selectRow
      this.authConfigVisible = true
    },
    openSelectUser() {
      this.userDialogVisible = true
    },
    handleInput(selected) {
      const ids = selected.map(i => i.employee.id)
      this.addSafetyWhiteUser(ids)
    },

    async removeWMEmple(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async() => {
        const payload = [row.employee.id]
        const resp = await this.dispatch(SafetyWhitelistController.deleteByEmployeeIds, payload)
        if (!resp.error) {
          this.pmSearch()
          this.$msg.success('删除成功')
          this.UpdateStorewmlist()
        }
      })
        .catch(() => {

        })
    },
    async searchBody() {
      const q = this.otherQuery(this.query)
      const payload = { ...q }
      const resp = await this.dispatch(EmployeeController.queryEmployeesInSafetyWhitelist, payload)
      return resp
    },
    async addSafetyWhiteUser(ids) {
      const resp = await this.dispatch(SafetyWhitelistController.createWaterMarkSafetyWhite, ids)
      if (!resp.error) {
        this.$msg.success('添加成功!')
        this.$emit('success')
        this.search()
        this.selected = []
        this.UpdateStorewmlist()
      }
    },
    async UpdateStorewmlist() {
      const query = {
        pageIndex: 0,
        pageSize: 999
      }
      let whiteListEmps = []
      const resp = await this.dispatch(EmployeeController.queryEmployeesInSafetyWhitelist, query)
      if (!resp.error) {
        whiteListEmps = resp.data.data
        const emplists = whiteListEmps.map(i => i.employee.id)
        localStore.set('watermarkmwhiteListEmps', emplists)
        dealWaterMark()
      }
    }
  }
}
</script>
<style lang="scss" ></style>
