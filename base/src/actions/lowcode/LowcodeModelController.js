// This file is automatically generated

// 低开通用数据模型管理

import { LowcodeModelController } from '@controller'
export default {
  actions: {
    [LowcodeModelController.clone.method]: {
      summary: '克隆低开数据模型',
      method: 'post',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/models/${payload.id}/clone`,
    },
    [LowcodeModelController.create.method]: {
      summary: '创建低开数据模型',
      method: 'post',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/models`,
    },
    [LowcodeModelController.delete.method]: {
      summary: '删除低开数据模型',
      method: 'delete',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/models`,
    },
    [LowcodeModelController.downloadAttachment.method]: {
      summary: '下载附件',
      method: 'get',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/models/attachments/${payload.attachmentId}/actions/download`,
    },
    [LowcodeModelController.existsByCondition.method]: {
      summary: '根据条件校验是否存在',
      method: 'post',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/models/exist`,
    },
    [LowcodeModelController.generateNumber.method]: {
      summary: '根据属性编号规则，生成编号',
      method: 'post',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/models/actions/generate-number`,
    },
    [LowcodeModelController.get.method]: {
      summary: '获取低开数据模型',
      method: 'get',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/models/${payload.id}`,
    },
    [LowcodeModelController.getAttachment.method]: {
      summary: '获取附件',
      method: 'get',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/models/attachments/${payload.attachmentId}`,
    },
    [LowcodeModelController.getAttachmentContent.method]: {
      summary: '获取附件文本内容',
      method: 'get',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/models/attachments/${payload.attachmentId}/actions/content`,
    },
    [LowcodeModelController.getDetails.method]: {
      summary: '获取低开数据模型详情',
      method: 'post',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/models/${payload.id}/details`,
    },
    [LowcodeModelController.previewAttachment.method]: {
      summary: '预览附件',
      method: 'get',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/models/attachments/${payload.attachmentId}/actions/preview`,
    },
    [LowcodeModelController.queryWithPage.method]: {
      summary: '分页查询低开数据模型',
      method: 'post',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/models/actions/query-with-page`,
    },
    [LowcodeModelController.removeAttachment.method]: {
      summary: '删除附件',
      method: 'delete',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/models/attachments/${payload.attachmentId}`,
    },
    [LowcodeModelController.save.method]: {
      summary: '保存低开数据模型',
      method: 'put',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/models/actions/save`,
    },
    [LowcodeModelController.update.method]: {
      summary: '更新低开数据模型',
      method: 'put',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/models`,
    },
    [LowcodeModelController.uploadAttachments.method]: {
      summary: '上传附件',
      method: 'post',
      apiPrefix: true,
      url: (payload) => `/api/lowcode/models/attachments/actions/upload`,
    },
  },
}
