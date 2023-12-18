<template>
  <div class="pl-10 pb-20 pr-20">
    <div class="top-block">
      <el-row>
        <el-col :span="16">
          <PmToolbar class="ml-5 ">
            <PmToolbarItem plain icon="el-icon-plus" @click="openAdd">新建变量</PmToolbarItem>
            <PmToolbarItem plain :disabled="selections.length==0" @click="bulkDelete">批量删除</PmToolbarItem>

          </PmToolbar>
        </el-col>
        <el-col :span="8" class="text-right">
          <PmSearch
            class="float-right"
            style="width: 300px;"
            :query.sync="query"
            default-prop="name"
            placeholder="搜索变量名称"
            @search="pmSearch"
          >
            <template slot="body">
              <!-- <el-form-item label="变量编号" prop="code">
                        <el-input v-focus v-model="query.code" clearable />
                    </el-form-item> -->
              <el-form-item label="变量名称" prop="name">
                <el-input v-model="query.name" clearable />
              </el-form-item>
            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <el-table
      :id="tableId"
      v-loading="loading"
      :height="autoTableHeight"
      border
      stripe
      :data="gridList"
      @sort-change="sortChange"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="55" />
      <!-- <el-table-column  sortable="code" label="变量编号" prop="code">
               <template slot-scope="scope">
                 <el-link @click="openEdit(scope.row)">{{ scope.row.code }}</el-link>
                </template>
             </el-table-column>  -->
      <!-- <el-table-column  sortable="name" label="变量名称" prop="name"></el-table-column>  -->
      <el-table-column sortable="name" label="名称" prop="name">
        <template slot-scope="scope">
          <el-link @click="openEdit(scope.row)">{{ scope.row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="内容" prop="value" :show-overflow-tooltip="true" />
      <el-table-column label="是否加密" prop="isEncrypt">
        <template slot-scope="{row}">
          {{ row.isEncrypt=='1'? '是':'否' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="{row}">
          <PmToolbar>
            <PmToolbarItem type="text" :loading="btnLoading" @click="remove(row)">删除</PmToolbarItem>
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
    <PmFormDialog
      width="480px"
      :title="selectRow?'编辑':'新建' + '系统变量'"
      :dialog-visible.sync="dialogVisible"
      :loading="btnLoading"
      ok-text="确定"
      body-class="pt-10 pl-20 pr-20 pb-10"
    >
      <Form v-if="dialogVisible" slot="form" :data="selectRow" :groupid="groupid" :loading.sync="btnLoading" @success="search" />
    </PmFormDialog>
  </div>
</template>
<script>
import { SysVariableController } from '@controller'
import { BaseVue, List, VueUtil } from '@lib'
import Form from './form.vue'
export default {
  components: { Form },
  mixins: [BaseVue, List],
  props: {
    groupid: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      openresouse: false,
      openobject: false,
      btnLoading: false,
      query: {
        name: '',
      },
    }
  },
  watch: {
    groupid(val) {
      // this.query.name = null
      this.query.offset = 1
      this.search()
    },
  },
  mounted() {
    console.log(this.$route, 'this.$route,')
    this.search()
  },
  computed: {
    ...VueUtil(this)
      .select([SysVariableController])
      .state(),
    loading() {
      return this.SysVariableController.querySystemVariablesByCriteria.loading
    },
    appId() {
      return this.$route.query ? this.$route.query.appId : null
    }
  },
  methods: {
    async searchBody() {
      const q = this.otherQuery(this.query)
      const payload = { ...q, tenantId: this.currentTenant, resGroupId: this.groupid, appId: this.appId || null, types: this.appId ? 'application' : 'platform' }
      const resp = await this.dispatch(SysVariableController.querySystemVariablesByCriteria, payload)
      return resp
    },
    async bulkDelete() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async() => {
        const payload = this.selections.map(sel => {
          return sel.id
        })
        const resp = await this.dispatch(SysVariableController.deleteByIds, payload)
        if (!resp.error) {
          this.pmSearch()
          this.$msg.success('删除成功')
        }
      })
        .catch(() => {

        })
    },
    async removeBody(row) {
      const payload = [row.id]
      const resp = await this.dispatch(SysVariableController.deleteByIds, payload)
      return resp
    },
  },

}
</script>
