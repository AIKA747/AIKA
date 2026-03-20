const openApi = require('@umijs/openapi');

// 更多配置参数：https://github.com/chenshuai2144/openapi2typescript#%E5%8F%82%E6%95%B0
openApi
  .generateService({
    schemaPath: 'http://127.0.0.1:4523/export/openapi/2?version=3.0', // openAPI 3.0 的地址
    serversPath: './src/services', // 生成的文件夹的路径
    requestLibPath: "import { request } from '@umijs/max'", //自定义请求方法路径
  })
  .then((r: any) => {
    console.log('API 生成成功：', r);
  });
