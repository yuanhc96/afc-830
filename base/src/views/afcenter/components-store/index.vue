<template>
  <div class="pl-20">
    <PmSecondaryMenu :offsetHeight="-20"  :rightTitle="false" :showTitle="false" >
      <div slot="left-body" >
        <GroupTree ref="group-tree" :group.sync="group" @export="exportZip"  />
        <PmToolbar class="ml-10" >
            <PmToolbarItem
              icon="el-icon-plus"
              plain
              style="width:150px"
              @click="addGroup"
            >新建分组</PmToolbarItem>
            <PmToolbarGroup >
              <PmToolbarItem
                plain
                icon="el-icon-download"
                @click="handleAll('all')"
              >导出全部组件</PmToolbarItem>
              <PmToolbarItem
                plain
                @click="handleAll('refresh')"
                icon="el-icon-refresh-right"
              >刷新</PmToolbarItem>
            </PmToolbarGroup>
           
        </PmToolbar>
      </div>
      <div slot="right-title" />
      <div slot="right-body">   
        <ComponentsList :groupContent="groupContent" :groupCode="groupCode" />        
      </div>
    </PmSecondaryMenu>
  </div>
</template>
<script>
import { ComponentCenterController } from '@controller'
import { BaseVue, Form } from "@lib"
import ajaxUtil from '@lib/ajaxUtil'
import FileSaver from 'file-saver'
import GroupTree from './group/index.vue'
import ComponentsList from './list.vue'
  export default {
    components: { GroupTree, ComponentsList },
    mixins: [BaseVue, Form],
    props: {
    },
    data() {
      return {
        dialogVisible: false,
        formType: null,
        selectGroup: {},
        group: null,
        groupContent: [],
        groupCode: ''
        // model: model,
        // form: _.cloneDeep(model.group),
      };
    },
    watch: {
      group: {
        immediate: true,
        deep: true,
        handler(val) {
          if (val) {
            this.groupContent = val.content && JSON.parse(val.content) || []
            this.groupCode = val.code
          } else {
            this.groupContent = []
            this.groupCode = null
          }
        }
      },
    },
    mounted() {
     // this.UndefaultGroup()
    },
    methods: {
      async init() {
        // let res = await this.search();
      },
      refreshGroup() {
        console.log('..')
        this.$refs['group-tree'].getGroups()
      },
      addGroup() {
        this.$refs['group-tree'].openAdd()
      },
      async handleAll(type) {
        if (type === 'refresh') {
          this.refreshGroup()
        } else if(type === 'all') {
          this.exportZip(type)
        }else if(type === 'addGroup'){
          this.$refs['group-tree'].openAdd()
        }
      },
      async exportZip(type, codeVal) {
        const isAll = type === 'all'
        let query = {}
        if (isAll) {
          query.isAll = isAll
        } else {
          query.code = codeVal
        }
        ajaxUtil.config.responseType = 'blob'
        let resp = null
        if (isAll) {
          resp = await this.dispatch(ComponentCenterController.export, query)
        } else {
          resp = await this.dispatch(ComponentCenterController.download, {
            params: query
          })
        }
        ajaxUtil.config.responseType = 'json'
        if (resp.data) {
          const blob = new Blob([resp.data], { type: 'application/zip,charset=utf-8' })
          FileSaver.saveAs(blob, `${codeVal || 'components'}.zip`)
        }
      }
    },
  };
</script>
<style lang="scss" scoped>
  ::v-deep .secondary-menu {
   height: calc(100vh - 55px) !important;
  }
  ::v-deep .pm-tree {
    height: calc(100vh - 160px) !important;
  }
  .pr-30 {
    padding-right:30px;
  }
  .pb-35 {
    padding-bottom:35px;
  }
  ::v-deep i.el-icon-refresh {
    font-size: 14px !important;
    margin-left: 10px;
  }
  ::v-deep .el-scrollbar__thumb {
    display: none !important;
  }
  .exportAction {
    position: absolute;
    right: 10px;
  }
</style>