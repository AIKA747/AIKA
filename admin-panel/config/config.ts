import { defineConfig } from '@umijs/max';
import enUS from 'antd/locale/en_US';
import routes from './routes';

export default defineConfig({
  define: {
    UMI_ENV: 'dev',
    APP_STORAGE_PREFIX: 'aika-admin-panel-local',
    APP_API_HOST: 'https://api-test.aikavision.com',
    // APP_API_HOST: 'http://127.0.0.1:4523/m1/3612779-0-default',
  },
  antd: {
    // configProvider
    configProvider: {
      locale: enUS,
      prefixCls: 'parsec',
      iconPrefixCls: 'parsec-icon',
      // shortcut of `configProvider.theme`
      // use to configure theme token, antd v5 only
      theme: {
        token: {
          // Seed Token，影响范围大
          colorPrimary: '#3b5ff9',
          borderRadius: 4,
          algorithm: true, // 启用算法
          colorLink: '#3b5ff9',

          // 派生变量，影响范围小
          // colorBgContainer: '#f6ffed',
        },
        components: {
          Layout: {
            colorBgLayout: '#ffffff',
          },
          Menu: {
            itemSelectedColor: '#3b5ff9',
          },
          Empty: {
            controlHeightLG: 100,
          },
        },
      },
    },
    // themes
    dark: false,
    compact: false,
    // antd <App /> valid for version 5.1.0 or higher, default: undefined
    appConfig: {
      message: {
        // 配置 message 最大显示数，超过限制时，最早的消息会被自动关闭
        maxCount: 3,
      },
    },
  },
  access: {},
  model: {},
  initialState: {},
  request: {},
  clientLoader: {},
  layout: {
    title: 'aika-admin',
  },
  metas: [
    { name: 'keywords', content: 'parsec, admin' },
    {
      name: 'description',
      content: '重庆市秒差距科技有限公司中后台管理模版。',
    },
  ],
  headScripts: [{ content: `//! umi version: ^4.0.81;` }],
  favicons: ['/favicon.ico'],
  routes: routes,
  npmClient: 'yarn',
  jsMinifier: 'terser',
});
