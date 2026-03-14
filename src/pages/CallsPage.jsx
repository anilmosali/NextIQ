import { useState } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import {
  Phone, Clock, Search, ChevronDown, Mic, Monitor,
} from 'lucide-react';

const gradients = [
  'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
  'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
  'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
  'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
  'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
  'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
  'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
  'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)',
];

const callData = [
  { id: 1, name: 'Emma Thompson', phone: '+1 (600) 200-4000', time: '2:45 PM', duration: '15m 50s', missed: false },
  { id: 2, name: 'Ryan Mitchell', phone: '+1 (601) 211-4037', time: '11:45 AM', duration: '22m 22s', missed: false },
  { id: 3, name: 'Isabella Garcia', phone: '+1 (602) 222-4074', time: '9:45 AM', duration: '20m 22s', missed: false },
  { id: 4, name: 'Noah Brown', phone: '+1 (603) 233-4111', time: '7:45 AM', duration: '3m 48s', missed: true },
  { id: 5, name: 'Ava Davis', phone: '+1 (604) 244-4148', time: '5:45 AM', duration: '19m 27s', missed: false },
  { id: 6, name: 'Liam Miller', phone: '+1 (605) 255-4185', time: '3:45 AM', duration: '13m 51s', missed: false },
  { id: 7, name: 'Mia Wilson', phone: '+1 (606) 266-4222', time: '1:45 PM', duration: '5m 46s', missed: false },
  { id: 8, name: 'Ethan Moore', phone: '+1 (607) 277-4259', time: '11:45 AM', duration: '0s', missed: false },
  { id: 9, name: 'Charlotte Taylor', phone: '+1 (608) 288-4296', time: '10:45 AM', duration: '0s', missed: true },
  { id: 10, name: 'Mason Anderson', phone: '+1 (609) 299-4333', time: '7:45 AM', duration: '8m 10s', missed: false },
];

const recentSearches = callData.slice(0, 5);

const tabs = [
  { id: 'all', label: 'All calls' },
  { id: 'missed', label: 'Missed calls' },
  { id: 'voicemail', label: 'Voice mails' },
];

function getInitials(name) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase();
}

export default function CallsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCall, setSelectedCall] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [hoveredCall, setHoveredCall] = useState(null);
  const [phoneDevice, setPhoneDevice] = useState('Desktop App');
  const [micDevice, setMicDevice] = useState('Built-in Microphone');
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  const filteredCalls = activeTab === 'missed'
    ? callData.filter((c) => c.missed)
    : callData;

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      fontFamily: theme.fonts.body,
      color: colors.text,
      background: colors.background,
    }}>
      {/* Left Sidebar */}
      <div style={{
        width: 280,
        minWidth: 280,
        borderRight: `1px solid ${colors.border}`,
        background: colors.surface,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '24px 20px 16px' }}>
          <h2 style={{
            fontFamily: theme.fonts.heading,
            fontSize: 22,
            fontWeight: 700,
            margin: '0 0 16px',
            color: colors.text,
          }}>Calls</h2>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 12px',
            borderRadius: theme.radii.md,
            border: `1px solid ${colors.inputBorder}`,
            background: colors.inputBackground,
          }}>
            <Search size={15} color={colors.textSecondary} />
            <input
              type="text"
              placeholder="Search contacts or dial a number"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontFamily: theme.fonts.body,
                fontSize: 13,
                color: colors.text,
                width: '100%',
              }}
            />
          </div>
        </div>

        {/* Recent Searches */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
          <div style={{
            fontSize: 11,
            fontWeight: 600,
            color: colors.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            padding: '8px 12px 6px',
          }}>Recent searches</div>

          {recentSearches.map((contact, i) => (
            <div
              key={contact.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: theme.radii.md,
                cursor: 'pointer',
                transition: theme.transitions.fast,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = colors.surfaceHover; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{
                width: 34,
                height: 34,
                borderRadius: theme.radii.full,
                background: gradients[i],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
              }}>{getInitials(contact.name)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: colors.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {contact.name}
                </div>
                <div style={{ fontSize: 11, color: colors.textSecondary }}>{contact.phone}</div>
              </div>
              <Phone size={14} color={colors.textSecondary} style={{ flexShrink: 0 }} />
            </div>
          ))}
        </div>

        {/* Settings */}
        <div style={{
          borderTop: `1px solid ${colors.border}`,
          padding: '16px 20px',
        }}>
          <div style={{
            fontSize: 11,
            fontWeight: 600,
            color: colors.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            marginBottom: 10,
          }}>Settings</div>

          <label style={{ fontSize: 11, color: colors.textSecondary, display: 'block', marginBottom: 4 }}>Phone Device</label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 10px',
            borderRadius: theme.radii.sm,
            border: `1px solid ${colors.inputBorder}`,
            background: colors.inputBackground,
            marginBottom: 10,
            cursor: 'pointer',
          }}>
            <Monitor size={13} color={colors.textSecondary} />
            <span style={{ flex: 1, fontSize: 12, color: colors.text }}>{phoneDevice}</span>
            <ChevronDown size={13} color={colors.textSecondary} />
          </div>

          <label style={{ fontSize: 11, color: colors.textSecondary, display: 'block', marginBottom: 4 }}>Microphone</label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 10px',
            borderRadius: theme.radii.sm,
            border: `1px solid ${colors.inputBorder}`,
            background: colors.inputBackground,
            cursor: 'pointer',
          }}>
            <Mic size={13} color={colors.textSecondary} />
            <span style={{ flex: 1, fontSize: 12, color: colors.text }}>{micDevice}</span>
            <ChevronDown size={13} color={colors.textSecondary} />
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Tab Bar */}
        <div style={{
          display: 'flex',
          gap: 0,
          borderBottom: `1px solid ${colors.border}`,
          background: colors.surface,
          padding: '0 24px',
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '14px 20px',
                border: 'none',
                borderBottom: activeTab === tab.id ? `2px solid ${theme.colors.blue}` : '2px solid transparent',
                background: 'transparent',
                color: activeTab === tab.id ? theme.colors.blue : colors.textSecondary,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: theme.fonts.body,
                cursor: 'pointer',
                transition: theme.transitions.fast,
              }}
            >{tab.label}</button>
          ))}
        </div>

        {/* Call List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
          <div style={{
            fontSize: 11,
            fontWeight: 600,
            color: colors.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            padding: '16px 0 8px',
          }}>Older</div>

          <div style={{
            borderRadius: theme.radii.lg,
            border: `1px solid ${colors.border}`,
            background: colors.cardBackground,
            overflow: 'hidden',
            boxShadow: colors.cardShadow,
          }}>
            {filteredCalls.map((call, idx) => {
              const isSelected = selectedCall === call.id;
              const isHovered = hoveredCall === call.id;
              return (
                <div
                  key={call.id}
                  onClick={() => setSelectedCall(call.id)}
                  onMouseEnter={() => setHoveredCall(call.id)}
                  onMouseLeave={() => setHoveredCall(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 16px',
                    cursor: 'pointer',
                    transition: theme.transitions.fast,
                    background: isSelected
                      ? (themeMode === 'dark' ? 'rgba(0, 98, 184, 0.15)' : 'rgba(0, 98, 184, 0.06)')
                      : isHovered ? colors.surfaceHover : 'transparent',
                    borderBottom: idx < filteredCalls.length - 1 ? `1px solid ${colors.divider}` : 'none',
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: theme.radii.full,
                    background: gradients[idx % gradients.length],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#fff',
                    flexShrink: 0,
                  }}>{getInitials(call.name)}</div>

                  {/* Name + status */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: colors.text,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>{call.name}</span>
                      {call.missed && (
                        <span style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: theme.colors.error,
                          background: theme.colors.errorMuted,
                          padding: '1px 7px',
                          borderRadius: theme.radii.full,
                          whiteSpace: 'nowrap',
                        }}>Missed</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 1 }}>
                      {call.time}
                    </div>
                  </div>

                  {/* Phone number */}
                  <div style={{
                    fontSize: 12,
                    color: colors.textSecondary,
                    whiteSpace: 'nowrap',
                    minWidth: 140,
                    textAlign: 'right',
                  }}>{call.phone}</div>

                  {/* Duration */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: 12,
                    color: call.missed ? theme.colors.error : colors.textSecondary,
                    whiteSpace: 'nowrap',
                    minWidth: 72,
                    justifyContent: 'flex-end',
                  }}>
                    <Clock size={12} />
                    <span>{call.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
