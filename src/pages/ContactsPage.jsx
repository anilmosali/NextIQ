import { useState } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import { contacts } from '../data/contacts';
import {
  Search, Plus, Filter, Grid, List, UserPlus, Upload,
  Phone, Mail, MessageSquare, MoreHorizontal, Star,
  MapPin, Building, Briefcase, ChevronRight, X,
} from 'lucide-react';

export default function ContactsPage() {
  const [view, setView] = useState('list');
  const [searchText, setSearchText] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [hovered, setHovered] = useState(null);
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchText.toLowerCase()) ||
    c.company.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 68px)' }}>
      {/* Main content */}
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontFamily: theme.fonts.heading, fontSize: '28px', fontWeight: 700, color: colors.text, margin: '0 0 8px' }}>Contacts</h1>
              <p style={{ fontSize: '15px', color: colors.textSecondary, margin: 0 }}>{contacts.length} contacts</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="secondary" size="md" icon={<Upload size={16} />}>Import</Button>
              <Button variant="primary" size="md" icon={<UserPlus size={16} />}>Add Contact</Button>
            </div>
          </div>

          {/* Search and filters */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
              <Search size={16} color={theme.colors.gray400} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search contacts..."
                style={{
                  width: '100%', padding: '10px 14px 10px 42px', fontSize: '14px',
                  fontFamily: theme.fonts.body, border: `1px solid ${colors.border}`,
                  borderRadius: theme.radii.lg, color: colors.text,
                  backgroundColor: colors.inputBackground, outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
            <Button variant="secondary" size="md" icon={<Filter size={14} />}>Filter</Button>
            <div style={{ display: 'flex', gap: '2px', padding: '2px', backgroundColor: colors.surfaceHover, borderRadius: theme.radii.md }}>
              {[
                { id: 'list', icon: List },
                { id: 'grid', icon: Grid },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setView(v.id)}
                  style={{
                    width: '32px', height: '32px', borderRadius: theme.radii.sm, border: 'none',
                    backgroundColor: view === v.id ? colors.surface : 'transparent',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: view === v.id ? theme.shadows.xs : 'none',
                  }}
                >
                  <v.icon size={16} color={view === v.id ? colors.text : colors.textSecondary} />
                </button>
              ))}
            </div>
          </div>

          {/* Contact list */}
          {view === 'list' ? (
            <Card hover={false} style={{ overflow: 'hidden' }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr auto',
                padding: '12px 24px', backgroundColor: colors.surfaceHover,
                borderBottom: `1px solid ${colors.border}`,
              }}>
                {['Name', 'Company', 'Role', 'Tags', ''].map((h, i) => (
                  <span key={i} style={{ fontSize: '11px', fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
                ))}
              </div>
              {filtered.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  onMouseEnter={() => setHovered(contact.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr auto',
                    padding: '16px 24px', alignItems: 'center',
                    borderBottom: `1px solid ${colors.divider}`,
                    backgroundColor: selectedContact?.id === contact.id ? colors.sidebarActive : hovered === contact.id ? colors.surfaceHover : 'transparent',
                    cursor: 'pointer', transition: theme.transitions.fast,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar name={contact.name} size={40} gradient={contact.gradient} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>{contact.name}</div>
                      <div style={{ fontSize: '12px', color: colors.textSecondary }}>{contact.email}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '14px', color: colors.text }}>{contact.company}</span>
                  <span style={{ fontSize: '13px', color: colors.textSecondary }}>{contact.role}</span>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {contact.tags.map((tag) => (
                      <span key={tag} style={{
                        fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: theme.radii.full,
                        backgroundColor: tag === 'VIP' ? theme.colors.warningMuted : tag === 'Enterprise' ? theme.colors.blueMuted : theme.colors.successMuted,
                        color: tag === 'VIP' ? theme.colors.warning : tag === 'Enterprise' ? theme.colors.blue : theme.colors.success,
                      }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button style={{ width: '28px', height: '28px', borderRadius: theme.radii.sm, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Phone size={14} color={colors.textSecondary} />
                    </button>
                    <button style={{ width: '28px', height: '28px', borderRadius: theme.radii.sm, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Mail size={14} color={colors.textSecondary} />
                    </button>
                    <button style={{ width: '28px', height: '28px', borderRadius: theme.radii.sm, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MessageSquare size={14} color={colors.textSecondary} />
                    </button>
                  </div>
                </div>
              ))}
            </Card>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {filtered.map((contact) => (
                <Card key={contact.id} onClick={() => setSelectedContact(contact)} style={{ padding: '24px', textAlign: 'center' }}>
                  <Avatar name={contact.name} size={64} gradient={contact.gradient} />
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: colors.text, marginBottom: '4px' }}>{contact.name}</div>
                    <div style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: '4px' }}>{contact.role}</div>
                    <div style={{ fontSize: '13px', color: colors.textSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <Building size={12} /> {contact.company}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '12px', flexWrap: 'wrap' }}>
                    {contact.tags.map((tag) => (
                      <span key={tag} style={{
                        fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: theme.radii.full,
                        backgroundColor: tag === 'VIP' ? theme.colors.warningMuted : tag === 'Enterprise' ? theme.colors.blueMuted : theme.colors.successMuted,
                        color: tag === 'VIP' ? theme.colors.warning : tag === 'Enterprise' ? theme.colors.blue : theme.colors.success,
                      }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
                    <Button variant="ghost" size="sm" icon={<Phone size={14} />} />
                    <Button variant="ghost" size="sm" icon={<Mail size={14} />} />
                    <Button variant="ghost" size="sm" icon={<MessageSquare size={14} />} />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact detail panel */}
      {selectedContact && (
        <div style={{
          width: '360px', borderLeft: `1px solid ${colors.border}`,
          backgroundColor: colors.surface, padding: '24px', overflowY: 'auto',
        }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button onClick={() => setSelectedContact(null)} style={{
              width: '32px', height: '32px', borderRadius: theme.radii.md, border: 'none',
              backgroundColor: colors.surfaceHover, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <X size={16} color={colors.textSecondary} />
            </button>
          </div>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <Avatar name={selectedContact.name} size={80} gradient={selectedContact.gradient} />
            </div>
            <h3 style={{ fontFamily: theme.fonts.heading, fontSize: '20px', fontWeight: 700, color: colors.text, margin: '0 0 4px' }}>{selectedContact.name}</h3>
            <p style={{ fontSize: '14px', color: colors.textSecondary, margin: '0 0 4px' }}>{selectedContact.role}</p>
            <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Building size={14} /> {selectedContact.company}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
            <Button variant="primary" size="sm" icon={<Phone size={14} />}>Call</Button>
            <Button variant="secondary" size="sm" icon={<Mail size={14} />}>Email</Button>
            <Button variant="secondary" size="sm" icon={<MessageSquare size={14} />}>Chat</Button>
          </div>
          <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '20px' }}>
            {[
              { icon: Mail, label: 'Email', value: selectedContact.email },
              { icon: Phone, label: 'Phone', value: selectedContact.phone },
              { icon: Briefcase, label: 'Role', value: selectedContact.role },
              { icon: Building, label: 'Company', value: selectedContact.company },
            ].map((field, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: `1px solid ${colors.divider}` }}>
                <field.icon size={16} color={colors.textSecondary} />
                <div>
                  <div style={{ fontSize: '11px', color: colors.textTertiary, marginBottom: '2px' }}>{field.label}</div>
                  <div style={{ fontSize: '14px', color: colors.text }}>{field.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
