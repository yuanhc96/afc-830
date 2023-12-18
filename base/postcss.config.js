module.exports = {
  map: false, //关闭source-map
  plugins: {
    "postcss-preset-env": {
      stage: 0, //哪怕是处于草案阶段的语法，也需要转换
      preserve: false,
    },
    "postcss-pxtorem": { // 此处为添加部分
      rootValue: 16, // 对应16px
      unitPrecision: 5,
      // propList: ['*'],
      propList: ['font', 'font-size'],
      selectorBlackList: [],
      replace: true,
      mediaQuery: false,
      minPixelValue: 0
    }
  },
};
