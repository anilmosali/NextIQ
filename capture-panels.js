import puppeteer from 'puppeteer';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    console.log('🌐 Navigating...');
    await page.goto('https://ui-options-nexus-design-two.vercel.app/inbox2', { 
      waitUntil: 'networkidle2',
      timeout: 60000 
    });
    
    await wait(2000);
    
    const passwordInput = await page.$('input[type="password"]');
    if (passwordInput) {
      await page.type('input[type="password"]', 'happyxbert');
      await page.keyboard.press('Enter');
      await wait(3000);
    }
    
    console.log('\n📸 Capturing specific regions...');
    
    // Capture left navigation sidebar
    console.log('  - Main navigation sidebar...');
    const navBounds = await page.evaluate(() => {
      const nav = document.querySelector('nav.fixed');
      if (nav) {
        const rect = nav.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      }
      return null;
    });
    
    if (navBounds && navBounds.width > 0) {
      await page.screenshot({ 
        path: 'inbox2-docs/sidebar-navigation.png',
        clip: navBounds
      });
      console.log(`    ✓ Nav dimensions: ${navBounds.width}x${navBounds.height}`);
    }
    
    // Capture inbox panel (the one with My Inbox, Contacts, etc.)
    console.log('  - Inbox panel...');
    const inboxPanelBounds = await page.evaluate(() => {
      // The inbox panel should be the one containing "My Inbox", "Contacts", etc.
      const mainContent = document.querySelector('#main-content, main');
      if (mainContent) {
        const rect = mainContent.getBoundingClientRect();
        // Get just the left portion (inbox categories panel)
        return { 
          x: rect.x, 
          y: rect.y, 
          width: Math.min(300, rect.width / 3), 
          height: rect.height 
        };
      }
      return null;
    });
    
    if (inboxPanelBounds) {
      await page.screenshot({ 
        path: 'inbox2-docs/inbox-categories-panel.png',
        clip: inboxPanelBounds
      });
      console.log(`    ✓ Inbox panel: ${inboxPanelBounds.width}x${inboxPanelBounds.height}`);
    }
    
    // Capture conversation list (middle section)
    console.log('  - Conversation list panel...');
    const convListBounds = await page.evaluate(() => {
      const mainContent = document.querySelector('#main-content, main');
      if (mainContent) {
        const rect = mainContent.getBoundingClientRect();
        // Get the middle section (conversation list)
        const startX = rect.x + 300;
        return { 
          x: startX, 
          y: rect.y, 
          width: Math.min(500, rect.width / 2), 
          height: rect.height 
        };
      }
      return null;
    });
    
    if (convListBounds) {
      await page.screenshot({ 
        path: 'inbox2-docs/conversation-list-panel.png',
        clip: convListBounds
      });
      console.log(`    ✓ Conv list: ${convListBounds.width}x${convListBounds.height}`);
    }
    
    // Get detailed text content
    console.log('\n📝 Extracting text content...');
    const textContent = await page.evaluate(() => {
      // Get nav items
      const nav = document.querySelector('nav.fixed');
      const navItems = nav ? Array.from(nav.querySelectorAll('a, button'))
        .map(el => ({
          text: el.textContent?.trim(),
          tag: el.tagName.toLowerCase()
        }))
        .filter(item => item.text && item.text.length > 0) : [];
      
      // Get inbox categories
      const mainContent = document.querySelector('#main-content, main');
      const inboxItems = mainContent ? Array.from(mainContent.querySelectorAll('button, a, [role="button"]'))
        .slice(0, 20)
        .map(el => ({
          text: el.textContent?.trim(),
          classes: Array.from(el.classList),
          ariaLabel: el.getAttribute('aria-label')
        }))
        .filter(item => item.text && item.text.length > 0 && item.text.length < 200) : [];
      
      return {
        navigationItems: navItems,
        inboxItems: inboxItems
      };
    });
    
    console.log('\n📋 Navigation Items Found:');
    textContent.navigationItems.forEach((item, i) => {
      console.log(`  ${i + 1}. ${item.text}`);
    });
    
    console.log('\n📋 Inbox Panel Items (first 15):');
    textContent.inboxItems.slice(0, 15).forEach((item, i) => {
      console.log(`  ${i + 1}. ${item.text}`);
    });
    
    console.log('\n✅ Complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
})();
