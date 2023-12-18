export default {
  data() {
    let passwordLengthTimer = null
    let reminderChangeTimer = null
    let allowFailTimer = null
    let lockTimeTimer = null
    let freeTimeTimer = null
    return {
      rules: {
        passwordLength: [
          { required: true, message: '密码最小长度是必填项' },
          {pattern: /^[1-9]\d*$/, message: '密码最小长度必须是整数'},
          {validator: (rule, value, callback, source, options) => {
            if (passwordLengthTimer !== null) {
              clearTimeout(passwordLengthTimer)
            }
            passwordLengthTimer = setTimeout(() => {
              if (value > 99 || value < 1) {
                callback(new Error('密码最小长度范围为1~99'))
              }
              callback()
            }, 300)
          } }
        ],
        reminderChange: [
          { required: true, message: '密码变更提醒是必填项' },
          {pattern: /^[1-9]\d*$/, message: '密码变更提醒必须是整数'},
          {validator: (rule, value, callback, source, options) => {
            if (reminderChangeTimer !== null) {
              clearTimeout(reminderChangeTimer)
            }
            reminderChangeTimer = setTimeout(() => {
              if (value > 999 || value < 0) {
                callback(new Error('密码变更提醒范围为0~999'))
              }
              callback()
            }, 300)
          } }
        ],
        allowFail: [
          { required: true, message: '允许错误登录次数是必填项' },
          {pattern: /^[1-9]\d*$/, message: '允许错误登录次数必须是整数'},
          {validator: (rule, value, callback, source, options) => {
            if (allowFailTimer !== null) {
              clearTimeout(allowFailTimer)
            }
            allowFailTimer = setTimeout(() => {
              if (value > 99 || value < 0) {
                callback(new Error('允许错误登录次数范围为0~99'))
              }
              callback()
            }, 300)
          } }
        ],
        lockTime: [
          { required: true, message: '账号锁定时长是必填项' },
          {pattern: /^[1-9]\d*$/, message: '账号锁定时长必须是整数'},
          {validator: (rule, value, callback, source, options) => {
            if (lockTimeTimer !== null) {
              clearTimeout(lockTimeTimer)
            }
            lockTimeTimer = setTimeout(() => {
              if (value > 999 || value < 0) {
                callback(new Error('账号锁定时长范围为0~999'))
              }
              callback()
            }, 300)
          } }
        ],
        freeTime: [
          { required: true, message: '未登录锁定账号是必填项' },
          {pattern: /^[1-9]\d*$/, message: '未登录锁定账号必须是整数'},
          {validator: (rule, value, callback, source, options) => {
            if (freeTimeTimer !== null) {
              clearTimeout(freeTimeTimer)
            }
            freeTimeTimer = setTimeout(() => {
              if (value > 999 || value < 0) {
                callback(new Error('未登录锁定账号范围为0~999'))
              }
              callback()
            }, 300)
          } }
        ],
      },
      form: {
        passwordLength: null,
        passwordTypes: '1',
        reminderChange: null,
        isUpdate: '0',
        firstUpdate: '0',
        allowFail: null,
        lockTime: null,
        freeTime: null,
      },
      passwordTypes: [
        {
          label: '无要求',
          value: '0'
        },{
          label: '数字，大小写字母',
          value: '1'
        },{
          label: '大小写字母，数字，符号',
          value: '2'
        }
      ],
      query: {
        limit: 10,
        offset: 1,
        name: null,
        code: null,
        types: 'safety',
      },
    }
  },
  methods: {
    
  }
}