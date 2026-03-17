import puppeteer from 'puppeteer';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  console.log('🚀 Starting Inbox panel capture...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to localhost
    console.log('🌐 Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    await wait(1000);
    
    // Click login
    console.log('🔐 Clicking login...');
    const buttons = await page.$$('button');
    for (const button of buttons) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text && (text.toLowerCase().includes('login') || text.toLowerCase().includes('sign in'))) {
        await button.click();
        await wait(2000);
        break;
      }
    }
    
    // Click Inbox
    console.log('📧 Clicking Inbox...');
    const inboxButton = await page.$('button[aria-label="Inbox"]');
    if (inboxButton) {
      await inboxButton.click();
      await wait(4000);
    }
    
    // Get layout information
    console.log('\n📊 Analyzing layout...');
    const layoutInfo = await page.evaluate(() => {
      const findElementByText = (text) => {
        return Array.from(document.querySelectorAll('*')).find(el => {
          return el.textContent.trim().startsWith(text) && el.children.length < 5;
        });
      };
      
      // Try to find the "My Inbox" title
      const myInboxHeader = findElementByText('My Inbox');
      
      // Get all sections with borders
      const borderedDivs = Array.from(document.querySelectorAll('div[style*="border"]'));
      
      return {
        myInboxHeaderFound: !!myInboxHeader,
        myInboxHeaderRect: myInboxHeader ? myInboxHeader.getBoundingClientRect() : null,
        borderedDivsCount: borderedDivs.length,
        viewportWidth: window.innerWidth,
        bodyText: document.body.innerText.substring(0, 1000),
      };
    });
    
    console.log('Layout info:', JSON.stringify(layoutInfo, null, 2));
    
    // Take full screenshot
    console.log('\n📸 Taking full page screenshot...');
    await page.screenshot({ 
      path: 'screenshots/inbox-full-layout.png',
      fullPage: false
    });
    
    console.log('✅ Screenshot saved!');
    
    // Keep browser open for manual inspection
    console.log('\n⏸️  Browser will stay open for 30 seconds for manual inspection...');
    await wait(30000);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
    console.log('✅ Browser closed');
  }
})();
