import { useState } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/Card';
import Button from '../components/Button';
import {
  Sparkles, Send, Bot, Zap, Brain, MessageSquare,
  TrendingUp, CheckCircle, ArrowUpRight, FileText,
  Clock, Users, BarChart3, Star, Lightbulb, Wand2,
} from 'lucide-react';

const aiStats = [
  { label: 'Total Queries To NextIQ', value: '2,847', change: '+18%', icon: MessageSquare, color: theme.colors.blue },
  { label: 'Queries Answered By NextIQ', value: '2,476', change: '+22%', icon: CheckCircle, color: theme.colors.success },
  { label: 'Queries Unanswered By NextIQ', value: '371', change: '-8%', icon: Clock, color: theme.colors.warning },
  { label: 'NextIQ Answer Rate', value: '87%', change: '+5.2%', icon: TrendingUp, color: theme.colors.purple },
];

const recentQueries = [
  { query: 'What is our return policy for enterprise clients?', answer: 'Enterprise clients have a 60-day return window with full refund...', confidence: 0.95, time: '2m ago' },
  { query: 'How do I configure SSO with Okta?', answer: 'Navigate to Admin > Single Sign-On > Add Provider > Select Okta...', confidence: 0.88, time: '5m ago' },
  { query: 'What are the current SLA tiers?', answer: 'We offer three SLA tiers: Standard (99.9%), Premium (99.99%)...', confidence: 0.92, time: '12m ago' },
  { query: 'How to set up call recording compliance?', answer: 'Go to Admin > Channels > Calling > Call Recording section...', confidence: 0.91, time: '18m ago' },
];

export default function NextIQPage() {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: theme.radii.lg,
            background: `linear-gradient(135deg, ${theme.colors.purple} 0%, ${theme.colors.blue} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontFamily: theme.fonts.heading, fontSize: '28px', fontWeight: 700, color: colors.text, margin: 0 }}>NextIQ</h1>
          </div>
        </div>
        <p style={{ fontSize: '15px', color: colors.textSecondary, margin: 0 }}>Your AI-powered assistant for instant answers and insights</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: `1px solid ${colors.border}` }}>
        {[
          { id: 'chat', label: 'NextIQ Assistant', icon: MessageSquare },
          { id: 'analytics', label: 'Usage Analytics', icon: BarChart3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px', border: 'none',
              borderBottom: activeTab === tab.id ? `2px solid ${theme.colors.blue}` : '2px solid transparent',
              backgroundColor: 'transparent', color: activeTab === tab.id ? theme.colors.blue : colors.textSecondary,
              fontSize: '14px', fontWeight: 600, fontFamily: theme.fonts.body, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px', transition: theme.transitions.fast,
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'chat' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
          {/* Chat area */}
          <Card hover={false} style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
            {/* Chat messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {/* Welcome message */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: theme.radii.lg, flexShrink: 0,
                  background: `linear-gradient(135deg, ${theme.colors.purple}, ${theme.colors.blue})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Sparkles size={16} color="#fff" />
                </div>
                <div style={{
                  padding: '16px', backgroundColor: colors.surfaceHover,
                  borderRadius: `${theme.radii.xl} ${theme.radii.xl} ${theme.radii.xl} ${theme.radii.xs}`,
                  maxWidth: '80%',
                }}>
                  <p style={{ fontSize: '14px', color: colors.text, lineHeight: 1.6, margin: '0 0 12px' }}>
                    Hi Anil! I'm NextIQ, your AI assistant. I can help you with:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { icon: Lightbulb, text: 'Answer questions about your account and products' },
                      { icon: Wand2, text: 'Suggest responses for customer conversations' },
                      { icon: FileText, text: 'Summarize calls and meeting transcripts' },
                      { icon: BarChart3, text: 'Provide analytics insights and reports' },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <item.icon size={14} color={theme.colors.purple} />
                        <span style={{ fontSize: '13px', color: colors.textSecondary }}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Input */}
            <div style={{ padding: '16px 24px', borderTop: `1px solid ${colors.border}` }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', border: `1px solid ${colors.inputBorder}`,
                borderRadius: theme.radii.xl, backgroundColor: colors.inputBackground,
              }}>
                <Sparkles size={16} color={theme.colors.purple} />
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask NextIQ anything..."
                  style={{
                    flex: 1, border: 'none', outline: 'none', fontSize: '14px',
                    fontFamily: theme.fonts.body, color: colors.text, backgroundColor: 'transparent',
                  }}
                />
                <button style={{
                  width: '36px', height: '36px', borderRadius: theme.radii.md, border: 'none',
                  background: message.trim() ? `linear-gradient(135deg, ${theme.colors.purple}, ${theme.colors.blue})` : colors.surfaceHover,
                  cursor: message.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: theme.transitions.fast,
                }}>
                  <Send size={16} color={message.trim() ? '#fff' : colors.textTertiary} />
                </button>
              </div>
            </div>
          </Card>

          {/* Recent queries sidebar */}
          <div>
            <h3 style={{ fontFamily: theme.fonts.heading, fontSize: '16px', fontWeight: 700, color: colors.text, margin: '0 0 16px' }}>
              Recent Queries
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentQueries.map((q, i) => (
                <Card key={i} style={{ padding: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: colors.text, marginBottom: '6px', lineHeight: 1.4 }}>{q.query}</div>
                  <p style={{ fontSize: '12px', color: colors.textSecondary, lineHeight: 1.5, margin: '0 0 8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {q.answer}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        backgroundColor: q.confidence > 0.9 ? theme.colors.success : q.confidence > 0.8 ? theme.colors.warning : theme.colors.error,
                      }} />
                      <span style={{ fontSize: '11px', color: colors.textSecondary }}>{Math.round(q.confidence * 100)}% confidence</span>
                    </div>
                    <span style={{ fontSize: '11px', color: colors.textTertiary }}>{q.time}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {aiStats.map((stat, i) => (
              <Card key={i} style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: theme.radii.lg,
                    backgroundColor: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <stat.icon size={20} color={stat.color} />
                  </div>
                  <span style={{
                    fontSize: '12px', fontWeight: 600, color: theme.colors.success,
                    display: 'flex', alignItems: 'center', gap: '2px',
                  }}>
                    <ArrowUpRight size={12} />{stat.change}
                  </span>
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: colors.text, marginBottom: '4px' }}>{stat.value}</div>
                <div style={{ fontSize: '13px', color: colors.textSecondary }}>{stat.label}</div>
              </Card>
            ))}
          </div>

          {/* Chart placeholder */}
          <Card hover={false} style={{ padding: '24px', textAlign: 'center', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <h3 style={{ fontFamily: theme.fonts.heading, fontSize: '18px', fontWeight: 700, color: colors.text, margin: '0 0 8px' }}>NextIQ Usage Over Time</h3>
            <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>Query volume trends and answer rate analytics</p>
          </Card>
        </>
      )}
    </div>
  );
}
