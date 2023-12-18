<template>
  <div>
    <el-dialog width="800px" :visible.sync="visible" :title="title" append-to-body @close="cancelAdd">
      <div class="top-block">
        <el-row>
          <el-col :span="16">
            <PmToolbar>
              <PmToolbarItem plain @click="openAdd" icon="el-icon-plus">添加角色</PmToolbarItem>
              <PmToolbarItem plain :disabled="selections.length == 0" @click="deleteClick">批量删除</PmToolbarItem>
            </PmToolbar>
          </el-col>
          <!-- <el-col :span="8" class="text-right">
                <PmSearch style="width: 300px;" ref="searchForm" class="float-right" :query.sync="query" defaultProp="name" @search="pmSearch" placeholder="搜索角色名称">
                    <template slot="body">
                    <el-form-item label="角色名称" prop="name">
                        <el-input v-focus v-model="query.name" @keypress.native.enter="searchEnter" clearable/>
                    </el-form-item>
                    <el-form-item label="角色编号" prop="code">
                        <el-input v-model="query.code" @keypress.native.enter="searchEnter" clearable/>
                    </el-form-item>
                    </template>
                </PmSearch>
                </el-col> -->
        </el-row>
      </div>
      <el-table
        :highlight-current-row="true"
        :data="gridList"
        height="450px"
        @sort-change="sortChange"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="角色编号" prop="code" show-overflow-tooltip />
        <el-table-column label="角色名称" prop="name" show-overflow-tooltip />
        <el-table-column label="操作" width="150px">
          <template slot-scope="{ row }">
            <PmToolbar>
              <PmToolbarItem type="text" @click="remove(row)">删除</PmToolbarItem>
            </PmToolbar>
          </template>
        </el-table-column>
      </el-table>
      <el-row :gutter="0" class="pagination">
        <el-col :span="24" class="text-right">
          <Pagination
            layout="total, prev, pager, next, sizes"
            :page-size="query.limit"
            :current-page.sync="query.offset"
            :total="gridTotal"
            @size-change="changePageSizer"
            @current-change="changePage"
          />
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button type="text" @click="cancelAdd">取消</el-button>
      </div>
    </el-dialog>
    <select-types
      :dialog-visible.sync="dialogVisible"
      :business-obj-id="row.businessObjId"
      :is-multiple="true"
      :party-types="partyTypes"
      @sure="handleSuccess"
    />
  </div>
</template>

<script>
import { AuthManagerController } from "@controller"
import { BaseVue, List, VueUtil } from "@lib"
export default {
  components: {},
  mixins: [BaseVue, List],
  props: {
    visible: {
      type: Boolean
    },
    title: {
      type: String,
      default: "查看详情"
    },
    row: {
      type: Object
    }
  },
  data() {
    return {
      typesObj: {},
      partyTypes: [{ code: "role", name: "角色" }]
    }
  },
  computed: {
    ...VueUtil(this)
      .select([AuthManagerController])
      .state(),
    loading() {
      return this.AuthManagerController.queryRolesByPartyWithBusObjInst.loading
    }
  },
  watch: {
    row: {
      immediate: true,
      handler(val) {
        if (val) {
          this.search()
        }
      }
    },
    dicttypeid: {
      immediate: true,
      handler() {}
    }
  },

  methods: {
    searchEnter() {
      if (this.$refs.searchForm) {
        // 高级搜索 enter
        this.$refs.searchForm.searchQuery = { ...this.query }
        this.$refs.searchForm.initOptions()
        this.$refs.searchForm.visible = false
      }
      this.pmSearch()
    },
    async searchBody(val) {
      const query = this.otherQuery(this.query)
      const paload = {
        businessObjId: this.row.businessObjId,
        businessObjInstId: this.row.businessObjInstId,
        partyId: this.row.partyId,
        partyType: this.row.partyType,
        ...query
      }
      const resp = await this.dispatch(AuthManagerController.queryRolesByPartyWithBusObjInst, paload)
      if (!resp.error) {
        this.gridData = resp.data
      }
    },
    async removeBody(row) {
      const payload = {
        partyRoles: [
          {
            partyId: this.row.partyId,
            partyType: this.row.partyType,
            role: {
              id: row.id
            },
            //   id:row.id,
            businessObjInstId: this.row.businessObjInstId,
            businessObjId: this.row.businessObjId
          }
        ]
      }
      const resp = await this.dispatch(AuthManagerController.delPartyAuth, payload)
      return resp
    },
    // 批量删除
    async deleteClick() {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const partyRoles = this.selections.map((sel) => {
            const item = {
              partyId: this.row.partyId,
              partyType: this.row.partyType,
              role: {
                id: sel.id
              },
              //   id:sel.id,
              businessObjInstId: this.row.businessObjInstId,
              businessObjId: this.row.businessObjId
            }
            return item
          })
          const payload = { partyRoles: partyRoles }
          const resp = await this.dispatch(AuthManagerController.delPartyAuth, payload)
          if (!resp.error) {
            this.pmSearch()
            this.$msg.success("删除成功")
          }
        })
        .catch(() => {})
    },
    cancelAdd() {
      this.$emit("cancel")
    },
    async handleSuccess(roles) {
      const partyRole =
        roles &&
        roles.map((role) => {
          const data = {
            partyId: this.row.partyId,
            partyType: this.row.partyType,
            role: {
              id: role.id
            },
            roleType: role.types,
            businessObjInstId: this.row.businessObjInstId,
            businessObjId: this.row.businessObjId
          }
          return data
        })
      const payload = { partyRole: partyRole }
      const resp = await this.dispatch(AuthManagerController.handlePartyAuth, payload)
      if (!resp.error) {
        this.$msg.success("添加成功")
        this.pmSearch()
        this.dialogVisible = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.block {
  height: 400px;
  border: 1px solid #ddd;
}
</style>
