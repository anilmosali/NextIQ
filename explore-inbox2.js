import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  const documentation = {
    timestamp: new Date().toISOString(),
    pageUrl: 'https://ui-options-nexus-design-two.vercel.app/inbox2',
    sections: {}
  };
  
  try {
    // Create output directory
    const docsDir = 'inbox2-docs';
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
      console.log(`📁 Created ${docsDir}/ directory`);
    }
    
    console.log('🌐 Navigating to inbox2 page...');
    await page.goto('https://ui-options-nexus-design-two.vercel.app/inbox2', { 
      waitUntil: 'networkidle2',
      timeout: 60000 
    });
    
    await wait(2000);
    
    // Check for password prompt
    const passwordInput = await page.$('input[type="password"]');
    
    if (passwordInput) {
      console.log('🔒 Password prompt detected. Entering password...');
      await page.type('input[type="password"]', 'happyxbert');
      
      const submitButton = await page.$('button[type="submit"]');
      if (submitButton) {
        await submitButton.click();
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
        console.log('✅ Logged in successfully!');
      } else {
        await page.keyboard.press('Enter');
        await wait(3000);
        console.log('✅ Submitted with Enter key');
      }
      
      await wait(2000);
    }
    
    // 1. OVERALL LAYOUT SCREENSHOT
    console.log('\n📸 1. Capturing overall layout...');
    await page.screenshot({ 
      path: 'inbox2-docs/01-overall-layout.png', 
      fullPage: false 
    });
    
    const overallLayout = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        bodyStyles: {
          backgroundColor: window.getComputedStyle(document.body).backgroundColor,
          color: window.getComputedStyle(document.body).color,
          fontFamily: window.getComputedStyle(document.body).fontFamily
        },
        layoutStructure: {
          hasSidebar: !!document.querySelector('aside, [class*="sidebar"], nav[class*="side"]'),
          hasTopBar: !!document.querySelector('header, [class*="topbar"], [class*="header"]'),
          hasMainContent: !!document.querySelector('main, [class*="main"], [class*="content"]'),
          hasRightPanel: !!document.querySelectorAll('[class*="right"], [class*="panel"]').length > 0
        }
      };
    });
    
    documentation.sections.overallLayout = {
      screenshot: '01-overall-layout.png',
      description: 'Full viewport capture of the inbox page',
      details: overallLayout
    };
    
    console.log('   Layout type detected:', overallLayout.layoutStructure);
    
    // 2. LEFT SIDEBAR/PANEL
    console.log('\n📸 2. Analyzing left sidebar...');
    
    const sidebarInfo = await page.evaluate(() => {
      // Find sidebar element
      const sidebar = document.querySelector('aside, [class*="sidebar"], nav[class*="side"]');
      if (!sidebar) return { found: false };
      
      const styles = window.getComputedStyle(sidebar);
      
      // Get all navigation items
      const navItems = [];
      const links = sidebar.querySelectorAll('a, button, [role="button"], [class*="nav-item"]');
      
      links.forEach((item, index) => {
        const text = item.textContent?.trim();
        const href = item.getAttribute('href');
        const classes = item.className;
        const isActive = classes.includes('active') || item.getAttribute('aria-current') === 'page';
        
        if (text) {
          navItems.push({
            index,
            text,
            href: href || 'button',
            isActive,
            tag: item.tagName.toLowerCase()
          });
        }
      });
      
      // Get any headers/titles in sidebar
      const headers = Array.from(sidebar.querySelectorAll('h1, h2, h3, h4, h5, h6, [class*="title"], [class*="header"]'))
        .map(h => h.textContent?.trim())
        .filter(Boolean);
      
      return {
        found: true,
        styles: {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          width: styles.width,
          padding: styles.padding,
          borderRight: styles.borderRight,
          position: styles.position
        },
        navigationItems: navItems,
        headers: headers,
        itemCount: navItems.length
      };
    });
    
    if (sidebarInfo.found) {
      // Try to take a screenshot of just the sidebar
      const sidebarElement = await page.$('aside, [class*="sidebar"], nav[class*="side"]');
      if (sidebarElement) {
        await sidebarElement.screenshot({ path: 'inbox2-docs/02-left-sidebar.png' });
      }
      
      documentation.sections.leftSidebar = {
        screenshot: '02-left-sidebar.png',
        description: 'Left sidebar with navigation items',
        details: sidebarInfo
      };
      
      console.log(`   Found ${sidebarInfo.itemCount} navigation items:`);
      sidebarInfo.navigationItems.forEach(item => {
        console.log(`      ${item.isActive ? '▶' : ' '} ${item.text}`);
      });
    }
    
    // 3. CONVERSATION LIST AREA
    console.log('\n📸 3. Analyzing conversation list...');
    
    const conversationListInfo = await page.evaluate(() => {
      // Look for conversation list container
      const listSelectors = [
        '[class*="conversation-list"]',
        '[class*="inbox-list"]',
        '[class*="message-list"]',
        '[class*="thread-list"]',
        'ul[class*="list"]',
        '[role="list"]'
      ];
      
      let listContainer = null;
      for (const selector of listSelectors) {
        listContainer = document.querySelector(selector);
        if (listContainer) break;
      }
      
      if (!listContainer) {
        // Try to find a container with multiple similar items
        const allDivs = document.querySelectorAll('div[class*="item"], div[class*="conversation"], div[class*="thread"]');
        if (allDivs.length > 0) {
          listContainer = allDivs[0].parentElement;
        }
      }
      
      if (!listContainer) return { found: false };
      
      const styles = window.getComputedStyle(listContainer);
      
      // Get conversation items
      const items = [];
      const itemElements = listContainer.querySelectorAll('[class*="item"], [class*="conversation"], [class*="thread"], li');
      
      itemElements.forEach((item, index) => {
        if (index < 5) { // First 5 items only
          const nameEl = item.querySelector('[class*="name"], [class*="sender"], [class*="from"], strong, b');
          const previewEl = item.querySelector('[class*="preview"], [class*="message"], [class*="text"], p, span');
          const timeEl = item.querySelector('[class*="time"], [class*="date"], time');
          const unread = item.className.includes('unread') || item.getAttribute('aria-label')?.includes('unread');
          
          items.push({
            index,
            name: nameEl?.textContent?.trim() || '',
            preview: previewEl?.textContent?.trim().substring(0, 50) || '',
            time: timeEl?.textContent?.trim() || '',
            isUnread: unread
          });
        }
      });
      
      return {
        found: true,
        styles: {
          backgroundColor: styles.backgroundColor,
          width: styles.width,
          height: styles.height,
          overflowY: styles.overflowY,
          borderRight: styles.borderRight
        },
        totalItems: itemElements.length,
        sampleItems: items
      };
    });
    
    if (conversationListInfo.found) {
      documentation.sections.conversationList = {
        description: 'Conversation/message list area',
        details: conversationListInfo
      };
      
      console.log(`   Found ${conversationListInfo.totalItems} conversation items`);
      conversationListInfo.sampleItems.forEach(item => {
        console.log(`      ${item.isUnread ? '●' : '○'} ${item.name} - ${item.preview}`);
      });
    }
    
    // 4. CHAT/MESSAGE AREA
    console.log('\n📸 4. Analyzing chat/message area...');
    
    const messageAreaInfo = await page.evaluate(() => {
      const messageSelectors = [
        '[class*="message-area"]',
        '[class*="chat-area"]',
        '[class*="conversation-area"]',
        '[class*="messages"]',
        'main[class*="chat"]',
        '[role="main"]'
      ];
      
      let messageArea = null;
      for (const selector of messageSelectors) {
        messageArea = document.querySelector(selector);
        if (messageArea) break;
      }
      
      if (!messageArea) {
        // Try to find the main content area
        messageArea = document.querySelector('main');
      }
      
      if (!messageArea) return { found: false };
      
      const styles = window.getComputedStyle(messageArea);
      
      // Check for message bubbles
      const messageBubbles = messageArea.querySelectorAll('[class*="message"], [class*="bubble"], [class*="chat-item"]');
      
      // Check for input area
      const inputArea = messageArea.querySelector('textarea, input[type="text"], [contenteditable="true"]');
      const sendButton = messageArea.querySelector('button[class*="send"], button[type="submit"]');
      
      // Get header info
      const header = messageArea.querySelector('header, [class*="header"]');
      const headerText = header ? {
        title: header.querySelector('h1, h2, h3, [class*="title"]')?.textContent?.trim() || '',
        subtitle: header.querySelector('[class*="subtitle"], [class*="status"]')?.textContent?.trim() || ''
      } : null;
      
      return {
        found: true,
        styles: {
          backgroundColor: styles.backgroundColor,
          flex: styles.flex,
          width: styles.width,
          padding: styles.padding
        },
        header: headerText,
        messageCount: messageBubbles.length,
        hasInputArea: !!inputArea,
        hasSendButton: !!sendButton,
        inputPlaceholder: inputArea?.getAttribute('placeholder') || ''
      };
    });
    
    if (messageAreaInfo.found) {
      documentation.sections.messageArea = {
        description: 'Main chat/message display area',
        details: messageAreaInfo
      };
      
      console.log(`   Messages found: ${messageAreaInfo.messageCount}`);
      console.log(`   Input area: ${messageAreaInfo.hasInputArea ? '✓' : '✗'}`);
      if (messageAreaInfo.header) {
        console.log(`   Header: ${messageAreaInfo.header.title}`);
      }
    }
    
    // 5. RIGHT PANEL/WIDGETS
    console.log('\n📸 5. Analyzing right panel...');
    
    const rightPanelInfo = await page.evaluate(() => {
      const rightSelectors = [
        '[class*="right-panel"]',
        '[class*="sidebar-right"]',
        '[class*="details-panel"]',
        'aside:last-of-type',
        '[class*="widget"]'
      ];
      
      let rightPanel = null;
      for (const selector of rightSelectors) {
        const el = document.querySelector(selector);
        if (el) {
          // Check if it's actually on the right side
          const rect = el.getBoundingClientRect();
          if (rect.right > window.innerWidth * 0.6) {
            rightPanel = el;
            break;
          }
        }
      }
      
      if (!rightPanel) return { found: false };
      
      const styles = window.getComputedStyle(rightPanel);
      
      // Get sections/widgets within
      const sections = [];
      const headers = rightPanel.querySelectorAll('h1, h2, h3, h4, h5, h6, [class*="title"]');
      
      headers.forEach((header, index) => {
        sections.push({
          index,
          title: header.textContent?.trim() || '',
          tag: header.tagName.toLowerCase()
        });
      });
      
      return {
        found: true,
        styles: {
          backgroundColor: styles.backgroundColor,
          width: styles.width,
          padding: styles.padding,
          borderLeft: styles.borderLeft
        },
        sections: sections,
        sectionCount: sections.length
      };
    });
    
    if (rightPanelInfo.found) {
      const rightPanelElement = await page.$('[class*="right-panel"], [class*="sidebar-right"], [class*="details-panel"]');
      if (rightPanelElement) {
        await rightPanelElement.screenshot({ path: 'inbox2-docs/05-right-panel.png' });
      }
      
      documentation.sections.rightPanel = {
        screenshot: '05-right-panel.png',
        description: 'Right sidebar/details panel',
        details: rightPanelInfo
      };
      
      console.log(`   Found ${rightPanelInfo.sectionCount} sections:`);
      rightPanelInfo.sections.forEach(section => {
        console.log(`      • ${section.title}`);
      });
    } else {
      console.log('   No right panel detected');
      documentation.sections.rightPanel = {
        found: false,
        description: 'No right panel detected on this page'
      };
    }
    
    // 6. STYLING & DESIGN ANALYSIS
    console.log('\n🎨 6. Analyzing styling and design...');
    
    const stylingInfo = await page.evaluate(() => {
      // Color scheme analysis
      const getAllColors = () => {
        const colors = new Set();
        const elements = document.querySelectorAll('*');
        
        elements.forEach(el => {
          const styles = window.getComputedStyle(el);
          colors.add(styles.backgroundColor);
          colors.add(styles.color);
          colors.add(styles.borderColor);
        });
        
        return Array.from(colors).filter(c => c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent');
      };
      
      const bodyStyles = window.getComputedStyle(document.body);
      
      // Get button styles
      const buttons = document.querySelectorAll('button');
      const buttonStyles = buttons.length > 0 ? {
        backgroundColor: window.getComputedStyle(buttons[0]).backgroundColor,
        color: window.getComputedStyle(buttons[0]).color,
        borderRadius: window.getComputedStyle(buttons[0]).borderRadius,
        padding: window.getComputedStyle(buttons[0]).padding,
        fontSize: window.getComputedStyle(buttons[0]).fontSize
      } : null;
      
      // Get card/container styles
      const cards = document.querySelectorAll('[class*="card"], [class*="container"], [class*="box"]');
      const cardStyles = cards.length > 0 ? {
        backgroundColor: window.getComputedStyle(cards[0]).backgroundColor,
        borderRadius: window.getComputedStyle(cards[0]).borderRadius,
        boxShadow: window.getComputedStyle(cards[0]).boxShadow,
        padding: window.getComputedStyle(cards[0]).padding
      } : null;
      
      return {
        typography: {
          fontFamily: bodyStyles.fontFamily,
          fontSize: bodyStyles.fontSize,
          lineHeight: bodyStyles.lineHeight,
          fontWeight: bodyStyles.fontWeight
        },
        colorScheme: {
          primaryBackground: bodyStyles.backgroundColor,
          primaryText: bodyStyles.color,
          accentColors: getAllColors().slice(0, 10)
        },
        components: {
          buttons: buttonStyles,
          cards: cardStyles
        },
        spacing: {
          bodyPadding: bodyStyles.padding,
          bodyMargin: bodyStyles.margin
        }
      };
    });
    
    documentation.sections.styling = {
      description: 'Overall styling, colors, and design system',
      details: stylingInfo
    };
    
    console.log('   Primary font:', stylingInfo.typography.fontFamily.split(',')[0]);
    console.log('   Background:', stylingInfo.colorScheme.primaryBackground);
    console.log('   Text color:', stylingInfo.colorScheme.primaryText);
    
    // 7. TAKE FULL PAGE SCREENSHOT
    console.log('\n📸 7. Taking full page screenshot...');
    await page.screenshot({ 
      path: 'inbox2-docs/00-fullpage.png', 
      fullPage: true 
    });
    
    documentation.sections.fullPage = {
      screenshot: '00-fullpage.png',
      description: 'Complete full-page screenshot with all content'
    };
    
    // Save documentation
    fs.writeFileSync(
      path.join('inbox2-docs', 'documentation.json'), 
      JSON.stringify(documentation, null, 2)
    );
    
    // Create a readable markdown report
    let markdown = `# Inbox2 Page Documentation\n\n`;
    markdown += `**Generated:** ${documentation.timestamp}\n`;
    markdown += `**URL:** ${documentation.pageUrl}\n\n`;
    
    markdown += `## 1. Overall Layout\n\n`;
    markdown += `![Overall Layout](01-overall-layout.png)\n\n`;
    markdown += `**Page Title:** ${documentation.sections.overallLayout.details.title}\n`;
    markdown += `**Viewport:** ${documentation.sections.overallLayout.details.viewport.width}x${documentation.sections.overallLayout.details.viewport.height}\n`;
    markdown += `**Background Color:** ${documentation.sections.overallLayout.details.bodyStyles.backgroundColor}\n`;
    markdown += `**Font Family:** ${documentation.sections.overallLayout.details.bodyStyles.fontFamily}\n\n`;
    
    if (documentation.sections.leftSidebar?.found) {
      markdown += `## 2. Left Sidebar\n\n`;
      markdown += `![Left Sidebar](02-left-sidebar.png)\n\n`;
      markdown += `**Navigation Items:**\n`;
      documentation.sections.leftSidebar.details.navigationItems.forEach(item => {
        markdown += `- ${item.isActive ? '**' : ''}${item.text}${item.isActive ? '**' : ''} (${item.href})\n`;
      });
      markdown += `\n**Styling:**\n`;
      markdown += `- Background: ${documentation.sections.leftSidebar.details.styles.backgroundColor}\n`;
      markdown += `- Width: ${documentation.sections.leftSidebar.details.styles.width}\n\n`;
    }
    
    if (documentation.sections.conversationList?.found) {
      markdown += `## 3. Conversation List\n\n`;
      markdown += `**Total Conversations:** ${documentation.sections.conversationList.details.totalItems}\n\n`;
      markdown += `**Sample Conversations:**\n`;
      documentation.sections.conversationList.details.sampleItems.forEach(item => {
        markdown += `${item.index + 1}. ${item.isUnread ? '🔵 **[Unread]** ' : ''}**${item.name}**\n`;
        markdown += `   - Preview: ${item.preview}\n`;
        markdown += `   - Time: ${item.time}\n`;
      });
      markdown += `\n`;
    }
    
    if (documentation.sections.messageArea?.found) {
      markdown += `## 4. Message/Chat Area\n\n`;
      if (documentation.sections.messageArea.details.header) {
        markdown += `**Header:** ${documentation.sections.messageArea.details.header.title}\n`;
        if (documentation.sections.messageArea.details.header.subtitle) {
          markdown += `**Subtitle:** ${documentation.sections.messageArea.details.header.subtitle}\n`;
        }
      }
      markdown += `**Messages Displayed:** ${documentation.sections.messageArea.details.messageCount}\n`;
      markdown += `**Has Input Area:** ${documentation.sections.messageArea.details.hasInputArea ? 'Yes' : 'No'}\n`;
      if (documentation.sections.messageArea.details.inputPlaceholder) {
        markdown += `**Input Placeholder:** "${documentation.sections.messageArea.details.inputPlaceholder}"\n`;
      }
      markdown += `\n`;
    }
    
    if (documentation.sections.rightPanel?.found) {
      markdown += `## 5. Right Panel\n\n`;
      markdown += `![Right Panel](05-right-panel.png)\n\n`;
      markdown += `**Sections:**\n`;
      documentation.sections.rightPanel.details.sections.forEach(section => {
        markdown += `- ${section.title}\n`;
      });
      markdown += `\n`;
    }
    
    markdown += `## 6. Styling & Design\n\n`;
    markdown += `**Typography:**\n`;
    markdown += `- Font Family: ${documentation.sections.styling.details.typography.fontFamily}\n`;
    markdown += `- Font Size: ${documentation.sections.styling.details.typography.fontSize}\n`;
    markdown += `- Line Height: ${documentation.sections.styling.details.typography.lineHeight}\n\n`;
    markdown += `**Color Scheme:**\n`;
    markdown += `- Primary Background: ${documentation.sections.styling.details.colorScheme.primaryBackground}\n`;
    markdown += `- Primary Text: ${documentation.sections.styling.details.colorScheme.primaryText}\n\n`;
    
    if (documentation.sections.styling.details.components.buttons) {
      markdown += `**Button Styling:**\n`;
      markdown += `- Background: ${documentation.sections.styling.details.components.buttons.backgroundColor}\n`;
      markdown += `- Color: ${documentation.sections.styling.details.components.buttons.color}\n`;
      markdown += `- Border Radius: ${documentation.sections.styling.details.components.buttons.borderRadius}\n\n`;
    }
    
    markdown += `## Screenshots\n\n`;
    markdown += `- [Full Page Screenshot](00-fullpage.png)\n`;
    markdown += `- [Overall Layout](01-overall-layout.png)\n`;
    markdown += `- [Left Sidebar](02-left-sidebar.png)\n`;
    if (documentation.sections.rightPanel?.found) {
      markdown += `- [Right Panel](05-right-panel.png)\n`;
    }
    
    fs.writeFileSync(path.join('inbox2-docs', 'README.md'), markdown);
    
    console.log('\n✅ Documentation complete!');
    console.log(`📁 Results saved to: inbox2-docs/`);
    console.log('   - documentation.json (detailed data)');
    console.log('   - README.md (readable report)');
    console.log('   - Multiple screenshots');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await browser.close();
  }
})();
