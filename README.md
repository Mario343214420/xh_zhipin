# react pro
## 文件结构

* src // 客户端代码文件
    * api // 请求模块文件
    * assets // 共用资源文件
    * components // UI组件模块文件
    * containers // 容器组件模块文件
    * redux // redux相关模块文件
    * utils // 工具模块文件
    * index.js // 入口js
## 主要问题

问题内容参照搭建过程发现顺序
1. 按需打包
参照antd-mobile文档
config-overrided.js变动
```
npm install babel-plugin-import --save-dev
```
```
+ const { override, fixBabelImports } = require('customize-cra');
- module.exports = function override(config, env) {
-   // do stuff with the webpack config...
-   return config;
- };
+ module.exports = override(
+   fixBabelImports('import', {
+     libraryName: 'antd-mobile',
+     style: 'css',
+   }),
+ );
```

* 引入形式
```
- import Button from 'antd-mobile/lib/button';
+ import { Button } from 'antd-mobile';
```
