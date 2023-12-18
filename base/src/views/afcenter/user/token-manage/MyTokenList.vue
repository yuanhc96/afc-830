<template>
  <div class="pl-10 pr-10">
    <div class="top-block">
      <el-row>
        <el-col :span="16">
          <PmToolbar>
            <PmToolbarItem
              v-permission="FuncCode.afc_f_access_token_admin"
              plain
              icon="el-icon-plus"
              @click="openAdd"
              >新建 token</PmToolbarItem
            >
            <PmToolbarItem
              v-permission="FuncCode.afc_f_access_token_admin"
              plain
              :disabled="selections.length === 0"
              @click="bulkDelete"
              >批量删除</PmToolbarItem
            >
          </PmToolbar>
        </el-col>
        <!-- <el-col :span="8" class="text-right">
          <PmSearch
            class="float-right"
            style="width: 300px"
            :query.sync="query"
            default-prop="token"
            placeholder="搜索token"
            @search="pmSearch"
          >
            <template slot="body">
              <el-form-item label="token" prop="token">
                <el-input v-model="query.token" clearable />
              </el-form-item>
              <el-form-item label="开始时间" prop="createTime">
                <el-input v-model="query.createTime" v-focus clearable />
              </el-form-item>
              <el-form-item label="过期时间" prop="expireTime">
                <el-input v-model="query.expiredTime" v-focus clearable />
              </el-form-item>
            </template>
          </PmSearch>
        </el-col> -->
      </el-row>
    </div>
    <el-table
      height="calc(100vh - 383px)"
      :data="gridList"
      @sort-change="sortChange"
      @selection-change="selectionChange"
      border
      stripe
      v-loading="AfcApiTokenController.queryUserTokens.loading"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="token" prop="token">
        <template slot-scope="{ row }">
          <el-link @click="openEdit(row)">{{ row.token }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" prop="createTime" width="200" />
      <el-table-column label="过期时间" prop="expireTime" width="200" />
      <el-table-column label="备注" prop="remark" width="200" />
      <el-table-column label="操作" width="150px">
        <template slot-scope="{ row }">
          <PmToolbar>
            <PmToolbarItem
              v-permission="FuncCode.afc_f_access_token_admin"
              type="text"
              @click="remove(row)"
              >删除</PmToolbarItem
            >
            <!-- <PmToolbarGroup> -->
              <PmToolbarItem
                v-clipboard:copy="row.token"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                type="text"
                >复制秘钥</PmToolbarItem
              >
            <!-- </PmToolbarGroup> -->
          </PmToolbar>
        </template>
      </el-table-column>
    </el-table>
    <!-- <Pagination
      :selections="selections"
      :page-size="query.limit"
      :current-page.sync="query.offset"
      :total="gridTotal"
      @size-change="changePageSizer"
      @current-change="changePage"
    /> -->
    <pm-form-dialog
      :title="`${selectRow ? '编辑' : '新建'} token`"
      :dialog-visible.sync="dialogVisible"
      :loading="btnLoading"
      width="460px"
      ok-text="确定"
    >
      <MyTokenForm
        slot="form"
        v-if="dialogVisible"
        :params="params"
        :menu="selectRow"
        :form-data="selectRow"
        :loading.sync="btnLoading"
        @success="search"
      />
    </pm-form-dialog>
  </div>
</template>

<script>
import VueClipboard from "vue-clipboard2";
import { AfcApiTokenController } from "@controller";
import { BaseVue, List, VueUtil } from "@lib";
import MyTokenForm from "./MyTokenForm.vue";
Vue.use(VueClipboard);

export default {
  components: { MyTokenForm },
  mixins: [BaseVue, List],
  props: {
    menu: {},
  },
  data() {
    return {
      btnLoading: false,
      query: {
        offset: 1,
        limit: 9999,
        token: null,
        // createTime: null,
        // expiredTime: null
      },
    };
  },
  computed: {
    ...VueUtil(this).select([AfcApiTokenController]).state(),
  },
  watch: {
    "AfcApiTokenController.create": "search",
    "AfcApiTokenController.update": "search",
    "AfcApiTokenController.delete": "search",
    "AfcApiTokenController.deleteBatch": "search",
  },
  mounted() {
    this.search();
  },
  methods: {
    async removeBody(row) {
      const payload = {
        id: row.id,
      };
      const resp = await this.dispatch(AfcApiTokenController.delete, payload);
      return resp;
    },
    async searchBody() {
      const q = this.otherQuery(this.query);
      const currUser = JSON.parse(localStorage.getItem("user") || null);
      const payload = {
        ...q,
        userId: currUser ? currUser.userId : null,
      };
      const resp = await this.dispatch(
        AfcApiTokenController.queryUserTokens,
        payload
      );
      return resp;
    },
    async bulkDelete() {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const tokens = this.selections.map(({id,token}) => ({
            id,
            token,
          }));
          const payload = {
            tokens,
          };
          const resp = await this.dispatch(
            AfcApiTokenController.deleteBatch,
            payload
          );
          if (!resp || resp.error) return
          await this.pmSearch();
          this.$msg.success("删除成功");
        })
        .catch(() => {});
    },
    onCopy(e) {
      this.$msg.success("复制成功！");
    },
    onError(e) {
      this.$msg.error("复制失败！");
    },
  },
};
</script>
