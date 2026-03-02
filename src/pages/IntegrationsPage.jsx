import { useState } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/Card';
import Button from '../components/Button';
import {
  Search, Grid, Zap, Briefcase, MessageSquare, BarChart3,
  TrendingUp, Users, Package, CheckCircle, Plus, ExternalLink,
  Sparkles,
} from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Apps', icon: Grid, count: 97 },
  { id: 'ai-agents', label: 'AI Agents', icon: Sparkles, count: 50 },
  { id: 'crm', label: 'CRM & Sales', icon: Briefcase, count: 12 },
  { id: 'communication', label: 'Communication', icon: MessageSquare, count: 8 },
  { id: 'productivity', label: 'Productivity', icon: Zap, count: 9 },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, count: 6 },
  { id: 'marketing', label: 'Marketing', icon: TrendingUp, count: 7 },
  { id: 'support', label: 'Support', icon: Users, count: 5 },
];

const integrations = [
  { id: 1, name: 'Salesforce', category: 'crm', description: 'Sync contacts, log calls, and manage deals directly from Nextiva.', installed: true, color: '#00A1E0', letter: 'S' },
  { id: 2, name: 'HubSpot', category: 'crm', description: 'Connect your HubSpot CRM for seamless customer data sync.', installed: true, color: '#FF7A59', letter: 'H' },
  { id: 3, name: 'Slack', category: 'communication', description: 'Send notifications and updates directly to Slack channels.', installed: true, color: '#4A154B', letter: 'S' },
  { id: 4, name: 'Microsoft Teams', category: 'communication', description: 'Integrate calling and messaging with Microsoft Teams.', installed: false, color: '#6264A7', letter: 'T' },
  { id: 5, name: 'Zendesk', category: 'support', description: 'Create and manage Zendesk tickets from conversations.', installed: true, color: '#03363D', letter: 'Z' },
  { id: 6, name: 'Zapier', category: 'productivity', description: 'Automate workflows with thousands of app integrations.', installed: false, color: '#FF4F00', letter: 'Z' },
  { id: 7, name: 'Google Workspace', category: 'productivity', description: 'Connect Google Calendar, Contacts, and Gmail.', installed: true, color: '#4285F4', letter: 'G' },
  { id: 8, name: 'Shopify', category: 'crm', description: 'View order history and customer data from Shopify.', installed: false, color: '#96BF48', letter: 'S' },
  { id: 9, name: 'Mailchimp', category: 'marketing', description: 'Sync contacts and trigger email campaigns automatically.', installed: false, color: '#FFE01B', letter: 'M' },
  { id: 10, name: 'Power BI', category: 'analytics', description: 'Visualize Nextiva data with Power BI dashboards.', installed: false, color: '#F2C811', letter: 'P' },
  { id: 11, name: 'Pipedrive', category: 'crm', description: 'Manage your sales pipeline with Pipedrive integration.', installed: false, color: '#017737', letter: 'P' },
  { id: 12, name: 'Intercom', category: 'support', description: 'Connect Intercom for unified customer messaging.', installed: false, color: '#1F8DED', letter: 'I' },
];

export default function IntegrationsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('discover');
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  const filtered = integrations.filter((int) => {
    if (activeTab === 'my-addons' && !int.installed) return false;
    if (activeCategory !== 'all' && int.category !== activeCategory) return false;
    if (searchText && !int.name.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: theme.fonts.heading, fontSize: '28px', fontWeight: 700, color: colors.text, margin: '0 0 8px' }}>Integrations</h1>
        <p style={{ fontSize: '15px', color: colors.textSecondary, margin: 0 }}>Connect your favorite tools and supercharge your workflow</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
        {[
          { id: 'discover', label: 'Discover', icon: Search },
          { id: 'my-addons', label: 'My Add-ons', icon: Package, badge: integrations.filter((i) => i.installed).length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px', borderRadius: theme.radii.lg, border: 'none',
              backgroundColor: activeTab === tab.id ? theme.colors.blueMuted : 'transparent',
              color: activeTab === tab.id ? theme.colors.blue : colors.textSecondary,
              fontSize: '14px', fontWeight: 600, fontFamily: theme.fonts.body, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px', transition: theme.transitions.fast,
            }}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.badge && (
              <span style={{
                fontSize: '11px', fontWeight: 700, padding: '1px 7px', borderRadius: theme.radii.full,
                backgroundColor: activeTab === tab.id ? theme.colors.blue : colors.surfaceHover,
                color: activeTab === tab.id ? theme.colors.white : colors.textSecondary,
              }}>{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '32px' }}>
        {/* Sidebar categories */}
        <div style={{ width: '220px', flexShrink: 0 }}>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search size={14} color={theme.colors.gray400} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search apps..."
              style={{
                width: '100%', padding: '8px 12px 8px 34px', fontSize: '13px',
                fontFamily: theme.fonts.body, border: `1px solid ${colors.border}`,
                borderRadius: theme.radii.md, color: colors.text,
                backgroundColor: colors.inputBackground, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '8px 12px', borderRadius: theme.radii.md, border: 'none',
                  backgroundColor: activeCategory === cat.id ? colors.sidebarActive : 'transparent',
                  color: activeCategory === cat.id ? theme.colors.blue : colors.text,
                  fontSize: '13px', fontWeight: 500, fontFamily: theme.fonts.body, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left',
                  transition: theme.transitions.fast, width: '100%',
                }}
              >
                <cat.icon size={16} />
                <span style={{ flex: 1 }}>{cat.label}</span>
                <span style={{ fontSize: '11px', color: colors.textSecondary }}>{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Integration grid */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {filtered.map((int) => (
              <Card key={int.id} style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: theme.radii.lg,
                    backgroundColor: int.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', fontWeight: 700, color: '#fff',
                  }}>{int.letter}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: colors.text }}>{int.name}</div>
                    {int.installed && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <CheckCircle size={12} color={theme.colors.success} />
                        <span style={{ fontSize: '11px', color: theme.colors.success, fontWeight: 600 }}>Installed</span>
                      </div>
                    )}
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: colors.textSecondary, lineHeight: 1.5, margin: '0 0 16px' }}>{int.description}</p>
                <Button
                  variant={int.installed ? 'ghost' : 'secondary'}
                  size="sm"
                  icon={int.installed ? <ExternalLink size={14} /> : <Plus size={14} />}
                  style={{ width: '100%' }}
                >
                  {int.installed ? 'Configure' : 'Install'}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
