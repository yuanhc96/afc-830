<template>
  <pm-select 
    v-model="localValue"
    :settings='{"type":type,"cascade":cascade,"parentCode":parentCode,"dictTypeCode":dictTypeID}'
    :multiple="multiple"
    :disabled="disabled"
    :isHighlight="true"
    class="w-100p"
    :class="{ 'readonly-select': readonly}"
    v-bind="$attrs"
    :mode="mode">
</pm-select>
</template>
<script>
import { BaseVue, Form, List } from '@lib'
export default {
  mixins: [BaseVue, Form],
  props: {
    value:{},
    dicttypeid: {
      type: String,
      default: ''
    },
    type: {
        type:String,
        default:'dict'
    },
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
    parentCode: {
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
    mode: {
      type: String,
      default: 'edit'
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dictTypeID(){
      //兼容数据适配
      return  this.dicttypeid || this.dictTypeCode 
    },
    localValue: {
      get() {
        if(!this.value){
            return ''
        }else{
            if (this.multiple) {
            //字符串变成数组
            return  this.value && typeof this.value === 'string' ? this.value.split(this.separator) : []
            }
            else if (this.isInteger(this.value)) {
            //兼容字典为int
            return this.value + ''
            } else {
            return this.value
            }
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
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
  isInteger(obj) {
   return typeof obj === 'number' && obj%1 === 0
  },
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
  ::v-deep  .el-input__inner {
    border: 1px solid  transparent !important;
  }
 
}

</style>
