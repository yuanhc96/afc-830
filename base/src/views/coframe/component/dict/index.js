const ACTIVITY_TYPES = Object.freeze({
  start: '开始活动',
  finish: '结束活动',
  manual: '人工活动',
  route: '路由活动',
  toolapp: '自动活动',
  subflow: '子流程活动',
})
const PRIORITY = Object.freeze({
  '80': '高',
  '70': '次高',
  '60': '中',
  '50': '次中',
  '40': '低',
  '30': '次低',
})

const STATUS = Object.freeze({
  '1': '未启动',
  '2': '运行',
  '3': '挂起',
  '7': '完成',
  '8': '终止',
  '10': '待激活',
  '-1': '应用异常',
})
const PROCESSS_TATUS = Object.freeze({
  '1': '未启动',
  '2': '运行',
  '3': '挂起',
  '7': '完成',
  '8': '终止',
  '9': '取消',
})

const WORKITEM_STATUS = Object.freeze({
  '4': '待领取',
  '8': '挂起',
  '10': '运行',
  '12': '完成',
  '13': '终止',
})
const TIMEOUT = Object.freeze({
  'Y': '已超时',
  'N': '未超时',
})
const YES_NO = Object.freeze({
  'Y': '是',
  'N': '否',
})
const ROLLBACK_STRATEGY = Object.freeze({
  'one_step': '单步回退',
  'simple': '简单回退',
  'time': '基于两个节点之间的时间',
  'recent_manual': '回退到最近的人工活动',
  'path': '基于两个节点之间的路径',
})
const URL_TYPE = Object.freeze({
  'N': '无',
  // 'F': '页面流',
  // 'W': 'Web页面',
  // 'bfsform': '业务表单',
  'O': '其它',
})
const BIZ_RESOURCE_TYPE = Object.freeze({
  '01': '人工任务',
  '02': '业务操作',
  '03': '业务变量',
  '04': '业务规则',
  '09': '工作日历',
})
const AGENT_ITEM_TYPE = Object.freeze({
  'PROCESS': '流程',
  'ACTIVITY': '活动',
})
const DELEGATE_TYPE = Object.freeze({
  'DELEG': '代办',
  'HELP': '协办',
})

const BIZ_OPT_TYPE = Object.freeze({
  'pojo': 'Java方法',
  'bizlet': '运算逻辑',
  'logic-flow': '逻辑流',
  // 'service-component': 'service-component',
})

const BIZ_CONFIG_TYPE = Object.freeze({
  'parameter': '参数',
  'result': '返回值'
})

const BIZ_DATA_TYPE = Object.freeze({
  'primitive': '简单'
})

const BIZ_PARAMETER_TYPE = Object.freeze({
  'Int': 'Int',
  'boolean': 'boolean',
  'double': 'double',
  'long': 'long',
  'char': 'char',
  'short': 'short',
  'float': 'float',
  'byte': 'byte',
  'java.lang.String': 'String',
})

const HUMAN_TASK_Type = Object.freeze({
  'pageflow': '页面流',
  'webpage': 'web页面',
  'other': '其他'
})

const USEFUL = Object.freeze({
  'Y': '生效',
  'N': '不生效',
  'ALL': '全部',
})

const ACCESS_TYPE = Object.freeze({
  'Y': 'ALL',
  'STARTPROC': '启动流程',
  'EXEWI': '执行工作项',
})

const DELEGATE_TYPE_SHOW = Object.freeze({
  'A': '协办',
  'D': '代办',
  'F': '完成',
  'I': '初始',
  'R': '打回',
  'w': '收回'
})

const OMPARTICIPANT_TYPE = Object.freeze({ // OMParticipantType
  'emp': '员工',
  'org': '机构',
  'organization': '机构',
  'person': '个人',
  'position': '岗位',
  'role': '角色'
})

const PARTICIPANT_TYPE = Object.freeze({ // OMParticipantType
  'organization': '机构和角色',
  'position': '岗位',
  'role': '角色',
  'emp': '员工',
  'group': '工作组',
  'org': '机构',

})

const ACTION_TYPE = Object.freeze({
  'ENGQRY': '引擎查询',
  'ENGOPT': '引擎操作',
  'APP': '应用调用',
  'TRIGGER': '触发事件',
  'TIMER': '定时器类型',
  'FETCHPARTI': '获取参与者'
})

const LOG_OCCASION = Object.freeze({
  'B': '开始',
  'E': '结束',
  'EX': '异常'
})
const OPTION_LEVEL = Object.freeze({
  'PROCESSDEFINE': '流程定义',
  'PROCESSINST': '流程实例',
  'ACTIVITYINST': '活动实例',
  'WORKITEM': '工作项',
  'OTHER': '其他',
})

const BIZ_RES_TYPE = Object.freeze({
  '01': '人工任务',
  '02': '业务操作',
  '03': '业务变量',
  '04': '业务规则',
  '09': '工作日历',
})

export {
  STATUS,
  ACTIVITY_TYPES,
  YES_NO,
  ROLLBACK_STRATEGY,
  TIMEOUT,
  URL_TYPE,
  PRIORITY,
  WORKITEM_STATUS,
  BIZ_RESOURCE_TYPE,
  AGENT_ITEM_TYPE,
  DELEGATE_TYPE,
  BIZ_OPT_TYPE,
  BIZ_CONFIG_TYPE,
  BIZ_DATA_TYPE,
  BIZ_PARAMETER_TYPE,
  HUMAN_TASK_Type,
  USEFUL,
  ACCESS_TYPE,
  DELEGATE_TYPE_SHOW,
  OMPARTICIPANT_TYPE,
  PARTICIPANT_TYPE,
  ACTION_TYPE,
  LOG_OCCASION,
  OPTION_LEVEL,
  BIZ_RES_TYPE,
  PROCESSS_TATUS,
}

