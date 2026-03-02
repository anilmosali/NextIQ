import { useState } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/Card';
import Button from '../components/Button';
import {
  BarChart3, TrendingUp, TrendingDown, Users, Phone,
  MessageSquare, Clock, ArrowUpRight, ArrowDownRight,
  Calendar, Download, Filter, ChevronDown, Mail,
  Sparkles, Star, Zap,
} from 'lucide-react';

const kpis = [
  { label: 'Total Conversations', value: '12,847', change: '+12.3%', positive: true, icon: MessageSquare, color: theme.colors.blue },
  { label: 'Total Calls', value: '8,234', change: '+8.1%', positive: true, icon: Phone, color: theme.colors.success },
  { label: 'Avg Response', value: '1.8 min', change: '-23%', positive: true, icon: Clock, color: theme.colors.purple },
  { label: 'CX Score', value: '94.2', change: '+3.1', positive: true, icon: Star, color: theme.colors.warning },
  { label: 'Active Users', value: '342', change: '+15', positive: true, icon: Users, color: theme.colors.blue },
  { label: 'NextIQ Answer Rate', value: '87%', change: '+5.2%', positive: true, icon: Sparkles, color: theme.colors.purple },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('7d');
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  const chartData = [65, 78, 52, 89, 94, 67, 82, 91, 76, 88, 95, 79];
  const maxVal = Math.max(...chartData);

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: theme.fonts.heading, fontSize: '28px', fontWeight: 700, color: colors.text, margin: '0 0 8px' }}>Analytics</h1>
          <p style={{ fontSize: '15px', color: colors.textSecondary, margin: 0 }}>Insights across your communication channels</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '2px', padding: '2px', backgroundColor: colors.surfaceHover, borderRadius: theme.radii.md }}>
            {['24h', '7d', '30d', '90d'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  padding: '6px 14px', borderRadius: theme.radii.sm, border: 'none',
                  backgroundColor: period === p ? colors.surface : 'transparent',
                  color: period === p ? colors.text : colors.textSecondary,
                  fontSize: '13px', fontWeight: 500, fontFamily: theme.fonts.body,
                  cursor: 'pointer', boxShadow: period === p ? theme.shadows.xs : 'none',
                  transition: theme.transitions.fast,
                }}
              >{p}</button>
            ))}
          </div>
          <Button variant="secondary" size="md" icon={<Download size={16} />}>Export</Button>
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {kpis.map((kpi, i) => (
          <Card key={i} style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: theme.radii.lg,
                backgroundColor: `${kpi.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <kpi.icon size={20} color={kpi.color} />
              </div>
              <span style={{
                fontSize: '12px', fontWeight: 600,
                color: kpi.positive ? theme.colors.success : theme.colors.error,
                display: 'flex', alignItems: 'center', gap: '2px',
              }}>
                {kpi.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {kpi.change}
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: colors.text, marginBottom: '4px' }}>{kpi.value}</div>
            <div style={{ fontSize: '13px', color: colors.textSecondary }}>{kpi.label}</div>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Conversation volume chart */}
        <Card hover={false} style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontFamily: theme.fonts.heading, fontSize: '18px', fontWeight: 700, color: colors.text, margin: 0 }}>
              Conversation Volume
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {[
                { label: 'Chat', color: theme.colors.blue },
                { label: 'Email', color: theme.colors.warning },
                { label: 'Phone', color: theme.colors.success },
              ].map((leg) => (
                <div key={leg.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: leg.color }} />
                  <span style={{ color: colors.textSecondary }}>{leg.label}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Simplified bar chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px', padding: '0 8px' }}>
            {chartData.map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '100%', height: `${(val / maxVal) * 180}px`,
                  background: `linear-gradient(180deg, ${theme.colors.blue} 0%, ${theme.colors.blue}80 100%)`,
                  borderRadius: `${theme.radii.sm} ${theme.radii.sm} 0 0`,
                  transition: 'height 0.5s ease',
                  minHeight: '4px',
                }} />
                <span style={{ fontSize: '10px', color: colors.textTertiary }}>{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Channel breakdown */}
        <Card hover={false} style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: theme.fonts.heading, fontSize: '18px', fontWeight: 700, color: colors.text, margin: '0 0 24px' }}>
            Channel Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Chat', value: 42, color: theme.colors.blue, count: '5,396' },
              { label: 'Email', value: 28, color: theme.colors.warning, count: '3,597' },
              { label: 'Phone', value: 20, color: theme.colors.success, count: '2,569' },
              { label: 'SMS', value: 7, color: theme.colors.purple, count: '899' },
              { label: 'Social', value: 3, color: '#000', count: '386' },
            ].map((ch) => (
              <div key={ch.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: colors.text }}>{ch.label}</span>
                  <span style={{ fontSize: '13px', color: colors.textSecondary }}>{ch.count} ({ch.value}%)</span>
                </div>
                <div style={{ height: '6px', backgroundColor: colors.surfaceHover, borderRadius: theme.radii.full, overflow: 'hidden' }}>
                  <div style={{
                    width: `${ch.value}%`, height: '100%',
                    backgroundColor: ch.color, borderRadius: theme.radii.full,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Sentiment analysis */}
      <Card hover={false} style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: theme.fonts.heading, fontSize: '18px', fontWeight: 700, color: colors.text, margin: 0 }}>
            Sentiment Analysis
          </h3>
          <span style={{ fontSize: '13px', color: colors.textSecondary }}>Last 7 days</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { label: 'Positive', value: '68%', count: '8,736', color: theme.colors.success, emoji: '😊' },
            { label: 'Neutral', value: '24%', count: '3,083', color: theme.colors.warning, emoji: '😐' },
            { label: 'Negative', value: '8%', count: '1,028', color: theme.colors.error, emoji: '😟' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center', padding: '20px', backgroundColor: colors.surfaceHover, borderRadius: theme.radii.lg }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{s.emoji}</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: s.color, marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: colors.text, marginBottom: '2px' }}>{s.label}</div>
              <div style={{ fontSize: '12px', color: colors.textSecondary }}>{s.count} conversations</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
