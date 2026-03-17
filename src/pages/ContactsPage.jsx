import { useState } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import { contacts } from '../data/contacts';
import {
  Search, Grid, List, UserPlus, Phone, Mail, MessageSquare,
  Building, Briefcase, X, FileText, Clock, Star,
} from 'lucide-react';

const tagColors = {
  VIP: { bg: 'rgba(139, 92, 246, 0.1)', text: '#8B5CF6' },
  Enterprise: { bg: 'rgba(0, 98, 184, 0.1)', text: '#0062B8' },
  Scaling: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981' },
  Support: { bg: 'rgba(249, 115, 22, 0.1)', text: '#F97316' },
};

const defaultTag = { bg: 'rgba(107, 114, 128, 0.1)', text: '#6B7280' };

const activities = [
  { icon: Mail, text: 'Email sent regarding account review', time: '2 hours ago', color: '#3B82F6' },
  { icon: Phone, text: 'Inbound call — 12 min', time: '1 day ago', color: '#10B981' },
  { icon: MessageSquare, text: 'Chat conversation about onboarding', time: '3 days ago', color: '#8B5CF6' },
  { icon: FileText, text: 'Contract document shared', time: '1 week ago', color: '#F59E0B' },
  { icon: Star, text: 'Marked as VIP contact', time: '2 weeks ago', color: '#EAB308' },
];

export default function ContactsPage() {
  const [view, setView] = useState('list');
  const [searchText, setSearchText] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const getTagColor = (tag) => tagColors[tag] || defaultTag;

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(searchText.toLowerCase()) ||
    c.company.toLowerCase().includes(searchText.toLowerCase()) ||
    c.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderAvatar = (contact, size) => (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: contact.gradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 700, color: '#FFFFFF', flexShrink: 0,
      letterSpacing: '0.5px',
    }}>
      {getInitials(contact.name)}
    </div>
  );

  const renderTags = (tags) => (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {tags.map(tag => {
        const tc = getTagColor(tag);
        return (
          <span key={tag} style={{
            fontSize: 10, fontWeight: 600, padding: '2px 8px',
            borderRadius: theme.radii.full, backgroundColor: tc.bg, color: tc.text,
          }}>{tag}</span>
        );
      })}
    </div>
  );

  const iconBtn = (Icon, onClick) => (
    <button
      onClick={onClick}
      style={{
        width: 32, height: 32, borderRadius: theme.radii.md, border: `1px solid ${colors.border}`,
        backgroundColor: colors.surface, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: theme.transitions.fast,
      }}
    >
      <Icon size={14} color={colors.textSecondary} />
    </button>
  );

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 68px)', backgroundColor: colors.background }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 24, flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <h1 style={{
              fontFamily: theme.fonts.heading, fontSize: 24, fontWeight: 700,
              color: colors.text, margin: '0 0 4px',
            }}>Contacts</h1>
            <p style={{ fontSize: 14, color: colors.textSecondary, margin: 0 }}>
              {filtered.length} contact{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px',
            fontSize: 13, fontFamily: theme.fonts.body, fontWeight: 600,
            border: 'none', borderRadius: theme.radii.lg,
            backgroundColor: theme.colors.blue, color: '#FFFFFF', cursor: 'pointer',
          }}>
            <UserPlus size={15} />
            Add Contact
          </button>
        </div>

        <div style={{
          display: 'flex', gap: 10, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap',
        }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
            <Search size={15} color={colors.textTertiary} style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            }} />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search contacts..."
              style={{
                width: '100%', padding: '8px 12px 8px 36px', fontSize: 13,
                fontFamily: theme.fonts.body, border: `1px solid ${colors.border}`,
                borderRadius: theme.radii.lg, color: colors.text,
                backgroundColor: colors.inputBackground, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{
            display: 'flex', gap: 2, padding: 3,
            backgroundColor: colors.surfaceHover, borderRadius: theme.radii.md,
          }}>
            {[
              { id: 'list', Icon: List },
              { id: 'grid', Icon: Grid },
            ].map(v => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                style={{
                  width: 32, height: 32, borderRadius: theme.radii.sm, border: 'none',
                  backgroundColor: view === v.id ? colors.surface : 'transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: view === v.id ? theme.shadows.xs : 'none',
                  transition: theme.transitions.fast,
                }}
              >
                <v.Icon size={16} color={view === v.id ? colors.text : colors.textSecondary} />
              </button>
            ))}
          </div>
        </div>

        {view === 'list' ? (
          <div style={{
            backgroundColor: colors.surface, borderRadius: theme.radii.lg,
            border: `1px solid ${colors.border}`, overflow: 'hidden',
            boxShadow: colors.cardShadow,
          }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr auto',
              padding: '10px 24px', backgroundColor: colors.surfaceHover,
              borderBottom: `1px solid ${colors.border}`,
            }}>
              {['Name', 'Company', 'Role', 'Tags', ''].map((h, i) => (
                <span key={i} style={{
                  fontSize: 11, fontWeight: 600, color: colors.textTertiary,
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>{h}</span>
              ))}
            </div>

            {filtered.map((contact, idx) => {
              const isSelected = selectedContact?.id === contact.id;
              const isHovered = hoveredId === contact.id;
              return (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  onMouseEnter={() => setHoveredId(contact.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr auto',
                    padding: '14px 24px', alignItems: 'center',
                    borderBottom: idx < filtered.length - 1 ? `1px solid ${colors.divider}` : 'none',
                    backgroundColor: isSelected ? colors.sidebarActive : isHovered ? colors.surfaceHover : 'transparent',
                    cursor: 'pointer', transition: theme.transitions.fast,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {renderAvatar(contact, 36)}
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{contact.name}</div>
                      <div style={{ fontSize: 12, color: colors.textSecondary }}>{contact.email}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Building size={13} color={colors.textTertiary} />
                    <span style={{ fontSize: 13, color: colors.text }}>{contact.company}</span>
                  </div>
                  <span style={{ fontSize: 13, color: colors.textSecondary }}>{contact.role}</span>
                  {renderTags(contact.tags)}
                  <div style={{ display: 'flex', gap: 4 }}>
                    {iconBtn(Phone)}
                    {iconBtn(Mail)}
                    {iconBtn(MessageSquare)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16,
          }}>
            {filtered.map(contact => {
              const isSelected = selectedContact?.id === contact.id;
              const isHovered = hoveredId === contact.id;
              return (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  onMouseEnter={() => setHoveredId(contact.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    backgroundColor: colors.surface, borderRadius: theme.radii.lg,
                    border: `1px solid ${isSelected ? theme.colors.blue : colors.border}`,
                    padding: 24, textAlign: 'center', cursor: 'pointer',
                    boxShadow: isHovered ? theme.shadows.md : colors.cardShadow,
                    transition: theme.transitions.base,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
                    {renderAvatar(contact, 56)}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: colors.text, marginBottom: 2 }}>
                    {contact.name}
                  </div>
                  <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>
                    {contact.role}
                  </div>
                  <div style={{
                    fontSize: 12, color: colors.textSecondary,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                    marginBottom: 12,
                  }}>
                    <Building size={12} /> {contact.company}
                  </div>
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
                    {renderTags(contact.tags)}
                  </div>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                    {iconBtn(Phone)}
                    {iconBtn(Mail)}
                    {iconBtn(MessageSquare)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedContact && (
        <div style={{
          width: 360, minWidth: 360,
          borderLeft: `1px solid ${colors.border}`,
          backgroundColor: colors.surface, overflowY: 'auto',
        }}>
          <div style={{ padding: '20px 24px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button
                onClick={() => setSelectedContact(null)}
                style={{
                  width: 30, height: 30, borderRadius: theme.radii.md, border: 'none',
                  backgroundColor: colors.surfaceHover, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={15} color={colors.textSecondary} />
              </button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
                {renderAvatar(selectedContact, 72)}
              </div>
              <h3 style={{
                fontFamily: theme.fonts.heading, fontSize: 20, fontWeight: 700,
                color: colors.text, margin: '0 0 4px',
              }}>{selectedContact.name}</h3>
              <p style={{
                fontSize: 14, color: colors.textSecondary, margin: '0 0 2px',
              }}>{selectedContact.role}</p>
              <p style={{
                fontSize: 13, color: colors.textTertiary, margin: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              }}>
                <Building size={13} /> {selectedContact.company}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
              {[
                { Icon: Phone, label: 'Call', primary: true },
                { Icon: Mail, label: 'Email', primary: false },
                { Icon: MessageSquare, label: 'Chat', primary: false },
              ].map(action => (
                <button key={action.label} style={{
                  display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px',
                  fontSize: 13, fontFamily: theme.fonts.body, fontWeight: 600,
                  borderRadius: theme.radii.lg, cursor: 'pointer',
                  border: action.primary ? 'none' : `1px solid ${colors.border}`,
                  backgroundColor: action.primary ? theme.colors.blue : colors.surface,
                  color: action.primary ? '#FFFFFF' : colors.text,
                }}>
                  <action.Icon size={14} />
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{
            borderTop: `1px solid ${colors.border}`,
            padding: '20px 24px',
          }}>
            {[
              { icon: Mail, label: 'Email', value: selectedContact.email },
              { icon: Phone, label: 'Phone', value: selectedContact.phone },
              { icon: Briefcase, label: 'Role', value: selectedContact.role },
              { icon: Building, label: 'Company', value: selectedContact.company },
            ].map((field, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12, padding: '11px 0',
                borderBottom: `1px solid ${colors.divider}`,
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: theme.radii.md,
                  backgroundColor: colors.surfaceHover,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <field.icon size={14} color={colors.textSecondary} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: colors.textTertiary, marginBottom: 2 }}>{field.label}</div>
                  <div style={{ fontSize: 14, color: colors.text, wordBreak: 'break-word' }}>{field.value}</div>
                </div>
              </div>
            ))}
          </div>

          {selectedContact.tags.length > 0 && (
            <div style={{
              borderTop: `1px solid ${colors.border}`,
              padding: '16px 24px',
            }}>
              <div style={{
                fontSize: 11, fontWeight: 600, color: colors.textTertiary,
                textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10,
              }}>Tags</div>
              {renderTags(selectedContact.tags)}
            </div>
          )}

          <div style={{
            borderTop: `1px solid ${colors.border}`,
            padding: '16px 24px',
          }}>
            <div style={{
              fontSize: 11, fontWeight: 600, color: colors.textTertiary,
              textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 14,
            }}>Activity</div>

            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 14, top: 0, bottom: 0,
                width: 1, backgroundColor: colors.divider,
              }} />

              {activities.map((activity, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 14, marginBottom: i < activities.length - 1 ? 18 : 0,
                  position: 'relative',
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    backgroundColor: `${activity.color}14`,
                    border: `2px solid ${colors.surface}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, position: 'relative', zIndex: 1,
                  }}>
                    <activity.icon size={12} color={activity.color} />
                  </div>
                  <div style={{ paddingTop: 2 }}>
                    <div style={{ fontSize: 13, color: colors.text, marginBottom: 2 }}>
                      {activity.text}
                    </div>
                    <div style={{
                      fontSize: 12, color: colors.textTertiary,
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      <Clock size={11} />
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
