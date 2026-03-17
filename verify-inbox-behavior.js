import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const screenshotDir = './verification-screenshots';

try {
  mkdirSync(screenshotDir, { recursive: true });
} catch (e) {}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function verifyInboxBehavior() {
  console.log('Starting Inbox behavior verification...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    slowMo: 500,
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  const page = await browser.newPage();
  const results = [];

  try {
    // Step 1: Navigate to localhost
    console.log('Step 1: Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await sleep(1000);
    await page.screenshot({ path: join(screenshotDir, '01-initial-page.png'), fullPage: true });
    results.push({ step: 1, description: 'Initial page load', status: 'success' });

    // Step 2: Login (click Login button or enter credentials)
    console.log('Step 2: Attempting to login...');
    try {
      await page.waitForSelector('button', { timeout: 2000 });
      const loginButtons = await page.$$('button');
      let loginClicked = false;
      for (const button of loginButtons) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text && text.includes('Login')) {
          await button.click();
          await sleep(1000);
          loginClicked = true;
          results.push({ step: 2, description: 'Clicked Login button', status: 'success' });
          break;
        }
      }
      if (!loginClicked) {
        results.push({ step: 2, description: 'No login required or already logged in', status: 'info' });
      }
    } catch (e) {
      results.push({ step: 2, description: 'Login step skipped (no login button found)', status: 'info' });
    }
    await page.screenshot({ path: join(screenshotDir, '02-after-login.png'), fullPage: true });

    // Step 3: Navigate to Inbox
    console.log('Step 3: Navigating to Inbox...');
    try {
      await page.waitForXPath('//*[contains(text(), "Inbox")]', { timeout: 5000 });
      const inboxElements = await page.$x('//*[contains(text(), "Inbox")]');
      if (inboxElements.length > 0) {
        await inboxElements[0].click();
        await sleep(1500);
        results.push({ step: 3, description: 'Navigated to Inbox', status: 'success' });
      }
    } catch (e) {
      results.push({ step: 3, description: 'Failed to navigate to Inbox', status: 'error', error: e.message });
    }
    await page.screenshot({ path: join(screenshotDir, '03-inbox-page.png'), fullPage: true });

    // Verification 1: Check Sidebar Structure
    console.log('\nVerification 1: Checking Sidebar Structure...');
    const sidebarChecks = {
      hasInboxHeader: false,
      hasMyInbox: false,
      hasMyInboxIcon: false,
      hasMyInboxBadge: false,
      hasTeamInboxesSection: false,
      hasSalesTeam: false,
      hasServiceTeam: false,
      hasMarketingTeam: false,
      hasContactsItem: false,
      hasInternalItem: false
    };

    try {
      const sidebar = await page.locator('[class*="sidebar"], [class*="Sidebar"]').first();
      
      // Check for "Inbox" header
      const inboxHeader = sidebar.locator('text=/^Inbox$/i').first();
      sidebarChecks.hasInboxHeader = await inboxHeader.count() > 0;
      
      // Check for "My Inbox" item
      const myInboxItem = sidebar.locator('text="My Inbox"').first();
      sidebarChecks.hasMyInbox = await myInboxItem.count() > 0;
      
      // Check for inbox icon near "My Inbox"
      if (sidebarChecks.hasMyInbox) {
        const myInboxParent = await myInboxItem.locator('..').first();
        const hasIcon = await myInboxParent.locator('svg, [class*="icon"]').count() > 0;
        sidebarChecks.hasMyInboxIcon = hasIcon;
        
        // Check for badge
        const hasBadge = await myInboxParent.locator('[class*="badge"], .badge, span[class*="count"]').count() > 0;
        sidebarChecks.hasMyInboxBadge = hasBadge;
      }
      
      // Check for "TEAM INBOXES" section
      const teamInboxesSection = sidebar.locator('text="TEAM INBOXES"').first();
      sidebarChecks.hasTeamInboxesSection = await teamInboxesSection.count() > 0;
      
      // Check for team items
      sidebarChecks.hasSalesTeam = await sidebar.locator('text="Sales"').count() > 0;
      sidebarChecks.hasServiceTeam = await sidebar.locator('text="Service"').count() > 0;
      sidebarChecks.hasMarketingTeam = await sidebar.locator('text="Marketing"').count() > 0;
      
      // Check for items that should NOT be there
      sidebarChecks.hasContactsItem = await sidebar.locator('text="Contacts"').count() > 0;
      sidebarChecks.hasInternalItem = await sidebar.locator('text=/^Internal$/i').count() > 0;
      
      results.push({ 
        step: 'V1', 
        description: 'Sidebar structure verification', 
        status: 'completed',
        details: sidebarChecks
      });
      
      console.log('Sidebar checks:', JSON.stringify(sidebarChecks, null, 2));
    } catch (e) {
      results.push({ step: 'V1', description: 'Sidebar verification failed', status: 'error', error: e.message });
    }

    // Verification 2: Initial State (No Conversation Selected)
    console.log('\nVerification 2: Checking Initial State (no conversation selected)...');
    const initialStateChecks = {
      hasEngagementList: false,
      hasFilterTabs: false,
      hasAllTab: false,
      hasUnreadTab: false,
      hasMyCustomersTab: false,
      hasInternalTab: false,
      hasChannelsTab: false,
      hasConversationRows: false,
      conversationDetailVisible: false
    };

    try {
      // Check for engagement list
      const engagementList = await page.locator('[class*="engagement"], [class*="conversation-list"], [class*="inbox-list"]').first();
      initialStateChecks.hasEngagementList = await engagementList.count() > 0;
      
      // Check for filter tabs
      const filterContainer = await page.locator('[class*="filter"], [class*="tab"]').first();
      initialStateChecks.hasFilterTabs = await filterContainer.count() > 0;
      
      if (initialStateChecks.hasFilterTabs) {
        initialStateChecks.hasAllTab = await page.locator('text="All"').count() > 0;
        initialStateChecks.hasUnreadTab = await page.locator('text="Unread"').count() > 0;
        initialStateChecks.hasMyCustomersTab = await page.locator('text="My Customers"').count() > 0;
        initialStateChecks.hasInternalTab = await page.locator('text="Internal"').count() > 0;
        initialStateChecks.hasChannelsTab = await page.locator('text="Channels"').count() > 0;
      }
      
      // Check for conversation rows
      const conversationRows = await page.locator('[class*="conversation"], [class*="engagement-item"]').count();
      initialStateChecks.hasConversationRows = conversationRows > 0;
      
      // Check that conversation detail is NOT visible
      const detailPanel = await page.locator('[class*="detail"], [class*="conversation-view"]').count();
      initialStateChecks.conversationDetailVisible = detailPanel > 0;
      
      results.push({ 
        step: 'V2', 
        description: 'Initial state verification', 
        status: 'completed',
        details: initialStateChecks
      });
      
      console.log('Initial state checks:', JSON.stringify(initialStateChecks, null, 2));
    } catch (e) {
      results.push({ step: 'V2', description: 'Initial state verification failed', status: 'error', error: e.message });
    }

    await page.screenshot({ path: join(screenshotDir, '04-initial-state-verified.png'), fullPage: true });

    // Verification 3: Click on a Conversation
    console.log('\nVerification 3: Clicking on a conversation...');
    const conversationClickChecks = {
      conversationClicked: false,
      engagementListHidden: false,
      detailViewVisible: false,
      hasBackArrow: false,
      hasPersonName: false,
      hasConversationJournalToggle: false,
      hasConversationTab: false,
      hasJournalTab: false,
      hasChatMessages: false,
      hasNextIQPanel: false
    };

    try {
      // Look for Brad Pitt or any conversation
      let conversationToClick = await page.locator('text="Brad Pitt"').first();
      if (await conversationToClick.count() === 0) {
        // If Brad Pitt not found, click first conversation
        conversationToClick = await page.locator('[class*="conversation"], [class*="engagement-item"]').first();
      }
      
      if (await conversationToClick.count() > 0) {
        await conversationToClick.click();
        await sleep(1500);
        conversationClickChecks.conversationClicked = true;
        
        await page.screenshot({ path: join(screenshotDir, '05-conversation-selected.png'), fullPage: true });
        
        // Check if engagement list is hidden
        const engagementListVisible = await page.locator('[class*="engagement-list"]').isVisible({ timeout: 1000 }).catch(() => false);
        conversationClickChecks.engagementListHidden = !engagementListVisible;
        
        // Check for detail view
        conversationClickChecks.detailViewVisible = await page.locator('[class*="detail"], [class*="conversation-view"], [class*="interaction-detail"]').count() > 0;
        
        // Check for back arrow
        conversationClickChecks.hasBackArrow = await page.locator('button:has-text("←"), button:has-text("Back"), [class*="back"]').count() > 0;
        
        // Check for person name
        conversationClickChecks.hasPersonName = await page.locator('[class*="name"], [class*="header"] >> text=/[A-Z][a-z]+ [A-Z][a-z]+/').count() > 0;
        
        // Check for Conversation/Journal toggle
        const conversationTab = await page.locator('text="Conversation"').count();
        const journalTab = await page.locator('text="Journal"').count();
        conversationClickChecks.hasConversationTab = conversationTab > 0;
        conversationClickChecks.hasJournalTab = journalTab > 0;
        conversationClickChecks.hasConversationJournalToggle = conversationTab > 0 && journalTab > 0;
        
        // Check for chat messages
        conversationClickChecks.hasChatMessages = await page.locator('[class*="message"], [class*="chat"]').count() > 0;
        
        // Check for NextIQ panel
        conversationClickChecks.hasNextIQPanel = await page.locator('text="NextIQ"').count() > 0;
        
        results.push({ 
          step: 'V3', 
          description: 'Conversation click verification', 
          status: 'completed',
          details: conversationClickChecks
        });
        
        console.log('Conversation click checks:', JSON.stringify(conversationClickChecks, null, 2));
      } else {
        results.push({ step: 'V3', description: 'No conversations found to click', status: 'warning' });
      }
    } catch (e) {
      results.push({ step: 'V3', description: 'Conversation click verification failed', status: 'error', error: e.message });
    }

    // Verification 4: Click Journal Toggle
    console.log('\nVerification 4: Clicking Journal toggle...');
    const journalChecks = {
      journalClicked: false,
      showsTimeline: false,
      hasDateGroups: false,
      hasPastInteractions: false
    };

    try {
      const journalTab = await page.locator('text="Journal"').first();
      if (await journalTab.count() > 0) {
        await journalTab.click();
        await sleep(1500);
        journalChecks.journalClicked = true;
        
        await page.screenshot({ path: join(screenshotDir, '06-journal-view.png'), fullPage: true });
        
        // Check for timeline
        journalChecks.showsTimeline = await page.locator('[class*="timeline"], [class*="journal"], [class*="history"]').count() > 0;
        
        // Check for date groups
        journalChecks.hasDateGroups = await page.locator('text=/Today|Yesterday|[A-Z][a-z]+ \\d+/').count() > 0;
        
        // Check for past interactions
        journalChecks.hasPastInteractions = await page.locator('[class*="interaction"], [class*="event"], [class*="activity"]').count() > 0;
        
        results.push({ 
          step: 'V4', 
          description: 'Journal toggle verification', 
          status: 'completed',
          details: journalChecks
        });
        
        console.log('Journal checks:', JSON.stringify(journalChecks, null, 2));
      } else {
        results.push({ step: 'V4', description: 'Journal tab not found', status: 'warning' });
      }
    } catch (e) {
      results.push({ step: 'V4', description: 'Journal verification failed', status: 'error', error: e.message });
    }

    // Verification 5: Click Back Arrow
    console.log('\nVerification 5: Clicking back arrow...');
    const backArrowChecks = {
      backArrowClicked: false,
      returnedToEngagementList: false,
      detailViewHidden: false
    };

    try {
      const backButton = await page.locator('button:has-text("←"), button:has-text("Back"), [class*="back"]').first();
      if (await backButton.count() > 0) {
        await backButton.click();
        await sleep(1500);
        backArrowChecks.backArrowClicked = true;
        
        await page.screenshot({ path: join(screenshotDir, '07-back-to-list.png'), fullPage: true });
        
        // Check if engagement list is visible again
        backArrowChecks.returnedToEngagementList = await page.locator('[class*="engagement-list"], [class*="conversation-list"]').isVisible({ timeout: 2000 }).catch(() => false);
        
        // Check if detail view is hidden
        const detailVisible = await page.locator('[class*="interaction-detail"], [class*="conversation-view"]').isVisible({ timeout: 1000 }).catch(() => false);
        backArrowChecks.detailViewHidden = !detailVisible;
        
        results.push({ 
          step: 'V5', 
          description: 'Back arrow verification', 
          status: 'completed',
          details: backArrowChecks
        });
        
        console.log('Back arrow checks:', JSON.stringify(backArrowChecks, null, 2));
      } else {
        results.push({ step: 'V5', description: 'Back button not found', status: 'warning' });
      }
    } catch (e) {
      results.push({ step: 'V5', description: 'Back arrow verification failed', status: 'error', error: e.message });
    }

    // Generate Summary Report
    console.log('\n' + '='.repeat(80));
    console.log('VERIFICATION SUMMARY');
    console.log('='.repeat(80));
    
    const summary = {
      timestamp: new Date().toISOString(),
      totalSteps: results.length,
      results: results,
      
      sidebarVerification: {
        passed: sidebarChecks.hasInboxHeader && 
                sidebarChecks.hasMyInbox && 
                sidebarChecks.hasTeamInboxesSection &&
                !sidebarChecks.hasContactsItem &&
                !sidebarChecks.hasInternalItem,
        details: sidebarChecks
      },
      
      initialStateVerification: {
        passed: initialStateChecks.hasEngagementList && 
                initialStateChecks.hasFilterTabs &&
                !initialStateChecks.conversationDetailVisible,
        details: initialStateChecks
      },
      
      conversationClickVerification: {
        passed: conversationClickChecks.conversationClicked &&
                conversationClickChecks.detailViewVisible &&
                conversationClickChecks.hasBackArrow &&
                conversationClickChecks.hasConversationJournalToggle,
        details: conversationClickChecks
      },
      
      journalVerification: {
        passed: journalChecks.journalClicked && journalChecks.showsTimeline,
        details: journalChecks
      },
      
      backArrowVerification: {
        passed: backArrowChecks.backArrowClicked && backArrowChecks.returnedToEngagementList,
        details: backArrowChecks
      }
    };

    // Print summary to console
    console.log('\n1. SIDEBAR VERIFICATION:', summary.sidebarVerification.passed ? '✓ PASSED' : '✗ FAILED');
    console.log('   - Inbox header:', sidebarChecks.hasInboxHeader ? '✓' : '✗');
    console.log('   - My Inbox item:', sidebarChecks.hasMyInbox ? '✓' : '✗');
    console.log('   - My Inbox icon:', sidebarChecks.hasMyInboxIcon ? '✓' : '✗');
    console.log('   - My Inbox badge:', sidebarChecks.hasMyInboxBadge ? '✓' : '✗');
    console.log('   - Team Inboxes section:', sidebarChecks.hasTeamInboxesSection ? '✓' : '✗');
    console.log('   - Sales team:', sidebarChecks.hasSalesTeam ? '✓' : '✗');
    console.log('   - Service team:', sidebarChecks.hasServiceTeam ? '✓' : '✗');
    console.log('   - Marketing team:', sidebarChecks.hasMarketingTeam ? '✓' : '✗');
    console.log('   - NO Contacts item:', !sidebarChecks.hasContactsItem ? '✓' : '✗ FOUND (should not be there)');
    console.log('   - NO Internal item:', !sidebarChecks.hasInternalItem ? '✓' : '✗ FOUND (should not be there)');
    
    console.log('\n2. INITIAL STATE VERIFICATION:', summary.initialStateVerification.passed ? '✓ PASSED' : '✗ FAILED');
    console.log('   - Engagement list visible:', initialStateChecks.hasEngagementList ? '✓' : '✗');
    console.log('   - Filter tabs present:', initialStateChecks.hasFilterTabs ? '✓' : '✗');
    console.log('   - All tab:', initialStateChecks.hasAllTab ? '✓' : '✗');
    console.log('   - Unread tab:', initialStateChecks.hasUnreadTab ? '✓' : '✗');
    console.log('   - My Customers tab:', initialStateChecks.hasMyCustomersTab ? '✓' : '✗');
    console.log('   - Internal tab:', initialStateChecks.hasInternalTab ? '✓' : '✗');
    console.log('   - Channels tab:', initialStateChecks.hasChannelsTab ? '✓' : '✗');
    console.log('   - Conversation rows:', initialStateChecks.hasConversationRows ? '✓' : '✗');
    console.log('   - Detail view hidden:', !initialStateChecks.conversationDetailVisible ? '✓' : '✗ VISIBLE (should be hidden)');
    
    console.log('\n3. CONVERSATION CLICK VERIFICATION:', summary.conversationClickVerification.passed ? '✓ PASSED' : '✗ FAILED');
    console.log('   - Conversation clicked:', conversationClickChecks.conversationClicked ? '✓' : '✗');
    console.log('   - Engagement list hidden:', conversationClickChecks.engagementListHidden ? '✓' : '✗');
    console.log('   - Detail view visible:', conversationClickChecks.detailViewVisible ? '✓' : '✗');
    console.log('   - Back arrow present:', conversationClickChecks.hasBackArrow ? '✓' : '✗');
    console.log('   - Person name shown:', conversationClickChecks.hasPersonName ? '✓' : '✗');
    console.log('   - Conversation/Journal toggle:', conversationClickChecks.hasConversationJournalToggle ? '✓' : '✗');
    console.log('   - Chat messages:', conversationClickChecks.hasChatMessages ? '✓' : '✗');
    console.log('   - NextIQ panel:', conversationClickChecks.hasNextIQPanel ? '✓' : '✗');
    
    console.log('\n4. JOURNAL TOGGLE VERIFICATION:', summary.journalVerification.passed ? '✓ PASSED' : '✗ FAILED');
    console.log('   - Journal clicked:', journalChecks.journalClicked ? '✓' : '✗');
    console.log('   - Timeline shown:', journalChecks.showsTimeline ? '✓' : '✗');
    console.log('   - Date groups:', journalChecks.hasDateGroups ? '✓' : '✗');
    console.log('   - Past interactions:', journalChecks.hasPastInteractions ? '✓' : '✗');
    
    console.log('\n5. BACK ARROW VERIFICATION:', summary.backArrowVerification.passed ? '✓ PASSED' : '✗ FAILED');
    console.log('   - Back arrow clicked:', backArrowChecks.backArrowClicked ? '✓' : '✗');
    console.log('   - Returned to list:', backArrowChecks.returnedToEngagementList ? '✓' : '✗');
    console.log('   - Detail view hidden:', backArrowChecks.detailViewHidden ? '✓' : '✗');
    
    console.log('\n' + '='.repeat(80));
    
    const overallPassed = summary.sidebarVerification.passed &&
                          summary.initialStateVerification.passed &&
                          summary.conversationClickVerification.passed &&
                          summary.journalVerification.passed &&
                          summary.backArrowVerification.passed;
    
    console.log('\nOVERALL RESULT:', overallPassed ? '✓ ALL VERIFICATIONS PASSED' : '✗ SOME VERIFICATIONS FAILED');
    console.log('='.repeat(80) + '\n');

    // Save detailed report
    writeFileSync(
      join(screenshotDir, 'verification-report.json'),
      JSON.stringify(summary, null, 2)
    );
    
    console.log(`\nDetailed report saved to: ${join(screenshotDir, 'verification-report.json')}`);
    console.log(`Screenshots saved to: ${screenshotDir}/`);

  } catch (error) {
    console.error('Error during verification:', error);
    await page.screenshot({ path: join(screenshotDir, 'error-screenshot.png'), fullPage: true });
    throw error;
  } finally {
    await browser.close();
  }
}

verifyInboxBehavior().catch(console.error);
