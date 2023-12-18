<template>
  <el-dialog v-if="ifShow" :visible.sync="dialogVisible" close-on-click-modal :title="title" append-to-body width="800px" @closed="close">
    <div v-show="!isRole">
      <el-tabs v-model="activeName" :before-leave="beforeLeaveHandle" @tab-click="handleClick">
        <template v-for="item in partyTypes">
          <el-tab-pane v-if="item.code=='position'||item.code=='org'||item.code=='user'||item.code=='emp'" :key="item.code" :label="item.name" :name="item.code">
            <SelectOrg v-if="hackReset" :ref="item.code" :position-search="positionSearch" :flag="flag" :type="item.code" :is-multiple="isMultiple" :dict-type="dictType" @change="changeSelect" />
          </el-tab-pane>
          <el-tab-pane v-else :key="item.code" :label="item.name" :name="item.code">
            <SelectWorkGroup v-if="hackReset" :ref="item.code" :type="item.code" :is-multiple="isMultiple" :dict-type="dictType" @change="changeSelect" />
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button v-if="isNext" type="primary" @click="nextStep">下一步</el-button>
      <el-button v-else v-loading="AuthManagerController.handlePartyAuth.loading" type="primary" @click="sure">确 定</el-button>
    </div>
    <add-role v-if="isRole" :business-obj-id="businessObjId" :visible.sync="isRole" show-preview="true" @previewStep="previewStep" @success="handleSuccess" @cancel="cancel" />
  </el-dialog>
</template>

<script>
import { BaseVue, Form, List, VueUtil } from '@lib'
import addRole from '../../../afcenter/user/components/roleComponent/components/index.vue'
import SelectOrg from './member-org.vue'
import SelectWorkGroup from './member-user.vue'

import { DictTypeController } from '@controller'
import { mapGetters } from 'vuex'
export default {
  name: 'member-form',
  components: { SelectWorkGroup, SelectOrg, addRole },
  mixins: [BaseVue, Form, List],
  computed:{
    ...VueUtil(this)
      .select([DictTypeController])
      .state(),
  },
  props: {
    positionSearch: {},
    title: {
      type: String,
      default: '选择成员'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    partyTypes: {
      type: Array,
      default: []
    },
    flag: {
      type: Boolean,
      default: true // 是否查询初始化管理员用户和员工 默认是
    },
    // dictType:{
    //   type: Object,
    //   default: {}
    // },
    form: {
      type: Object,
      default: {}
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    activeName: {
      type: String,
      default: ''
    },
    isNext: {
      type: Boolean,
      default: false
    },
    businessObjId: {
      type: String,
    }
  },
  data() {
    return {
      // activeName: 'user',
      tableDataSelect: [],
      ifShow: true,
      hackReset: true,
      selectData: {},
      dicttypeid: 'sys_party_types',
      isRole: false
    }
  },
  watch: {
    partyTypes: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val && val.length > 0) {
          if (this.activeName.length == 0) {
            this.activeName = val[0].code
          }
        }
      }
    },
    dicts: {
      immediate: true,
      handler(val) {
        if (val) {
          const objectType = this.dicts[this.dicttypeid] || []
          if (objectType.length > 0) {
            const dictType = {}
            objectType.forEach(item => {
              dictType[item.code] = item.name
            })
            this.dictType = dictType
          }
        }
      },
    }
  },
  mounted() {
    this.loadDict()
  },
  computed: {
    ...mapGetters(['dicts']),
  },
  methods: {
    handleClick(val, event) {

    },
    close() {
      this.$emit('update:dialogVisible', false)
    },
    beforeLeaveHandle(activeName, oldActiveName) {
      if (this.selectData.arr && this.selectData.arr.length > 0) {
        const _this = this
        return new Promise((resolve, rejects) => {
          _this.$confirm('切换tab将放弃当前选中数据，是否放弃选中数据？', '提示', {
            confirmButtonText: '取消',
            cancelButtonText: '确定',
            type: 'warning'
          }).then(async res => {
            // 逻辑处理
            // await this.sure()
            // resolve(false)
            return false
          }).catch(() => {
            this.selectData.arr = []
            if (Array.isArray(this.$refs[this.activeName])) {
              this.$refs[this.activeName][0].tableDataSelect = []
            }
            resolve(true) // 取消返回false
          })
        })
      } else {
        return true
      }
    },
    cancel() {
      this.$emit('update:dialogVisible', false)
      this.reset()
      this.ifShow = false
      this.isRole = false
      this.$nextTick(() => {
        this.ifShow = true
      })
      this.selectData = {}
    },
    reset() {
      if (this.partyTypes && this.partyTypes.length > 0) {
        this.activeName = this.partyTypes[0].code
      }
    },
    changeSelect(arr, type) {
      this.selectData = { arr: arr, type: type, form: this.form }
    },
    sure() {
      this.$emit('sure', this.selectData)
      this.cancel()
    },
    nextStep() {
      if (this.selectData.arr && this.selectData.arr.length > 0) {
        this.isRole = true
      } else {
        this.$msg.warning('请选择成员')
      }
    },
    handleSuccess(form) {
      if (form && form.length > 0) {
        this.$emit('success', this.selectData, form)
        this.cancel()
      } else {
        this.$msg.warning('请选择角色')
      }
    },
    previewStep() {
      this.isRole = false
    },
    async loadDict() {
      if (!this.dicttypeid) { return }
      if (!this.dicts.hasOwnProperty(this.dicttypeid)) {
        this.$store.commit('ADD_DICT', { key: this.dicttypeid, value: null })
        const resp = await this.dispatch(DictTypeController.queryDictTypesByCriteria, {
          code: this.dicttypeid,
          tenantId: this.currentTenant,
        })
        if (!resp.error) {
          this.$store.commit('ADD_DICT', { key: this.dicttypeid, value: resp.data.data.length ? resp.data.data[0].dictEntrys : [] })
        }
      }
    },
  }
}
</script>
<style lang="scss" scoped>
  .el-row {
    height: 350px;
    .selectUser_table {
      .el-row {
        height: 50px;
      }
    }
    .block {
      height: 320px;
      overflow: auto;
      border: 1px solid #ddd;
      border-top: none;
    }
    .block_right {
      .el-tree-node__content {
        .item  {
          // height: 40px;
          width: 100%;
          i {
            // line-height: 35px;
            font-size: 20px;
            color: #ddd;
          }
        }
      }
    }
    .right_title {
      border: 1px solid #ddd;
      background: #eaf0ff;
      color: #8f8888;
      padding-left: 10px;
      height: 28px;
    }
    .move_btns {
      margin-top: 100px;
      text-align: center;
      :nth-child(2) {
        margin: 15px 0 0 ;
      }
      :nth-child(3) {
        margin: 40px 0 0 ;
      }
      :nth-child(4) {
        margin: 15px 0 0 ;
      }
    }
  }

.el-tree-node{
  position: relative;
  padding-left: 16px;
}
  .el-tree-node::before {
  border-left: 1px dashed #4386c6;
  bottom: 0px;
  height: 100%;
  top: -20px;
  width: 1px;
}
.el-tree-node::after {
  border-top: 1px dashed #4386c6;
  height: 20px;
  top: 17px;
  width: 24px;
}
.pagination{
  border: none !important;
}
</style>
