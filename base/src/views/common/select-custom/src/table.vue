<template>
  <div>
    <el-table ref="select-table" size="mini" :data="list" border @selection-change="handleSelectionChange">
      <no-data slot="empty" />
      <el-table-column type="selection" :selectable="selectable" width="55" />
      <el-table-column v-for="c in columns" :key="c.label" :prop="c.propertyName" :label="c.label" />
    </el-table>
  </div>
</template>

<script>
import ajaxUtil from '@/libs/ajaxUtil'
import * as auth from '@/utils/auth.js'
import { BaseVue } from '@lib'
import _ from 'lodash'

export default {
  name: 'select-table',
  components: {},
  mixins: [BaseVue],
  props: {
    columns: {
      type: Boolean,
      default: false,
    },
    envType: {
      type: String,
    },
    value: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object | String,
      default: {
        multiSelect: false,
      },
    },
    forms: {
      type: Array,
    },
  },

  data() {
    return {
      list: [],
      valueField: '',
      textField: '',
      url: '',
      columns: [],
      multipleSelection: [],
    }
  },
  computed: {},
  watch: {
    data(val) {
      this.loadData(val)
    },
  },
  mounted() {
    this.loadData(this.data)
  },

  methods: {
    selectable() {
      return !this.disabled
    },
    loadData(values) {
      if (_.isString(values)) values = JSON.parse(values)
      else return
      let { url, valueField, textField, value, columns } = values
      if (!url) return
      this.valueField = valueField
      this.textField = textField
      this.columns = columns
      url = _.replace(url, ':projectId', this.projectId)
      url = _.replace(url, ':envType', this.envType || 'DEV')

      ajaxUtil
        .headers({
          Authorization: auth.getToken(),
        })
        .ajax({
          url: url,
          method: 'get',
        })
        .then(res => {
          if (res.data.data) {
            this.list = res.data.data
          } else {
            this.list = res.data
          }
          if (this.value) {
            setTimeout(() => {
              const selections = this.value.split(',')
              this.list.forEach(l => {
                if (_.includes(selections, l[this.valueField] + '')) {
                  this.$refs['select-table'].toggleRowSelection(l, true)
                }
              })
            }, 100)
          }
        })

      if (this.value === null) this.selectChange(value)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.selectChange(val)
    },
    selectChange(val) {
      if (!!val && _.isArray(val)) {
        this.$emit(
          'input',
          val
            .map(v => {
              return v[this.valueField]
            })
            .join(','),
        )
      }
    },
  },
}
</script>
