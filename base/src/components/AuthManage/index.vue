<template>
  <div class=" pb-20">
    <div class="top-block">
      <el-row>
        <el-col :span="12">
          <PmToolbar>
            <PmToolbarItem plain icon="el-icon-plus" @click="openAdd">添加授权对象</PmToolbarItem>
          </PmToolbar>
        </el-col>
      </el-row>
    </div>
    <el-table
      :highlight-current-row="true"
      :height="tableHeight"
      :data="gridList"
      border
      stripe
    >
      <el-table-column label="对象类型" prop="code">
        <template slot-scope="{row}">
          <span>{{ dictType[row.partyType] }} </span>
        </template>
      </el-table-column>
      <el-table-column label="对象" prop="partyName" />
      <el-table-column label="角色数量" prop="roleAmount">
        <template slot-scope="scope">
          <el-link @click="gotoDetail(scope.row)">{{ scope.row.roleAmount }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="{ row }">
          <PmToolbar>
            <PmToolbarItem
              type="text"
              @click="addAuth(row)"
            >授权</PmToolbarItem>
            <PmToolbarItem
              type="text"
              @click="remove(row)"
            >删除</PmToolbarItem>
          </PmToolbar>
        </template>
      </el-table-column>
    </el-table>
    <!-- </div> -->
    <Pagination
      :selections="selections"
      :page-size="query.limit"
      :current-page.sync="query.offset"
      :total="gridTotal"
      @size-change="changePageSizer"
      @current-change="changePage"
    />
    <SelectTypes
      v-if="dialogVisible"
      :dialog-visible.sync="dialogVisible"
      :is-multiple="true"
      :party-types="objectType"
      :business-obj-id="businessObjId"
      :is-next="true"
      title="添加授权对象"
      @sure="success"
    />
    <SelectTypes
      v-if="addRoleVisible"
      :dialog-visible.sync="addRoleVisible"
      :business-obj-id="businessObjId"
      :is-multiple="true"
      :party-types="partyTypes"
      title="添加角色"
      @sure="handleSuccess"
    />
    <Detail
      v-if="detailVisible"
      :row.sync="selectRow"
      :visible.sync="detailVisible"
      title="查看详情"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import { AuthManagerController, DictTypeController } from '@controller'
import { BaseVue, List } from '@lib'
import { mapGetters } from 'vuex'
import Detail from './form.vue'
export default {
  components: { Detail },
  mixins: [BaseVue, List],
  props: {
    businessObjId: {
      type: String,
    },
    businessObjInstId: {
      type: String,
    },
    tableHeight: {
      default: '460px',
    },

  },
  data() {
    return {
      dicttypeid: 'sys_party_types',
      objectType: [],
      dictType: {},
      addRoleVisible: false,
      addRoleInfo: null,
      detailVisible: false,
      selectRow: null,
      partyTypes: [{ code: 'role', name: '角色' }]
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
            this.objectType.forEach(item => {
              if (item.code !== 'role_app') {
                dictType[item.code] = item.name
              }
            })
            this.dictType = dictType
          }
        }
      },
    },
    detailVisible: {
      handler(val) {
        if (val == false) {
          this.pmSearch()
        }
      }
    }
  },
  mounted() {
    this.loadData()
    this.search()
  },
  methods: {
    async searchBody() {
      const query = this.otherQuery(this.query)
      const payload = { businessObjInstId: this.businessObjInstId, businessObjId: this.businessObjId, ...query }
      const resp = await this.dispatch(AuthManagerController.queryPartysWithBusObjInst, payload)
      return resp
    },
    async removeBody(row) {
      const payload = {
        businessObjInstId: this.businessObjInstId,
        businessObjId: this.businessObjId,
        partyRoles: [
          {
            partyId: row.partyId,
            partyType: row.partyType,
            businessObjInstId: this.businessObjInstId,
            businessObjId: this.businessObjId,
          }
        ]
      }
      payload.params = { businessObjId: this.businessObjId }
      const resp = await this.dispatch(AuthManagerController.delPartyAuthWithBusObjInst, payload)
      return resp
    },
    // 授权
    addAuth(row) {
      this.addRoleVisible = true
      this.addRoleInfo = row
    },
    handleSuccess(form) {
      this.addRoleInfo.id = this.addRoleInfo.partyId
      this.addRoleInfo.type = this.addRoleInfo.partyType
      this.addRoleVisible = false
      this.success(form, this.addRoleInfo)
    },
    async success(roles, party) {
      const partyRole = roles && roles.map((role) => {
        const data = {
          partyId: party.id,
          partyType: party.extra?.type || party.type,
          role: {
            id: role.id
          },
          roleType: role.types,
          businessObjInstId: this.businessObjInstId,
          businessObjId: this.businessObjId
        }
        return data
      })
      const payload = { partyRole: partyRole }
      const resp = await this.dispatch(AuthManagerController.handlePartyAuth, payload)
      if (!resp.error) {
        this.$msg.success('添加成功')
        this.search()
      }
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
    gotoDetail(row) {
      row.businessObjId = this.businessObjId
      row.businessObjInstId = this.businessObjInstId
      this.selectRow = row
      this.detailVisible = true
    },
    cancel() {
      this.detailVisible = false
    }
  },
}
</script>
