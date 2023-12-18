<template>
  <el-dialog :visible.sync="funlistDialogVisible" width="800px" title="功能码列表" top="60px" :before-close="handleClose" append-to-body>
    <div style="height:calc(100vh - 280px);overflow-y:auto">
      <div class="top-block">
        <el-row>
          <el-col :span="8">
            <el-checkbox v-model="checked" class="mt-10" :disabled="selected">仅显示可选</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-checkbox v-model="selected" class="mt-10" :disabled="checked">查看已选</el-checkbox>
          </el-col>
          <el-col :span="8" class="text-right">
            <PmSearch
              :query.sync="query"
              default-prop="name"
              style="width: 300px;"
              class="float-right"
              placeholder="搜索功能码名称"
              @search="search"
            >
              <template slot="body">
                <el-form-item label="功能码名称" prop="name">
                  <el-input v-model="query.name" clearable />
                </el-form-item>
                <el-form-item label="功能码编号" prop="code">
                  <el-input v-model="query.code" v-focus clearable />
                </el-form-item>
              </template>
            </PmSearch>
          </el-col>
        </el-row>
      </div>
      <div style="height:calc(100vh - 350px)">
        <el-table
          ref="funTable"
          v-loading="loading"
          height="calc(100vh - 350px)"
          border
          stripe
          :data="funlist"
          @sort-change="sortChange"
          @selection-change="selectionChange"
        >
          <el-table-column type="selection" width="55" reserve-selection :selectable="checkSelectable" />
          <el-table-column label="功能码编号" prop="funcCode" />
          <el-table-column label="功能码名称" prop="funcName" />
          <el-table-column label="是否已存在" prop="exist">
            <template slot-scope="scope">
              <span>{{ scope.row.exist===true?'是':'否' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <span slot="footer">
      <el-button type="primary" @click="toBack">上一步</el-button>
      <el-button type="primary" :loading="butLoading" :disabled="multipleSelection.length==0" @click="submitUpload">提交</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { FunctionCodeToolsController } from '@controller'
import { BaseVue } from '@lib'
export default {
  name: 'fundata-list',
  mixins: [BaseVue],
  props: {
    funlistDialogVisible: {
      type: Boolean,
      default: false,
    },
    funlist: {
      type: Object,
      default: null,
    },
    appid: {
      type: String,
      default: null,
    },
    businessObjId: {
      type: String,
      default: null,
    },
    groupid: {
      type: String,
      default: null,
    },
    allClose: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      allFunlist: [],
      multipleSelection: [],
      selectedList: [],
      butLoading: false,
      checked: false,
      selected: false,
      query: {
        code: '',
        name: ''
      }
    }
  },
  watch: {
    checked: {
      handler(val) {
        this.search()
      }
    },
    selected: {
      handler(val) {
        this.search()
      }
    }

  },
  created() {
    this.allFunlist = [...this.funlist]
  },
  methods: {
    selectionChange(val) {
      this.multipleSelection = val
    },
    checkSelectable(row) {
      return row.exist === false
    },
    handleClose() {
      this.allClose = true
      this.$emit('update:allClose', this.allClose)
      this.funlistDialogVisible = false
      this.$emit('update:funlistDialogVisible', this.funlistDialogVisible)
    },
    toBack() {
      this.funlistDialogVisible = false
      this.$emit('update:funlistDialogVisible', this.funlistDialogVisible)
    },
    async submitUpload() {
      this.butLoading = true
      const payload = {
        appId: this.appid,
        functionResWappers: this.multipleSelection
      }
      payload.params = this.businessObjId ? { businessObjId: this.businessObjId, resGroupId: this.groupid } : { resGroupId: this.groupid }
      const resp = await this.dispatch(FunctionCodeToolsController.importFunCodesFromFIleOrUrl, payload)
      if (!resp.error) {
        this.$msg.success('导入成功!')
        // 把选择导入的数据，变为不可选
        this.funlist.forEach(item => {
          this.multipleSelection.forEach(element => {
            if (item.funcCode == element.funcCode) {
              item.exist = true
            }
          })
        })
        this.multipleSelection = []
        // 把选择清空
        this.$refs.funTable.clearSelection()
        this.butLoading = false
        this.handleClose()
      } else {
        this.butLoading = false
      }
    },
    search() {
      if (this.selected) {
        this.funlist = this.multipleSelection
        this.funlist = this.searchDetail(this.funlist, this.funlist)
      } else {
        this.funlist = this.checked ? this.allFunlist.filter((item) => item.exist === false) : this.allFunlist
        this.funlist = this.searchDetail(this.funlist, this.funlist)
      }
    },
    searchDetail(data, filterRangeList) {
      if (this.query.code) {
        data = filterRangeList.filter((item) => item.funcCode.search(this.query.code) != -1)
      }
      if (this.query.name) {
        data = filterRangeList.filter((item) => item.funcName.search(this.query.name) != -1)
      }
      return data
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
