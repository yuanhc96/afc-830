<template>
  <div class="pl-20 pr-20 pb-20">
    <div class="top-block">
      <el-row>
        <el-col :span="16">
          <PmToolbar class="ml-5">
            <PmToolbarItem
              v-permission="FuncCode.afc_f_app_template_del"
              icon="el-icon-plus"
              plain
              @click="openAdd"
            >新建模板</PmToolbarItem>
            <PmToolbarItem
              v-permission="FuncCode.afc_f_app_template_del"
              plain
              :disabled="selections.length == 0"
              @click="bulkDelete"
            >批量删除</PmToolbarItem>
          </PmToolbar>
        </el-col>
        <el-col :span="8" class="text-right">
          <PmSearch
            class="float-right"
            style="width: 300px"
            :query.sync="query"
            default-prop="name"
            placeholder="搜索应用模板名称"
            @search="pmSearch"
          >
            <template slot="body">
              <el-form-item label="模板编号" prop="code">
                <el-input v-model="query.code" v-focus clearable />
              </el-form-item>
              <el-form-item label="模板名称" prop="name">
                <el-input v-model="query.name" clearable />
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-select v-model="query.status" style="width: 100%" :popper-append-to-body="false" placeholder="请选择">
                  <el-option
                    v-for="item in statusOption"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  />
                </el-select>
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
      <el-table-column sortable="code" label="编号" prop="code">
        <template slot-scope="{ row }">
          <el-link v-if="allow(FuncCode.afc_f_app_template_rename)" @click="openEdit(row)">{{ row.code }}</el-link>
          <span v-else>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" />
      <el-table-column label="类型" prop="type" />
      <el-table-column label="状态" prop="status">
        <template slot-scope="{ row }">
          <span>{{ statusOptions[row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="createUser" />
      <el-table-column sortable="createTime" label="创建时间" prop="createTime" width="180" />
      <el-table-column label="描述" prop="description" min-width="120" show-overflow-tooltip />
      <el-table-column label="操作" width="160">
        <template slot-scope="{ row }">
          <PmToolbar>
            <PmToolbarItem
              v-permission="FuncCode.afc_f_app_template_del"
              type="text"
              :loading="LowcodeAppTemplateController.delete.loading"
              @click="deleteRow(row)"
            >删除</PmToolbarItem>
            <PmToolbarItem v-if="row.status === '0' && allow(FuncCode.afc_f_app_template_startup)" type="text" @click="abled(row)">启用</PmToolbarItem>
            <PmToolbarItem v-else-if="row.status === '1' && allow(FuncCode.afc_f_app_template_disabled)" type="text" @click="disabled(row)">禁用</PmToolbarItem>
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
      :title="dialogTitle"
      :dialog-visible.sync="dialogVisible"
      :loading="btnLoading"
      ok-text="确定"
      body-class="pt-10 pl-20 pr-20 pb-10"
    >
      <Form
        v-if="dialogVisible"
        slot="form"
        :loading.sync="btnLoading"
        :form-data.sync="selectRow"
        @success="success"
      />
    </PmFormDialog>

  </div>
</template>
<script>
import { DictTypeController, LowcodeAppTemplateController } from '@controller'
import { BaseVue, List, VueUtil } from '@lib'
import { isArray } from 'lodash'
import { mapGetters } from 'vuex'
import Form from './form.vue'
export default {
  name: 'app-list',
  components: { Form },
  mixins: [BaseVue, List],
  data() {
    return {
      openobject: false,
      btnLoading: false,
      removeMessage: '此操作将永久删除该数据, 是否继续?',
      dicttypeid: 'sys_open_types',
      dictType: {},
      statusOptions: {
        '1': '启用',
        '0': '禁用'
      },
      statusOption: [
        { code: '1', name: '启用' },
        { code: '0', name: '禁用' }
      ]
    }
  },
  mounted() {
    this.search()
    this.loadData()
  },
  computed: {
    ...VueUtil(this)
      .select([LowcodeAppTemplateController, DictTypeController])
      .state(),
    ...mapGetters(['dicts']),
    loading() {
      return this.LowcodeAppTemplateController.queryWithPage.loading
    },
    dialogTitle() {
      return this.selectRow && this.selectRow.id ? '编辑应用模板' : '新建应用模板'
    }
  },
  watch: {
    dicts: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          const objectType = this.dicts[this.dicttypeid] || []
          if (objectType.length > 0) {
            const dictType = {}
            objectType.forEach((item) => {
              dictType[item.code] = item.name
            })
            this.dictType = dictType
          }
        }
      },
    },
  },
  methods: {
    async searchBody() {
      const payload = this.otherQuery(this.query)
      const resp = await this.dispatch(
        LowcodeAppTemplateController.queryWithPage,
        payload
      )
      // console.log(resp.data, '====resp.data')
      return resp
    },
    async bulkDelete(ids) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async() => {
          let payload = { ids }
          if (!isArray(ids)) {
            payload = {
              ids: this.selections.map(i => i.id)
            }
          }
          const resp = await this.dispatch(LowcodeAppTemplateController.delete, payload)
          console.log(resp)
          if (!resp.error) {
            this.pmSearch()
            this.$msg.success('删除成功')
          }
        })
        .catch(() => {})
    },
    async deleteRow(row) {
      this.bulkDelete([row.id])
    },
    async disabled(row) {
      const resp = await this.dispatch(LowcodeAppTemplateController.disabled, {
        id: row.id
      })
      if (!resp.error) {
        this.pmSearch()
        this.$msg.success('禁用成功')
      }
    },
    async abled(row) {
      const resp = await this.dispatch(LowcodeAppTemplateController.startup, {
        id: row.id
      })
      if (!resp.error) {
        this.pmSearch()
        this.$msg.success('启用成功')
      }
    },
    async loadData() {
      if (!this.dicttypeid) {
        return
      }
      if (!this.dicts.hasOwnProperty(this.dicttypeid)) {
        this.$store.commit('ADD_DICT', { key: this.dicttypeid, value: null })
        const resp = await this.dispatch(
          DictTypeController.queryDictTypesByCriteria,
          {
            code: this.dicttypeid,
            tenantId: this.currentTenant,
          }
        )
        if (!resp.error) {
          this.$store.commit('ADD_DICT', {
            key: this.dicttypeid,
            value: resp.data.data.length ? resp.data.data[0].dictEntrys : [],
          })
        }
      }
    },
    success() {
      this.dialogVisible = false
      this.search()
    }
  },
}
</script>
