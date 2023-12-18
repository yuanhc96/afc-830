<template>
  <div class="pl-20">
    <el-tabs v-model="typeId">
      <el-tab-pane
        v-for="item in tabsData"
        :label="item.name"
        :name="item.code"
        :key="item.code"
        lazy
      >
        <span slot="label" style="margin-left: -20px">
          <i :class="item.icon"></i> {{ item.name }}
        </span>
        <GroupTabs :ref="typeId" :type-id="typeId" />
      </el-tab-pane>
    </el-tabs>
    <div class="operate-buttons">
      <div class="top-block">
        <PmToolbar class="ml-10">
        <PmToolbarItem plain @click="handleExport(typeId)"        
          >导出{{
            tabsData.filter((item) => item.id === typeId)[0].name
          }}</PmToolbarItem
        >

        <PmToolbarGroup>
          <PmToolbarItem
            plain
            icon="el-icon-download"
            @click="handleExport('all')"
            >导出全部素材库</PmToolbarItem
          >
        </PmToolbarGroup>
      </PmToolbar>
      </div>
     
    </div>
    <GroupForm
      :dialog-visible.sync="dialogVisible"
      :typeId="typeId"
      @success="success"
    ></GroupForm>
  </div>
</template>
<script>
import { SourceMaterialController } from "@controller"
import { BaseVue, Form } from "@lib"
import ajaxUtil from "@lib/ajaxUtil"
import moment from "dayjs"
import FileSaver from "file-saver"
import GroupTabs from "./group-tabs.vue"
import TypeTree from "./tree.vue"
import GroupForm from "./group/form.vue"
import { MaterialGroupController } from "@controller"
// import model from "./model.js";
export default {
  components: { TypeTree, GroupTabs, GroupForm },
  mixins: [BaseVue, Form],
  props: {
    data: {},
  },
  data() {
    return {
      TEXT: {
        subgroup: "新建分组",
        editgroup: "编辑分组",
      },
      dialogVisible: false,
      formType: null,
      selectGroup: {},
      groupId: null,
      typeId: "icon",
      tabsData: [
        {
          name: "图标",
          id: "icon",
          code: "icon",
          icon: "el-icon-menu",
        },
        {
          name: "图片",
          id: "image",
          code: "image",
          icon: "el-icon-picture-outline",
        },
        {
          name: "附件",
          id: "attachment",
          code: "attachment",
          icon: "el-icon-folder",
        },
      ],
      dialogVisible: false,
    }
  },
  watch: {},
  mounted() {},
  methods: {
    async handleExport(type) {
      const types = type === "all" ? null : type
      ajaxUtil.config.responseType = "blob"
      const resp = await this.dispatch(
        SourceMaterialController.exportMaterials,
        {
          isAll: type === "all",
          types,
        }
      )
      ajaxUtil.config.responseType = "json"
      console.log(resp, "====resp")
      if (resp.data) {
        const blob = new Blob([resp.data], {
          type: "application/zip,charset=utf-8",
        })
        FileSaver.saveAs(blob, `${moment().format("YYYY-MM-DD")}-素材.zip`)
      }
    },

    refresh() {
      const refObject = {
        icon: 0,
        image: 1,
        attachment: 2,
      }
      this.$refs[this.typeId][refObject[this.typeId]].getGroups()
    },
    async validateResolve() {
      let resp = {}
      if (this.formType === "add") {
        resp = await this.dispatch(MaterialGroupController.create, {
          payload: {
            materialGroup: {
              ...this.form,
              materialType: this.value,
            },
          },
        })
        this.cancel()
      } else if (this.formType === "edit") {
        resp = await this.dispatch(MaterialGroupController.update, {
          payload: {
            resGroup: this.form,
          },
        })
      }
      this.$emit("update:loading", false)
      if (!resp.error) {
        this.successMessage("保存成功!")
        this.refresh()
        return true
      } else {
        return false
      }
    },
    openAdd(data) {
      this.dialogVisible = true
      this.formType = "add"
    },
    success() {
      this.refresh()
    },
  },
}
</script>
<style lang="scss" scoped>
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
::v-deep .el-scrollbar__thumb {
  display: none !important;
}
.exportAction {
  position: absolute;
  right: 10px;
}
.operate-buttons {
  position: fixed;
  top: 55px;
  right: 20px;
  .top-block{
    padding:0;
  }
}
.el-tabs__nav-wrap {
  display: flex;
  justify-content: center;
}
</style>
