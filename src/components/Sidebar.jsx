import { useState } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import { NextivaXLogo } from './NextivaLogo';
import { inboxCounts } from '../data/contacts';
import {
  Home, Inbox, Video, Phone, Users, FileText, BarChart3,
  Puzzle, Sparkles, Settings,
} from 'lucide-react';

const navItems = [
  { id: 'home', icon: Home },
  { id: 'inbox', icon: Inbox, badge: inboxCounts.total },
  { id: 'meetings', icon: Video, badge: 1 },
  { id: 'calls', icon: Phone },
  { id: 'contacts', icon: Users },
  { id: 'tickets', icon: FileText, badge: 2 },
  { id: 'analytics', icon: BarChart3 },
  { id: 'integrations', icon: Puzzle },
  { id: 'nextiq', icon: Sparkles },
];

const labels = {
  home: 'Home',
  inbox: 'Inbox',
  meetings: 'Meetings',
  calls: 'Calls',
  contacts: 'Contacts',
  tickets: 'Tickets',
  analytics: 'Analytics',
  integrations: 'Integrations',
  nextiq: 'NextIQ',
};

export default function Sidebar({ activeNav, setActiveNav, onOpenHelp }) {
  const [hoveredId, setHoveredId] = useState(null);
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const isDark = themeMode === 'dark';

  return (
    <aside
      style={{
        width: '72px',
        ...(isDark ? theme.glass.dark : theme.glass.light),
        borderRight: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 0',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100,
        boxShadow: isDark
          ? '2px 0 16px rgba(0, 0, 0, 0.3)'
          : '2px 0 16px rgba(11, 43, 74, 0.08)',
        transition: `all ${theme.transitions.slow}`,
      }}
    >
      {/* Logo */}
      <button
        onClick={() => setActiveNav('home')}
        aria-label="Go to home"
        style={{
          marginBottom: '24px',
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          padding: 0,
          outline: 'none',
        }}
      >
        <NextivaXLogo size={28} />
      </button>

      {/* Main nav */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '0 12px',
          width: '100%',
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          const isHovered = hoveredId === item.id && !isActive;
          const label = labels[item.id] || item.id;
          const badgeText = item.badge
            ? `, ${item.badge} ${item.id === 'inbox' ? 'unread messages' : item.id === 'meetings' ? 'upcoming meetings' : 'items'}`
            : '';

          return (
            <button
              key={item.id}
              onClick={() => {
                setHoveredId(null);
                setActiveNav(item.id);
              }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              aria-label={`${label}${badgeText}`}
              aria-current={isActive ? 'page' : undefined}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: theme.radii.lg,
                border: 'none',
                backgroundColor: isActive
                  ? theme.colors.blue
                  : isHovered
                    ? colors.sidebarHover
                    : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transition: 'background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
                boxShadow: isActive ? '0 4px 12px rgba(0, 98, 184, 0.4)' : 'none',
                transform: isActive || isHovered ? 'scale(1.02)' : 'scale(1)',
                outline: 'none',
              }}
            >
              <Icon
                size={20}
                color={isActive ? theme.colors.white : colors.textSecondary}
              />
              {item.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    minWidth: '18px',
                    height: '18px',
                    padding: '0 5px',
                    backgroundColor: isActive ? theme.colors.white : theme.colors.blue,
                    borderRadius: theme.radii.full,
                    fontSize: '11px',
                    fontWeight: 700,
                    color: isActive ? theme.colors.blue : theme.colors.white,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom items */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        {/* Settings */}
        <button
          aria-label="Settings"
          onClick={() => setActiveNav('admin')}
          onMouseEnter={() => setHoveredId('settings')}
          onMouseLeave={() => setHoveredId(null)}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: theme.radii.md,
            border: 'none',
            backgroundColor:
              hoveredId === 'settings' ? colors.sidebarHover : 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: theme.transitions.fast,
            outline: 'none',
          }}
        >
          <Settings size={20} color={colors.textSecondary} />
        </button>

        {/* Help */}
        {onOpenHelp && (
          <button
            type="button"
            onClick={onOpenHelp}
            onMouseEnter={() => setHoveredId('help')}
            onMouseLeave={() => setHoveredId(null)}
            aria-label="Get help"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: theme.radii.md,
              border: 'none',
              backgroundColor:
                hoveredId === 'help' ? colors.sidebarHover : 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s ease, transform 0.2s ease',
              transform: hoveredId === 'help' ? 'scale(1.02)' : 'scale(1)',
              outline: 'none',
            }}
          >
            <span style={{ fontSize: '22px', lineHeight: 1 }} aria-hidden>
              👋
            </span>
          </button>
        )}
      </div>
    </aside>
  );
}
