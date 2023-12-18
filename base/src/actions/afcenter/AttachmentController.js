// This file is automatically generated

// 附件管理

import { AttachmentController } from '@controller'
export default {
  actions: {
    [AttachmentController.createAttachment.method]: {
      summary: '创建附件',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/attachments`,
    },
    [AttachmentController.downloadAttachment.method]: {
      summary: '下载附件',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/attachments/${payload.attachmentId}/actions/download`,
    },
    [AttachmentController.getAttachment.method]: {
      summary: '获取附件',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/attachments/${payload.attachmentId}`,
    },
    [AttachmentController.getAttachmentContent.method]: {
      summary: '获取附件文本内容',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/attachments/${payload.attachmentId}/actions/content`,
    },
    [AttachmentController.previewAttachment.method]: {
      summary: '预览附件',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/attachments/${payload.attachmentId}/actions/preview`,
    },
    [AttachmentController.queryAttachments.method]: {
      summary: '查询附件',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/attachments`,
    },
    [AttachmentController.removeAttachment.method]: {
      summary: '删除附件',
      method: 'delete',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/attachments/${payload.attachmentId}`,
    },
    [AttachmentController.uploadAttachments.method]: {
      summary: '上传附件',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/attachments/actions/upload`,
    },
  },
}
