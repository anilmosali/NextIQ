import { useState, useRef, useEffect } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import Avatar from './Avatar';
import { NextivaXLogo } from './NextivaLogo';
import {
  Search, Phone, MessageSquare, ChevronDown, ChevronRight,
  Bell, Sparkles, Video, Mail, Voicemail, X, CheckCircle,
  Settings, Moon, LogOut, Pencil,
} from 'lucide-react';

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
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 98, 184, 0.15), 0 0 0 1px rgba(0, 98, 184, 0.2)';
        e.currentTarget.style.borderColor = `${theme.colors.blue}40`;
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(2, 18, 44, 0.06), 0 0 0 1px rgba(0, 98, 184, 0.08)';
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
        boxShadow: '0 1px 3px rgba(2, 18, 44, 0.06), 0 0 0 1px rgba(0, 98, 184, 0.08)',
        position: 'relative',
        overflow: 'hidden',
        height: '40px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ position: 'relative', flexShrink: 0, width: '28px', height: '28px' }}>
        <svg width={28} height={28} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={14} cy={14} r={r} fill="none" stroke={theme.colors.gray150} strokeWidth={2} />
          <circle cx={14} cy={14} r={r} fill="none" stroke={theme.colors.blue} strokeWidth={2.5} strokeDasharray={circumference} strokeDashoffset={dashoffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {allDone ? (
            <CheckCircle size={14} color={theme.colors.success} />
          ) : (
            <span style={{ fontSize: '10px', fontWeight: 700, color: theme.colors.blue, fontFamily: theme.fonts.body, letterSpacing: '-0.2px', lineHeight: 1 }}>{pct}%</span>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
        {allDone ? (
          <span style={{ fontSize: '14px', color: theme.colors.success, fontWeight: 600, fontFamily: theme.fonts.body, lineHeight: 1.1, whiteSpace: 'nowrap' }}>Setup Complete</span>
        ) : (
          <>
            <span style={{ fontSize: '14px', color: theme.colors.navy, fontWeight: 600, fontFamily: theme.fonts.body, lineHeight: 1.1, whiteSpace: 'nowrap' }}>Complete Setup</span>
            <span style={{ fontSize: '13px', color: theme.colors.gray500, fontFamily: theme.fonts.body, lineHeight: 1.1, whiteSpace: 'nowrap' }}>· {remaining} left</span>
          </>
        )}
      </div>
      {!allDone && <ChevronRight size={14} color={theme.colors.blue} />}
    </div>
  );
}

export default function TopBar({ activeNav, setActiveNav }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showCallMenu, setShowCallMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('available');
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const callMenuRef = useRef(null);
  const notifRef = useRef(null);
  const userRef = useRef(null);
  const unreadCount = 3;

  useEffect(() => {
    const handler = (e) => {
      if (callMenuRef.current && !callMenuRef.current.contains(e.target)) setShowCallMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const statusOptions = [
    { id: 'available', label: 'Available', color: theme.colors.success },
    { id: 'busy', label: 'Busy', color: theme.colors.error },
    { id: 'away', label: 'Away', color: theme.colors.warning },
    { id: 'dnd', label: 'Do Not Disturb', color: theme.colors.error },
    { id: 'offline', label: 'Appear Offline', color: theme.colors.gray400 },
  ];
  const currentStatusObj = statusOptions.find((s) => s.id === currentStatus);

  return (
    <header
      style={{
        height: '56px',
        backgroundColor: colors.surface,
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        flexShrink: 0,
      }}
    >
      {/* Left: Logo + Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <NextivaXLogo size={24} />
        <div style={{ position: 'relative', width: '280px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: colors.inputBackground,
              borderRadius: '10px',
              padding: '8px 12px',
              border: `1.5px solid ${searchFocused ? theme.colors.blue : colors.inputBorder}`,
              boxShadow: searchFocused ? `0 0 0 3px ${theme.colors.blueMuted}` : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <Search size={16} color={searchFocused ? theme.colors.blue : colors.textSecondary} style={{ flexShrink: 0, marginRight: '8px' }} />
            <input
              type="text"
              placeholder="Search or Ask NextIQ..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                border: 'none', background: 'none', outline: 'none',
                fontSize: '14px', color: colors.text, flex: 1,
                fontFamily: theme.fonts.body, fontWeight: 400,
              }}
            />
            {searchValue ? (
              <button onClick={() => setSearchValue('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex' }}>
                <X size={14} color={theme.colors.gray400} />
              </button>
            ) : (
              <kbd style={{
                fontSize: '11px', fontFamily: theme.fonts.body,
                color: theme.colors.gray400, flexShrink: 0,
                padding: '2px 6px', backgroundColor: colors.surfaceHover,
                borderRadius: theme.radii.xs, border: `1px solid ${colors.border}`,
                fontWeight: 600,
              }}>
                ⌘K
              </kbd>
            )}
          </div>
        </div>
      </div>

      {/* Right side items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <OnboardingWidget setActiveNav={setActiveNav} />

        {/* NextIQ Button */}
        <button
          onClick={() => setActiveNav && setActiveNav('nextiq')}
          aria-label="NextIQ"
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', backgroundColor: theme.colors.blue,
            border: 'none', borderRadius: theme.radii.md,
            cursor: 'pointer', height: '36px',
            transition: theme.transitions.fast,
            boxShadow: '0 2px 8px rgba(0, 98, 184, 0.25)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#0056A0'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = theme.colors.blue; }}
        >
          <Sparkles size={14} color="white" fill="white" strokeWidth={0} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'white', fontFamily: theme.fonts.body }}>NextIQ</span>
        </button>

        {/* Phone / SMS / More */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} ref={callMenuRef}>
          <div style={{
            display: 'flex', alignItems: 'center',
            border: `1px solid ${colors.border}`, borderRadius: theme.radii.md, overflow: 'hidden',
          }}>
            <button aria-label="Phone dialer" style={{ width: '36px', height: '36px', padding: 0, backgroundColor: 'transparent', border: 'none', borderRight: `1px solid ${colors.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none', transition: '0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = colors.surfaceHover; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <Phone size={16} color={colors.text} />
            </button>
            <button aria-label="SMS text message" style={{ width: '36px', height: '36px', padding: 0, backgroundColor: 'transparent', border: 'none', borderRight: `1px solid ${colors.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none', transition: '0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = colors.surfaceHover; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <MessageSquare size={16} color={colors.text} />
            </button>
            <button onClick={() => setShowCallMenu(!showCallMenu)} aria-label="More options" style={{ width: '30px', height: '36px', padding: 0, backgroundColor: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none', transition: '0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = colors.surfaceHover; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <ChevronDown size={14} color={colors.text} />
            </button>
          </div>
          {showCallMenu && (
            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, backgroundColor: colors.cardBackground, borderRadius: theme.radii.xl, boxShadow: theme.shadows.dropdown, border: `1px solid ${colors.border}`, width: '200px', zIndex: 1000, padding: '4px 0', animation: 'fadeIn 0.15s ease' }}>
              {[
                { icon: Video, label: 'Video Call', action: () => {} },
                { icon: MessageSquare, label: 'Message', action: () => setActiveNav('inbox') },
                { icon: Mail, label: 'Email', action: () => {} },
                { icon: Voicemail, label: 'Voicemail', action: () => setActiveNav('phone') },
              ].map((item, i) => (
                <button key={i} onClick={() => { item.action(); setShowCallMenu(false); }}
                  style={{ width: '100%', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '13px', fontFamily: theme.fonts.body, color: colors.text, transition: '0.15s', textAlign: 'left' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = colors.surfaceHover; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <item.icon size={16} color={theme.colors.blue} />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            style={{ width: '36px', height: '36px', borderRadius: theme.radii.md, border: `1px solid ${colors.border}`, backgroundColor: colors.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', outline: 'none', transition: '0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = colors.surfaceHover; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = colors.surface; }}
          >
            <Bell size={16} color={colors.text} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '2px', right: '2px', width: '8px', height: '8px', backgroundColor: theme.colors.error, borderRadius: '50%', border: `2px solid ${colors.surface}` }} />
            )}
          </button>
        </div>

        {/* Profile */}
        <div style={{ position: 'relative' }} ref={userRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="Profile menu"
            style={{ display: 'flex', alignItems: 'center', padding: '4px', borderRadius: theme.radii.md, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', transition: '0.15s', outline: 'none' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = colors.surfaceHover; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <div style={{ position: 'relative' }}>
              <Avatar name="Anil Reddy" size={32} />
              <div style={{ position: 'absolute', bottom: -1, right: -1, width: '10px', height: '10px', borderRadius: '50%', backgroundColor: currentStatusObj?.color, border: `2px solid ${colors.surface}` }} />
            </div>
          </button>

          {showUserMenu && (
            <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: '280px', backgroundColor: colors.cardBackground, borderRadius: '16px', border: `1px solid ${colors.border}`, boxShadow: '0 12px 40px rgba(0,0,0,0.12)', zIndex: 1000, animation: 'fadeIn 0.15s ease', overflow: 'hidden' }}>
              <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <Avatar name="Anil Reddy" size={44} />
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', borderRadius: '50%', backgroundColor: currentStatusObj?.color, border: `2px solid ${colors.cardBackground}` }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: colors.text }}>Anil Reddy</span>
                    <button onClick={() => setShowUserMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, color: theme.colors.blue, padding: 0 }}>
                      <Pencil size={10} /> Edit
                    </button>
                  </div>
                  <div style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '2px' }}>Product Manager · Nextiva</div>
                </div>
              </div>
              <div style={{ height: '1px', backgroundColor: colors.border, margin: '0 16px' }} />
              <div style={{ padding: '6px 8px' }}>
                {[
                  { icon: Settings, label: 'My settings', action: () => {} },
                  { icon: Moon, label: 'Dark mode', action: () => {} },
                ].map((item, i) => (
                  <button key={i} onClick={() => { item.action(); setShowUserMenu(false); }}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: theme.radii.md, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontFamily: theme.fonts.body, color: colors.text, transition: '0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = colors.surfaceHover; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <item.icon size={16} color={colors.textSecondary} /> {item.label}
                  </button>
                ))}
              </div>
              <div style={{ height: '1px', backgroundColor: colors.border, margin: '0 8px' }} />
              <div style={{ padding: '6px 8px 8px' }}>
                <button
                  style={{ width: '100%', padding: '8px 12px', borderRadius: theme.radii.md, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontFamily: theme.fonts.body, color: theme.colors.error, transition: '0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = colors.surfaceHover; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <LogOut size={16} color={theme.colors.error} /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
