<template>
  <div class="pl-20">
    <div class="top-block pt-10 pb-10">
      <div class="float-left pt-5 table-tool-bar ">
        <el-button :class="{'tag-btn-active':activateCode==='all'}" style="margin-right: 0px" round @click="setMailType({code:'all'})">
          全部类型
        </el-button>
        <el-button
          v-for="item in options"
          :key="item.code"
          round
          :class="{ 'tag-btn-active': item.code == activateCode }"
          @click="setMailType(item)"
        >{{ item.name }}</el-button>
      </div>
      <PmSearch
        ref="searchForm"
        style="width: 300px"
        class="float-right pm-search"
        :query.sync="param"
        default-prop="messageTitle"
        placeholder="搜索消息标题"
        @search="changePage"
      >
        <template slot="body">
          <el-form-item label="消息标题" prop="messageTitle">
            <el-input
              v-model="param.messageTitle"
              v-focus
              clearable
              @keypress.native.enter="changePage"
            />
          </el-form-item>
          <el-form-item label="发送时间" prop="startTime">
            <el-date-picker
              v-model="param.startTime"
              style="width: 100%"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              type="daterange"
              placeholder=""
            />
          </el-form-item>
        </template>
      </PmSearch>
      <PmToolbar class="ml-10 float-right" style="margin-right: 0">
        <PmToolbarItem
          plain
          :disabled="selections.length == 0"
          @click="doMark"
        >标记已读</PmToolbarItem>
        <PmToolbarItem
          plain
          :disabled="selections.length == 0"
          @click="remove"
        >批量删除</PmToolbarItem>
      </PmToolbar>
    </div>
    <el-table
      ref="table"
      v-loading="loading"
      size="mini"
      border
      stripe
      :data="gridList"
      height="calc(100vh - 203px)"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
        prop="date"
        label="标题内容"
      >
        <div slot-scope="{ row }">
          <i :class="row.stationStatus === '1'?'el-icon-folder-opened':'el-icon-folder'" />
          <el-link :underline="false" @click="gotoMessage(row)">
            {{ row.messageTitle }}
          </el-link>
        </div>
      </el-table-column>
      <el-table-column prop="name" label="发送时间" width="200px">
        <span slot-scope="{ row }">{{ row.sendTime }}</span>
      </el-table-column>
      <el-table-column prop="address" label="类型" width="200px">
        <template slot-scope="{ row }">
          {{ `${row.dictLabel.parentLabel}-${row.dictLabel.name}` }}
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
    <el-dialog
      append-to-body
      title=""
      :visible.sync="dialogVisible"
      width="80vw"
      top="60px"
      @closed="closed"
    >
      <Mail ref="mail" :message="currentMsg" />
    </el-dialog>
  </div>
</template>

<script>
import { BaseVue, List, VueUtil } from '@lib'
import Mail from './detail.vue'

import {
  StationMessageController,
  DictEntryController,
  DictTypeController,
} from '@controller'
import { cloneDeep } from 'lodash'
export default {
  name: 'mail-list',
  components: { Mail },
  mixins: [BaseVue, List],
  props: {
    stationStatus: {
      default: ''
    }
  },
  data() {
    return {
      activateCode: 'all',
      currentMsg: {}, // 选中的message
      tableData: [],
      options: [],
      param: {
        endTime: '',
        messageTitle: '',
        receiver: '',
        receiverType: '',
        senderName: '',
        senderType: '',
        senderTime: '',
        startTime: '',
        stationParentType: '',
        stationStatus: '',
        stationType: '',
      },
      dicts: [],
      summer: true,
    }
  },
  computed: {
    ...VueUtil(this).select([StationMessageController]).state(),
    loading() {
      return this.StationMessageController
        .queryPersonalStationMessagesByCriteria.loading
    },
  },
  watch: {
    stationStatus: {
      handler(val) {
        this.changePage()
      }
    }
  },
  async mounted() {
    await this.initDict()
    await this.search()
  },
  methods: {
    resetQuery() {
      this.query.limit = 10
    },
    // 弹窗关闭后更新列表
    closed() {
      if (this.currentMsg.stationStatus === '0') {
        this.search()
      }
    },
    async removeBody() {
      return await this.dispatch(StationMessageController.deleteBatch, {
        ids: this.selections.map((item) => {
          return item.id
        }),
      })
    },
    removeSuccess() {
      if (this.stationStatus === '0') {
        this.$emit('updateCount')
      }
    },
    async doMark() {
      let ids = []
      ids = this.selections.map((item) => {
        return item.id
      })
      const resp = await this.dispatch(StationMessageController.haveRead, {
        ids,
      })
      if (!resp.error) {
        this.changePage()
        this.$emit('updateCount')
      }
    },
    // 根据消息一级类型查询
    setMailType(item) {
      this.activateCode = item.code
      this.param.stationParentType = item.code === 'all' ? null : item.code
      this.search()
    },
    // 初始化字典
    async initDict() {
      // 查询一级消息
      const resp = await this.dispatch(
        DictTypeController.queryDictTypesByCriteria,
        {
          code: 'mail_type',
          tenantId: this.currentTenant,
        }
      )
      if (!resp.error) {
        const mail = resp.data.data[0]
        const sub = await this.dispatch(
          DictTypeController.queryDictTypesByCriteria,
          {
            parentId: mail.id,
            tenantId: this.currentTenant,
          }
        )
        if (!sub.error) {
          // 组装二级消息
          this.options = sub.data.data
          const dictbyids = sub.data.data.reduce((org, current) => {
            const result = current.dictEntrys.reduce((pre, item) => {
              pre[item.code] = { name: item.name, parentLabel: current.name }
              return pre
            }, {})
            return Object.assign(org, result)
          }, {})
          // 二级消息赋值
          this.dicts = dictbyids
        }
      }
    },
    async searchBody() {
      const param = cloneDeep(this.param)
      if (this.param.startTime && this.param.startTime.length > 1) {
        param.startTime = this.param.startTime[0]
        param.endTime = this.param.startTime[1]
      }
      param.stationStatus = this.stationStatus
      const resp = await this.dispatch(
        StationMessageController.queryPersonalStationMessagesByCriteria,
        {
          ...param,
          pageIndex: this.query.offset - 1,
          pageSize: this.query.limit,
        }
      )
      if (!resp.error) {
        resp.data.data.forEach((item) => {
          item.dictLabel = this.dicts[item.stationType]
        })
        return resp
      }
    },
    gotoMessage(row) {
      // 数据改为已读
      if (row.messageOpenType === 'url') {
        if (this.currentMsg.stationStatus === '0') {
          this.dispatch(StationMessageController.haveRead, {
            ids: [this.currentMsg.id],
          })
        }
        window.open(row.messageUrl, '_blank')
      } else {
        this.$emit('showMessage', true)
        if (
          row.messageOpenType === 'popover' ||
            row.messageOpenType === 'url_popover'
        ) {
          this.currentMsg = { ...row }
          this.dialogVisible = true
          this.$nextTick(() => {
            this.$refs['mail'].readMail()
          })
        } else {
          this.goto({
            title: '消息',
            name: 'Detail',
            props: {
              message: row,
            },
          })
        }
        this.$emit('updateCount')
      }
    },
  },

}
</script>

<style scoped>

</style>
