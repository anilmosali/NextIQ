import { useState, useMemo } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import {
  Plus, Search, Zap, ChevronDown, ChevronRight, MoreHorizontal, Copy, Trash2, Edit,
  Wrench, Package, Download, X, Check, LayoutGrid, List, Filter,
} from 'lucide-react';
import { ALL_ACTIONS as CONFIG_ACTIONS } from '../data/nextiqConfig';

const PLATFORM_TEMPLATES = [
  { id: 'tpl-fetch-account', name: 'Fetch Account Details', category: 'Account Management', type: 'READ', description: 'Retrieve customer account info from CRM/database', canvasId: 'fetch-account' },
  { id: 'tpl-check-subscription', name: 'Check Subscription Details', category: 'Account Management', type: 'READ', description: 'Look up plan type, renewal date, and entitlements', canvasId: 'check-subscription' },
  { id: 'tpl-check-usage', name: 'Check Usage Details', category: 'Account Management', type: 'READ', description: 'Fetch API usage, call minutes, storage consumption', canvasId: 'check-usage' },
  { id: 'tpl-modify-plan', name: 'Modify Plan', category: 'Account Management', type: 'WRITE', description: 'Upgrade, downgrade, or change subscription plan', canvasId: 'modify-plan' },
  { id: 'tpl-check-credit-card', name: 'Check Credit Card Details', category: 'Billing & Payments', type: 'READ', description: 'Retrieve payment method on file (masked)', canvasId: 'check-credit-card' },
  { id: 'tpl-check-transaction', name: 'Check Transaction Details', category: 'Billing & Payments', type: 'READ', description: 'Look up a specific transaction or invoice', canvasId: 'check-transaction' },
  { id: 'tpl-refund-customer', name: 'Refund Customer', category: 'Billing & Payments', type: 'WRITE', description: 'Process a full or partial refund to customer', canvasId: 'refund-customer' },
  { id: 'tpl-revert-transaction', name: 'Revert a Transaction', category: 'Billing & Payments', type: 'WRITE', description: 'Void or reverse a pending/completed transaction', canvasId: 'revert-transaction' },
  { id: 'tpl-trigger-email', name: 'Trigger Email', category: 'Communication', type: 'WRITE', description: 'Send a templated or custom email to customer', canvasId: 'trigger-email' },
  { id: 'tpl-schedule-calendar', name: 'Schedule / Modify Calendar Invite', category: 'Communication', type: 'WRITE', description: 'Create, update, or cancel a calendar meeting', canvasId: 'schedule-calendar' },
];

const CATEGORY_COLORS = {
  'Account Management': '#0062B8',
  'Billing & Payments': '#8B5CF6',
  'Onboarding': '#10B981',
  'Technical': '#6366F1',
  'System': '#F59E0B',
  'Communication': '#EC4899',
};
const COLOR_PALETTE = ['#0062B8', '#8B5CF6', '#10B981', '#6366F1', '#F59E0B', '#EC4899', '#14B8A6', '#EF4444', '#0891B2', '#A855F7'];

function getCategoryColor(cat) {
  if (CATEGORY_COLORS[cat]) return CATEGORY_COLORS[cat];
  let hash = 0;
  for (let i = 0; i < cat.length; i++) hash = cat.charCodeAt(i) + ((hash << 5) - hash);
  return COLOR_PALETTE[Math.abs(hash) % COLOR_PALETTE.length];
}

export { PLATFORM_TEMPLATES };

export default function ActionsBuilder({ onOpenCanvas }) {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  const [customActions, setCustomActions] = useState([]);
  const [importedIds, setImportedIds] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [expandedCats, setExpandedCats] = useState(new Set());
  const [hoveredAction, setHoveredAction] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');

  const [newActionName, setNewActionName] = useState('');
  const [newActionDesc, setNewActionDesc] = useState('');
  const [newActionCategory, setNewActionCategory] = useState('');
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [editingAction, setEditingAction] = useState(null);
  const [actionOverrides, setActionOverrides] = useState({});
  const [importingTemplate, setImportingTemplate] = useState(null);

  const [enabledActions, setEnabledActions] = useState(() => {
    const map = {};
    CONFIG_ACTIONS.forEach(a => { map[a.id] = true; });
    return map;
  });
  const toggleEnabled = (actionId) => setEnabledActions(prev => ({ ...prev, [actionId]: !prev[actionId] }));

  const allActions = useMemo(() =>
    [...CONFIG_ACTIONS, ...customActions].map(a => actionOverrides[a.id] ? { ...a, ...actionOverrides[a.id] } : a),
    [customActions, actionOverrides],
  );
  const existingCategories = useMemo(() => [...new Set(allActions.map(a => a.category))].sort(), [allActions]);

  const grouped = useMemo(() => {
    const map = {};
    let list = allActions;
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      list = list.filter(a => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
    }
    if (filterCategory !== 'all') list = list.filter(a => a.category === filterCategory);
    if (filterStatus === 'enabled') list = list.filter(a => enabledActions[a.id] !== false);
    if (filterStatus === 'disabled') list = list.filter(a => enabledActions[a.id] === false);
    list.forEach(a => {
      const cat = a.category || 'Uncategorized';
      if (!map[cat]) map[cat] = [];
      map[cat].push(a);
    });
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  }, [allActions, searchText, filterCategory, filterStatus, enabledActions]);

  if (expandedCats.size === 0 && grouped.length > 0) {
    const initial = new Set(grouped.map(([cat]) => cat));
    if (initial.size > 0) setTimeout(() => setExpandedCats(initial), 0);
  }

  const toggleCat = (cat) => {
    setExpandedCats(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const handleCreateAction = () => {
    const newAction = {
      id: `custom-${Date.now()}`,
      name: newActionName.trim(),
      description: newActionDesc.trim(),
      category: newActionCategory.trim() || 'Custom',
    };
    setCustomActions(prev => [...prev, newAction]);
    setEnabledActions(prev => ({ ...prev, [newAction.id]: true }));
    setShowCreateModal(false);
    onOpenCanvas({ ...newAction, isNew: true });
  };

  const openEditModal = (action) => {
    setEditingAction(action);
    setNewActionName(action.name);
    setNewActionDesc(action.description || '');
    setNewActionCategory(action.category || '');
    setShowCreateModal(true);
    setMenuOpen(null);
  };

  const handleSaveEdit = () => {
    const updates = {
      name: newActionName.trim(),
      description: newActionDesc.trim(),
      category: newActionCategory.trim() || editingAction.category,
    };
    const isCustom = customActions.some(a => a.id === editingAction.id);
    if (isCustom) {
      setCustomActions(prev => prev.map(a => a.id === editingAction.id ? { ...a, ...updates } : a));
    } else {
      setActionOverrides(prev => ({ ...prev, [editingAction.id]: updates }));
    }
    setShowCreateModal(false);
    setEditingAction(null);
  };

  const startImportTemplate = (tpl) => {
    setShowTemplates(false);
    setImportingTemplate(tpl);
    setNewActionName(tpl.name);
    setNewActionDesc(tpl.description);
    setNewActionCategory(tpl.category);
    setEditingAction(null);
    setShowCreateModal(true);
  };

  const handleConfirmImport = () => {
    const trimmedName = newActionName.trim();
    const id = `import-${Date.now()}`;
    const imported = {
      id,
      name: trimmedName,
      description: newActionDesc.trim(),
      category: newActionCategory.trim() || importingTemplate.category,
    };
    setCustomActions(prev => [...prev, imported]);
    setEnabledActions(prev => ({ ...prev, [id]: false }));
    setImportedIds(prev => [...prev, importingTemplate.id]);
    setShowCreateModal(false);
    setShowTemplates(false);
    setImportingTemplate(null);
    onOpenCanvas({ ...imported, isNew: true });
  };

  const nameConflict = newActionName.trim() && allActions.some(a => a.name.toLowerCase() === newActionName.trim().toLowerCase());

  const filteredTemplates = PLATFORM_TEMPLATES.filter(t =>
    !templateSearch || t.name.toLowerCase().includes(templateSearch.toLowerCase()) || t.category.toLowerCase().includes(templateSearch.toLowerCase())
  );
  const templateGroups = useMemo(() => {
    const map = {};
    filteredTemplates.forEach(t => {
      if (!map[t.category]) map[t.category] = [];
      map[t.category].push(t);
    });
    return Object.entries(map);
  }, [filteredTemplates]);

  const filteredSuggestions = existingCategories.filter(c =>
    c.toLowerCase().includes(newActionCategory.toLowerCase())
  );

  const inputStyle = {
    width: '100%', padding: '9px 14px',
    border: `1px solid ${colors.inputBorder}`, borderRadius: theme.radii.md,
    fontSize: '13px', fontFamily: theme.fonts.body,
    backgroundColor: colors.inputBackground, color: colors.text,
    outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <h1 style={{ fontFamily: theme.fonts.heading, fontSize: '28px', fontWeight: 700, color: colors.text, margin: '0 0 6px' }}>
              Actions
            </h1>
            <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>
              Tools and functions that NextIQ uses to perform tasks on behalf of agents. Manage configured actions or import from platform templates.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
            <button
              onClick={() => { setTemplateSearch(''); setShowTemplates(true); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: theme.radii.md,
                border: `1px solid ${colors.border}`, backgroundColor: 'transparent', color: colors.text,
                fontSize: '13px', fontWeight: 600, fontFamily: theme.fonts.body,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              <Package size={15} /> Platform Templates
            </button>
            <button
              onClick={() => { setNewActionName(''); setNewActionDesc(''); setNewActionCategory(''); setEditingAction(null); setImportingTemplate(null); setShowCreateModal(true); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: theme.radii.md,
                border: 'none', backgroundColor: theme.colors.blue, color: '#fff',
                fontSize: '13px', fontWeight: 600, fontFamily: theme.fonts.body,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              <Plus size={15} /> New Action
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        marginBottom: '20px', padding: '12px 16px', borderRadius: theme.radii.lg,
        backgroundColor: theme.colors.blueMuted, border: `1px solid ${theme.colors.blue}20`,
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <Zap size={16} color={theme.colors.blue} />
        <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>
          {allActions.length} actions configured
        </span>
        <span style={{ width: '1px', height: '14px', backgroundColor: colors.border }} />
        <span style={{ fontSize: '12px', color: colors.textSecondary }}>
          {allActions.filter(a => enabledActions[a.id] !== false).length} enabled
        </span>
        <span style={{ fontSize: '12px', color: colors.textSecondary }}>
          {allActions.filter(a => enabledActions[a.id] === false).length} disabled
        </span>
        <span style={{ width: '1px', height: '14px', backgroundColor: colors.border }} />
        <span style={{ fontSize: '12px', color: colors.textSecondary }}>
          {existingCategories.length} categories
        </span>
      </div>

      {/* Search + Filters + View Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: '320px' }}>
          <Search size={15} color={colors.textTertiary} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            placeholder="Search actions..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ ...inputStyle, paddingLeft: '36px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={14} color={colors.textTertiary} />
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            style={{
              ...inputStyle, width: 'auto', padding: '8px 28px 8px 10px',
              appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', cursor: 'pointer',
            }}
          >
            <option value="all">All Categories</option>
            {existingCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{
              ...inputStyle, width: 'auto', padding: '8px 28px 8px 10px',
              appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', cursor: 'pointer',
            }}
          >
            <option value="all">All Status</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
          {(filterCategory !== 'all' || filterStatus !== 'all') && (
            <button
              onClick={() => { setFilterCategory('all'); setFilterStatus('all'); }}
              style={{
                padding: '4px 10px', borderRadius: theme.radii.md, border: 'none',
                backgroundColor: theme.colors.error + '14', color: theme.colors.error,
                fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body,
              }}
            >Clear</button>
          )}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', border: `1px solid ${colors.border}`, borderRadius: theme.radii.md, overflow: 'hidden' }}>
          {[{ mode: 'grid', icon: LayoutGrid }, { mode: 'list', icon: List }].map(({ mode, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                width: '34px', height: '34px', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: viewMode === mode ? theme.colors.blue + '12' : 'transparent',
                color: viewMode === mode ? theme.colors.blue : colors.textTertiary,
              }}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>

      {/* Category Groups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {grouped.map(([cat, actions]) => {
          const catColor = getCategoryColor(cat);
          return (
            <div key={cat}>
              <button
                onClick={() => toggleCat(cat)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '0 0 10px', border: 'none', background: 'none',
                  cursor: 'pointer', width: '100%', textAlign: 'left',
                }}
              >
                <div style={{ width: '4px', height: '18px', borderRadius: '2px', backgroundColor: catColor }} />
                <span style={{ fontSize: '14px', fontWeight: 700, color: colors.text, fontFamily: theme.fonts.body }}>
                  {cat}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: colors.textTertiary, backgroundColor: colors.surfaceHover, padding: '2px 8px', borderRadius: theme.radii.full }}>
                  {actions.length}
                </span>
                <span style={{ marginLeft: 'auto' }}>
                  {expandedCats.has(cat) ? <ChevronDown size={14} color={colors.textTertiary} /> : <ChevronRight size={14} color={colors.textTertiary} />}
                </span>
              </button>

              {expandedCats.has(cat) && viewMode === 'grid' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                  {actions.map(action => {
                    const isHovered = hoveredAction === action.id;
                    const isEnabled = enabledActions[action.id] !== false;
                    return (
                      <div
                        key={action.id}
                        onMouseEnter={() => setHoveredAction(action.id)}
                        onMouseLeave={() => { setHoveredAction(null); setMenuOpen(null); }}
                        style={{
                          padding: '16px', borderRadius: theme.radii.lg,
                          border: `1px solid ${isHovered ? catColor + '60' : colors.border}`,
                          backgroundColor: isHovered ? catColor + '06' : colors.surface,
                          cursor: 'pointer', transition: theme.transitions.fast,
                          position: 'relative',
                        }}
                        onClick={() => onOpenCanvas({ ...action, category: cat, categoryColor: catColor })}
                      >
                        {!isEnabled && (
                          <span style={{
                            position: 'absolute', top: '10px', right: '10px',
                            fontSize: '10px', fontWeight: 700, letterSpacing: '0.6px',
                            padding: '3px 10px', borderRadius: theme.radii.sm,
                            backgroundColor: '#F59E0B', color: '#fff',
                            textTransform: 'uppercase',
                          }}>Draft</span>
                        )}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: theme.radii.md,
                            backgroundColor: catColor + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}>
                            <Wrench size={16} color={catColor} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>{action.name}</span>
                            </div>
                            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0, lineHeight: 1.4 }}>
                              {action.description}
                            </p>
                          </div>
                        </div>

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
                                  { icon: Edit, label: 'Edit Details', action: () => openEditModal(action) },
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
                                      color: item.color || colors.text, transition: theme.transitions.fast, textAlign: 'left',
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

              {expandedCats.has(cat) && viewMode === 'list' && (
                <div style={{ borderRadius: theme.radii.lg, border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
                  {actions.map((action, idx) => {
                    const isHovered = hoveredAction === action.id;
                    const isEnabled = enabledActions[action.id] !== false;
                    return (
                      <div
                        key={action.id}
                        onMouseEnter={() => setHoveredAction(action.id)}
                        onMouseLeave={() => { setHoveredAction(null); setMenuOpen(null); }}
                        onClick={() => onOpenCanvas({ ...action, category: cat, categoryColor: catColor })}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '14px',
                          padding: '12px 16px', cursor: 'pointer',
                          backgroundColor: isHovered ? catColor + '06' : colors.surface,
                          borderTop: idx > 0 ? `1px solid ${colors.border}` : 'none',
                          transition: theme.transitions.fast, position: 'relative',
                        }}
                      >
                        <div style={{
                          width: '32px', height: '32px', borderRadius: theme.radii.md,
                          backgroundColor: catColor + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <Wrench size={14} color={catColor} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>{action.name}</span>
                            {!isEnabled && (
                              <span style={{
                                fontSize: '10px', fontWeight: 700, letterSpacing: '0.6px',
                                padding: '2px 8px', borderRadius: theme.radii.sm,
                                backgroundColor: '#F59E0B', color: '#fff',
                                textTransform: 'uppercase', flexShrink: 0,
                              }}>Draft</span>
                            )}
                          </div>
                          <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '2px 0 0', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {action.description}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, width: '150px', justifyContent: 'flex-end' }}>
                          <div
                            onClick={e => { e.stopPropagation(); toggleEnabled(action.id); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                          >
                            <div style={{
                              width: '32px', height: '18px', borderRadius: '9px',
                              backgroundColor: isEnabled ? theme.colors.success : colors.textTertiary,
                              position: 'relative', transition: theme.transitions.fast,
                            }}>
                              <div style={{
                                width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#fff',
                                position: 'absolute', top: '2px',
                                left: isEnabled ? '16px' : '2px',
                                transition: theme.transitions.fast, boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                              }} />
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: isEnabled ? theme.colors.success : colors.textTertiary, whiteSpace: 'nowrap' }}>
                              {isEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                          <div style={{ position: 'relative', width: '26px', height: '26px', flexShrink: 0 }}>
                            <button
                              onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === action.id ? null : action.id); }}
                              style={{
                                width: '26px', height: '26px', borderRadius: theme.radii.sm,
                                border: `1px solid ${colors.border}`, backgroundColor: colors.surface,
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                opacity: isHovered ? 1 : 0, transition: theme.transitions.fast,
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
                                  { icon: Edit, label: 'Edit Details', action: () => openEditModal(action) },
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
                                      color: item.color || colors.text, transition: theme.transitions.fast, textAlign: 'left',
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
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {grouped.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', borderRadius: theme.radii.lg, backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
            <Wrench size={32} color={colors.textTertiary} style={{ marginBottom: '12px' }} />
            <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>
              {filterCategory !== 'all' || filterStatus !== 'all' ? 'No actions match the selected filters.' : 'No actions match your search.'}
            </p>
          </div>
        )}
      </div>

      {/* ── Create Action Modal ── */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(2,18,44,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{
            backgroundColor: colors.surface, borderRadius: theme.radii.xl, boxShadow: theme.shadows.modal,
            width: '100%', maxWidth: '520px', overflow: 'hidden',
          }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${colors.border}` }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text, margin: 0, fontFamily: theme.fonts.heading }}>
                {importingTemplate ? 'Import Template' : editingAction ? 'Edit Action' : 'Create New Action'}
              </h2>
              <p style={{ fontSize: '13px', color: colors.textSecondary, margin: '6px 0 0' }}>
                {importingTemplate
                  ? `Importing "${importingTemplate.name}". Customize the name and description before adding it to your actions.`
                  : editingAction
                    ? 'Update the name, description, or category for this action.'
                    : 'Define a tool for NextIQ. The description helps the engine decide when to invoke it.'}
              </p>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: colors.text, marginBottom: '6px' }}>
                  Action Name <span style={{ color: theme.colors.error }}>*</span>
                </label>
                <input value={newActionName} onChange={e => setNewActionName(e.target.value)} placeholder="e.g. Check Account Rate Limits" autoFocus style={inputStyle} />
                {nameConflict && !editingAction && (
                  <p style={{ fontSize: '11px', color: theme.colors.warning, margin: '6px 0 0', fontWeight: 600 }}>
                    An action with this name already exists. Consider using a different name.
                  </p>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: colors.text, marginBottom: '6px' }}>
                  Tool Description <span style={{ color: theme.colors.error }}>*</span>
                </label>
                <textarea value={newActionDesc} onChange={e => setNewActionDesc(e.target.value)}
                  placeholder="Describe what this action does, when it should be used, and what inputs it needs."
                  rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                />
              </div>
              <div>
                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: colors.text, marginBottom: '6px' }}>Category</label>
                  <input value={newActionCategory}
                    onChange={e => { setNewActionCategory(e.target.value); setShowCategorySuggestions(true); }}
                    onFocus={() => setShowCategorySuggestions(true)}
                    onBlur={() => setTimeout(() => setShowCategorySuggestions(false), 150)}
                    placeholder="e.g. Billing & Payments"
                    style={inputStyle}
                  />
                  {showCategorySuggestions && filteredSuggestions.length > 0 && newActionCategory && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '2px',
                      backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
                      borderRadius: theme.radii.md, boxShadow: theme.shadows.dropdown, zIndex: 10,
                      maxHeight: '160px', overflowY: 'auto',
                    }}>
                      {filteredSuggestions.map(cat => (
                        <button key={cat}
                          onMouseDown={() => { setNewActionCategory(cat); setShowCategorySuggestions(false); }}
                          style={{
                            width: '100%', padding: '7px 12px', border: 'none', backgroundColor: 'transparent',
                            cursor: 'pointer', textAlign: 'left', fontSize: '12px', fontFamily: theme.fonts.body,
                            color: colors.text, display: 'flex', alignItems: 'center', gap: '8px',
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = colors.surfaceHover}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div style={{ width: '4px', height: '12px', borderRadius: '2px', backgroundColor: getCategoryColor(cat) }} />
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '14px 24px', borderTop: `1px solid ${colors.border}`, backgroundColor: colors.surfaceHover }}>
              <button onClick={() => { setShowCreateModal(false); setEditingAction(null); setImportingTemplate(null); }} style={{
                padding: '8px 18px', borderRadius: theme.radii.md, fontSize: '13px', fontWeight: 600,
                border: `1px solid ${colors.border}`, backgroundColor: 'transparent', color: colors.text,
                cursor: 'pointer', fontFamily: theme.fonts.body,
              }}>Cancel</button>
              <button
                disabled={!newActionName.trim() || !newActionDesc.trim()}
                onClick={importingTemplate ? handleConfirmImport : editingAction ? handleSaveEdit : handleCreateAction}
                style={{
                  padding: '8px 18px', borderRadius: theme.radii.md, fontSize: '13px', fontWeight: 600,
                  border: 'none', color: '#fff', cursor: 'pointer', fontFamily: theme.fonts.body,
                  backgroundColor: (!newActionName.trim() || !newActionDesc.trim()) ? colors.textTertiary : theme.colors.blue,
                  opacity: (!newActionName.trim() || !newActionDesc.trim()) ? 0.6 : 1,
                }}
              >{importingTemplate ? 'Import & Open Builder' : editingAction ? 'Save Changes' : 'Create & Open Builder'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Platform Templates Modal ── */}
      {showTemplates && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(2,18,44,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{
            backgroundColor: colors.surface, borderRadius: theme.radii.xl, boxShadow: theme.shadows.modal,
            width: '100%', maxWidth: '640px', maxHeight: '80vh', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${colors.border}`, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text, margin: 0, fontFamily: theme.fonts.heading }}>Platform Templates</h2>
                  <p style={{ fontSize: '13px', color: colors.textSecondary, margin: '4px 0 0' }}>
                    Pre-built action templates provided by the platform. Import and configure them for your tenant.
                  </p>
                </div>
                <button onClick={() => setShowTemplates(false)} style={{
                  padding: '6px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex',
                }}>
                  <X size={18} color={colors.textSecondary} />
                </button>
              </div>
              <div style={{ position: 'relative', marginTop: '14px' }}>
                <Search size={14} color={colors.textTertiary} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input value={templateSearch} onChange={e => setTemplateSearch(e.target.value)}
                  placeholder="Search templates..." autoFocus
                  style={{ ...inputStyle, paddingLeft: '34px' }}
                />
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {templateGroups.map(([cat, templates]) => (
                <div key={cat} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ width: '4px', height: '14px', borderRadius: '2px', backgroundColor: getCategoryColor(cat) }} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{cat}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {templates.map(tpl => (
                        <div key={tpl.id} style={{
                          padding: '12px 16px', borderRadius: theme.radii.md,
                          border: `1px solid ${colors.border}`, backgroundColor: colors.cardBackground,
                          display: 'flex', alignItems: 'center', gap: '12px',
                        }}>
                          <div style={{
                            width: '32px', height: '32px', borderRadius: theme.radii.md,
                            backgroundColor: getCategoryColor(cat) + '12',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}>
                            <Package size={15} color={getCategoryColor(cat)} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>{tpl.name}</span>
                            <p style={{ fontSize: '11px', color: colors.textSecondary, margin: '2px 0 0', lineHeight: 1.4 }}>{tpl.description}</p>
                          </div>
                          <button onClick={() => startImportTemplate(tpl)} style={{
                            padding: '5px 14px', borderRadius: theme.radii.md, border: `1px solid ${theme.colors.blue}30`,
                            backgroundColor: theme.colors.blueMuted, color: theme.colors.blue,
                            fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body,
                            display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, whiteSpace: 'nowrap',
                          }}>
                            <Download size={12} /> Import
                          </button>
                        </div>
                    ))}
                  </div>
                </div>
              ))}
              {filteredTemplates.length === 0 && (
                <div style={{ padding: '32px', textAlign: 'center' }}>
                  <p style={{ fontSize: '13px', color: colors.textSecondary }}>No templates match your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
