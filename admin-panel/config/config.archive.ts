import { defineConfig } from '@umijs/max';

/**
 * 用于存档使用， 存档的方式采用 tag 的方式进行存档
 */
export default defineConfig({
  define: {
    UMI_ENV: 'archive',
    APP_STORAGE_PREFIX: 'aika-admin-panel-archive',
    APP_API_HOST: 'https://api.aikavision.com',
  },
});
