import { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import theme from './theme';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import InboxPage from './pages/InboxPage';
import MeetingsPage from './pages/MeetingsPage';
import CallsPage from './pages/CallsPage';
import ContactsPage from './pages/ContactsPage';
import TicketsPage from './pages/TicketsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import IntegrationsPage from './pages/IntegrationsPage';
import NextIQPage from './pages/NextIQPage';
import AdminPage from './pages/AdminPage';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [initialCustomerId, setInitialCustomerId] = useState(null);
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  const navigateToInbox = (customerId) => {
    setInitialCustomerId(customerId || null);
    setActiveNav('inbox');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const fullWidthPages = ['inbox', 'contacts'];
  const isFullWidth = fullWidthPages.includes(activeNav);

  const renderPage = () => {
    switch (activeNav) {
      case 'home':
        return <HomePage setActiveNav={setActiveNav} navigateToInbox={navigateToInbox} />;
      case 'inbox':
        return <InboxPage initialCustomerId={initialCustomerId} onConsumeInitialId={() => setInitialCustomerId(null)} />;
      case 'meetings':
        return <MeetingsPage />;
      case 'calls':
        return <CallsPage />;
      case 'contacts':
        return <ContactsPage />;
      case 'tickets':
        return <TicketsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'integrations':
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
        display: 'flex',
        height: '100vh',
        backgroundColor: colors.background,
        fontFamily: theme.fonts.body,
        color: colors.text,
      }}
    >
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onOpenHelp={() => {}}
      />
      <div
        style={{
          flex: 1,
          marginLeft: '72px',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <TopBar activeNav={activeNav} setActiveNav={setActiveNav} />
        <main
          style={{
            flex: 1,
            overflowY: isFullWidth ? 'hidden' : 'auto',
            padding: isFullWidth ? 0 : (activeNav === 'admin' ? 0 : '32px'),
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
