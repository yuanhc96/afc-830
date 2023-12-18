<template>
  <div>
    <div class="top-block" style="padding-top: 0">
      <el-row>
        <el-col :span="12">
          <PmToolbar class="ml-5">
            <PmToolbarItem
              v-permission="FuncCode.afc_f_dimension_add"
              icon="el-icon-plus"
              plain
              :disabled="enableOpt"
              @click="openAdd"
            >新建维度</PmToolbarItem>
          </PmToolbar>
        </el-col>
        <el-col :span="12" class="text-right">
          <PmSearch
            class="float-right"
            style="width: 300px"
            :query.sync="query"
            default-prop="name"
            placeholder="搜索维度名称"
            @search="pmSearch"
          >
            <template slot="body">
              <el-form-item label="维度编号" prop="code">
                <el-input v-model="query.code" clearable />
              </el-form-item>
              <el-form-item label="维度名称" prop="name">
                <el-input v-model="query.name" clearable />
              </el-form-item>
            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <pm-table
      :height="`calc(100vh - 420px)`"
      border
      :columns="columns"
      :table-data="gridList"
      auto-select-row
      @selection-change="selectChange"
    >
      <div slot="code" slot-scope="scope" class="inline-action">
        <el-link v-if="allow(FuncCode.afc_f_dimension_edit)" @click="openEdit(scope.row)">{{ scope.row.code }}</el-link>
        <span v-else>{{ scope.row.code }}</span>
      </div>
      <div slot="action" slot-scope="scope" class="inline-action">
        <PmToolbar>
          <PmToolbarItem v-permission="FuncCode.afc_f_dimension_del" :disabled="scope.row.code==='def_dimension'" type="text" @click="remove(scope.row)">
            删除
          </PmToolbarItem>
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
    <PmFormDialog :dialog-visible.sync="dialogVisible" width="460px" ok-text="确定" :title="`${selectRow ? '编辑':'新建'}组织维度`">
      <Form slot="form" :form-data="selectRow" @success="successHandler" />
    </PmFormDialog>
  </div>
</template>

<script>
import { DimensionController } from '@controller'
import { BaseVue, List } from '@lib'
import Form from './form.vue'
export default {
  name: '',
  components: { Form },
  mixins: [BaseVue, List],
  props: {
    orgData: {},
    dimensionData: {},
    visible: {
      handler: function(value) {
        if (value) {
          this.search()
        }
      }
    },
  },
  data() {
    return {
      columns: [
        { label: '组织维度编号', prop: 'code', scope: 'code' },
        { label: '组织维度名称', prop: 'name' },
        // { label: '创建人', prop: 'createUserName' },
        // { label: '创建时间', prop: 'createTime' },
        { label: '描述', prop: 'createTime' },
        { label: '操作', scope: 'action', width: 150 },
      ],
    }
  },
  computed: {},
  watch: {},
  created() {
    this.search()
  },
  mounted() {},
  methods: {
    successHandler() {
      this.search()
      this.$emit('success')
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
      const payload = { ...this.query }
      const resp = await this.dispatch(
        DimensionController.queryDimensionsWithPage,
        payload
      )
      return resp
    },
    async removeBody({ id }) {
      const resp = await this.dispatch(DimensionController.deleteByIds, [id])
      if (!resp.error) {
        this.$emit('success', id)
      }
      return resp
    },
  },
}
</script>
<style></style>
