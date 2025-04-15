import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
  timeout: 50000,
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: 'html',
  
  use: {
    baseURL: 'https://enotes.pointschool.ru',
    navigationTimeout: 50000,
    trace: 'on-first-retry',
  },

  projects: [
    { 
      name: 'setup', testMatch: /.*\.setup\.ts/
     },

     {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] ,
           storageState: 'auth/user.json'
      },
      dependencies: ['setup'],
   
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] ,
        storageState: 'auth/user.json'
      },
      dependencies: ['setup']
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] ,
        storageState: 'auth/user.json'
      },
      dependencies: ['setup']
    },
  ],
});
