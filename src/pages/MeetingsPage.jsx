import { useState } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import {
  Video, ChevronDown, ChevronLeft, ChevronRight,
  Clock, RefreshCw, Users,
} from 'lucide-react';

const weekDays = [
  { day: 'Mon', date: 9 },
  { day: 'Tue', date: 10 },
  { day: 'Wed', date: 11 },
  { day: 'Thu', date: 12 },
  { day: 'Fri', date: 13 },
  { day: 'Sat', date: 14 },
  { day: 'Sun', date: 15 },
];

const todayDate = 13;

const liveMeeting = {
  id: 'live',
  time: '10:00 AM',
  title: 'Fleet Delivery: Okafor Logistics',
  description: 'Review delivery schedule and logistics plan for Q1 fleet rollout with Okafor team.',
  attendees: ['OL', 'KW', 'JM'],
  attendeeGradients: [
    'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
    'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  ],
};

const earlierMeetings = [
  {
    id: 1,
    time: '8:00 AM',
    title: 'Sales Floor Huddle',
    recurring: true,
    description: 'Daily standup with the full sales team — pipeline updates, blockers, and wins.',
    attendees: ['JK', 'RM', 'AD'],
    attendeeGradients: [
      'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
      'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    ],
  },
  {
    id: 2,
    time: '9:00 AM',
    title: 'Service Department Check-in',
    recurring: true,
    description: 'Weekly sync on service tickets, SLA compliance, and escalations.',
    attendees: ['TN', 'BW'],
    attendeeGradients: [
      'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
      'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    ],
  },
  {
    id: 3,
    time: '11:00 AM',
    title: 'Fleet Presentation',
    recurring: false,
    description: 'Internal presentation of fleet delivery metrics and operational improvements.',
    attendees: ['OL', 'KW', 'JM', 'PS'],
    attendeeGradients: [
      'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
      'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)',
    ],
  },
  {
    id: 4,
    time: '1:00 PM',
    title: 'F&I Process Review',
    recurring: false,
    description: 'Review current F&I workflows and identify bottlenecks for the new quarter.',
    attendees: ['DH', 'SR'],
    attendeeGradients: [
      'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
    ],
  },
  {
    id: 5,
    time: '3:30 PM',
    title: '1:1 with GM',
    recurring: false,
    description: 'Weekly one-on-one with general manager — performance, goals, and feedback.',
    attendees: ['GM'],
    attendeeGradients: [
      'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    ],
  },
];

function AvatarStack({ attendees, gradients, size = 28 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {attendees.map((initials, i) => (
        <div
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: gradients[i] || 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size * 0.36,
            fontWeight: 700,
            color: '#fff',
            border: '2px solid #fff',
            marginLeft: i > 0 ? -8 : 0,
            position: 'relative',
            zIndex: attendees.length - i,
          }}
        >{initials}</div>
      ))}
    </div>
  );
}

export default function MeetingsPage() {
  const [selectedDay, setSelectedDay] = useState(todayDate);
  const [expandedMeeting, setExpandedMeeting] = useState(null);
  const [hoveredMeeting, setHoveredMeeting] = useState(null);
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  return (
    <div style={{
      padding: '28px 32px',
      fontFamily: theme.fonts.body,
      color: colors.text,
      maxWidth: 960,
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 28,
      }}>
        <h1 style={{
          fontFamily: theme.fonts.heading,
          fontSize: 28,
          fontWeight: 700,
          margin: 0,
          color: colors.text,
        }}>Meetings</h1>

        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '9px 18px',
            borderRadius: theme.radii.md,
            border: 'none',
            background: theme.colors.blue,
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            fontFamily: theme.fonts.body,
            cursor: 'pointer',
            transition: theme.transitions.fast,
          }}>
            <Video size={15} />
            Meet Now
          </button>

          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '9px 18px',
            borderRadius: theme.radii.md,
            border: `1px solid ${colors.border}`,
            background: colors.surface,
            color: colors.text,
            fontSize: 13,
            fontWeight: 600,
            fontFamily: theme.fonts.body,
            cursor: 'pointer',
            transition: theme.transitions.fast,
          }}>
            Schedule
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Week Day Selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 28,
        background: colors.surface,
        padding: '10px 16px',
        borderRadius: theme.radii.lg,
        border: `1px solid ${colors.border}`,
      }}>
        <button style={{
          width: 30,
          height: 30,
          borderRadius: theme.radii.full,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <ChevronLeft size={16} color={colors.textSecondary} />
        </button>

        <span style={{
          fontSize: 13,
          fontWeight: 600,
          color: colors.text,
          minWidth: 90,
          textAlign: 'center',
        }}>Mar 9 – 15</span>

        <div style={{ display: 'flex', gap: 4, flex: 1, justifyContent: 'center' }}>
          {weekDays.map((wd) => {
            const isToday = wd.date === todayDate;
            const isSelected = wd.date === selectedDay;
            return (
              <button
                key={wd.date}
                onClick={() => setSelectedDay(wd.date)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  padding: '6px 12px',
                  borderRadius: theme.radii.md,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: theme.fonts.body,
                  transition: theme.transitions.fast,
                  background: isSelected ? theme.colors.blue : 'transparent',
                  minWidth: 48,
                }}
              >
                <span style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: isSelected ? '#fff' : colors.textSecondary,
                  textTransform: 'uppercase',
                }}>{wd.day}</span>
                <span style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: isSelected ? '#fff' : isToday ? theme.colors.blue : colors.text,
                }}>{wd.date}</span>
              </button>
            );
          })}
        </div>

        <button style={{
          width: 30,
          height: 30,
          borderRadius: theme.radii.full,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <ChevronRight size={16} color={colors.textSecondary} />
        </button>
      </div>

      {/* Live Meeting Card */}
      <div style={{
        borderRadius: theme.radii.lg,
        border: `1px solid ${theme.colors.blue}33`,
        background: themeMode === 'dark' ? 'rgba(0, 98, 184, 0.1)' : 'rgba(0, 98, 184, 0.04)',
        padding: '20px 24px',
        marginBottom: 28,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 4,
          height: '100%',
          background: theme.colors.blue,
          borderRadius: '4px 0 0 4px',
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                color: theme.colors.success,
                background: theme.colors.successMuted,
                padding: '2px 8px',
                borderRadius: theme.radii.full,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}>
                <span style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: theme.colors.success,
                  display: 'inline-block',
                }} />
                Now
              </span>
              <span style={{ fontSize: 13, color: colors.textSecondary, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={12} />
                {liveMeeting.time}
              </span>
            </div>

            <h3 style={{
              fontSize: 17,
              fontWeight: 700,
              color: colors.text,
              margin: '0 0 6px',
              fontFamily: theme.fonts.body,
            }}>{liveMeeting.title}</h3>

            <p style={{
              fontSize: 13,
              color: colors.textSecondary,
              margin: '0 0 14px',
              lineHeight: 1.5,
            }}>{liveMeeting.description}</p>

            <AvatarStack
              attendees={liveMeeting.attendees}
              gradients={liveMeeting.attendeeGradients}
            />
          </div>

          <button style={{
            padding: '10px 24px',
            borderRadius: theme.radii.md,
            border: 'none',
            background: theme.colors.blue,
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            fontFamily: theme.fonts.body,
            cursor: 'pointer',
            transition: theme.transitions.fast,
            whiteSpace: 'nowrap',
            alignSelf: 'center',
          }}>Join</button>
        </div>
      </div>

      {/* Earlier Today */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 14,
      }}>
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          color: colors.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          whiteSpace: 'nowrap',
        }}>Earlier today</span>
        <div style={{ flex: 1, height: 1, background: colors.border }} />
      </div>

      <div style={{
        borderRadius: theme.radii.lg,
        border: `1px solid ${colors.border}`,
        background: colors.cardBackground,
        overflow: 'hidden',
        boxShadow: colors.cardShadow,
      }}>
        {earlierMeetings.map((meeting, idx) => {
          const isHovered = hoveredMeeting === meeting.id;
          const isExpanded = expandedMeeting === meeting.id;
          return (
            <div
              key={meeting.id}
              onClick={() => setExpandedMeeting(isExpanded ? null : meeting.id)}
              onMouseEnter={() => setHoveredMeeting(meeting.id)}
              onMouseLeave={() => setHoveredMeeting(null)}
              style={{
                padding: '14px 20px',
                borderBottom: idx < earlierMeetings.length - 1 ? `1px solid ${colors.divider}` : 'none',
                cursor: 'pointer',
                transition: theme.transitions.fast,
                background: isHovered ? colors.surfaceHover : 'transparent',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: colors.textSecondary,
                  minWidth: 70,
                }}>{meeting.time}</span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: colors.text,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>{meeting.title}</span>
                    {meeting.recurring && (
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        fontSize: 10,
                        fontWeight: 600,
                        color: colors.textSecondary,
                        background: colors.surfaceHover,
                        padding: '2px 7px',
                        borderRadius: theme.radii.full,
                        whiteSpace: 'nowrap',
                      }}>
                        <RefreshCw size={9} />
                        Recurring
                      </span>
                    )}
                  </div>
                  {!isExpanded && (
                    <div style={{
                      fontSize: 12,
                      color: colors.textSecondary,
                      marginTop: 2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>{meeting.description}</div>
                  )}
                </div>

                <AvatarStack
                  attendees={meeting.attendees}
                  gradients={meeting.attendeeGradients}
                  size={26}
                />

                <ChevronDown
                  size={16}
                  color={colors.textSecondary}
                  style={{
                    transition: theme.transitions.fast,
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    flexShrink: 0,
                  }}
                />
              </div>

              {isExpanded && (
                <div style={{
                  marginTop: 10,
                  paddingLeft: 86,
                  fontSize: 13,
                  color: colors.textSecondary,
                  lineHeight: 1.6,
                }}>{meeting.description}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
