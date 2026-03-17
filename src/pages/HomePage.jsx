import { useState } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import {
  AlertTriangle, Voicemail, Mail, Users, Sparkles,
  LayoutGrid, List, Bot, ChevronRight, ArrowRight,
  Clock, Video,
} from 'lucide-react';

const thisWeekStats = [
  { number: '3', label: 'Urgent Issues', icon: AlertTriangle, color: '#EF4444' },
  { number: '5', label: 'New Voicemails', icon: Voicemail, color: '#8B5CF6' },
  { number: '12', label: 'Unread Direct Messages', icon: Mail, color: '#0062B8' },
  { number: '8', label: 'Unread Team Messages', icon: Users, color: '#F59E0B' },
];

const recommendations = [
  {
    action: 'Reply now',
    actionColor: '#10B981',
    text: (
      <>
        <strong>James Manning</strong> from <strong>Acme Corp</strong>{' '}
        <span style={{
          display: 'inline-block', fontSize: '10px', fontWeight: 700, color: '#F59E0B',
          backgroundColor: 'rgba(245,158,11,0.12)', padding: '1px 7px', borderRadius: '9999px',
          verticalAlign: 'middle', marginLeft: '4px', marginRight: '4px',
        }}>VIP</span>
        — waiting 3 days on enterprise proposal follow-up.
      </>
    ),
  },
  {
    action: 'Escalate',
    actionColor: '#F59E0B',
    text: (
      <>
        <strong>Lisa Chen's</strong> dropped calls ticket is now{' '}
        <span style={{
          display: 'inline-block', fontSize: '10px', fontWeight: 700, color: '#EF4444',
          backgroundColor: 'rgba(239,68,68,0.1)', padding: '1px 7px', borderRadius: '9999px',
          verticalAlign: 'middle', marginRight: '4px',
        }}>Urgent</span>
        — SLA breaches at 2:00 pm.
      </>
    ),
  },
  {
    action: 'Prep notes',
    actionColor: '#0062B8',
    text: (
      <>
        <strong>Acme Corp</strong> quarterly review at 11:00 am — renewal in 14 days, prep{' '}
        <span style={{
          display: 'inline-block', fontSize: '10px', fontWeight: 700, color: '#10B981',
          backgroundColor: 'rgba(16,185,129,0.1)', padding: '1px 7px', borderRadius: '9999px',
          verticalAlign: 'middle', marginRight: '4px',
        }}>$48k</span>
        expansion talking points.
      </>
    ),
  },
];

const recentActivity = [
  {
    initials: 'RC', name: 'Robert Chen', time: '11:15 AM',
    message: 'Reported intermittent service outage on primary line — needs immediate resolution.',
    tags: ['Urgent', 'Service'],
    gradient: 'linear-gradient(135deg, #EF4444, #F97316)',
  },
  {
    initials: 'JO', name: 'Jason Okafor', time: '10:45 AM',
    message: 'Followed up on fleet tracking demo — interested in 50-unit pilot program.',
    tags: [],
    gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
  },
  {
    initials: 'PS', name: 'Priya Sharma', time: '9:30 AM',
    message: 'Requested pricing for enterprise communication bundle — 200+ seats.',
    tags: ['Sales'],
    gradient: 'linear-gradient(135deg, #0EA5E9, #0062B8)',
  },
  {
    initials: 'VL', name: 'Victor Liang', time: '8:20 AM',
    message: 'Left voicemail about contract renewal terms — prefers callback after 2 PM.',
    tags: ['Vip'],
    gradient: 'linear-gradient(135deg, #F59E0B, #F97316)',
  },
];

const meetings = [
  { time: '8:00 AM', title: 'Sales Floor Huddle', joinable: true },
  { time: '9:00 AM', title: 'Service Department Check-in', joinable: false },
  { time: '11:00 AM', title: 'Fleet Presentation', joinable: false },
  { time: '1:00 PM', title: 'F&I Process Review', joinable: false },
  { time: '3:30 PM', title: '1:1 with GM', joinable: false },
];

const tagColors = {
  Urgent: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  Service: { color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  Sales: { color: '#0062B8', bg: 'rgba(0,98,184,0.08)' },
  Vip: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
};

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

function getFormattedDate() {
  const now = new Date();
  return now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function HomePage({ setActiveNav, navigateToInbox }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activeView, setActiveView] = useState('grid');
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  const cardStyle = {
    backgroundColor: colors.cardBackground,
    border: `1px solid ${colors.border}`,
    borderRadius: theme.radii.lg,
    padding: '20px',
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

      {/* ── Header Row ── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: '28px', flexWrap: 'wrap', gap: '16px',
      }}>
        <div>
          <p style={{
            fontSize: '14px', color: colors.textSecondary, margin: '0 0 4px',
            fontFamily: theme.fonts.body,
          }}>
            {getFormattedDate()}
          </p>
          <h1 style={{
            fontFamily: theme.fonts.heading, fontSize: '32px', fontWeight: 700,
            color: colors.text, margin: 0, lineHeight: 1.2,
          }}>
            {getGreeting()}, Anil.
          </h1>
        </div>

        <div style={{
          display: 'flex', backgroundColor: colors.surfaceHover, borderRadius: theme.radii.md,
          padding: '3px', gap: '2px',
        }}>
          {[
            { id: 'grid', label: 'Grid', Icon: LayoutGrid },
            { id: 'agentic', label: 'Agentic', Icon: Bot },
            { id: 'list', label: 'List', Icon: List },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveView(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', border: 'none', cursor: 'pointer',
                borderRadius: theme.radii.sm, fontSize: '13px', fontWeight: 500,
                fontFamily: theme.fonts.body,
                backgroundColor: activeView === id ? colors.cardBackground : 'transparent',
                color: activeView === id ? colors.text : colors.textSecondary,
                boxShadow: activeView === id ? theme.shadows.xs : 'none',
                transition: `all ${theme.transitions.fast}`,
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── This Week Card ── */}
      <div style={{ ...cardStyle, marginBottom: '20px', padding: '24px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{
              fontFamily: theme.fonts.heading, fontSize: '20px', fontWeight: 700,
              color: colors.text, margin: 0,
            }}>
              This Week
            </h2>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              fontSize: '12px', fontWeight: 600, color: '#10B981',
              backgroundColor: 'rgba(16,185,129,0.1)', padding: '3px 10px',
              borderRadius: theme.radii.full,
            }}>
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981',
              }} />
              On track
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {thisWeekStats.map((stat, i) => (
            <button
              key={i}
              onMouseEnter={() => setHoveredItem(`stat-${i}`)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                padding: '16px', border: `1px solid ${colors.border}`,
                borderRadius: theme.radii.md, cursor: 'pointer',
                backgroundColor: hoveredItem === `stat-${i}` ? colors.surfaceHover : colors.surface,
                transition: `all ${theme.transitions.fast}`,
                fontFamily: theme.fonts.body, textAlign: 'left',
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px',
              }}>
                <stat.icon size={16} color={stat.color} style={{ opacity: 0.8 }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{
                  fontSize: '28px', fontWeight: 700, color: colors.text, lineHeight: 1,
                }}>
                  {stat.number}
                </span>
                <ArrowRight size={16} color={colors.textSecondary} />
              </div>
              <span style={{ fontSize: '13px', color: colors.textSecondary, lineHeight: 1.3 }}>
                {stat.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── NextIQ Recommendations Card ── */}
      <div style={{ ...cardStyle, marginBottom: '20px', padding: '24px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '20px', flexWrap: 'wrap', gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color={theme.colors.purple} />
            <h2 style={{
              fontFamily: theme.fonts.heading, fontSize: '20px', fontWeight: 700,
              color: colors.text, margin: 0,
            }}>
              NextIQ Recommendations
            </h2>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', flex: '1 1 280px', maxWidth: '400px',
          }}>
            <input
              type="text"
              placeholder="Anything else I can help with, Anil?"
              style={{
                width: '100%', padding: '9px 14px', border: `1px solid ${colors.border}`,
                borderRadius: theme.radii.md, fontSize: '13px', color: colors.text,
                backgroundColor: colors.inputBackground, fontFamily: theme.fonts.body,
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recommendations.map((rec, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredItem(`rec-${i}`)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 16px', borderRadius: theme.radii.md,
                backgroundColor: hoveredItem === `rec-${i}` ? colors.surfaceHover : colors.surface,
                border: `1px solid ${colors.borderLight}`,
                transition: `all ${theme.transitions.fast}`,
              }}
            >
              <button style={{
                padding: '6px 14px', border: 'none', borderRadius: theme.radii.sm,
                backgroundColor: `${rec.actionColor}18`, color: rec.actionColor,
                fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                fontFamily: theme.fonts.body,
              }}>
                {rec.action}
              </button>
              <span style={{ fontSize: '14px', color: colors.text, lineHeight: 1.5 }}>
                {rec.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Row: Recent Activity + Your Day ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '20px', marginBottom: '48px',
      }}>

        {/* Recent Activity */}
        <div style={{ ...cardStyle, padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '16px',
          }}>
            <h3 style={{
              fontFamily: theme.fonts.heading, fontSize: '18px', fontWeight: 700,
              color: colors.text, margin: 0,
            }}>
              Recent Activity
            </h3>
            <button
              onClick={() => setActiveNav('inbox')}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: 500, color: theme.colors.blue,
                fontFamily: theme.fonts.body, padding: 0,
              }}
            >
              View all <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recentActivity.map((item, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredItem(`activity-${i}`)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => setActiveNav('inbox')}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  padding: '14px 0', cursor: 'pointer',
                  borderBottom: i < recentActivity.length - 1 ? `1px solid ${colors.divider}` : 'none',
                  transition: `background ${theme.transitions.fast}`,
                }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: item.gradient, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{
                    fontSize: '13px', fontWeight: 700, color: '#fff', letterSpacing: '0.5px',
                  }}>
                    {item.initials}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    marginBottom: '3px', flexWrap: 'wrap',
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>
                      {item.name}
                    </span>
                    <span style={{ fontSize: '12px', color: colors.textSecondary }}>
                      {item.time}
                    </span>
                    {item.tags.map((tag) => (
                      <span key={tag} style={{
                        fontSize: '10px', fontWeight: 600,
                        color: tagColors[tag]?.color || colors.textSecondary,
                        backgroundColor: tagColors[tag]?.bg || colors.surfaceHover,
                        padding: '1px 8px', borderRadius: theme.radii.full,
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p style={{
                    fontSize: '13px', color: colors.textSecondary, margin: 0,
                    lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {item.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your Day */}
        <div style={{ ...cardStyle, padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '16px',
          }}>
            <h3 style={{
              fontFamily: theme.fonts.heading, fontSize: '18px', fontWeight: 700,
              color: colors.text, margin: 0,
            }}>
              Your Day
            </h3>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              fontSize: '13px', color: colors.textSecondary,
            }}>
              <Clock size={14} />
              {meetings.length} meetings
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {meetings.map((m, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredItem(`meeting-${i}`)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '12px 0',
                  borderBottom: i < meetings.length - 1 ? `1px solid ${colors.divider}` : 'none',
                  transition: `background ${theme.transitions.fast}`,
                }}
              >
                <span style={{
                  width: '70px', flexShrink: 0, fontSize: '13px', fontWeight: 500,
                  color: m.joinable ? theme.colors.blue : colors.textSecondary,
                }}>
                  {m.time}
                </span>
                <span style={{
                  flex: 1, fontSize: '14px', fontWeight: 500, color: colors.text,
                }}>
                  {m.title}
                </span>
                {m.joinable && (
                  <button style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '5px 14px', border: 'none', borderRadius: theme.radii.sm,
                    backgroundColor: theme.colors.blue, color: '#fff',
                    fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                    fontFamily: theme.fonts.body,
                  }}>
                    <Video size={12} />
                    Join
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
