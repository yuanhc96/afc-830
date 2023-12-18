<template>
  <span>
    <el-tooltip content="站内消息">
      <el-badge :hidden="mailCount===0" class=" item mail-bell-badge" is-dot >
        <i class="el-icon-bell message-bell" @click="goMessage(false)" />
      </el-badge>
    </el-tooltip>
    <!--      </span>-->
    <!--    </el-popover>-->
    <el-dialog
      v-if="currentMsg"
      append-to-body
      title=""
      :visible.sync="dialogVisible"
      width="80vw"
      class="maildialog"
      :style="{
        height: currentMsg.messageOpenType == 'url_popover' ? '60vh' : 'auto',
      }"
    >
      <div>
        <Mail :message="currentMsg" />
      </div>
    </el-dialog>
    <MailDialog ref="mail-dialog" :inner-msg-id="innerMsgId" @updateCount="getMailCount" />
  </span>
</template>

<script>

const MailType = {
  BLANK: '_blank', // 新标签页
  URL: 'url', // url 打开新窗口
  POPOVER: 'popover', // 打开弹窗
  URL_POP: 'url_popover', // url打开弹窗
}

import Mail from '@/views/afcenter/mail/detail'
import { StationMessageController } from '@controller'
import { VueUtil } from '@lib'
import { mapGetters, mapMutations } from 'vuex'
import MailDialog from '@/views/afcenter/mail/index.vue'
export default {
  name: '',
  components: { Mail, MailDialog },
  props: {},
  data() {
    return {
      mailStation: null,
      mailList: [],
      mailCount: 0,
      currentMsg: null,
      dialogVisible: false,
      innerMsgId: null,
    }
  },
  watch: {},
  created() {},
  computed: {
    ...mapGetters(['stationState']),
    ...VueUtil(this).select([StationMessageController]).state(),
    loading() {
      return this.StationMessageController
        .queryPersonalStationMessagesByCriteria.loading
    },
  },
  methods: {
    ...mapMutations({ clearStationState: 'STATION_MAIL_CLEAR', setStationState: 'STATION_MAIL_FULL' }),
    getMailCount({ count, isPopUp }) {
      if (count > 0) {
        this.mailCount = count
        this.setStationState()
        if (isPopUp) {
          const notify = this.$notify.success({
            title: '提醒',
            message: '您有新的消息，请及时处理！',
            onClick: () => {
              this.goMessage()
              notify.close()
            }
          })
        }
      } else {
        this.mailCount = 0
        this.clearStationState()
      }
    },
    selectMsg(item) {
      this.currentMsg = item
      this.goMessage('select')
    },
    async showMail() {
      const resp = await this.dispatch(
        StationMessageController.queryPersonalStationMessagesByCriteria,
        {
          pageSize: 5,
          pageIndex: 0,
          stationStatus: 0,
        }
      )
      if (!resp.error) {
        this.$nextTick(() => {
          debugger
          this.mailList = resp.data.data
        })
      }
    },
    goMessage(type) {
      if (type === 'select') {
        this.innerMsgId = this.currentMsg.id
        if (this.currentMsg.messageOpenType === MailType.POPOVER) {
          this.dialogVisible = true
        } else {
          if (this.currentMsg.messageOpenType === MailType.BLANK) {
            this.$refs['mail-dialog'].openDialog()
          } else if (this.currentMsg.messageOpenType === MailType.URL) {
            this.$refs['mail-dialog'].openDialog()
          } else {
            this.dialogVisible = true
          }
        }
      } else {
        this.$refs['mail-dialog'].openDialog()
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.maildialog {
  ::v-deep .el-container.main_wrap {
    height: 50vh;
  }
  ::v-deep .el-table {
    height: calc(50vh - 200px) !important;
  }
  ::v-deep .el-header {
    background-color: transparent;
  }
  ::v-deep .mail_wrap {
    height: calc(50vh - 200px);
  }
}
::v-deep .mail-bell-badge .el-badge__content.is-fixed{
  top: 16px;
  right: 10px;
}
::v-deep .mail-bell-badge .el-badge__content{
  font-size: 10px;
  line-height: 11px;
}
.message-bell {
  font-size: 18px;
  position: relative;
  top: 4px;
  margin-left: 5px;
  cursor: pointer;
  }
.bell-active {
  color: var(--cb-color-bg-brand, #ff6a00);
}
.bell-poin {
  display: none;
}
.mail-list {
  span,
  time {
    display: block;
  }
  h6 {
    margin-top: 5px;
    margin-bottom: 5px;
    padding-left: 12px;
    padding-right: 12px;
  }
  li {
    padding: 8px 12px;
    cursor: pointer;
    span {
      font-weight: 200;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 200px; /* 指定元素的宽度 */
      margin-top: 2px;
    }

    border-top: 1px solid #ebebeb;
  }
}
</style>
<style>
.popover-mail {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
