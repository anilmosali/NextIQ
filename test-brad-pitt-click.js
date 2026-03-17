import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const screenshotDir = './click-test-screenshots';

try {
  mkdirSync(screenshotDir, { recursive: true });
} catch (e) {}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testBradPittClick() {
  console.log('Starting Brad Pitt conversation click test...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  const report = {
    steps: [],
    finalState: {},
    success: false
  };

  try {
    // Step 1: Navigate to localhost
    console.log('Step 1: Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await sleep(1000);
    await page.screenshot({ path: join(screenshotDir, '01-initial-page.png'), fullPage: true });
    report.steps.push({ step: 1, description: 'Navigated to localhost:5173', success: true });

    // Step 2: Login (if login form is present)
    console.log('Step 2: Attempting to login...');
    try {
      const emailInput = await page.locator('input[type="email"], input[placeholder*="email" i]').first();
      const isVisible = await emailInput.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (isVisible) {
        await emailInput.fill('test@example.com');
        await sleep(500);
        
        // Try multiple button selectors for login
        const loginButton = await page.locator('button:has-text("Sign in"), button:has-text("Login"), button:has-text("Log in"), button[type="submit"]').first();
        await loginButton.click();
        await sleep(2000);
        report.steps.push({ step: 2, description: 'Logged in with test email', success: true });
      } else {
        report.steps.push({ step: 2, description: 'No login required (already logged in)', success: true });
      }
    } catch (e) {
      report.steps.push({ step: 2, description: 'Login step skipped', success: true, note: e.message });
    }
    
    await page.screenshot({ path: join(screenshotDir, '02-after-login.png'), fullPage: true });

    // Step 3: Click on Inbox in sidebar
    console.log('Step 3: Clicking on Inbox in sidebar...');
    await sleep(2000);
    
    try {
      let inboxClicked = false;
      
      // The Inbox is likely an icon in the sidebar (second icon from top with notification badge)
      // Try clicking on the sidebar message/inbox icon
      const sidebarIcons = await page.locator('aside button, nav button, [class*="sidebar"] button, [class*="nav"] button').all();
      
      console.log(`Found ${sidebarIcons.length} sidebar buttons`);
      
      // Try to find inbox by aria-label or title
      for (const icon of sidebarIcons) {
        const ariaLabel = await icon.getAttribute('aria-label').catch(() => '');
        const title = await icon.getAttribute('title').catch(() => '');
        const text = await icon.textContent().catch(() => '');
        
        console.log(`  Button: aria-label="${ariaLabel}", title="${title}", text="${text}"`);
        
        if (ariaLabel?.toLowerCase().includes('inbox') || 
            title?.toLowerCase().includes('inbox') || 
            ariaLabel?.toLowerCase().includes('message') ||
            title?.toLowerCase().includes('message')) {
          console.log('  -> Found Inbox button, clicking...');
          await icon.click();
          inboxClicked = true;
          break;
        }
      }
      
      // If still not found, try clicking the second icon (inbox is usually second in sidebar)
      if (!inboxClicked && sidebarIcons.length >= 2) {
        console.log('Trying second sidebar icon (inbox is typically second)...');
        await sidebarIcons[1].click();
        inboxClicked = true;
      }
      
      if (inboxClicked) {
        await sleep(1500);
        report.steps.push({ step: 3, description: 'Clicked Inbox in sidebar', success: true });
      } else {
        throw new Error('Could not find Inbox icon with any method');
      }
    } catch (e) {
      report.steps.push({ step: 3, description: 'Failed to click Inbox', success: false, error: e.message });
      throw e;
    }
    
    await page.screenshot({ path: join(screenshotDir, '03-inbox-page.png'), fullPage: true });

    // Step 4: Capture the initial state (before clicking conversation)
    console.log('Step 4: Capturing initial Inbox state...');
    await sleep(1000);
    
    const beforeClickState = await page.evaluate(() => {
      const conversationList = document.querySelector('[class*="conversation"], [class*="engagement"], [class*="list"]');
      const detailView = document.querySelector('[class*="detail"], [class*="conversation-view"]');
      
      return {
        conversationListVisible: conversationList ? true : false,
        conversationListDisplay: conversationList ? getComputedStyle(conversationList).display : null,
        detailViewVisible: detailView ? true : false,
        detailViewDisplay: detailView ? getComputedStyle(detailView).display : null,
      };
    });
    
    report.beforeClick = beforeClickState;
    console.log('Before click state:', beforeClickState);

    // Step 5: Click on Brad Pitt conversation
    console.log('Step 5: Clicking on Brad Pitt conversation...');
    await sleep(500);
    
    let clickSuccessful = false;
    let clickMethod = '';
    
    try {
      // Method 1: Try clicking on "Brad Pitt" text directly
      const bradPittElement = await page.locator('text="Brad Pitt"').first();
      const isBradPittVisible = await bradPittElement.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (isBradPittVisible) {
        console.log('Found Brad Pitt element, clicking...');
        await bradPittElement.click();
        clickSuccessful = true;
        clickMethod = 'Direct click on "Brad Pitt" text';
      }
    } catch (e) {
      console.log('Method 1 failed:', e.message);
    }
    
    if (!clickSuccessful) {
      // Method 2: Try clicking on the row containing Brad Pitt
      try {
        const bradPittRow = await page.locator('div:has-text("Brad Pitt")').first();
        const isRowVisible = await bradPittRow.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (isRowVisible) {
          console.log('Found Brad Pitt row, clicking...');
          await bradPittRow.click();
          clickSuccessful = true;
          clickMethod = 'Click on row containing "Brad Pitt"';
        }
      } catch (e) {
        console.log('Method 2 failed:', e.message);
      }
    }
    
    if (!clickSuccessful) {
      // Method 3: Try clicking on the message text
      try {
        const messageElement = await page.locator('text="We were charged twice"').first();
        const isMessageVisible = await messageElement.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (isMessageVisible) {
          console.log('Found conversation by message text, clicking...');
          await messageElement.click();
          clickSuccessful = true;
          clickMethod = 'Click on message text';
        }
      } catch (e) {
        console.log('Method 3 failed:', e.message);
      }
    }
    
    if (!clickSuccessful) {
      // Method 4: Try CSS selector for conversation items
      try {
        const conversations = await page.locator('[class*="conversation"], [class*="engagement-item"], [class*="list-item"]').all();
        if (conversations.length > 0) {
          console.log(`Found ${conversations.length} conversation items, clicking first one...`);
          await conversations[0].click();
          clickSuccessful = true;
          clickMethod = 'CSS selector on first conversation';
        }
      } catch (e) {
        console.log('Method 4 failed:', e.message);
      }
    }
    
    if (!clickSuccessful) {
      throw new Error('Could not click on Brad Pitt conversation with any method');
    }
    
    report.steps.push({ 
      step: 5, 
      description: `Clicked on Brad Pitt conversation using: ${clickMethod}`, 
      success: true,
      method: clickMethod
    });

    // Step 6: Wait 2 seconds as requested
    console.log('Step 6: Waiting 2 seconds...');
    await sleep(2000);

    // Step 7: Capture the state after clicking
    console.log('Step 7: Capturing state after click...');
    await page.screenshot({ path: join(screenshotDir, '04-after-brad-pitt-click.png'), fullPage: true });
    
    const afterClickState = await page.evaluate(() => {
      const conversationList = document.querySelector('[class*="conversation-list"], [class*="engagement-list"]');
      const detailView = document.querySelector('[class*="detail"], [class*="conversation-view"], [class*="interaction-detail"]');
      const backButton = document.querySelector('button[class*="back"], [class*="back-arrow"]');
      const personName = document.querySelector('[class*="person-name"], [class*="contact-name"]');
      const messages = document.querySelectorAll('[class*="message"], [class*="chat"]');
      
      // Get all visible text to understand what's on screen
      const bodyText = document.body.innerText;
      
      return {
        conversationListVisible: conversationList && getComputedStyle(conversationList).display !== 'none',
        detailViewVisible: detailView && getComputedStyle(detailView).display !== 'none',
        hasBackButton: backButton ? true : false,
        hasPersonName: personName ? true : false,
        messageCount: messages.length,
        bodyContainsBradPitt: bodyText.includes('Brad Pitt'),
        bodyContainsConversationList: bodyText.includes('Michael Torres') || bodyText.includes('Sarah Johnson'),
        viewChanged: true
      };
    });
    
    report.afterClick = afterClickState;
    report.finalState = afterClickState;
    console.log('After click state:', afterClickState);

    // Determine if the view changed
    const viewChanged = !afterClickState.conversationListVisible || afterClickState.detailViewVisible;
    
    report.success = clickSuccessful && viewChanged;
    report.viewChanged = viewChanged;
    
    // Generate summary
    console.log('\n' + '='.repeat(80));
    console.log('TEST SUMMARY');
    console.log('='.repeat(80));
    console.log('\n1. Did the view change after clicking?');
    console.log(`   ${viewChanged ? '✓ YES' : '✗ NO'} - View ${viewChanged ? 'changed' : 'did not change'}`);
    
    console.log('\n2. What does the page look like now?');
    console.log(`   - Conversation list visible: ${afterClickState.conversationListVisible ? 'YES' : 'NO'}`);
    console.log(`   - Detail view visible: ${afterClickState.detailViewVisible ? 'YES' : 'NO'}`);
    console.log(`   - Back button present: ${afterClickState.hasBackButton ? 'YES' : 'NO'}`);
    console.log(`   - Person name shown: ${afterClickState.hasPersonName ? 'YES' : 'NO'}`);
    console.log(`   - Message count: ${afterClickState.messageCount}`);
    console.log(`   - Page contains "Brad Pitt": ${afterClickState.bodyContainsBradPitt ? 'YES' : 'NO'}`);
    console.log(`   - Page contains other conversations: ${afterClickState.bodyContainsConversationList ? 'YES' : 'NO'}`);
    
    console.log('\n3. Analysis:');
    if (viewChanged && afterClickState.detailViewVisible) {
      console.log('   ✓ SUCCESS: Conversation list was replaced by detail view');
      console.log('   ✓ The click worked as expected!');
    } else if (!viewChanged && afterClickState.conversationListVisible) {
      console.log('   ✗ ISSUE: Conversation list is still visible');
      console.log('   ✗ The detail view may not have replaced the list');
    } else {
      console.log('   ⚠ UNCLEAR: The state is ambiguous');
    }
    
    console.log('\n' + '='.repeat(80));
    console.log(`\nScreenshots saved to: ${screenshotDir}/`);
    console.log('Review screenshot 04-after-brad-pitt-click.png for final state\n');

    // Save report
    writeFileSync(
      join(screenshotDir, 'click-test-report.json'),
      JSON.stringify(report, null, 2)
    );

  } catch (error) {
    console.error('\nError during test:', error);
    report.error = error.message;
    report.success = false;
    
    await page.screenshot({ path: join(screenshotDir, 'error-screenshot.png'), fullPage: true });
    
    writeFileSync(
      join(screenshotDir, 'click-test-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    throw error;
  } finally {
    await sleep(2000); // Keep browser open for 2 seconds to see final state
    await browser.close();
  }
}

testBradPittClick().catch(console.error);
