import puppeteer from 'puppeteer';
import fs from 'fs';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    console.log('🌐 Navigating to inbox2 page...');
    await page.goto('https://ui-options-nexus-design-two.vercel.app/inbox2', { 
      waitUntil: 'networkidle2',
      timeout: 60000 
    });
    
    await wait(2000);
    
    // Handle password
    const passwordInput = await page.$('input[type="password"]');
    if (passwordInput) {
      console.log('🔒 Entering password...');
      await page.type('input[type="password"]', 'happyxbert');
      await page.keyboard.press('Enter');
      await wait(3000);
    }
    
    console.log('\n📸 Taking detailed screenshots...');
    
    // 1. Full page
    console.log('  - Full page screenshot...');
    await page.screenshot({ 
      path: 'inbox2-docs/detailed-01-fullpage.png', 
      fullPage: true 
    });
    
    // 2. Top bar only
    console.log('  - Top bar...');
    const topBar = await page.$('header, [class*="header"], [class*="topbar"]');
    if (topBar) {
      await topBar.screenshot({ path: 'inbox2-docs/detailed-02-topbar.png' });
    }
    
    // 3. Left sidebar with better capture
    console.log('  - Left sidebar...');
    await page.evaluate(() => {
      const sidebar = document.querySelector('[class*="sidebar"]');
      if (sidebar) sidebar.style.border = '2px solid red';
    });
    
    const sidebarBounds = await page.evaluate(() => {
      const sidebar = document.querySelector('aside, nav[class*="sidebar"], [class*="nav-panel"]');
      if (!sidebar) return null;
      const rect = sidebar.getBoundingClientRect();
      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      };
    });
    
    if (sidebarBounds) {
      await page.screenshot({ 
        path: 'inbox2-docs/detailed-03-left-sidebar.png',
        clip: sidebarBounds
      });
    }
    
    // 4. Conversation list panel
    console.log('  - Conversation list...');
    const conversationListBounds = await page.evaluate(() => {
      // Try to find the middle panel with conversation list
      const candidates = [
        document.querySelector('[class*="conversation-list"]'),
        document.querySelector('[class*="inbox-list"]'),
        document.querySelector('[class*="message-list"]'),
        document.querySelectorAll('aside')[1], // Second aside might be conversation list
        document.querySelectorAll('[class*="panel"]')[1]
      ];
      
      for (const el of candidates) {
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 100 && rect.height > 100) {
            return {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: Math.min(rect.height, 800)
            };
          }
        }
      }
      return null;
    });
    
    if (conversationListBounds) {
      await page.screenshot({ 
        path: 'inbox2-docs/detailed-04-conversation-list.png',
        clip: conversationListBounds
      });
    }
    
    // 5. Single conversation item detail
    console.log('  - Individual conversation item...');
    const firstConversationBounds = await page.evaluate(() => {
      const convItems = document.querySelectorAll('[class*="conversation"], [class*="message-item"], [class*="inbox-item"]');
      if (convItems.length > 0) {
        const rect = convItems[0].getBoundingClientRect();
        return {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height
        };
      }
      return null;
    });
    
    if (firstConversationBounds) {
      await page.screenshot({ 
        path: 'inbox2-docs/detailed-05-conversation-item.png',
        clip: firstConversationBounds
      });
    }
    
    // 6. Get detailed DOM structure
    console.log('\n🔍 Analyzing DOM structure...');
    const domStructure = await page.evaluate(() => {
      const getElementInfo = (el) => {
        if (!el) return null;
        return {
          tag: el.tagName.toLowerCase(),
          classes: Array.from(el.classList),
          id: el.id || null,
          text: el.textContent?.substring(0, 100).trim() || null
        };
      };
      
      return {
        sidebar: getElementInfo(document.querySelector('aside, nav[class*="sidebar"]')),
        topBar: getElementInfo(document.querySelector('header, [class*="header"]')),
        mainContent: getElementInfo(document.querySelector('main, [class*="main"]')),
        allAsides: Array.from(document.querySelectorAll('aside')).map(getElementInfo),
        allNavs: Array.from(document.querySelectorAll('nav')).map(getElementInfo)
      };
    });
    
    fs.writeFileSync('inbox2-docs/dom-structure.json', JSON.stringify(domStructure, null, 2));
    console.log('  ✓ DOM structure saved');
    
    // 7. Get all text content for navigation items
    console.log('\n📝 Extracting navigation structure...');
    const navigationStructure = await page.evaluate(() => {
      const extractNavigation = () => {
        const navItems = [];
        
        // Get all clickable items in what looks like navigation
        const sidebar = document.querySelector('aside, nav[class*="sidebar"]');
        if (!sidebar) return [];
        
        const allLinks = sidebar.querySelectorAll('a, button, [role="button"], [class*="nav"], [class*="menu-item"]');
        
        allLinks.forEach((item, index) => {
          const rect = item.getBoundingClientRect();
          const text = item.textContent?.trim();
          
          if (text && text.length > 0 && text.length < 100) {
            navItems.push({
              index,
              text,
              tag: item.tagName.toLowerCase(),
              classes: Array.from(item.classList),
              href: item.getAttribute('href'),
              position: {
                x: Math.round(rect.x),
                y: Math.round(rect.y),
                width: Math.round(rect.width),
                height: Math.round(rect.height)
              }
            });
          }
        });
        
        return navItems;
      };
      
      return {
        sidebarNavigation: extractNavigation()
      };
    });
    
    fs.writeFileSync('inbox2-docs/navigation-structure.json', JSON.stringify(navigationStructure, null, 2));
    console.log('  ✓ Navigation structure saved');
    
    console.log('\n✅ Detailed screenshots complete!');
    console.log('📁 Files saved:');
    console.log('   - detailed-01-fullpage.png');
    console.log('   - detailed-02-topbar.png');
    console.log('   - detailed-03-left-sidebar.png');
    console.log('   - detailed-04-conversation-list.png');
    console.log('   - detailed-05-conversation-item.png');
    console.log('   - dom-structure.json');
    console.log('   - navigation-structure.json');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await browser.close();
  }
})();
