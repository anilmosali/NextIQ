import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const results = {};
  
  try {
    console.log('Navigating to the website...');
    await page.goto('https://ui-options-nexus-design-two.vercel.app/home');
    
    // Wait for page load
    await page.waitForLoadState('networkidle');
    
    // Check for login page
    const passwordInput = await page.locator('input[type="password"]').count();
    
    if (passwordInput > 0) {
      console.log('Login page detected. Entering password...');
      await page.fill('input[type="password"]', 'happyxbert');
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');
      console.log('Logged in successfully!');
    }
    
    // Take home page screenshot
    results.homePage = {
      url: page.url(),
      screenshot: 'screenshots/home.png'
    };
    await page.screenshot({ path: 'screenshots/home.png', fullPage: true });
    
    // Get sidebar navigation items
    const sidebarLinks = await page.locator('[role="navigation"] a, nav a, aside a').all();
    console.log(`Found ${sidebarLinks.length} navigation links`);
    
    const pages = [];
    
    for (let i = 0; i < sidebarLinks.length; i++) {
      const link = sidebarLinks[i];
      const text = await link.textContent();
      const href = await link.getAttribute('href');
      
      if (text && href) {
        pages.push({ text: text.trim(), href });
      }
    }
    
    console.log('Pages found:', pages);
    
    // Visit each page
    for (const pageInfo of pages) {
      console.log(`\nVisiting: ${pageInfo.text}`);
      try {
        await page.goto(`https://ui-options-nexus-design-two.vercel.app${pageInfo.href}`);
        await page.waitForLoadState('networkidle');
        
        const screenshotName = `screenshots/${pageInfo.text.toLowerCase().replace(/\s+/g, '-')}.png`;
        await page.screenshot({ path: screenshotName, fullPage: true });
        
        // Get page structure
        const html = await page.content();
        
        results[pageInfo.text] = {
          url: page.url(),
          screenshot: screenshotName,
          title: await page.title()
        };
        
      } catch (error) {
        console.error(`Error visiting ${pageInfo.text}:`, error.message);
      }
    }
    
    // Save results
    fs.writeFileSync('site-exploration.json', JSON.stringify(results, null, 2));
    console.log('\nExploration complete! Results saved to site-exploration.json');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
