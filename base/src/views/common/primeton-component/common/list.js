import _ from 'lodash'
export default {
  props: {
    action: {
      type: Object,
      default: null,
    },
    theme: {
      type: String,
      default: 'thin',
    },
    params: {
      type: Object | String | Array,
      default: null,
    },
    filter: {
      type: Function,
      default: null,
    },
    dataField: {
      type: String,
    },
    labelField: {
      type: String,
      default: 'label',
    },
    valueField: {
      type: String,
      default: 'id',
    },
    paramsSeparator: {
      default: ',',
    },
    value: {},
  },
  data() {
    return {
      data: []
    }
  },
  watch: {
    value(val) {
      this.$emit('input', val)
    },
    params: {
      immediate: true,
      handler(val) {
        this.loadData()
      }
    },
  },
  mounted() {
  },

  methods: {
    async loadData() {
      let payload = {}
      if (typeof this.params === 'string') {
        this.params.split(this.paramsSeparator).forEach(p => {
          if (p) {
            p = p.split('=')
            payload[p[0]] = p[1]
          }
        })
      } else if (Array.isArray(this.params)) {
        payload = _.reduce(this.params, (obj, param) => {
          if (param.k && param.v) {
            obj[param.k] = param.v
          }
          return obj
        }, {})
      } else {
        payload = this.params
      }
      const resp = await this.dispatch(this.action, payload)
      const data = this.dataField ? resp.data[this.dataField] : resp.data
      if (!resp.error && Array.isArray(data)) {
        this.data = this.filter ? data.filter(this.filter) : data
      }
    }
  }
}
