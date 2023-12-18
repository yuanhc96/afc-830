module.exports = {
  modules: [
    {
      name: 'afcenter',
      apiPrefix: '/afc',
      swaggerUrl: 'http://10.15.15.151:13083/v2/api-docs?group=afcenter'
      // swaggerUrl: 'http://10.89.4.186:13083/v2/api-docs?group=afcenter'
    },
    // {
    //   name: 'bfp',
    //   apiPrefix: true,
    //   swaggerUrl: 'http://10.15.15.151:13083/v2/api-docs?group=bfp'
    // },
    {
      name: 'bfpcenter',
      apiPrefix: '/afc',     
      controllerFilter: function(name) {
        return name ==='Bfp Process Manager Controller' 
      }, 
      swaggerUrl: 'http://10.15.15.151:13083/v2/api-docs?group=bfpcenter'
    },
    {
      name: 'lowcode',
      apiPrefix: true,
      swaggerUrl: 'http://10.15.15.151:13083/v2/api-docs?group=lowcode'
    },
    {
      name: 'eos',
      apiPrefix: '/afc',
      swaggerUrl: 'http://10.15.15.151:13083/v2/api-docs?group=eos'
    },
    {
      name: 'eosservice',
      apiPrefix: '/afc',
      swaggerUrl: 'http://10.15.15.151:13083/v2/api-docs?group=eosservice'
    },
    {
      name: 'job',
      apiPrefix: '/afc',
      swaggerUrl: 'http://10.15.15.151:13083/v2/api-docs?group=job'
    },
  ]
}
