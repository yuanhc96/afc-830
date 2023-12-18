<template>
  <div class="pl-20 pr-20 pb-20">
    <div class="top-block">
      <el-row>
        <el-col :span="8" :offset="16" class="text-right">
          <PmSearch
            class="float-right"
            style="width: 300px"
            :query.sync="query"
            default-prop="name"
            placeholder="搜索项目名称"
            @search="pmSearch"
          >
            <template slot="body">
              <el-form-item label="应用名称" prop="code">
                <el-input v-model="query.code" v-focus clearable />
              </el-form-item>
              <el-form-item label="应用显示名称" prop="name">
                <el-input v-model="query.name" clearable />
              </el-form-item>
            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table v-loading="loading" :data="gridList" height="calc(100vh - 294px)">
        <el-table-column label="应用标识" prop="code" min-width="87px">
          <template slot-scope="{row}">
            <el-link @click="gotoIDE(row)">{{ row.code }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="项目名称" prop="name" min-width="90px" />
        <!-- <el-table-column label="状态" prop="useTime" min-width="87px">
          <template slot-scope="{row}">
            {{ row.useTime ? row.useTime + ' min' : row.useTime }}
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="300px">
          <template slot-scope="{row}">
            <PmToolbar>
              <PmToolbarItem type="text" @click="gotoIDE(row)">开发</PmToolbarItem>
              <PmToolbarItem type="text" @click="gotoTest(row)">测试</PmToolbarItem>
              <PmToolbarItem type="text"> 配置 </PmToolbarItem>
              <PmToolbarItem type="text">导入</PmToolbarItem>
              <PmToolbarItem type="text">导出</PmToolbarItem>
              <!-- <PmToolbarGroup>
                  <PmToolbarItem icon="el-icon-check" @click="gotoTest(row)">测试</PmToolbarItem>
                  <PmToolbarItem icon="el-icon-upload">导入</PmToolbarItem>
                  <PmToolbarItem icon="el-icon-download">导出</PmToolbarItem>
              </PmToolbarGroup>  -->
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
import { AppController } from '@controller'
import { BaseVue, List, VueUtil } from '@lib'
export default {
  components: { },
  mixins: [BaseVue, List],
  props: {},

  data() {
    return {
      query: {
        limit: 10,
        offset: 1,
        name: null,
        code: null
      },
    }
  },
  computed: {
    ...VueUtil(this)
      .select([ AppController])
      .state(),
    loading() {
      return this.AppController.queryAppsByCriteria.loading
    },
  },
  watch: {},

  created() {
  },

  async mounted() {
    await this.search()
  },

  methods: {
    async searchBody() {
      const order = this.sortBy.orderFields ? {} : { orderFields: 'createTime', orderDirection: 'DESC' }
      return await this.dispatch(AppController.queryAppsByCriteria, {
        ...this.otherQuery(this.query),
        ...order,
        tenantId: this.currentTenant,
        isLowcode: '1'
      })
    },
    async gotoIDE(row) {
      const routeUrl = this.$router.resolve({
        path: '/ide/index.html',
        query: { appName: row.code }
      })
      window.open(routeUrl.href.slice(1), '_blank')
    },
    gotoTest(row) {
      const routeUrl = this.$router.resolve({
        path: '/ide/index.html',
        query: { appName: row.code, type: 'test' }
      })
      window.open(routeUrl.href.slice(1), '_blank')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
