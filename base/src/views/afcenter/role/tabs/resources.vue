<template>
  <div>
    <PmSecondaryMenu v-if="props.type=='platform'" :showTitle="false" :right-title="false" :left-width="0" :offset-height="-20" :show-title="!isExpress">
      <template v-if="!isExpress">
        <!-- <div slot="left-title">
          应用列表
        </div> -->
        <div slot="left-body">
          <el-tree
            ref="tree"
            v-loading="AppController.queryAppsByCriteria.loading"
            class="mt-10"
            :props="treeProps"
            :data="application"
            highlight-current
            node-key="id"
            :current-node-key="apply.id"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
          >
            <div slot-scope="{ node, data }" class="custom-tree-node">
              <svg-icon class="svgicon" icon-class="apply" />
              <span>{{ node.label }}</span>
            </div>
          </el-tree>
        </div>
      </template>

      <div v-if="apply.id" slot="right-body" class="right-body padding">
        <el-tabs v-model="resourceType" @tab-click="handleClick">
          <el-tab-pane
            v-for="item in resourcesType"
            :key="item.code"
            v-loading="loading"
            :label="item.name"
            :name="item.code"
          >
            <!-- <div class="savebtn">
                            <PmToolbar>
                                <PmToolbarItem plain @click="saveClick" v-if="resources.length>0&&!nodata" :loading="btnLoading" v-permission="FuncCode.afc_f_auth_role_res_bind">保存</PmToolbarItem>
                            </PmToolbar>
                        </div> -->
            <span slot="label"><i :class="item.icon" /> {{ item.name }}</span>
            <div v-if="resources.length>0&&!nodata" class="mt-10">
              <div v-for="(item2, index) in resources" :key="item2.id">
                <div v-if="resources[index].resources&&resources[index].resources.length > 0" class="row">
                  <RowCheckbox v-model="resources[index]" @submitResHandle="submitResHandle" />
                </div>
              </div>
            </div>
            <div v-else class="mt-50">
              <no-data slot="empty" />
            </div>
            <div style="border-top: 1px;" class="div-near-bottom">
              <el-button v-if="resources.length>0&&!nodata" v-permission="FuncCode.afc_f_auth_role_res_bind" type="primary" :loading="btnLoading" @click="saveClick">保存</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </PmSecondaryMenu>
    <div v-else class="right-body">
      <el-tabs v-model="resourceType" @tab-click="handleClick">
        <el-tab-pane
          v-for="item in resourcesType"
          :key="item.code"
          v-loading="loading"
          :label="item.name"
          :name="item.code"
        >
          <span slot="label"><i :class="item.icon" /> {{ item.name }}</span>
          <div v-if="resources.length>0&&!nodata" class="mt-10">
            <div v-for="(item2, index) in resources" :key="item2.id">
              <div v-if="resources[index].resources&&resources[index].resources.length > 0" class="row">
                <RowCheckbox v-model="resources[index]" @submitResHandle="submitResHandle" />
              </div>
            </div>
          </div>
          <div v-else class="mt-50">
            <no-data slot="empty" />
          </div>
          <div class="savebtn">
            <div style="border-top: 1px;" class="div-near-bottom">
              <el-button v-if="resources.length>0&&!nodata" v-permission="FuncCode.afc_f_auth_role_res_bind" type="primary" :loading="btnLoading" @click="saveClick">保存</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
AppController, AuthManagerController, DictTypeController, RoleController
} from '@controller'
import { BaseVue, List, VueUtil } from '@lib'
import { mapGetters } from 'vuex'
import RowCheckbox from '../component/permission-row.vue'
export default {
  components: { RowCheckbox },
  mixins: [BaseVue, List],
  props: {
    form: {},
    props: {
      type: Object
    },
    currentAppId:{
      type: String,
      default:""
    }
  },
  data() {
    return {
      resourceType: '',
      currentIndex: 0,
      resources: [],
      currentResources: [],
      application: [],
      apply: {},
      treeProps: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf',
      },
      bindResources: [],
      btnLoading: false,
      loading: false,
      bindChange: false,
      dicttypeid: 'sys_resourse_types',
      filterText: '',
      nodata: false
    }
  },
  watch: {
    apply: {
      deep: true,
      handler(value) {
        if (value.id) {
          // this.resourceType =this.resourcesType.length>0?this.resourcesType[0].code:''
          // this.currentIndex = 0
          this.bindResources = []
          this.bindChange = false
          this.resourcesType && this.resourcesType.map((item, index, arr) => {
            if (item.hasOwnProperty('children')) {
              delete item.children
            }
            if (item.hasOwnProperty('bindResources')) {
              delete item.bindResources
            }
          })
          this.getResource()
        }
      },
    },
    filterText(val) {
      this.$refs.tree.filter(val.trim())
    },
  },
  computed: {
    ...mapGetters(['dicts']),
    ...VueUtil(this)
      .select([AppController, RoleController, DictTypeController, AuthManagerController])
      .state(),
    isExpress() {
      return Vue.config.isExpress
    },
    appId() {
      return (this.$route.query ? this.$route.query.appId : null) || this.currentAppId || null
    }
  },
  async mounted() {
    await this.loadData()
    // 查询资源
    if (this.props.type == 'businessObject') {
      this.getResource()
    } else if (this.props.type == 'platform') {
      // 查询应用列表
      this.getApplication()
    } else if(this.appId){
      // 查询应用资源
      this.apply = await this.getAppbyId(this.appId)
    }
  },
  methods: {
    async getApplication() {
      const paload = {
        pageIndex: 0,
        pageSize: -1,
      }
      const resp = await this.dispatch(AppController.queryAppsByCriteria, paload)
      if (!resp.error) {
        this.application = resp.data.data
        if (resp.data.data.length > 0) {
          this.$nextTick(() => {
            this.apply = this.application[0]
            if (!this.isExpress) {
              this.$refs.tree.setCurrentKey(this.application[0].id)
            }
          })
        }
      }
    },
    async getResource() {
      this.loading = true
      const paload = {
        pageIndex: 0,
        pageSize: -1,
        // appId:this.apply.id,//应用id或者业务对象id
        roleId: this.form.id, // 角色id
        types: this.resourceType// 资源类型
      }

      if (this.props.type == 'businessObject') {
        paload.businessObjId = this.props.businessObjId
        paload.appId = this.form.appId
      } else {
        paload.appId = this.apply.id
      }
      const resp = await this.dispatch(AuthManagerController.queryResGroupWithRole, paload)
      if (!resp.error) {
        this.resources = resp.data
        this.handleData()
      }
      this.loading = false
    },
    // 资源类型
    handleClick(item) {
      this.bindResources = []
      // this.bindChange = false
      this.currentIndex = item.index
      if (this.resourcesType[this.currentIndex].hasOwnProperty('bindResources')) {
        this.bindResources = this.resourcesType[this.currentIndex].bindResources
        this.bindChange = true
      }
      if (!this.resourcesType[this.currentIndex].hasOwnProperty('children') || !this.resourcesType[this.currentIndex].children) {
        this.getResource()
      } else {
        this.resources = this.resourcesType[this.currentIndex].children
        this.nodata = this.resourcesType[this.currentIndex].nodata
      }
    },
    handleData() {
      this.resourcesType[this.currentIndex].children = this.resources
      if (this.resources.length > 0) {
        const nodata = this.resources.every(v => {
          return (!v.resources) || (v.resources.length == 0)
        })
        this.nodata = nodata
        this.resourcesType[this.currentIndex].nodata = nodata
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    async submitResHandle(checked, value, groupId) {
      if (value.length > 0) {
        this.bindChange = true
        this.resources.map((item, index, arr) => {
          if (groupId == item.id) {
            item.resources.forEach((item2, index2) => {
              value.forEach((v1, i1) => {
                if (checked == true) {
                  if (v1.id == item2.id) {
                    this.bindResources.push(item2)
                  } else {
                    if (item2.selected == true) {
                      this.bindResources.push(item2)
                    }
                  }
                } else {
                  if (item2.selected == true) {
                    if (item2.id != v1.id) {
                      this.bindResources.push(item2)
                    }
                  }
                  if (this.bindResources && this.bindResources.length > 0) {
                    const bindResources = _.cloneDeep(this.bindResources)
                    bindResources.forEach((item3, index3) => {
                      if (item3.id == v1.id) {
                        this.bindResources.splice(index3, 1)
                      }
                    })
                  }
                }
              })
            })
          } else {
            item.resources && item.resources.forEach((item, index, arr) => {
              if (item.selected == true) {
                this.bindResources.push(item)
              }
            })
          }
        })
        this.bindResources = this.removeDuplicate(this.bindResources, 'id')
        this.resourcesType[this.currentIndex].bindResources = this.bindResources
      }
    },
    async saveClick() {
      if (this.bindChange) {
        this.btnLoading = true
        this.switchScreenLoading(true)
        const payload = {
          bindResources: this.bindResources,
          roleId: this.form.id,
          types: this.resourceType,
          appId: this.apply.id || '',
          businessObjId: this.props.businessObjId || ''
        }
        const resp = await this.dispatch(AuthManagerController.handleRoleResource, payload)
        if (!resp.error) {
          this.$msg.success('保存成功')
        }
        this.switchScreenLoading(false)
        this.btnLoading = false
      } else {
        this.$msg.success('保存成功')
      }
    },
    removeDuplicate(array, key) {
      if (array && array.length == 0) {
        return array
      }
      const hash = {}
      const arr = array.reduce((preVal, curVal) => {
        hash[curVal[key]]
          ? ''
          : (hash[curVal[key]] = true && preVal.push(curVal))
        return preVal
      }, [])
      return arr
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
          this.resourcesType = resourcesType
          this.resourceType = resourcesType.length > 0 ? resourcesType[0].code : ''
        }
      } else {
        const dicts = _.cloneDeep(this.dicts)
        this.resourcesType = dicts[this.dicttypeid] || []
        this.resourceType = this.resourcesType.length > 0 ? this.resourcesType[0].code : ''
      }
    },
    handleNodeClick(data) {
      if (data.id) {
        this.apply = data
      } else {
        this.apply = ''
      }
    },
    async getAppbyId(id) {
      const resp = await this.dispatch(AppController.findApp, { id: id })
      if (!resp.error) {
        return resp.data
      }
    },
  }
}
</script>

<style lang='scss' scoped>
::v-deep .hamburger{
  display: none !important;
}
.right-body{
    height:calc(100vh - 300px);
}
.padding{
	// margin-top: 8px;
    margin-left: 8px;
}
.row {
    min-height:36px;
    line-height:36px;
    border-bottom: 1px solid #ebeef5;
    &:nth-child(even) {
      background: #FAFAFA;

    }
  }
.el-tabs--card {
  height: calc(100vh - 300px);
  /* overflow-y: auto; */
}
.el-tab-pane {
  height: calc(100vh - 150px);
  overflow-y: auto;
}
.custom-tree-node{
  display: flex;
  align-items: center;
}
.svgicon{
  width:12px;
  height:12px;
  margin-right: 10px;
}
.savebtn{
  text-align: right;
  margin-top: 40px;
}

::v-deep .el-tree-node__content{
    height: 36px !important;
}
::v-deep .el-input--mini .el-input__inner{
    height: 30px;
    border: none;
}
// .el-input__inner
</style>

