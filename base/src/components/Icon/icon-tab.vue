<template>
  <div class="icon-tab">
    <div class="item" v-for="(icon, index) in iconMap" :key="index">
      <div
        :class="
          icon && icon.code === value
            ? 'icon-item icon-item-drop icon-item-active'
            : 'icon-item-drop icon-item'
        "
        @click="selectSvg(icon.code, icon.name)"
      >
        <el-tooltip
          :enterable="false"
          :open-delay="200"
          effect="dark"
          :content="icon.name"
          placement="bottom-start"
        >
          <span v-if="iconType !== 'svg'" style="height: 35px; width: 35px">
            <i :class="'iconfont icon-' + icon.code" />
          </span>
          <img v-else fit="scale-down" :src="svgUrl(icon.code)" />
        </el-tooltip>
      </div>
    </div>
    <div v-show="!iconMap.length" class="text-null">
      <p class="f-14" style="te">无数据</p>
    </div>
  </div>
</template>

<script>
import { HtmlUtil } from "@lib"
import model from "./model"

export default {
  name: "PmSelectIcon",
  mixins: [model],
  props: {
    value: {
      type: String,
    },
    group: {
      type: Object,
      default: () => {},
    },
    apiPrefix: {
      type: String,
      default: "/afc",
    },
    keywords: {
      type: String,
      default: "",
    },
    content: {
      type: Array | undefined,
    },
  },
  data() {
    return {
      activeName: "",
      iconList: [],
    }
  },
  computed: {
    dispatchProxy() {
      if (Vue.prototype.dispatchProxy) {
        return Vue.prototype.dispatchProxy(this)
      } else {
        return this.dispatch
      }
    },
    // 当前分组是font 还是svg
    iconType() {
      if (this.content) {
        return "system"
      } else if (!this.iconList.length || this.iconList[0].iconType === "svg") {
        return "svg"
      } else {
        return "font"
      }
    },
    iconMap() {
      return this.iconList.filter(
        (icon) => icon.name.indexOf(this.keywords) !== -1
      )
    },
  },
  watch: {
    content: {
      immediate: true,
      deep: true,
      async handler(val) {
        if (val) {
          this.iconList = val.map((icon) => {
            return {
              ...icon,
              code: icon.font_class,
              showAction: false,
            }
          })
        } else {
          if (this.group.id) {
            await this.getData()
          }
          if (this.iconType === "font" && !val) {
            // css的接口
            HtmlUtil.dynamicLoadCss(this.cssLoadUrl(this.group.code))
          }
        }
      },
    },
    "group.id": {
      immediate: true,
      async handler(val) {
        if (val && !this.content) {
          await this.getData()
          if (this.iconType === "font") {
            // css的接口
            HtmlUtil.dynamicLoadCss(this.cssLoadUrl(this.currentGroupCode))
          }
        }
      },
    },
  },
  created() {},
  async mounted() {
    // 根据分组获取素材信息
    if (this.content) {
      this.iconList = this.content.map((icon) => {
        return {
          ...icon,
          code: icon.font_class,
          showAction: false,
        }
      })
    } else {
      if (this.group.id) {
        await this.getData()
      }
      if (this.iconType === "font" && !this.content) {
        // css的接口
        HtmlUtil.dynamicLoadCss(this.cssLoadUrl(this.group.code))
      }
    }
  },
  beforeDestroy() {},
  methods: {
    fileUrl(id) {
      // return `${appConfig.apiPrefix.path}/api/lowcode/models/attachments/${id}/actions/download`
      return `${this.apiPrefix}/api/lowcode/models/attachments/${id}/actions/download`
    },
    async getData() {
      const resp = await this.dispatchProxy(
        Vue.prototype.Controllers.SourceMaterialController
          .querySourceMaterialByCriteria,
        {
          materialGroupId: this.group.id,
          types: "icon",
        }
      )
      if (!resp.error) {
        const data = resp.data || []
        if (data.some((file) => file.name.endsWith(".json"))) {
          const arr = data.filter((file) => file.name.endsWith(".json"))
          this.iconList =
            arr[0] &&
            arr[0].font_class.map((icon) => {
              return {
                code: icon,
                name: icon,
                iconType: "font",
              }
            })
        } else {
          this.iconList = data
        }
      }
    },
    getPath(url) {
      return url.split("icon-")[1]
    },
    selectSvg(code, name) {
      // font: code/name,groupCode,iconType
      // svg: code,name,iconType
      if (this.iconType === "font") {
        this.$emit("select", code + "," + this.group.code + "," + this.iconType)
      } else if (this.iconType === "svg") {
        this.$emit("select", code + "," + name + "," + this.iconType)
      } else {
        this.$emit("select", code)
      }
    },
    clearValue() {
      this.$emit("input", "")
    },
  },
}
</script>
<style lang="scss" scoped>
.scroll::-webkit-scrollbar-thumb {
  border-radius: 4px;
  width: 6px;
}
.icon-tab {
  height: 400px;
  overflow-y: auto;
  .item {
    padding-top: 10px;
    position: relative;
    float: left;
    margin: 0 5px 5px 5px;
    text-align: center;
    i {
      font-size: 35px;
    }
    .icon-item {
      width: 40px;
      height: 40px;
      border: 1px dashed #dcdfe6;
      text-align: center;
      font-size: 24px;
      border-radius: 4px;
      line-height: 45px;
      cursor: pointer;
      i {
        font-size: 28px;
      }
      img {
        width: 20px;
        height: 20px;
        &:hover {
          width: 28px;
          height: 28px;
        }
      }
      &-active {
        i {
          color: #409eff;
        }
      }
      &:hover {
        i {
          font-size: 30px;
          // color: #409EFF;
        }
      }
    }
  }
  .text-null{
    text-align:center;
  }
}
</style>
