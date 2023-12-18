<template>
  <div class="pl-20 pr-20 pb-20">
    <div class="top-block pt-10 pb-10">
      <el-row>
        <el-col :span="16">
          <PmToolbar class="ml-5">
            <PmToolbarItem
              v-permission="FuncCode.afc_f_app_add"
              plain
              icon="el-icon-plus"
              @click="openAdd"
            >注册应用</PmToolbarItem>
            <PmToolbarItem
              plain
              :disabled="selections.length == 0"
              @click="bulkDelete"
            >批量删除</PmToolbarItem>
          </PmToolbar>
          <!-- <PmToolbar>
                    <PmToolbarItem plain  type="primary" icon="el-icon-plus" @click="openAdd">新建应用</PmToolbarItem>
                     <PmToolbarItem icon="el-icon-edit">其他按钮</PmToolbarItem>
                    <PmToolbarItem  icon="el-icon-upload" @click="info('delete')">批量操作</PmToolbarItem>
                    <PmToolbarGroup>
                        <PmToolbarItem icon="el-icon-upload">导入</PmToolbarItem>
                        <PmToolbarItem icon="el-icon-download">导出</PmToolbarItem>
                    </PmToolbarGroup> -->
          <!-- </PmToolbar>  -->
        </el-col>
        <el-col :span="8" class="text-right">
          <PmSearch
            class="float-right"
            style="width: 300px"
            :query.sync="query"
            default-prop="name"
            placeholder="搜索应用名称"
            @search="pmSearch"
          >
            <template slot="body">
              <el-form-item label="应用编号" prop="code">
                <el-input v-model="query.code" v-focus clearable />
              </el-form-item>
              <el-form-item label="应用名称" prop="name">
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
      <el-table-column sortable="code" label="编号" prop="code">
        <template slot-scope="{ row }">
          <el-link @click="gotoDetail('app', row)">{{ row.code }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        sortable="name"
        label="名称"
        prop="name"
      />
      <!-- <el-table-column label="应用类型" prop="openType">
        <template slot-scope="{ row }">
          {{ dictType[row.openType] }}
        </template>
      </el-table-column> -->
      <el-table-column label="低开项目" prop="openType">
        <template slot-scope="{ row }">
          {{ row.isLowcode === "1" ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column label="应用资源" prop="resourceCount">
        <template slot-scope="{ row }">
          <el-link @click="gotoDetail('res', row)">{{
            row.resourceCount
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="业务对象" prop="businessObjectCount">
        <template slot-scope="{ row }">
          <el-link @click="gotoDetail('obj', row)">{{
            row.businessObjectCount
          }}</el-link>
        </template>
      </el-table-column>

      <!-- <el-table-column label="创建人" prop="createUser"></el-table-column>
            <el-table-column sortable="createTime" label="创建时间" prop="createTime"></el-table-column> -->

      <!-- <el-table-column label="操作" width="240px">
                <template slot-scope="{row}">
                    <PmToolbar>
                        <PmToolbarItem icon="el-icon-delete">删除</PmToolbarItem>
                        <PmToolbarItem icon="el-icon-setting">其他操作</PmToolbarItem>
                        <PmToolbarGroup>
                            <PmToolbarItem icon="el-icon-upload">其他按钮</PmToolbarItem>
                            <PmToolbarItem icon="el-icon-download">其他按钮</PmToolbarItem>
                        </PmToolbarGroup>
                    </PmToolbar>
                </template>
            </el-table-column> -->
      <!-- <el-table-column label="复制秘钥" >
            <template slot-scope="{row}">
               <a style="color:#5555FF" v-clipboard:copy="row.secret" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</a>
            </template>
            </el-table-column> -->
      <el-table-column label="操作" width="150px">
        <template slot-scope="{ row }">
          <PmToolbar>
            <PmToolbarItem
              type="text"
              :loading="AppController.deleteByIds.loading"
              @click="remove(row, row.isLowcode ? removeMessage : null)"
            >删除</PmToolbarItem>
            <!-- <PmToolbarItem
              type="text"
              :loading="AppController.deleteByIds.loading"
              @click="goToAppMenu(row)"
            >应用管理</PmToolbarItem> -->
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
      top="30px"
      width="800px"
      title="注册应用"
      :dialog-visible.sync="dialogVisible"
      :loading="btnLoading"
      ok-text="确定"
      body-class="pt-10 pl-10 pr-10 pb-10"
    >
      <Form
        v-if="dialogVisible"
        slot="form"
        :loading.sync="btnLoading"
        :is-dialog="true"
        @success="search"
      />
    </PmFormDialog>

    <PmFormDialog
      v-if="openresouse"
      width="1000px"
      :title="`资源管理`"
      ok-text="确定"
    >
      <Resouse slot="form" :data="selectRow" />
    </PmFormDialog>

    <PmFormDialog
      v-if="openobject"
      width="1000px"
      :title="`业务对象管理`"
      ok-text="确定"
    >
      <ObjectPage slot="form" :data="selectRow" />
    </PmFormDialog>
  </div>
</template>
<script>
import { localStore } from '@/utils/sessionStore'
import { AppController, DictTypeController } from '@controller'
import { BaseVue, List, VueUtil } from '@lib'
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
import { mapGetters, mapMutations } from 'vuex'
import Form from './form.vue'
import ObjectPage from './object/index.vue'
import Resouse from './resource/index.vue'
Vue.use(VueClipboard)
export default {
  name: 'app-list',
  components: { Form, Resouse, ObjectPage },
  mixins: [BaseVue, List],
  data() {
    return {
      openresouse: false,
      openobject: false,
      btnLoading: false,
      removeMessage: '此操作将删除低开项目, 是否继续?',
      dicttypeid: 'sys_open_types',
      dictType: {},
    }
  },
  mounted() {
    this.search()
    this.loadData()
  },
  computed: {
    ...VueUtil(this)
      .select([AppController, DictTypeController])
      .state(),
    ...mapGetters(['dicts']),
    loading() {
      return this.AppController.queryAppsByCriteria.loading
    },
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
    ...mapMutations({
      setAppInfo: 'SET_APPINFO'
    }),
    gotoDetail(name, app) {
      const data = { tab: name, ...app }
      let title = null
      if (name === 'app') {
        title = '应用编辑'
      } else if (name === 'obj') {
        title = '业务对象'
      } else if (name === 'res') {
        title = '应用资源'
      }
      this.goto({
        title: title + `（${app.name}）`,
        name: `detail`,
        props: {
          data: data,
        },
      })
    },

    openResouse(res, row) {
      this.selectRow = row
      if (res === 'openresouse') {
        this.openresouse = true
      }
      if (res === 'openobject') {
        this.openobject = true
      }
    },
    async searchBody() {
      const q = this.otherQuery(this.query)
      const order = this.sortBy.orderFields
        ? {}
        : { orderFields: 'createTime', orderDirection: 'DESC' }
      const payload = { ...q, tenantId: this.currentTenant, ...order }
      const resp = await this.dispatch(
        AppController.queryAppsByCriteria,
        payload
      )
      return resp
    },
    async bulkDelete() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async() => {
          const payload = this.selections.map((sel) => {
            return sel.id
          })
          const resp = await this.dispatch(AppController.deleteByIds, payload)
          if (!resp.error) {
            this.pmSearch()
            this.$msg.success('删除成功')
          }
        })
        .catch(() => {})
    },
    async removeBody(row) {
      const payload = [row.id]
      return await this.dispatch(AppController.deleteByIds, payload)
    },
    onCopy(e) {
      // 复制成功
      this.$msg.success('复制成功！')
    },
    onError(e) {
      // 复制失败
      this.$msg.error('复制失败！')
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
    goToAppMenu(row) {
      localStore.set('isappMenu', true)
      this.setAppInfo(row)
      console.log(localStore.get('appInfo'), localStore.get('isappMenu'))
      window.location.href = '/'
    }

  },
}
</script>
