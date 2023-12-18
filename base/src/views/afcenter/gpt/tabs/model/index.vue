<template>
  <div>
    <div class="top-block">
    </div>
    <el-table
      :id="tableId"
      v-loading="loading"
      height="calc(100vh - 182px)"
      border
      stripe
      :data="gridList"
      @sort-change="sortChange"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
        v-for="item in columns"
        :key="item.value"
        :label="item.label"
        :prop="item.value"
        :width="['code','name'].includes(item.value) ? '250' : undefined"
      >
        <template slot-scope="{ row }">
          <el-link v-if="item.value === 'code'" @click="handleEdit(row)">{{ row.code }}</el-link>
          <span v-else>{{ row[item.value] }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="160">
                <template slot-scope="{ row }">
                    <PmToolbar>
                        <PmToolbarItem type="text" @click="handleEdit(row)"
                            >编辑</PmToolbarItem
                        >
                        <PmToolbarItem type="text" @click="deleteRow(row)"
                            >删除</PmToolbarItem
                        >
                         <PmToolbarItem type="text" @click="createContent(row)"
                            >生成内容</PmToolbarItem
                        >
                    </PmToolbar>
                </template>
            </el-table-column> -->
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
      width="640px"
       top="30px"
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
import { RdcloudConversationGptModelController } from '@controller'
import { BaseVue, List, VueUtil } from '@lib'
import { isArray } from 'lodash'
import { COLUMNS } from './constant'
import Form from './form.vue'
export default {
  name: 'app-list',
  components: { Form },
  mixins: [BaseVue, List],
  data() {
    return {
      btnLoading: false,
      removeMessage: '此操作将永久删除该数据, 是否继续?',
      columns: COLUMNS,
    }
  },
  mounted() {
    this.search()
  },
  computed: {
    ...VueUtil(this).select([RdcloudConversationGptModelController]).state(),
    loading() {
      return this.RdcloudConversationGptModelController.queryRdcloudConversationGptModels.loading
    },
    dialogTitle() {
      return this.selectRow && this.selectRow.id
        ? '编辑'
        : '新建'
    },
  },
  methods: {
    async searchBody() {
      try {
        const payload = this.otherQuery(this.query)
        const resp = await this.dispatch(
          RdcloudConversationGptModelController.queryRdcloudConversationGptModels,
          payload
        )
        return resp
      } catch (err) {
        console.log('err:', err)
      }
    },
    async bulkDelete(ids) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async() => {
          let payload = ids
          if (!isArray(ids)) {
            payload = this.selections.map((i) => i.id)
          }
          const resp = await this.dispatch(
            RdcloudConversationGptModelController.deleteByIds,
            payload
          )
          if (!resp.error) {
            this.pmSearch()
            this.$msg.success('删除成功')
          }
        })
        .catch(() => {})
    },
    handleEdit(row) {
      this.selectRow = row
      this.openAdd()
    },
    async createContent(row) {
      // const res = await this.dispatch(
      //     RdcloudConversationGptModelController.generateContent,
      //     {
      //         id: row.id,
      //         params: {
      //             selectSystem: '学生管理',
      //             module: '课程',
      //         }
      //     }
      // )
    },
    async deleteRow(row) {
      this.bulkDelete([row.id])
    },
    success() {
      this.dialogVisible = false
      this.search()
    },
  },
}
</script>
