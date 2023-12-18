<template>
  <el-dialog
    title="站内消息"
    :visible.sync="dialogVisible"
    :fullscreen="true"
    append-to-body
  >
    <div>
      <PmSecondaryMenu :offset-height="20" :right-title="false" :show-title="false">
        <div slot="left-body">
          <el-tree
            ref="tree"
            class="tree mt-10"
            :props="treeProps"
            :data="menus"
            highlight-current
            node-key="index"
            current-node-key="1"
            @node-click="handlerNodeClick"
          >
            <TreeNode slot-scope="{ node,data }">
              <template slot="label">
                <span> {{ node.label }}</span>
                <div v-if="data.index == '1' && mailCount>0" class="tip-count">{{ mailCount }}</div>
              </template>
            </TreeNode>
          </el-tree>
        </div>
        <div slot="right-body">
          <MailList :station-status="stationStatus" @updateCount="getMailCount" />
        </div>
      </PmSecondaryMenu>
    </div>
  </el-dialog>
</template>
<script>
import MailList from './list.vue'
import Detail from './detail.vue'
import { StationMessageController } from '@controller'
import { mapMutations } from 'vuex'
export default {
  components: { MailList, Detail },
  provide() {
    return {
      updateCount: this.getMailCount
    }
  },
  props: {
    innerMsgId: {
      default: null
    }
  },
  data() {
    return {
      showToolbar: false,
      treeProps: {
        label: 'label',
        isLeaf: 'leaf',
      },
      menus: [
        { index: '0', label: '全部消息', leaf: true, stationStatus: '' },
        { index: '1', label: '未读消息', leaf: true, stationStatus: '0' },
        { index: '2', label: '已读消息', leaf: true, stationStatus: '1' },
      ],
      mailCount: 0,
      mailStation: null,
      dialogVisible: false,
      stationStatus: '0',
    }
  },
  created() {
    const _getMailCount = this.getMailCount.bind(this)
    _getMailCount()
    this.mailStation = window.setInterval(() => {
      _getMailCount()
    }, 60 * 1000)
  },
  mounted() {
    if (this.innerMsgId) {
      this.dispatch(StationMessageController.queryStationMessageDetailById, {
        id: this.innerMsgId,
      }).then(({ data }) => {
        this.$refs['nav'].goto({
          name: 'Detail',
          title: '消息',
          props: {
            message: data,
          },
        })
      })
    }
  },
  methods: {
    ...mapMutations({ clearStationState: 'STATION_MAIL_CLEAR', setStationState: 'STATION_MAIL_FULL' }),
    openDialog() {
      this.dialogVisible = true
    },
    getMailCount() {
      let truck = {}
      this.dispatch(StationMessageController.queryPersonalUnreadStationMessages)
        .then(({ data: { count, isPopUp }}) => {
          if (count > 0) {
            this.mailCount = count
            this.setStationState()
          } else {
            this.mailCount = 0
            this.clearStationState()
          }
          truck = { count, isPopUp }
          this.$emit('updateCount', truck)
        })
    },
    showMessage(val) {
      this.showToolbar = val
    },
    handlerNodeClick(node) {
      this.stationStatus = node.stationStatus
    },
  },
  beforeDestroy() {
    if (this.mailStation) {
      window.clearInterval(this.mailStation)
    }
  },
}
</script>
<style lang="scss" scoped>
  .tip-count {
    display: inline-block !important;
    padding: 3px;
    min-width: 20px;
    font-size: 0.75rem;
    font-weight: 400;
    color: #fff;
    background-color: #f14f46;
    line-height: 14px;
    text-align: center;
    border-radius: 10px;
  }
</style>
