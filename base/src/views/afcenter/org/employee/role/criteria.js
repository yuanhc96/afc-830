
export default {
  criteria: {
    '_entity': 'org.gocom.components.coframe.rights.dataset.CapRole',
    '_and': [
      {
        '_expr': [
          {
            '_op': '=',
            '_property': 'tenantId',
            '_value': '',
          },
          {
            '_op': 'like',
            '_property': 'roleCode',
            '_value': '',
          },
          {
            '_op': 'like',
            '_property': 'roleName',
            '_value': '',
          },
        ]
      }

    ],
  },
}
