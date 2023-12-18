export const DEFAULT_LAYOUT = 1
export const LAYOUT_TYPE_LIST = [
  {
    label: '1:1',
    value: 1
  },
  {
    label: '1:2',
    value: 2
  },
  {
    label: '2:1',
    value: 3
  },
  {
    label: '1:2:1',
    value: 4
  }
]
export default {
  appId: '',
  code: '',
  content: '',
  createTime: '',
  createUser: '',
  description: '',
  id: '',
  md5: '',
  name: '',
  tenantId: '',
  types: '',
  updateTime: '',
  updateUser: '',
  isPublish: '0',
  portalIcon: '',
  sortNo: '1',
  extra: {
    userOptions: {
      layoutType: DEFAULT_LAYOUT,
      isDark: 'light',
      color: '#409EFF',
      isCenter: false,
      isWeight: false,
      backgroundImg: '',
      horizontalMargin: 10,
      verticalMargin: 10,
      opacity: 1,
      isCanUpdate: false,
    }
  }
}
