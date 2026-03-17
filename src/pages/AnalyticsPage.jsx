import { useState } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import {
  MessageSquare, Clock, TrendingUp, Timer, PhoneOff,
  RefreshCw, ChevronDown, ChevronRight, BarChart3,
  Phone, MessageCircle, Mail, Smartphone, Share2,
  Hammer, AlertTriangle, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';

const dashboards = [
  { id: 'live', label: 'Live Dashboard' },
  { id: 'customer', label: 'Customer Engagement' },
  { id: 'ai', label: 'AI Employee Engagement' },
];

const reports = [
  { id: 'usage', label: 'Usage & Activity' },
  { id: 'agent-login', label: 'Agent Login' },
  { id: 'inbox', label: 'Inbox Summary' },
  { id: 'hub', label: 'My Hub Productivity' },
  { id: 'ai-employee', label: 'AI Employee' },
  { id: 'call-log', label: 'Call Log Details' },
  { id: 'nextiq', label: 'NextIQ Usage' },
];

const kpis = [
  { label: 'Active Conversations', value: '187', change: '+12%', changeLabel: 'vs yesterday', positive: true, icon: MessageSquare, color: theme.colors.blue },
  { label: 'In Queue', value: '50', change: '+8', changeLabel: 'in last 15 min', positive: null, icon: Clock, color: theme.colors.warning, extra: '12 voice calls waiting' },
  { label: 'SLA Score', value: '91.2%', change: '-2.1%', changeLabel: 'from target', positive: false, icon: TrendingUp, color: theme.colors.success },
  { label: 'Avg Handle Time', value: '3m 48s', change: '+18s', changeLabel: 'vs baseline', positive: false, icon: Timer, color: theme.colors.purple },
  { label: 'Abandon Rate', value: '3.1%', change: '', changeLabel: 'Spiked at 10am', positive: null, icon: PhoneOff, color: theme.colors.error },
];

const queueData = [
  { channel: 'Voice', icon: Phone, inQueue: 12, avgWait: '2m 14s', status: 'High', statusColor: '#EF4444' },
  { channel: 'Chat', icon: MessageCircle, inQueue: 18, avgWait: '45s', status: 'Moderate', statusColor: '#F59E0B' },
  { channel: 'Email', icon: Mail, inQueue: 15, avgWait: '12m 30s', status: 'Normal', statusColor: '#10B981' },
  { channel: 'SMS', icon: Smartphone, inQueue: 3, avgWait: '1m 05s', status: 'Normal', statusColor: '#10B981' },
  { channel: 'Social', icon: Share2, inQueue: 2, avgWait: '3m 20s', status: 'Normal', statusColor: '#10B981' },
];

const trendBars = [
  { hour: '8am', aht: 62, abandon: 18, sla: 95 },
  { hour: '9am', aht: 70, abandon: 25, sla: 92 },
  { hour: '10am', aht: 85, abandon: 55, sla: 80 },
  { hour: '11am', aht: 72, abandon: 30, sla: 88 },
  { hour: '12pm', aht: 58, abandon: 15, sla: 94 },
  { hour: '1pm', aht: 65, abandon: 20, sla: 91 },
  { hour: '2pm', aht: 78, abandon: 35, sla: 85 },
  { hour: '3pm', aht: 68, abandon: 22, sla: 90 },
];

const forecastData = [
  { time: '6 PM', volume: 45, agents: 12 },
  { time: '7 PM', volume: 62, agents: 15 },
  { time: '8 PM', volume: 38, agents: 10 },
  { time: '9 PM', volume: 20, agents: 6 },
];

export default function AnalyticsPage() {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const [selectedDashboard, setSelectedDashboard] = useState('live');
  const [dashboardsOpen, setDashboardsOpen] = useState(true);
  const [reportsOpen, setReportsOpen] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleSelect = (type, id) => {
    if (type === 'dashboard') {
      setSelectedDashboard(id);
      setSelectedReport(null);
    } else {
      setSelectedReport(id);
      setSelectedDashboard(null);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: theme.fonts.body }}>
      {/* Left Sidebar */}
      <div style={{
        width: '240px', flexShrink: 0,
        backgroundColor: colors.surface,
        borderRight: `1px solid ${colors.border}`,
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        <div style={{ padding: '24px 16px', flex: 1 }}>
          {/* Dashboards Section */}
          <button
            onClick={() => setDashboardsOpen(!dashboardsOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', width: '100%',
              padding: '8px 8px', border: 'none', backgroundColor: 'transparent',
              cursor: 'pointer', fontFamily: theme.fonts.body, fontSize: '11px',
              fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {dashboardsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            Dashboards
          </button>
          {dashboardsOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '16px' }}>
              {dashboards.map((d) => {
                const active = selectedDashboard === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => handleSelect('dashboard', d.id)}
                    style={{
                      padding: '8px 12px 8px 28px', borderRadius: theme.radii.md, border: 'none',
                      backgroundColor: active ? colors.sidebarActive : 'transparent',
                      color: active ? theme.colors.blue : colors.text,
                      fontSize: '13px', fontWeight: active ? 600 : 400,
                      fontFamily: theme.fonts.body, cursor: 'pointer',
                      textAlign: 'left', width: '100%',
                      transition: theme.transitions.fast,
                    }}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Reports Section */}
          <button
            onClick={() => setReportsOpen(!reportsOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', width: '100%',
              padding: '8px 8px', border: 'none', backgroundColor: 'transparent',
              cursor: 'pointer', fontFamily: theme.fonts.body, fontSize: '11px',
              fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase',
              letterSpacing: '0.08em', marginTop: '8px',
            }}
          >
            {reportsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            Reports
          </button>
          {reportsOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {reports.map((r) => {
                const active = selectedReport === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleSelect('report', r.id)}
                    style={{
                      padding: '8px 12px 8px 28px', borderRadius: theme.radii.md, border: 'none',
                      backgroundColor: active ? colors.sidebarActive : 'transparent',
                      color: active ? theme.colors.blue : colors.text,
                      fontSize: '13px', fontWeight: active ? 600 : 400,
                      fontFamily: theme.fonts.body, cursor: 'pointer',
                      textAlign: 'left', width: '100%',
                      transition: theme.transitions.fast,
                    }}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Report Builder button */}
        <div style={{ padding: '16px' }}>
          <button style={{
            width: '100%', padding: '10px 16px', borderRadius: theme.radii.md,
            border: `1px dashed ${colors.border}`, backgroundColor: 'transparent',
            color: colors.textSecondary, fontSize: '13px', fontWeight: 600,
            fontFamily: theme.fonts.body, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: theme.transitions.fast,
          }}>
            <Hammer size={14} />
            Report Builder
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
            <div>
              <h1 style={{
                fontFamily: theme.fonts.heading, fontSize: '26px', fontWeight: 700,
                color: colors.text, margin: '0 0 4px',
              }}>Live Dashboard</h1>
              <p style={{ fontSize: '13px', color: colors.textSecondary, margin: 0 }}>
                Last updated: just now
              </p>
            </div>
            <button style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: theme.radii.md,
              border: `1px solid ${colors.border}`, backgroundColor: colors.surface,
              color: colors.text, fontSize: '13px', fontWeight: 500,
              fontFamily: theme.fonts.body, cursor: 'pointer',
              transition: theme.transitions.fast,
            }}>
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>

          {/* KPI Cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '14px', marginBottom: '28px',
          }}>
            {kpis.map((kpi) => (
              <div key={kpi.label} style={{
                backgroundColor: colors.surface, borderRadius: theme.radii.lg,
                border: `1px solid ${colors.border}`, padding: '20px',
                boxShadow: colors.cardShadow,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: theme.radii.md,
                    backgroundColor: `${kpi.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <kpi.icon size={18} color={kpi.color} />
                  </div>
                  {kpi.positive !== null && kpi.change && (
                    <span style={{
                      fontSize: '11px', fontWeight: 600,
                      color: kpi.positive ? theme.colors.success : theme.colors.error,
                      display: 'flex', alignItems: 'center', gap: '2px',
                    }}>
                      {kpi.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {kpi.change}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: colors.text, marginBottom: '4px' }}>
                  {kpi.value}
                </div>
                <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: kpi.extra ? '6px' : 0 }}>
                  {kpi.change && `${kpi.change} `}{kpi.changeLabel}
                </div>
                {kpi.extra && (
                  <div style={{
                    fontSize: '11px', color: theme.colors.warning, fontWeight: 500,
                    display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px',
                  }}>
                    <AlertTriangle size={11} />
                    {kpi.extra}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Performance Trends + Forecast */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '28px' }}>
            {/* Performance Trends */}
            <div style={{
              backgroundColor: colors.surface, borderRadius: theme.radii.lg,
              border: `1px solid ${colors.border}`, padding: '24px',
              boxShadow: colors.cardShadow,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{
                  fontFamily: theme.fonts.heading, fontSize: '16px', fontWeight: 700,
                  color: colors.text, margin: 0,
                }}>Performance Trends</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {[
                    { label: 'AHT', color: theme.colors.blue },
                    { label: 'Abandon %', color: theme.colors.error },
                    { label: 'SLA %', color: theme.colors.success },
                  ].map((leg) => (
                    <div key={leg.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: leg.color }} />
                      <span style={{ color: colors.textSecondary }}>{leg.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '160px' }}>
                {trendBars.map((bar) => (
                  <div key={bar.hour} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', width: '100%', height: '140px' }}>
                      <div style={{
                        flex: 1, height: `${bar.aht}%`, backgroundColor: theme.colors.blue,
                        borderRadius: '3px 3px 0 0', minHeight: '4px', opacity: 0.85,
                      }} />
                      <div style={{
                        flex: 1, height: `${bar.abandon}%`, backgroundColor: theme.colors.error,
                        borderRadius: '3px 3px 0 0', minHeight: '4px', opacity: 0.85,
                      }} />
                      <div style={{
                        flex: 1, height: `${bar.sla}%`, backgroundColor: theme.colors.success,
                        borderRadius: '3px 3px 0 0', minHeight: '4px', opacity: 0.85,
                      }} />
                    </div>
                    <span style={{ fontSize: '10px', color: colors.textTertiary }}>{bar.hour}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Forecast */}
            <div style={{
              backgroundColor: colors.surface, borderRadius: theme.radii.lg,
              border: `1px solid ${colors.border}`, padding: '24px',
              boxShadow: colors.cardShadow,
            }}>
              <h3 style={{
                fontFamily: theme.fonts.heading, fontSize: '16px', fontWeight: 700,
                color: colors.text, margin: '0 0 6px',
              }}>Forecast</h3>
              <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 20px' }}>
                Predicted volume for 6 PM – 9 PM
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {forecastData.map((f) => (
                  <div key={f.time}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: colors.text }}>{f.time}</span>
                      <span style={{ fontSize: '12px', color: colors.textSecondary }}>
                        {f.volume} conv · {f.agents} agents
                      </span>
                    </div>
                    <div style={{
                      height: '6px', backgroundColor: colors.surfaceHover,
                      borderRadius: theme.radii.full, overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${(f.volume / 70) * 100}%`, height: '100%',
                        backgroundColor: f.volume > 50 ? theme.colors.warning : theme.colors.blue,
                        borderRadius: theme.radii.full,
                        transition: 'width 0.4s ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Queue Breakdown */}
          <div style={{
            backgroundColor: colors.surface, borderRadius: theme.radii.lg,
            border: `1px solid ${colors.border}`, padding: '24px',
            boxShadow: colors.cardShadow,
          }}>
            <h3 style={{
              fontFamily: theme.fonts.heading, fontSize: '16px', fontWeight: 700,
              color: colors.text, margin: '0 0 20px',
            }}>Queue Breakdown</h3>
            <table style={{
              width: '100%', borderCollapse: 'collapse', fontSize: '13px',
            }}>
              <thead>
                <tr>
                  {['Channel', 'In Queue', 'Avg Wait Time', 'Status'].map((h) => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '10px 16px',
                      fontSize: '11px', fontWeight: 700, color: colors.textSecondary,
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                      borderBottom: `1px solid ${colors.border}`,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {queueData.map((q) => (
                  <tr key={q.channel}>
                    <td style={{
                      padding: '12px 16px', borderBottom: `1px solid ${colors.borderLight}`,
                      color: colors.text, fontWeight: 500,
                      display: 'flex', alignItems: 'center', gap: '10px',
                    }}>
                      <q.icon size={16} color={colors.textSecondary} />
                      {q.channel}
                    </td>
                    <td style={{
                      padding: '12px 16px', borderBottom: `1px solid ${colors.borderLight}`,
                      color: colors.text, fontWeight: 600,
                    }}>{q.inQueue}</td>
                    <td style={{
                      padding: '12px 16px', borderBottom: `1px solid ${colors.borderLight}`,
                      color: colors.textSecondary,
                    }}>{q.avgWait}</td>
                    <td style={{
                      padding: '12px 16px', borderBottom: `1px solid ${colors.borderLight}`,
                    }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        fontSize: '12px', fontWeight: 600, color: q.statusColor,
                        backgroundColor: `${q.statusColor}15`,
                        padding: '3px 10px', borderRadius: theme.radii.full,
                      }}>
                        <span style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          backgroundColor: q.statusColor,
                        }} />
                        {q.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
