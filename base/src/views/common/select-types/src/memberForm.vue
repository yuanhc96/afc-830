<template>
  <el-dialog
    v-if="ifShow"
    :visible.sync="dialogVisible"
    close-on-click-modal
    :title="title"
    append-to-body
    width="1100px"
    top="60px"
    @closed="close"
  >
    <div v-show="!isRole">
      <el-tabs v-model="computedActiveName" :before-leave="beforeLeaveHandle" @tab-click="handleClick">
        <template v-for="item in selectTypes">
          <!-- 树，eg: position,org,user, emp -->
          <!-- emp加个tips -->
          <el-tab-pane v-if="item.code=='position'||item.code=='org'||item.code=='user'||item.code=='emp'" :key="item.code" :label="item.name" :name="item.code">
            <SelectOrg
              :ref="item.code"
              style="margin-top: -8px"
              :all-selecte-data="selectData"
              :position-search="positionSearch"
              :active-name="computedActiveName"
              :flag="flag"
              :type="item.code"
              :is-multiple="multiple"
              :dict-type="dictType"
              @change="changeSelect"
            >

              <el-select slot="filter" v-model="computedActiveName" :disabled="!activeNameChangeable">
                <el-option v-for="item in selectTypes" :value="item.code" :label="item.name" />
              </el-select>
            </SelectOrg>
          </el-tab-pane>
          <!-- 表格，eg: workGroup,role -->
          <el-tab-pane v-else :key="item.code" :label="item.name" :name="item.code">
            <SelectWorkGroup
              :ref="item.code"
              style="margin-top: -8px"
              :business-obj-id="businessObjId"
              :all-selecte-data="selectData"
              :active-name="computedActiveName"
              :type="item.code"
              :is-multiple="multiple"
              :current-app-id="item.appId"
              :dialogquery-fun="dialogqueryFun"
              :dict-type="dictType"
              @change="changeSelect"
            >

              <el-select slot="filter" v-model="computedActiveName" :disabled="!activeNameChangeable">
                <el-option v-for="item in selectTypes" :value="item.code" :label="item.name" />
              </el-select>
            </SelectWorkGroup>
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="showPreview" @click="previewStep">上一步</el-button>
      <el-button v-else @click="cancel">取 消</el-button>
      <el-button v-if="showNext" type="primary" @click="nextStep">下一步</el-button>
      <el-button v-else type="primary" @click="sure">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { DictTypeController } from '@controller'
import { BaseVue, Form, List } from '@lib'
import { mapGetters } from 'vuex'
import SelectOrg from './member-org.vue'
import SelectWorkGroup from './member-user.vue'
export default {
  name: 'member-form',
  components: { SelectWorkGroup, SelectOrg },
  mixins: [BaseVue, Form, List],
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
    }, // 支持user,emp,position,org,workGroup,role
    flag: {
      type: Boolean,
      default: true // 是否查询初始化管理员用户和员工 默认是
    },
    form: {
      type: Object,
      default: {}
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    propActiveName: {
      type: String,
      default: ''
    },
    activeNameChangeable: {
      default: true
    },
    // true,选完人员再选角色
    isNext: {
      type: Boolean,
      default: false
    },
    businessObjId: {
      type: String,
    },
    dialogqueryFun: {
      type: Function,
    }
  },
  data() {
    return {
      localActiveName: null,
      tableDataSelect: [],
      ifShow: true,
      selectData: [],
      dicttypeid: 'sys_party_types',
      isRole: false,
      dictType: null,
      previewData: {},
      showPreview: false,
      showNext: false,
      selectTypes: [],
      multiple: false,
    }
  },
  watch: {
    partyTypes: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val && val.length) {
          this.selectTypes = _.cloneDeep(val)
          if (this.computedActiveName.length == 0) {
            this.computedActiveName = val[0].code
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
            // 加一个角色的tab页
            this.dictType.role = '角色'
          }
        }
      }
    },
    dialogVisible: {
      immediate: true,
      async handler(val) {
        if (val) {
          this.selectTypes = _.cloneDeep(this.partyTypes)
          this.reset()
        }
      }
    },
    isNext: {
      immediate: true,
      handler(val) {
        this.showNext = !!val
      }
    },
    isMultiple: {
      immediate: true,
      handler(val) {
        this.multiple = val && !this.isNext
      }
    },
  },
  mounted() {
    this.loadDict()
  },
  computed: {
    ...mapGetters(['dicts']),
    computedActiveName: {
      get() {
        return this.localActiveName || this.propActiveName
      },
      set(val) {
        this.$emit('update:propActiveName', val)
        this.localActiveName = val
      },
    }
  },
  methods: {
    handleClick(val, event) {

    },
    close() {
      this.$emit('update:dialogVisible', false)
    },
    beforeLeaveHandle(activeName, oldActiveName) {
      const prefixData = this.selectData.filter(i => i.extra.type === activeName)
      const suffixData = this.selectData.filter(i => i.extra.type !== activeName)
      this.$set(this, 'selectData', _.concat(prefixData, suffixData))
    },
    cancel() {
      this.$emit('update:dialogVisible', false)
      this.reset()
      this.ifShow = false
      this.isRole = false
      this.$nextTick(() => {
        this.ifShow = true
      })
      this.selectData = []
    },
    reset() {
      if (this.selectTypes && this.selectTypes.length) {
        this.computedActiveName = this.computedActiveName || this.selectTypes[0].code
      }
    },
    changeSelect(arr) {
      this.selectData = arr
    },
    sure() {
      if (!this.selectData.length) {
        return this.$msg.warning('请选择数据!')
      }
      console.log(this.selectData, this.previewData, '提交')
      this.$emit('sure', this.selectData, this.previewData)
      this.reset()
      this.selectData = []
      this.selectTypes = _.cloneDeep(this.partyTypes)
      // this.previewStep()
      this.showPreview = false
      this.showNext = !!this.isNext
      this.cancel()
    },
    nextStep() {
      if (this.selectData && this.selectData.length) {
        this.selectTypes = [{ code: 'role', name: '角色' }]
        this.previewData = _.cloneDeep(this.selectData[0])
        this.showPreview = true
        this.showNext = false
        this.multiple = this.isMultiple
        this.computedActiveName = 'role'
        this.selectData = []
      } else {
        this.$msg.warning('请选择成员')
      }
    },
    previewStep() {
      this.selectData = []
      this.selectTypes = _.cloneDeep(this.partyTypes)
      this.reset()
      this.showPreview = false
      this.showNext = true
      this.multiple = false
      this.computedActiveName = this.selectTypes[0].code
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
::v-deep .el-tabs__header{
  display:none;
}
</style>
