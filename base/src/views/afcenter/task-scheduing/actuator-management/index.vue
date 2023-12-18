<template>
  <div class="pl-20 pr-20 pb-20">
    <div class="top-block">
      <el-row>
        <el-col :span="16">
          <PmToolbar>
            <PmToolbarItem plain icon="el-icon-plus" @click="openAdd">新建执行器</PmToolbarItem>
          </PmToolbar>
        </el-col>
        <el-col :span="8" class="text-right">
          <PmSearch
            class="float-right"
            style="width: 300px"
            :query.sync="query"
            defaultProp="appname"
            placeholder="搜索执行器编码"
            @search="pmSearch"
          >
            <template slot="body">
              <el-form-item label="执行器编码" prop="appname">
                <el-input v-model="query.appname" clearable />
              </el-form-item>
              <el-form-item label="执行器名称" prop="title">
                <el-input v-model="query.title" clearable />
              </el-form-item>
            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table v-loading="loading" :data="gridList"
        border stripe
        :id="tableId"
        :height="autoTableHeight"
      >
        <el-table-column label="执行器编码" prop="appname" />
        <el-table-column label="执行器名称" prop="title" />
        <el-table-column label="注册方式" prop="addressType">
          <template slot-scope="{row}">
            {{ row.addressType === 1 ? '手动录入' : '自动录入'}}
          </template>
        </el-table-column>
        <el-table-column label="在线机器地址" prop="registryList">
          <template slot-scope="{row}">
            <PmToolbar v-if="row.registryList">
              <PmToolbarItem type="text" @click="checkUrl(row.registryList)"> 查看 </PmToolbarItem>
            </PmToolbar>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="{row}">
            <PmToolbar>
              <PmToolbarItem type="text" @click="openEdit(row)"> 编辑 </PmToolbarItem>
              <PmToolbarItem type="text" @click="remove(row)"> 删除 </PmToolbarItem>
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
    <ActuatorAdd :dialog-visible.sync="dialogVisible" :form-data.sync="selectRow" @success="search" />
    <CheckUrl :dialog-visible.sync="checkVisible" :currentRegistryList="currentRegistryList" />
  </div>
</template>
<script>
import { JobGroupController } from '@controller'
import { BaseVue, List, VueUtil } from '@lib'
import ActuatorAdd from './add.vue'
import CheckUrl from './checkUrl.vue'

export default {
  components: { ActuatorAdd, CheckUrl },
  mixins: [BaseVue, List],
  props: {},

  data() {
    return {
      dialogVisible: false,
      checkVisible: false,
      member: [],
      query: {
        limit: 10,
        offset: 1,
        appname: null,
        title: null
      },
      currentRegistryList: []
    }
  },
  computed: {
    ...VueUtil(this)
      .select([JobGroupController])
      .state(),
    loading() {
      return this.JobGroupController.pageList.loading
    },
  },
  mounted() {
    this.search()
  },

  methods: {
    async searchBody() {
      let resp = await this.dispatch(JobGroupController.pageList, {
        appname: this.query.appname,
        title: this.query.title,
        start: (this.query.offset - 1) * this.query.limit,
        length: this.query.limit
      })
      const { data, recordsTotal } = resp.data
      return {
        data: {
          data: data,
          total: recordsTotal
        }
      }
    },
    checkUrl(list) {
      this.currentRegistryList = list
      this.checkVisible = true
    },
    async removeBody(row) {
      const resp = await this.dispatch(JobGroupController.remove, {
        id: row.id
      })
      const { code, msg } = resp.data
      if (code === 200) {
        this.$msg.success('删除成功！')
        this.search()
      } else {
        this.$msg.error(msg)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
