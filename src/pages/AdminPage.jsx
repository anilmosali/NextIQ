import { useState, useEffect, useRef } from 'react';
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
  BookOpen, Download, Upload, RefreshCw, Star, Clock, Wrench,
} from 'lucide-react';
import ActionsBuilder from '../components/ActionsBuilder';
import ActionCanvas from '../components/ActionCanvas';

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
      { id: 'actionsBuilder', label: 'Actions Builder', icon: Wrench },
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
    account: true, peopleAI: true, manage: true, channels: true, nextStudio: true,
  });
  const [hovered, setHovered] = useState(null);
  const [canvasAction, setCanvasAction] = useState(null);
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const mainRef = useRef(null);

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navigateToSection = (id) => {
    setActiveSection(id);
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
                  fontSize: '11px', fontWeight: 600, color: colors.textSecondary,
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                  fontFamily: theme.fonts.body,
                }}>{section.title}</span>
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
          {activeSection === 'actionsBuilder' ? (
            <ActionsBuilder onOpenCanvas={(action) => setCanvasAction(action)} />
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
