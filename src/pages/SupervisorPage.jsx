import { useState } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import { Eye, Users, Clock, AlertTriangle, TrendingUp, Phone, MessageSquare, Mail, Activity } from 'lucide-react';

const agents = [
  { id: 1, name: 'Alex Rivera', status: 'On Call', conversations: 4, avgHandle: '3m 12s', csat: 94, gradient: ['#6366F1', '#8B5CF6'] },
  { id: 2, name: 'Jake Miller', status: 'Available', conversations: 2, avgHandle: '2m 45s', csat: 97, gradient: ['#14B8A6', '#10B981'] },
  { id: 3, name: 'Sarah Chen', status: 'On Call', conversations: 5, avgHandle: '4m 08s', csat: 91, gradient: ['#EC4899', '#F43F5E'] },
  { id: 4, name: 'Mike Torres', status: 'Away', conversations: 0, avgHandle: '—', csat: 88, gradient: ['#F59E0B', '#EAB308'] },
  { id: 5, name: 'Lisa Park', status: 'Available', conversations: 3, avgHandle: '2m 30s', csat: 96, gradient: ['#0EA5E9', '#3B82F6'] },
  { id: 6, name: 'David Kim', status: 'On Call', conversations: 6, avgHandle: '5m 20s', csat: 85, gradient: ['#8B5CF6', '#A855F7'] },
];

const statusColors = { 'On Call': '#10B981', 'Available': '#3B82F6', 'Away': '#F59E0B', 'Offline': '#9CA3AF' };

export default function SupervisorPage() {
  const [hoveredAgent, setHoveredAgent] = useState(null);
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  const kpis = [
    { label: 'Active Agents', value: '5/6', icon: Users, color: '#3B82F6', sub: '1 away' },
    { label: 'In Queue', value: '12', icon: Clock, color: '#F59E0B', sub: 'Avg wait 2m 14s' },
    { label: 'SLA Score', value: '91.2%', icon: TrendingUp, color: '#10B981', sub: '-2.1% from target' },
    { label: 'Escalations', value: '3', icon: AlertTriangle, color: '#EF4444', sub: 'Last hour' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <Eye size={22} color={theme.colors.blue} />
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, fontFamily: theme.fonts.body }}>Supervisor View</h1>
        </div>
        <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>Real-time team monitoring and performance overview</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: theme.radii.lg, padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: theme.radii.md, backgroundColor: kpi.color + '12', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color={kpi.color} />
                </div>
                <span style={{ fontSize: '13px', color: colors.textSecondary, fontWeight: 500 }}>{kpi.label}</span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: colors.text, marginBottom: '4px' }}>{kpi.value}</div>
              <div style={{ fontSize: '12px', color: colors.textSecondary }}>{kpi.sub}</div>
            </div>
          );
        })}
      </div>

      <div style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: theme.radii.lg, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Agent Activity</h2>
          <span style={{ fontSize: '13px', color: colors.textSecondary }}>{agents.length} agents</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              {['Agent', 'Status', 'Active Conversations', 'Avg Handle Time', 'CSAT'].map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {agents.map(agent => (
              <tr
                key={agent.id}
                onMouseEnter={() => setHoveredAgent(agent.id)}
                onMouseLeave={() => setHoveredAgent(null)}
                style={{ borderBottom: `1px solid ${colors.border}`, backgroundColor: hoveredAgent === agent.id ? colors.surfaceHover : 'transparent', cursor: 'pointer', transition: '0.15s' }}
              >
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `linear-gradient(135deg, ${agent.gradient[0]}, ${agent.gradient[1]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700 }}>
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: colors.text }}>{agent.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500, color: statusColors[agent.status] }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusColors[agent.status] }} />
                    {agent.status}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', fontSize: '14px', color: colors.text }}>{agent.conversations}</td>
                <td style={{ padding: '14px 20px', fontSize: '14px', color: colors.text }}>{agent.avgHandle}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: agent.csat >= 90 ? '#10B981' : agent.csat >= 80 ? '#F59E0B' : '#EF4444' }}>{agent.csat}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
