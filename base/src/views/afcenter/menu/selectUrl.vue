<template>
  <div class="position-relative">
    <el-autocomplete
      v-model="urlName"
      class="w-100p"
      clearable
      :fetch-suggestions="querySearch"
      placeholder="请输入页面名称关键字/选择页面资源"
      :trigger-on-focus="false"
      @select="handleSelect"
    >
      <el-button slot="suffix" v-bind="$attrs" type="text" icon="el-icon-search" @click="open" />
    </el-autocomplete>
    <i v-if="item && item.funcname" class="el-icon-close position-absolute clear" @click="clear" />
    <el-dialog title="选择页面" top="60px" :visible.sync="dialogVisible" width="800px" height="600px" append-to-body :before-close="handleClose">
      <PmSecondaryMenu
        v-if="dialogVisible"
        :right-title="false"
        :offset-height="115"
        :left-width="240"
        style="height: calc(100vh - 350px);"
      >
        <div slot="left-title">
          <span v-if="isExpress || appMenuId">分组</span>
          <div v-else>
            <el-select v-model="appId" placeholder="请选择应用" style="width:250px" filterable @change="appSelectChange">
              <el-option v-for="item in appList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </div>
        </div>
        <div slot="left-body">
          <GroupTree :app-id="appId" :business-obj-id="businessObjId" :group-id.sync="groupId" :resoure-type.sync="resoureType" />
        </div>
        <div slot="right-body" class="pt-0 pl-10">
          <UrlList
            v-if="dialogVisible"
            :appid="appId"
            :business-obj-id="businessObjId"
            :groupid="groupId"
            :mark="mark"
            @returnSelectUrl="returnSelectUrl"
            :selectRes="value"
          />
        </div>
      </PmSecondaryMenu>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitUrl">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { AppController, ResGroupController, ResourceController } from '@controller'
import { BaseVue, List } from '@lib'
import GroupTree from '../app/group/group-tree.vue'
import UrlList from '../app/resource/res-url.vue'
export default {
  components: { UrlList, GroupTree },
  mixins: [BaseVue, List],
  props: {
    value: {
      type: Object,
      default: {},
    },
    mark:{}
  },
  inject: ["currentAppId"],
  data() {
    return {
      dialogVisible: false,
      businessObjId: null,
      appId: null,
      groupId: null,
      resoureType: 'url',
      expandedKeys: [],
      selectUrl: null,
      appList: [],
      resUrl: null,
      urlName:null,
    }
  },
  watch: {
    dialogVisible: {
      handler(val) {
        this.dialogVisible = val
      }
    },
    'value.name': {
      immediate: true,
      deep:true,
      handler(val) {
        this.urlName = val
      }
    },
    urlName:{
      immediate: true,
      handler(val){
        if(!val){
          this.$emit('input', {})
        }
      }
    }
  },
  computed:{
    isExpress(){
            return Vue.config.isExpress  
      },
    appMenuId(){
      return (this.$route.query ? this.$route.query.appId : null) || this.currentAppId || null
      },
  },
  mounted() {
    console.log(this.mark,'mark=selectURl')
  },
  methods: {
    open() {
      this.dialogVisible = true
      this.getAppList()
      if (this.value && this.value.id) {
        this.findResourcebyId()
      }
    },
    async getAppList() {
      const paload = {
        pageIndex: 0,
        pageSize: -1,
        tenantId: this.currentTenant
      }
      const resp = await this.dispatch(AppController.queryAppsByCriteria, paload)
      if (!resp.error) {
        //1.应用菜单设置只能选app应用下的资源;2.平台设置默认选中第一个
        if (!this.appId) {
        const defsultAppId =  this.appMenuId ? this.appMenuId : resp.data.data[0].id
        this.expandedKeys = defsultAppId
        this.appId = defsultAppId
        }
        this.appList = resp.data.data
      } else {
        this.appList = []
      }
    },
    async getUrlList(name) {
      const q = {
        pageIndex: 0,
        pageSize: -1,
        tenantId: this.currentTenant
      }
      const payload = { name: name, types: 'url', ...q }
      const resp = await this.dispatch(ResourceController.queryResourcesByCriteria, payload)
      return resp.data.data
    },
    async querySearch(queryString, cb) {
      var list = [{}]
      var results = await this.getUrlList(queryString)
      for (const i of results) {
        //  i.value = i.name;
        const group = await this.dispatch(ResGroupController.findResGroup, { id: i.resGroupId })
        const groupName = group.data.name
        i.value = '[' + groupName + '] ' + i.name
      }
      list = results
      cb(list)
    },
    handleSelect(item) {
      this.$emit('input', item)
    },

    submitUrl() {
      this.$emit('input', this.resUrl)
      this.dialogVisible = false
      this.emptyDate()
    },
    returnSelectUrl(data) {
      this.resUrl = data
    },
    cancel() {
      this.dialogVisible = false
      this.emptyDate()
    },
    handleClose() {
      this.dialogVisible = false
      this.emptyDate()
    },
    async findResourcebyId() {
      const resp = await this.dispatch(ResourceController.findResource, { id: this.value.id })
      if (!resp.error) {
        //为了url资源回显
        this.appId = resp.data.appId
        this.groupId = resp.data.resGroupId
      }
    },
    emptyDate(){
      this.appId = ''
      this.groupId = ''
    },
    appSelectChange(item){
      if(item){
        this.groupId = null
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .hamburger {
  display: none !important;
}
::v-deep .el-icon-circle-check {
  display: none !important;
}
.div-left {
  width: 50px;
  height: 120px;
  float: left;
}
</style>
