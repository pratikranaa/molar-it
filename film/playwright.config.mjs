import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: "film.browser.test.mjs",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: "http://127.0.0.1:8080",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "python3 -m http.server 8080 --directory ..",
    url: "http://127.0.0.1:8080/film.html",
    reuseExistingServer: true,
  },
});
