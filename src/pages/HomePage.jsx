import { useState } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import { conversations, contacts } from '../data/contacts';
import {
  ChevronRight, Phone, Mail, Video, Sparkles,
  TrendingUp, Clock, MessageSquare, Users, Zap,
  CheckCircle, ArrowUpRight, Calendar,
} from 'lucide-react';

const meetings = [
  { time: '8:00 AM', title: 'Team Standup', subtitle: 'Daily sync with engineering team', soon: true },
  { time: '9:00 AM', title: 'Customer Success Review', subtitle: 'Weekly metrics discussion', soon: false },
  { time: '10:00 AM', title: 'Titan Solar Power', subtitle: 'Scaling discussion with Annie', soon: false },
  { time: '11:00 AM', title: 'Sales Pipeline Review', subtitle: 'Q1 forecast analysis', soon: false },
  { time: '11:30 AM', title: 'Product Demo', subtitle: 'New feature walkthrough', soon: false },
];

export default function HomePage({ setActiveNav, navigateToInbox }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  const getGreeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Greeting */}
      <div style={{ marginBottom: '40px' }}>
        <h1
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: '32px',
            fontWeight: 700,
            color: colors.text,
            margin: '0 0 8px',
          }}
        >
          {getGreeting()}, Anil
        </h1>
        <p style={{ fontSize: '16px', color: colors.textSecondary, margin: 0 }}>
          Here's what's happening across your workspace today.
        </p>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
        {[
          { icon: Phone, label: 'Start call', color: theme.colors.success },
          { icon: Mail, label: 'Send email', color: theme.colors.warning },
          { icon: Video, label: 'Join meeting', color: theme.colors.blue },
          { icon: Users, label: 'Add contact', color: theme.colors.purple },
        ].map((action, i) => (
          <button
            key={i}
            onMouseEnter={() => setHoveredItem(`action-${i}`)}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 20px',
              backgroundColor: hoveredItem === `action-${i}` ? colors.surfaceHover : colors.cardBackground,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: theme.radii.lg,
              cursor: 'pointer',
              fontFamily: theme.fonts.body,
              fontSize: '14px',
              fontWeight: 500,
              color: colors.text,
              transition: `all ${theme.transitions.fast}`,
              transform: hoveredItem === `action-${i}` ? 'translateY(-1px)' : 'none',
              boxShadow: hoveredItem === `action-${i}` ? theme.shadows.md : theme.shadows.xs,
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: theme.radii.md,
                backgroundColor: `${action.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <action.icon size={16} color={action.color} />
            </div>
            {action.label}
          </button>
        ))}
      </div>

      {/* Recent Engagements */}
      <div style={{ marginBottom: '48px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: '20px',
              fontWeight: 700,
              color: colors.text,
              margin: 0,
            }}
          >
            Recent Engagements
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveNav('inbox')}
            iconRight={<ChevronRight size={14} />}
          >
            View all
          </Button>
        </div>

        <Card hover={false} style={{ overflow: 'hidden' }}>
          {conversations.slice(0, 4).map((conv, i) => (
            <div
              key={conv.id}
              onClick={() => {
                const inboxIdMap = { 'Brad Pitt': 1, 'Michael Torres': 2, 'Jennifer Walsh': 3, 'David Kim': 4, 'Tom Bradley': 6, 'Amanda Foster': 7 };
                const inboxId = inboxIdMap[conv.name];
                if (navigateToInbox && inboxId) { navigateToInbox(inboxId); } else { setActiveNav('inbox'); }
              }}
              onMouseEnter={() => setHoveredItem(`conv-${i}`)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                padding: '20px 28px',
                borderBottom: i < 3 ? `1px solid ${colors.divider}` : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer',
                backgroundColor:
                  hoveredItem === `conv-${i}` ? colors.surfaceHover : 'transparent',
                transition: theme.transitions.fast,
              }}
            >
              <Avatar
                name={conv.name}
                size={48}
                gradient={conv.gradient}
                status={conv.status}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '4px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: colors.text,
                    }}
                  >
                    {conv.name}
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      color: colors.textSecondary,
                    }}
                  >
                    {conv.company}
                  </span>
                  {conv.urgent && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: theme.colors.warning,
                        backgroundColor: theme.colors.warningMuted,
                        padding: '2px 8px',
                        borderRadius: theme.radii.full,
                      }}
                    >
                      Urgent
                    </span>
                  )}
                  {conv.team && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color:
                          conv.team === 'Sales'
                            ? theme.colors.blue
                            : conv.team === 'Support'
                              ? theme.colors.success
                              : theme.colors.purple,
                        backgroundColor:
                          conv.team === 'Sales'
                            ? theme.colors.blueMuted
                            : conv.team === 'Support'
                              ? theme.colors.successMuted
                              : theme.colors.purpleMuted,
                        padding: '2px 8px',
                        borderRadius: theme.radii.full,
                      }}
                    >
                      {conv.team}
                    </span>
                  )}
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    color: colors.textSecondary,
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {conv.lastMessage}
                </p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span style={{ fontSize: '13px', color: colors.textSecondary }}>
                  {conv.time}
                </span>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Two-column grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px',
          marginBottom: '48px',
        }}
      >
        {/* Today's Meetings */}
        <Card hover={false} style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <h3
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: '18px',
                fontWeight: 700,
                color: colors.text,
                margin: 0,
              }}
            >
              Today
            </h3>
            <span style={{ fontSize: '14px', color: colors.textSecondary }}>
              {meetings.length} meetings
            </span>
          </div>
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {meetings.map((m, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredItem(`home-meeting-${i}`)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                  borderBottom:
                    i < meetings.length - 1 ? `1px solid ${colors.divider}` : 'none',
                  cursor: 'pointer',
                  borderRadius: theme.radii.lg,
                  padding: '12px',
                  margin: '0 -12px',
                  backgroundColor:
                    hoveredItem === `home-meeting-${i}`
                      ? colors.surfaceHover
                      : 'transparent',
                  transition: theme.transitions.fast,
                }}
              >
                <div style={{ width: '64px', flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: m.soon ? 600 : 500,
                      color: m.soon ? theme.colors.blue : colors.textSecondary,
                    }}
                  >
                    {m.time}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: 500,
                      color: colors.text,
                      marginBottom: '4px',
                      lineHeight: 1.5,
                    }}
                  >
                    {m.title}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: colors.textSecondary,
                      lineHeight: 1.5,
                    }}
                  >
                    {m.subtitle}
                  </div>
                </div>
                {m.soon && (
                  <Button variant="primary" size="sm">
                    Join
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* AI Employee Activity */}
        <div
          style={{
            background: `linear-gradient(145deg, ${theme.colors.navy} 0%, #0a1a3a 100%)`,
            borderRadius: theme.radii.xl,
            padding: '28px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              right: '-30%',
              width: '300px',
              height: '300px',
              background:
                'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '28px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: theme.colors.purple,
                    borderRadius: theme.radii.md,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: 'white',
                    }}
                  >
                    AI
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.5)',
                    fontWeight: 500,
                    letterSpacing: '0.5px',
                  }}
                >
                  AI Employee Activity
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  backgroundColor: 'rgba(16,185,129,0.2)',
                  borderRadius: theme.radii.full,
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: theme.colors.success,
                    animation: 'pulse 2s infinite',
                  }}
                />
                <span
                  style={{
                    fontSize: '11px',
                    color: theme.colors.success,
                    fontWeight: 600,
                  }}
                >
                  Active
                </span>
              </div>
            </div>

            {/* Stats */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '32px',
              }}
            >
              {[
                { value: '47', label: 'Interactions Handled' },
                { value: '18', label: 'Resolutions' },
                { value: '6', label: 'Escalations' },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderRadius: theme.radii.md,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '20px',
                      fontWeight: 700,
                      color: theme.colors.white,
                      marginBottom: '4px',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Recent AI actions */}
            <div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '12px',
                }}
              >
                Recent Actions
              </div>
              {[
                {
                  action: 'Resolved billing inquiry',
                  time: '2m ago',
                  icon: CheckCircle,
                  color: theme.colors.success,
                },
                {
                  action: 'Routed VIP call to sales',
                  time: '8m ago',
                  icon: Phone,
                  color: theme.colors.blue,
                },
                {
                  action: 'Booked appointment',
                  time: '15m ago',
                  icon: Calendar,
                  color: theme.colors.purple,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 0',
                    borderBottom:
                      i < 2
                        ? '1px solid rgba(255,255,255,0.06)'
                        : 'none',
                  }}
                >
                  <item.icon size={14} color={item.color} />
                  <span
                    style={{
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.8)',
                      flex: 1,
                    }}
                  >
                    {item.action}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '48px',
        }}
      >
        {[
          {
            label: 'Total Conversations',
            value: '1,247',
            change: '+12%',
            positive: true,
            icon: MessageSquare,
            color: theme.colors.blue,
          },
          {
            label: 'Active Contacts',
            value: '3,891',
            change: '+8%',
            positive: true,
            icon: Users,
            color: theme.colors.purple,
          },
          {
            label: 'Avg Response',
            value: '1.8m',
            change: '-23%',
            positive: true,
            icon: Clock,
            color: theme.colors.success,
          },
          {
            label: 'CX Score',
            value: '94.2',
            change: '+3.1',
            positive: true,
            icon: TrendingUp,
            color: theme.colors.warning,
          },
        ].map((stat, i) => (
          <Card key={i} style={{ padding: '24px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: theme.radii.lg,
                  backgroundColor: `${stat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <stat.icon size={20} color={stat.color} />
              </div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: stat.positive ? theme.colors.success : theme.colors.error,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                }}
              >
                <ArrowUpRight size={12} />
                {stat.change}
              </span>
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: colors.text,
                marginBottom: '4px',
                fontFamily: theme.fonts.body,
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: '13px', color: colors.textSecondary }}>
              {stat.label}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
