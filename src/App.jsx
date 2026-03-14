import { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import theme from './theme';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import InboxPage from './pages/InboxPage';
import MeetingsPage from './pages/MeetingsPage';
import CallsPage from './pages/CallsPage';
import ContactsPage from './pages/ContactsPage';
import AccountsPage from './pages/AccountsPage';
import TicketsPage from './pages/TicketsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import IntegrationsPage from './pages/IntegrationsPage';
import NextIQPage from './pages/NextIQPage';
import AdminPage from './pages/AdminPage';
import SupervisorPage from './pages/SupervisorPage';
import Sidebar, { COLLAPSED_WIDTH, EXPANDED_WIDTH, HEADER_HEIGHT } from './components/Sidebar';
import TopBar from './components/TopBar';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [initialCustomerId, setInitialCustomerId] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const sidebarWidth = sidebarExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH;

  const navigateToInbox = (customerId) => {
    setInitialCustomerId(customerId || null);
    setActiveNav('inbox');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const fullWidthPages = ['inbox', 'contacts', 'phone', 'accounts'];
  const isFullWidth = fullWidthPages.includes(activeNav);

  const renderPage = () => {
    switch (activeNav) {
      case 'home':
        return <HomePage setActiveNav={setActiveNav} navigateToInbox={navigateToInbox} />;
      case 'inbox':
        return <InboxPage initialCustomerId={initialCustomerId} onConsumeInitialId={() => setInitialCustomerId(null)} />;
      case 'meetings':
        return <MeetingsPage />;
      case 'phone':
        return <CallsPage />;
      case 'contacts':
        return <ContactsPage />;
      case 'accounts':
        return <AccountsPage />;
      case 'tickets':
        return <TicketsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'supervisor':
        return <SupervisorPage />;
      case 'marketplace':
        return <IntegrationsPage />;
      case 'nextiq':
        return <NextIQPage />;
      case 'admin':
        return <AdminPage setActiveNav={setActiveNav} />;
      default:
        return <HomePage setActiveNav={setActiveNav} />;
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        backgroundColor: colors.background,
        fontFamily: theme.fonts.body,
        color: colors.text,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TopBar activeNav={activeNav} setActiveNav={setActiveNav} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          onOpenHelp={() => {}}
          expanded={sidebarExpanded}
          onToggleExpand={() => setSidebarExpanded(prev => !prev)}
        />
        <main
          style={{
            flex: 1,
            marginLeft: `${sidebarWidth}px`,
            overflowY: isFullWidth ? 'hidden' : 'auto',
            padding: isFullWidth ? 0 : (activeNav === 'admin' ? 0 : '32px'),
            transition: 'margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
