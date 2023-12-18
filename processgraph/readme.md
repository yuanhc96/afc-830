## 流程实例图、流程定义图展示组件使用说明

1. nging 代理方式同workspace

2. 自定义图源只需求改static/image中的对应图片

3. iframe方式调用参数说明
  engine={引擎名称}
  tenant={租户id}
  processInstID={流程实例id}
  processDefID={流程定义id}
  processDefName={流程定义名称}

## 部署 
    
    全量部署

> 注：项目通过参数区分 “定义图 | 实例图” 所以传递参数请传入 “processInstID | processDefID/processDefName”