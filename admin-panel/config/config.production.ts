import { defineConfig } from '@umijs/max';

export default defineConfig({
  define: {
    UMI_ENV: 'production',
    APP_STORAGE_PREFIX: 'aika-admin-panel',
    APP_API_HOST: 'https://aisa-api.aikavision.com',
  },
});
