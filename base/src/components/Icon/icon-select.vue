<template>
  <div class="pm-icon-select">
    <div v-if="!apiDialog">
      <el-input
        :read-only="true"
        :value="exactName"
        :placeholder="placeholder"
        clearable
        @change="clearValue"
      >
        <div v-if="exactValue && showPrepend" slot="prepend" class="f-18">
          <el-tooltip
            :enterable="false"
            :open-delay="200"
            effect="dark"
            :content="exactName"
            placement="bottom-start"
          >
            <i v-if="iconType === 'ele'" :class="exactValue" />
            <i
              v-else-if="iconType === 'font'"
              :class="'iconfont icon-' + exactValue"
            />
            <img
              v-else
              fit="scale-down"
              :src="svgUrl(exactValue, 'svg', 'icon')"
              style="width: 18px; height: 18px"
            >
          </el-tooltip>
        </div>
        <div v-else-if="text" slot="prepend">{{ text }}</div>
        <el-button
          v-if="!disabled"
          slot="append"
          type="text"
          icon="el-icon-search"
          @click.stop="showSelect"
        />
      </el-input>
      <transition name="el-zoom-in-top">
        <div v-if="mode !== 'dialog'" v-show="showOptions" class="drop-section">
          <i class="popper_arrow" />
          <div ref="scroll" class="drop-down scroll">
            <el-button
              v-for="(group, index) in groupList"
              :key="group.id"
              round
              :class="{ 'tag-btn-active': group.id === activeName }"
              style="margin-bottom: 5px; height: 32px"
              @click="changeGroup(g)"
            >{{ group.name }}</el-button>
            <keep-alive>
              <IconTab
                v-model="exactValue"
                :group="group"
                :api-prefix="apiPrefix"
                :content="group.content"
              />
            </keep-alive>
          </div>
        </div>
      </transition>
    </div>
    <el-dialog
      v-if="mode === 'dialog' || apiDialog"
      title="图标"
      width="600px"
      :visible.sync="showOptions"
      :append-to-body="true"
      @close="hiddSelect"
    >
      <div>
        <div class="table-tool-bar">
          <el-button
            v-for="(g, index) in groupList"
            :key="g.id"
            round
            :class="{ 'tag-btn-active': g.id === activeName }"
            style="margin-bottom: 5px; height: 32px"
            @click="changeGroup(g)"
          >{{ g.name }}</el-button>
          <el-input
            v-model="keywords"
            placeholder="图标关键字"
            clearable
          />
        </div>
        <keep-alive>
          <IconTab
            v-model="value"
            :group="group"
            :api-prefix="apiPrefix"
            :keywords="keywords"
            :content="group.content"
            @select="selectSvg"
          />
        </keep-alive>
        <div v-show="!groupList.length" class="null">
          <i class="el-icon-document" />
          <p class="f-14">没有符合条件的图标</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import IconTab from './icon-tab.vue'
import model from './model'

const iconList = []
import('@/assets/iconfont/message.json').then((json) => {
  json.list.forEach((item, index) => {
    iconList.push([])
    import(
      '@/assets/iconfont/resources/' + item.fileName + '/iconfont.json'
    ).then((file) => {
      iconList[index] = file.glyphs
    })
  })
})
export default {
  name: 'icon-select',
  components: { IconTab },
  mixins: [model],
  props: {
    value: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    mode: {
      // 默认弹窗模式，传入其他任意值为下拉模式
      type: String,
      default: 'dialog',
    },
    placeholder: {
      type: String,
      default: '',
    },
    apiPrefix: {
      type: String,
      default: '/afc',
    },
    showPrepend: {
      type: Boolean,
      default: true,
    },
    text: {
      type: String,
      default: '',
    },
    apiDialog: {
      // 仅使用弹框
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showOptions: false,
      keywords: '',
      groupList: [],
      activeName: '',
      iconList: iconList,
      group: {},
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
    iconType() {
      if (!this.value || this.value.startsWith('el-icon-')) {
        return 'ele'
      } else if (this.value.indexOf(',') === -1) {
        return 'font'
      } else if (this.value.split(',').length) {
        return this.value.split(',')[2]
      }
    },
    exactName() {
      if (this.value && this.value.indexOf(',') !== -1) {
        return this.iconType === 'font'
          ? this.value.split(',')[0]
          : this.value.split(',')[1]
      } else {
        return this.value || ''
      }
    },
    exactValue: {
      get() {
        if (this.value && this.value.indexOf(',') !== -1) {
          console.log(this.value.split(',')[0], 'this.value.split(', ')[0]====')
          return this.value.split(',')[0]
        } else {
          return this.value || ''
        }
      },
      set(val) {
        // if (!val) {
        //   this.$emit('input', '')
        // }
      },
    },
  },
  watch: {
    showOptions: {
      immediate: true,
      handler(val) {
        if (this.mode === 'dialog' && val) {
          this.getGroups()
        } else if (!val) {
          this.keywords = ''
        }
      },
    },
  },
  created() {},
  mounted() {
    if (this.iconType === 'font' && this.value.indexOf(',') !== -1) {
      this.dynamicLoadCss(this.cssLoadUrl(this.value.split(',')[1]))
    }
    if (this.mode !== 'dialog') {
      this.getGroups()
      document.body.addEventListener('click', this.hiddSelect)
    }
  },
  beforeDestroy() {
    if (this.mode !== 'dialog') {
      document.body.removeEventListener('click', this.hiddSelect)
    }
  },
  methods: {
    async getGroups() {
      console.log('查询分组')
      const res = await this.dispatchProxy(
        Vue.prototype.Controllers.MaterialGroupController
          .queryMaterialGroupWithPage,
        {
          materialType: 'icon',
          pageIndex: 0,
          pageSize: -1,
        }
      )
      if (!res.error) {
        const group = this.iconList.map((arr, index) => {
          return {
            id: 'icon-group' + (index + 1),
            name: '系统分组' + (index + 1),
            type: 'system',
            content: arr,
          }
        })
        this.$set(this, 'groupList', group.concat(res.data.data))
        if (
          !this.activeName ||
          (this.groupList &&
            this.groupList.every((i) => i.id !== this.activeName))
        ) {
          if (this.groupList.length) {
            this.activeName = this.groupList[0].id
            this.group = this.groupList[0]
          }
        }
      }
    },
    getPath(url) {
      return url.split('icon-')[1]
    },
    selectSvg(value) {
      this.$emit('input', value)
      this.$emit('change', value)
      this.hiddSelect()
    },
    showSelect() {
      this.showOptions = true
    },
    hiddSelect() {
      this.showOptions = false
    },
    clearValue() {
      this.$emit('input', '')
      this.$emit('change', '')
    },
    changeGroup(group) {
      this.activeName = group.id
      this.group = group
    },
  },
}
</script>
<style lang="scss" scoped>
@import "~@/assets/iconfont/iconfont.css";
::v-deep .el-dialog__body {
  padding-top: 0;
}

section {
  max-height: 400px;
  overflow: auto;
  min-height: 300px;
  .null {
    text-align: center;
    opacity: 0.6;
    padding-top: 50px;
    i {
      font-size: 80px;
    }
  }
}
.pm-icon-select {
  position: relative;

  .iconfont {
    font-size: 20px;
  }
  .drop-section {
    position: absolute;
    z-index: 999;
    i {
      position: absolute;
      top: -2px;
      left: 20px;
      display: block;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
      border-top-width: 0;
      border-bottom-color: #ebeef5;
      border-width: 6px;
      &::after {
        content: " ";
        display: block;
        border-width: 6px;
        width: 0;
        height: 0;
        position: absolute;
        top: 1px;
        border-color: transparent;
        border-style: solid;
        margin-left: -6px;
        border-top-width: 0;
        border-bottom-color: #fff;
      }
    }
    .drop-down {
      margin-top: 10px;
      border: 1px solid #ebeef5;
      max-height: 200px;
      overflow: auto;
      background-color: #fff;
      width: 412px;
      border-radius: 4px;
      padding: 10px 0;
      .icon-item-drop {
        float: left;
        box-sizing: border-box;
        border-radius: 0;
        border: none;
      }
    }
  }
  ::v-deep .el-input-group__append {
    text-align:center !important;
  }
}
.scroll::-webkit-scrollbar-thumb {
  border-radius: 4px;
  width: 6px;
}
</style>
