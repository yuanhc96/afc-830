<template>
  <el-dialog
    width="900px"
    top="20px"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :title="title"
    append-to-body
    @close="cancelAdd"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane label="列表" name="table">
        <PmSearch style="width: 300px;" class="float-right mb-10" :query.sync="query" placeholder="选择权限名称" @search="pmSearch">
          <template slot="body">
            <el-form-item label="权限名称" prop="name">
              <el-input v-model="query.name" clearable />
            </el-form-item>
            <el-form-item label="权限编号" prop="code">
              <el-input v-model="query.code" clearable />
            </el-form-item>
            <el-form-item label="权限类型" prop="types">
              <Dict
                v-model="query.types"
                placeholder="请选择权限类型"
                dicttypeid="sys_resourse_types"
                style="width:100%"
                @keypress.native.enter="searchEnter"
              />
            </el-form-item>
          </template>
        </PmSearch>
        <el-table :highlight-current-row="true" border stripe :data="gridList" height="calc(100vh - 400px)">
          <el-table-column label="权限编号" prop="code" show-overflow-tooltip />
          <el-table-column label="权限名称" prop="name" show-overflow-tooltip />
          <el-table-column label="权限类型" prop="types">
            <template slot-scope="{row}">
              <span>{{ typesObj[row.types] }} </span>
            </template>
          </el-table-column>
          <el-table-column label="权限描述" prop="description" />
        </el-table>
        <el-row :gutter="0">
          <el-col :span="24" class="text-right">
            <pagination
              :page-size="query.limit"
              :current-page.sync="query.offset"
              :total="gridTotal"
              @size-change="changePageSizer"
              @current-change="changePage"
            />
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="关系图" name="relation" lazy>
        <div class="relations">
          <div :style="{height: chartsHeight}">
            <div class="toolBar">
              <span v-for="item in imgs">
                <img :src="item.url" alt="">
                <span>{{ item.name }}</span>
              </span>
            </div>
            <Charts :option="relationData" />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div slot="footer">
      <el-button type="text" @click="cancelAdd">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { AuthManagerController, DictTypeController } from '@controller'
import { BaseVue, List, VueUtil } from '@lib'
import { mapGetters } from 'vuex'
import Charts from './charts.vue'
export default {
  components: { Charts },
  mixins: [BaseVue, List],
  props: {
    dialogVisible: {
      type: Boolean
    },
    title: {
      type: String,
      default: '查看详情'
    },
    row: {
      type: Object
    }
  },
  computed: {
    ...mapGetters(['dicts']),
    ...VueUtil(this)
      .select([AuthManagerController])
      .state(),
    loading() {
      return this.AuthManagerController.queryResourcesByRole.loading
    },
  },
  watch: {
    row: {
      immediate: true,
      async handler(val) {
        if (val) {
          this.relationData = [{
            name: val.name,
            type: 'role'
          }]
          await this.search()
          await this.searchBody('all')
        }
      }
    },
    dicttypeid: {
      immediate: true,
      handler() {
        this.loadData()
      }
    }
  },
  data() {
    return {
      dicttypeid: 'sys_resourse_types',
      typesObj: {},
      activeName: 'table',
      relationData: [],
      chartsHeight: '500px',
      imgs: [
        {
          name: '角色',
          url: '../../../../static/images/role.png'
        }, {
          name: '应用',
          url: '../../../../static/images/app.png'
        }, {
          name: '分组',
          url: '../../../../static/images/resGroup.png'
        }, {
          name: '资源类型',
          url: '../../../../static/images/types.png'
        }, {
          name: '资源',
          url: '../../../../static/images/resource.png'
        }
      ],
      query: {
        limit: 10,
        offset: 1,
        types: null,
        name: null
      }
    }
  },

  methods: {
    searchEnter() {
      if (this.$refs.searchForm) { // 高级搜索 enter
        this.$refs.searchForm.searchQuery = { ...this.query }
        this.$refs.searchForm.initOptions()
        this.$refs.searchForm.visible = false
      }
      this.pmSearch()
    },
    async searchBody(type) {
      let paload = { roleId: this.row.id }
      if (type === 'all') {
        paload = {
          ...paload,
          pageSize: -1,
          pageIndex: -1
        }
      } else {
        let extraQuery = null
        if (this.query.name) {
          this.dicts.sys_resourse_types.forEach(i => {
            if (i.name === this.query.name) {
              extraQuery = {
                types: i.code
              }
            }
          })
        }
        paload = { ...paload, ...this.query, ...extraQuery }
      }
      const resp = await this.dispatch(AuthManagerController.queryResourcesByRole, paload)
      if (!resp.error) {
        if (type === 'all') {
          const { data: listData } = resp.data
          if (listData.length > 12) {
            this.chartsHeight = listData.length * 40 + 'px'
          }
          const getTypeData = (parent, typeName, typeCode, type, parentType, nodelists) => {
            let codes = []
            const data = []
            let nodes = []
            if (type === 'app') {
              codes = listData.map(i => i[typeCode])
              nodes = listData
            } else {
              nodes = nodelists.filter(i => i[parentType] === parent.code)
              codes = nodes.map(i => i[typeCode])
            }
            codes = _.uniq(codes)
            codes.forEach(item => {
              const arr = listData.filter(tem => tem[typeCode] === item)
              data.push({
                name: typeName === 'types' && this.typesObj ? this.typesObj[arr[0].types] : arr[0][typeName],
                code: arr[0][typeCode],
                type,
                nodes
              })
            })
            return data
          }
          const relationData = [{
            name: this.row.name,
            type: 'role'
          }]
          relationData.forEach(i => {
            i.children = getTypeData(i, 'appName', 'appId', 'app')
            if (i.children.length) {
              i.children.forEach(t => {
                t.children = getTypeData(t, 'resGroupName', 'resGroupId', 'resGroup', 'appId', t.nodes)
                if (t.children.length) {
                  t.children.forEach(e => {
                    e.children = getTypeData(e, 'types', 'types', 'types', 'resGroupId', e.nodes)
                    if (e.children.length) {
                      e.children.forEach(m => {
                        m.children = getTypeData(m, 'name', 'code', 'resource', 'types', m.nodes)
                      })
                    }
                  })
                }
              })
            }
          })
          this.$set(this, 'relationData', relationData)
        } else {
          this.gridData = resp.data
        }
      }
    },
    cancelAdd() {
      this.$emit('cancel')
    },
    async loadData() {
      if (!this.dicttypeid) { return }
      if (!this.dicts.hasOwnProperty(this.dicttypeid)) {
        this.$store.commit('ADD_DICT', { key: this.dicttypeid, value: null })
        const resp = await this.dispatch(DictTypeController.queryDictTypesByCriteria, {
          code: this.dicttypeid,
          tenantId: this.currentTenant,
        })
        if (!resp.error) {
          const resourcesType = resp.data.data.length ? resp.data.data[0].dictEntrys : []
          this.$store.commit('ADD_DICT', { key: this.dicttypeid, value: resourcesType })
          this.handleData(resourcesType)
        }
      } else {
        const dicts = _.cloneDeep(this.dicts)
        const resourcesType = dicts[this.dicttypeid] || []
        this.handleData(resourcesType)
      }
    },
    handleData(resourcesType) {
      const typesObj = {}
      resourcesType.forEach(item => {
        typesObj[item.code] = item.name
      })
      this.typesObj = typesObj
    }
  }
}
</script>

<style lang="scss" scoped>
.relations {
    height: calc(100vh - 362px);
    overflow-y: auto;
    overflow-x: hidden;
}
.toolBar {
    float: right;
    height: 50px;
    padding-top: 15px;
    padding-right: 10px;
    img {
      margin-left: 15px;
      height: 25px;
    }
  }

</style>
