<template>
  <div class="tabs_container">
    <div class="mt-10 mb-10" :style="`width:${tagList}`">
      <el-tooltip
        class="item"
        effect="dark"
        :content="tooltipContent"
        placement="top"
      >
        <el-button
          class="fl add-group"
          icon="el-icon-plus"
          circle
          @click="openAdd('add')"
        ></el-button>
      </el-tooltip>
      <div class="tag-btn" v-for="g in groups" :key="g.id">
        <el-button
          round
          :class="{ 'tag-btn-active': g.id === activeName }"
          style="margin-bottom: 5px; height: 32px"
          @click="changeGroup(g)"
          >{{ g.name }}</el-button
        >
        <div v-if="g.type !== 'system'" class="edit-icon-group">
          <div><i class="el-icon-edit" @click="editTab(g)"></i></div>
          <div><i class="el-icon-delete" @click="tabRemove(g.id)"></i></div>
        </div>
      </div>
    </div>
    <br class="clear" />
    <keep-alive>
      <IconList
        v-if="typeId === 'icon'"
        :typeId="typeId"
        :groupId="activeName"
        :currentGroupCode="currentGroupCode"
        :content="group.content"
      />
      <ImageList
        v-else-if="typeId === 'image'"
        :groupId="activeName"
        :currentGroupCode="currentGroupCode"
      />
      <AttachmentList
        v-else-if="typeId === 'attachment'"
        :groupId="activeName"
        :currentGroupCode="currentGroupCode"
      />
    </keep-alive>
    <no-data v-if="!groups.length" class="no_data" slot="empty" />
    <GroupForm
      :dialog-visible.sync="dialogVisible"
      :typeId="typeId"
      :formData.sync="currentGroup"
      @success="getGroups"
    ></GroupForm>
  </div>
</template>
<script>
import { MaterialGroupController } from "@controller"
import { BaseVue, Form } from "@lib"
import AttachmentList from "./group/attachment.vue"
import IconList from "./group/icon.vue"
// import ImageList from './group/image1.vue'
import GroupForm from "./group/form.vue"
import ImageList from "./group/image.vue"
import model from "./group/model.js"
let iconLists = []
import("@/assets/iconfont/message.json").then((json) => {
  json.list.forEach((item, index) => {
    iconLists.push([])
    import(
      "@/assets/iconfont/resources/" + item.fileName + "/iconfont.json"
    ).then((file) => {
      iconLists[index] = file.glyphs
    })
  })
})
export default {
  components: { AttachmentList, IconList, ImageList, GroupForm },
  mixins: [BaseVue, Form, model],
  props: {
    typeId: {
      type: String,
      default: "icon",
    },
  },
  data() {
    return {
      groups: [],
      activeName: "",
      dialogVisible: false,
      currentGroup: {},
      fileList: [],
      iconLists: iconLists,
      group: {},
      fileData: [],
    }
  },
  computed: {
    currentGroupCode() {
      const currentGroup = this.groups.filter((i) => i.id === this.activeName)
      return currentGroup.length ? currentGroup[0].code : null
    },
    tooltipContent() {
      return `新建${this.typeId === "icon" ? "svg" : ""}分组`
    },
    tagList(){
      return this.group.type !== 'system' ? ( this.typeId === 'attachment' ? 'calc(100% - 500px)' : 'calc(100% - 100px)'): '100%'
    }
  },
  watch: {
    // 分类变化，分组改变
    typeId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.activeName = null
          this.getGroups()
        }
      },
    },
  },
  mounted() {},
  methods: {
    async init() {
      // let res = await this.search();
    },
    openReName(g) {
      this.dialogVisible = true
    },
    //查询分组
    async getGroups() {
      const res = await this.dispatch(
        MaterialGroupController.queryMaterialGroupWithPage,
        {
          materialType: this.typeId,
          pageIndex: 0,
          pageSize: -1,
        }
      )
      if (!res.error) {
        if (this.typeId === "icon") {
          const group = this.iconLists.map((arr, index) => {
            return {
              id: "icon-group" + (index + 1),
              name: "系统分组" + (index + 1),
              type: "system",
              content: arr,
            }
          })

          this.$set(this, "groups", group.concat(res.data.data))
        } else {
          this.$set(this, "groups", res.data.data)
        }
        if (
          !this.activeName ||
          (this.groups && this.groups.every((i) => i.id !== this.activeName))
        ) {
          if (this.groups.length) {
            this.activeName = this.groups[0].id
            this.group = this.groups[0]
          }
        }
      }
    },
    openAdd(formType, e) {
      this.dialogVisible = true
      this.formType = formType
      if (formType === "editgroup") {
        this.selectGroup = e.data
      }
    },
    async tabRemove(targetName) {
      if (targetName.startsWith("icon-group")) {
        this.$msg.error("系统分组不允许删除！")
        return
      }
      let title = "是否确认删除此分组?"
      await this.getData(targetName)
      console.log(this.fileData, "this.fileData")
      if (this.fileData && this.fileData.length) {
        title = "此分组下存在资源，是否确认删除此分组？"
      }
      this.$confirm(title, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const resp = await this.dispatch(MaterialGroupController.delete, [
            targetName,
          ])
          console.log(!resp.error, "================resp")
          if (!resp.error) {
            this.successMessage("删除成功!")
            //TODO 如果当前tab是active，需要换一个
            await this.getGroups()
          }
        })
        .catch(() => {})
    },
    editTab(group) {
      this.dialogVisible = true
      this.currentGroup = group
    },
    changeGroup(group) {
      this.activeName = group.id
      this.group = group
    },
  },
}
</script>
<style lang="scss" scoped>
.el-popover,
.el-popper {
  min-width: 0;
}
.el-tag:hover {
  cursor: pointer;
}
.el-icon-delete:hover,
.el-icon-edit:hover {
  color: #3b69b6;
}
.group-button {
  margin-top: 10px;
}
.tabs_container {
  position: relative;
}
.group_item {
  line-height: 47px;
}
.group_title {
  // width: 65px;
  // line-height: 15px;
  // display: inline-block;
  // text-align: center;
  // overflow: hidden;
  // text-overflow: ellipsis;
}
::v-deep .el-tabs__content {
  height: calc(100vh - 95px);
  overflow: auto;
}

::v-deep .el-tabs__item.is-top {
  .action_btn {
    width: 0px;
    display: none;
    // z-index: 1000;
  }
  &:hover {
    .action_btn {
      width: 14px;
      display: inline-block;
    }
  }
}
.no_data {
  position: absolute;
  top: 30%;
  left: 40%;
}
.edit-icon {
  text-align: center;
}
.tag-list {
  width: calc(100% - 100px);
}
.clear {
  clear: both;
}
.add-group {
  margin-right: 5px;
  height:32px !important;
  width:32px !important;
  padding: 7px;
}
</style>
