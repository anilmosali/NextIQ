import { useState, useEffect, useRef, useMemo } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import {
  Settings, Briefcase, CreditCard, Cloud, Layers, Hash,
  Monitor, Users, Zap, Shield, Grid, Inbox, FileText,
  Calendar, Phone, MessageSquare, MessageCircle, Mail,
  Image, Video, MapPin, GitBranch, Code, ChevronDown,
  ChevronRight, Plus, Search, Edit, Trash2, MoreHorizontal,
  Check, X, ExternalLink, Globe, Lock, Key, Bell, Mic,
  Eye, Home, ToggleLeft, ToggleRight, ArrowUpRight,
  BookOpen, Download, Upload, RefreshCw, Star, Clock, Wrench, Sparkles,
} from 'lucide-react';
import ActionsBuilder from '../components/ActionsBuilder';
import ActionCanvas from '../components/ActionCanvas';
import CoachingRulesBuilder from '../components/CoachingRulesBuilder';
import NextIQEngine from '../components/NextIQEngine';
import NextIQGoals from '../components/NextIQGoals';
import NextIQGoalDetail from '../components/NextIQGoalDetail';
import NextIQGuardrails from '../components/NextIQGuardrails';
import NextIQPlaybooks from '../components/NextIQPlaybooks';
import NextIQGoalCreate from '../components/NextIQGoalCreate';
import NextIQGuardrailCreate from '../components/NextIQGuardrailCreate';
import { NEXTIQ_GOALS, NEXTIQ_GUARDRAILS } from '../data/nextiqConfig';

const sectionDefinitions = {
  account: {
    title: 'Account',
    items: [
      { id: 'companyInfo', label: 'Company Info', icon: Briefcase },
      { id: 'billing', label: 'Billing', icon: CreditCard },
      { id: 'singleSignOn', label: 'Single Sign-On', icon: Cloud },
      { id: 'directorySync', label: 'Directory Sync', icon: Layers },
      { id: 'numbers', label: 'Numbers', icon: Hash },
      { id: 'devices', label: 'Devices', icon: Monitor },
    ],
  },
  peopleAI: {
    title: 'People & AI',
    items: [
      { id: 'users', label: 'Users', icon: Users },
      { id: 'aiEmployees', label: 'AI Employees', icon: Zap },
      { id: 'rolesPermissions', label: 'Access Control', icon: Shield },
      { id: 'skills', label: 'Skills', icon: Grid },
    ],
  },
  nextIQ: {
    title: 'NextIQ',
    items: [
      { id: 'nextiqEngine', label: 'Engine', icon: Settings },
      { id: 'nextiqGoals', label: 'Goals', icon: Sparkles },
      { id: 'actionsBuilder', label: 'Actions', icon: Wrench },
      { id: 'nextiqGuardrails', label: 'Guardrails', icon: Shield },
      { id: 'coachingRules', label: 'Coaching Rules', icon: Eye },
      { id: 'nextiqPlaybooks', label: 'Playbooks', icon: BookOpen },
      { id: 'supervisorDashboard', label: 'Supervisor Dashboard', icon: Eye },
    ],
  },
  manage: {
    title: 'Manage',
    items: [
      { id: 'sharedInboxes', label: 'Shared Inboxes', icon: Inbox },
      { id: 'knowledgeBase', label: 'Knowledge', icon: FileText },
      { id: 'schedules', label: 'Schedules', icon: Calendar },
    ],
  },
  channels: {
    title: 'Channels',
    items: [
      { id: 'calling', label: 'Calling', icon: Phone },
      { id: 'smsText', label: 'SMS Text', icon: MessageSquare },
      { id: 'liveChat', label: 'Live Chat', icon: MessageCircle },
      { id: 'email', label: 'Email', icon: Mail },
      { id: 'messagingApps', label: 'Messaging Apps', icon: MessageCircle },
      { id: 'social', label: 'Social Media', icon: Image },
      { id: 'meetings', label: 'Meetings', icon: Video },
    ],
  },
  nextStudio: {
    title: 'NEXT Studio',
    items: [
      { id: 'journeys', label: 'Journeys', icon: MapPin },
      { id: 'workflows', label: 'Workflows', icon: GitBranch },
      { id: 'functions', label: 'Functions', icon: Code },
      { id: 'chatbots', label: 'Chatbots', icon: Zap },
    ],
  },
};

function AdminHome({ navigateToSection }) {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const [hovered, setHovered] = useState(null);

  const quickLinks = [
    { id: 'users', label: 'Manage Users', icon: Users, desc: 'Add, edit, or remove team members', color: theme.colors.blue },
    { id: 'aiEmployees', label: 'AI Employees', icon: Zap, desc: 'Configure AI-powered agents', color: theme.colors.purple },
    { id: 'calling', label: 'Calling', icon: Phone, desc: 'Phone system and call routing setup', color: theme.colors.success },
    { id: 'billing', label: 'Billing', icon: CreditCard, desc: 'View plans, invoices, and payments', color: theme.colors.warning },
    { id: 'knowledgeBase', label: 'Knowledge', icon: BookOpen, desc: 'Manage your knowledge base articles', color: theme.colors.blue },
    { id: 'sharedInboxes', label: 'Shared Inboxes', icon: Inbox, desc: 'Configure team inboxes and routing', color: theme.colors.success },
  ];

  const recentActivity = [
    { action: 'New user registered', user: 'Sarah Johnson', time: '2 minutes ago', type: 'user' },
    { action: 'Conversation resolved', user: 'Titan Solar Power', time: '15 minutes ago', type: 'conversation' },
    { action: 'AI Employee created', user: 'Customer Whisperer', time: '1 hour ago', type: 'ai' },
    { action: 'Billing updated', user: 'Annual plan renewed', time: '3 hours ago', type: 'billing' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: theme.fonts.heading, fontSize: '28px', fontWeight: 700, color: colors.text, margin: '0 0 8px' }}>
          Admin Home
        </h1>
        <p style={{ fontSize: '15px', color: colors.textSecondary, margin: 0 }}>
          Manage your organization settings and team
        </p>
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
        {quickLinks.map((link) => (
          <div
            key={link.id}
            onClick={() => navigateToSection(link.id)}
            onMouseEnter={() => setHovered(link.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: '24px',
              backgroundColor: colors.cardBackground,
              borderRadius: theme.radii.xl,
              border: `1px solid ${hovered === link.id ? theme.colors.blue + '40' : colors.cardBorder}`,
              cursor: 'pointer',
              transition: `all ${theme.transitions.fast}`,
              transform: hovered === link.id ? 'translateY(-2px)' : 'none',
              boxShadow: hovered === link.id ? theme.shadows.md : colors.cardShadow,
            }}
          >
            <div style={{
              width: '44px', height: '44px', borderRadius: theme.radii.lg,
              backgroundColor: `${link.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px',
            }}>
              <link.icon size={22} color={link.color} />
            </div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: colors.text, marginBottom: '4px' }}>{link.label}</div>
            <div style={{ fontSize: '13px', color: colors.textSecondary, lineHeight: 1.5 }}>{link.desc}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <h2 style={{ fontFamily: theme.fonts.heading, fontSize: '20px', fontWeight: 700, color: colors.text, margin: '0 0 20px' }}>
        Recent Activity
      </h2>
      <Card hover={false} style={{ overflow: 'hidden' }}>
        {recentActivity.map((item, i) => (
          <div key={i} style={{
            padding: '16px 24px',
            borderBottom: i < recentActivity.length - 1 ? `1px solid ${colors.divider}` : 'none',
            display: 'flex', alignItems: 'center', gap: '16px',
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: theme.radii.md,
              backgroundColor: item.type === 'user' ? theme.colors.blueMuted
                : item.type === 'ai' ? `${theme.colors.purple}15`
                  : item.type === 'billing' ? theme.colors.warningMuted
                    : theme.colors.successMuted,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {item.type === 'user' ? <Users size={16} color={theme.colors.blue} />
                : item.type === 'ai' ? <Zap size={16} color={theme.colors.purple} />
                  : item.type === 'billing' ? <CreditCard size={16} color={theme.colors.warning} />
                    : <Check size={16} color={theme.colors.success} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 500, color: colors.text }}>{item.action}</div>
              <div style={{ fontSize: '13px', color: colors.textSecondary }}>{item.user}</div>
            </div>
            <span style={{ fontSize: '12px', color: colors.textTertiary }}>{item.time}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ═══ Supervisor Dashboard — Needs Attention ═══ */
const MOCK_AGENTS = [
  {
    id: 'a1', name: 'Anil Reddy', initials: 'AR',
    gradient: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
    activeConversation: 'Brad Pitt — Billing Issue',
    score: 80, status: 'warning',
    alerts: [
      { id: 'al1', rule: 'VIP Churn Risk Escalation', severity: 'critical', message: 'VIP customer at churn risk — agent has not acknowledged risk factors.', time: '2 min ago' },
    ],
  },
  {
    id: 'a2', name: 'Jamie Chen', initials: 'JC',
    gradient: 'linear-gradient(135deg, #10B981, #0D9488)',
    activeConversation: 'Sarah Kim — Account Upgrade',
    score: 100, status: 'good',
    alerts: [],
  },
  {
    id: 'a3', name: 'Priya Patel', initials: 'PP',
    gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
    activeConversation: 'Tom Bradley — Service Outage',
    score: 55, status: 'critical',
    alerts: [
      { id: 'al2', rule: 'Tone Monitoring', severity: 'warning', message: 'Customer expressed frustration — agent has not shown empathy.', time: '5 min ago' },
      { id: 'al3', rule: 'Sensitive Data Compliance', severity: 'critical', message: 'Agent shared account details without completing identity verification.', time: '3 min ago' },
    ],
  },
  {
    id: 'a4', name: 'Marcus Brown', initials: 'MB',
    gradient: 'linear-gradient(135deg, #EC4899, #DB2777)',
    activeConversation: 'Amanda Foster — Plan Expansion',
    score: 95, status: 'good',
    alerts: [],
  },
  {
    id: 'a5', name: 'Sophia Wang', initials: 'SW',
    gradient: 'linear-gradient(135deg, #6366F1, #4F46E5)',
    activeConversation: 'David Kim — API Rate Limit',
    score: 70, status: 'warning',
    alerts: [
      { id: 'al4', rule: 'Upsell Timing', severity: 'warning', message: 'Upsell attempted before resolving the customer\'s issue.', time: '1 min ago' },
    ],
  },
];

function SupervisorDashboard() {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [hoveredAgent, setHoveredAgent] = useState(null);
  const [filterMode, setFilterMode] = useState('all');

  const needsAttention = MOCK_AGENTS.filter(a => a.alerts.length > 0);
  const onTrack = MOCK_AGENTS.filter(a => a.alerts.length === 0);
  const displayAgents = filterMode === 'attention' ? needsAttention : filterMode === 'ontrack' ? onTrack : MOCK_AGENTS;

  const totalAlerts = MOCK_AGENTS.reduce((sum, a) => sum + a.alerts.length, 0);
  const avgScore = Math.round(MOCK_AGENTS.reduce((sum, a) => sum + a.score, 0) / MOCK_AGENTS.length);

  const scoreColor = (s) => s >= 80 ? theme.colors.success : s >= 50 ? theme.colors.warning : theme.colors.error;
  const scoreBg = (s) => s >= 80 ? 'rgba(16,185,129,0.08)' : s >= 50 ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)';

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: colors.text, margin: 0 }}>Supervisor Dashboard</h1>
        <p style={{ fontSize: '14px', color: colors.textSecondary, margin: '4px 0 0' }}>Real-time coaching oversight for your team</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Active Agents', value: MOCK_AGENTS.length, icon: Users, color: theme.colors.blue },
          { label: 'Needs Attention', value: needsAttention.length, icon: Bell, color: needsAttention.length > 0 ? theme.colors.error : theme.colors.success },
          { label: 'Open Alerts', value: totalAlerts, icon: Shield, color: totalAlerts > 0 ? theme.colors.warning : theme.colors.success },
          { label: 'Avg. Coaching Score', value: `${avgScore}%`, icon: Star, color: scoreColor(avgScore) },
        ].map((card, i) => {
          const CardIcon = card.icon;
          return (
            <div key={i} style={{
              padding: '18px', borderRadius: theme.radii.lg,
              backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
              display: 'flex', alignItems: 'center', gap: '14px',
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: theme.radii.md,
                backgroundColor: `${card.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CardIcon size={18} color={card.color} />
              </div>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: colors.text }}>{card.value}</div>
                <div style={{ fontSize: '12px', color: colors.textSecondary }}>{card.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        {[
          { id: 'all', label: `All Agents (${MOCK_AGENTS.length})` },
          { id: 'attention', label: `Needs Attention (${needsAttention.length})` },
          { id: 'ontrack', label: `On Track (${onTrack.length})` },
        ].map(f => (
          <button key={f.id} onClick={() => setFilterMode(f.id)} style={{
            padding: '6px 14px', borderRadius: theme.radii.full, border: `1px solid ${filterMode === f.id ? theme.colors.blue : colors.border}`,
            backgroundColor: filterMode === f.id ? `${theme.colors.blue}10` : 'transparent',
            color: filterMode === f.id ? theme.colors.blue : colors.textSecondary,
            fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body,
            transition: theme.transitions.fast,
          }}>{f.label}</button>
        ))}
      </div>

      {/* Agent List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {displayAgents.map(agent => {
          const isExpanded = selectedAgent === agent.id;
          const isHov = hoveredAgent === agent.id;
          return (
            <div key={agent.id}
              onClick={() => setSelectedAgent(isExpanded ? null : agent.id)}
              onMouseEnter={() => setHoveredAgent(agent.id)}
              onMouseLeave={() => setHoveredAgent(null)}
              style={{
                borderRadius: theme.radii.lg, border: `1px solid ${agent.alerts.length > 0 ? 'rgba(239,68,68,0.2)' : colors.border}`,
                backgroundColor: isHov ? colors.surfaceHover : colors.surface,
                cursor: 'pointer', transition: theme.transitions.fast, overflow: 'hidden',
              }}
            >
              {/* Agent Row */}
              <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', background: agent.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>{agent.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>{agent.name}</span>
                    {agent.alerts.length > 0 && (
                      <span style={{
                        padding: '2px 8px', borderRadius: theme.radii.full,
                        backgroundColor: 'rgba(239,68,68,0.08)', color: theme.colors.error,
                        fontSize: '10px', fontWeight: 700,
                      }}>
                        {agent.alerts.length} alert{agent.alerts.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '2px' }}>
                    {agent.activeConversation}
                  </div>
                </div>
                {/* Coaching Score */}
                <div style={{
                  padding: '4px 12px', borderRadius: theme.radii.full,
                  backgroundColor: scoreBg(agent.score),
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}>
                  <Shield size={12} color={scoreColor(agent.score)} />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: scoreColor(agent.score) }}>
                    {agent.score}%
                  </span>
                </div>
                <ChevronDown size={14} color={colors.textTertiary} style={{
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: theme.transitions.fast,
                }} />
              </div>

              {/* Expanded Alert Details */}
              {isExpanded && (
                <div style={{
                  borderTop: `1px solid ${colors.border}`, padding: '14px 18px',
                  backgroundColor: agent.alerts.length > 0 ? 'rgba(239,68,68,0.02)' : 'rgba(16,185,129,0.02)',
                }}>
                  {agent.alerts.length > 0 ? (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                        <Bell size={12} color={theme.colors.error} />
                        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: theme.colors.error }}>
                          Active Alerts
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {agent.alerts.map(alert => (
                          <div key={alert.id} style={{
                            padding: '10px 12px', borderRadius: theme.radii.md,
                            backgroundColor: alert.severity === 'critical' ? 'rgba(239,68,68,0.05)' : 'rgba(245,158,11,0.05)',
                            borderLeft: `3px solid ${alert.severity === 'critical' ? theme.colors.error : theme.colors.warning}`,
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                              <span style={{
                                padding: '1px 6px', borderRadius: theme.radii.full, fontSize: '9px', fontWeight: 700,
                                textTransform: 'uppercase', letterSpacing: '0.3px',
                                backgroundColor: alert.severity === 'critical' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                                color: alert.severity === 'critical' ? theme.colors.error : theme.colors.warning,
                              }}>{alert.severity}</span>
                              <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text }}>{alert.rule}</span>
                              <span style={{ fontSize: '10px', color: colors.textTertiary, marginLeft: 'auto' }}>{alert.time}</span>
                            </div>
                            <div style={{ fontSize: '12px', color: colors.textSecondary, lineHeight: 1.5 }}>{alert.message}</div>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                              <button style={{
                                padding: '4px 10px', borderRadius: theme.radii.sm,
                                border: `1px solid ${theme.colors.blue}`, backgroundColor: `${theme.colors.blue}08`,
                                color: theme.colors.blue, fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                                fontFamily: theme.fonts.body,
                              }}>Whisper Coach</button>
                              <button style={{
                                padding: '4px 10px', borderRadius: theme.radii.sm,
                                border: `1px solid ${colors.border}`, backgroundColor: 'transparent',
                                color: colors.textSecondary, fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                                fontFamily: theme.fonts.body,
                              }}>Listen In</button>
                              <button style={{
                                padding: '4px 10px', borderRadius: theme.radii.sm,
                                border: `1px solid ${colors.border}`, backgroundColor: 'transparent',
                                color: colors.textSecondary, fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                                fontFamily: theme.fonts.body,
                              }}>Dismiss</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0' }}>
                      <Check size={14} color={theme.colors.success} />
                      <span style={{ fontSize: '12px', color: colors.textSecondary }}>
                        Agent is following all coaching guidelines — no active alerts.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SectionContent({ sectionId }) {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  const content = {
    companyInfo: {
      title: 'Company Info',
      desc: 'Manage your company details and branding',
      fields: [
        { label: 'Company name', value: 'Nextiva Inc.' },
        { label: 'Brand name', value: 'Nextiva' },
        { label: 'Website', value: 'www.nextiva.com' },
        { label: 'Industry', value: 'Technology' },
        { label: 'Location', value: 'Scottsdale, AZ' },
      ],
    },
    billing: {
      title: 'Billing & Account',
      desc: 'Manage subscriptions, invoices, and payment methods',
      stats: [
        { label: 'Current Plan', value: 'Enterprise', color: theme.colors.purple },
        { label: 'Credit Balance', value: '$2,450.00', color: theme.colors.success },
        { label: 'Next Renewal', value: 'Mar 15, 2026', color: theme.colors.blue },
      ],
    },
    singleSignOn: {
      title: 'Single Sign-On',
      desc: 'Configure SSO providers for your organization',
      providers: ['Okta', 'Entra ID', 'Google Workspace', 'SAML', 'OpenID Connect'],
    },
    directorySync: {
      title: 'Directory Sync',
      desc: 'Sync users from external directories',
      providers: ['Active Directory', 'LDAP', 'Google Workspace', 'Entra ID'],
    },
    numbers: {
      title: 'Phone Numbers',
      desc: 'Manage your phone numbers and assignments',
      numbers: [
        { number: '+1 (480) 555-0100', type: 'Main', assigned: 'Headquarters' },
        { number: '+1 (480) 555-0101', type: 'Sales', assigned: 'Sales Team' },
        { number: '+1 (480) 555-0102', type: 'Support', assigned: 'Support Team' },
      ],
    },
    devices: {
      title: 'Devices',
      desc: 'Manage phones and hardware devices',
      devices: [
        { name: 'Desk Phone - Office', type: 'Polycom', status: 'Online' },
        { name: 'Softphone - Laptop', type: 'App', status: 'Online' },
        { name: 'Conference Room', type: 'Poly', status: 'Offline' },
      ],
    },
    users: {
      title: 'Users',
      desc: 'Manage team members and permissions',
      users: [
        { name: 'Anil Reddy', role: 'Global Administrator', status: 'Active', email: 'anil@nextiva.com' },
        { name: 'Brad Pitt', role: 'Supervisor', status: 'Active', email: 'brad@nextiva.com' },
        { name: 'Michael Rodriguez', role: 'Support Specialist', status: 'Active', email: 'michael@nextiva.com' },
        { name: 'Jennifer Brown', role: 'Support Specialist', status: 'Active', email: 'jennifer@nextiva.com' },
      ],
    },
    aiEmployees: {
      title: 'AI Employees',
      desc: 'Configure and manage AI-powered agents',
      agents: [
        { name: 'Customer Whisperer', type: 'Support', status: 'Active', interactions: 1247 },
        { name: 'First Contact Hero', type: 'Sales', status: 'Active', interactions: 892 },
        { name: 'Night Owl', type: 'After Hours', status: 'Active', interactions: 456 },
      ],
    },
    rolesPermissions: {
      title: 'Access Control',
      desc: 'Manage roles and permissions for your team',
      roles: [
        { name: 'Global Administrator', users: 2, permissions: 'Full access' },
        { name: 'Supervisor', users: 5, permissions: 'Manage teams and view reports' },
        { name: 'Support Specialist', users: 12, permissions: 'Handle conversations' },
        { name: 'Viewer', users: 8, permissions: 'View analytics and reports' },
      ],
    },
    skills: {
      title: 'Skills',
      desc: 'Define agent skills for intelligent routing',
      skills: ['English', 'Spanish', 'Technical Support', 'Billing', 'Sales', 'VIP Accounts'],
    },
    sharedInboxes: {
      title: 'Shared Inboxes',
      desc: 'Manage team inboxes and routing rules',
      inboxes: [
        { name: 'General Inbox', members: 8, channels: ['email', 'chat'] },
        { name: 'Sales Team', members: 5, channels: ['email', 'phone'] },
        { name: 'Support Team', members: 12, channels: ['email', 'chat', 'phone'] },
        { name: 'VIP Accounts', members: 3, channels: ['email', 'phone'] },
      ],
    },
    knowledgeBase: {
      title: 'Knowledge Base',
      desc: 'Manage articles and documentation for AI and agents',
      categories: [
        { name: 'Policies', count: 12 },
        { name: 'Procedures', count: 18 },
        { name: 'Training', count: 8 },
        { name: 'Product Docs', count: 24 },
        { name: 'Support', count: 15 },
      ],
    },
    schedules: {
      title: 'Schedules',
      desc: 'Set up business hours and schedules',
      schedules: [
        { name: 'Business Hours', hours: 'Mon–Fri, 8:00 AM – 6:00 PM' },
        { name: 'Holiday Schedule', hours: 'Custom dates' },
        { name: 'Weekend Support', hours: 'Sat–Sun, 9:00 AM – 3:00 PM' },
      ],
    },
    calling: {
      title: 'Calling',
      desc: 'Configure your phone system and call routing',
      settings: ['Call Routing', 'IVR', 'Queues', 'Call Recording', 'Voicemail', 'Forwarding'],
    },
    smsText: {
      title: 'SMS & Texting',
      desc: 'Configure SMS messaging and 10DLC registration',
      status: 'Active',
    },
    liveChat: {
      title: 'Live Chat',
      desc: 'Set up and customize your live chat widget',
      widgets: [
        { name: 'Main Website Widget', status: 'Active', visitors: 234 },
        { name: 'Help Center Widget', status: 'Active', visitors: 89 },
      ],
    },
    email: {
      title: 'Email',
      desc: 'Configure business email settings',
      addresses: ['sales@company.com', 'support@company.com', 'info@company.com'],
    },
    messagingApps: {
      title: 'Messaging Apps',
      desc: 'Connect messaging platforms',
      apps: [
        { name: 'WhatsApp', status: 'Connected' },
        { name: 'Facebook Messenger', status: 'Coming Soon' },
        { name: 'Telegram', status: 'Coming Soon' },
      ],
    },
    social: {
      title: 'Social Media',
      desc: 'Connect and manage social media channels',
      channels: [
        { name: 'Facebook', connected: true },
        { name: 'Instagram', connected: true },
        { name: 'X.com', connected: true },
        { name: 'LinkedIn', connected: false },
        { name: 'YouTube', connected: false },
      ],
    },
    meetings: {
      title: 'Meetings',
      desc: 'Configure video meeting settings',
      rooms: ['Video Meeting Conference', 'Webinar Room', 'Main Conference Room'],
    },
    journeys: {
      title: 'Journeys',
      desc: 'Design customer journeys across touchpoints',
      journeys: [
        { name: 'New Customer Onboarding', status: 'Active', steps: 8 },
        { name: 'Support Escalation', status: 'Active', steps: 5 },
        { name: 'Renewal Flow', status: 'Draft', steps: 6 },
      ],
    },
    workflows: {
      title: 'Workflows',
      desc: 'Automate business processes',
      workflows: [
        { name: 'Log calls to Salesforce', status: 'Active', triggers: 342 },
        { name: 'Send follow-up email after call', status: 'Active', triggers: 128 },
        { name: 'Zendesk case from voicemail', status: 'Active', triggers: 56 },
      ],
    },
    functions: {
      title: 'Functions',
      desc: 'Custom serverless functions for advanced automation',
      functions: [
        { name: 'Get Contact Information', type: 'API', status: 'Active' },
        { name: 'Create Support Item', type: 'Webhook', status: 'Active' },
        { name: 'End Session', type: 'Action', status: 'Active' },
      ],
    },
    chatbots: {
      title: 'Chatbots',
      desc: 'Configure conversational AI chatbots',
      bots: [
        { name: 'Website Chat', status: 'Active', conversations: 1456 },
        { name: 'Delivery Form Chat', status: 'Active', conversations: 234 },
      ],
    },
  };

  const section = content[sectionId];
  if (!section) return null;

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: theme.fonts.heading, fontSize: '28px', fontWeight: 700, color: colors.text, margin: '0 0 8px' }}>
          {section.title}
        </h1>
        <p style={{ fontSize: '15px', color: colors.textSecondary, margin: 0 }}>{section.desc}</p>
      </div>

      {/* Company Info */}
      {section.fields && (
        <Card hover={false} style={{ overflow: 'hidden' }}>
          {section.fields.map((field, i) => (
            <div key={i} style={{
              padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderBottom: i < section.fields.length - 1 ? `1px solid ${colors.divider}` : 'none',
            }}>
              <div>
                <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>{field.label}</div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: colors.text }}>{field.value}</div>
              </div>
              <Button variant="ghost" size="sm" icon={<Edit size={14} />}>Edit</Button>
            </div>
          ))}
        </Card>
      )}

      {/* Billing stats */}
      {section.stats && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {section.stats.map((stat, i) => (
              <Card key={i} style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: '8px' }}>{stat.label}</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
              </Card>
            ))}
          </div>
          <Card hover={false} style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.text, margin: '0 0 16px' }}>Payment Methods</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: colors.surfaceHover, borderRadius: theme.radii.md }}>
              <CreditCard size={20} color={theme.colors.blue} />
              <span style={{ fontSize: '14px', color: colors.text }}>Visa ending 4242</span>
              <span style={{ fontSize: '12px', color: colors.textSecondary, marginLeft: 'auto' }}>Default</span>
            </div>
          </Card>
        </>
      )}

      {/* Providers list */}
      {section.providers && (
        <Card hover={false} style={{ overflow: 'hidden' }}>
          {section.providers.map((p, i) => (
            <div key={i} style={{
              padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderBottom: i < section.providers.length - 1 ? `1px solid ${colors.divider}` : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: theme.radii.md, backgroundColor: theme.colors.blueMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Key size={16} color={theme.colors.blue} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 500, color: colors.text }}>{p}</span>
              </div>
              <Button variant="secondary" size="sm">Configure</Button>
            </div>
          ))}
        </Card>
      )}

      {/* Numbers */}
      {section.numbers && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <Button variant="primary" size="md" icon={<Plus size={16} />}>Add Number</Button>
          </div>
          <Card hover={false} style={{ overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', padding: '12px 24px', backgroundColor: colors.surfaceHover, borderBottom: `1px solid ${colors.border}` }}>
              {['Number', 'Type', 'Assigned To', ''].map((h, i) => (
                <span key={i} style={{ fontSize: '11px', fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
              ))}
            </div>
            {section.numbers.map((n, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', padding: '16px 24px', alignItems: 'center',
                borderBottom: i < section.numbers.length - 1 ? `1px solid ${colors.divider}` : 'none',
              }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text, fontFamily: "'Space Grotesk', monospace" }}>{n.number}</span>
                <span style={{ fontSize: '13px', color: colors.textSecondary }}>{n.type}</span>
                <span style={{ fontSize: '13px', color: colors.textSecondary }}>{n.assigned}</span>
                <Button variant="ghost" size="sm" icon={<Edit size={14} />} />
              </div>
            ))}
          </Card>
        </>
      )}

      {/* Devices */}
      {section.devices && (
        <Card hover={false} style={{ overflow: 'hidden' }}>
          {section.devices.map((d, i) => (
            <div key={i} style={{
              padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px',
              borderBottom: i < section.devices.length - 1 ? `1px solid ${colors.divider}` : 'none',
            }}>
              <Monitor size={20} color={colors.textSecondary} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: colors.text }}>{d.name}</div>
                <div style={{ fontSize: '12px', color: colors.textSecondary }}>{d.type}</div>
              </div>
              <span style={{
                fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: theme.radii.full,
                backgroundColor: d.status === 'Online' ? theme.colors.successMuted : colors.surfaceHover,
                color: d.status === 'Online' ? theme.colors.success : colors.textSecondary,
              }}>{d.status}</span>
            </div>
          ))}
        </Card>
      )}

      {/* Users */}
      {section.users && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <Button variant="primary" size="md" icon={<Plus size={16} />}>Add User</Button>
          </div>
          <Card hover={false} style={{ overflow: 'hidden' }}>
            {section.users.map((u, i) => (
              <div key={i} style={{
                padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px',
                borderBottom: i < section.users.length - 1 ? `1px solid ${colors.divider}` : 'none',
              }}>
                <Avatar name={u.name} size={40} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>{u.name}</div>
                  <div style={{ fontSize: '12px', color: colors.textSecondary }}>{u.email}</div>
                </div>
                <span style={{ fontSize: '13px', color: colors.textSecondary }}>{u.role}</span>
                <span style={{
                  fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: theme.radii.full,
                  backgroundColor: theme.colors.successMuted, color: theme.colors.success,
                }}>{u.status}</span>
                <Button variant="ghost" size="sm" icon={<MoreHorizontal size={14} />} />
              </div>
            ))}
          </Card>
        </>
      )}

      {/* AI Employees */}
      {section.agents && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <Button variant="primary" size="md" icon={<Plus size={16} />}>Create AI Employee</Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {section.agents.map((agent, i) => (
              <Card key={i} style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: theme.radii.lg,
                    background: `linear-gradient(135deg, ${theme.colors.purple}, ${theme.colors.blue})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Zap size={20} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: colors.text }}>{agent.name}</div>
                    <div style={{ fontSize: '12px', color: colors.textSecondary }}>{agent.type}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: theme.radii.full,
                    backgroundColor: theme.colors.successMuted, color: theme.colors.success,
                  }}>{agent.status}</span>
                  <span style={{ fontSize: '13px', color: colors.textSecondary }}>{agent.interactions.toLocaleString()} interactions</span>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Roles */}
      {section.roles && (
        <Card hover={false} style={{ overflow: 'hidden' }}>
          {section.roles.map((role, i) => (
            <div key={i} style={{
              padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px',
              borderBottom: i < section.roles.length - 1 ? `1px solid ${colors.divider}` : 'none',
            }}>
              <Shield size={20} color={theme.colors.blue} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>{role.name}</div>
                <div style={{ fontSize: '12px', color: colors.textSecondary }}>{role.permissions}</div>
              </div>
              <span style={{ fontSize: '13px', color: colors.textSecondary }}>{role.users} users</span>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          ))}
        </Card>
      )}

      {/* Skills */}
      {section.skills && typeof section.skills === 'object' && Array.isArray(section.skills) && !section.agents && !section.roles && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <Button variant="primary" size="md" icon={<Plus size={16} />}>Add Skill</Button>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {section.skills.map((skill, i) => (
              <div key={i} style={{
                padding: '10px 20px', backgroundColor: colors.cardBackground,
                border: `1px solid ${colors.cardBorder}`, borderRadius: theme.radii.full,
                fontSize: '14px', fontWeight: 500, color: colors.text,
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                {skill}
                <X size={14} color={colors.textSecondary} style={{ cursor: 'pointer' }} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Inboxes */}
      {section.inboxes && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <Button variant="primary" size="md" icon={<Plus size={16} />}>New Inbox</Button>
          </div>
          <Card hover={false} style={{ overflow: 'hidden' }}>
            {section.inboxes.map((inbox, i) => (
              <div key={i} style={{
                padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px',
                borderBottom: i < section.inboxes.length - 1 ? `1px solid ${colors.divider}` : 'none',
              }}>
                <Inbox size={20} color={theme.colors.blue} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>{inbox.name}</div>
                  <div style={{ fontSize: '12px', color: colors.textSecondary }}>{inbox.members} members · {inbox.channels.join(', ')}</div>
                </div>
                <Button variant="ghost" size="sm">Manage</Button>
              </div>
            ))}
          </Card>
        </>
      )}

      {/* Knowledge categories */}
      {section.categories && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', gap: '12px' }}>
            <Button variant="secondary" size="md" icon={<Upload size={16} />}>Import</Button>
            <Button variant="primary" size="md" icon={<Plus size={16} />}>Add Document</Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {section.categories.map((cat, i) => (
              <Card key={i} style={{ padding: '24px', textAlign: 'center' }}>
                <FileText size={24} color={theme.colors.blue} style={{ marginBottom: '12px' }} />
                <div style={{ fontSize: '15px', fontWeight: 600, color: colors.text, marginBottom: '4px' }}>{cat.name}</div>
                <div style={{ fontSize: '13px', color: colors.textSecondary }}>{cat.count} articles</div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Schedules */}
      {section.schedules && (
        <Card hover={false} style={{ overflow: 'hidden' }}>
          {section.schedules.map((s, i) => (
            <div key={i} style={{
              padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px',
              borderBottom: i < section.schedules.length - 1 ? `1px solid ${colors.divider}` : 'none',
            }}>
              <Calendar size={20} color={theme.colors.blue} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>{s.name}</div>
                <div style={{ fontSize: '12px', color: colors.textSecondary }}>{s.hours}</div>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          ))}
        </Card>
      )}

      {/* Calling settings */}
      {section.settings && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {section.settings.map((s, i) => (
            <Card key={i} style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Phone size={24} color={theme.colors.blue} style={{ marginBottom: '12px' }} />
              <div style={{ fontSize: '15px', fontWeight: 600, color: colors.text }}>{s}</div>
            </Card>
          ))}
        </div>
      )}

      {/* Widgets */}
      {section.widgets && (
        <Card hover={false} style={{ overflow: 'hidden' }}>
          {section.widgets.map((w, i) => (
            <div key={i} style={{
              padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px',
              borderBottom: i < section.widgets.length - 1 ? `1px solid ${colors.divider}` : 'none',
            }}>
              <MessageCircle size={20} color={theme.colors.blue} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>{w.name}</div>
                <div style={{ fontSize: '12px', color: colors.textSecondary }}>{w.visitors} active visitors</div>
              </div>
              <span style={{
                fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: theme.radii.full,
                backgroundColor: theme.colors.successMuted, color: theme.colors.success,
              }}>{w.status}</span>
            </div>
          ))}
        </Card>
      )}

      {/* Email addresses */}
      {section.addresses && (
        <Card hover={false} style={{ overflow: 'hidden' }}>
          {section.addresses.map((addr, i) => (
            <div key={i} style={{
              padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px',
              borderBottom: i < section.addresses.length - 1 ? `1px solid ${colors.divider}` : 'none',
            }}>
              <Mail size={20} color={theme.colors.blue} />
              <span style={{ fontSize: '14px', fontWeight: 500, color: colors.text, flex: 1 }}>{addr}</span>
              <Button variant="ghost" size="sm">Configure</Button>
            </div>
          ))}
        </Card>
      )}

      {/* Messaging apps */}
      {section.apps && (
        <Card hover={false} style={{ overflow: 'hidden' }}>
          {section.apps.map((app, i) => (
            <div key={i} style={{
              padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px',
              borderBottom: i < section.apps.length - 1 ? `1px solid ${colors.divider}` : 'none',
            }}>
              <MessageCircle size={20} color={theme.colors.blue} />
              <span style={{ fontSize: '14px', fontWeight: 500, color: colors.text, flex: 1 }}>{app.name}</span>
              <span style={{
                fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: theme.radii.full,
                backgroundColor: app.status === 'Connected' ? theme.colors.successMuted : colors.surfaceHover,
                color: app.status === 'Connected' ? theme.colors.success : colors.textSecondary,
              }}>{app.status}</span>
            </div>
          ))}
        </Card>
      )}

      {/* Social channels */}
      {section.channels && (
        <Card hover={false} style={{ overflow: 'hidden' }}>
          {section.channels.map((ch, i) => (
            <div key={i} style={{
              padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px',
              borderBottom: i < section.channels.length - 1 ? `1px solid ${colors.divider}` : 'none',
            }}>
              <Globe size={20} color={theme.colors.blue} />
              <span style={{ fontSize: '14px', fontWeight: 500, color: colors.text, flex: 1 }}>{ch.name}</span>
              {ch.connected ? (
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: theme.radii.full, backgroundColor: theme.colors.successMuted, color: theme.colors.success }}>Connected</span>
              ) : (
                <Button variant="secondary" size="sm">Connect</Button>
              )}
            </div>
          ))}
        </Card>
      )}

      {/* Meeting rooms */}
      {section.rooms && (
        <Card hover={false} style={{ overflow: 'hidden' }}>
          {section.rooms.map((room, i) => (
            <div key={i} style={{
              padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px',
              borderBottom: i < section.rooms.length - 1 ? `1px solid ${colors.divider}` : 'none',
            }}>
              <Video size={20} color={theme.colors.blue} />
              <span style={{ fontSize: '14px', fontWeight: 500, color: colors.text, flex: 1 }}>{room}</span>
              <Button variant="ghost" size="sm">Settings</Button>
            </div>
          ))}
        </Card>
      )}

      {/* Journeys */}
      {section.journeys && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <Button variant="primary" size="md" icon={<Plus size={16} />}>Create Journey</Button>
          </div>
          <Card hover={false} style={{ overflow: 'hidden' }}>
            {section.journeys.map((j, i) => (
              <div key={i} style={{
                padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px',
                borderBottom: i < section.journeys.length - 1 ? `1px solid ${colors.divider}` : 'none',
              }}>
                <MapPin size={20} color={theme.colors.blue} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>{j.name}</div>
                  <div style={{ fontSize: '12px', color: colors.textSecondary }}>{j.steps} steps</div>
                </div>
                <span style={{
                  fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: theme.radii.full,
                  backgroundColor: j.status === 'Active' ? theme.colors.successMuted : theme.colors.warningMuted,
                  color: j.status === 'Active' ? theme.colors.success : theme.colors.warning,
                }}>{j.status}</span>
              </div>
            ))}
          </Card>
        </>
      )}

      {/* Workflows */}
      {section.workflows && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <Button variant="primary" size="md" icon={<Plus size={16} />}>Create Workflow</Button>
          </div>
          <Card hover={false} style={{ overflow: 'hidden' }}>
            {section.workflows.map((w, i) => (
              <div key={i} style={{
                padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px',
                borderBottom: i < section.workflows.length - 1 ? `1px solid ${colors.divider}` : 'none',
              }}>
                <GitBranch size={20} color={theme.colors.blue} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>{w.name}</div>
                  <div style={{ fontSize: '12px', color: colors.textSecondary }}>{w.triggers} triggers</div>
                </div>
                <span style={{
                  fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: theme.radii.full,
                  backgroundColor: theme.colors.successMuted, color: theme.colors.success,
                }}>{w.status}</span>
              </div>
            ))}
          </Card>
        </>
      )}

      {/* Functions */}
      {section.functions && (
        <Card hover={false} style={{ overflow: 'hidden' }}>
          {section.functions.map((f, i) => (
            <div key={i} style={{
              padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px',
              borderBottom: i < section.functions.length - 1 ? `1px solid ${colors.divider}` : 'none',
            }}>
              <Code size={20} color={theme.colors.blue} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>{f.name}</div>
                <div style={{ fontSize: '12px', color: colors.textSecondary }}>{f.type}</div>
              </div>
              <span style={{
                fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: theme.radii.full,
                backgroundColor: theme.colors.successMuted, color: theme.colors.success,
              }}>{f.status}</span>
            </div>
          ))}
        </Card>
      )}

      {/* Chatbots */}
      {section.bots && (
        <Card hover={false} style={{ overflow: 'hidden' }}>
          {section.bots.map((bot, i) => (
            <div key={i} style={{
              padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px',
              borderBottom: i < section.bots.length - 1 ? `1px solid ${colors.divider}` : 'none',
            }}>
              <Zap size={20} color={theme.colors.purple} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>{bot.name}</div>
                <div style={{ fontSize: '12px', color: colors.textSecondary }}>{bot.conversations.toLocaleString()} conversations</div>
              </div>
              <span style={{
                fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: theme.radii.full,
                backgroundColor: theme.colors.successMuted, color: theme.colors.success,
              }}>{bot.status}</span>
            </div>
          ))}
        </Card>
      )}

      {/* SMS status */}
      {section.status && typeof section.status === 'string' && (
        <Card hover={false} style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <MessageSquare size={24} color={theme.colors.blue} />
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: colors.text }}>10DLC Registration</div>
              <div style={{ fontSize: '13px', color: colors.textSecondary }}>Your SMS registration status</div>
            </div>
            <span style={{
              fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: theme.radii.full,
              backgroundColor: theme.colors.successMuted, color: theme.colors.success, marginLeft: 'auto',
            }}>{section.status}</span>
          </div>
        </Card>
      )}
    </div>
  );
}

export default function AdminPage({ setActiveNav }) {
  const [activeSection, setActiveSection] = useState('home');
  const [expandedSections, setExpandedSections] = useState({
    account: true, peopleAI: true, nextIQ: true, manage: true, channels: true, nextStudio: true,
  });
  const [hovered, setHovered] = useState(null);
  const [canvasAction, setCanvasAction] = useState(null);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [creatingGoal, setCreatingGoal] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [customGoals, setCustomGoals] = useState([]);
  const [goalOverrides, setGoalOverrides] = useState({});
  const [deletedGoalIds, setDeletedGoalIds] = useState([]);
  const [creatingGuardrail, setCreatingGuardrail] = useState(false);
  const [editingGuardrailId, setEditingGuardrailId] = useState(null);
  const [customGuardrails, setCustomGuardrails] = useState([]);
  const [guardrailOverrides, setGuardrailOverrides] = useState({});
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const mainRef = useRef(null);

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navigateToSection = (id) => {
    setActiveSection(id);
    if (id !== 'nextiqGoals') setSelectedGoalId(null);
    setCreatingGoal(false);
    setEditingGoalId(null);
    setCreatingGuardrail(false);
    setEditingGuardrailId(null);
    if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    const allItems = Object.values(sectionDefinitions).flatMap((s) => s.items);
    const item = allItems.find((i) => i.id === id);
    if (item) {
      for (const [key, section] of Object.entries(sectionDefinitions)) {
        if (section.items.find((i) => i.id === id) && !expandedSections[key]) {
          setExpandedSections((prev) => ({ ...prev, [key]: true }));
        }
      }
    }
  };

  const allGoals = useMemo(() => {
    const base = NEXTIQ_GOALS.filter(g => !deletedGoalIds.includes(g.id)).map(g => goalOverrides[g.id] || g);
    const custom = customGoals.filter(g => !deletedGoalIds.includes(g.id)).map(g => goalOverrides[g.id] || g);
    return [...base, ...custom];
  }, [customGoals, goalOverrides, deletedGoalIds]);

  const handleToggleGoal = (goalId) => {
    const goal = allGoals.find(g => g.id === goalId);
    if (!goal) return;
    const updated = { ...goal, status: goal.status === 'active' ? 'paused' : 'active' };
    setGoalOverrides(prev => ({ ...prev, [goalId]: updated }));
  };

  const handleDeleteGoal = (goalId) => {
    setDeletedGoalIds(prev => [...prev, goalId]);
    if (selectedGoalId === goalId) setSelectedGoalId(null);
  };

  const handleSaveGoalEdit = (goalData) => {
    setGoalOverrides(prev => ({ ...prev, [goalData.id]: goalData }));
    setEditingGoalId(null);
    setSelectedGoalId(goalData.id);
  };

  const allGuardrails = useMemo(() => {
    const base = NEXTIQ_GUARDRAILS.map(g => guardrailOverrides[g.id] || g);
    const custom = customGuardrails.map(g => guardrailOverrides[g.id] || g);
    return [...base, ...custom];
  }, [customGuardrails, guardrailOverrides]);

  const handleSaveGuardrailEdit = (grData) => {
    setGuardrailOverrides(prev => ({ ...prev, [grData.id]: grData }));
    setEditingGuardrailId(null);
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 68px)' }}>
      {/* Left sidebar nav */}
      <aside
        style={{
          width: '220px',
          backgroundColor: colors.surface,
          borderRight: `1px solid ${colors.borderLight}`,
          padding: '20px 0',
          flexShrink: 0,
          overflowY: 'auto',
        }}
      >
        {/* Admin Home */}
        <div style={{ padding: '0 12px', marginBottom: '16px' }}>
          <button
            onClick={() => setActiveSection('home')}
            onMouseEnter={() => setHovered('admin-home')}
            onMouseLeave={() => setHovered(null)}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px 12px', borderRadius: theme.radii.md, border: 'none',
              backgroundColor: activeSection === 'home' ? colors.sidebarActive
                : hovered === 'admin-home' ? colors.sidebarHover : 'transparent',
              color: activeSection === 'home' ? theme.colors.blue : colors.text,
              fontSize: '14px', fontWeight: 600, fontFamily: theme.fonts.body,
              cursor: 'pointer', transition: theme.transitions.fast, textAlign: 'left',
            }}
          >
            <Settings size={16} />
            Admin Home
          </button>
        </div>

        {/* Sections */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 12px' }}>
          {Object.entries(sectionDefinitions).map(([key, section]) => (
            <div key={key}>
              {/* Section header */}
              <button
                onClick={() => toggleSection(key)}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '6px 12px', borderRadius: theme.radii.sm, border: 'none',
                  backgroundColor: 'transparent', cursor: 'pointer',
                  transition: theme.transitions.fast,
                }}
              >
                <span style={{
                  fontSize: '11px', fontWeight: 600,
                  color: colors.textSecondary,
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                  fontFamily: theme.fonts.body,
                }}>
                  {section.title}
                </span>
                {expandedSections[key] ? (
                  <ChevronDown size={14} color={colors.textTertiary} />
                ) : (
                  <ChevronRight size={14} color={colors.textTertiary} />
                )}
              </button>

              {/* Section items */}
              {expandedSections[key] && (
                <div style={{ marginTop: '4px' }}>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    const isHov = hovered === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigateToSection(item.id)}
                        onMouseEnter={() => setHovered(item.id)}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                          width: '100%',
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '8px 12px', borderRadius: theme.radii.md, border: 'none',
                          backgroundColor: isActive ? colors.sidebarActive
                            : isHov ? colors.sidebarHover : 'transparent',
                          color: isActive ? theme.colors.blue : colors.text,
                          fontSize: '13px', fontWeight: isActive ? 600 : 500,
                          fontFamily: theme.fonts.body, cursor: 'pointer',
                          transition: theme.transitions.fast, textAlign: 'left',
                        }}
                      >
                        <Icon size={16} color={isActive ? theme.colors.blue : colors.textSecondary} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      {activeSection === 'actionsBuilder' && canvasAction ? (
        <ActionCanvas
          action={canvasAction}
          onBack={() => setCanvasAction(null)}
        />
      ) : (
        <main ref={mainRef} style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          {activeSection === 'nextiqEngine' ? (
            <NextIQEngine onNavigateToGoal={(id) => { setSelectedGoalId(id); setActiveSection('nextiqGoals'); }} onNavigateToGoals={() => { setSelectedGoalId(null); setActiveSection('nextiqGoals'); }} onNavigateToGuardrails={() => setActiveSection('nextiqGuardrails')} />
          ) : activeSection === 'nextiqGoals' && creatingGoal ? (
            <NextIQGoalCreate
              onBack={() => setCreatingGoal(false)}
              onSave={(goal) => { setCustomGoals(prev => [...prev, goal]); setCreatingGoal(false); }}
            />
          ) : activeSection === 'nextiqGoals' && editingGoalId ? (
            <NextIQGoalCreate
              editGoal={allGoals.find(g => g.id === editingGoalId)}
              onBack={() => { setEditingGoalId(null); setSelectedGoalId(editingGoalId); }}
              onSave={handleSaveGoalEdit}
            />
          ) : activeSection === 'nextiqGoals' && selectedGoalId ? (
            <NextIQGoalDetail goalId={selectedGoalId} onBack={() => setSelectedGoalId(null)} onEdit={(id) => setEditingGoalId(id)} allGoals={allGoals} />
          ) : activeSection === 'nextiqGoals' ? (
            <NextIQGoals onSelectGoal={(id) => setSelectedGoalId(id)} onCreateGoal={() => setCreatingGoal(true)} onToggleGoal={handleToggleGoal} onDeleteGoal={handleDeleteGoal} allGoals={allGoals} />
          ) : activeSection === 'nextiqGuardrails' && creatingGuardrail ? (
            <NextIQGuardrailCreate
              onBack={() => setCreatingGuardrail(false)}
              onSave={(gr) => { setCustomGuardrails(prev => [...prev, gr]); setCreatingGuardrail(false); }}
              allGoals={allGoals}
            />
          ) : activeSection === 'nextiqGuardrails' && editingGuardrailId ? (
            <NextIQGuardrailCreate
              editGuardrail={allGuardrails.find(g => g.id === editingGuardrailId)}
              onBack={() => setEditingGuardrailId(null)}
              onSave={handleSaveGuardrailEdit}
              allGoals={allGoals}
            />
          ) : activeSection === 'nextiqGuardrails' ? (
            <NextIQGuardrails
              onCreateGuardrail={() => setCreatingGuardrail(true)}
              onEditGuardrail={(id) => setEditingGuardrailId(id)}
              allGuardrails={allGuardrails}
            />
          ) : activeSection === 'nextiqPlaybooks' ? (
            <NextIQPlaybooks />
          ) : activeSection === 'actionsBuilder' ? (
            <ActionsBuilder onOpenCanvas={(action) => setCanvasAction(action)} />
          ) : activeSection === 'coachingRules' ? (
            <CoachingRulesBuilder />
          ) : activeSection === 'supervisorDashboard' ? (
            <SupervisorDashboard />
          ) : (
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            {activeSection === 'home' ? (
              <AdminHome navigateToSection={navigateToSection} />
            ) : (
              <SectionContent sectionId={activeSection} />
            )}
          </div>
          )}
        </main>
      )}
    </div>
  );
}
