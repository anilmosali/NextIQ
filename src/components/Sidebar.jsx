import { useState } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import {
  Home, Inbox, Phone, Video, Users, Building2, FileText,
  BarChart3, Eye, Store, Settings, Menu,
} from 'lucide-react';

const navGroups = [
  {
    label: null,
    items: [
      { id: 'home', icon: Home, label: 'Home' },
      { id: 'inbox', icon: Inbox, label: 'Inbox', badge: 11 },
      { id: 'phone', icon: Phone, label: 'Phone' },
      { id: 'meetings', icon: Video, label: 'Meetings' },
    ],
  },
  {
    label: 'MANAGE',
    items: [
      { id: 'contacts', icon: Users, label: 'Contacts' },
      { id: 'accounts', icon: Building2, label: 'Accounts' },
      { id: 'tickets', icon: FileText, label: 'Tickets', badge: 2 },
    ],
  },
  {
    label: 'TOOLS',
    items: [
      { id: 'analytics', icon: BarChart3, label: 'Analytics' },
      { id: 'supervisor', icon: Eye, label: 'Supervisor view' },
    ],
  },
];

const bottomItems = [
  { id: 'marketplace', icon: Store, label: 'Marketplace' },
  { id: 'admin', icon: Settings, label: 'Settings' },
];

const COLLAPSED_WIDTH = 56;
const EXPANDED_WIDTH = 220;
const HEADER_HEIGHT = 56;

export default function Sidebar({ activeNav, setActiveNav, onOpenHelp, expanded, onToggleExpand }) {
  const [hoveredId, setHoveredId] = useState(null);
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  const isExpanded = expanded;
  const sidebarWidth = isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH;

  const iconBoxStyle = {
    width: '24px',
    minWidth: '24px',
    maxWidth: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  const renderNavItem = (item) => {
    const Icon = item.icon;
    const isActive = activeNav === item.id;
    const isHovered = hoveredId === item.id && !isActive;

    if (isExpanded) {
      return (
        <button
          key={item.id}
          onClick={() => { setHoveredId(null); setActiveNav(item.id); }}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
          aria-label={item.label}
          aria-current={isActive ? 'page' : undefined}
          style={{
            width: '100%',
            height: '40px',
            padding: '0 14px',
            border: 'none',
            backgroundColor: isActive
              ? 'rgba(0, 98, 184, 0.06)'
              : isHovered ? colors.surfaceHover : 'transparent',
            cursor: 'pointer',
            display: 'grid',
            gridTemplateColumns: '24px 1fr auto',
            gap: '12px',
            alignItems: 'center',
            borderRadius: theme.radii.md,
            transition: 'background-color 0.15s ease',
            outline: 'none',
          }}
        >
          <div style={iconBoxStyle}>
            <Icon
              size={20}
              color={isActive ? theme.colors.navy : colors.textSecondary}
              strokeWidth={isActive ? 2 : 1.6}
            />
          </div>
          <span
            style={{
              fontSize: '14px',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? theme.colors.navy : colors.textSecondary,
              fontFamily: theme.fonts.body,
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: 'left',
            }}
          >
            {item.label}
          </span>
          {item.badge ? (
            <span
              style={{
                minWidth: '18px',
                height: '18px',
                padding: '0 5px',
                backgroundColor: '#DC6868',
                borderRadius: theme.radii.full,
                fontSize: '10px',
                fontWeight: 600,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}
            >
              {item.badge}
            </span>
          ) : <span />}
        </button>
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => { setHoveredId(null); setActiveNav(item.id); }}
        onMouseEnter={() => setHoveredId(item.id)}
        onMouseLeave={() => setHoveredId(null)}
        aria-label={item.label}
        aria-current={isActive ? 'page' : undefined}
        style={{
          width: '100%',
          height: '44px',
          padding: '0',
          border: 'none',
          backgroundColor: isActive
            ? 'rgba(0, 98, 184, 0.06)'
            : isHovered ? colors.surfaceHover : 'transparent',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: theme.radii.md,
          transition: 'background-color 0.15s ease',
          outline: 'none',
        }}
      >
        <div style={iconBoxStyle}>
          <Icon
            size={20}
            color={isActive ? theme.colors.navy : colors.textSecondary}
            strokeWidth={isActive ? 2 : 1.6}
          />
          {item.badge && (
            <span
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-7px',
                minWidth: '14px',
                height: '14px',
                padding: '0 3px',
                backgroundColor: '#DC6868',
                borderRadius: theme.radii.full,
                fontSize: '9px',
                fontWeight: 600,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}
            >
              {item.badge}
            </span>
          )}
        </div>
      </button>
    );
  };

  const dividerStyle = {
    width: isExpanded ? 'calc(100% - 28px)' : '28px',
    height: '1px',
    backgroundColor: colors.border,
    margin: isExpanded ? '4px auto' : '6px auto',
    flexShrink: 0,
  };

  return (
    <aside
      role="navigation"
      aria-label="Main navigation"
      style={{
        width: sidebarWidth,
        backgroundColor: colors.surface,
        borderRight: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: `${HEADER_HEIGHT}px`,
        left: 0,
        bottom: 0,
        zIndex: 90,
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
      }}
    >
      {/* Hamburger toggle */}
      <div style={{
        padding: isExpanded ? '14px 14px 6px' : '14px 0 6px',
        width: '100%',
        display: 'flex',
        justifyContent: isExpanded ? 'flex-start' : 'center',
      }}>
        <button
          onClick={onToggleExpand}
          aria-label={isExpanded ? 'Collapse navigation' : 'Expand navigation'}
          style={{
            width: isExpanded ? '100%' : '40px',
            height: '40px',
            borderRadius: isExpanded ? theme.radii.lg : theme.radii.md,
            border: isExpanded ? `1px solid ${colors.border}` : 'none',
            backgroundColor: isExpanded ? colors.surfaceHover : 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isExpanded ? 'flex-start' : 'center',
            padding: isExpanded ? '0 12px' : '0',
            outline: 'none',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            if (!isExpanded) e.currentTarget.style.backgroundColor = colors.surfaceHover;
          }}
          onMouseLeave={e => {
            if (!isExpanded) e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Menu size={20} color={colors.textSecondary} />
        </button>
      </div>

      {/* Navigation groups */}
      <nav style={{
        flex: 1,
        width: '100%',
        padding: isExpanded ? '0 10px' : '0 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1px',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {gi > 0 && <div style={dividerStyle} />}
            {isExpanded && group.label && (
              <div style={{
                fontSize: '11px',
                fontWeight: 600,
                color: colors.textSecondary,
                letterSpacing: '0.8px',
                padding: '10px 14px 6px',
                fontFamily: theme.fonts.body,
                opacity: 0.7,
              }}>
                {group.label}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {group.items.map(renderNavItem)}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div style={{
        width: '100%',
        padding: isExpanded ? '0 10px 14px' : '0 8px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1px',
      }}>
        <div style={dividerStyle} />
        {bottomItems.map(renderNavItem)}
        {/* Help */}
        {isExpanded ? (
          <button
            onClick={onOpenHelp}
            onMouseEnter={() => setHoveredId('help')}
            onMouseLeave={() => setHoveredId(null)}
            aria-label="Help"
            style={{
              width: '100%',
              height: '40px',
              padding: '0 14px',
              border: 'none',
              backgroundColor: hoveredId === 'help' ? colors.surfaceHover : 'transparent',
              cursor: 'pointer',
              display: 'grid',
              gridTemplateColumns: '24px 1fr auto',
              gap: '12px',
              alignItems: 'center',
              borderRadius: theme.radii.md,
              transition: 'background-color 0.15s ease',
              outline: 'none',
            }}
          >
            <span style={{ ...iconBoxStyle, position: 'static', fontSize: '18px', lineHeight: 1 }}>👋</span>
            <span style={{
              fontSize: '14px',
              fontWeight: 400,
              color: colors.textSecondary,
              fontFamily: theme.fonts.body,
              textAlign: 'left',
            }}>Help</span>
            <span />
          </button>
        ) : (
          <button
            onClick={onOpenHelp}
            onMouseEnter={() => setHoveredId('help')}
            onMouseLeave={() => setHoveredId(null)}
            aria-label="Help"
            style={{
              width: '100%',
              height: '44px',
              padding: '0',
              border: 'none',
              backgroundColor: hoveredId === 'help' ? colors.surfaceHover : 'transparent',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: theme.radii.md,
              transition: 'background-color 0.15s ease',
              outline: 'none',
            }}
          >
            <span style={{ ...iconBoxStyle, position: 'static', fontSize: '18px', lineHeight: 1 }}>👋</span>
          </button>
        )}
      </div>
    </aside>
  );
}

export { COLLAPSED_WIDTH, EXPANDED_WIDTH, HEADER_HEIGHT };
