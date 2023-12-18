module.exports = {
  title: 'TM20 ADP&MASA', // index.html的标题显示内容
  navName: '流程开发框架',
  feedBackVisible: true, // 是否显示“一键反馈”组件
  loginLoginVisible: true, // 是否显示登录页普元logo
  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',

  /**
   * @type {string} 'projectList' | 'workplatform'
   * @description The first page to show after login.
   */
  homePage: 'home',
  recordLabel: 'Copyright © Primeton Technologies Ltd. ' // 备案信息
}
