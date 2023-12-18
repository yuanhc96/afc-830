<template>
  <div class="pr-20 pb-20" >
    <div class="top-block upload-button">
          <PmSearch
            class="float-right pm-search"
            style="width: 300px"
            :query.sync="query"
            default-prop="name"
            placeholder="搜索附件名称"
            @search="pmSearch"
          >
            <template slot="body">
              <!-- <el-form-item label="附件编号" prop="code">
                <el-input v-model="query.code" v-focus clearable />
              </el-form-item> -->
              <el-form-item label="附件名称" prop="name">
                <el-input v-model="query.name" clearable />
              </el-form-item>
            </template>
          </PmSearch>
          <PmToolbar class="ml-5 float-right">
            <el-upload
              ref="hdfs"
              name="attachment"
              class="fl mr-5"
              :limit="1"
              :http-request="uploadMethod"
              :before-upload="beforeAvatarUpload"
              :file-list="fileList"
            >
              <PmToolbarItem
                icon="el-icon-upload"
                plain
              >上传文件
            </PmToolbarItem>
            </el-upload>  
            <PmToolbarItem
             class="fl"
              plain
              :disabled="selections.length == 0"
              @click="bulkDelete"
            >批量删除</PmToolbarItem>
          </PmToolbar>
    </div>
    <el-table
      class="mt-10"
      :id="tableId"
      v-loading="loading"
      height="calc(100vh - 214px)"
      stripe border
      :data="gridList"
      @sort-change="sortChange"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="附件名称" prop="name" show-overflow-tooltip />
      <!-- <el-table-column label="类型" prop="type" /> -->
      <el-table-column label="创建人" prop="createUser"></el-table-column>
      <el-table-column sortable="createTime" label="创建时间" prop="createTime" width="180"></el-table-column>
      <!-- <el-table-column label="描述" prop="description" min-width="120" show-overflow-tooltip></el-table-column> -->
      <el-table-column label="操作" width="160">
        <template slot-scope="{ row }">
          <PmToolbar>
            <PmToolbarItem
              type="text"
            ><a
              class="table_download"
              :href="fileUrl(row.fileId) + headersParam"
            >
              下载
            </a></PmToolbarItem>
            <PmToolbarItem
              title="复制下载链接"
              v-clipboard:copy="copyLabel"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              type="text"
              @click="format(row)"
              >复制</PmToolbarItem
            >
            <PmToolbarItem
              type="text"
              @click="deleteItem([row.id], 'notIcon')"
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
import { SourceMaterialController } from '@controller';
import { BaseVue, List, VueUtil } from '@lib';
import { mapGetters } from 'vuex';
import model from "./model.js";
// import Form from './form.vue'
export default {
  name: 'app-list',
  // components: { Form },
  mixins: [BaseVue, List, model],
  props: {
    groupId: {
      type: String
    },
  },
  data() {
    return {
      fileData: [],
      typeId: 'attachment',
      openobject: false,
      btnLoading: false,
      copyLabel: ''
    }
  },
  // mounted() {
  //   if (this.groupId) {
  //     this.search()
  //   }
  // },
  computed: {
     ...VueUtil(this)
      .select([SourceMaterialController])
      .state(),
    ...mapGetters(['dicts']),
    loading() {
      return this.SourceMaterialController.querySourceMaterialWithPage.loading
    },
    dialogTitle() {
      return this.selectRow && this.selectRow.id ? '编辑附件' : '新建附件'
    }
  },
  watch: {
    groupId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.search()
        }
      }
    },
  },
  methods: {
    async searchBody() {
      const resp = await this.dispatch(
        SourceMaterialController.querySourceMaterialWithPage,
        {
          ...this.otherQuery(this.query),
          materialGroupId: this.groupId,
          types: this.typeId
        }
      )
      return resp
    },
    async bulkDelete() {
      const ids = this.selections.map(i => i.id)
      await this.deleteItem(ids, 'notIcon')
    },
    beforeAvatarUpload(file) {
      const limitName = file.name.length <= 30
      if (!limitName) {
        this.warningMessage('附件名称长度不能超过30!')
      }
      return limitName
    },
    format(row) {
      const link = this.fileUrl(row.fileId) + this.headersParam
      this.copyLabel = `<a href="${link}" ><i class="el-icon-download" title="下载" /></a>`
    }
  },
}
</script>
<style lang="scss" scoped>
.top-block {
  padding-top:0px;
}
</style>

