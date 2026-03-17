import puppeteer from 'puppeteer';
import fs from 'fs';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  console.log('🚀 Starting Inbox verification test...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    // Navigate to localhost
    console.log('🌐 Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    await wait(1000);
    
    // Try to log in - look for login button
    console.log('🔐 Looking for login button...');
    let loginButton = null;
    
    try {
      loginButton = await page.waitForSelector('button', { timeout: 3000 });
      const buttons = await page.$$('button');
      
      for (const button of buttons) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text && (text.toLowerCase().includes('login') || text.toLowerCase().includes('sign in'))) {
          console.log('✅ Login button found, clicking...');
          await button.click();
          await wait(2000);
          break;
        }
      }
    } catch (e) {
      console.log('ℹ️  No explicit login button found, may already be on main page');
    }
    
    // Navigate to Inbox using sidebar
    console.log('📧 Looking for Inbox navigation...');
    
    let inboxClicked = false;
    
    try {
      // Try aria-label selector first
      let inboxButton = await page.$('button[aria-label="Inbox"]');
      
      if (inboxButton) {
        console.log('✅ Found Inbox button via aria-label');
        await inboxButton.click();
        inboxClicked = true;
        await wait(3000); // Wait longer for page to fully load
      } else {
        // Try other selectors
        let inboxLink = await page.$('a[href="/inbox"]');
        if (!inboxLink) {
          inboxLink = await page.$('a[href*="inbox"]');
        }
        
        if (inboxLink) {
          console.log('✅ Found Inbox link via href');
          await inboxLink.click();
          inboxClicked = true;
          await wait(3000);
        } else {
          // Try finding by text content
          const links = await page.$$('a, button, [role="button"]');
          for (const link of links) {
            const text = await page.evaluate(el => el.textContent, link);
            if (text && text.trim().toLowerCase() === 'inbox') {
              console.log('✅ Found Inbox navigation via text content');
              await link.click();
              inboxClicked = true;
              await wait(3000);
              break;
            }
          }
        }
      }
    } catch (e) {
      console.log('⚠️  Error clicking Inbox:', e.message);
    }
    
    if (!inboxClicked) {
      console.log('⚠️  Could not find Inbox navigation, taking screenshot of current page');
    }
    
    // Take screenshot before selecting any conversation
    console.log('📸 Taking screenshot of Inbox with conversation list...');
    await page.screenshot({ 
      path: 'screenshots/inbox-list-view.png',
      fullPage: true 
    });
    console.log('✅ List view screenshot saved to screenshots/inbox-list-view.png');
    
    // Take full page screenshot
    console.log('📸 Taking screenshot...');
    await page.screenshot({ 
      path: 'screenshots/inbox-verification-test.png',
      fullPage: true 
    });
    
    console.log('✅ Screenshot saved to screenshots/inbox-verification-test.png');
    
    // Get page analysis
    console.log('\n📊 Analyzing Inbox page structure...\n');
    
    const analysis = await page.evaluate(() => {
      const results = {
        pageTitle: document.title,
        currentUrl: window.location.href,
        leftPanel: {},
        conversationArea: {},
        rightPanel: {},
        detailedFindings: {}
      };
      
      // Get all text content for debugging
      const bodyText = document.body.innerText;
      
      // Check left categories panel - look for specific text patterns
      results.leftPanel = {
        hasInboxHeader: bodyText.includes('Inbox'),
        myInboxSection: {
          hasMyInboxSectionHeader: bodyText.includes('MY INBOX'),
          hasMyInbox: bodyText.includes('My Inbox'),
          hasContacts: bodyText.includes('Contacts'),
          hasInternal: bodyText.includes('Internal'),
        },
        teamInboxesSection: {
          hasTeamInboxesHeader: bodyText.includes('TEAM INBOXES'),
          hasSales: bodyText.includes('Sales'),
          hasService: bodyText.includes('Service'),
          hasMarketing: bodyText.includes('Marketing'),
          hasCreateTeam: bodyText.includes('Create team') || bodyText.includes('+ Create team'),
        }
      };
      
      // Check conversation list area - look for filters/tabs
      results.conversationArea = {
        hasMyInboxTitle: bodyText.includes('My Inbox'),
        hasTabs: {
          all: bodyText.match(/All\s+\d+/),
          unread: bodyText.match(/Unread\s+\d+/),
          myCustomers: bodyText.match(/My Customers\s+\d+/),
          internal: bodyText.match(/Internal\s+\d+/),
          channels: bodyText.match(/Channels\s+\d+/),
        },
        hasTodayDivider: bodyText.includes('TODAY') || bodyText.includes('Today'),
      };
      
      // Look for conversation items with specific elements
      results.detailedFindings.conversationElements = {
        hasUnreadDots: !!document.querySelector('[style*="background-color: rgb(37, 99, 235)"], [style*="background-color: #2563eb"], [style*="background-color: blue"], [style*="background"][style*="border-radius: 50%"]'),
        hasAvatars: !!document.querySelector('img[alt*="avatar"], [class*="avatar"], [style*="border-radius"][style*="object-fit"]'),
        hasOnlineStatus: !!document.querySelector('[style*="background-color: rgb(34, 197, 94)"], [style*="background-color: #22c55e"], [style*="background-color: #22C55E"], .online-indicator, .status-indicator'),
        hasConversationNames: bodyText.includes('Brad Pitt') || bodyText.includes('Michael Torres') || bodyText.includes('Emily Davis'),
      };
      
      // Check for right panel (NextIQ Intelligence)
      results.rightPanel = {
        found: bodyText.includes('NextIQ Intelligence') || bodyText.includes('NextIQ'),
        hasIntelligenceWidget: bodyText.includes('NextIQ Intelligence'),
      };
      
      // Get more specific details about filter tabs - look for buttons with specific styling
      const allButtons = Array.from(document.querySelectorAll('button'));
      const filterButtons = allButtons.filter(btn => {
        const text = btn.textContent.trim();
        return text.match(/^All\s+\d+$/) || text.match(/^Unread\s+\d+$/) || 
               text.match(/^My Customers\s+\d+$/) || text.match(/^Internal\s+\d+$/) || 
               text.match(/^Channels\s+\d+$/);
      });
      
      results.detailedFindings.filterTabs = {
        found: filterButtons.length > 0,
        count: filterButtons.length,
        tabs: filterButtons.map(btn => {
          const styles = window.getComputedStyle(btn);
          const bgColor = styles.backgroundColor;
          const hasLightBlueBg = bgColor.includes('232, 240, 254') || 
                                 bgColor.includes('#E8F0FE') || 
                                 bgColor.includes('rgba(0, 98, 184, 0.06)') ||
                                 bgColor.includes('rgb(232, 240, 254)');
          
          return {
            text: btn.textContent.trim(),
            hasIcon: btn.querySelector('svg') !== null,
            backgroundColor: bgColor,
            isActive: hasLightBlueBg || bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent',
            hasPillShape: styles.borderRadius.includes('999') || styles.borderRadius.includes('50'),
          };
        })
      };
      
      return results;
    });
    
    console.log('Analysis Results:');
    console.log(JSON.stringify(analysis, null, 2));
    
    // Save analysis to file
    fs.writeFileSync('screenshots/inbox-verification-analysis.json', JSON.stringify(analysis, null, 2));
    console.log('✅ Analysis saved to screenshots/inbox-verification-analysis.json');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: 'screenshots/error-screenshot.png' });
  } finally {
    await browser.close();
    console.log('✅ Browser closed');
  }
})();
