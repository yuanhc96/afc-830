<template>
  <div>
    <div class="top-block">
      <el-row>
        <el-col :span="16">
          <PmToolbar>
            <PmToolbarItem
              v-permission="FuncCode.afc_f_access_token_person"
              plain
              :disabled="selections.length === 0"
              @click="bulkDelete"
            >批量删除</PmToolbarItem>
          </PmToolbar>
        </el-col>
        <el-col :span="8" class="float-right">
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
              <el-form-item label="用户账号" prop="userCode">
                <el-input v-model="query.userCode" v-focus clearable />
              </el-form-item>
              <el-form-item label="用户名称" prop="name">
                <el-input v-model="query.name" v-focus clearable />
              </el-form-item>
            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-loading="AfcApiTokenController.queryTokens.loading"
     :id="tableId" 
      :height="autoTableHeight"
      border
      stripe
      :data="gridList"
      @sort-change="sortChange"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="token" prop="token" width="280" />
      <el-table-column label="用户账号" prop="userCode">
        <template slot-scope="scope">
          <span>{{ scope.row.user.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名称" prop="name" />
      <el-table-column label="开始时间" prop="createTime" width="180"/>
      <el-table-column label="结束时间" prop="expireTime" width="180"/>
      <el-table-column label="备注" prop="remark" />
      <el-table-column label="操作" width="150px">
        <template slot-scope="{ row }">
          <PmToolbar>
            <!-- <PmToolbarItem type="text" @click="remove(row)">删除</PmToolbarItem> -->
            <PmToolbarItem v-permission="FuncCode.afc_f_access_token_person" type="text" @click="remove(row)">删除</PmToolbarItem>
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
  </div>
</template>

<script>
import { AfcApiTokenController } from '@controller'
import { BaseVue, List, VueUtil } from '@lib'

export default {
  components: {},
  mixins: [BaseVue, List],
  props: {
    menu: {}
  },
  data() {
    return {
      btnLoading: false,
      query: {
        offset: 1,
        limit: 10,
        token: null,
        userCode: null,
        name: null
      },
    }
  },
  computed: {
    ...VueUtil(this)
      .select([AfcApiTokenController])
      .state(),
  },
  watch: {
    'AfcApiTokenController.create': 'search',
    'AfcApiTokenController.update': 'search',
    'AfcApiTokenController.delete': 'search',
    'AfcApiTokenController.deleteBatch': 'search'
  },
  mounted() {
    this.search()
  },
  methods: {
    async removeBody(row) {
      const payload = {
        id: row.id
      }
      const resp = await this.dispatch(AfcApiTokenController.delete, payload)
      return resp
    },
    async searchBody() {
      const q = this.otherQuery(this.query)
      const payload = {
        ...q,
      }
      const resp = await this.dispatch(AfcApiTokenController.queryTokens, payload)
      return resp
    },
    async bulkDelete() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async() => {
        const tokens = this.selections.map(sel => ({
          id: sel.id,
          token: sel.token
        }))
        const payload = {
          tokens
        }
        const resp = await this.dispatch(AfcApiTokenController.deleteBatch, payload)
        if (!resp.error) {
          await this.pmSearch()
          this.$msg.success('删除成功')
        }
      }).catch(() => {})
    },
  }
}
</script>
