<template>
  <div class="pl-20 pr-20 pt-10">
    <el-row>
      <el-col :span="24">
        <div class="container">
          <el-col :span="8" class="box">
            <div class="title obj">被操作对象</div>
            <div class="pt-10 pr-20 pl-20">
              <el-form label-width="90px">
                <el-form-item label="对象类型：">
                  <el-select
                    v-model="type"
                    placeholder="请选择"
                    style="width: 100%"
                    @change="changeTypeSelect"
                  >
                    <el-option
                      v-for="item in objectType"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="对象：">
                  <search-remoteButton
                    style="width: 100%"
                    :value.sync="source.name"
                    :loading="loading"
                    :placeholder="'请输入' + dictType[this.type] + searchName + '搜索'"
                    :options="sourceOptions"
                    @remoteMethod="remoteMethod('source',$event)"
                    @handleChange="handleChange('source',$event)"
                    @openDetail="openDetail('source',$event)"
                  />
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :span="4" style="text-align:center;">
            <div class="backimg">
              <img
                src="@static/images/arrow.png"
              >
            </div>
          </el-col>
          <el-col :span="8" class="box">
            <div class="title obj">操作对象</div>
            <div class="pt-10 pr-20 pl-20">
              <el-form label-width="90px">
                <el-form-item label="对象类型：">
                  <div class="input">
                    <el-select
                      v-model="type"
                      placeholder="请选择"
                      style="width: 100%"
                      :disabled="true"
                    >
                      <el-option
                        v-for="item in objectType"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                      />
                    </el-select>
                  </div>
                </el-form-item>
                <el-form-item v-if="transferType == 1" label="对象：">
                  <!-- <div class="selectUserTree">
                    <el-select
                      style="width: 100%"
                      v-model="target.name"
                      filterable
                      clearable
                      remote
                      reserve-keyword
                      size="small"
                      collapse-tags
                      class="placeholder"
                      :remote-method="(query) => remoteMethod('target', query)"
                      :loading="loading"
                      :placeholder="'请输入' + dictType[this.type] + '名称搜索'"
                      @visible-change="visibleChange('target', $event)"
                      @change="handleChange('target', $event)"
                    >
                      <el-option
                        v-for="item in targetOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                    <el-button
                      class="treeBtn"
                      icon="el-icon-search"
                      @click="openDetail('target')"
                    ></el-button>
                  </div> -->

                  <search-remoteButton
                    style="width: 100%"
                    :value.sync="target.name"
                    :loading="loading"
                    :placeholder="'请输入' + dictType[this.type] + searchName + '搜索'"
                    :options="targetOptions"
                    @remoteMethod="remoteMethod('target',$event)"
                    @handleChange="handleChange('target',$event)"
                    @openDetail="openDetail('target',$event)"
                  />
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <div class="pt-10 pb-10">
        <el-row>
          <el-col :span="16" class="mt-10 table-tool-bar">
            <el-button
              :loading="loading"
              plain
              type="primary"
              style="margin-right: 1px;"
              @click="transferClick"
            >执行复制</el-button>
            <el-button
              :loading="loading"
              plain
              style="height: 32px;"
              @click="transferClick('transfer')"
            >执行转移</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="container">
        <el-table
          :id="tableId"
          :highlight-current-row="true"
          :height="autoTableHeight"
          border
          stripe
          :data="gridList"
          @selection-change="selectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="角色编号" prop="code" show-overflow-tooltip />
          <el-table-column label="角色名称" prop="name" show-overflow-tooltip />
          <el-table-column
            label="资源权限数量"
            prop="resAmount"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-link @click="openEdit(scope.row)">{{ scope.row.resAmount }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="所属参与者" prop="partyName">
            <template slot-scope="scope">
              <span>{{ handlePartyName(scope.row.partyName) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
    <el-row :gutter="0">
      <el-col :span="24" class="text-right">
        <Pagination
          :page-size="query.limit"
          :current-page.sync="query.offset"
          :total="gridTotal"
          @size-change="changePageSizer"
          @current-change="changePage"
        />
      </el-col>
    </el-row>
    <SelectTypes
      :flag="false"
      :active-name.sync="type"
      :dialog-visible.sync="visible"
      :is-multiple="false"
      :party-types="searchType == 'source' ? objectType : typeObject"
      :form.sync="form"
      @sure="sure"
    />
    <Detail
      v-if="dialogVisible"
      :row.sync="selectRow"
      :dialog-visible.sync="dialogVisible"
      title="查看详情"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import {
  AuthManagerController, DictTypeController, OrgController,
  PositionController, SelectionComponentController, WorkGroupController
} from '@controller'
import { BaseVue, List } from '@lib'
import { mapGetters } from 'vuex'
import Detail from '../authlist/form.vue'
export default {
  components: { Detail },
  mixins: [BaseVue, List],
  data() {
    return {
      objectType: [],
      dictType: {},
      dicttypeid: 'sys_party_types',
      editArr: [{ name: '复制', id: '1' }],
      transferType: '', // 转移类型
      type: '',
      typeObject: {},
      source: {},
      target: {},
      searchType: '',
      // tableHeight: "calc(100vh - 488px)",
      tableHeight: 'calc(100vh - 474px)',
      visible: false,
      loading: false,
      targetOptions: [],
      sourceOptions: [],
      searchName: ''
    }
  },
  computed: {
    ...mapGetters(['dicts']),
  },
  watch: {
    dicts: {
      immediate: true,
      handler(val) {
        if (val) {
          this.objectType = this.dicts[this.dicttypeid].filter(item => item.code !== 'role_app') || []
          if (this.objectType.length > 0) {
            const dictType = {}
            this.objectType.forEach((item) => {
              dictType[item.code] = item.name
            })
            this.dictType = dictType
            this.type = this.objectType[0].code
            this.searchName = this.type === 'user' ? '编号' : '名称'
          }
        }
      },
    },
    type: {
      immediate: true,
      handler(val) {
        if (val) {
          this.typeObject = this.objectType.filter((item) => {
            if (item.code == val) {
              return [item]
            }
          })
          this.searchName = val === 'user' ? '编号' : '名称'
        }
      },
    },
    editArr: {
      immediate: true,
      handler(val) {
        this.transferType = val[0].id
      },
    },
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async searchBody() {
      // 根据用户，查询权限
      const query = this.otherQuery(this.query)
      const paload = { partyType: this.type, partyId: this.source.id, ...query, roleType: 'platform' }
      const resp = await this.dispatch(
        AuthManagerController.queryRolesByPartyWithPage,
        paload
      )
      return resp
    },

    async remoteMethod(type, query) {
      if (query) {
        const paload = {
          pageIndex: 0,
          pageSize: -1,
          name: query,
        }
        let resp = {}
        if (this.type === 'user') {
          const queryPayload = {
            pageIndex: 0,
            pageSize: -1,
            code: query,
            flag: false
          }
          // TODO 不让查询管理员
          resp = await this.dispatch(
            SelectionComponentController.queryUser,
            queryPayload
          )
        } else if (this.type === 'org') {
          resp = await this.dispatch(OrgController.queryOrgsByCriteria, paload)
        } else if (this.type === 'position') {
          resp = await this.dispatch(
            PositionController.queryPositionsByCriteria,
            paload
          )
        } else if (this.type === 'emp') {
          paload.flag = false // TODO
          resp = await this.dispatch(
            SelectionComponentController.queryEmployee,
            paload
          )
        } else if (this.type === 'workGroup') {
          resp = await this.dispatch(
            WorkGroupController.queryWorkGroupsByCriteria,
            paload
          )
        }
        if (!resp.error) {
          if (type === 'source') {
            this.sourceOptions = resp.data.data || resp.data
            if (this.type === 'user' || this.type === 'emp' || this.type === 'position') {
              this.sourceOptions = this.sourceOptions.map(item => {
                item.name = item.name + (item.code ? ' ( ' + item.code + ' )' : '')
                return item
              })
            }
          } else {
            this.targetOptions = resp.data.data || resp.data
            if (this.type === 'user' || this.type === 'emp' || this.type === 'position') {
              this.targetOptions = this.targetOptions.map(item => {
                item.name = item.name + (item.code ? ' ( ' + item.code + ' )' : '')
                return item
              })
            }
          }
        }
      }
    },
    visibleChange(type, visible) {
      if (!visible) {
        if (type === 'source') {
          this.sourceOptions = []
        } else {
          this.targetOptions = []
        }
      }
    },
    handleChange(value, e) {
      if (value === 'source') {
        if (e) {
          this.source.id = e
          this.search()
        } else {
          this.source = {}
        }
      } else {
        if (e) {
          this.target.id = e
        } else {
          this.target = {}
        }
      }
    },

    openDetail(type) {
      this.searchType = type
      this.visible = true
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
    sure(tableDataSelect) {
      const obj = tableDataSelect[0]
      this.type = obj.extra.type
      if (this.searchType === 'source') {
        this.source = obj
        this.search()
      } else {
        this.target = obj
      }
      this.visible = false
    },
    async transferClick(type) {
      this.$confirm(`是否执行权限${type === 'transfer' ? '转移' : '复制'}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async() => {
          if (
            this.source.name &&
            ((this.transferType == 1 && this.target.name) ||
              this.transferType == 2) &&
            this.selections.length > 0
          ) {
            this.loading = true
            const roles = this.selections.map((item) => {
              return { id: item.id }
            })
            const payload = {
              sourceParty: {
                partyId: this.source.id,
                partyType: this.type,
              },
              targetParty: {
                partyId: this.target.id,
                partyType: this.type,
              },
              roles: roles,
              transferType: type === 'transfer' ? '3' : this.transferType,
            }
            const resp = await this.dispatch(
              AuthManagerController.handleTransferRoleResources,
              payload
            )
            if (!resp.error) {
              if (type === 'transfer') {
                const isExit = this.selections.some(i => {
                  const types = i.partyName.split(',')
                  if (types.length > 1) {
                    return true
                  } else {
                    const left = i.partyName.indexOf('(') + 1
                    const right = i.partyName.indexOf(')')
                    return i.partyName.slice(left, right) !== this.type
                  }
                })
                if (isExit) {
                  this.warningMessage('被执行转移的数据包含其他对象,会被复制，不会删除')
                } else {
                  this.$msg.success('操作成功！')
                }
              } else {
                this.$msg.success('操作成功！')
              }
              this.search()
            }
            this.loading = false
          } else {
            if (!this.source.name) {
              this.warningMessage('选择对象不能为空！')
              return
            }
            if (!this.target.name && this.transferType == 1) {
              this.warningMessage('目标对象不能为空！')
              return
            }
            if (this.selections.length == 0) {
              this.warningMessage('请至少选择一条记录！')
              return
            }
          }
        })
        .catch(() => {

        })
    },
    cancel() {
      this.dialogVisible = false
    },
    changeTypeSelect(e) {
      const code = this.typeObject.length > 0 ? this.typeObject[0].code : ''
      if (code !== e) {
        this.target = {}
        this.source = {}
        this.sourceOptions = []
        this.targetOptions = []
      }
    },
    handlePartyName(numString) {
      let theString = ''
      if (numString.length > 0) {
        const dictType = this.dictType
        theString = numString.replace(/\((.*?)\)/g, function(numString, i) {
          return `(${dictType[i]})`
        })
      }
      return theString
    }
  },
}
</script>

<style lang='scss' scoped>

.bar {
  margin-bottom: 0px !important;
}

.title {
  line-height: 32px;
  font-size: 14px;
}
.obj{
    color:#606266;
    font-weight: 500;
    padding-left: 10px;
}
.container {

  display: flex;
  align-items: center;
  ::v-deep .el-input__suffix{
    padding: 0 6px;
  }
}
.box {
  // display: flex;
  border: 1px solid #ccc;
  border-radius: 8px;
//   height: 105px;
  width: 100%;
}
.backimg{
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background: var(--tagBg);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    img{
        width: 32px;
        height: 32px;
    }
}
.right-done {
  width: 106px;
  height: 36px;
  margin-left: 10px;
}
.treeBtn {
  border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
  border-left-color: transparent !important;
}
</style>

