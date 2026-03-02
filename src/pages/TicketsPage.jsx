import { useState } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import {
  Plus, Search, Filter, FileText, AlertCircle, Clock,
  CheckCircle, Circle, MoreHorizontal, ArrowUp, ArrowDown,
  Tag, User, Calendar,
} from 'lucide-react';

const tickets = [
  { id: 'TKT-1001', title: 'Integration Bug - Salesforce sync failing', customer: 'Annie Izquierdo', company: 'Titan Solar Power', priority: 'high', status: 'open', created: '2 hours ago', assignee: 'Brad Pitt', tags: ['Bug', 'Integration'], gradient: `linear-gradient(135deg, #F59E0B, #D97706)` },
  { id: 'TKT-1002', title: 'SSO Issue - Users unable to authenticate', customer: 'David Chen', company: 'DirectBuy', priority: 'urgent', status: 'open', created: '4 hours ago', assignee: 'Michael Rodriguez', tags: ['Bug', 'Security'], gradient: `linear-gradient(135deg, #8B5CF6, #7C3AED)` },
  { id: 'TKT-1003', title: 'Feature Request - Custom IVR routing', customer: 'Neil Patel', company: 'NP Digital', priority: 'medium', status: 'in-progress', created: '1 day ago', assignee: 'Jennifer Brown', tags: ['Feature', 'IVR'], gradient: `linear-gradient(135deg, #10B981, #059669)` },
  { id: 'TKT-1004', title: 'Billing discrepancy - Double charge', customer: 'Maria Garcia', company: 'Nothing Bundt Cakes', priority: 'high', status: 'in-progress', created: '1 day ago', assignee: 'Brad Pitt', tags: ['Billing'], gradient: `linear-gradient(135deg, #EC4899, #DB2777)` },
  { id: 'TKT-1005', title: 'Call quality degradation on VoIP', customer: 'Jennifer Walsh', company: 'Summit Financial', priority: 'medium', status: 'open', created: '2 days ago', assignee: null, tags: ['Quality', 'VoIP'], gradient: `linear-gradient(135deg, #F97316, #EA580C)` },
  { id: 'TKT-1006', title: 'Onboarding documentation request', customer: 'Michael Torres', company: 'Erewhon', priority: 'low', status: 'resolved', created: '3 days ago', assignee: 'Jennifer Brown', tags: ['Documentation'], gradient: `linear-gradient(135deg, #14B8A6, #0D9488)` },
];

const statusFilters = [
  { id: 'all', label: 'All', count: tickets.length },
  { id: 'open', label: 'Open', count: tickets.filter((t) => t.status === 'open').length },
  { id: 'in-progress', label: 'In Progress', count: tickets.filter((t) => t.status === 'in-progress').length },
  { id: 'resolved', label: 'Resolved', count: tickets.filter((t) => t.status === 'resolved').length },
];

export default function TicketsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [hovered, setHovered] = useState(null);
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  const priorityColors = {
    urgent: theme.colors.error,
    high: theme.colors.warning,
    medium: theme.colors.blue,
    low: theme.colors.gray400,
  };

  const statusIcons = {
    open: { Icon: Circle, color: theme.colors.blue },
    'in-progress': { Icon: Clock, color: theme.colors.warning },
    resolved: { Icon: CheckCircle, color: theme.colors.success },
  };

  const filtered = tickets.filter((t) => activeFilter === 'all' || t.status === activeFilter);

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: theme.fonts.heading, fontSize: '28px', fontWeight: 700, color: colors.text, margin: '0 0 8px' }}>Tickets</h1>
          <p style={{ fontSize: '15px', color: colors.textSecondary, margin: 0 }}>Track and manage support tickets</p>
        </div>
        <Button variant="primary" size="md" icon={<Plus size={16} />}>Create Ticket</Button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: `1px solid ${colors.border}` }}>
        {statusFilters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            style={{
              padding: '12px 20px', border: 'none',
              borderBottom: activeFilter === f.id ? `2px solid ${theme.colors.blue}` : '2px solid transparent',
              backgroundColor: 'transparent',
              color: activeFilter === f.id ? theme.colors.blue : colors.textSecondary,
              fontSize: '14px', fontWeight: 600, fontFamily: theme.fonts.body, cursor: 'pointer',
              transition: theme.transitions.fast, display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            {f.label}
            <span style={{
              fontSize: '11px', fontWeight: 700, padding: '1px 7px', borderRadius: theme.radii.full,
              backgroundColor: activeFilter === f.id ? theme.colors.blueMuted : colors.surfaceHover,
              color: activeFilter === f.id ? theme.colors.blue : colors.textSecondary,
            }}>{f.count}</span>
          </button>
        ))}
      </div>

      {/* Tickets list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map((ticket, i) => {
          const { Icon: StatusIcon, color: statusColor } = statusIcons[ticket.status];
          return (
            <Card
              key={ticket.id}
              style={{
                padding: '20px 24px',
                display: 'flex', alignItems: 'center', gap: '20px',
                animation: `staggerFadeIn 0.4s ease ${i * 0.05}s both`,
              }}
            >
              <StatusIcon size={20} color={statusColor} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: colors.textSecondary, fontFamily: "'Space Grotesk', monospace" }}>{ticket.id}</span>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: theme.radii.full,
                    backgroundColor: `${priorityColors[ticket.priority]}15`,
                    color: priorityColors[ticket.priority], textTransform: 'uppercase',
                  }}>{ticket.priority}</span>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: colors.text, marginBottom: '6px' }}>{ticket.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '13px', color: colors.textSecondary, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={12} /> {ticket.customer} · {ticket.company}
                  </span>
                  <span style={{ fontSize: '13px', color: colors.textSecondary, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {ticket.created}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                {ticket.assignee ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Avatar name={ticket.assignee} size={24} />
                    <span style={{ fontSize: '12px', color: colors.textSecondary }}>{ticket.assignee}</span>
                  </div>
                ) : (
                  <span style={{ fontSize: '12px', color: theme.colors.warning, fontWeight: 600 }}>Unassigned</span>
                )}
                <div style={{ display: 'flex', gap: '4px' }}>
                  {ticket.tags.map((tag) => (
                    <span key={tag} style={{
                      fontSize: '10px', fontWeight: 500, padding: '2px 6px',
                      borderRadius: theme.radii.full, backgroundColor: colors.surfaceHover,
                      color: colors.textSecondary,
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
