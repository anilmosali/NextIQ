import { useState } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import { Building2, Search, Plus, ExternalLink, MapPin, Users, DollarSign, ChevronRight } from 'lucide-react';

const accounts = [
  { id: 1, name: 'Acme Corp', industry: 'Technology', contacts: 12, revenue: '$2.4M', status: 'Active', health: 'Good', location: 'San Francisco, CA', gradient: ['#6366F1', '#8B5CF6'] },
  { id: 2, name: 'Meridian Technologies', industry: 'SaaS', contacts: 8, revenue: '$1.8M', status: 'Active', health: 'At Risk', location: 'Austin, TX', gradient: ['#EC4899', '#F43F5E'] },
  { id: 3, name: 'Brightwave Corp', industry: 'Finance', contacts: 15, revenue: '$5.2M', status: 'Active', health: 'Good', location: 'New York, NY', gradient: ['#14B8A6', '#10B981'] },
  { id: 4, name: 'Flexport', industry: 'Logistics', contacts: 6, revenue: '$890K', status: 'Active', health: 'Good', location: 'San Francisco, CA', gradient: ['#F59E0B', '#EAB308'] },
  { id: 5, name: 'DirectBuy', industry: 'E-commerce', contacts: 4, revenue: '$620K', status: 'Inactive', health: 'Churned', location: 'Chicago, IL', gradient: ['#6B7280', '#9CA3AF'] },
  { id: 6, name: 'Erewhon', industry: 'Retail', contacts: 3, revenue: '$450K', status: 'Active', health: 'Good', location: 'Los Angeles, CA', gradient: ['#0EA5E9', '#3B82F6'] },
  { id: 7, name: 'Okafor Logistics', industry: 'Transportation', contacts: 5, revenue: '$1.1M', status: 'Active', health: 'Good', location: 'Houston, TX', gradient: ['#8B5CF6', '#A855F7'] },
  { id: 8, name: 'Titan Solar Power', industry: 'Energy', contacts: 7, revenue: '$3.6M', status: 'Active', health: 'Good', location: 'Phoenix, AZ', gradient: ['#F97316', '#FB923C'] },
];

const healthColors = { 'Good': '#10B981', 'At Risk': '#F59E0B', 'Churned': '#EF4444' };

export default function AccountsPage() {
  const [searchText, setSearchText] = useState('');
  const [hoveredId, setHoveredId] = useState(null);
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  const filtered = accounts.filter(a => a.name.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 32px 16px', borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, fontFamily: theme.fonts.body }}>Accounts</h1>
          <p style={{ fontSize: '14px', color: colors.textSecondary, margin: '4px 0 0' }}>{filtered.length} accounts</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={16} color={colors.textSecondary} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="Search accounts..." style={{ width: '100%', padding: '8px 12px 8px 36px', border: `1px solid ${colors.border}`, borderRadius: theme.radii.md, backgroundColor: colors.inputBackground, color: colors.text, fontSize: '14px', fontFamily: theme.fonts.body, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: theme.colors.blue, color: '#fff', border: 'none', borderRadius: theme.radii.md, cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: theme.fonts.body }}>
            <Plus size={16} /> Add Account
          </button>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {filtered.map(account => (
            <div
              key={account.id}
              onMouseEnter={() => setHoveredId(account.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                backgroundColor: colors.cardBackground,
                border: `1px solid ${hoveredId === account.id ? theme.colors.blue + '40' : colors.border}`,
                borderRadius: theme.radii.lg,
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: hoveredId === account.id ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: theme.radii.md, background: `linear-gradient(135deg, ${account.gradient[0]}, ${account.gradient[1]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 700 }}>
                  {account.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: colors.text }}>{account.name}</div>
                  <div style={{ fontSize: '12px', color: colors.textSecondary }}>{account.industry}</div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: theme.radii.full, backgroundColor: healthColors[account.health] + '18', color: healthColors[account.health] }}>
                  {account.health}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: colors.textSecondary }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={13} /> {account.location}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={13} /> {account.contacts}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><DollarSign size={13} /> {account.revenue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
