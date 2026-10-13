import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

/**
 * Dois projetos independentes:
 *  - ui:  testes de interface contra o Sauce Demo (https://www.saucedemo.com)
 *  - api: testes de API contra o Restful-Booker (https://restful-booker.herokuapp.com)
 *
 * As URLs podem ser sobrescritas por variáveis de ambiente (ver .env.example).
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.UI_BASE_URL ?? 'https://www.saucedemo.com',
        // O Sauce Demo usa o atributo data-test (e não data-testid).
        testIdAttribute: 'data-test',
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com',
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
  ],
});
