<template>
  <div class="pb-20 pl-20 pr-20 padding">
    <el-tabs v-model="tab" @tab-click="handleClick">
      <el-tab-pane name="platform" :label="appId ? '应用':'平台'">
        <System ref="system" :type="type" :currentAppId="currentAppId" @gotoDetail="gotoDetail" />
      </el-tab-pane>
      <el-tab-pane name="businessObject" label="业务对象">
        <Business v-if="!isChildUpdate" ref="business" :currentAppId="currentAppId" :type="type" @businessDetail="businessDetail" @gotoDetail="gotoDetail" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { BaseVue, List } from '@lib'
import Business from './tabs/business.vue'
import System from './tabs/system.vue'
export default {
  name: 'role',
  components: {
    System, Business
  },
  mixins: [BaseVue, List],
  props: {
    active: {
      type: String
    },
    currentAppId:{
      type: String,
      default:""
    }
  },
  data() {
    return {
      tab: 'platform',
      type: 'platform',
      isChildUpdate: true,
    }
  },
  computed: {
    appId() {
      return (this.$route.query ? this.$route.query.appId : null) || this.currentAppId || null
    },
  },
  watch: {
    active: {
      immediate: true,
      handler(val) {
        if (val) {
          if (val === 'businessObject') {
            this.tab = 'businessObject'
            this.type = 'businessObject'
          } else {
            this.tab = 'platform'
            // 应用的角色，用appid 赋予type值，区分应用角色
            this.type = this.appId ? this.appId : 'platform'
          }
        }
      },
    },
  },
  methods: {
    businessDetail(name) {
      if (name) {
        this.goto({
          title: `业务对象(${name})`,
          name: `businessObject`,
          props: {
            currentAppId:this.appId
          }
        })
      } else {
        this.goto({
          title: `业务对象`,
          name: `businessObject`,
          props: {
            currentAppId:this.appId
          }
        })
      }
    },
    handleClick(tab) {
      if (tab.name == 'businessObject') {
        if (this.$refs.business) {
          const currentNode = this.$refs.business.currentNode
          this.businessDetail(currentNode.name)
        } else {
          this.isChildUpdate = false
          this.goto({
            title: `业务对象`,
            name: `businessObject`,
            props: {
            currentAppId:this.appId
          }
          })
        }
      } else {
        this.isChildUpdate = true
        this.goto({
          title: `角色管理`,
          name: `role`
        })
      }
    },
    gotoDetail(row, tab, props) {
      if (props.type === 'platform') {
        this.goto({
          title: `角色详情(${row.name})`,
          name: `detail1`,
          props: {
            form: row,
            currentIndex: tab,
            props: props,
            currentAppId:this.appId
          }
        })
      } else {
        this.goto({
          title: `角色详情(${row.name})`,
          name: `detail2`,
          props: {
            form: row,
            currentIndex: tab,
            props: props,
            currentAppId:this.appId
          }
        })
      }
    }
  }
}
</script>
<style lang='scss' scoped>
::v-deep .secondary-menu .left {
  height: calc(100vh - 135px) !important;
}
.padding{
  margin-left: -5px !important;
}
</style>
