module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        'corejs': '3.23',
        targets: {
          chrome: '68',
          ie: '11',
        },
      }
    ]
  ],
}
