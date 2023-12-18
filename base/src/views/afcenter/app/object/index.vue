<template>
  <div class="pb-20 mr-20" :class="{ 'ml-20' : isOneApp }">
    <div class="top-block">
      <el-row>
        <el-col :span="16">
          <PmToolbar class="ml-5 ">
            <PmToolbarItem v-permission="FuncCode.afc_f_businessObject_add" plain icon="el-icon-plus" @click="openObject('add',null)">新建业务对象</PmToolbarItem>
            <PmToolbarItem v-permission="FuncCode.afc_f_businessObject_del" plain :disabled="selections.length==0" @click="bulkDelete">批量删除</PmToolbarItem>
          </PmToolbar>
        </el-col>
        <el-col :span="8" class="text-right">
          <PmSearch
            class="float-right"
            style="width: 300px"
            :query.sync="query"
            default-prop="name"
            placeholder="搜索业务对象名称"
            @search="pmSearch"
          >
            <template slot="body">
              <el-form-item label="业务对象名称" prop="name">
                <el-input v-model="query.name" clearable />
              </el-form-item>
              <el-form-item label="业务对象编号" prop="code">
                <el-input v-model="query.code" v-focus clearable />
              </el-form-item>

            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <!-- <div :id="tableId" :style="`height:calc(100vh - ${topBarHeight})`"> -->
    <el-table
      :id="tableId"
      v-loading="loading"
      :height="autoTableHeight"
      :data="gridList"
      border
      stripe
      @sort-change="sortChange"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column sortable="code" label="业务对象编号" prop="code">
        <template slot-scope="{ row }">
          <el-link @click="gotoDetail(row,'detail')">{{ row.code }}</el-link>
        </template>
      </el-table-column>
      <el-table-column sortable="name" label="业务对象名称" prop="name" />
      <el-table-column label="业务资源" prop="number">
        <template slot-scope="{ row }">
          <el-link @click="gotoDetail(row,'resourse')">{{ row.resourceCount }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="{ row }">
          <PmToolbar>
            <PmToolbarItem type="text" @click="remove(row)">删除</PmToolbarItem>
          </PmToolbar>
        </template>
      </el-table-column>
    </el-table>

    <!-- </div> -->
    <Pagination
      :selections="selections"
      :page-size="query.limit"
      :current-page.sync="query.offset"
      :total="gridTotal"
      @size-change="changePageSizer"
      @current-change="changePage"
    />

    <pm-form-dialog
      width="480px"
      :title="`${TEXT[formType]}`"
      :dialog-visible.sync="dialogVisible"
      :loading="btnLoading"
      ok-text="确定"
      body-class="pt-10 pl-20 pr-20 pb-10"
    >
      <From
        v-if="formType === 'add'"
        slot="form"
        :params="data"
        :loading.sync="btnLoading"
        @success="search"
      />
    </pm-form-dialog>
  </div>
</template>
<script>
import { BusinessObjectController } from '@controller'
import { BaseVue, List, VueUtil } from '@lib'
import From from './from.vue'
import oneApp from '../oneApp.js'
export default {
  name: 'object',
  components: { From },
  mixins: [BaseVue, List, oneApp],
  props: {
    data: {},
    selectTab: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      query: {},
      TEXT: {
        add: '新建业务对象',
        edit: '编辑业务对象',
      },
      dialogVisible: false,
      formType: null,
      btnLoading: false
    }
  },
  watch: {
    selectTab(res) {
      this.search()
    }

  },
  async mounted() {
    if (!this.data) {
      this.isOneApp = true
      this.data = await this.findApp()
    }
    this.search()
  },
  computed: {
    ...VueUtil(this)
      .select([BusinessObjectController])
      .state(),
    loading() {
      return this.BusinessObjectController.queryBusinessObjectsByCriteria.loading
    }
  },
  methods: {
    gotoDetail(row, val) {
      const data = { businessObjId: row.id, tab: val, data: row }
      // this.$emit("object_res",data)
      this.goto({
        title: `业务对象编辑（${row.name}）`,
        name: `object`,
        props: {
          data: data,
        }
      })
    },
    openObject(formType, value) {
      this.dialogVisible = true
      this.formType = formType
      if (formType === 'edit') {
        this.selectRow = value
      }
    },
    async searchBody() {
      const q = this.otherQuery(this.query)
      const payload = { appId: this.data.id, ...q }
      const resp = await this.dispatch(BusinessObjectController.queryBusinessObjectsByCriteria, payload)
      return resp
    },
    async removeBody(row) {
      const payload = [row.id]
      const resp = await this.dispatch(BusinessObjectController.deleteByIds, payload)
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
        const resp = await this.dispatch(BusinessObjectController.deleteByIds, payload)
        if (!resp.error) {
          this.pmSearch()
          this.$msg.success('删除成功')
        }
      })
        .catch(() => {

        })
    },
  }
}
</script>
