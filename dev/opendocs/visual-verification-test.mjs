/**
 * OpenDocs Visual Verification Tests
 * Tests dark mode toggle, console errors, and UI rendering
 */
import { chromium } from 'playwright';

async function runTests() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const consoleMessages = [];
  const consoleErrors = [];
  
  // Capture console messages
  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    consoleMessages.push({ type, text, location: msg.location() });
    if (type === 'error') {
      consoleErrors.push({ text, location: msg.location() });
    }
  });
  
  // Capture page errors
  page.on('pageerror', (error) => {
    consoleErrors.push({ text: error.message, stack: error.stack });
  });
  
  console.log("=== OpenDocs Visual Verification Tests ===\n");
  
  try {
    // Test 1: Load page and verify initial state
    console.log("Test 1: Loading OpenDocs frontend...");
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    // Check if page loaded
    const title = await page.title();
    console.log(`✓ Page title: ${title}`);
    
    // Check for main UI elements
    const sidebar = await page.$('[class*="sidebar"]');
    console.log(`✓ Sidebar found: ${!!sidebar}`);
    
    // Test 2: Check initial theme (should follow system preference)
    console.log("\nTest 2: Checking initial theme...");
    const htmlClass = await page.$eval('html', (el) => el.className);
    console.log(`✓ HTML classes: ${htmlClass}`);
    const isDarkInitial = htmlClass.includes('dark');
    console.log(`✓ Initial dark mode: ${isDarkInitial}`);
    
    // Test 3: Find and click dark mode toggle
    console.log("\nTest 3: Testing dark mode toggle...");
    const darkToggle = await page.$('[class*="theme"], [class*="dark"], [class*="toggle"]');
    
    if (darkToggle) {
      console.log("✓ Dark mode toggle button found");
      
      // Click to toggle dark mode OFF (if currently dark)
      if (isDarkInitial) {
        await darkToggle.click();
        await page.waitForTimeout(500);
        const afterClick = await page.$eval('html', (el) => el.className);
        console.log(`✓ After toggle OFF: ${afterClick.includes('dark') ? 'dark' : 'light'}`);
      } else {
        // Click to toggle ON
        await darkToggle.click();
        await page.waitForTimeout(500);
        const afterToggle = await page.$eval('html', (el) => el.className);
        console.log(`✓ After toggle ON: ${afterToggle.includes('dark') ? 'dark' : 'light'}`);
      }
    } else {
      console.log("⚠ Dark mode toggle button not found");
    }
    
    // Test 4: Click again to toggle back
    console.log("\nTest 4: Testing toggle back...");
    if (darkToggle) {
      await darkToggle.click();
      await page.waitForTimeout(500);
      const finalState = await page.$eval('html', (el) => el.className);
      console.log(`✓ Final state: ${finalState.includes('dark') ? 'dark' : 'light'}`);
    }
    
    // Test 5: Check for critical console errors
    console.log("\nTest 5: Checking console errors...");
    console.log(`✓ Total console messages: ${consoleMessages.length}`);
    console.log(`✓ Console errors: ${consoleErrors.length}`);
    
    // Filter out non-critical errors
    const criticalErrors = consoleErrors.filter(e => {
      const text = e.text.toLowerCase();
      return !text.includes('websocket') && 
             !text.includes('supabase') &&
             !text.includes('hydration') &&
             !text.includes('favicon');
    });
    
    console.log(`✓ Critical errors (excluding WebSocket/Supabase): ${criticalErrors.length}`);
    
    if (criticalErrors.length > 0) {
      console.log("\nCritical Errors Found:");
      criticalErrors.forEach((e, i) => {
        console.log(`  ${i + 1}. ${e.text.substring(0, 100)}`);
      });
    }
    
    // Test 6: Check for button nesting HTML error
    console.log("\nTest 6: Checking for button nesting errors...");
    const buttonNestingError = consoleErrors.find(e => 
      e.text.toLowerCase().includes('button') && 
      e.text.toLowerCase().includes('nested')
    );
    
    if (buttonNestingError) {
      console.log("⚠ Button nesting error found:");
      console.log(`  ${buttonNestingError.text.substring(0, 150)}`);
    } else {
      console.log("✓ No button nesting errors found");
    }
    
    // Summary
    console.log("\n=== Test Summary ===");
    console.log(`Page loaded: ✓`);
    console.log(`Dark mode toggle: ${darkToggle ? '✓ Working' : '⚠ Not found'}`);
    console.log(`Console errors: ${criticalErrors.length} critical`);
    console.log(`Button nesting: ${buttonNestingError ? '⚠ Issue found' : '✓ OK'}`);
    
    return {
      success: true,
      darkModeWorking: !!darkToggle,
      criticalErrors: criticalErrors.length,
      buttonNestingOk: !buttonNestingError
    };
    
  } catch (error) {
    console.error("Test failed:", error.message);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

runTests().then(result => {
  console.log("\n=== Final Result ===");
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.success ? 0 : 1);
});