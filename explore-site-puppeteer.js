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
  
  const results = {};
  const pages = [];
  
  try {
    console.log('Navigating to the website...');
    await page.goto('https://ui-options-nexus-design-two.vercel.app/home', { 
      waitUntil: 'networkidle2',
      timeout: 60000 
    });
    
    // Wait a bit for any dynamic content
    await wait(2000);
    
    // Check for login page
    const passwordInput = await page.$('input[type="password"]');
    
    if (passwordInput) {
      console.log('Login page detected. Entering password...');
      await page.type('input[type="password"]', 'happyxbert');
      
      // Find and click the submit button - try multiple approaches
      let submitted = false;
      
      try {
        const submitButton = await page.$('button[type="submit"]');
        if (submitButton) {
          await submitButton.click();
          await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
          submitted = true;
          console.log('Logged in successfully!');
        }
      } catch (e) {
        console.log('Submit button not found, trying Enter key...');
      }
      
      if (!submitted) {
        // Try pressing Enter
        await page.keyboard.press('Enter');
        await wait(3000);
        console.log('Submitted password with Enter key');
      }
    }
    
    // Take home page screenshot
    console.log('Taking home page snapshot...');
    await page.screenshot({ path: 'screenshots/home.png', fullPage: true });
    
    // Get page content and structure
    const homeContent = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        bodyHTML: document.body.innerHTML.substring(0, 10000) // First 10k chars
      };
    });
    
    results.homePage = {
      url: homeContent.url,
      title: homeContent.title,
      screenshot: 'screenshots/home.png'
    };
    
    console.log('Home page captured. URL:', homeContent.url);
    
    // Get sidebar navigation items - try multiple selectors
    const sidebarLinks = await page.evaluate(() => {
      const links = [];
      
      // Try various sidebar selectors
      const selectors = [
        'aside a',
        'nav a',
        '[role="navigation"] a',
        '.sidebar a',
        '[class*="sidebar"] a',
        '[class*="nav"] a'
      ];
      
      const seenHrefs = new Set();
      
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          const text = el.textContent?.trim();
          const href = el.getAttribute('href');
          
          if (text && href && !seenHrefs.has(href)) {
            seenHrefs.add(href);
            links.push({ text, href });
          }
        });
      }
      
      return links;
    });
    
    console.log(`Found ${sidebarLinks.length} navigation links:`, sidebarLinks.map(l => l.text));
    
    // Visit each page
    for (const linkInfo of sidebarLinks) {
      const pageName = linkInfo.text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      console.log(`\nVisiting: ${linkInfo.text} (${linkInfo.href})`);
      
      try {
        let targetUrl = linkInfo.href;
        
        // Handle relative URLs
        if (!targetUrl.startsWith('http')) {
          if (targetUrl.startsWith('/')) {
            targetUrl = `https://ui-options-nexus-design-two.vercel.app${targetUrl}`;
          } else {
            targetUrl = `https://ui-options-nexus-design-two.vercel.app/${targetUrl}`;
          }
        }
        
        await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        await wait(2000); // Wait for dynamic content
        
        const screenshotName = `screenshots/${pageName}.png`;
        await page.screenshot({ path: screenshotName, fullPage: true });
        
        // Get page details
        const pageDetails = await page.evaluate(() => {
          return {
            title: document.title,
            url: window.location.href,
            // Get some basic structure info
            hasTable: document.querySelector('table') !== null,
            hasChart: document.querySelector('canvas, svg[class*="chart"]') !== null,
            hasCards: document.querySelectorAll('[class*="card"]').length,
            mainHeadings: Array.from(document.querySelectorAll('h1, h2')).map(h => h.textContent?.trim()).filter(Boolean).slice(0, 5)
          };
        });
        
        results[linkInfo.text] = {
          url: pageDetails.url,
          title: pageDetails.title,
          screenshot: screenshotName,
          structure: {
            hasTable: pageDetails.hasTable,
            hasChart: pageDetails.hasChart,
            cardCount: pageDetails.hasCards,
            mainHeadings: pageDetails.mainHeadings
          }
        };
        
        console.log(`  ✓ Captured ${linkInfo.text}`);
        
      } catch (error) {
        console.error(`  ✗ Error visiting ${linkInfo.text}:`, error.message);
        results[linkInfo.text] = {
          error: error.message
        };
      }
    }
    
    // Get UI details from the home page
    console.log('\nAnalyzing UI design elements...');
    await page.goto('https://ui-options-nexus-design-two.vercel.app/home', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    await wait(2000);
    
    const uiDetails = await page.evaluate(() => {
      const getComputedStyles = (selector) => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          fontSize: styles.fontSize,
          fontFamily: styles.fontFamily,
          padding: styles.padding,
          margin: styles.margin,
          borderRadius: styles.borderRadius,
          width: styles.width,
          height: styles.height
        };
      };
      
      return {
        sidebar: getComputedStyles('aside, nav, [class*="sidebar"]'),
        topBar: getComputedStyles('header, [class*="header"], [class*="topbar"]'),
        mainContent: getComputedStyles('main, [class*="main"], [class*="content"]'),
        body: getComputedStyles('body'),
        colorScheme: {
          bodyBg: window.getComputedStyle(document.body).backgroundColor,
          primaryColors: Array.from(document.querySelectorAll('[class*="primary"], [class*="accent"]')).slice(0, 3).map(el => ({
            bg: window.getComputedStyle(el).backgroundColor,
            color: window.getComputedStyle(el).color
          }))
        }
      };
    });
    
    results.uiDesign = uiDetails;
    
    // Save results
    fs.writeFileSync('site-exploration.json', JSON.stringify(results, null, 2));
    console.log('\n✅ Exploration complete! Results saved to site-exploration.json');
    console.log(`📸 ${Object.keys(results).length} pages captured`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
})();
