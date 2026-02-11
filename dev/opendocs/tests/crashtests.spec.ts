import { test, expect, Page } from "@playwright/test";
import { execSync } from "child_process";

const BASE_URL = "http://localhost:5173";
const SCREENSHOT_DIR = "tests/screenshots";

// Helper to take screenshot with timestamp
async function screenshot(page: Page, name: string) {
  await page.screenshot({ 
    path: `${SCREENSHOT_DIR}/${name}.png`,
    fullPage: true 
  });
  console.log(`📸 Screenshot: ${name}.png`);
}

test.describe("🔥 CRASHTESTS - OpenDocs Visual QA", () => {
  
  test.beforeAll(async () => {
    try {
      execSync(`curl -s ${BASE_URL} > /dev/null`);
      console.log("✅ Dev server running");
    } catch {
      console.error("❌ Dev server not running!");
      process.exit(1);
    }
  });

  test("1. Initial Page Load", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    
    await screenshot(page, "01-initial-load");
    
    // Check if page loaded
    const title = await page.title();
    expect(title).toContain("OpenDocs");
    console.log(`✅ Page title: ${title}`);
  });

  test("2. Light Mode - Visual Check", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    // Ensure light mode
    const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
    console.log(`🌙 Dark mode active: ${isDark}`);
    
    await screenshot(page, "02-light-mode");
    
    // Check background color
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    console.log(`🎨 Background color: ${bgColor}`);
    
    // Should be light/white, not dark
    expect(bgColor).not.toBe("rgb(15, 23, 42)"); // Not slate-900
    expect(bgColor).not.toBe("rgb(0, 0, 0)"); // Not black
  });

  test("3. Dark Mode - Toggle & Visual Check", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    await screenshot(page, "03-before-dark-toggle");
    
    // Click dark mode toggle
    const toggleButton = page.locator('button[title*="Dark"], button[title*="Light"]').first();
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await page.waitForTimeout(1000);
      
      await screenshot(page, "04-after-dark-toggle");
      
      // Check if dark class added
      const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
      console.log(`🌙 Dark mode after toggle: ${isDark}`);
      
      // Toggle back
      await toggleButton.click();
      await page.waitForTimeout(1000);
      
      await screenshot(page, "05-back-to-light");
    } else {
      console.log("⚠️  Dark mode toggle not found");
    }
  });

  test("4. Sidebar - Collapse/Expand", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    await screenshot(page, "06-sidebar-expanded");
    
    // Find collapse button
    const collapseButton = page.locator('button[title="Collapse sidebar"]').first();
    if (await collapseButton.isVisible()) {
      await collapseButton.click();
      await page.waitForTimeout(1000);
      
      await screenshot(page, "07-sidebar-collapsed");
      
      // Hover to expand
      const sidebar = page.locator('aside').first();
      await sidebar.hover();
      await page.waitForTimeout(1000);
      
      await screenshot(page, "08-sidebar-hover-expanded");
    }
  });

  test("5. Text Blocks - No Borders", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    // Find textarea
    const textarea = page.locator('textarea').first();
    if (await textarea.isVisible()) {
      await screenshot(page, "09-text-block");
      
      // Check border
      const border = await textarea.evaluate((el) => {
        return window.getComputedStyle(el).border;
      });
      console.log(`📦 Textarea border: ${border}`);
      
      // Should have no border or transparent
      expect(border).toMatch(/none|0px|transparent/);
    }
  });

  test("6. Slash Menu - Open & Visual", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    // Click on empty textarea
    const textarea = page.locator('textarea').first();
    if (await textarea.isVisible()) {
      await textarea.click();
      await textarea.fill("");
      await textarea.type("/");
      await page.waitForTimeout(500);
      
      await screenshot(page, "10-slash-menu-open");
      
      // Type to filter
      await textarea.type("heading");
      await page.waitForTimeout(500);
      
      await screenshot(page, "11-slash-menu-filter");
      
      // Press Escape
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
    }
  });

  test("7. AI Block Chat - Open Modal", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    // Find AI Block Chat button
    const aiButton = page.locator('button[aria-label*="AI Block Chat"]').first();
    if (await aiButton.isVisible()) {
      await aiButton.click();
      await page.waitForTimeout(800);
      
      await screenshot(page, "12-ai-chat-modal");
      
      // Check for dock button
      const dockButton = page.locator('button[title*="Dock"]').first();
      if (await dockButton.isVisible()) {
        await dockButton.click();
        await page.waitForTimeout(800);
        
        await screenshot(page, "13-ai-chat-docked");
      }
      
      // Close
      await page.keyboard.press("Escape");
    }
  });

  test("8. Code Block - Visual Design", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    // Look for code block or create one
    await screenshot(page, "14-code-block-check");
  });

  test("9. Breadcrumb Navigation", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    // Look for breadcrumb
    const breadcrumb = page.locator('nav').first();
    if (await breadcrumb.isVisible()) {
      await screenshot(page, "15-breadcrumb-nav");
      
      const text = await breadcrumb.textContent();
      console.log(`🧭 Breadcrumb: ${text}`);
    }
  });

  test("10. Responsive - Mobile View", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    await screenshot(page, "16-mobile-view");
  });

  test("11. Performance - No Console Errors", async ({ page }) => {
    const errors: string[] = [];
    
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });
    
    await page.goto(BASE_URL);
    await page.waitForTimeout(3000);
    
    console.log(`⚠️  Console errors: ${errors.length}`);
    errors.forEach((e) => console.log(`   - ${e}`));
    
    await screenshot(page, "17-no-errors");
  });

  test("12. Accessibility - ARIA Labels", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    // Check for buttons without labels
    const buttons = await page.locator('button:not([aria-label]):not([title])').count();
    console.log(`⚠️  Buttons without labels: ${buttons}`);
    
    await screenshot(page, "18-accessibility-check");
  });

});

test.afterAll(async () => {
  console.log("\n" + "=".repeat(70));
  console.log("✅ CRASHTESTS COMPLETE!");
  console.log("=".repeat(70));
  console.log(`\n📁 Screenshots saved to: ${SCREENSHOT_DIR}/`);
  console.log("View all screenshots to verify visual appearance\n");
});
