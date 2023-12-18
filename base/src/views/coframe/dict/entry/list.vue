<template>
  <div class="pr-20 pb-20">
    <div class="top-block">
      <el-row>
        <el-col :span="16">
          <PmToolbar class="ml-5">
            <PmToolbarItem
              v-if="selectEntry || dictType"
              v-permission="FuncCode.afc_f_dictentry_add"
              plain
              icon="el-icon-plus"
              @click="openAddRoot"
            >
              新建字典项
            </PmToolbarItem>
            <PmToolbarItem
              v-if="isnextDict"
              v-permission="FuncCode.afc_f_dictentry_add"
              plain
              :disabled="selectRows.length !== 1"
              icon="el-icon-plus"
              @click="openAddChild"
            >
              新建子项
            </PmToolbarItem>
            <PmToolbarItem
              v-permission="FuncCode.afc_f_dictentry_del"
              plain
              :disabled="selectRows.length === 0"
              @click="batchDelete"
            >
              批量删除
            </PmToolbarItem>
            <PmToolbarItem
              plain
              :disabled="selectRows.length == 0"
              @click="openi18nEdit"
            >
              国际化配置
            </PmToolbarItem>
          </PmToolbar>
        </el-col>
        <el-col :span="8" class="text-right">
          <PmSearch
            class="float-right"
            style="width: 300px"
            :query.sync="query"
            default-prop="name"
            placeholder="搜索字典项名称"
            @search="pmSearch"
          >
            <template slot="body">
              <el-form-item label="字典项名称" prop="name">
                <el-input v-model="query.name" clearable />
              </el-form-item>
              <el-form-item label="字典项编号" prop="code">
                <el-input v-model="query.code" v-focus clearable />
              </el-form-item>
            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <el-table
      :id="tableId"
      ref="entryTable"
      v-loading="DictEntryController.queryDictEntrysByCriteria.loading"
      :height="autoTableHeight"
      border
      stripe
      :data="gridList"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column sortable="code" label="字典项编号" prop="code">
        <template slot-scope="{ row }">
          <el-link @click="gotodetail(row)">{{ row.code }}</el-link>
        </template>
      </el-table-column>
      <el-table-column sortable="name" label="字典名称" prop="name" />
      <el-table-column sortable="sortBy" label="排序" prop="sortBy" />
      <el-table-column label="子字典" prop="subDictEntryCount">
        <template slot-scope="{ row }">
          <el-link @click="gotoChild(row)">{{ row.subDictEntryCount }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <PmToolbar>
            <PmToolbarItem v-permission="FuncCode.afc_f_dictentry_del" type="text" @click="remove(scope.row)">
              删除
            </PmToolbarItem>
          </PmToolbar>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :selections="selectRows"
      :page-size="query.limit"
      :current-page.sync="query.offset"
      :total="gridTotal"
      @size-change="changePageSizer"
      @current-change="changePage"
    />
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="handleClose"
      title="新建字典项"
      append-to-body
      width="480px"
      top="60px"
    >
      <Form
        v-if="dialogVisible"
        ref="form"
        :dialog-visible.sync="dialogVisible"
        :form-data="selectRow"
        :parent-entry.sync="parentEntry"
        :dict-type="dictType"
        :up-entry="selectEntry"
        :loading.sync="btnLoading"
        @success="refresh"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submit(true)">确定并继续创建</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submit(false)">确 定</el-button>
      </div>
    </el-dialog>
    <i18nEdit v-if="i18nDialogVisible" :i18n-dialog-visible.sync="i18nDialogVisible" :select-menus="entrySelectRows" entity-name="DictEntry" @i18nSuccess="i18nSuccess" />

  </div>
</template>
<script>
import i18nEdit from '@/components/i18nEdit/editList.vue'
import { DictEntryController, DictTypeController } from '@controller'
import { BaseVue, List, VueUtil, _ } from '@lib'
import Form from './form.vue'

import TreeTable from '@/components/TreeTable/index.vue'

export default {
  components: { Form, TreeTable, i18nEdit },
  mixins: [BaseVue, List],
  props: {
    dictType: {},
    selectEntry: {},
    level: {
      type: Number,
      default: 1
    },
    isshowAddRoot: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isnextDict: true,
      ishasUpEntry: true,
      btnLoading: false,
      parentEntry: null,
      selectRows: [],
      i18nDialogVisible: false,
      entrySelectRows: []

    }
  },
  computed: {
    ...VueUtil(this)
      .select([DictEntryController, DictTypeController])
      .state(),
    isShow() {
      if (gridList) {
      }
      return `${this.formType === 'add' ? '新建' : '编辑'}应用功能`
    }
  },
  watch: {
    dictType: {
      immediate: true,
      handler: 'search'
    },
    selectEntry(val) {
      this.search()
      this.selectType()
    },
    'DictEntryController.create': 'search',
    'DictEntryController.deleteByIds': 'search'
  },
  mounted() {
    this.selectType()
  },
  methods: {
    selectType() {
      if (this.dictType) {
        const pay = { parentId: this.dictType.id }
        this.dispatch(DictTypeController.queryDictTypesByParentId, pay).then((resp) => {
          if (resp.data.length > 0) {
            this.isnextDict = true
          } else {
            this.isnextDict = false
          }
        })
      } else {
        if (this.selectEntry) {
          const data = { parentId: this.selectEntry.dictTypeId }
          this.dispatch(DictTypeController.queryDictTypesByParentId, data).then((res) => {
            let parentType = null
            if (res.data.length > 0) {
              parentType = res.data[0]
              console.log(parentType.id, 'parentType')
              const pay = { parentId: parentType.id }
              this.dispatch(DictTypeController.queryDictTypesByParentId, pay).then((resp) => {
                if (resp.data.length > 0) {
                  this.isnextDict = true
                } else {
                  this.isnextDict = false
                }
              })
            } else {
              this.isnextDict = false
            }
          })
        }
      }
    },
    selectOne(row) {
      this.$emit('selectOne', row)
    },
    openAddRoot() {
      this.parentEntry = null
      this.openAdd()
    },
    openAddChild() {
      this.parentEntry = this.selectRows[0]
      this.openAdd()
    },
    handleSelectionChange(row) {
      this.selectRows = row
    },
    batchDelete() {
      this.confirm(`此操作将永久删除[${this.selectRows.length}]条数据, 是否继续?`)
        .then(async() => {
          if (await this.deleteData(this.selectRows)) {
            this.pmSearch()
          }
        })
        .catch(() => {})
    },
    async deleteData(rows) {
      const temps = _.cloneDeep(rows)
      temps.forEach((t) => {
        delete t.parent
      })
      const ids = temps.map((i) => i.id)
      console.log(ids, 'ids')
      if (ids) {
        const resp = await this.dispatch(DictEntryController.deleteByIds, ids)
        if (!resp.error) {
          this.$msg.success('删除成功')
          return true
        } else return false
      }
    },
    async removeBody(row) {
      delete row.parent
      if (row.id) {
        const payload = [row.id]
        const resp = await this.dispatch(DictEntryController.deleteByIds, payload)
        return resp
      }
    },
    async searchBody() {
      const order = this.sortBy.orderFields ? {} : { orderFields: 'sortBy', orderDirection: 'ASC' }
      // if(this.dictType){
      const payload = {
        ...this.otherQuery(this.query),
        tenantId: this.currentTenant,
        dictTypeId: this.selectEntry ? null : this.dictType.id,
        parentId: this.selectEntry ? this.selectEntry.id : null,
        ...order
        //  levels:this.selectEntry? null:0
      }
      const resp = await this.dispatch(DictEntryController.queryDictEntrysByCriteria, payload)
      return resp
      // }
    },
    refresh(row) {
      this.search()
      //        if (row.parentid) {
      //          this.recurExpend(this.gridList, row.parentid)
      //        } else {
      //          this.search()
      //        }
    },
    recurExpend(list, id) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].dictid === id) {
          this.expand(list[i])
          break
        } else if (list[i].children && list[i].children.length > 0) {
          this.recurExpend(list[i].children, id)
        }
      }
    },

    handleClose() {
      this.dialogVisible = false
      // this.$emit("update:dialogVisible", false);
    },
    gotodetail(row) {
      row.selectTab = 'detail'
      const name = 'EntryDetail' + this.level
      const level = Number(this.level + 1)
      let isshowEntrylist = true
      const pay = { parentId: row.dictTypeId }
      this.dispatch(DictTypeController.queryDictTypesByParentId, pay).then((resp) => {
        if (resp.data.length > 0) {
          isshowEntrylist = true
        } else {
          isshowEntrylist = false
        }
        this.goto({
          title: '字典信息' + `（${row.name}）`,
          name: `${name}`,
          props: {
            data: row,
            level: level,
            isshowEntrylist: isshowEntrylist
          }
        })
      })
    },
    gotoChild(row) {
      // 判断是否有子类型 有：跳转到子字典 没:跳转到详情
      let isshowEntrylist = true
      let title = null
      console.log(row, 'row---')
      const pay = { parentId: row.dictTypeId }
      this.dispatch(DictTypeController.queryDictTypesByParentId, pay).then((resp) => {
        console.log(resp.data, 'resp.data')
        if (resp.data.length > 0) {
          // 有子项
          row.selectTab = 'entrylist'
          const name = 'EntryDetail' + this.level
          const level = Number(this.level + 1)
          title = `（${row.name}）` + '子字典'
          this.gotoWhere(row, name, level, isshowEntrylist, title)
        } else {
          // 没子项去详情
          title = '字典信息' + `（${row.name}）`
          row.selectTab = 'detail'
          const name = 'EntryDetail' + this.level
          const level = Number(this.level + 1)
          isshowEntrylist = false
          this.gotoWhere(row, name, level, isshowEntrylist, title)
        }
      })
    },
    gotoWhere(row, name, level, isshowEntrylist, title) {
      this.goto({
        title: title,
        name: `${name}`,
        props: {
          data: row,
          selectEntry: row,
          level: level,
          isshowEntrylist: isshowEntrylist
        }
      })
    },
    submit(isContinue) {
      this.$refs.form.save(isContinue)
    },
    openi18nEdit() {
      this.entrySelectRows = this.selectRows.map(item => {
        return {
          ...item,
          code: `${item.code}~${this.dictType.code}`
        }
      })
      this.i18nDialogVisible = true
    },
    i18nSuccess() {
      this.selectRows = []
      this.$refs.entryTable.clearSelection()// 删除后清空之前选择的数据
    }
  }
}
</script>
