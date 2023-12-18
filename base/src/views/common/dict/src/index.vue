<template>
  <el-select
    ref="dictSelct"
    v-model="localValue"
    :class="{ 'readonly-select': readonly}"
    :multiple="multiple"
    :disabled="isDisabled"
    v-bind="$attrs"
    class="w-100p"
  >
    <el-option v-for="item in mergeItems" :key="item.key" :value="item.value" :label="item.label ">
    </el-option>
  </el-select>
</template>
<script>
import { BaseVue, Form, List } from '@lib'
import { mapGetters } from 'vuex'
import { DictTypeController, DictEntryController } from '@controller'
import Cache from './cache'
const DataSource = {
  enable: [
    { label: '生效', value: 'Y' },
    { label: '不生效', value: 'N' }
  ],
  yesOrNo: [
    { label: '否', value: '0' },
    { label: '是', value: '1' }
  ],
  protocol: [
    { label: 'http', value: 'http' },
    { label: 'https', value: 'https' }
  ]
}
export default {
  mixins: [BaseVue, Form],
  props: {
    value: {},
    params: {},
    dicttypeid: {},
    type: {},
    dictTypeCode:{
      type: String,
      default: ''
    },
    multiple: {
      //是否多选
      type: Boolean,
      default: false
    },
    separator: {
      //分隔符
      type: String,
      default: ','
    },
    parentEntryCode: {
      type: String,
      default: ''
    },
    cascade: {
      //级联
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
    // isFilter:{
    //   type:String,
    //   default:false
    // }
  },
  computed: {
    ...mapGetters(['dicts']),
    mergeItems() {
      const result = this.dictTypeID && this.dicts[this.dictTypeID] ? this.dicts[this.dictTypeID] : []
      return result.map(item => {
        return {
          key: item.code || item.dictid,
          value: item.code || item.dictcode,
          label: item.name || item.dictname
        }
      })
    },
    dictTypeID(){
      //兼容数据适配
      return this.type || this.dicttypeid || this.dictTypeCode 
    },
    isDisabled() {
      return (this.cascade && !this.parentEntryCode) || this.disabled
    },
    localValue: {
      get() {
        if(!this.value){
          return ''
        }
        else if (this.multiple) {
          //字符串变成数组
          return  this.value && typeof this.value === 'string' ? this.value.split(this.separator) : []
        } else if (typeof this.value != 'string') {
          //兼容字典不为string时，例如 int
          return this.value + ''
        } else {
          return this.value
        }
      },
      set(val) {
        let newValue = val
        //多选时，数组变字符串返回
        if (this.multiple && _.isArray(newValue)) {
          newValue = newValue.join(this.separator)
        }
        this.$emit('input', newValue)
      }
    }
  },
  data() {
    return {
      valueList: [],
      readOnlyValue: '',
      dataSource: {
        enable: [
          { label: '生效', value: 'Y' },
          { label: '不生效', value: 'N' }
        ],
        yesOrNo: [
          { label: '否', value: '0' },
          { label: '是', value: '1' }
        ],
        protocol: [
          { label: 'http', value: 'http' },
          { label: 'https', value: 'https' }
        ]
      }
    }
  },
  watch: {
    params: {
      deep: true,
      immediate: true,
      handler: 'loadData'
    },
    parentEntryCode: {
      immediate: true,
      handler(val) {
        this.loadData()
      }
    }
  },
  mounted() {
    // this.loadData()
  },
  methods: {
    async loadData() {
      if (!this.dictTypeID) {
        return
      }
      let parentEntry = null
      if (this.parentEntryCode) {
        parentEntry = await this.findEntrybyCode(this.parentEntryCode)
      }
      if (this.cascade && !parentEntry) {
        this.localValue = ''
      }
      if (!this.dicts[this.dictTypeID] || this.cascade) {
        const resp = await this.dispatch(DictTypeController.queryDictTypesByCriteria, {
          code: this.dictTypeID,
          tenantId: this.currentTenant
        })
        if (!resp.error && resp.data.data[0]) {
          let dictEntrys = []
          //级联-没有父字典项，清空当前输入值
          if (parentEntry) {
            dictEntrys = resp.data.data[0].dictEntrys.filter(item => item.parentId == parentEntry.id)
          } else {
            dictEntrys = resp.data.data[0].dictEntrys
          }
          //级联情况下判断当前字典项集合中是否含有当前输入值 ；有的话，不做改变，没有，说明不是父的字典项下的，清空输入值
          if (this.cascade && dictEntrys.filter(item => item.code === this.value).length == 0) {
            this.localValue = ''
          }
          this.$store.commit('ADD_DICT', { key: this.dictTypeID, value: dictEntrys })
        } else {
          this.$store.commit('ADD_DICT', { key: this.dictTypeID, value: [] })
        }
      }
    },
    async findEntrybyCode(perentCode) {
      const resp = await this.dispatch(DictEntryController.getDictEntityByCode, {
        code: perentCode
      })
      return !resp.error ? resp.data : []
    }
  }
}
</script>
<style lang="scss" scoped>
.readonly-select {
  /**pointer-events: none禁止鼠标点击事件，当元素中有这一属性时，链接、点击事件统统失效**/
  pointer-events: none;
  cursor: default;
  ::v-deep .el-input--mini .el-input__icon{
  display: none !important;
}
}

</style>
