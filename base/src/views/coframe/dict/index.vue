<template>
    <PmNavigation ref="nav" :routes="routes" :allow-click="true" :cache-include="['biz-dict','DictDetail']" />
</template>
<script>
import EntryDetail from './entry/detail.vue'
import DictIndex from './entry/list.vue'
import Main from './main.vue'
import DictDetail from './type/entry-detail.vue'
import DictChildren from './type/list.vue'

export default {
  components: { DictIndex, DictDetail, DictChildren, EntryDetail },
  data() {
    const routes = [
      {
        title: '业务字典',
        name: 'biz-dict',
        description: '规定：某个字典类型下只允许有一个子字典类型。',
        component: Main,
        children: [
          {
            title: '类型详情',
            name: 'DictDetail',
            component: DictDetail,
            children: [
              {
                title: '字典详情',
                name: 'EntryDetail1',
                component: EntryDetail,
                children: [
                  {
                    title: '字典详情',
                    name: 'EntryDetail2',
                    component: EntryDetail,
                    children: [
                      {
                        title: '字典详情',
                        name: 'EntryDetail3',
                        component: EntryDetail,
                        children: [
                          {
                            title: '字典详情',
                            name: 'EntryDetail4',
                            component: EntryDetail,
                            children: [
                              {
                                title: '字典详情',
                                name: 'EntryDetail5',
                                component: EntryDetail,
                                children: [
                                  {
                                    title: '字典详情',
                                    name: 'EntryDetail6',
                                    component: EntryDetail,
                                    children: [
                                      {
                                        title: '字典详情',
                                        name: 'EntryDetail7',
                                        component: EntryDetail,
                                        children: [
                                          {
                                            title: '字典详情',
                                            name: 'EntryDetail8',
                                            component: EntryDetail,
                                            children: [
                                              {
                                                title: '字典详情',
                                                name: 'EntryDetail9',
                                                component: EntryDetail,
                                                children: [
                                                  {
                                                    title: '字典详情',
                                                    name: 'EntryDetail10',
                                                    component: EntryDetail,
                                                  }
                                                ]
                                              }
                                            ]
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
            ]
          },
          {
            title: '子类型',
            name: 'DictChildren1',
            component: DictChildren,
            children: [
              {
                title: '子类型',
                name: 'DictChildren2',
                component: DictChildren,
                children: [
                  {
                    title: '子类型',
                    name: 'DictChildren3',
                    component: DictChildren,
                    children: [
                      {
                        title: '子类型',
                        name: 'DictChildren4',
                        component: DictChildren,
                        children: [
                          {
                            title: '子类型',
                            name: 'DictChildren5',
                            component: DictChildren,
                            children: [
                              {
                                title: '子类型',
                                name: 'DictChildren6',
                                component: DictChildren,
                                children: [
                                  {
                                    title: '子类型',
                                    name: 'DictChildren7',
                                    component: DictChildren,
                                    children: [
                                      {
                                        title: '子类型',
                                        name: 'DictChildren8',
                                        component: DictChildren,
                                        children: [
                                          {
                                            title: '子类型',
                                            name: 'DictChildren9',
                                            component: DictChildren,
                                            children: [
                                              {
                                                title: '子类型',
                                                name: 'DictChildren10',
                                                component: DictChildren,
                                              }
                                            ]
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },

    ]
    return {
      routes: routes,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
    },
  },
}
</script>
