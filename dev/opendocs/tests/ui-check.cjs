
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to http://localhost:5176...');
    await page.goto('http://localhost:5176');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of homepage
    await page.screenshot({ path: 'homepage.png' });
    console.log('Screenshot saved: homepage.png');
    
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check if we are on the welcome page
    const bodyText = await page.textContent('body');
    console.log('Body text preview:', bodyText.substring(0, 200));

    // Focus on the last paragraph to insert blocks
    // We assume there is at least one paragraph block from default state
    // Try to find any block first
    const blocks = page.locator('.group.relative');
    const count = await blocks.count();
    console.log(`Found ${count} blocks`);
    
    if (count === 0) {
        console.log('No blocks found. Dumping HTML...');
        const html = await page.content();
        fs.writeFileSync('page_dump.html', html);
        throw new Error('No blocks found on page');
    }

    const lastParagraph = page.locator('textarea').last();
    await lastParagraph.click();
    await lastParagraph.fill('');
    await lastParagraph.press('/');
    
    // 1. Test AI Block Creation
    console.log('Testing AI Block creation...');
    await page.click('button:has-text("AI Prompt")');
    await page.waitForSelector('text="AI Block Creator"');
    await page.screenshot({ path: 'ai-block.png' });
    console.log('AI Block visible. Screenshot saved: ai-block.png');

    // Insert new block for next test
    // We need to click outside or create a new block. 
    // Let's try to click the "Add block" button if it exists, or just press Enter in a text block.
    // But we just replaced the text block with AI block.
    // Let's find the "New Page" button to start fresh or just add another block.
    // Actually, `AiPromptBlockView` is a block. We can try to add another block after it.
    // But simpler is to just reload or use a new page.
    // Let's just use the same page and append.
    
    // Wait, how to append? Usually Enter at end of block or hover to see "+" button.
    // Let's try to find a way to add a block.
    // The `useDocsStore` has `addBlockAfter`.
    // In UI, maybe there is a "+" button on hover?
    // Let's look at `BlockRenderer` or `PageEditor`.
    // Assuming we can just click on the page background or something?
    // Let's just reload the page to reset state? No, state is persisted.
    // We can just use the slash menu again if we can find a text block.
    // If we replaced the only text block, we might be stuck unless we can create a new one.
    
    // Let's try to create a new page.
    console.log('Creating new page...');
    await page.click('button:has-text("New page")'); // Button with text "New page"
    // Wait for new page to load (it should be immediate)
    await page.waitForTimeout(500);
    
    // 2. Test n8n Block
    console.log('Testing n8n Block...');
    const newPageParagraph = page.locator('textarea').first();
    await newPageParagraph.click();
    await newPageParagraph.fill('');
    await newPageParagraph.press('/');
    await page.click('button:has-text("n8n Node")');
    // Wait for the block to appear. It has an input with value "n8n Node"
    await page.waitForSelector('input[value="n8n Node"]'); 
    await page.screenshot({ path: 'n8n-block.png' });
    console.log('n8n Block visible. Screenshot saved: n8n-block.png');

    // 3. Test Database Block
    console.log('Testing Database Block...');
    // Create another page for clean slate
    await page.click('button:has-text("New page")');
    await page.waitForTimeout(500);
    const dbPageParagraph = page.locator('textarea').first();
    await dbPageParagraph.click();
    await dbPageParagraph.fill('');
    await dbPageParagraph.press('/');
    await page.click('button:has-text("Database")');
    await page.waitForSelector('button:has-text("Graph")');
    await page.screenshot({ path: 'database-block.png' });
    console.log('Database Block with Graph view visible. Screenshot saved: database-block.png');

    // 4. Test AI Chat Icon
    console.log('Testing AI Chat Icon...');
    // Hover over the database block (or any block)
    // The block wrapper usually has `group` class.
    // We can hover over the block content.
    await page.hover('input[value="Database"]'); // Hover over title input
    await page.waitForSelector('button[title="AI Block Chat"]');
    await page.screenshot({ path: 'ai-chat-icon.png' });
    console.log('AI Chat Icon visible. Screenshot saved: ai-chat-icon.png');

  } catch (error) {
    console.error('Test failed:', error);
    await page.screenshot({ path: 'error.png' });
  } finally {
    await browser.close();
  }
})();
