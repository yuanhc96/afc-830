<template>
    <SelectTree
      v-model="localValue"
      :options="dynamicOptions"
      :props="{label:'text'}"
      :default-expand-all="false"
      v-bind="$attrs"
      :show-selector-tooltip="true"
      selector-tooltip-field="value"
      @change="handlerChange"
    >
      <template slot="tree-node-label" slot-scope="{node,data}">
        <div v-if="node.isLeaf" style="width: 95%">
          <span style="float: left">
            {{ data.name || data.text }}
          </span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ data.entityName }}</span>
        </div>
        <div v-else style="width: 95%">
          <span style="float: left">{{ data.text }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ data.value }}</span>
        </div>
      </template>
    </SelectTree>
  
  </template>
  <script>
  
  import { LowcodeRuntimeController } from '@controller'
import _ from 'lodash'
import SelectTree from './tree-select/index.vue'
  
  const DataType = [
    {
      value: 'commonj.sdo.DataObject',
      text: 'DataObject',
    },
    {
      value: 'com.eos.system.utility.PageResultList',
      text: 'PageResultList',
    },
    {
      value: 'com.primeton.gocom.bfp.common.entity.ProcessContext',
      text: 'ProcessContext',
    },
    {
      value: 'com.primeton.gocom.afcenter.common.model.QueryConditionModel',
      text: 'QueryConditionModel',
    },
    // {
    //   value: 'com.primeton.das.criteria.criteriaType',
    //   text: 'criteriaType',
    // },
    // {
    //   value: 'com.eos.foundation.PageCond',
    //   text: 'PageCond',
    // },
    // {
    //   value: 'com.primeton.das.datatype.AnyType',
    //   text: 'AnyType',
    // },
    {
      value: 'String',
      text: 'String',
    },
    {
      value: 'Int',
      text: 'Int',
    },
    {
      value: 'BigInteger',
      text: 'Integer',
    },
    {
      value: 'Float',
      text: 'Float',
    },
    {
      value: 'Long',
      text: 'Long',
    },
    {
      value: 'Double',
      text: 'Double',
    },
    {
      value: 'Decimal',
      text: 'Decimal',
    },
    {
      value: 'Boolean',
      text: 'Boolean',
    },
    {
      value: 'Date',
      text: 'Date',
    },
    {
      value: 'Time',
      text: 'Time',
    },
    {
      value: 'Byte',
      text: 'Byte',
    },
    {
      value: 'Short',
      text: 'Short',
    },
    {
      value: 'Char',
      text: 'Char',
    },
  ]
  
  export default {
    name: 'select-sdo',
    components: { SelectTree },
    props: {
      value: {
        default: null
      },
      options: {
        default: null,
        type: Array,
      },
      baseTypeOnly: {
        default: false,
      },
      sdoTypeOnly: {
        default: false
      },
      persistent: {
        default: null
      },
      appName:{
        default: ''
      }
    },
    data() {
      return {
        DataType,
        loading: false,
        sdoList: [],
        selectorTooltipContent: null
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
      baseTypeList() {
        return (this.options || DataType).map(item => item.value)
      },
      dynamicOptions() {
        const basicType = _.cloneDeep(this.options || DataType)
        basicType.forEach((item) => { item.id = item.value })
        if (this.baseTypeOnly) {
          return [
            {
              text: '基本类型',
              value: 'basic',
              id: 'basic',
              children: basicType
            }
          ]
        } else if (this.sdoTypeOnly) {
          return this.sdoList
        } else {
          return [
            {
              text: '基本类型',
              value: 'basic',
              id: 'basic',
              children: basicType
            }
          ].concat(this.sdoList)
        }
      },
    },
    mounted() {
      if (!this.baseTypeOnly) {
        this.querySdoTypes()
      }
    },
    methods: {
      getIcon(data) {
        if (this.baseTypeList.includes(data.value)) {
          const iconName = data.value.includes('.') ? data.value.split('.').pop() : data.value.toLowerCase()
          return `data_type_${iconName}`
        } else {
          return ''
        }
      },
      handlerChange(node) {
        this.$emit('change', node)
      },
      querySdoTypes() {
        this.loading = true
        let payload = { includeProperty: true }
        if(this.appName){
            payload = { ...payload, appName : this.appName}
        }
        this.dispatch(LowcodeRuntimeController.querySdoTypes, payload).then(resp=>{
            let finalSdoList = []
            const contributionNameDict = {}
            let dataList = _.cloneDeep(resp.data)
            if (this.persistent !== null) {
              dataList = dataList.filter(d => d.persistent === this.persistent)
            }
            dataList = _.groupBy(dataList.map(item => {
              contributionNameDict[item.contributionName || 'others'] = item.contributionLabel || ''
              return {
                ...item,
                value: item.entityName,
                id: item.entityName,
                // text: `${item.name}-${item.URI}`,
                text: `${item.entityName}`,
                contributionName: item.contributionName || 'others'
              }
            }), 'contributionName')
            contributionNameDict.others = '其它'
  
            _.forEach(dataList, (v, k) => {
              finalSdoList.push({
                text: contributionNameDict[k],
                value: k,
                id: k,
                children: v,
              })
            })
            finalSdoList = _.sortBy(finalSdoList, ['text'])
            const ChineseIndex = finalSdoList.findIndex(item => /^[\u4e00-\u9fa5]/g.test(item.text))
            this.sdoList = ChineseIndex > -1 ? finalSdoList.splice(ChineseIndex).concat(finalSdoList.splice(0, ChineseIndex + 1)) : _.cloneDeep(finalSdoList)
        })

        // (this, {
        //   key: 'SdoTypeSelector',
        //   action: LowcodeRuntimeController.querySdoTypes,
        //   params: {},
        //   then: (that, resp) => {
        //     let finalSdoList = []
        //     const contributionNameDict = {}
        //     let dataList = _.cloneDeep(resp.data)
        //     if (this.persistent !== null) {
        //       dataList = dataList.filter(d => d.persistent === this.persistent)
        //     }
        //     dataList = _.groupBy(dataList.map(item => {
        //       contributionNameDict[item.contributionName || 'others'] = item.contributionLabel || ''
        //       return {
        //         ...item,
        //         value: item.entityName,
        //         id: item.entityName,
        //         text: `${item.name}-${item.URI}`,
        //         contributionName: item.contributionName || 'others'
        //       }
        //     }), 'contributionName')
        //     contributionNameDict.others = '其它'
  
        //     _.forEach(dataList, (v, k) => {
        //       finalSdoList.push({
        //         text: contributionNameDict[k],
        //         value: k,
        //         id: k,
        //         children: v,
        //       })
        //     })
        //     finalSdoList = _.sortBy(finalSdoList, ['text'])
        //     const ChineseIndex = finalSdoList.findIndex(item => /^[\u4e00-\u9fa5]/g.test(item.text))
        //     that.sdoList = ChineseIndex > -1 ? finalSdoList.splice(ChineseIndex).concat(finalSdoList.splice(0, ChineseIndex + 1)) : _.cloneDeep(finalSdoList)
        //   },
        //   error: () => {}
        // })
      },
    }
  
  }
  </script>
  