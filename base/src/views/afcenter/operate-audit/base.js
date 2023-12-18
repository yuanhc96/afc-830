export default {
  data() {
    return {
      operateTypeDict: [
        {
          label: '修改',
          value: '1'
        },
        {
          label: '新增',
          value: '0'
        },
        {
          label: '删除',
          value: '2'
        },
        {
          label: '登录',
          value: '3'
        },
        {
          label: '登出',
          value: '4'
        },
        {
          label: '其他',
          value: '9'
        },
      ],
    }
  },
  methods: {
    getOperateType(val) {
      let label = ''
      if (val) {
        label = this.operateTypeDict.filter(item => item.value === val)[0].label
      }
      return label
    },
  }
}