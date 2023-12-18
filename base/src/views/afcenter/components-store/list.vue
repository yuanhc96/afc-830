<template>
  <div class="pl-10 pr-20 pb-20">
    <div class="top-block">
      <el-row>
        <el-col class="fr text-right">
          <PmSearch
            class="float-right"
            style="width: 300px"
            :query.sync="query"
            default-prop="name"
            placeholder="搜索组件名称"
            @search="getTableData"
          >
            <template slot="body">
              <el-form-item label="组件名称" prop="name">
                <el-input v-model="query.name" clearable />
              </el-form-item>
            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-loading="loading"
      height="calc(100vh - 120px)"
      border
      stripe
      :data="tableData"
      @sort-change="sortChange"
      @selection-change="selectionChange"
    >
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column label="编码" prop="code" show-overflow-tooltip />
      <el-table-column label="名称" prop="name" show-overflow-tooltip />
      <el-table-column label="图标" prop="icon">
        <template slot-scope="{ row }">
          <img :src="`${apiPrefix}api/afc/components/${groupCode}/assets/images/${row.icon}.svg`" style="height: 16px;width: 16px;margin-top: 5px;">
        </template>
      </el-table-column>
      <!-- <el-table-column label="版本" prop="version"></el-table-column> -->
      <el-table-column label="操作" width="160">
        <template slot-scope="{ row }">
          <PmToolbar>
            <PmToolbarItem
              type="text"
              @click="checkDoc(row)"
            >查看文档</PmToolbarItem>
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

  </div>
</template>
<script>
import { List } from '@lib'
export default {
  name: 'app-list',
  mixins: [List],
  props: {
    groupContent: {
      type: Array,
      default: () => []
    },
    groupCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      btnLoading: false,
      tableData: [],
    }
  },
  computed: {
    apiPrefix() {
      if (Vue.config.isExpress) {
        return `/`
      } else {
        return '/afc/'
      }
    }
  },
  watch: {
    groupContent: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val && val.length) {
          this.tableData = val
        } else {
          this.tableData = []
        }
      }
    },
  },
  mounted() {

  },
  methods: {
    getTableData() {
      if (this.query.name) {
        this.tableData = this.groupContent?.filter(item => item.name.indexOf(this.query.name) !== -1)
      } else {
        this.tableData = this.groupContent || []
      }
    },

    async checkDoc(row) {
      const routedata = this.$router.resolve({
        path: '/components_store/preview',
        query: {
          groupCode: this.groupCode,
          code: row.code,
        }
      })
      window.open(routedata.href, '_blank')
    }

  },
}
</script>
