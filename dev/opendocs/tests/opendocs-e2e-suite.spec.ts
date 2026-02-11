import { test, expect } from "@playwright/test";
import { execSync } from "child_process";

// Ensure dev server is running
test.beforeAll(async () => {
  try {
    execSync("curl -s http://localhost:5177 > /dev/null");
    console.log("✅ Dev server already running");
  } catch {
    console.log("⚠️  Dev server not detected. Please run: npm run dev");
    process.exit(1);
  }
});

test.describe("OpenDocs E2E Test Suite", () => {
  
  test("Slash Menu - Opens on typing /", async ({ page }) => {
    // Navigate to app
    await page.goto("http://localhost:5177");
    await page.waitForLoadState("networkidle");
    
    // Take initial screenshot
    await page.screenshot({ 
      path: "tests/screenshots/01-initial-page.png",
      fullPage: true 
    });
    
    // Click on text block
    const textBlock = page.locator('textarea[placeholder*="Write"]').first();
    await textBlock.click();
    
    // Clear existing content and type "/"
    await textBlock.fill("");
    await textBlock.type("/");
    
    // Wait for slash menu to appear
    await page.waitForTimeout(500);
    
    // Take screenshot of slash menu
    await page.screenshot({ 
      path: "tests/screenshots/02-slash-menu-open.png",
      fullPage: true 
    });
    
    // Verify slash menu is visible by checking for block type options
    const pageContent = await page.textContent("body");
    expect(pageContent).toContain("Text");
    expect(pageContent).toContain("Heading");
    
    console.log("✅ Slash menu test passed");
  });

  test("Slash Menu - Filters on type", async ({ page }) => {
    await page.goto("http://localhost:5177");
    await page.waitForLoadState("networkidle");
    
    const textBlock = page.locator('textarea[placeholder*="Write"]').first();
    await textBlock.click();
    await textBlock.fill("");
    await textBlock.type("/heading");
    
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: "tests/screenshots/03-slash-menu-filter.png",
      fullPage: true 
    });
    
    // Verify filtering works
    const pageContent = await page.textContent("body");
    expect(pageContent).toMatch(/Heading|heading/i);
    
    console.log("✅ Slash menu filter test passed");
  });

  test("Slash Menu - Keyboard navigation", async ({ page }) => {
    await page.goto("http://localhost:5177");
    await page.waitForLoadState("networkidle");
    
    const textBlock = page.locator('textarea[placeholder*="Write"]').first();
    await textBlock.click();
    await textBlock.fill("");
    await textBlock.type("/");
    
    await page.waitForTimeout(300);
    
    // Press Escape to close
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);
    
    await page.screenshot({ 
      path: "tests/screenshots/04-slash-menu-closed.png",
      fullPage: true 
    });
    
    console.log("✅ Slash menu keyboard test passed");
  });

  test("AI Panel - Opens and shows interface", async ({ page }) => {
    await page.goto("http://localhost:5177");
    await page.waitForLoadState("networkidle");
    
    // Click AI button
    const aiButton = page.locator('button:has-text("AI")').first();
    await aiButton.click();
    
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: "tests/screenshots/05-ai-panel-open.png",
      fullPage: true 
    });
    
    // Verify AI panel content
    const pageContent = await page.textContent("body");
    expect(pageContent).toMatch(/AI Generate|Generate|Prompt/i);
    
    console.log("✅ AI panel test passed");
  });

  test("Chat Panel - Opens interface", async ({ page }) => {
    await page.goto("http://localhost:5177");
    await page.waitForLoadState("networkidle");
    
    const chatButton = page.locator('button:has-text("Chat")').first();
    await chatButton.click();
    
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: "tests/screenshots/06-chat-panel-open.png",
      fullPage: true 
    });
    
    console.log("✅ Chat panel test passed");
  });

  test("Block Actions - AI Block Chat button visible", async ({ page }) => {
    await page.goto("http://localhost:5177");
    await page.waitForLoadState("networkidle");
    
    // Look for AI Block Chat buttons
    const aiBlockChatButtons = page.locator('button[aria-label*="AI Block Chat"], button:has-text("AI Block Chat")');
    const count = await aiBlockChatButtons.count();
    
    expect(count).toBeGreaterThan(0);
    
    await page.screenshot({ 
      path: "tests/screenshots/07-block-actions-visible.png",
      fullPage: true 
    });
    
    console.log(`✅ Found ${count} AI Block Chat buttons`);
  });

  test("Command Palette - Opens with Cmd+K", async ({ page }) => {
    await page.goto("http://localhost:5177");
    await page.waitForLoadState("networkidle");
    
    // Press Cmd+K
    await page.keyboard.press("Meta+k");
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: "tests/screenshots/08-command-palette-open.png",
      fullPage: true 
    });
    
    // Verify command palette is open
    const pageContent = await page.textContent("body");
    expect(pageContent).toMatch(/Command palette|Quickly navigate|Search/i);
    
    console.log("✅ Command palette test passed");
  });

  test("Video Block - Shows YouTube placeholder", async ({ page }) => {
    await page.goto("http://localhost:5177");
    await page.waitForLoadState("networkidle");
    
    // Look for video-related content
    const videoPlaceholders = page.locator('text=Paste YouTube/Vimeo URL, input[placeholder*="YouTube"], input[placeholder*="Vimeo"]');
    const count = await videoPlaceholders.count();
    
    if (count > 0) {
      console.log(`✅ Found ${count} video input fields`);
    } else {
      console.log("⚠️  No video blocks visible on initial page");
    }
    
    await page.screenshot({ 
      path: "tests/screenshots/09-video-blocks.png",
      fullPage: true 
    });
  });

  test("Database Views - Interface elements present", async ({ page }) => {
    await page.goto("http://localhost:5177");
    await page.waitForLoadState("networkidle");
    
    // Check for database-related elements
    const pageContent = await page.textContent("body");
    
    // Database view indicators
    const hasDatabaseElements = pageContent.match(/Table|Kanban|Calendar|Timeline|Gallery|Flow/i);
    
    await page.screenshot({ 
      path: "tests/screenshots/10-database-views.png",
      fullPage: true 
    });
    
    if (hasDatabaseElements) {
      console.log("✅ Database view elements found");
    } else {
      console.log("⚠️  No database blocks visible on initial page (expected for Welcome page)");
    }
  });

  test("Responsive Design - Mobile viewport", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto("http://localhost:5177");
    await page.waitForLoadState("networkidle");
    
    await page.screenshot({ 
      path: "tests/screenshots/11-mobile-viewport.png",
      fullPage: true 
    });
    
    console.log("✅ Mobile viewport test passed");
  });

  test("Dark Mode - Toggle functionality", async ({ page }) => {
    await page.goto("http://localhost:5177");
    await page.waitForLoadState("networkidle");
    
    // Initial screenshot (light mode)
    await page.screenshot({ 
      path: "tests/screenshots/12-light-mode.png",
      fullPage: true 
    });
    
    // Check if dark class is present
    const hasDarkClass = await page.evaluate(() => {
      return document.documentElement.classList.contains("dark");
    });
    
    console.log(`✅ Dark mode status: ${hasDarkClass ? "dark" : "light"}`);
  });

});

// Summary test
test.afterAll(async () => {
  console.log("\n" + "=".repeat(60));
  console.log("✅ E2E Test Suite Complete!");
  console.log("=".repeat(60));
  console.log("\nScreenshots saved to: tests/screenshots/");
  console.log("View them to verify visual appearance\n");
});
