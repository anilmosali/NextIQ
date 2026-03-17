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
    slowMo: 300,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  const results = [];

  try {
    // Step 1: Navigate to localhost
    console.log('Step 1: Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
    await sleep(1000);
    await page.screenshot({ path: join(screenshotDir, '01-initial-page.png'), fullPage: true });
    results.push({ step: 1, description: 'Initial page load', status: 'success' });
    console.log('✓ Loaded initial page');

    // Step 2: Login
    console.log('\nStep 2: Attempting to login...');
    try {
      // Look for Sign in button
      const signInClicked = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const signInButton = buttons.find(btn => btn.textContent.includes('Sign in'));
        if (signInButton) {
          signInButton.click();
          return true;
        }
        return false;
      });
      
      if (signInClicked) {
        await sleep(2000);
        results.push({ step: 2, description: 'Clicked Sign in button', status: 'success' });
        console.log('✓ Clicked Sign in button');
      } else {
        results.push({ step: 2, description: 'No login required', status: 'info' });
        console.log('ℹ No Sign in button found');
      }
    } catch (e) {
      results.push({ step: 2, description: 'Login step skipped', status: 'info', error: e.message });
      console.log('ℹ Login step skipped:', e.message);
    }
    await page.screenshot({ path: join(screenshotDir, '02-after-login.png'), fullPage: true });

    // Step 3: Navigate to Inbox
    console.log('\nStep 3: Navigating to Inbox...');
    await sleep(2000);
    
    const inboxClicked = await page.evaluate(() => {
      // Look for Inbox icon in sidebar - it's the second icon with a badge
      const sidebar = document.querySelector('nav, [class*="sidebar"], [class*="Sidebar"]');
      if (sidebar) {
        // Find all clickable elements in sidebar
        const navItems = Array.from(sidebar.querySelectorAll('a, button, div[role="button"], [class*="nav-item"]'));
        
        // Look for element with inbox/message icon or badge showing "5"
        for (const item of navItems) {
          const hasInboxIcon = item.querySelector('svg') !== null;
          const hasBadge = item.querySelector('[class*="badge"]') !== null || /\d+/.test(item.textContent);
          const text = item.textContent.toLowerCase();
          
          // Check if it's likely the inbox item (has badge, or contains inbox text)
          if ((hasBadge && hasInboxIcon) || text.includes('inbox')) {
            item.click();
            return true;
          }
        }
        
        // Fallback: click second navigation item (usually Inbox)
        if (navItems.length >= 2) {
          navItems[1].click();
          return true;
        }
      }
      return false;
    });
    
    if (inboxClicked) {
      await sleep(2000);
      results.push({ step: 3, description: 'Navigated to Inbox', status: 'success' });
      console.log('✓ Clicked Inbox navigation');
    } else {
      results.push({ step: 3, description: 'Could not find Inbox link', status: 'warning' });
      console.log('⚠ Could not find Inbox link');
    }
    
    await page.screenshot({ path: join(screenshotDir, '03-inbox-page.png'), fullPage: true });

    // Verification 1: Check Sidebar Structure
    console.log('\n' + '='.repeat(80));
    console.log('VERIFICATION 1: SIDEBAR STRUCTURE');
    console.log('='.repeat(80));
    
    const sidebarChecks = await page.evaluate(() => {
      const checks = {
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
      
      const allText = document.body.innerText;
      
      // Check for specific text patterns
      checks.hasInboxHeader = /^Inbox$/m.test(allText);
      checks.hasMyInbox = allText.includes('My Inbox');
      checks.hasTeamInboxesSection = allText.includes('TEAM INBOXES');
      checks.hasSalesTeam = allText.includes('Sales');
      checks.hasServiceTeam = allText.includes('Service');
      checks.hasMarketingTeam = allText.includes('Marketing');
      
      // Check for items that should NOT be in sidebar
      const sidebar = document.querySelector('[class*="sidebar"], [class*="Sidebar"], nav');
      if (sidebar) {
        const sidebarText = sidebar.innerText;
        checks.hasContactsItem = /\bContacts\b/.test(sidebarText);
        checks.hasInternalItem = /^Internal$/m.test(sidebarText);
        
        // Check for My Inbox icon and badge
        const myInboxElements = Array.from(sidebar.querySelectorAll('*')).filter(el => 
          el.textContent.includes('My Inbox')
        );
        if (myInboxElements.length > 0) {
          const myInboxParent = myInboxElements[0].closest('div, li, a');
          if (myInboxParent) {
            checks.hasMyInboxIcon = myInboxParent.querySelector('svg') !== null;
            checks.hasMyInboxBadge = myInboxParent.querySelector('[class*="badge"], [class*="count"]') !== null ||
                                     /\d+/.test(myInboxParent.textContent);
          }
        }
      }
      
      return checks;
    });
    
    results.push({ 
      step: 'V1', 
      description: 'Sidebar structure verification', 
      status: 'completed',
      details: sidebarChecks
    });
    
    console.log('   ✓ Inbox header:', sidebarChecks.hasInboxHeader ? 'FOUND' : 'NOT FOUND');
    console.log('   ✓ My Inbox item:', sidebarChecks.hasMyInbox ? 'FOUND' : 'NOT FOUND');
    console.log('   ✓ My Inbox icon:', sidebarChecks.hasMyInboxIcon ? 'FOUND' : 'NOT FOUND');
    console.log('   ✓ My Inbox badge:', sidebarChecks.hasMyInboxBadge ? 'FOUND' : 'NOT FOUND');
    console.log('   ✓ TEAM INBOXES section:', sidebarChecks.hasTeamInboxesSection ? 'FOUND' : 'NOT FOUND');
    console.log('   ✓ Sales team:', sidebarChecks.hasSalesTeam ? 'FOUND' : 'NOT FOUND');
    console.log('   ✓ Service team:', sidebarChecks.hasServiceTeam ? 'FOUND' : 'NOT FOUND');
    console.log('   ✓ Marketing team:', sidebarChecks.hasMarketingTeam ? 'FOUND' : 'NOT FOUND');
    console.log('   ✓ NO Contacts in sidebar:', !sidebarChecks.hasContactsItem ? 'CORRECT' : '❌ FOUND (should not be there)');
    console.log('   ✓ NO Internal in sidebar:', !sidebarChecks.hasInternalItem ? 'CORRECT' : '❌ FOUND (should not be there)');

    await page.screenshot({ path: join(screenshotDir, '04-sidebar-verified.png'), fullPage: true });

    // Verification 2: Initial State (No Conversation Selected)
    console.log('\n' + '='.repeat(80));
    console.log('VERIFICATION 2: INITIAL STATE (No conversation selected)');
    console.log('='.repeat(80));
    
    const initialStateChecks = await page.evaluate(() => {
      const checks = {
        hasEngagementList: false,
        hasFilterTabs: false,
        hasAllTab: false,
        hasUnreadTab: false,
        hasMyCustomersTab: false,
        hasInternalTab: false,
        hasChannelsTab: false,
        hasConversationRows: false,
        conversationDetailVisible: false,
        engagementListFullWidth: false
      };
      
      const allText = document.body.innerText;
      
      // Check for filter tabs
      checks.hasAllTab = allText.includes('All');
      checks.hasUnreadTab = allText.includes('Unread');
      checks.hasMyCustomersTab = allText.includes('My Customers');
      checks.hasInternalTab = allText.includes('Internal');
      checks.hasChannelsTab = allText.includes('Channels');
      checks.hasFilterTabs = checks.hasAllTab && checks.hasUnreadTab;
      
      // Check for engagement list / conversation rows
      const conversationElements = document.querySelectorAll('[class*="conversation"], [class*="engagement"], [class*="row"]');
      checks.hasConversationRows = conversationElements.length > 3;
      checks.hasEngagementList = checks.hasConversationRows;
      
      // Check that detail view is NOT visible
      const detailPanels = document.querySelectorAll('[class*="detail"], [class*="conversation-view"], [class*="interaction-detail"]');
      checks.conversationDetailVisible = Array.from(detailPanels).some(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
      
      return checks;
    });
    
    results.push({ 
      step: 'V2', 
      description: 'Initial state verification', 
      status: 'completed',
      details: initialStateChecks
    });
    
    console.log('   ✓ Engagement list visible:', initialStateChecks.hasEngagementList ? 'YES' : 'NO');
    console.log('   ✓ Filter tabs present:', initialStateChecks.hasFilterTabs ? 'YES' : 'NO');
    console.log('     - All tab:', initialStateChecks.hasAllTab ? 'FOUND' : 'NOT FOUND');
    console.log('     - Unread tab:', initialStateChecks.hasUnreadTab ? 'FOUND' : 'NOT FOUND');
    console.log('     - My Customers tab:', initialStateChecks.hasMyCustomersTab ? 'FOUND' : 'NOT FOUND');
    console.log('     - Internal tab:', initialStateChecks.hasInternalTab ? 'FOUND' : 'NOT FOUND');
    console.log('     - Channels tab:', initialStateChecks.hasChannelsTab ? 'FOUND' : 'NOT FOUND');
    console.log('   ✓ Conversation rows:', initialStateChecks.hasConversationRows ? 'FOUND' : 'NOT FOUND');
    console.log('   ✓ Detail view hidden:', !initialStateChecks.conversationDetailVisible ? 'CORRECT' : '❌ VISIBLE (should be hidden)');

    await page.screenshot({ path: join(screenshotDir, '05-initial-state-verified.png'), fullPage: true });

    // Verification 3: Click on a Conversation
    console.log('\n' + '='.repeat(80));
    console.log('VERIFICATION 3: CLICK ON CONVERSATION');
    console.log('='.repeat(80));
    
    await sleep(1000);
    
    const conversationClicked = await page.evaluate(() => {
      // Look for Brad Pitt or any conversation
      const allElements = Array.from(document.querySelectorAll('div, li, a, button'));
      let conversationElement = allElements.find(el => el.textContent.includes('Brad Pitt'));
      
      if (!conversationElement) {
        // Find any conversation row - look for elements with class containing conversation/engagement/row
        const conversationRows = Array.from(document.querySelectorAll('[class*="conversation"], [class*="engagement"], [class*="row"], [class*="item"]'));
        // Filter to find actual conversation items (not headers or empty divs)
        const validRows = conversationRows.filter(row => {
          const text = row.textContent.trim();
          return text.length > 10 && text.length < 500;
        });
        if (validRows.length > 0) {
          conversationElement = validRows[0];
        }
      }
      
      if (conversationElement && typeof conversationElement.click === 'function') {
        conversationElement.click();
        return true;
      }
      return false;
    });
    
    if (conversationClicked) {
      console.log('✓ Clicked on conversation');
      await sleep(2000);
      
      const conversationClickChecks = await page.evaluate(() => {
        const checks = {
          conversationClicked: true,
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
        
        const allText = document.body.innerText;
        
        // Check for back arrow
        checks.hasBackArrow = allText.includes('←') || allText.includes('Back');
        
        // Check for Conversation/Journal toggle
        checks.hasConversationTab = allText.includes('Conversation');
        checks.hasJournalTab = allText.includes('Journal');
        checks.hasConversationJournalToggle = checks.hasConversationTab && checks.hasJournalTab;
        
        // Check for NextIQ panel
        checks.hasNextIQPanel = allText.includes('NextIQ');
        
        // Check for person name (capital letter pattern)
        checks.hasPersonName = /[A-Z][a-z]+ [A-Z][a-z]+/.test(allText);
        
        // Check for chat messages
        const messageElements = document.querySelectorAll('[class*="message"], [class*="chat"], [class*="conversation"]');
        checks.hasChatMessages = messageElements.length > 2;
        
        // Check if detail view is visible
        const detailPanels = document.querySelectorAll('[class*="detail"], [class*="conversation-view"], [class*="interaction"]');
        checks.detailViewVisible = detailPanels.length > 0;
        
        return checks;
      });
      
      results.push({ 
        step: 'V3', 
        description: 'Conversation click verification', 
        status: 'completed',
        details: conversationClickChecks
      });
      
      console.log('   ✓ Detail view visible:', conversationClickChecks.detailViewVisible ? 'YES' : 'NO');
      console.log('   ✓ Back arrow present:', conversationClickChecks.hasBackArrow ? 'YES' : 'NO');
      console.log('   ✓ Person name shown:', conversationClickChecks.hasPersonName ? 'YES' : 'NO');
      console.log('   ✓ Conversation/Journal toggle:', conversationClickChecks.hasConversationJournalToggle ? 'YES' : 'NO');
      console.log('     - Conversation tab:', conversationClickChecks.hasConversationTab ? 'FOUND' : 'NOT FOUND');
      console.log('     - Journal tab:', conversationClickChecks.hasJournalTab ? 'FOUND' : 'NOT FOUND');
      console.log('   ✓ Chat messages:', conversationClickChecks.hasChatMessages ? 'YES' : 'NO');
      console.log('   ✓ NextIQ panel:', conversationClickChecks.hasNextIQPanel ? 'YES' : 'NO');
      
      await page.screenshot({ path: join(screenshotDir, '06-conversation-selected.png'), fullPage: true });

      // Verification 4: Click Journal Toggle
      console.log('\n' + '='.repeat(80));
      console.log('VERIFICATION 4: CLICK JOURNAL TOGGLE');
      console.log('='.repeat(80));
      
      await sleep(1000);
      
      const journalClicked = await page.evaluate(() => {
        const allElements = Array.from(document.querySelectorAll('*'));
        const journalElement = allElements.find(el => 
          el.textContent.trim() === 'Journal' && 
          (el.tagName === 'BUTTON' || el.tagName === 'A' || el.tagName === 'DIV')
        );
        if (journalElement) {
          journalElement.click();
          return true;
        }
        return false;
      });
      
      if (journalClicked) {
        console.log('✓ Clicked Journal toggle');
        await sleep(2000);
        
        const journalChecks = await page.evaluate(() => {
          const checks = {
            journalClicked: true,
            showsTimeline: false,
            hasDateGroups: false,
            hasPastInteractions: false
          };
          
          const allText = document.body.innerText;
          
          // Check for timeline/journal indicators
          checks.showsTimeline = allText.includes('Timeline') || 
                                 allText.includes('History') ||
                                 /Today|Yesterday/.test(allText);
          
          // Check for date groups
          checks.hasDateGroups = /Today|Yesterday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/.test(allText) ||
                                /Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/.test(allText);
          
          // Check for past interactions
          const interactionElements = document.querySelectorAll('[class*="interaction"], [class*="event"], [class*="activity"], [class*="timeline"]');
          checks.hasPastInteractions = interactionElements.length > 0;
          
          return checks;
        });
        
        results.push({ 
          step: 'V4', 
          description: 'Journal toggle verification', 
          status: 'completed',
          details: journalChecks
        });
        
        console.log('   ✓ Timeline shown:', journalChecks.showsTimeline ? 'YES' : 'NO');
        console.log('   ✓ Date groups:', journalChecks.hasDateGroups ? 'YES' : 'NO');
        console.log('   ✓ Past interactions:', journalChecks.hasPastInteractions ? 'YES' : 'NO');
        
        await page.screenshot({ path: join(screenshotDir, '07-journal-view.png'), fullPage: true });
      } else {
        console.log('⚠ Could not find Journal toggle');
        results.push({ step: 'V4', description: 'Journal tab not found', status: 'warning' });
      }

      // Verification 5: Click Back Arrow
      console.log('\n' + '='.repeat(80));
      console.log('VERIFICATION 5: CLICK BACK ARROW');
      console.log('='.repeat(80));
      
      await sleep(1000);
      
      const backClicked = await page.evaluate(() => {
        const allElements = Array.from(document.querySelectorAll('button, a, div'));
        const backElement = allElements.find(el => 
          el.textContent.includes('←') || 
          el.textContent.toLowerCase().includes('back') ||
          el.className.includes('back')
        );
        if (backElement) {
          backElement.click();
          return true;
        }
        return false;
      });
      
      if (backClicked) {
        console.log('✓ Clicked back arrow');
        await sleep(2000);
        
        const backArrowChecks = await page.evaluate(() => {
          const checks = {
            backArrowClicked: true,
            returnedToEngagementList: false,
            detailViewHidden: false
          };
          
          // Check if engagement list is visible again
          const conversationRows = document.querySelectorAll('[class*="conversation"], [class*="engagement"], [class*="row"]');
          checks.returnedToEngagementList = conversationRows.length > 3;
          
          // Check if detail view is hidden
          const detailPanels = document.querySelectorAll('[class*="detail"], [class*="conversation-view"], [class*="interaction-detail"]');
          const detailVisible = Array.from(detailPanels).some(el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetHeight > 0;
          });
          checks.detailViewHidden = !detailVisible;
          
          return checks;
        });
        
        results.push({ 
          step: 'V5', 
          description: 'Back arrow verification', 
          status: 'completed',
          details: backArrowChecks
        });
        
        console.log('   ✓ Returned to engagement list:', backArrowChecks.returnedToEngagementList ? 'YES' : 'NO');
        console.log('   ✓ Detail view hidden:', backArrowChecks.detailViewHidden ? 'YES' : 'NO');
        
        await page.screenshot({ path: join(screenshotDir, '08-back-to-list.png'), fullPage: true });
      } else {
        console.log('⚠ Could not find back arrow');
        results.push({ step: 'V5', description: 'Back button not found', status: 'warning' });
      }
      
    } else {
      console.log('⚠ Could not find conversation to click');
      results.push({ step: 'V3', description: 'No conversations found to click', status: 'warning' });
    }

    // Generate Summary Report
    console.log('\n' + '='.repeat(80));
    console.log('FINAL SUMMARY');
    console.log('='.repeat(80));
    
    const summary = {
      timestamp: new Date().toISOString(),
      totalSteps: results.length,
      results: results
    };

    // Save detailed report
    writeFileSync(
      join(screenshotDir, 'verification-report.json'),
      JSON.stringify(summary, null, 2)
    );
    
    console.log('\n✓ Verification complete!');
    console.log(`\nDetailed report saved to: ${join(screenshotDir, 'verification-report.json')}`);
    console.log(`Screenshots saved to: ${screenshotDir}/\n`);
    
    console.log('Review the screenshots to see the actual UI at each step.');
    console.log('='.repeat(80) + '\n');

  } catch (error) {
    console.error('\n❌ Error during verification:', error);
    await page.screenshot({ path: join(screenshotDir, 'error-screenshot.png'), fullPage: true });
    throw error;
  } finally {
    await sleep(3000);
    await browser.close();
  }
}

verifyInboxBehavior().catch(console.error);
