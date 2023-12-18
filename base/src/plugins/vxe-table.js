import i18n from '@/lang/index.js'
import Vue from 'vue'
import VXETable from 'vxe-table'
import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'
import XEUtils from 'xe-utils'
import './vxe-table.css'

Vue.prototype.$msg = {
  success: (message) => {
    VXETable.modal.message({
      content: message,
      status: 'success'
    })
  },
  warning: (message) => {
    VXETable.modal.message({
      content: message,
      status: 'warning'
    })
  },
  error: (message) => {
    VXETable.modal.message({
      content: message,
      status: 'error'
    })
  },
  question: (message) => {
    VXETable.modal.message({
      content: message,
      status: 'question'
    })
  },
  loading: (message) => {
    VXETable.modal.message({
      content: message,
      status: 'loading'
    })
  },
}
VXETable.setup({
  zIndex: 10000,
  i18n: (key, args) => {
    return i18n.t(key, args)
  }
})

VXETable.formats.mixin({
  // format
  toDateString({ cellValue }) {
    return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:ss:mm')
  },
  toNumber({ cellValue }) {
    return XEUtils.commafy(Number(cellValue), { digits: 2 })
  },
  // 四舍五入金额，每隔3位逗号分隔，默认2位数
  formatAmount({ cellValue }, digits = 2) {
    return XEUtils.commafy(Number(cellValue), { digits })
  },
  // 格式化银行卡，默认每4位空格隔开
  formatBankcard({ cellValue }) {
    return XEUtils.commafy(XEUtils.toValueString(cellValue), { spaceNumber: 4, separator: ' ' })
  },
  // 四舍五入,默认两位数
  formatFixedNumber({ cellValue }, digits = 2) {
    return XEUtils.toFixed(XEUtils.round(cellValue, digits), digits)
  },
  // 向下舍入,默认两位数
  formatCutNumber({ cellValue }, digits = 2) {
    return XEUtils.toFixed(XEUtils.floor(cellValue, digits), digits)
  }
})
VXETable.use(VXETablePluginElement)
Vue.use(VXETable)
