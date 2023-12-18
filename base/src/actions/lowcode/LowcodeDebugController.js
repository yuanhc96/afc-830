// This file is automatically generated

// 低开调试管理

import { LowcodeDebugController } from '@controller'
export default {
  actions: {
    [LowcodeDebugController.deleteBizBreakpoint.method]: {
      summary: '删除逻辑流断点',
      method: 'delete',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/debugs/breakpoints`,
    },
    [LowcodeDebugController.deleteBizBreakpoints.method]: {
      summary: '批量删除逻辑流断点',
      method: 'delete',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/debugs/breakpoints/actions/batch-remove`,
    },
    [LowcodeDebugController.executeExpression.method]: {
      summary: '执行表达式的值',
      method: 'post',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/debugs/breakpoints/actions/exec-expression`,
    },
    [LowcodeDebugController.getCurrentBizBreakpoint.method]: {
      summary: '查询并开启逻辑流当前停住的断点',
      method: 'get',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/debugs/breakpoints/actions/current`,
    },
    [LowcodeDebugController.queryBizBreakpoints.method]: {
      summary: '查询逻辑流断点',
      method: 'get',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/debugs/breakpoints`,
    },
    [LowcodeDebugController.queryBizDebugVars.method]: {
      summary: '获取逻辑流调试变量信息',
      method: 'get',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/debugs/vars`,
    },
    [LowcodeDebugController.queryLatestBizDebugVars.method]: {
      summary: '获取最新的逻辑流调试变量信息',
      method: 'get',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/debugs/vars/actions/latest`,
    },
    [LowcodeDebugController.resumeBizBreakpoint.method]: {
      summary: '执行逻辑流到下一个断点',
      method: 'post',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/debugs/breakpoints/actions/resume`,
    },
    [LowcodeDebugController.saveBizBreakpoint.method]: {
      summary: '保存逻辑流断点',
      method: 'post',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/debugs/breakpoints`,
    },
    [LowcodeDebugController.setBizDebugVarValue.method]: {
      summary: '设置逻辑流调试变量值',
      method: 'post',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/debugs/vars`,
    },
    [LowcodeDebugController.shutdownBizDebug.method]: {
      summary: '关闭调试',
      method: 'delete',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/debugs/breakpoints/actions/shutdown`,
    },
    [LowcodeDebugController.stepOverBizBreakpoint.method]: {
      summary: '执行一步逻辑流',
      method: 'post',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/debugs/breakpoints/actions/step-over`,
    },
  },
}