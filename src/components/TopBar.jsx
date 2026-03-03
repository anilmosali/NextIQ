import { useState, useRef, useEffect } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import Avatar from './Avatar';
import {
  Search, Phone, MessageSquare, ChevronDown, ChevronRight,
  Bell, Sparkles, Video, Mail, Voicemail, X, CheckCircle,
  Settings, Moon, LogOut, Pencil,
} from 'lucide-react';

/* ─── Onboarding Steps Widget ─── */
function OnboardingWidget({ setActiveNav }) {
  const [hovered, setHovered] = useState(false);
  const steps = [
    { id: 'calling', label: 'Calling settings', completed: true },
    { id: 'sms', label: 'Text message registration (10DLC)', completed: false },
    { id: 'social', label: 'Connect social media', completed: false },
    { id: 'email', label: 'Set up business email', completed: false },
    { id: 'chat', label: 'Customize and deploy live chat', completed: false },
    { id: 'contacts', label: 'Import contacts', completed: false },
    { id: 'review', label: 'Setup Summary', completed: false },
  ];

  const total = steps.length;
  const completed = steps.filter((s) => s.completed).length;
  const pct = Math.round((completed / total) * 100);
  const remaining = total - completed;
  const allDone = pct === 100;
  const r = 11;
  const circumference = 2 * Math.PI * r;
  const dashoffset = circumference * (1 - pct / 100);

  return (
    <div
      onClick={() => setActiveNav && setActiveNav('admin')}
      onMouseEnter={(e) => {
        setHovered(true);
        e.currentTarget.style.boxShadow =
          '0 4px 12px rgba(0, 98, 184, 0.15), 0 0 0 1px rgba(0, 98, 184, 0.2)';
        e.currentTarget.style.borderColor = `${theme.colors.blue}40`;
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        e.currentTarget.style.boxShadow =
          '0 1px 3px rgba(2, 18, 44, 0.06), 0 0 0 1px rgba(0, 98, 184, 0.08)';
        e.currentTarget.style.borderColor = `${theme.colors.blue}20`;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 16px',
        backgroundColor: theme.colors.white,
        borderRadius: theme.radii.lg,
        border: `1px solid ${theme.colors.blue}20`,
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow:
          '0 1px 3px rgba(2, 18, 44, 0.06), 0 0 0 1px rgba(0, 98, 184, 0.08)',
        position: 'relative',
        overflow: 'hidden',
        height: '40px',
        boxSizing: 'border-box',
      }}
    >
      {/* Circular progress */}
      <div style={{ position: 'relative', flexShrink: 0, width: '28px', height: '28px' }}>
        <svg width={28} height={28} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={14} cy={14} r={r} fill="none" stroke={theme.colors.gray150} strokeWidth={2} />
          <circle
            cx={14}
            cy={14}
            r={r}
            fill="none"
            stroke={theme.colors.blue}
            strokeWidth={2.5}
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {allDone ? (
            <CheckCircle size={14} color={theme.colors.success} />
          ) : (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: theme.colors.blue,
                fontFamily: theme.fonts.body,
                letterSpacing: '-0.2px',
                lineHeight: 1,
              }}
            >
              {pct}%
            </span>
          )}
        </div>
      </div>

      {/* Label */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flex: 1,
          minWidth: 0,
        }}
      >
        {allDone ? (
          <span
            style={{
              fontSize: '14px',
              color: theme.colors.success,
              fontWeight: 600,
              fontFamily: theme.fonts.body,
              lineHeight: 1.1,
              whiteSpace: 'nowrap',
            }}
          >
            Setup Complete
          </span>
        ) : (
          <>
            <span
              style={{
                fontSize: '14px',
                color: theme.colors.navy,
                fontWeight: 600,
                fontFamily: theme.fonts.body,
                lineHeight: 1.1,
                whiteSpace: 'nowrap',
              }}
            >
              Complete Setup
            </span>
            <span
              style={{
                fontSize: '13px',
                color: theme.colors.gray500,
                fontFamily: theme.fonts.body,
                lineHeight: 1.1,
                whiteSpace: 'nowrap',
              }}
            >
              • {remaining} left
            </span>
          </>
        )}
      </div>

      {!allDone && <ChevronRight size={14} color={theme.colors.blue} />}
    </div>
  );
}

/* ─── Main TopBar ─── */
export default function TopBar({ activeNav, setActiveNav }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showCallMenu, setShowCallMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('available');
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const callMenuRef = useRef(null);
  const notifRef = useRef(null);
  const userRef = useRef(null);
  const statusRef = useRef(null);
  const unreadCount = 3;

  useEffect(() => {
    const handler = (e) => {
      if (callMenuRef.current && !callMenuRef.current.contains(e.target)) setShowCallMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false);
      if (statusRef.current && !statusRef.current.contains(e.target)) setShowStatusMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const statusOptions = [
    { id: 'available', label: 'Available', color: theme.colors.success, emoji: '🟢' },
    { id: 'busy', label: 'Busy', color: theme.colors.error, emoji: '🔴' },
    { id: 'away', label: 'Away', color: theme.colors.warning, emoji: '🟡' },
    { id: 'dnd', label: 'Do Not Disturb', color: theme.colors.error, emoji: '🔴' },
    { id: 'offline', label: 'Appear Offline', color: theme.colors.gray400, emoji: '⚫' },
  ];
  const currentStatusObj = statusOptions.find((s) => s.id === currentStatus);

  return (
    <header
      style={{
        height: '68px',
        backgroundColor: colors.surface,
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        transition: `all ${theme.transitions.slow}`,
      }}
    >
      {/* ─── Left: Search ─── */}
      <div style={{ position: 'relative', width: '360px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: colors.inputBackground,
            borderRadius: searchFocused ? '10px 10px 0 0' : '10px',
            padding: '12px',
            border: `2px solid ${searchFocused ? theme.colors.blue : colors.inputBorder}`,
            boxShadow: searchFocused
              ? `0 0 0 4px ${theme.colors.blueMuted}, 0 8px 24px rgba(11, 43, 74, 0.12)`
              : '0 1px 3px rgba(11, 43, 74, 0.04)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
          }}
        >
          <Search
            size={18}
            color={searchFocused ? theme.colors.blue : colors.textSecondary}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              zIndex: 1,
              transition: 'color 0.2s ease',
            }}
          />
          <input
            type="text"
            placeholder="Search or Ask NextIQ..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              border: 'none',
              background: 'none',
              outline: 'none',
              fontSize: '15px',
              color: colors.text,
              flex: 1,
              fontFamily: theme.fonts.body,
              fontWeight: 400,
              paddingLeft: '38px',
              paddingRight: '8px',
            }}
          />
          {searchValue && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSearchValue('');
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                flexShrink: 0,
                marginLeft: '8px',
                borderRadius: theme.radii.xs,
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.gray100)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <X size={16} color={theme.colors.gray400} />
            </button>
          )}
          <kbd
            style={{
              fontSize: '11px',
              fontFamily: theme.fonts.body,
              color: searchFocused ? theme.colors.blue : theme.colors.gray400,
              flexShrink: 0,
              marginLeft: '8px',
              padding: '4px 8px',
              backgroundColor: searchFocused ? theme.colors.blueMuted : theme.colors.gray100,
              borderRadius: theme.radii.sm,
              border: `1px solid ${searchFocused ? theme.colors.blue + '30' : theme.colors.gray200}`,
              fontWeight: 600,
              letterSpacing: '0.5px',
              transition: 'all 0.2s ease',
            }}
          >
            ⌘K
          </kbd>
        </div>
      </div>

      {/* ─── Right side items ─── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Onboarding Widget */}
        <OnboardingWidget setActiveNav={setActiveNav} />

        {/* Copilot Button */}
        <button
          onClick={() => setActiveNav && setActiveNav('nextiq')}
          aria-label="Copilot"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            backgroundColor: theme.colors.blue,
            border: 'none',
            borderRadius: theme.radii.md,
            cursor: 'pointer',
            height: '40px',
            transition: theme.transitions.fast,
            boxShadow: '0 2px 8px rgba(0, 98, 184, 0.25)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0056A0';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 98, 184, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.blue;
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 98, 184, 0.25)';
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={13} color="white" fill="white" strokeWidth={0} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'white' }}>Copilot</span>
        </button>

        {/* Divider */}
        <div style={{ width: '1px', height: '24px', backgroundColor: theme.colors.gray200, margin: '0 4px' }} />

        {/* Phone / SMS / More segmented group */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} ref={callMenuRef}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: showCallMenu ? theme.colors.gray100 : colors.surface,
              border: `1px solid ${theme.colors.gray200}`,
              borderRadius: theme.radii.md,
              cursor: 'pointer',
              transition: theme.transitions.fast,
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.gray100;
              e.currentTarget.style.borderColor = theme.colors.gray300;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = showCallMenu ? theme.colors.gray100 : colors.surface;
              e.currentTarget.style.borderColor = theme.colors.gray200;
            }}
          >
            {/* Phone button */}
            <button
              aria-label="Open dial pad to make a phone call"
              style={{
                width: '40px',
                height: '40px',
                padding: 0,
                backgroundColor: 'transparent',
                border: 'none',
                borderRight: `1px solid ${theme.colors.gray200}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: theme.transitions.fast,
                outline: 'none',
              }}
            >
              <Phone size={18} color={theme.colors.navy} />
            </button>

            {/* SMS button */}
            <button
              aria-label="Open SMS composer"
              style={{
                width: '40px',
                height: '40px',
                padding: 0,
                backgroundColor: 'transparent',
                border: 'none',
                borderRight: `1px solid ${theme.colors.gray200}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: theme.transitions.fast,
                outline: 'none',
              }}
            >
              <MessageSquare size={18} color={theme.colors.navy} />
            </button>

            {/* Chevron dropdown */}
            <button
              onClick={() => setShowCallMenu(!showCallMenu)}
              aria-label="Open calling menu"
              aria-expanded={showCallMenu}
              style={{
                width: '32px',
                height: '40px',
                padding: 0,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: theme.transitions.fast,
                outline: 'none',
              }}
            >
              <ChevronDown size={14} color={theme.colors.navy} />
            </button>
          </div>

          {/* Dropdown menu */}
          {showCallMenu && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                backgroundColor: theme.colors.white,
                borderRadius: theme.radii.xl,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: `1px solid ${theme.colors.gray150}`,
                width: '220px',
                zIndex: 1000,
                overflow: 'hidden',
                animation: 'fadeIn 0.15s ease',
                padding: '4px 0',
              }}
            >
              {[
                { icon: Video, label: 'Video Call', action: () => {} },
                { icon: MessageSquare, label: 'Message', action: () => setActiveNav('inbox') },
                { icon: Mail, label: 'Email', action: () => {} },
                { icon: Voicemail, label: 'Voicemail', action: () => setActiveNav('calls') },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    item.action();
                    setShowCallMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    borderRadius: 0,
                    transition: theme.transitions.fast,
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.gray50)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <item.icon size={18} color={theme.colors.blue} />
                  <span style={{ fontSize: '14px', fontWeight: 500, color: theme.colors.navy }}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
            aria-expanded={showNotifications}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: theme.radii.md,
              border: `1px solid ${theme.colors.gray200}`,
              backgroundColor: showNotifications ? theme.colors.gray100 : colors.surface,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              outline: 'none',
              transition: theme.transitions.fast,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.gray100;
              e.currentTarget.style.borderColor = theme.colors.gray300;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = showNotifications
                ? theme.colors.gray100
                : colors.surface;
              e.currentTarget.style.borderColor = theme.colors.gray200;
            }}
          >
            <Bell size={18} color={theme.colors.navy} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  minWidth: '16px',
                  height: '16px',
                  padding: '0 4px',
                  backgroundColor: theme.colors.error,
                  borderRadius: theme.radii.full,
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${colors.surface}`,
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Status dropdown */}
        <div style={{ position: 'relative' }} ref={statusRef}>
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px', borderRadius: theme.radii.full,
              border: `1px solid ${colors.border}`, backgroundColor: colors.surface,
              cursor: 'pointer', fontSize: '13px', fontWeight: 500,
              fontFamily: theme.fonts.body, color: colors.text,
              transition: theme.transitions.fast,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = colors.borderHover || theme.colors.gray300; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: currentStatusObj?.color, flexShrink: 0 }} />
            {currentStatusObj?.label}
            <ChevronDown size={14} color={colors.textSecondary} />
          </button>

          {showStatusMenu && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', right: 0, width: '180px',
              backgroundColor: colors.cardBackground, borderRadius: theme.radii.lg,
              border: `1px solid ${colors.border}`, boxShadow: theme.shadows.dropdown,
              padding: '4px', zIndex: 1000, animation: 'fadeIn 0.15s ease',
            }}>
              {statusOptions.map(status => (
                <button
                  key={status.id}
                  onClick={() => { setCurrentStatus(status.id); setShowStatusMenu(false); }}
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: theme.radii.sm,
                    border: 'none', backgroundColor: currentStatus === status.id ? colors.surfaceHover : 'transparent',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                    fontSize: '13px', fontFamily: theme.fonts.body, color: colors.text,
                    transition: theme.transitions.fast, textAlign: 'left',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = colors.surfaceHover; }}
                  onMouseLeave={e => { if (currentStatus !== status.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: status.color, flexShrink: 0 }} />
                  {status.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User avatar */}
        <div style={{ position: 'relative' }} ref={userRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="User menu"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '4px',
              borderRadius: theme.radii.md, border: 'none', backgroundColor: 'transparent',
              cursor: 'pointer', transition: theme.transitions.fast,
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = colors.surfaceHover)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <div style={{ position: 'relative' }}>
              <Avatar name="Anil Reddy" size={34} />
              <div style={{
                position: 'absolute', bottom: -1, right: -1, width: '10px', height: '10px',
                borderRadius: '50%', backgroundColor: currentStatusObj?.color,
                border: `2px solid ${colors.surface}`,
              }} />
            </div>
          </button>

          {showUserMenu && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: '300px',
              backgroundColor: colors.cardBackground, borderRadius: '16px',
              border: `1px solid ${colors.border}`, boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
              zIndex: 1000, animation: 'fadeIn 0.15s ease', overflow: 'hidden',
            }}>
              {/* Profile header */}
              <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <Avatar name="Anil Reddy" size={48} />
                  <div style={{
                    position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px',
                    borderRadius: '50%', backgroundColor: currentStatusObj?.color,
                    border: `2px solid ${colors.cardBackground}`,
                  }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: colors.text }}>Anil Reddy</span>
                    <button
                      onClick={() => setShowUserMenu(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '4px', background: 'none',
                        border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500,
                        color: theme.colors.blue, padding: 0,
                      }}
                    >
                      <Pencil size={11} /> Edit profile
                    </button>
                  </div>
                  <div style={{ fontSize: '13px', color: colors.textSecondary, marginTop: '1px' }}>Product Manager</div>
                  <div style={{ fontSize: '12px', color: colors.textTertiary || colors.textSecondary }}>Nextiva</div>
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: colors.border, margin: '0 20px' }} />

              {/* Contact info */}
              <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={15} color={colors.textSecondary} />
                  <span style={{ fontSize: '13px', color: colors.text }}>yaniv+ymdecdemo@nextiva.com</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={15} color={colors.textSecondary} />
                  <span style={{ fontSize: '13px', color: colors.text }}>+1 (747) 325-7102</span>
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: colors.border, margin: '0 20px' }} />

              {/* Menu items */}
              <div style={{ padding: '8px 8px' }}>
                <button
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: theme.radii.md,
                    border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    fontSize: '14px', fontFamily: theme.fonts.body, color: colors.text,
                    transition: theme.transitions.fast,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = colors.surfaceHover; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <Settings size={17} color={colors.textSecondary} /> My settings
                </button>
                <button
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: theme.radii.md,
                    border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    fontSize: '14px', fontFamily: theme.fonts.body, color: colors.text,
                    transition: theme.transitions.fast,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = colors.surfaceHover; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <Moon size={17} color={colors.textSecondary} /> Dark mode
                </button>
              </div>

              <div style={{ height: '1px', backgroundColor: colors.border, margin: '0 8px' }} />

              <div style={{ padding: '8px 8px 10px' }}>
                <button
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: theme.radii.md,
                    border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    fontSize: '14px', fontFamily: theme.fonts.body, color: theme.colors.error,
                    transition: theme.transitions.fast,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = colors.surfaceHover; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <LogOut size={17} color={theme.colors.error} /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
