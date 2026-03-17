# Inbox2 Page Documentation - Quick Reference

## 📸 Screenshots Available

Located in `inbox2-docs/` folder:

1. **00-fullpage.png** - Complete page view
2. **sidebar-navigation.png** - Left navigation (60px wide)
3. **inbox-categories-panel.png** - Inbox categories (300px wide)
4. **conversation-list-panel.png** - Message list (500px wide)
5. **detailed-02-topbar.png** - Top bar detail

## 🎨 Quick Style Guide

### Colors
- **Background:** `rgb(250, 247, 242)` - Warm cream
- **Text:** `rgb(44, 36, 23)` - Dark brown
- **Primary Blue:** `rgb(0, 98, 184)` - Actions/links
- **Alert Red:** `rgb(239, 68, 68)` - Notifications

### Typography
- **Font:** "Space Grotesk", system-ui, sans-serif
- **Base Size:** 16px
- **Line Height:** 24px

### Spacing
- **Top Bar Height:** ~56-64px
- **Nav Sidebar Width:** 60px (collapsed)
- **Inbox Panel Width:** ~250-300px
- **Conversation List:** ~400-500px

## 📐 Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  Top Bar (Search, NextIQ, Profile, etc.)           │
├────┬─────────┬──────────────┬─────────────────────┤
│Nav │ Inbox   │ Conversation │ Message Detail      │
│    │ Cats    │ List         │ (when selected)     │
│60px│250-300px│ 400-500px    │ Flexible           │
│    │         │              │                     │
│    │         │              │                     │
└────┴─────────┴──────────────┴─────────────────────┘
```

## 🧭 Navigation Items (Left Sidebar)

1. ☰ Menu
2. 🏠 Home
3. 📬 **Inbox** (badge: 11) ← Currently active
4. 📞 Phone
5. 📹 Meetings
6. 👥 Contacts
7. 🏢 Accounts
8. 🎫 Tickets (badge: 2)
9. 📊 Analytics
10. 👁️ Supervisor view
11. 🏪 Marketplace
12. ⚙️ Settings
13. 👋 Help

## 📥 Inbox Categories (Second Panel)

### Personal Inboxes
- **My Inbox** (selected - blue highlight)
- **Contacts** (badge: 1)
- **Internal** (badge: 2)

### Team Inboxes
- **💰 Sales** - 3 members (badge: 2)
- **😊 Service** - 3 members
- **📣 Marketing** - 2 members (badge: 1)
- **+ Create Team** (action button)

## 💬 Conversation List Features

### Header Controls
- **All 29** - Filter dropdown (blue button)
- **Unread 3** - Unread filter

### Conversation Item Structure
Each item shows:
- **Avatar** (circular, colored background)
- **Name/Subject** (bold)
- **Message Preview** (2-3 lines, gray text)
- **Timestamp** (relative: 5m, 2h, etc.)
- **Unread Dot** (blue indicator if unread)
- **Action Buttons** (on hover)

### Sample Conversations Visible
1. Eddie Ramirez - 22m
2. Jake Miller - 5m
3. #marketing - 30m
4. Ben Nakamura - 2h
5. Ron Mitchell - 7h
6. Maria Santos - 2h
7. Maria Santos, Dan Cooper, Jake Miller - 2h
8. Dan Cooper - 19m
9. Rachel Park - 1h
10. Aisha Williams - 10m
11. Omar Hassan - 2h

## 🎯 Top Bar Elements

**Left to Right:**
1. Logo & Search ("Search on Ask Next(Q)" with ⌘K)
2. "Complete Setup" (6 left badge)
3. **"+ NextIQ"** button (primary blue)
4. 📞 Phone icon
5. ⚙️ Settings icon
6. 🔔 Notifications (with badge)
7. 👤 Profile avatar

## 🎨 Design Characteristics

- **Style:** Modern, flat design with minimal shadows
- **Warmth:** Unusual warm beige/cream backgrounds
- **Icons:** Line-style, consistent stroke weight
- **Badges:** Red circles for notifications
- **Interactions:** Subtle hover states, clear selected states
- **Accessibility:** High contrast, readable fonts

## 💡 Key Features

✅ Unified multi-channel inbox (email, DM, SMS, calls)  
✅ Team-based collaboration with shared inboxes  
✅ Real-time notification badges  
✅ Category-based organization  
✅ Smart filtering (All, Unread)  
✅ Global search functionality  
✅ AI assistant integration (NextIQ)  
✅ Quick access to phone, meetings, settings  

## 📝 Technical Notes

- **Framework:** Likely React with Tailwind CSS
- **Layout:** Flexbox with fixed positioned sidebars
- **Responsive:** Designed for responsive behavior
- **CSS Variables:** Custom properties for theming
- **Authentication:** Password protected

## 📚 Full Documentation

For complete details, see:
- **COMPLETE-ANALYSIS.md** - Comprehensive analysis (all details)
- **DETAILED-DOCUMENTATION.md** - Detailed feature breakdown
- **documentation.json** - Machine-readable data
- **dom-structure.json** - DOM structure analysis
