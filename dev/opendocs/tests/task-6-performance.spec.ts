import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173";

test.describe("Task 6: Performance Testing", () => {
  
  test("Performance Metrics", async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");
    
    const loadTime = Date.now() - startTime;
    
    // Check console for errors
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    
    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      return {
        loadTime: nav?.loadEventEnd - nav?.startTime,
        domContentLoaded: nav?.domContentLoadedEventEnd - nav?.startTime,
      };
    });
    
    console.log({
      loadTime: `${loadTime}ms`,
      navigationLoadTime: `${metrics.loadTime}ms`,
      domContentLoaded: `${metrics.domContentLoaded}ms`,
      consoleErrors: errors.length,
    });
    
    // Assertions
    expect(loadTime).toBeLessThan(3000);
    expect(errors.length).toBeLessThan(10);
    
    await page.screenshot({ 
      path: ".sisyphus/evidence/task-6-performance.png",
      fullPage: true 
    });
  });

});
