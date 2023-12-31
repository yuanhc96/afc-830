import ajaxUtil from '@/libs/ajaxUtil'
import { localStore } from '@util/sessionStore'
let passwordTimer = null
function getPasswordPolicy() {
  const user = localStore.get('user') || {}
  const { TENANT_ID: tenantId } = user.attributes
  return ajaxUtil.ajax({
    url: `/api/afc/safeties/${tenantId}`,
    method: 'get',
    data: {},
  })
}
export default {
  noSpecialWord: (rule, value, callback, source, options) => {
    var errors = []
    if (/[/\\\&\<\>\']/.test(value)) {
      callback(new Error('不能包含特殊字符'))
    }
    callback(errors)
  },
  equalTo: (rule, value, callback, source, options) => {},
  userName: (rule, value, callback, source, options) => {
    var errors = []
    if (value && !/^[a-zA-Z0-9_-]{4,16}$/.test(value)) {
      callback(new Error('只能含字母、数字、-、_,长度4-16'))
    }
    callback(errors)
  },
  url: (rule, value, callback, source, options) => {
    var errors = []
    if (value && !/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(value)) {
      callback(new Error('不符合Url规范！'))
    }
    callback()
  },
  ip: (rule, value, callback, source, options) => {
    var errors = []
    if (value && !/^(?:(?:1[0-9][0-9]\.)|(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:1[0-9][0-9])|(?:2[0-4][0-9])|(?:25[0-5])|(?:[1-9][0-9])|(?:[0-9/*]))$/g.test(value)) {
      callback(new Error('不符合IP规范！'))
    }
    callback()
  },
  ipRange: (rule, value, callback, source, options) => {
    var errors = []
    const ipReg = /^(?:(?:1[0-9][0-9]\.)|(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:1[0-9][0-9])|(?:2[0-4][0-9])|(?:25[0-5])|(?:[1-9][0-9])|(?:[0-9]))$/g
    const ipReg2 = /^((25[0-5]\.|2[0-4]\d\.|1\d\d\.|[0-9]\d\.|[0-9]\.){1,3}(\*){1})$/g
    const ipReg3 = /^((?:(?:1[0-9][0-9]\.)|(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:1[0-9][0-9])|(?:2[0-4][0-9])|(?:25[0-5])|(?:[1-9][0-9])|(?:[0-9]))\s{0,1}\-\s{0,1}(?:(?:1[0-9][0-9]\.)|(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:1[0-9][0-9])|(?:2[0-4][0-9])|(?:25[0-5])|(?:[1-9][0-9])|(?:[0-9])))$/g
    if (!value || ipReg.test(value) || ipReg2.test(value) || ipReg3.test(value)) {
      callback()
    } else {
      callback(new Error('不符合IP规范！'))
    }
  },
  notBlank: (rule, value, callback, source, options) => {
    var errors = []
    if (!value) {
      callback(new Error('不能为空！'))
    }
    callback(errors)
  },
  number: (rule, value, callback, source, options) => {
    var errors = []
    if (isNaN(value)) {
      callback(new Error('数字！'))
    }
    callback(errors)
  },
  telNumber: (rule, value, callback, source, options) => {
    var errors = []
    if (value && !/^((1[3-9][0-9])\d{8})|(0\d{2}-\d{8})|(0\d{3}-\d{7})$/.test(value)) {
      callback(new Error('手机号格式错误！'))
    }
    callback(errors)
  },
  lowerCaseAndNumber: (rule, value, callback, source, options) => {
    var errors = []
    if (value && !/^[a-z0-9]+$/.test(value)) {
      callback(new Error('含小写字母和数字'))
    }
    callback(errors)
  },
  // 汉字，字母、数字、-，_
  name: (rule, value, callback, source, options) => {
    const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5\-]+$/
    if (value && !reg.test(value)) {
      callback(new Error('含汉字、字母、数字、-、_'))
    }
    callback()
  },
  // 英文，数字 - 下划线
  code: (rule, value, callback, source, options) => {
    const reg = /^[a-zA-Z0-9_\-]+$/
    if (value && !reg.test(value)) {
      callback(new Error('含字母、数字、-、_'))
    }
    callback()
  },
  // 英文，数字 - 下划线 .
  version: (rule, value, callback, source, options) => {
    const reg = /^[a-zA-Z0-9_.\-]+$/
    if (value && !reg.test(value)) {
      callback(new Error('含字母、数字、-、_、.'))
    }
    callback()
  },
  // 邮编规则
  zipcode: (rule, value, callback, source, options) => {
    if ([null, '', undefined].includes(value)) { // 非必填
      callback()
    }
    const reg = /^\d{6}$/
    if (!reg.test(value)) {
      callback(new Error('邮编格式不正确'))
    }
    callback()
  },
  email: (rule, value, callback, source, options) => {
    const reg = /^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(\.[0-9A-Za-z]+)+$/
    if (value && !reg.test(value)) {
      callback(new Error('邮箱格式不正确'))
    }
    callback()
  },
  // 支持英文、数字、符号
  password: (rule, value, callback, source, options) => {
    const reg = /^[a-z_A-Z0-9-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/",'<>~\·`\?。《，》（’？】——【）！；:;|]{6,20}$/
    if (!reg.test(value)) {
      callback(new Error('含字母、数字、符号、6-20位'))
    }
    callback()
  },
  // 密码策略的校验
  passwordPolicy: (rule, value, callback, source, options) => {
    const regs = {
      // '0'无要求; '1'数字，大小写字母; '2'大小写字母，数字，符号
      '1': [/^(?![0-9]+$)(?![a-zA-Z]+$)(?![0-9\W_]+$)(?![a-zA-Z\W_]+$)[a-z_A-Z0-9\W_]{2,}$/, '必须含有数字，大小写字母'],
      '2': [/^(?![0-9]+$)(?![a-zA-Z]+$)(?![0-9a-zA-Z]+$)(?![0-9\W_]+$)(?![a-zA-Z\W_]+$)(?!\W_+$)[a-zA-Z0-9\W_]{3,}$/, '必须含有大小写字母，数字，符号']
    }
    if (passwordTimer !== null) {
      clearTimeout(passwordTimer)
    }
    passwordTimer = setTimeout(async() => {
      if (!value) {
        callback()
      } else {
        getPasswordPolicy().then(res => {
          if (res && res.data) {
            const { passwordTypes, passwordLength } = res.data
            if (regs[passwordTypes] && !regs[passwordTypes][0].test(value)) {
              callback(new Error(regs[passwordTypes][1]))
            } else if (passwordLength && value.length < passwordLength) {
              callback(new Error(`密码最小长度为${passwordLength}`))
            }
            callback()
          }
          callback()
        })
          .catch(() => {
            callback()
          })
      }
    }, 300)
  },
  // 支持中文、英文、数字，_,-
  nameG: (rule, value, callback, source, options) => {
    const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5\-]+$/
    if (!reg.test(value)) {
      callback(new Error('含汉字、字母、数字、-、_'))
    }
    callback()
  },
  // 支持英文、数字、-，英文开头，不用-结尾
  codeG: (rule, value, callback, source, options) => {
    const reg = /^([a-zA-Z])(?!.*?-$)[a-zA-Z0-9-]*$/
    if (!reg.test(value)) {
      callback(new Error('含字母、数字、-、以字母开头，不能以-结尾'))
    }
    callback()
  },
  // 支持中文、英文、数字，下划线、-、标点符号
  desc: (rule, value, callback, source, options) => {
    const reg = /(?![\u4e00-\u9fa5])([a-zA-Z0-9\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F.-]*)/
    if (value && !reg.test(value)) {
      callback(new Error('含汉字、字母、数字、符号!'))
    }
    callback()
  },
  domain: (rule, value, callback, source, options) => {
    const reg = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$/
    if (value && !reg.test(value)) {
      callback(new Error('不符合域名规则!'))
    }
    callback()
  },
  prefix: (rule, value, callback, source, options) => {
    const reg = /^[a-z:/-]*$/
    if (value && !reg.test(value)) {
      callback(new Error('支持：/-、小写英文!'))
    }
    callback()
  },
  parameter: (rule, value, callback, source, options) => {
    const reg = /^[a-zA-Z0-9_\-\/]+$/
    if (!reg.test(value)) {
      callback(new Error('含字母、数字、-、_、/'))
    }
    callback()
  },
  className: (rule, value, callback, source, options) => {
    const reg = /^[a-zA-Z0-9_\-\.]+$/
    if (!reg.test(value)) {
      callback(new Error('含字母、数字、.、_、-'))
    }
    callback()
  },
  // 汉字，字母、数字、-，_, .
  dspname: (label, rule, value, callback, source, options) => {
    const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5\-\.]+$/
    if (value && !reg.test(value)) {
      callback(new Error(`${label}只能含汉字、字母、数字、-、_、.`))
    }
    callback()
  },
  // 英文，数字 .
  dspcode: (label, rule, value, callback, source, options) => {
    const reg = /^[a-zA-Z0-9\.]+$/
    if (value && !reg.test(value)) {
      callback(new Error(`${label}只能含字母、数字、.`))
    }
    callback()
  },
  // 字母、数字、-，_, .
  dspname1: (label, rule, value, callback, source, options) => {
    const reg = /^[a-zA-Z0-9_\.\-]+$/
    if (value && !reg.test(value)) {
      callback(new Error(`${label}只能含字母、数字、-、_、.`))
    }
    callback()
  },
  // 字母、数字、-，_, .
  dspPort: (label, rule, value, callback, source, options) => {
    if (!(/^[1-9]\d*$/.test(value) && 1 * value >= 0 && 1 * value <= 65535)) {
      callback(new Error(`${label}Port只能是1-65535的正整数`))
    }
    callback()
  },
  // 正整数
  dspUpNumber: (label, rule, value, callback, source, options) => {
    if (!(/[\d]/.test(value) && 1 * value >= 0)) {
      callback(new Error(`${label}只能输入正整数`))
    }
    callback()
  },
}
