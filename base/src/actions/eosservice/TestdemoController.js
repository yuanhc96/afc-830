// This file is automatically generated

// testdemo

import { TestdemoController } from '@controller'
export default {
  actions: {
    [TestdemoController.newbiz.method]: {
      summary: 'newbiz',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/testdemo.newbiz.biz.ext`,
    },
    [TestdemoController.newbiz1.method]: {
      summary: 'restfunbiz',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/testdemo.newbiz1.biz.ext`,
    },
    [TestdemoController.newbizaa.method]: {
      summary: 'newbizaa',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/testdemo.newbizaa.biz.ext`,
    },
    [TestdemoController.newres.method]: {
      summary: 'newbiz-copy',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/testdemo.newres.biz.ext`,
    },
  },
}