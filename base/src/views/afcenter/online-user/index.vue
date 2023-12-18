<template>
  <div class="pl-20 pr-20 pb-20">
    <div class="top-block">
      <el-row>
        <el-col :span="8" :offset="16" class="text-right">
            <PmSearch
              class="float-right"
              style="width: 300px"
              :query.sync="query"
              defaultProp="onlineName"
              placeholder="搜索用户名称"
              @search="pmSearch"
            >
              <template slot="body">
                  <el-form-item label="用户编号" prop="onlineCode">
                  <el-input v-model="query.onlineCode" clearable />
                </el-form-item>
                <el-form-item label="用户名称" prop="onlineName">
                  <el-input v-model="query.onlineName" clearable />
                </el-form-item>
              </template>
            </PmSearch>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table v-loading="loading" :data="gridList"
         :id="tableId" 
        :height="autoTableHeight"
        border
        stripe
      >
        <el-table-column label="用户编号" prop="onlineCode" min-width="87px" />
        <el-table-column label="名称" prop="onlineName" min-width="90px" />
        <el-table-column label="登录时间" prop="loginDate" width="180px" />
        <el-table-column label="登录时长" prop="useTime" min-width="87px">
          <template slot-scope="{row}">
            {{ row.useTime ? row.useTime + ' min' : row.useTime }}
          </template>
        </el-table-column>
        <el-table-column label="登录ip" prop="loginIp" min-width="105px" />
        <el-table-column label="终端版本" prop="terminalVersion" show-overflow-tooltip min-width="300px" />
        <el-table-column label="操作" width="150px">
          <template slot-scope="{row}">
            <PmToolbar>
              <PmToolbarItem type="text" v-permission="FuncCode.afc_f_online_user_logout" @click="offline(row)">
                强制下线
              </PmToolbarItem>
            </PmToolbar>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-right">
        <Pagination 
          :selections="selections"
          :page-size="query.limit"
          :current-page.sync="query.offset"
          :total="gridTotal"
          @size-change="changePageSizer"
          @current-change="changePage"
          />
      </div>
    </div>
  </div>
</template>
<script>
import { OnlineUserController } from '@controller'
import { BaseVue, List } from '@lib'
export default {
  components: { },
  mixins: [BaseVue, List],
  props: {},

  data() {
    return {
      query: {
        limit: 10,
        offset: 1,
        onlineCode: null,
        onlineName: null,
      },
    }
  },
  computed: {
    loading() {
    },
  },
  watch: {},

  created() {
  },

  async mounted() {
    await this.clearData()
  },

  methods: {
    async searchBody() {
      return await this.dispatch(OnlineUserController.queryOnlineUserWithPage,{
        pageIndex: this.query.offset - 1,
        pageSize: this.query.limit,
        onlineCode: this.query.onlineCode,
        onlineName: this.query.onlineName,
      })
    },
    async offline(row) {
      const resp =  await this.dispatch(OnlineUserController.logout, {
        uniqueId: row.uniqueId
      })
      if (!resp.error) {
        this.$msg.success('强制下线成功!')
        this.search()
      }
    },
    async clearData() {
      const res = await this.dispatch(OnlineUserController.clear, {})
      if (!res.error) {
        this.search()
      }
    }
  }
} 
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
