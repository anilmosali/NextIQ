import { useState } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import {
  Search, Star, CheckCircle, Download, ChevronRight,
  Code2, ExternalLink, Filter,
} from 'lucide-react';

const categories = [
  { id: 'all', label: 'All', count: 20 },
  { id: 'crm', label: 'CRM', count: 7 },
  { id: 'email', label: 'Email', count: 2 },
  { id: 'calendar', label: 'Calendar', count: 1 },
  { id: 'messaging', label: 'Messaging', count: 4 },
  { id: 'ecommerce', label: 'E-commerce', count: 1 },
  { id: 'support', label: 'Support & Helpdesk', count: 1 },
  { id: 'productivity', label: 'Productivity', count: 2 },
  { id: 'social', label: 'Social Media', count: 2 },
];

const allIntegrations = [
  { id: 1, name: 'Salesforce', category: 'crm', desc: 'Sync leads, contacts, and opportunities with your CRM.', rating: 4.8, installs: '12K+', installed: true, color: '#00A1E0', pricing: null, featured: true },
  { id: 2, name: 'HubSpot', category: 'crm', desc: 'Connect HubSpot CRM for seamless customer data sync.', rating: 4.6, installs: '9K+', installed: true, color: '#FF7A59', pricing: null, featured: true },
  { id: 3, name: 'Pipedrive', category: 'crm', desc: 'Manage your sales pipeline and deals from Nextiva.', rating: 4.4, installs: '3K+', installed: false, color: '#017737', pricing: 'Paid' },
  { id: 4, name: 'Microsoft Dynamics 365', category: 'crm', desc: 'Enterprise CRM integration for contacts and cases.', rating: 4.3, installs: '5K+', installed: false, color: '#002050', pricing: 'Paid', featured: true },
  { id: 5, name: 'Keap', category: 'crm', desc: 'Small business CRM and marketing automation.', rating: 4.1, installs: '1.5K+', installed: false, color: '#4DB848', pricing: 'Free' },
  { id: 6, name: 'NetSuite', category: 'crm', desc: 'Cloud ERP with CRM for enterprise workflows.', rating: 4.2, installs: '2K+', installed: false, color: '#1E3A5F', pricing: 'Paid' },
  { id: 7, name: 'Freshsales', category: 'crm', desc: 'AI-powered CRM for high-velocity sales teams.', rating: 4.3, installs: '2.5K+', installed: false, color: '#F26522', pricing: 'Paid' },
  { id: 8, name: 'Gmail', category: 'email', desc: 'Send and receive Gmail directly within Nextiva.', rating: 4.7, installs: '18K+', installed: true, color: '#EA4335', pricing: null, featured: true },
  { id: 9, name: 'Microsoft Outlook', category: 'email', desc: 'Integrate Outlook email and calendar seamlessly.', rating: 4.5, installs: '14K+', installed: false, color: '#0078D4', pricing: 'Free', featured: true },
  { id: 10, name: 'Google Calendar', category: 'calendar', desc: 'Sync meetings and events with Google Calendar.', rating: 4.6, installs: '10K+', installed: false, color: '#4285F4', pricing: null },
  { id: 11, name: 'Slack', category: 'messaging', desc: 'Send notifications and updates to Slack channels.', rating: 4.7, installs: '15K+', installed: true, color: '#4A154B', pricing: null, featured: true },
  { id: 12, name: 'Microsoft Teams', category: 'messaging', desc: 'Integrate calling and messaging with Teams.', rating: 4.5, installs: '11K+', installed: false, color: '#6264A7', pricing: 'Free', featured: true },
  { id: 13, name: 'WhatsApp Business', category: 'messaging', desc: 'Engage customers via WhatsApp Business API.', rating: 4.4, installs: '6K+', installed: false, color: '#25D366', pricing: 'Paid' },
  { id: 14, name: 'Telegram', category: 'messaging', desc: 'Connect Telegram for customer messaging.', rating: 4.2, installs: '2K+', installed: false, color: '#0088CC', pricing: 'Free' },
  { id: 15, name: 'Shopify', category: 'ecommerce', desc: 'View order history and customer data from Shopify.', rating: 4.5, installs: '4K+', installed: false, color: '#96BF48', pricing: 'Paid' },
  { id: 16, name: 'Freshdesk', category: 'support', desc: 'Create and manage support tickets from conversations.', rating: 4.3, installs: '3K+', installed: false, color: '#49C9A7', pricing: 'Free' },
  { id: 17, name: 'Google Contacts', category: 'productivity', desc: 'Sync contacts between Nextiva and Google.', rating: 4.4, installs: '7K+', installed: false, color: '#4285F4', pricing: 'Free' },
  { id: 18, name: 'Facebook', category: 'social', desc: 'Manage Facebook messages and pages from Nextiva.', rating: 4.2, installs: '5K+', installed: false, color: '#1877F2', pricing: 'Free' },
  { id: 19, name: 'Instagram', category: 'social', desc: 'Respond to Instagram DMs and comments.', rating: 4.1, installs: '4K+', installed: false, color: '#E4405F', pricing: 'Free' },
  { id: 20, name: 'Microsoft 365', category: 'productivity', desc: 'Full Microsoft 365 productivity suite integration.', rating: 4.5, installs: '8K+', installed: false, color: '#D83B01', pricing: 'Free' },
];

function StarRating({ rating }) {
  const full = Math.floor(rating);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={12}
          fill={i < full ? '#F59E0B' : 'none'}
          color={i < full ? '#F59E0B' : '#D1D0CE'}
          strokeWidth={i < full ? 0 : 1.5}
        />
      ))}
    </span>
  );
}

export default function IntegrationsPage() {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const [activeTab, setActiveTab] = useState('discover');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchText, setSearchText] = useState('');

  const featured = allIntegrations.filter((i) => i.featured);

  const filtered = allIntegrations.filter((i) => {
    if (activeTab === 'installed' && !i.installed) return false;
    if (activeCategory !== 'all' && i.category !== activeCategory) return false;
    if (searchText && !i.name.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  const renderCard = (item, isFeatured = false) => (
    <div
      key={item.id + (isFeatured ? '-f' : '')}
      style={{
        backgroundColor: colors.surface, borderRadius: theme.radii.lg,
        border: `1px solid ${colors.border}`, padding: '20px',
        boxShadow: colors.cardShadow,
        display: 'flex', flexDirection: 'column',
        minWidth: isFeatured ? '220px' : undefined,
        transition: theme.transitions.fast,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
        <div style={{
          width: '42px', height: '42px', borderRadius: theme.radii.lg,
          backgroundColor: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '17px', fontWeight: 700, color: '#fff', flexShrink: 0,
        }}>
          {item.name.charAt(0)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '14px', fontWeight: 600, color: colors.text,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{item.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <StarRating rating={item.rating} />
            <span style={{ fontSize: '11px', color: colors.textSecondary }}>{item.rating}</span>
          </div>
        </div>
      </div>
      <p style={{
        fontSize: '12px', color: colors.textSecondary, lineHeight: 1.5,
        margin: '0 0 14px', flex: 1,
      }}>{item.desc}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11px', color: colors.textTertiary }}>
          <Download size={11} style={{ marginRight: '3px', verticalAlign: '-1px' }} />
          {item.installs}
        </span>
        {item.installed ? (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontSize: '11px', fontWeight: 600, color: theme.colors.success,
            backgroundColor: colors.successMuted, padding: '3px 10px',
            borderRadius: theme.radii.full,
          }}>
            <CheckCircle size={12} />
            Installed
          </span>
        ) : (
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontSize: '12px', fontWeight: 600, color: theme.colors.blue,
            backgroundColor: theme.colors.blueMuted, padding: '5px 14px',
            borderRadius: theme.radii.full, border: 'none', cursor: 'pointer',
            fontFamily: theme.fonts.body, transition: theme.transitions.fast,
          }}>
            {item.pricing && (
              <span style={{
                fontSize: '10px', fontWeight: 700, color: item.pricing === 'Paid' ? theme.colors.warning : theme.colors.success,
                marginRight: '2px',
              }}>
                {item.pricing}
              </span>
            )}
            Install
          </button>
        )}
      </div>
    </div>
  );

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
          {/* Tabs */}
          <div style={{
            display: 'flex', gap: '2px', padding: '2px',
            backgroundColor: colors.surfaceHover, borderRadius: theme.radii.md,
            marginBottom: '24px',
          }}>
            {['Discover', 'Installed'].map((tab) => {
              const tabId = tab.toLowerCase();
              const active = activeTab === tabId;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tabId)}
                  style={{
                    flex: 1, padding: '7px 12px', borderRadius: theme.radii.sm,
                    border: 'none', fontSize: '13px', fontWeight: 600,
                    fontFamily: theme.fonts.body, cursor: 'pointer',
                    backgroundColor: active ? colors.surface : 'transparent',
                    color: active ? colors.text : colors.textSecondary,
                    boxShadow: active ? theme.shadows.xs : 'none',
                    transition: theme.transitions.fast,
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Categories */}
          <div style={{
            fontSize: '11px', fontWeight: 700, color: colors.textSecondary,
            textTransform: 'uppercase', letterSpacing: '0.08em',
            padding: '0 8px', marginBottom: '10px',
          }}>Categories</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {categories.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: '8px 12px', borderRadius: theme.radii.md, border: 'none',
                    backgroundColor: active ? colors.sidebarActive : 'transparent',
                    color: active ? theme.colors.blue : colors.text,
                    fontSize: '13px', fontWeight: active ? 600 : 400,
                    fontFamily: theme.fonts.body, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    textAlign: 'left', width: '100%',
                    transition: theme.transitions.fast,
                  }}
                >
                  <span>{cat.label}</span>
                  <span style={{
                    fontSize: '11px', fontWeight: 600,
                    color: active ? theme.colors.blue : colors.textTertiary,
                    backgroundColor: active ? `${theme.colors.blue}15` : colors.surfaceHover,
                    padding: '1px 7px', borderRadius: theme.radii.full,
                  }}>{cat.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Build CTA */}
        <div style={{ padding: '16px' }}>
          <div style={{
            padding: '20px 16px', borderRadius: theme.radii.lg,
            background: `linear-gradient(135deg, ${theme.colors.blue}12, ${theme.colors.purple}12)`,
            border: `1px solid ${colors.borderLight}`, textAlign: 'center',
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: theme.radii.md,
              backgroundColor: `${theme.colors.blue}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 10px',
            }}>
              <Code2 size={18} color={theme.colors.blue} />
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: colors.text, marginBottom: '4px' }}>
              Build an Integration
            </div>
            <p style={{ fontSize: '11px', color: colors.textSecondary, margin: '0 0 12px', lineHeight: 1.4 }}>
              Create custom integrations with our API
            </p>
            <button style={{
              padding: '7px 16px', borderRadius: theme.radii.md,
              border: `1px solid ${theme.colors.blue}`, backgroundColor: 'transparent',
              color: theme.colors.blue, fontSize: '12px', fontWeight: 600,
              fontFamily: theme.fonts.body, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              transition: theme.transitions.fast,
            }}>
              Get Started
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{
              fontFamily: theme.fonts.heading, fontSize: '26px', fontWeight: 700,
              color: colors.text, margin: '0 0 4px',
            }}>Marketplace</h1>
            <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>
              Discover and manage integrations
            </p>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '32px' }}>
            <Search size={16} color={colors.textTertiary} style={{
              position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
            }} />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search integrations..."
              style={{
                width: '100%', padding: '11px 16px 11px 40px', fontSize: '14px',
                fontFamily: theme.fonts.body, border: `1px solid ${colors.border}`,
                borderRadius: theme.radii.lg, color: colors.text,
                backgroundColor: colors.inputBackground, outline: 'none',
                boxSizing: 'border-box', transition: theme.transitions.fast,
              }}
            />
          </div>

          {/* Featured Integrations */}
          {activeTab === 'discover' && activeCategory === 'all' && !searchText && (
            <div style={{ marginBottom: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 style={{
                  fontFamily: theme.fonts.heading, fontSize: '18px', fontWeight: 700,
                  color: colors.text, margin: 0,
                }}>Featured Integrations</h2>
              </div>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '14px',
              }}>
                {featured.map((item) => renderCard(item, true))}
              </div>
            </div>
          )}

          {/* All Integrations */}
          <div>
            <h2 style={{
              fontFamily: theme.fonts.heading, fontSize: '18px', fontWeight: 700,
              color: colors.text, margin: '0 0 16px',
            }}>
              {activeTab === 'installed' ? 'Installed Integrations' : `All Integrations (${filtered.length})`}
            </h2>
            {filtered.length === 0 ? (
              <div style={{
                padding: '60px 24px', textAlign: 'center',
                backgroundColor: colors.surfaceHover, borderRadius: theme.radii.lg,
              }}>
                <Search size={32} color={colors.textTertiary} style={{ marginBottom: '12px' }} />
                <div style={{ fontSize: '15px', fontWeight: 600, color: colors.text, marginBottom: '4px' }}>
                  No integrations found
                </div>
                <div style={{ fontSize: '13px', color: colors.textSecondary }}>
                  Try a different search term or category.
                </div>
              </div>
            ) : (
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '14px',
              }}>
                {filtered.map((item) => renderCard(item))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
