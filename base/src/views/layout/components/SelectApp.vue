<template>
  <div class="custom-select-app-box" v-if="currentApp">
    <!-- <div class="icon-box">
      <pm-icon v-if="iconJSON && iconJSON.value" :value="iconJSON.value" :color="iconJSON.color"></pm-icon>
    </div> -->
    <span :title="currentApp.name">{{ currentApp.name }}</span>
    <!-- <el-select v-if="appList.length" popper-class="custom-select" :value="currentApp.id" placeholder="请选择应用" @change="handleChangeApp" filterable>
      <el-option v-for="item in appList" :key="item.name" :label="item.name" :value="item.id"></el-option>
    </el-select> -->
  </div>
</template>
<script>
import { getQueryVariable } from '@/utils/tools'
import { AppController } from '@controller'
import { BaseVue } from '@lib'
import { debounce } from 'lodash'
export default {
  mixins: [BaseVue],
  data() {
    return {
      appList: [],
      originList: [],
      currentApp: {},
      isLoading: false,
      searchForm: {
        pageSize: -1,
        pageIndex: 0,
        name: '',
        tenantId: this.currentTenant,
      },
    }
  },
  computed: {
    iconJSON() {
      if (this.currentApp && this.currentApp.extra) {
        const { color, appIcon } = JSON.parse(this.currentApp.extra)
        return {
          color,
          value: appIcon,
        }
      }
      return null
    },
  },
  async mounted() {
    await this.getAppList()
    this.originList = this.appList
    const appId = getQueryVariable('appId')
    this.currentApp = this.appList.filter(item => item.id === appId)[0]
  },
  methods: {
    // 当用户修改关键词
    handleChangeKeyWord: debounce(async function (value) {
      this.searchForm.name = value
      await this.getAppList()
    }, 300),
    // 当用户点击修改app
    async handleChangeApp(value) {
      this.currentApp = this.appList.filter(item => item.id === value)[0]
      await this.$router.push({
        path: '/appMenu',
        query: {
          appId: value,
        },
      })
      location.reload()
    },
    // 当关闭下拉框时清空val,恢复初始化列表
    reset(isVisible) {
      if (!isVisible) {
        // 重置appList列表
        this.searchForm.name = ''
        this.appList = this.originList
      }
    },
    // 获取应用列表
    async getAppList() {
      try {
        this.isLoading = true
        const {
          data: { data = [] },
        } = await this.dispatch(AppController.queryWidgetAppsByCriteria, this.searchForm)
        this.appList = data
      } catch (err) {
        console.log('err:', err)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
<style lang="scss">
.custom-select-app-box {
  display: flex;
  align-items: center;
  width: auto;
  min-width: 101px;
  max-width: 200px;
  color: #fff;
  font-size: 18px;
  span {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .icon-box {
    margin: 0 0 0 10px;
    width: 20px;
    font-size: 24px;
    display: flex;
    align-items: center;
  }
  .el-select > .el-input input,
  .el-input__inner:hover,
  .el-input__inner:focus,
  .el-select .el-input.is-focus .el-input__inner {
    background: transparent !important;
    color: #fff !important;
    border: none;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 18px;
  }
}
</style>
