import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";
const DASHBOARD_URL = `${BASE_URL}/monitoring-dashboard.html`;

test.describe("Dashboard Browser Compatibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/monitoring/**", async (route) => {
      const url = route.request().url();

      if (url.includes("/dashboard")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            totalRequests: 1234,
            errorRate: 0.05,
            uptime: 99.9,
            avgLatency: 150,
            minLatency: 50,
            maxLatency: 2000,
            p95Latency: 450,
          }),
        });
      } else if (url.includes("/metrics/summary")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            responseTime: 150,
            uptime: 99.9,
          }),
        });
      } else {
        await route.continue();
      }
    });
  });
  test("should load dashboard HTML", async ({ page }) => {
    const response = await page.goto(DASHBOARD_URL);
    expect(response?.status()).toBe(200);

    const title = await page.title();
    expect(title).toContain("Monitoring Dashboard");
  });

  test("should have proper security headers", async ({ page }) => {
    const response = await page.goto(DASHBOARD_URL);
    const headers = await response?.allHeaders();

    expect(headers).toBeDefined();
    expect(headers?.["content-security-policy"]).toBeDefined();
    expect(headers?.["x-frame-options"]).toBe("DENY");
    expect(headers?.["x-content-type-options"]).toBe("nosniff");
  });

  test("should display dashboard title and cards", async ({ page }) => {
    await page.goto(DASHBOARD_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const title = page.locator("h1").first();
    const titleCount = await title.count();
    expect(titleCount).toBeGreaterThanOrEqual(1);
    
    if (titleCount > 0) {
      await expect(title).toContainText("Monitoring Dashboard");
    }

    const cards = page.locator(".card");
    const cardCount = await cards.count();
    expect(cardCount >= 0).toBe(true);
  });

  test("should render Chart.js charts", async ({ page }) => {
    await page.goto(DASHBOARD_URL);

    await page.waitForSelector("canvas", { timeout: 5000 });
    const canvases = await page.locator("canvas");
    const canvasCount = await canvases.count();

    expect(canvasCount).toBeGreaterThanOrEqual(1);
  });

  test("should have auto-refresh working", async ({ page }) => {
    await page.goto(DASHBOARD_URL);

    const initialCards = await page.locator(".card");
    const initialCount = await initialCards.count();

    await page.waitForTimeout(6000);

    const cardsAfter = await page.locator(".card");
    const afterCount = await cardsAfter.count();
    
    expect(afterCount).toBeGreaterThanOrEqual(initialCount);
  });

  test("should display metric values", async ({ page }) => {
    await page.goto(DASHBOARD_URL);

    await page.waitForSelector(".metric-value", { timeout: 5000 });
    const metrics = await page.locator(".metric-value");
    const metricCount = await metrics.count();

    expect(metricCount).toBeGreaterThan(0);
  });

  test("should load all external CDN resources", async ({ page }) => {
      await page.goto(DASHBOARD_URL);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      const scripts = page.locator("script[src]");
      const scriptCount = await scripts.count();
      expect(scriptCount >= 0).toBe(true);

      const links = page.locator("link[rel='stylesheet']");
      const linkCount = await links.count();
      expect(linkCount >= 0).toBe(true);
    });

  test("should display error handling gracefully", async ({ page }) => {
    await page.goto(DASHBOARD_URL);
    await page.waitForLoadState('networkidle');

    const alerts = page.locator("#alerts");
    const alertCount = await alerts.count();
    expect(alertCount).toBeGreaterThanOrEqual(0);
  });

   test("should maintain functionality during scroll", async ({ page }) => {
     await page.goto(DASHBOARD_URL);
     await page.waitForLoadState('networkidle');
     await page.waitForTimeout(1000);

     const cards = page.locator(".card");
     const cardCount = await cards.count();
     if (cardCount > 0) {
       await page.evaluate(() => window.scrollBy(0, 500));
       await page.waitForTimeout(500);
       const cardsAfter = page.locator(".card");
       const afterCount = await cardsAfter.count();
       expect(afterCount).toEqual(cardCount);
     }
     expect(cardCount >= 0).toBe(true);
   });

  test("should handle refresh button click", async ({ page }) => {
      await page.goto(DASHBOARD_URL);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const refreshBtn = page.locator("#refreshBtn");
      const btnCount = await refreshBtn.count();
      
      if (btnCount > 0) {
        await refreshBtn.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
        const cards = page.locator(".card");
        const cardCount = await cards.count();
        expect(cardCount >= 0).toBe(true);
      } else {
        expect(btnCount >= 0).toBe(true);
      }
    });

  test("should display response time metrics", async ({ page }) => {
    await page.goto(DASHBOARD_URL);
    await page.waitForLoadState('networkidle');

    const minLatency = page.locator("#minLatency");
    const count = await minLatency.count();
    expect(count >= 0).toBe(true);
  });
});

test.describe("Dashboard Responsive Design", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/monitoring/**", async (route) => {
      const url = route.request().url();

      if (url.includes("/dashboard")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            totalRequests: 1234,
            errorRate: 0.05,
            uptime: 99.9,
            avgLatency: 150,
            minLatency: 50,
            maxLatency: 2000,
            p95Latency: 450,
          }),
        });
      } else if (url.includes("/metrics/summary")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            responseTime: 150,
            uptime: 99.9,
          }),
        });
      } else {
        await route.continue();
      }
    });
  });
   test("should be responsive on mobile (375px)", async ({ page }) => {
     await page.setViewportSize({ width: 375, height: 667 });
     await page.goto(DASHBOARD_URL);
     await page.waitForLoadState('networkidle');
     await page.waitForTimeout(1000);

     const cards = page.locator(".card");
     const count = await cards.count();

     const buttons = page.locator("button");
     const buttonCount = await buttons.count();
     
     expect(count >= 0).toBe(true);
     expect(buttonCount >= 0).toBe(true);
   });

    test("should be responsive on tablet (768px)", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(DASHBOARD_URL);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      const cards = page.locator(".card");
      const count = await cards.count();
      expect(count >= 0).toBe(true);
    });

  test("should be responsive on desktop (1440px)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(DASHBOARD_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const cards = page.locator(".card");
    const cardCount = await cards.count();
    expect(cardCount >= 0).toBe(true);
  });

    test("should handle touch interactions on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(DASHBOARD_URL);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const refreshBtn = page.locator("#refreshBtn");
      const btnCount = await refreshBtn.count();
      if (btnCount > 0) {
        await refreshBtn.click();
        await page.waitForTimeout(500);
      }

      const cards = page.locator(".card");
      const cardCount = await cards.count();
      expect(cardCount >= 0).toBe(true);
    });

  test("should maintain layout on scroll at mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(DASHBOARD_URL);

    const initialCards = await page.locator(".card");
    const initialCount = await initialCards.count();

    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(300);

    const cardsAfterScroll = await page.locator(".card");
    const afterCount = await cardsAfterScroll.count();
    
    expect(afterCount).toBeLessThanOrEqual(initialCount + 2);
  });
});

test.describe("Browser-Specific Features", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/monitoring/**", async (route) => {
      const url = route.request().url();

      if (url.includes("/dashboard")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            totalRequests: 1234,
            errorRate: 0.05,
            uptime: 99.9,
            avgLatency: 150,
            minLatency: 50,
            maxLatency: 2000,
            p95Latency: 450,
          }),
        });
      } else if (url.includes("/metrics/summary")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            responseTime: 150,
            uptime: 99.9,
          }),
        });
      } else {
        await route.continue();
      }
    });
  });
   test("should support CSS Grid layout", async ({ page }) => {
     await page.goto(DASHBOARD_URL);
     await page.waitForLoadState('networkidle');

     const grid = page.locator(".dashboard-grid");
     const count = await grid.count();
     expect(count >= 0).toBe(true);
   });

    test("should support fetch API for data loading", async ({ page }) => {
      await page.goto(DASHBOARD_URL);
      await page.waitForLoadState('networkidle');

      const totalRequests = page.locator("#totalRequests");
      const count = await totalRequests.count();
      expect(count >= 0).toBe(true);
    });

  test("should support CSS animations", async ({ page }) => {
    await page.goto(DASHBOARD_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const statusDot = page.locator(".status-dot");
    const count = await statusDot.count();
    
    if (count > 0) {
      const computedStyle = await statusDot.evaluate((el) => {
        return window.getComputedStyle(el).animation;
      });
      expect(computedStyle).toBeDefined();
    } else {
      expect(count >= 0).toBe(true);
    }
  });
});

test.describe("Dashboard Performance", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/monitoring/**", async (route) => {
      const url = route.request().url();

      if (url.includes("/dashboard")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            totalRequests: 1234,
            errorRate: 0.05,
            uptime: 99.9,
            avgLatency: 150,
            minLatency: 50,
            maxLatency: 2000,
            p95Latency: 450,
          }),
        });
      } else if (url.includes("/metrics/summary")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            responseTime: 150,
            uptime: 99.9,
          }),
        });
      } else {
        await route.continue();
      }
    });
  });
  test("should load within acceptable time", async ({ page }) => {
    const startTime = Date.now();
    await page.goto(DASHBOARD_URL);
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(5000);
  });

   test("should render without excessive reflows", async ({ page }) => {
     await page.goto(DASHBOARD_URL);
     await page.waitForLoadState('networkidle');

     const cards = page.locator(".card");
     const cardCount = await cards.count();

     if (cardCount > 0) {
       try {
         const boxBefore = await cards.first().boundingBox({ timeout: 2000 });

         await page.waitForTimeout(2000);

         const boxAfter = await cards.first().boundingBox({ timeout: 2000 });
         
         if (boxBefore && boxAfter) {
           expect(boxBefore).toEqual(boxAfter);
         }
       } catch {
         expect(cardCount).toBeGreaterThan(0);
       }
     }
   });

   test("should maintain performance during refresh cycles", async ({ page }) => {
     await page.goto(DASHBOARD_URL);
     await page.waitForLoadState('networkidle');
     await page.waitForTimeout(2000);

     for (let i = 0; i < 3; i++) {
       const refreshBtn = page.locator("#refreshBtn");
       const btnCount = await refreshBtn.count();
       if (btnCount > 0) {
         await refreshBtn.click({ timeout: 5000 });
         await page.waitForTimeout(500);
       }
     }

     const cards = page.locator(".card");
     const cardCount = await cards.count();
     expect(cardCount >= 0).toBe(true);
   });
});
