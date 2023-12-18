<template>
  <div>
    <div class="top-block mb-10">
      <el-row type="flex" justify="end">
        <PmSearch
          class="float-right"
          style="width: 300px"
          :query.sync="query"
          default-prop="code"
          placeholder="搜索账号"
          @search="pmSearch"
        >
          <template slot="body">
            <el-form-item label="账号" prop="code">
              <el-input v-model="query.code" clearable />
            </el-form-item>
          </template>
        </PmSearch>
      </el-row>
    </div>
    <pm-table
      height="calc(100vh - 460px)"
      :columns="columns"
      border
      :table-data="gridList"
      auto-select-row
      @selection-change="selectChange"
    >
      <div
        v-if="!enableOpt"
        slot="status"
        slot-scope="scope"
        class="inline-action"
      >
        <span>{{ scope.row.status === "1" ? "启用" : "禁用" }}</span>
      </div>
      <div slot="code" slot-scope="scope" class="inline-action">
        <el-link @click="openEdit(scope.row)">{{ scope.row.code }}</el-link>
      </div>
      <div slot="action" slot-scope="scope" class="inline-action">
        <PmToolbar>
          <PmToolbarItem
            size="mini"
            @click="remove(scope.row)"
          >删除</PmToolbarItem>
          <PmToolbarItem size="mini" @click="handleStatus(scope.row)">{{
            scope.row.status === "1" ? "禁用" : "启用"
          }}</PmToolbarItem>
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
    <PmFormDialog :dialog-visible.sync="dialogVisible" />
  </div>
</template>

<script>
import { BaseVue, List } from '@lib'
import { UserController } from '@controller'
export default {
  name: '',
  components: {},
  mixins: [BaseVue, List],
  props: {
    userData: {},
  },
  data() {
    return {
      columns: [
        { label: '编码', prop: 'code', scope: 'code' },
        { label: '名称', prop: 'name' },
        { label: '状态', prop: 'status', scope: 'status' },
        { label: '操作', scope: 'action', width: 120 },
      ],
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    async handleStatus(row) {
      // let resp;
      // if (row.status === "1") {
      //   resp = await this.dispatch(OrgController.disableOrg, {
      //     orgId: row.id,
      //   });
      // } else {
      //   resp = await this.dispatch(OrgController.enableOrg, {
      //     orgId: row.id,
      //   });
      // }
      // if (!resp.error) {
      //   this.message.success("操作成功！");
      //   this.search();
      // }
    },
    handleSuccess(form) {
      this.search()
      this.dialogVisible = false
      this.emit('success', form)
    },
    // 列表 选择改变
    selectChange(selection) {
      this.selectRow = selection
    },
    async searchBody() {
      const payload = { parentId: id, dimensionId, ...this.query }
      // const resp = await this.dispatch(
      //   OrgController.queryChildOrgsWithPage,
      //   payload
      // );
      // return resp;
    },
    async removeBody(row) {
      // const resp = await this.dispatch(OrgController.deleteByIds, [row.id]);
      // return resp;
    },
  },
}
</script>
<style></style>
