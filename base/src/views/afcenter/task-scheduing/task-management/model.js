export default {
  id: null,
  jobGroup: null,
  jobDesc: null,
  author: 'admin',
  alarmEmail: null,
  scheduleType: 'CRON',
  scheduleConf: null,
  cronGen_display: null,
  schedule_conf_CRON: null,
  schedule_conf_FIX_RATE: null,
  schedule_conf_FIX_DELAY: null,
  glueType: 'BEAN',
  executorHandler: null,
  executorParam: null,
  executorRouteStrategy: 'FIRST',
  childJobId: null,
  misfireStrategy: 'DO_NOTHING',
  executorBlockStrategy: 'SERIAL_EXECUTION',
  executorTimeout: 0,
  executorFailRetryCount: 0,
  glueRemark: null,
  glueSource: null
}
const glueTypes = [{
  value: 'BEAN',
  label: 'BEAN'
},
{
  value: 'logicalFlow',
  label: '逻辑流'
},
{
  value: 'GLUE_GROOVY',
  label: 'GLUE(Java)'
},{
  value: 'GLUE_SHELL',
  label: 'GLUE(Shell)'
},{
  value: 'GLUE_PYTHON',
  label: 'GLUE(Python)'
},{
  value: 'GLUE_PHP',
  label: 'GLUE(PHP)'
},{
  value: 'GLUE_NODEJS',
  label: 'GLUE(Nodejs)'
},{
  value: 'GLUE_POWERSHELL',
  label: 'GLUE(PowerShell)'
}]
const options = {
  second: {
    value: '',
    label: '秒',
    one: '每秒 允许的通配符[, - * /]',
    cycle1: 1,
    cycle2: 2,
    start: 0,
    end: 1,
    appoint: '',
    appointList: [],
    appointLength: _.times(60, String)
  },
  minutes: {
    value: '',
    label: '分钟',
    one: '每分钟 允许的通配符[, - * /]',
    cycle1: 1,
    cycle2: 2,
    start: 0,
    end: 1,
    appoint: '',
    appointList: [],
    appointLength: _.times(60, String)
  },
  hour: {
    value: '',
    label: '小时',
    one: '每小时 允许的通配符[, - * /]',
    cycle1: 1,
    cycle2: 2,
    start: 0,
    end: 1,
    appoint: '',
    appointList: [],
    appointLength: _.times(24, String)
  },
  day: {
    value: '',
    label: '日',
    one: '每天 允许的通配符[, - * / L W]',
    extra1: '不指定',
    extraValue: 1,
    cycle1: 1,
    cycle2: 2,
    start: 1,
    end: 1,
    appoint: '',
    appointList: [],
    appointLength: _.times(31, String).map(i => String(Number(i) + 1))
  },
  month: {
    value: '',
    label: '月',
    one: '每月 允许的通配符[, - * /]',
    cycle1: 1,
    cycle2: 2,
    start: 1,
    end: 1,
    appoint: '',
    appointList: [],
    appointLength: _.times(12, String).map(i => String(Number(i) + 1))
  },
  week: {
    value: '',
    label: '星期',
    one: '每周 允许的通配符[, - * / L #]',
    extraValue: 1,
    cycle1: 1,
    cycle2: 2,
    start: 1,
    end: 1,
    appoint: '',
    appointList: [],
    appointLength: _.times(7, String).map(i => String(Number(i) + 1))
  },
  year: {
    value: '',
    label: '年',
    extra: '不指定 允许的通配符[, - * /] 非必填',
    one: '每年',
    cycle1: 2023,
    cycle2: 2024,
  }
}

export { glueTypes, options }

