<template>
  <PmSecondaryMenu :offsetHeight="15" :class="{'ml-20':isOneApp ? true : false,'pr-20':isOneApp ? true : false }" :style="`height:${isOneApp ? 'calc(100vh - 60px)' : undefined} `" :showTitle="false" :rightTitle="false">
    <div slot="left-body">
      <GroupTree :viewType="view" :appId="appId" :businessObjId="businessObjId" :groupId.sync="groupId"
        :resoureType.sync="resoureType" :class="isOneApp ? 'oneApp' : 'normalAll'" />
    </div>
    <div slot="right-body">
      <el-tabs v-model="activeTab" class="pl-10" v-if="view === 'group'" @tab-click="handleClick">
        <el-tab-pane lazy v-for="rt in resourceTypes" :label="rt.name" :key="rt.id" :name="rt.index">
          <span slot="label">{{ rt.name }}</span>
          <keep-alive>
            <component :is="currentTab" :appid="appId" :businessObjId="businessObjId" :type="rt.id" :groupid="groupId"
              :appCode="data.code"></component>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </PmSecondaryMenu>
</template>
<script>
import { ResGroupController,AppController} from "@controller"
import { BaseVue, Form, List, _ } from "@lib"
import GroupTree from "../group/tree"
import DataList from "./data-list.vue"
import FunctionList from "./function-list.vue"
import model from "./model.js"
import UrlList from "./url-list.vue"
import oneApp from '../oneApp.js'
export default {
  components: { FunctionList, UrlList, DataList, GroupTree },
  mixins: [BaseVue, Form, List,oneApp],
  props: {
    data: {},
    businessObjId: {
      type: String,
      default: null
    },
    selectTab: {
      type: String,
      default: null
    },
    appId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      activeTab: "0",
      resourceTypes: [
        { index: "0", name: "页面", id: "url", icon: "el-icon-wallet" },
        { index: "1", name: "功能", id: "function", icon: "el-icon-s-opportunity" },
        { index: "2", name: "数据", id: "data", icon: "el-icon-s-data" }
      ],
      view: "group",
      TEXT: {
        subgroup: "新建分组",
        editgroup: "编辑分组"
      },
      dialogVisible: false,
      formType: null,
      selectGroup: {},
      resoureType: "function",
      groupId: null,
      model: model,
      form: _.cloneDeep(model.group),
    }
  },
  watch: {
    businessObjId(res) {
      this.businessObjId = res
    },
    appId: {
      immediate: true,
      handler() {
        this.UndefaultGroup()
      }
    }
  },
  async mounted() {
    if (this.businessObjId) {
      //业务对象下，不显示数据
      this.resourceTypes = this.resourceTypes.filter(item => item.id !== 'data')
    }
    if (!this.data) {
      this.isOneApp = true
      this.data = await this.findApp()
      this.appId = this.data.id
    }
  },
  computed: {
    currentTab() {
      const map = new Map([
        ["0", UrlList],
        ["1", FunctionList],
        ["2", DataList]
      ])
      return map.get(this.activeTab)
    }
  },
  methods: {
    //查询默认分组code查询分组
    async UndefaultGroup() {
      let res = await this.searGroupbyCode()
      if (!res.error && res.data.data.length > 0) {
        let group = res.data.data[0]
        this.groupId = group.id
      }
    },
    async searGroupbyCode() {
      const query = _.cloneDeep(this.query)
      query.pageSize = 999
      let payload = {
        appId: this.appId,
        code: this.appId + "_public_group",
        ...query
      }
      const resp = await this.dispatch(ResGroupController.queryResGroupsByCriteria, payload)
      return resp
    },
    openAdd(formType, e) {
      this.dialogVisible = true
      this.formType = formType
      if (formType === "editgroup") {
        this.selectGroup = e.data
      }
    },
    handleClick(tab, event) {
      this.activeTab = tab.name
    }
  }
}
</script>
<style lang="scss" scoped>
.normalAll {
  ::v-deep .pm-tree{
  height: calc(100vh - 203px) !important;
  }
}
.oneApp {
  ::v-deep .pm-tree{
  height: calc(100vh - 160px) !important;
  }
}

::v-deep .hamburger {
  display: none !important;
}

.viewBtn {
  margin-left: -10px;
  margin-top: -10px;
}

::v-deep .el-tabs--card .el-tabs__item {
  height: 40px !important;
  line-height: 40px !important;
}
</style>
