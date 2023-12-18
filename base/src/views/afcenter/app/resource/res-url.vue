<template>
  <div>
    <el-row class="pb-10">
        <PmSearch :query.sync="query" class="float-right" defaultProp="name" @search="pmSearch" placeholder="搜索页面名称" style="width: 300px;">
          <template slot="body">
            <el-form-item label="页面名称" prop="name">
              <el-input v-model="query.name" clearable />
            </el-form-item>
            <el-form-item label="页面编号" prop="code">
              <el-input v-focus v-model="query.code" clearable />
            </el-form-item>
          </template>
        </PmSearch>
    </el-row>
    <el-table v-loading="loading" height="370px" ref="table" border stripe :data="gridList" @sort-change="sortChange"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="页面编号" prop="code"></el-table-column>
      <el-table-column label="页面名称" prop="name"></el-table-column>
      <el-table-column label="页面类型">
        <template slot-scope="{row}">
          <Dict v-model="row.openType" dicttypeid="sys_open_types" mode="view"/>
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
  </div>
</template>
<script>
import { DictTypeController, ResourceController } from "@controller"
import { BaseVue, List, VueUtil } from "@lib"
import { mapGetters } from "vuex"
import SelectGroup from "../group/selectGroup.vue"
import UrlFrom from "./url-form"

export default {
  components: { UrlFrom, SelectGroup },
  mixins: [BaseVue, List],
  props: {
    type: {
      type: String,
      default: "type"
    },
    appid: {
      type: String,
      default: "appid"
    },
    groupid: {
      type: String,
      default: "groupid"
    },
    businessObjId: {
      type: String,
      default: null
    },
    selectUrl: {
      type: String,
      default: null
    },
    selectRes:{
      type: Object,
      default:()=>{
        return {}
      }
    },
    mark: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      dicttypeid: "sys_open_types",
      query: {},
      dialogVisible: false,
      formType: null,
      parameter: {},
      groupEnable: false,
      multipleSelection: [],
      selectGroup: null,
      groups: [],
      urlId: null,
      btnLoading: false,
      openTypes: {}
    }
  },
  mounted() {
    this.loadDictData()
    this.search()
  },
  updated () {
    //回显选中资源
    this.$nextTick(() => {
      if(this.selectRes && this.selectRes.code){
        const selected =  this.gridList.filter(item=>item.code === this.selectRes.code)
        if(selected.length){
          this.$refs.table.toggleRowSelection(selected[0],true) 
        }
      }
    }) 
  },
  watch: {
    type(val) {
      this.search()
    },
    groupid(val) {
      this.search()
    },
    businessObjId(res) {
      this.businessObjId = res
      this.search()
    },
    appid(res) {
      this.appid = res
      this.search()
    },
    dicts: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          const objectType = this.dicts[this.dicttypeid] || []
          this.openTypes = {}
          for (const item of objectType) {
            this.openTypes[item.code] = item.name
          }
        }
      }
    }
  },
  computed: {
    ...VueUtil(this).select([DictTypeController, ResourceController]).state(),
    loading() {
      return this.ResourceController.queryResourcesByCriteria.loading
    },
    ...mapGetters(["dicts"])
  },
  methods: {
    async searchBody() {
      const q = this.otherQuery(this.query)
      let payload =
        this.businessObjId == null
          ? { appId: this.appid, types: "url", resGroupId: this.groupid, ...q }
          : { businessObjId: this.businessObjId, types: "url", resGroupId: this.groupid, ...q }
      const resp = await this.dispatch(ResourceController.queryResourcesByCriteria, payload)
      if (this.mark === "mobile") {
        resp.data.data = resp.data.data.filter((item) => {
          const content = JSON.parse(item.content)
          return content.openType !== "afcenter" && content.biType !== "cockpit"
        })
      }
      for (const item of resp.data.data) {
        const content = JSON.parse(item.content)
        const openType = content ? content.openType : ""
        item.urlType = this.openTypes[openType]
        item.openType = openType

      }
      return resp
    },
    handleSelectionChange(val) {
      if(val && val.length){
        this.selectUrl = val[0].id
        this.$nextTick(function () {
          this.gridList.forEach((item) => {
            if (val[val.length - 1] === item) {
              this.$refs.table.toggleRowSelection(item, true)
            } else {
              this.$refs.table.toggleRowSelection(item, false)
            }
          })
        })
      this.$emit("returnSelectUrl", val[0])
      }
    },
    async loadDictData() {
      if (!this.dicttypeid) {
        return
      }
      if (!this.dicts[this.dicttypeid]) {
        const resp = await this.dispatch(DictTypeController.queryDictTypesByCriteria, {
          code: this.dicttypeid,
          tenantId: this.currentTenant
        })
        if (!resp.error) {
          this.$store.commit("ADD_DICT", {
            key: this.dicttypeid,
            value: resp.data.data.length ? resp.data.data[0].dictEntrys : []
          })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.urlSerch {
  margin-left: 80%;
}

.div-left {
  width: 50px;
  height: 120px;
  float: left;
}
</style>
