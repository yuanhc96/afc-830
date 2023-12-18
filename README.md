# coframe-ui 微应用版 [gitlab地址](http://euler.git.primeton.com/eosclassic/application/coframe2022-ui.git)
## 概述
本文档提供基于新版coframe-ui的微应用开发指南, 新版coframe-ui ,
基于[webpack5](https://webpack.docschina.org/concepts/module-federation/)构建, 利用webpack5的模块联邦特性实现微应用之间的模块共享.

采用coframe的基座项目动态挂载微应用页面的方式, 实现多个应用依赖共享和页面融合的效果.


### coframe-ui 目录结构
```
                   
├── base                                    基座项目,包含 coframe 和公共模块,方法,api 等
│   ├── build                               构建配置(webpack5)
│   │   ├── mfp.config.js                   微应用模块注册
│   │   ├── webpack.config.js               webpack基础配置
│   │   ├── webpack.dev.js                  webpack dev 配置
│   │   ├── webpack.dll.js                  webpack 抽取三方库配置
│   │   └── webpack.prod.js                 webpack 构建配置
│   ├── config                              
│   │   └── app-config.json                 应用配置, 可以定义在运行期修改的标量
│   ├── public                              
│   │   └── base.html                       首页模板文件, 可以引用一些外部资源
│   ├── scripts                             用于生成后端 api 的脚本
│   ├── src                                 项目源码目录
│   │   ├── actions                         后端Api申明    
│   │   ├── components                      公共组件目录
│   │   ├── assets                          资源目录，这里的资源会被wabpack构建
│   │   ├── libs                            工具类
│   │   ├── router                          前端路由
│   │   ├── store                           应用级数据（state）
│   │   ├── views                           页面目录
│   │   ├── main.js                         入口js文件
│   │   └── app.vue                         
│   └── static                              纯静态资源，不会被wabpack构建。
├── app-process                             流程客户端微应用
├── demo1                                   微应用示例
├── dist                                    打包产物
├── plop-templates                          plop 项目模板文件
├── package.json                    
└── plopfile.js                             plop 命令, plop是一个用于快速生成项目的库
    ...
```

### base:  基座项目,包含 coframe 和公共模块,方法,api 等, 默认端口 8000

# 使用 plop 生成vue2微应用项目

```
// 在根目录下输入 plop
plop
// 输入 应用名:  端口:
application:  demo1
port:  9000
```
输入的项目名称最好是小驼峰命名

# 项目启动

先cd进入每一个子项目，需先安装依赖执行 `npm install`，若已安装可跳过该步骤，`npm run dev` 启动起来，有使用到的都需要启动。

也可以选择在根目录的 package.json 中配置批量启动, 运行  `npm run run:all` 即可全部启动。
```
  "run:all": "npm-run-all --parallel dev:*",
  "init:all": "npm-run-all --parallel install:*",

  "dev:base":"cd base && npm run dev",
  "install:base":"cd base && npm i",

  "dev:demo1":"cd demo1 && npm run dev",
  "install:demo1":"cd demo1 &&  npm i",
    
  "dev:app-process":"cd base && npm run dev",
  "install:app-process":"cd base &&  npm i"
```

# 微应用调用 base 模块

### 1. base 中暴露出模块给微应用共享：
./build/mfp.config.js
```js
module.exports = {
  name: 'base',
  filename: 'remoteEntry.js',
  exposes: {
    './controller': './src/actions/controller',
    './lib': './src/libs/index.js',
    // ElementUI和 PrimetonUI等全局注册的组件无需暴露，子应用可以直接使用
  },
}

```
### 2. 在微应用中引用 mfp.config.js中添加 base 配置
```js
  {
    ...
    remotes: {
      base: 'base@/remoteEntry.js'
    },
  }
```
### 3. 在微应用中引用 base 的模块
```js
import { List } from 'base/lib'
import { DictManager } from 'base/controller'
```
# 如何扩展微应用的图标?
### 1. 在 [https://www.iconfont.cn/](https://www.iconfont.cn/) 网站上制作好字体文件, 将其copy 到微应用的 static 目录下
```
└── static
    └── font_3201028_ggmgh148pbh
        ├── iconfont.css
        ├── iconfont.js
        ├── iconfont.json
        ├── iconfont.ttf
        ├── iconfont.woff
        └── iconfont.woff2
```
### 2. 在store/index.js 文件中编写加载字体文件的代码
```js

import {HtmlUtil} from 'base/lib'
HtmlUtil.dynamicLoadCss('./demo/static/font_3201028_ggmgh148pbh/iconfont.css')

```
### 3. 在微应用中就可以调用图标样式了
```vue
<span class="iconfont icon-wode"></span>
```

# 如何通过路由访问微应用页面?

http://localhost:8000/#/app/{appCode}/module/{moduleCode}

# 微应用之间如何互相调用组件?

```html
<template>
  <RemoteComponent appCode="" moduleCode=""/>
</template>
<script>
import { RemoteComponent } from 'base/components'
export default {
  components:{RemoteComponent}
}
</script>
```






