import { defineConfig } from '@umijs/max';

export default defineConfig({
  define: {
    UMI_ENV: 'staging',
    APP_STORAGE_PREFIX: 'aika-admin-panel-staging',
    APP_API_HOST: 'https://api-test.aikavision.com',
  },
});
