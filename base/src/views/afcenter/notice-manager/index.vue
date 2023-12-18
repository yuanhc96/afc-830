<template>
  <div class="pl-20 pr-20 pb-20">
    <pm-dialog :title="form.id ? '编辑通知' : '新建通知'" :visible.sync="dialogVisible" :close-on-click-modal="false" width="480px">
      <el-form :model="form">
        <el-form-item label="标题">
          <el-input v-model="form.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="通知内容">
          <el-input v-model="form.content" type="textarea" autosize autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </div>
    </pm-dialog>
    <div class="top-block">
      <el-row>
        <el-col :span="16">
          <PmToolbar class="ml-5">
            <PmToolbarItem
              icon="el-icon-plus"
              plain
              @click="addNotice"
            >新建通知</PmToolbarItem>
            <PmToolbarItem
              plain
              @click="delNotice"
            >批量删除</PmToolbarItem>
          </PmToolbar>
        </el-col>
        <el-col :span="8" class="text-right">
        </el-col>
      </el-row>
    </div>
    <el-table
      height="calc(100vh - 172px)"
      border
      stripe
      :data="gridList"
      @sort-change="sortChange"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="标题" prop="title">
        <template slot-scope="{ row }">
          <el-link @click="openEdit(row)">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="内容" prop="content" />
      <el-table-column label="创建人" prop="createUser" />
      <el-table-column sortable="createTime" label="创建时间" prop="createTime" width="180" />
      <el-table-column label="操作" width="160">
        <template slot-scope="{ row }">
          <PmToolbar>
            <PmToolbarItem
              type="text"
              @click="delNotice(row)"
            >删除</PmToolbarItem>
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
import { WorkNoticeController } from '../../../actions/controller'
import { BaseVue,List} from '@lib'
export default {
  name: 'index',
  mixins: [BaseVue,List],
  data() {
    return {
      noticeList: [],
      dialogVisible: false,
      selections: [],
      form: {
        title: '',
        content: ''
      }
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    addNotice() {
      this.dialogVisible = true
    },
    selectionChange(selections) {
      this.selections = selections
    },
    async delNotice(row) {
      try {
        await this.dispatch(
          WorkNoticeController.delete,
          { ids: row.id ? [row.id] : this.selections.map(i => i.id) }
        )
        await this.search()
        this.$message.success('删除成功')
      } catch (e) {
        this.$message.error('删除失败')
      }
    },
    async openEdit(row) {
      console.log(row)
      console.log(this.currentTenant)
      this.form = {
        title: row.title,
        content: row.content,
        id: row.id
      }
      this.dialogVisible = true
    },
    async submitAdd() {
      this.dialogVisible = false
      if (this.form.id) {
        await this.dispatch(
          WorkNoticeController.update,
          { workNotice: { content: this.form.content, title: this.form.title, id: this.form.id, tenantId: this.currentTenant }}
        )
      } else {
        await this.dispatch(
          WorkNoticeController.create,
          { workNotice: { content: this.form.content, title: this.form.title, tenantId: this.currentTenant }}
        )
      }
      this.form = {
        title: '',
        content: ''
      }
      await this.search()
    },
    async searchBody() {
      const res = await this.dispatch(
        WorkNoticeController.queryWithPage,
        { pageIndex: 0, pageSize: 30 }
      )
      return res
    },
  }
}
</script>

<style scoped>

</style>
