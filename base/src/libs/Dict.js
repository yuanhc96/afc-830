/**
 * Created by binwang on 18/4/3.
 */
export default {
  status: [
    {
      k: 0,
      v: '作废',
      c: 'red'
    },
    {
      k: 1,
      v: '正常',
      c: 'green'
    },
  ],
  TransactionStatus: [
    {
      k: 0,
      v: '失败',
      c: 'red'
    },
    {
      k: 1,
      v: '成功',
      c: 'green'
    },
  ],
  sex: [
    {
      k: '1',
      v: '男'
    },
    {
      k: '0',
      v: '女'
    },
  ],
  CertificateType: [
    {
      label: '身份证',
      value: 1,
    },
    {
      label: '护照',
      value: 2,
    },
  ],

  icon: {
    user: 'person',
    link: 'link',
    column: 'eye',
    topic: 'edit',
    video: 'videocamera',
    file: 'file',
    list: 'ios-list',
    transaction: 'social-yen',
  },
  deliverIsRequiredOptions: [
    {
      label: '是',
      value: true,
    },
    {
      label: '否',
      value: false,
    },
  ],
  componentInstanceStatus: {
    running: {
      v: 'running',
      t: '运行中',
      icon: 'running',
    },
    stopped: {
      v: 'stopped',
      t: '已停止',
      icon: 'stop-sm',
    },
    uninstalled: {
      v: 'uninstalled',
      t: '已卸载',
      icon: 'uninstalled',
    },
    deployed: {
      v: 'deployed',
      t: '已部署（运行状态未知）',
      icon: 'deployed',
    }
  },
  componentType: {
    oracle: {
      v: 'oracle',
      t: 'oracle',
      icon: 'oracle',
    },
    tomcat: {
      v: 'tomcat',
      t: 'tomcat',
      icon: 'tomcat',
    },
    mysql: {
      v: 'mysql',
      t: 'mysql',
      icon: 'mysql',
    },
    springboot: {
      v: 'springboot',
      t: 'springboot',
      icon: 'springboot',
    },
    nginx: {
      v: 'nginx',
      t: 'nginx',
      icon: 'nginx',
    },
    nginxweb: {
      v: 'nginxweb',
      t: 'nginxweb',
      icon: 'nginxweb',
    },
    weblogic: {
      v: 'weblogic',
      t: 'weblogic',
      icon: 'weblogic',
    },
    'sql-exec': {
      v: 'sql-exec',
      t: 'sql-exec',
      icon: 'sql-exec',
    },
    was: {
      v: 'was',
      t: 'was',
      icon: 'was',
    },
    'sql-data-deploy': {
      v: 'sql-data-deploy',
      t: 'sql-data-deploy',
      icon: 'sql-exec',
    },
    eos: {
      v: 'eos',
      t: 'eos',
      icon: 'eos',
    },
    eosapp: {
      v: 'eosapp',
      t: 'eosapp',
      icon: 'eosapp',
    },
    compress: {
      v: 'compress',
      t: 'compress',
      icon: 'compress',
    },
    unknown: {
      v: 'unknown',
      t: 'unknown',
      icon: 'unknown',
    },
    redis: {
      v: 'redis',
      t: 'redis',
      icon: 'redis',
    },
    openshift: {
      v: 'openshift',
      t: 'openshift',
      icon: 'openshift',
    },
    mobileios: {
      v: 'mobileios',
      t: '移动IOS',
      icon: 'mobileios',
    },
    mobileandroid: {
      v: 'mobileandroid',
      t: '移动Android',
      icon: 'mobileandroid',
    },
    mobileapp: {
      v: 'mobileapp',
      t: '移动增量',
      icon: 'mobileapp',
    },
  },
  buildStatus: {
    [undefined]: {
      v: 'info',
      t: '待发布',
    },
    [null]: {
      v: 'info',
      t: '待发布',
    },
    success: {
      v: 'success',
      type: 'success',
      status: 'success',
      icon: 'el-icon-success',
      t: '成功',
    },
    releasing: {
      v: 'warning',
      type: 'warning',
      status: 'default',
      icon: 'el-icon-loading',
      t: '发布中',
    },
    waiting: {
      v: 'warning',
      type: 'warning',
      icon: 'el-icon-loading',
      t: '等待中',
    },
    executing: {
      v: 'warning',
      type: 'warning',
      icon: 'el-icon-loading',
      t: '执行中',
    },
    unexecuted: {
      v: 'info',
      type: 'info',
      t: '未执行',
    },
    failure: {
      v: 'error',
      type: 'danger',
      status: 'exception',
      icon: 'el-icon-error',
      t: '失败',
    },
    refuse: {
      v: 'error',
      type: 'danger',
      icon: 'el-icon-error',
      t: '拒绝',
    },
    error: {
      v: 'error',
      type: 'danger',
      status: 'exception',
      icon: 'el-icon-error',
      t: '系统错误',
    },
    terminated: {
      v: 'error',
      type: 'danger',
      icon: 'el-icon-error',
      t: '终止',
    },
    cancel: {
      v: 'error',
      type: 'danger',
      icon: 'el-icon-error',
      t: '取消',
    },
    disable: {
      v: 'warning',
      type: 'warning',
      icon: 'el-icon-warning',
      t: '禁用',
    },
  },
  operation: {
    stop: {
      icon: 'el-icon-close',
    },
    restart: {
      icon: 'el-icon-refresh',
    },
    uninstall: {
      icon: 'el-icon-delete',
    },
    start: {
      icon: 'el-icon-refresh',
    },
    scale: {
      icon: 'el-icon-d-caret',
    },
    rollback: {
      icon: 'el-icon-d-arrow-left',
    },
    viewLog: {
      icon: 'el-icon-document',
    }
  },

  workitemStatus: {
    open: {
      type: 'default',
      t: '打开',
    },
    close: {
      type: 'success',
      t: '关闭',
    },
    resolved: {
      type: 'success',
      t: '已解决',
    },
    'to-do': {
      type: 'danger',
      t: '待办',
    },
    'in-progress': {
      type: 'warning',
      t: '处理中',
    },
    reopened: {
      type: 'default',
      t: '重新开放',
    },
    done: {
      type: 'success',
      t: '完成',
    },
  },

  dictTypes: {
    DPS_PM_VERSION_STATUS: 'DPS_PM_VERSION_STATUS',
    DPS_PJM_PROJECT_TAGS: 'DPS_PJM_PROJECT_TAGS',
  },

  projectCategory: [
    {
      k: 'project',
      v: '项目',
    },
    {
      k: 'project-set',
      v: '项目群',
    },
  ],

  subProjectProgress: {
    overdue: {
      type: 'exception',
    },
    closed: {
      type: 'exception',
    },
    future: {
      type: 'success',
    },
    active: {
      type: 'success',
    },
    released: {
      type: 'success',
    },
  },
  milestoneColor: {
    completed: '#8FC375',
    uncompleted: '#BFBFBF',
    overdue: '#cc3a2d',
  },
  projectStatus: {
    FUTURE: '未开始',
    ACTIVE: '进行中',
    RELEASE: '已发布',
    OVERDUE: '超期',
    CLOSED: '已完成',
  },
  timeRangeType: [
    {
      k: 'day',
      v: '天',
    },
    {
      k: 'week',
      v: '周',
    },
    {
      k: 'month',
      v: '月',
    },
    {
      k: 'year',
      v: '年',
    },
  ],
  svcType: [
    {
      label: '介质服务器',
      v: '2',
      k: 'nexus_agent',
    },
    {
      label: '构建引擎',
      v: '3',
      k: 'build_egine',
    },
    {
      label: '部署引擎',
      v: '4',
      k: 'deploy_egine',
    },
    {
      label: '邮件服务器',
      v: '5',
      k: 'mail_server',
    },
    {
      label: '质量分析服务器',
      v: '6',
      k: 'quality_server',
    },
    {
      label: '项目管理服务器',
      v: '7',
      k: 'project_server',
    },
    {
      label: '容器云服务器',
      v: '8',
      k: 'container_cluster',
    },
    {
      label: '镜像服务器',
      v: '12',
      k: 'image_repo',
    },
    {
      label: 'CMDB',
      v: '9',
      k: 'cmdb',
    },
    {
      label: '代码服务器',
      v: '1',
      k: 'code_repo',
    },
    {
      label: 'LDAP服务器',
      v: '11',
      k: 'ldap',
    },
    {
      label: '文档服务器',
      v: '14',
      k: 'document',
    },
  ],
  variableTypeDict: {
    variable: {
      text: '常量',
      value: 'variable',
    },
    textEditor: {
      text: '文本',
      value: 'textEditor',
    },
    json: {
      text: 'Json',
      value: 'json',
    },
    enum: {
      text: '枚举',
      value: 'enum',
    },
    artifactRepo: {
      text: '介质仓库',
      value: 'artifactRepo',
    },
    imageRepo: {
      text: '镜像仓库',
      value: 'imageRepo',
    },
    resource: {
      text: '资源',
      value: 'resource',
    },
    compInstance: {
      text: '组件实例',
      value: 'compInstance',
    }
  }
}

