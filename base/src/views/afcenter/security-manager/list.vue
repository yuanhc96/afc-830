<template>
  <div>
    <div class="top-block">
      <PmSearch
        class="float-right"
        style="width: 300px"
        :query.sync="query"
        default-prop="employeeName"
        placeholder="搜索员工姓名"
        @search="pmSearch"
      >
        <template slot="body">
          <el-form-item label="员工编号" prop="code">
            <el-input v-model="query.code" clearable />
          </el-form-item>
          <el-form-item label="员工姓名" prop="employeeName">
            <el-input v-model="query.employeeName" clearable />
          </el-form-item>
          <el-form-item label="保密级别" prop="secretLevel">
            <Dict v-model="query.secretLevel" dicttypeid="SECRET_LEVEL" />
          </el-form-item>
        </template>
      </PmSearch>

    </div>
    <pm-table
      :id="tableId"
      :height="autoTableHeight"
      border
      stripe
      :columns="columns"
      :table-data="gridList"
      auto-select-row
      @selection-change="selectChange"
    >
      <div slot="code" slot-scope="scope" class="inline-action">
        <span>{{ scope.row.code }}</span>
      </div>
      <div slot="gender" slot-scope="scope" class="inline-action">
        <span>{{ genderTypes[scope.row.gender] || "未知" }}</span>
      </div>
      <div slot="status" slot-scope="scope" class="inline-action">
        <span>{{ scope.row.status === "1" ? "启用" : "禁用" }}</span>
      </div>
      <div slot="secretLevel" slot-scope="{row}" class="inline-action">
        <span>
          <!-- <Dict @input="dictChange(row)" v-model="row.secretLevel" dicttypeid="SECRET_LEVEL"/> -->
          <el-select v-model="row.secretLevel" placeholder="请选择保密级别" @change="dictChange(row)">
            <el-option v-for="item in secretLevel" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </span>
      </div>
    </pm-table>
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
import { mapGetters } from 'vuex'
import {
  EmployeeController,
  OrgController,
  DictTypeController,
  TenantController,
} from '@controller'
import { BaseVue, List, _ } from '@lib'
// import _ from "lodash"
export default {
  name: '',
  components: {},
  mixins: [BaseVue, List],
  props: {
    orgData: {},
    dimensionData: {},
    disabled: {
      default: function() {
        return false
      },
    },
  },
  data() {
    return {
      genderTypes: {},
      secretLevel: [],
      dicttypeid: ['SECRET_LEVEL', 'gender'],
      columns: [
        { label: '员工编号', prop: 'code', scope: 'code' },
        { label: '姓名', prop: 'name' },
        { label: '性别', scope: 'gender' },
        { label: '保密等级', prop: 'secretLevel', scope: 'secretLevel' },
        // { label: "岗位信息", prop: "managerId" },
        // { label: "操作", scope: "action", width: 120 },
      ],
    }
  },
  watch: {
    orgData(val) {
      if (val) {
        this.search()
      }
    },
    dicts: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          this.dicttypeid.forEach(item => {
            const objectType = this.dicts[item] || []
            if (item == 'gender') {
              this.genderTypes = {}
              for (const item of objectType) {
                this.genderTypes[item.code] = item.name
              }
            } else {
              this.secretLevel = [].concat(objectType)
            }
          })
        }
      }
    },
  },
  computed: {
    ...mapGetters(['dicts']),
    isRootNode() {
      return this.orgData && this.orgData.type === 'root'
    },
    height() {
      if (this.userInfo.attributes.isOrgManager) {
        return 'calc(100vh - 189px)'
      } else {
        return 'calc(100vh - 171px)'
      }
    },
  },
  mounted() {
    this.loadDictData('gender')
    this.loadDictData('SECRET_LEVEL')
  },
  methods: {
    async dictChange(row) {
      const resp = await this.dispatch(EmployeeController.updateSecretLevel, {
        employeeId: row.id,
        secretLevel: row.secretLevel,
      })
      if (!resp.error) {
        this.$message.success('修改成功!')
      }
    },
    async loadDictData(dicttypeid) {
      if (!dicttypeid) {
        return
      }
      if (!this.dicts[dicttypeid]) {
        const resp = await this.dispatch(DictTypeController.queryDictTypesByCriteria, {
          code: dicttypeid,
          tenantId: this.currentTenant
        })
        if (!resp.error) {
          this.$store.commit('ADD_DICT', {
            key: dicttypeid,
            value: resp.data.data.length ? resp.data.data[0].dictEntrys : []
          })
        }
      }
    },
    async searchBody() {
      const query = { ...this.query }
      //   const { id=null, dimensionId=null } = this.orgData;
      const id = _.get(this.orgData, 'id', null); const dimensionId = _.get(this.orgData, 'dimensionId', null)
      let resp = null
      // 根节点查询所有的员工信息
      if (this.isRootNode) {
        resp = await this.dispatch(EmployeeController.queryEmployeeBySecretLevelAndFilter, {
          ...query,
        })
      } else {
        const orgId = this.isRootNode ? null : id
        const payload = { orgId: orgId, ...query }
        resp = await this.dispatch(EmployeeController.queryEmployeeBySecretLevelAndFilter, payload)
      }

      return resp
    },
  },
}
</script>
<style scoped>
.tool-bar{
    overflow: hidden;
    padding: 8px 4px;
}
::v-deep .layer {
  position: static;
}
</style>
