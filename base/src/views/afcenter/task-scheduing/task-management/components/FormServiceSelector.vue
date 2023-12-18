<template>
  <el-tooltip :disabled="!localValue" :content="localValue">
    <SelectTree
      v-model="localValue"
      ref="treeRef"
      :value-path-label.sync="tooltipContent"
      :options="optionList"
      :default-expand-all="false"
      :default-expand-keys="finalExpendKeys"
      :expand-on-click-node="true"
      v-bind="$attrs"
      :custom-tree-class="customTreeClass"
      @change="handlerChange"
    >
      <template slot="tree-node-label" slot-scope="{node,data}">
        <div style="width: 95%">
          <span style="float: left">
            <svg-icon v-if="data.resourceType && data.resourceType === 'bizx'" icon-class="bizx_file" class-name="bizx-icon"></svg-icon>
            {{ data.label }}
          </span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ data.code }}</span>
        </div>
      </template>
    </SelectTree>
  </el-tooltip>
</template>
<script>
import { LowcodeResourceController } from '@controller'
import { BaseVue } from "@lib"
import _ from 'lodash'
import SelectTree from './SelectTree.vue'

export default {
  name: 'select-sdo',
  mixins: [BaseVue],
  components: { SelectTree },
  props: {
    value: {
      default: null
    },
    resourceCode: {
      default: null,
    },
    appCode:{
      default: null,
    }
  },
  data() {
    return {
      tooltipContent: null,
      loading: false,
      optionList: [],
      customTreeClass: '',
      defaultExpendKeys: []
    }
  },
  computed: {
    localValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
    finalExpendKeys: {
      get() {
        let valueKeys = []
        if (this.resourceCode) {
          // 将当前表单所在的构建包默认展开
          valueKeys.push(this.resourceCode.slice(0, this.resourceCode.lastIndexOf('.')))
        }
        return Array.from(new Set(valueKeys.concat(this.defaultExpendKeys))) 
      },
      set() {}
    }
  },
  watch:{
    appCode:{
      handler(val){
        if(val){
          this.reset()
          this.queryFormResource()
        }
      }
    }
  },
  async mounted() {
    this.queryFormResource()
  },
  methods: {
    reset(){
      this.tooltipContent = null
      this.loading = false 
      this.optionList = []
      this.customTreeClass = ''
      this.defaultExpendKeys = []
      this.localValue = null
    },
    async handlerChange(nodeData) {
      if (!nodeData || (nodeData && nodeData.isLeaf)) {
        this.customTreeClass = null
        // nodeData中暂时另加了isLeaf字段, 与children为空的实体作区分
        this.localValue = nodeData && nodeData.id
        this.$emit('change', nodeData)
      } else {
        this.customTreeClass = 'non-child'
      }
    },
    async queryFormResource() {
      const resp = await this.dispatch(LowcodeResourceController.queryWithPage, {
        pageSize: 10000,
        pageIndex: 0,
        resourceType: 'bizx',
        __apiPrefix: this.appCode
      })
      if (!resp.error) {
        let finalFormViewsList = _.cloneDeep(this.formatData(resp.data.data))
        finalFormViewsList = _.sortBy(finalFormViewsList, ['label'])
        const ChineseIndex = finalFormViewsList.findIndex(item => /^[\u4e00-\u9fa5]/g.test(item.label))
        finalFormViewsList = ChineseIndex > -1 ? finalFormViewsList.splice(ChineseIndex).concat(finalFormViewsList.splice(0, ChineseIndex + 1)) : _.cloneDeep(finalFormViewsList)
        const currentFormResource = this.resourceCode ? finalFormViewsList.find(item => item.code === this.resourceCode.slice(0, this.resourceCode.lastIndexOf('.'))) : null
        if (currentFormResource) {
          // 将当前表单所在构建包置顶
          this.optionList = [currentFormResource].concat(finalFormViewsList.filter(item => item.code !== this.resourceCode.slice(0, this.resourceCode.lastIndexOf('.'))))
        } else {
          this.optionList = _.cloneDeep(finalFormViewsList)
        }
      }
    },
    formatData(data) {
      const finalFormViewsList = []
      const contributionNameDict = {}
      const dataList = _.groupBy(data.filter(d => d.resourceSubType).map(item => {
      // const dataList = _.groupBy(data.filter(d => d.resourceSubType === 'sdoBiz').map(item => {
       if(item.lowcodeContribution){
        contributionNameDict[item.lowcodeContribution.code] = item.lowcodeContribution.name
       }
        if (this.localValue && this.localValue !== '') {
          // 将当前已选中的值所在的node默认展开
          const currentSelectedNodes = this.localValue.split('^_^').join('.')
          if (item.code === currentSelectedNodes) {
            this.defaultExpendKeys.push(item.lowcodeContribution.code)
          }
        }
        return {
          ...item,
          label: item.name || item.code,
          id: item.lowcodeContribution ? item.lowcodeContribution.code + '^_^' + item.code.split('.')[item.code.split('.').length - 1] : item.code.split('.')[item.code.split('.').length - 1],
          bizId:item.id,
          code: item.code ? item.code.split('.')[item.code.split('.').length - 1] : '',
          bizCode: item.code,
          isLeaf: true,
          contributionCode: item.lowcodeContribution ?  item.lowcodeContribution.code : null
        }
      }), 'contributionCode')
      _.forEach(dataList, (v, k) => {
        finalFormViewsList.push({
          label: contributionNameDict[k],
          id: k,
          code: k,
          children: v
          // children: v.filter(s => s.resourceSubType === 'sdoBiz')
        })
      })
      return finalFormViewsList
    }
  }

}
</script>

<style lang="scss" scoped>
  .bizx-icon {
    width: 0.4em;
    height: 0.4em;
    vertical-align: 0.1em;
  }
  .entity-icon {
    width: 0.8em;
    height: 0.8em;
    vertical-align: -0.08em;
  }
  ::v-deep .non-child .el-tree-node.is-current {
    color: #606266 !important;
    font-weight: 400 !important;
  }
  .svg-icon {
    width: 0.3em;
    height: 0.3em
  }
</style>
