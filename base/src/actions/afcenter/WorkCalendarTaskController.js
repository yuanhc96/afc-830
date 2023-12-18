// This file is automatically generated

// 工作日历任务管理

import { WorkCalendarTaskController } from '@controller'
export default {
  actions: {
    [WorkCalendarTaskController.create.method]: {
      summary: '新增',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/work-calendar-task`,
    },
    [WorkCalendarTaskController.delete.method]: {
      summary: '删除(支持批量删除)',
      method: 'delete',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/work-calendar-task`,
    },
    [WorkCalendarTaskController.getByCode.method]: {
      summary: '根据code or id查询',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/work-calendar-task/${payload.code}`,
    },
    [WorkCalendarTaskController.getDailyTaskProgress.method]: {
      summary: '获取当天任务进度',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/work-calendar-task/progress`,
    },
    [WorkCalendarTaskController.queryWithPage.method]: {
      summary: '分页条件查询列表',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/work-calendar-task`,
    },
    [WorkCalendarTaskController.update.method]: {
      summary: '修改',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/work-calendar-task`,
    },
  },
}