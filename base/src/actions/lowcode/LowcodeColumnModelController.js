// This file is automatically generated

// 低开列表通用数据模型管理

import { LowcodeColumnModelController } from '@controller'
export default {
  actions: {
    [LowcodeColumnModelController.clone.method]: {
      summary: '克隆低开数据模型',
      method: 'post',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/column-models/${payload.id}/clone`,
    },
    [LowcodeColumnModelController.create.method]: {
      summary: '创建低开数据模型',
      method: 'post',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/column-models`,
    },
    [LowcodeColumnModelController.delete.method]: {
      summary: '删除低开数据模型',
      method: 'delete',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/column-models`,
    },
    [LowcodeColumnModelController.downloadAttachment.method]: {
      summary: '下载附件',
      method: 'get',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/column-models/attachments/${payload.attachmentId}/actions/download`,
    },
    [LowcodeColumnModelController.existsByCondition.method]: {
      summary: '根据条件校验是否存在',
      method: 'post',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/column-models/exist`,
    },
    [LowcodeColumnModelController.get.method]: {
      summary: '获取低开数据模型',
      method: 'get',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/column-models/${payload.id}`,
    },
    [LowcodeColumnModelController.getAttachment.method]: {
      summary: '获取附件',
      method: 'get',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/column-models/attachments/${payload.attachmentId}`,
    },
    [LowcodeColumnModelController.getAttachmentContent.method]: {
      summary: '获取附件文本内容',
      method: 'get',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/column-models/attachments/${payload.attachmentId}/actions/content`,
    },
    [LowcodeColumnModelController.getDetails.method]: {
      summary: '获取低开数据模型详情',
      method: 'post',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/column-models/${payload.id}/details`,
    },
    [LowcodeColumnModelController.previewAttachment.method]: {
      summary: '预览附件',
      method: 'get',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/column-models/attachments/${payload.attachmentId}/actions/preview`,
    },
    [LowcodeColumnModelController.queryWithPage.method]: {
      summary: '分页查询低开数据模型',
      method: 'post',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/column-models/actions/query-with-page`,
    },
    [LowcodeColumnModelController.removeAttachment.method]: {
      summary: '删除附件',
      method: 'delete',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/column-models/attachments/${payload.attachmentId}`,
    },
    [LowcodeColumnModelController.save.method]: {
      summary: '保存低开数据模型',
      method: 'put',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/column-models/actions/save`,
    },
    [LowcodeColumnModelController.update.method]: {
      summary: '更新低开数据模型',
      method: 'put',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/column-models`,
    },
    [LowcodeColumnModelController.uploadAttachments.method]: {
      summary: '上传附件',
      method: 'post',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/column-models/attachments/actions/upload`,
    },
  },
}
