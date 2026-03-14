import { useState } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import {
  Search, Plus, PanelLeftClose, PanelLeft, Inbox,
  Clock, CheckCircle, Eye, ChevronDown,
} from 'lucide-react';

const statusColors = {
  Open: '#3B82F6',
  'In progress': '#F59E0B',
  Resolved: '#10B981',
  Pending: '#6B7280',
};

const priorityMeta = {
  critical: { label: 'Critical', color: '#EF4444' },
  high: { label: 'High Priority', color: '#F97316' },
  medium: { label: 'Medium Priority', color: '#EAB308' },
  low: { label: 'Low Priority', color: '#6B7280' },
};

const tickets = [
  { id: 'T-2', title: 'Fleet van upfit coordination', status: 'In progress', priority: 'critical', vip: true, atRisk: false, time: '4 hours ago', customer: 'Jason Okafor', sla: '45m', assignee: 'Alex' },
  { id: 'T-9', title: 'Wrangler brake recall notice, 2023 Rubicon', status: 'Open', priority: 'critical', vip: false, atRisk: false, time: '1 hour ago', customer: 'Aisha Johnson', sla: '1h 15m', assignee: 'Alex' },
  { id: 'T-1', title: 'Transmission warranty claim', status: 'Open', priority: 'high', vip: true, atRisk: true, time: '2 hours ago', customer: 'Robert Chen', sla: '2h 30m', assignee: 'Alex' },
  { id: 'T-7', title: 'Fleet warranty claim denials', status: 'Open', priority: 'high', vip: false, atRisk: true, time: '1 day ago', customer: 'Bill Kowalski', sla: '1d 2h', assignee: 'Alex' },
  { id: 'T-8', title: 'Parts delay, Lexus repair', status: 'In progress', priority: 'high', vip: true, atRisk: false, time: '5 hours ago', customer: 'Linda Nakamura', sla: '4h', assignee: 'Jake' },
  { id: 'T-12', title: 'Network security audit', status: 'In progress', priority: 'high', vip: true, atRisk: false, time: '2 hours ago', customer: 'Ben Nakamura', sla: '4h', assignee: 'Jake' },
  { id: 'T-10', title: 'Loaner return scheduling', status: 'Open', priority: 'medium', vip: true, atRisk: true, time: '1 hour ago', customer: 'Robert Chen', sla: '1d', assignee: 'Jake' },
  { id: 'T-3', title: 'Test drive prep, BMW X5 and X3', status: 'Open', priority: 'medium', vip: true, atRisk: false, time: '1 day ago', customer: 'Priya Sharma', sla: '1d 4h', assignee: 'Alex' },
  { id: 'T-4', title: 'Service complaint, grease on vehicle', status: 'Open', priority: 'medium', vip: false, atRisk: false, time: '3 hours ago', customer: 'Marcus Taylor', sla: '6h', assignee: null },
  { id: 'T-6', title: 'Extended warranty processing, fleet', status: 'Resolved', priority: 'medium', vip: false, atRisk: false, time: '4 hours ago', customer: 'Carlos Mendez', sla: 'Completed', assignee: 'Alex' },
  { id: 'T-11', title: 'IT infrastructure upgrade consultation', status: 'Open', priority: 'medium', vip: true, atRisk: false, time: '30 min ago', customer: 'Ben Nakamura', sla: '1d 6h', assignee: 'Alex' },
  { id: 'T-5', title: 'Damaged parts shipment, fender', status: 'Pending', priority: 'low', vip: false, atRisk: false, time: '1 day ago', customer: 'Ivan Petrov', sla: '3d', assignee: null },
  { id: 'T-10B', title: 'Dashboard customization request for analytics view', status: 'Open', priority: 'low', vip: false, atRisk: false, time: '1 hour ago', customer: 'Aisha Johnson', sla: '3d', assignee: 'Jake' },
];

const assigneeColors = {
  Alex: '#6366F1',
  Jake: '#F59E0B',
};

const teamInboxes = [
  { label: 'Sales', emoji: '💰' },
  { label: 'Service', emoji: '😊' },
  { label: 'Marketing', emoji: '📣' },
];

const views = [
  { label: 'Critical Issues', badge: null },
  { label: 'Past Due', badge: '1' },
  { label: 'VIP Customers', badge: '2' },
];

export default function TicketsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [activeNav, setActiveNav] = useState('all');
  const [hoveredTicket, setHoveredTicket] = useState(null);
  const [hoveredNav, setHoveredNav] = useState(null);
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const priorityOrder = ['critical', 'high', 'medium', 'low'];
  const grouped = priorityOrder.map(p => ({
    ...priorityMeta[p],
    priority: p,
    tickets: tickets.filter(t => t.priority === p),
  })).filter(g => g.tickets.length > 0);

  const filteredGroups = grouped.map(g => ({
    ...g,
    tickets: g.tickets.filter(t =>
      !searchText || t.title.toLowerCase().includes(searchText.toLowerCase()) ||
      t.customer.toLowerCase().includes(searchText.toLowerCase()) ||
      t.id.toLowerCase().includes(searchText.toLowerCase())
    ),
  })).filter(g => g.tickets.length > 0);

  const sidebarBtnStyle = (id) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '9px 12px',
    borderRadius: theme.radii.md,
    border: 'none',
    backgroundColor: activeNav === id ? colors.sidebarActive : hoveredNav === id ? colors.sidebarHover : 'transparent',
    cursor: 'pointer',
    fontFamily: theme.fonts.body,
    fontSize: 14,
    fontWeight: activeNav === id ? 600 : 400,
    color: activeNav === id ? theme.colors.blue : colors.sidebarText,
    transition: theme.transitions.fast,
    textAlign: 'left',
  });

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 68px)', backgroundColor: colors.background }}>
      {sidebarOpen && (
        <div style={{
          width: 260, minWidth: 260,
          borderRight: `1px solid ${colors.border}`,
          backgroundColor: colors.sidebarBackground,
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '24px 20px 16px',
          }}>
            <h2 style={{
              fontFamily: theme.fonts.heading, fontSize: 20, fontWeight: 700,
              color: colors.sidebarText, margin: 0,
            }}>Tickets</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                width: 28, height: 28, borderRadius: theme.radii.sm, border: 'none',
                backgroundColor: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <PanelLeftClose size={16} color={colors.sidebarTextMuted} />
            </button>
          </div>

          <div style={{ padding: '0 12px', marginBottom: 24 }}>
            <button
              onClick={() => setActiveNav('all')}
              onMouseEnter={() => setHoveredNav('all')}
              onMouseLeave={() => setHoveredNav(null)}
              style={sidebarBtnStyle('all')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Inbox size={16} />
                All Tickets
              </span>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: theme.radii.full,
                backgroundColor: activeNav === 'all' ? theme.colors.blueMuted : colors.surfaceHover,
                color: activeNav === 'all' ? theme.colors.blue : colors.textSecondary,
              }}>3</span>
            </button>
          </div>

          <div style={{ padding: '0 12px', marginBottom: 24 }}>
            <div style={{
              fontSize: 11, fontWeight: 600, color: colors.textTertiary,
              textTransform: 'uppercase', letterSpacing: '0.5px',
              padding: '0 12px', marginBottom: 8,
            }}>Team Inboxes</div>
            {teamInboxes.map(item => (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                onMouseEnter={() => setHoveredNav(item.label)}
                onMouseLeave={() => setHoveredNav(null)}
                style={sidebarBtnStyle(item.label)}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, lineHeight: 1 }}>{item.emoji}</span>
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          <div style={{ padding: '0 12px' }}>
            <div style={{
              fontSize: 11, fontWeight: 600, color: colors.textTertiary,
              textTransform: 'uppercase', letterSpacing: '0.5px',
              padding: '0 12px', marginBottom: 8,
            }}>Views</div>
            {views.map(item => (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                onMouseEnter={() => setHoveredNav(item.label)}
                onMouseLeave={() => setHoveredNav(null)}
                style={sidebarBtnStyle(item.label)}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Eye size={14} />
                  {item.label}
                </span>
                {item.badge && (
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: theme.radii.full,
                    backgroundColor: colors.surfaceHover, color: colors.textSecondary,
                  }}>{item.badge}</span>
                )}
              </button>
            ))}
            <button
              onMouseEnter={() => setHoveredNav('addview')}
              onMouseLeave={() => setHoveredNav(null)}
              style={{
                ...sidebarBtnStyle('addview'),
                color: theme.colors.blue, fontWeight: 500,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Plus size={14} />
                Add view
              </span>
            </button>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 24, flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  width: 32, height: 32, borderRadius: theme.radii.md,
                  border: `1px solid ${colors.border}`, backgroundColor: colors.surface,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <PanelLeft size={16} color={colors.textSecondary} />
              </button>
            )}
            <h1 style={{
              fontFamily: theme.fonts.heading, fontSize: 24, fontWeight: 700,
              color: colors.text, margin: 0,
            }}>All Tickets</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} color={colors.textTertiary} style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              }} />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search tickets..."
                style={{
                  width: 220, padding: '8px 12px 8px 36px', fontSize: 13,
                  fontFamily: theme.fonts.body, border: `1px solid ${colors.border}`,
                  borderRadius: theme.radii.lg, color: colors.text,
                  backgroundColor: colors.inputBackground, outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <button style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
              fontSize: 13, fontFamily: theme.fonts.body, fontWeight: 500,
              border: `1px solid ${colors.border}`, borderRadius: theme.radii.lg,
              backgroundColor: colors.surface, color: colors.text, cursor: 'pointer',
            }}>
              All Tickets
              <ChevronDown size={14} color={colors.textSecondary} />
            </button>

            <button style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px',
              fontSize: 13, fontFamily: theme.fonts.body, fontWeight: 600,
              border: 'none', borderRadius: theme.radii.lg,
              backgroundColor: theme.colors.blue, color: '#FFFFFF', cursor: 'pointer',
            }}>
              <Plus size={15} />
              Create Ticket
            </button>
          </div>
        </div>

        {filteredGroups.map(group => (
          <div key={group.priority} style={{ marginBottom: 28 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: 10, padding: '0 4px',
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%', backgroundColor: group.color, flexShrink: 0,
              }} />
              <span style={{
                fontSize: 13, fontWeight: 700, color: colors.text, fontFamily: theme.fonts.body,
              }}>{group.label}</span>
              <span style={{ fontSize: 13, color: colors.textTertiary, fontWeight: 500 }}>
                · {group.tickets.length}
              </span>
            </div>

            <div style={{
              backgroundColor: colors.surface, borderRadius: theme.radii.lg,
              border: `1px solid ${colors.border}`, overflow: 'hidden',
              boxShadow: colors.cardShadow,
            }}>
              {group.tickets.map((ticket, idx) => {
                const slaColor = ticket.sla === 'Completed'
                  ? '#10B981'
                  : ticket.atRisk ? '#EF4444' : colors.textSecondary;

                return (
                  <div
                    key={ticket.id}
                    onMouseEnter={() => setHoveredTicket(ticket.id)}
                    onMouseLeave={() => setHoveredTicket(null)}
                    style={{
                      display: 'flex', alignItems: 'center', padding: '13px 20px',
                      borderBottom: idx < group.tickets.length - 1 ? `1px solid ${colors.divider}` : 'none',
                      backgroundColor: hoveredTicket === ticket.id ? colors.surfaceHover : 'transparent',
                      cursor: 'pointer', transition: theme.transitions.fast, gap: 14,
                    }}
                  >
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      backgroundColor: statusColors[ticket.status], flexShrink: 0,
                    }} />

                    <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontSize: 14, fontWeight: 600, color: colors.text,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>{ticket.title}</span>

                      <span style={{
                        fontSize: 11, fontWeight: 600, color: statusColors[ticket.status],
                        backgroundColor: `${statusColors[ticket.status]}14`,
                        padding: '2px 8px', borderRadius: theme.radii.full,
                        whiteSpace: 'nowrap', flexShrink: 0,
                      }}>{ticket.status}</span>

                      {ticket.vip && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, color: '#8B5CF6',
                          backgroundColor: 'rgba(139, 92, 246, 0.1)',
                          padding: '2px 8px', borderRadius: theme.radii.full,
                          whiteSpace: 'nowrap', flexShrink: 0,
                        }}>VIP</span>
                      )}

                      {ticket.atRisk && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, color: '#EF4444',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          padding: '2px 8px', borderRadius: theme.radii.full,
                          whiteSpace: 'nowrap', flexShrink: 0,
                        }}>At risk</span>
                      )}
                    </div>

                    <span style={{
                      fontSize: 12, color: colors.textTertiary, whiteSpace: 'nowrap', flexShrink: 0,
                    }}>{ticket.time}</span>

                    <span style={{
                      fontSize: 12, fontWeight: 600, color: colors.textSecondary,
                      fontFamily: "'Space Grotesk', monospace", whiteSpace: 'nowrap',
                      flexShrink: 0, minWidth: 36, textAlign: 'center',
                    }}>{ticket.id}</span>

                    <span style={{
                      fontSize: 12, color: colors.textSecondary, whiteSpace: 'nowrap',
                      flexShrink: 0, minWidth: 110,
                    }}>{ticket.customer}</span>

                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      fontSize: 12, fontWeight: 600, color: slaColor,
                      whiteSpace: 'nowrap', flexShrink: 0, minWidth: 80,
                    }}>
                      {ticket.sla === 'Completed'
                        ? <CheckCircle size={12} />
                        : <Clock size={12} />
                      }
                      {ticket.sla}
                    </div>

                    {ticket.assignee ? (
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        backgroundColor: assigneeColors[ticket.assignee] || '#6B7280',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, color: '#FFFFFF', flexShrink: 0,
                      }}>{getInitials(ticket.assignee)}</div>
                    ) : (
                      <div style={{ width: 28, height: 28, flexShrink: 0 }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
