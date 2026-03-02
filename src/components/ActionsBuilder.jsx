import { useState } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import {
  Plus, Search, User, CreditCard, Receipt, RotateCcw, Undo2,
  Mail, CalendarPlus, PackageCheck, BarChart3, Settings2,
  Zap, ChevronDown, ChevronRight, MoreHorizontal, Copy, Trash2, Edit,
  Power,
} from 'lucide-react';

const ACTION_CATEGORIES = [
  {
    id: 'account',
    label: 'Account Management',
    color: '#0062B8',
    actions: [
      { id: 'fetch-account', name: 'Fetch Account Details', icon: User, description: 'Retrieve customer account info from CRM/database', status: 'active' },
      { id: 'check-subscription', name: 'Check Subscription Details', icon: PackageCheck, description: 'Look up plan type, renewal date, and entitlements', status: 'active' },
      { id: 'check-usage', name: 'Check Usage Details', icon: BarChart3, description: 'Fetch API usage, call minutes, storage consumption', status: 'active' },
      { id: 'modify-plan', name: 'Modify Plan', icon: Settings2, description: 'Upgrade, downgrade, or change subscription plan', status: 'active' },
    ],
  },
  {
    id: 'billing',
    label: 'Billing & Payments',
    color: '#8B5CF6',
    actions: [
      { id: 'check-credit-card', name: 'Check Credit Card Details', icon: CreditCard, description: 'Retrieve payment method on file (masked)', status: 'active' },
      { id: 'check-transaction', name: 'Check Transaction Details', icon: Receipt, description: 'Look up a specific transaction or invoice', status: 'active' },
      { id: 'refund-customer', name: 'Refund Customer', icon: RotateCcw, description: 'Process a full or partial refund to customer', status: 'active' },
      { id: 'revert-transaction', name: 'Revert a Transaction', icon: Undo2, description: 'Void or reverse a pending/completed transaction', status: 'active' },
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    color: '#10B981',
    actions: [
      { id: 'trigger-email', name: 'Trigger Email', icon: Mail, description: 'Send a templated or custom email to customer', status: 'active' },
      { id: 'schedule-calendar', name: 'Schedule / Modify Calendar Invite', icon: CalendarPlus, description: 'Create, update, or cancel a calendar meeting', status: 'active' },
    ],
  },
];

const ALL_ACTIONS = ACTION_CATEGORIES.flatMap(cat =>
  cat.actions.map(a => ({ ...a, category: cat.label, categoryColor: cat.color }))
);

export { ACTION_CATEGORIES, ALL_ACTIONS };

export default function ActionsBuilder({ onOpenCanvas }) {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const [searchText, setSearchText] = useState('');
  const [expandedCats, setExpandedCats] = useState(new Set(ACTION_CATEGORIES.map(c => c.id)));
  const [hoveredAction, setHoveredAction] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newActionName, setNewActionName] = useState('');
  const [newActionDesc, setNewActionDesc] = useState('');
  const [enabledActions, setEnabledActions] = useState(() => {
    const map = {};
    ACTION_CATEGORIES.forEach(cat => cat.actions.forEach(a => { map[a.id] = a.status === 'active'; }));
    return map;
  });
  const toggleEnabled = (actionId) => setEnabledActions(prev => ({ ...prev, [actionId]: !prev[actionId] }));

  const toggleCat = (id) => {
    setExpandedCats(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = searchText.trim()
    ? ACTION_CATEGORIES.map(cat => ({
        ...cat,
        actions: cat.actions.filter(a =>
          a.name.toLowerCase().includes(searchText.toLowerCase()) ||
          a.description.toLowerCase().includes(searchText.toLowerCase())
        ),
      })).filter(cat => cat.actions.length > 0)
    : ACTION_CATEGORIES;

  const inputStyle = {
    width: '100%', padding: '9px 14px 9px 36px',
    border: `1px solid ${colors.inputBorder}`, borderRadius: theme.radii.md,
    fontSize: '13px', fontFamily: theme.fonts.body,
    backgroundColor: colors.inputBackground, color: colors.text,
    outline: 'none', transition: theme.transitions.fast,
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <h1 style={{ fontFamily: theme.fonts.heading, fontSize: '28px', fontWeight: 700, color: colors.text, margin: '0 0 6px' }}>
              Actions Builder
            </h1>
            <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>
              Pre-built and custom action templates for the NextIQ agentic engine. Actions are tools and functions that NextIQ uses to perform tasks on behalf of agents.
            </p>
          </div>
          <button
            onClick={() => { setNewActionName(''); setNewActionDesc(''); setShowCreateModal(true); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0,
              padding: '8px 16px', borderRadius: theme.radii.md,
              border: 'none', backgroundColor: theme.colors.blue, color: '#fff',
              fontSize: '13px', fontWeight: 600, fontFamily: theme.fonts.body,
              cursor: 'pointer', transition: theme.transitions.fast, whiteSpace: 'nowrap',
            }}
          >
            <Plus size={15} /> New Action
          </button>
        </div>
      </div>

      {/* Stats banner */}
      <div style={{
        marginBottom: '20px', padding: '12px 16px', borderRadius: theme.radii.lg,
        backgroundColor: theme.colors.blueMuted, border: `1px solid ${theme.colors.blue}20`,
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <Zap size={16} color={theme.colors.blue} />
        <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>
          {ALL_ACTIONS.length} actions available
        </span>
        <span style={{ fontSize: '12px', color: colors.textSecondary }}>
          across {ACTION_CATEGORIES.length} categories. NextIQ engine uses these to power Next Best Actions in real time.
        </span>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '24px', maxWidth: '400px' }}>
        <Search size={15} color={colors.textTertiary} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          placeholder="Search actions..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={inputStyle}
          onFocus={e => { e.target.style.borderColor = colors.inputBorderFocus; }}
          onBlur={e => { e.target.style.borderColor = colors.inputBorder; }}
        />
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filtered.map(cat => (
          <div key={cat.id}>
            {/* Category header */}
            <button
              onClick={() => toggleCat(cat.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '0 0 10px', border: 'none', background: 'none',
                cursor: 'pointer', width: '100%', textAlign: 'left',
              }}
            >
              <div style={{ width: '4px', height: '18px', borderRadius: '2px', backgroundColor: cat.color }} />
              <span style={{ fontSize: '14px', fontWeight: 700, color: colors.text, fontFamily: theme.fonts.body }}>
                {cat.label}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: colors.textTertiary, backgroundColor: colors.surfaceHover, padding: '2px 8px', borderRadius: theme.radii.full }}>
                {cat.actions.length}
              </span>
              <span style={{ marginLeft: 'auto' }}>
                {expandedCats.has(cat.id) ? <ChevronDown size={14} color={colors.textTertiary} /> : <ChevronRight size={14} color={colors.textTertiary} />}
              </span>
            </button>

            {/* Action cards grid */}
            {expandedCats.has(cat.id) && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                {cat.actions.map(action => {
                  const Icon = action.icon;
                  const isHovered = hoveredAction === action.id;
                  const isEnabled = enabledActions[action.id] === true;
                  return (
                    <div
                      key={action.id}
                      onMouseEnter={() => setHoveredAction(action.id)}
                      onMouseLeave={() => { setHoveredAction(null); setMenuOpen(null); }}
                      style={{
                        padding: '16px', borderRadius: theme.radii.lg,
                        border: `1px solid ${isHovered ? cat.color + '60' : colors.border}`,
                        backgroundColor: isHovered ? cat.color + '06' : colors.surface,
                        cursor: 'pointer', transition: theme.transitions.fast,
                        position: 'relative',
                        opacity: isEnabled ? 1 : 0.55,
                      }}
                      onClick={() => onOpenCanvas({ ...action, category: cat.label, categoryColor: cat.color })}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: theme.radii.md,
                          backgroundColor: cat.color + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <Icon size={18} color={cat.color} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>{action.name}</span>
                            <span style={{
                              fontSize: '10px', fontWeight: 600, padding: '1px 6px', borderRadius: theme.radii.full,
                              backgroundColor: isEnabled ? theme.colors.successMuted : theme.colors.errorMuted,
                              color: isEnabled ? theme.colors.success : theme.colors.error,
                            }}>
                              {isEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                          <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0, lineHeight: 1.4 }}>
                            {action.description}
                          </p>
                        </div>
                      </div>

                      {/* Enable / Disable toggle */}
                      <div
                        onClick={e => { e.stopPropagation(); toggleEnabled(action.id); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          marginTop: '10px', paddingTop: '10px',
                          borderTop: `1px solid ${colors.borderLight}`,
                        }}
                      >
                        <div style={{
                          width: '32px', height: '18px', borderRadius: '9px',
                          backgroundColor: isEnabled ? theme.colors.success : colors.textTertiary,
                          position: 'relative', cursor: 'pointer', transition: theme.transitions.fast, flexShrink: 0,
                        }}>
                          <div style={{
                            width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#fff',
                            position: 'absolute', top: '2px',
                            left: isEnabled ? '16px' : '2px',
                            transition: theme.transitions.fast, boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                          }} />
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: isEnabled ? theme.colors.success : colors.textTertiary }}>
                          {isEnabled ? 'Available to NextIQ' : 'Hidden from NextIQ'}
                        </span>
                      </div>

                      {/* Action menu */}
                      {isHovered && (
                        <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '4px' }}>
                          <button
                            onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === action.id ? null : action.id); }}
                            style={{
                              width: '26px', height: '26px', borderRadius: theme.radii.sm,
                              border: `1px solid ${colors.border}`, backgroundColor: colors.surface,
                              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          >
                            <MoreHorizontal size={13} color={colors.textSecondary} />
                          </button>
                          {menuOpen === action.id && (
                            <div style={{
                              position: 'absolute', top: '30px', right: 0, zIndex: 10,
                              backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
                              borderRadius: theme.radii.md, boxShadow: theme.shadows.dropdown,
                              padding: '4px', minWidth: '140px',
                            }}>
                              {[
                                { icon: Edit, label: 'Edit', action: () => onOpenCanvas({ ...action, category: cat.label, categoryColor: cat.color }) },
                                { icon: Copy, label: 'Duplicate' },
                                { icon: Trash2, label: 'Delete', color: theme.colors.error },
                              ].map(item => (
                                <button
                                  key={item.label}
                                  onClick={e => { e.stopPropagation(); item.action?.(); setMenuOpen(null); }}
                                  style={{
                                    width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '7px 10px', border: 'none', borderRadius: theme.radii.sm,
                                    backgroundColor: 'transparent', cursor: 'pointer',
                                    fontSize: '12px', fontWeight: 500, fontFamily: theme.fonts.body,
                                    color: item.color || colors.text, transition: theme.transitions.fast,
                                    textAlign: 'left',
                                  }}
                                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = colors.surfaceHover; }}
                                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                >
                                  <item.icon size={13} /> {item.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* (stats banner moved to top) */}

      {/* Create New Action Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(2,18,44,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{
            backgroundColor: colors.surface, borderRadius: theme.radii.xl, boxShadow: theme.shadows.modal,
            width: '100%', maxWidth: '520px', overflow: 'hidden',
          }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${colors.border}` }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text, margin: 0, fontFamily: theme.fonts.heading }}>Create New Action</h2>
              <p style={{ fontSize: '13px', color: colors.textSecondary, margin: '6px 0 0' }}>
                Define a name and description for this tool. NextIQ engine uses the description to decide when and how to invoke it.
              </p>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: colors.text, marginBottom: '6px' }}>
                  Action Name <span style={{ color: theme.colors.error }}>*</span>
                </label>
                <input
                  value={newActionName}
                  onChange={e => setNewActionName(e.target.value)}
                  placeholder="e.g. Check Account Rate Limits"
                  autoFocus
                  style={{
                    width: '100%', padding: '10px 14px', border: `1px solid ${colors.inputBorder}`,
                    borderRadius: theme.radii.md, fontSize: '14px', fontFamily: theme.fonts.body,
                    backgroundColor: colors.inputBackground, color: colors.text, outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.target.style.borderColor = colors.inputBorderFocus; }}
                  onBlur={e => { e.target.style.borderColor = colors.inputBorder; }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: colors.text, marginBottom: '6px' }}>
                  Tool Description <span style={{ color: theme.colors.error }}>*</span>
                </label>
                <textarea
                  value={newActionDesc}
                  onChange={e => setNewActionDesc(e.target.value)}
                  placeholder="Describe what this action does, when it should be used, and what inputs it needs. NextIQ uses this to match customer intents to available tools."
                  rows={4}
                  style={{
                    width: '100%', padding: '10px 14px', border: `1px solid ${colors.inputBorder}`,
                    borderRadius: theme.radii.md, fontSize: '13px', fontFamily: theme.fonts.body,
                    backgroundColor: colors.inputBackground, color: colors.text, outline: 'none',
                    resize: 'vertical', lineHeight: 1.5, boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.target.style.borderColor = colors.inputBorderFocus; }}
                  onBlur={e => { e.target.style.borderColor = colors.inputBorder; }}
                />
                <p style={{ fontSize: '11px', color: colors.textTertiary, margin: '6px 0 0' }}>
                  A clear description helps NextIQ decide when to suggest this action as an NBA.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '14px 24px', borderTop: `1px solid ${colors.border}`, backgroundColor: colors.surfaceHover }}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  padding: '8px 18px', borderRadius: theme.radii.md, fontSize: '13px', fontWeight: 600,
                  border: `1px solid ${colors.border}`, backgroundColor: 'transparent', color: colors.text,
                  cursor: 'pointer', fontFamily: theme.fonts.body,
                }}
              >Cancel</button>
              <button
                disabled={!newActionName.trim() || !newActionDesc.trim()}
                onClick={() => {
                  setShowCreateModal(false);
                  onOpenCanvas({
                    id: 'new-' + Date.now(),
                    name: newActionName.trim(),
                    description: newActionDesc.trim(),
                    nodes: [], edges: [], isNew: true,
                  });
                }}
                style={{
                  padding: '8px 18px', borderRadius: theme.radii.md, fontSize: '13px', fontWeight: 600,
                  border: 'none', color: '#fff', cursor: 'pointer', fontFamily: theme.fonts.body,
                  backgroundColor: (!newActionName.trim() || !newActionDesc.trim()) ? colors.textTertiary : theme.colors.blue,
                  opacity: (!newActionName.trim() || !newActionDesc.trim()) ? 0.6 : 1,
                }}
              >Create & Open Builder</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
