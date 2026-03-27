import { defineConfig } from '@playwright/test';
import { BASE_URL, DEFAULT_HEADERS } from './src/config';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 60_000,
  use: {
    baseURL: BASE_URL,
    extraHTTPHeaders: DEFAULT_HEADERS,
  },
});

