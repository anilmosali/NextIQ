import { useState, useRef, useEffect } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import {
  Plus, Search, Shield, AlertTriangle, Info, ChevronDown, ChevronRight,
  MoreHorizontal, Edit, Copy, Trash2, Sparkles, ArrowLeft, Check, X,
  Zap, Clock, MessageSquare, UserCheck, TrendingUp, Eye, Bell,
  FileText, ChevronUp, Play, Send, Loader,
} from 'lucide-react';

// ── OOB Templates ────────────────────────────────────────────────────
const OOB_TEMPLATES = [
  {
    id: 'tmpl-greeting',
    name: 'Greeting & Empathy',
    category: 'greeting',
    severity: 'warning',
    description: 'Agent must greet the customer and acknowledge their issue within the first response.',
    icon: MessageSquare,
    color: '#0062B8',
    trigger: 'on_agent_message',
    conditions: [
      { field: 'message_index', operator: 'equals', value: '1' },
      { field: 'agent_message_text', operator: 'does_not_contain', value: 'greeting pattern (hi/hello/thank you for calling)' },
    ],
    conditionLogic: 'AND',
    results: {
      nudge: true,
      nudgeText: 'Remember to greet the customer and acknowledge their concern before diving into troubleshooting.',
      escalate: false,
      logForReview: false,
    },
  },
  {
    id: 'tmpl-identity',
    name: 'Identity Verification',
    category: 'verification',
    severity: 'critical',
    description: 'Agent must verify customer identity before performing any account-modifying action.',
    icon: UserCheck,
    color: '#EF4444',
    trigger: 'on_tool_execution',
    conditions: [
      { field: 'tool_type', operator: 'equals', value: 'account-modifying' },
      { field: 'used_actions', operator: 'does_not_contain', value: 'identity_verification' },
    ],
    conditionLogic: 'AND',
    results: {
      nudge: true,
      nudgeText: 'STOP: Customer identity has not been verified. Confirm their identity before making account changes.',
      escalate: true,
      escalateMessage: 'Agent attempted account modification without identity verification.',
      logForReview: true,
    },
  },
  {
    id: 'tmpl-sensitive-data',
    name: 'Sensitive Data Compliance',
    category: 'compliance',
    severity: 'critical',
    description: 'Agent must not share internal tool names, system IDs, or debug information with the customer.',
    icon: Shield,
    color: '#EF4444',
    trigger: 'on_agent_message',
    conditions: [
      { field: 'agent_message_text', operator: 'contains', value: 'internal tool ID or system jargon' },
    ],
    conditionLogic: 'AND',
    results: {
      nudge: true,
      nudgeText: 'Your message may contain internal system information. Remove tool names, IDs, or debug data before sending.',
      escalate: true,
      escalateMessage: 'Agent shared internal system information with customer.',
      logForReview: true,
    },
  },
  {
    id: 'tmpl-upsell',
    name: 'Upsell on Qualifying Accounts',
    category: 'upsell',
    severity: 'info',
    description: 'When resolving an issue for an upgrade-eligible customer, mention relevant promotions before closing.',
    icon: TrendingUp,
    color: '#10B981',
    trigger: 'on_conversation_close',
    conditions: [
      { field: 'customer_tags', operator: 'contains', value: 'upgrade-eligible' },
      { field: 'agent_message_text', operator: 'does_not_contain', value: 'promotion or upgrade offer' },
    ],
    conditionLogic: 'AND',
    results: {
      nudge: true,
      nudgeText: 'This customer qualifies for an upgrade. Consider mentioning the current promotion before closing.',
      escalate: false,
      logForReview: false,
    },
  },
  {
    id: 'tmpl-vip-churn',
    name: 'VIP Churn Risk Escalation',
    category: 'compliance',
    severity: 'critical',
    description: 'Alert supervisor immediately if a VIP At-Risk customer\'s churn risk is unacknowledged by the agent.',
    icon: AlertTriangle,
    color: '#EF4444',
    trigger: 'on_agent_message',
    conditions: [
      { field: 'customer_tags', operator: 'contains', value: 'VIP' },
      { field: 'churn_risk', operator: 'equals', value: 'At Risk' },
      { field: 'agent_message_text', operator: 'does_not_contain', value: 'churn acknowledgement' },
    ],
    conditionLogic: 'AND',
    results: {
      nudge: true,
      nudgeText: 'This is a VIP customer flagged as At Risk for churn. Acknowledge their concerns and consider escalating.',
      escalate: true,
      escalateMessage: 'VIP customer at churn risk — agent has not acknowledged risk factors.',
      logForReview: true,
    },
  },
  {
    id: 'tmpl-tone',
    name: 'Tone Monitoring',
    category: 'tone',
    severity: 'warning',
    description: 'Nudge agent if customer sentiment drops to Negative and agent hasn\'t used empathy language.',
    icon: Eye,
    color: '#F59E0B',
    trigger: 'on_sentiment_change',
    conditions: [
      { field: 'customer_sentiment', operator: 'equals', value: 'Negative' },
      { field: 'agent_message_text', operator: 'does_not_contain', value: 'empathy language (sorry/understand/frustrating)' },
    ],
    conditionLogic: 'AND',
    results: {
      nudge: true,
      nudgeText: 'Customer sentiment is negative. Use empathetic language — acknowledge their frustration before proceeding.',
      escalate: false,
      logForReview: false,
    },
  },
  {
    id: 'tmpl-sla',
    name: 'Resolution Time SLA',
    category: 'sla',
    severity: 'warning',
    description: 'Nudge agent if conversation exceeds 10 minutes without a resolution action being taken.',
    icon: Clock,
    color: '#F59E0B',
    trigger: 'after_n_minutes',
    triggerMinutes: 10,
    conditions: [
      { field: 'used_actions', operator: 'does_not_contain', value: 'resolution action' },
    ],
    conditionLogic: 'AND',
    results: {
      nudge: true,
      nudgeText: 'This conversation has exceeded 10 minutes without a resolution. Consider taking a decisive action or escalating.',
      escalate: false,
      logForReview: true,
    },
  },
  {
    id: 'tmpl-followup',
    name: 'Follow-up Commitment',
    category: 'compliance',
    severity: 'warning',
    description: 'If agent promises a follow-up (email, callback), ensure it is logged before conversation close.',
    icon: Bell,
    color: '#8B5CF6',
    trigger: 'on_conversation_close',
    conditions: [
      { field: 'agent_message_text', operator: 'contains', value: 'follow-up promise (I\'ll send/call back/follow up)' },
      { field: 'used_actions', operator: 'does_not_contain', value: 'follow-up logged' },
    ],
    conditionLogic: 'AND',
    results: {
      nudge: true,
      nudgeText: 'You promised a follow-up to this customer. Make sure it\'s logged before closing the conversation.',
      escalate: false,
      logForReview: true,
    },
  },
];

const CATEGORIES = [
  { id: 'greeting', label: 'Greeting', color: '#0062B8' },
  { id: 'verification', label: 'Verification', color: '#8B5CF6' },
  { id: 'tone', label: 'Tone', color: '#F59E0B' },
  { id: 'compliance', label: 'Compliance', color: '#EF4444' },
  { id: 'upsell', label: 'Upsell', color: '#10B981' },
  { id: 'sla', label: 'SLA', color: '#F59E0B' },
  { id: 'custom', label: 'Custom', color: '#6B7280' },
];

const TRIGGER_OPTIONS = [
  { id: 'on_agent_message', label: 'On every agent message' },
  { id: 'on_tool_execution', label: 'On tool / action execution' },
  { id: 'on_sentiment_change', label: 'On customer sentiment change' },
  { id: 'after_n_minutes', label: 'After N minutes elapsed' },
  { id: 'on_conversation_close', label: 'On conversation close signal' },
];

const FIELD_OPTIONS = [
  { id: 'agent_message_text', label: 'Agent message text' },
  { id: 'customer_sentiment', label: 'Customer sentiment' },
  { id: 'customer_tags', label: 'Customer tags' },
  { id: 'used_actions', label: 'Used actions list' },
  { id: 'conversation_duration', label: 'Conversation duration (min)' },
  { id: 'account_type', label: 'Account type' },
  { id: 'churn_risk', label: 'Churn risk level' },
  { id: 'tool_type', label: 'Tool type being executed' },
  { id: 'message_index', label: 'Message index in conversation' },
];

const OPERATOR_OPTIONS = [
  { id: 'contains', label: 'contains' },
  { id: 'does_not_contain', label: 'does not contain' },
  { id: 'equals', label: 'equals' },
  { id: 'not_equal', label: 'not equal' },
  { id: 'is_in', label: 'is in' },
  { id: 'not_in', label: 'not in' },
  { id: 'greater_than', label: 'greater than' },
  { id: 'less_than', label: 'less than' },
  { id: 'is_empty', label: 'is empty' },
  { id: 'is_not_empty', label: 'is not empty' },
];

const SEVERITY_OPTIONS = [
  { id: 'info', label: 'Info', color: '#0062B8', bg: 'rgba(0, 98, 184, 0.08)' },
  { id: 'warning', label: 'Warning', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
  { id: 'critical', label: 'Critical', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },
];

const NL_MOCK_EXAMPLES = {
  'verify': {
    name: 'Verify Identity Before Account Changes',
    category: 'verification',
    severity: 'critical',
    trigger: 'on_tool_execution',
    conditions: [
      { field: 'tool_type', operator: 'equals', value: 'account-modifying' },
      { field: 'used_actions', operator: 'does_not_contain', value: 'identity_verification' },
    ],
    conditionLogic: 'AND',
    results: {
      nudge: true,
      nudgeText: 'Customer identity must be verified before making account changes.',
      escalate: true,
      escalateMessage: 'Agent attempted account modification without verification.',
      logForReview: true,
    },
  },
  'greet': {
    name: 'Greet Customer Warmly',
    category: 'greeting',
    severity: 'warning',
    trigger: 'on_agent_message',
    conditions: [
      { field: 'message_index', operator: 'equals', value: '1' },
      { field: 'agent_message_text', operator: 'does_not_contain', value: 'greeting pattern' },
    ],
    conditionLogic: 'AND',
    results: {
      nudge: true,
      nudgeText: 'Start with a warm greeting before addressing the issue.',
      escalate: false,
      logForReview: false,
    },
  },
  'empathy': {
    name: 'Show Empathy on Negative Sentiment',
    category: 'tone',
    severity: 'warning',
    trigger: 'on_sentiment_change',
    conditions: [
      { field: 'customer_sentiment', operator: 'equals', value: 'Negative' },
      { field: 'agent_message_text', operator: 'does_not_contain', value: 'empathy language' },
    ],
    conditionLogic: 'AND',
    results: {
      nudge: true,
      nudgeText: 'Customer is frustrated. Acknowledge their feelings before troubleshooting.',
      escalate: false,
      logForReview: false,
    },
  },
};

function matchNLInput(text) {
  const lower = text.toLowerCase();
  if (lower.includes('verify') || lower.includes('identity') || lower.includes('confirm')) return NL_MOCK_EXAMPLES['verify'];
  if (lower.includes('greet') || lower.includes('hello') || lower.includes('welcome')) return NL_MOCK_EXAMPLES['greet'];
  if (lower.includes('empathy') || lower.includes('sorry') || lower.includes('frustrat') || lower.includes('tone') || lower.includes('sentiment')) return NL_MOCK_EXAMPLES['empathy'];
  return null;
}

export { OOB_TEMPLATES, CATEGORIES, SEVERITY_OPTIONS };

export default function CoachingRulesBuilder() {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  const [view, setView] = useState('home'); // 'home' | 'creator' | 'editor'
  const [searchText, setSearchText] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showTemplates, setShowTemplates] = useState(true);

  const [rules, setRules] = useState(() => {
    return OOB_TEMPLATES.map(t => ({
      ...t,
      id: t.id.replace('tmpl-', 'rule-'),
      isActive: true,
      createdAt: '2026-02-20',
      source: 'template',
    }));
  });

  // AI Creator state
  const [nlInput, setNlInput] = useState('');
  const [aiParsing, setAiParsing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const nlInputRef = useRef(null);

  // Editor state
  const [editingRule, setEditingRule] = useState(null);

  const severityOf = (s) => SEVERITY_OPTIONS.find(o => o.id === s) || SEVERITY_OPTIONS[0];
  const categoryOf = (c) => CATEGORIES.find(o => o.id === c) || CATEGORIES[6];

  const handleUseTemplate = (tmpl) => {
    setEditingRule({
      id: 'new-' + Date.now(),
      name: tmpl.name,
      description: tmpl.description,
      category: tmpl.category,
      severity: tmpl.severity,
      trigger: tmpl.trigger,
      triggerMinutes: tmpl.triggerMinutes || 5,
      conditions: tmpl.conditions ? tmpl.conditions.map((c, i) => ({ ...c, _key: i })) : [],
      conditionLogic: tmpl.conditionLogic || 'AND',
      results: tmpl.results ? { ...tmpl.results } : { nudge: true, nudgeText: '', escalate: false, escalateMessage: '', logForReview: false },
      isActive: true,
      isNew: true,
    });
    setView('editor');
  };

  const handleEditRule = (rule) => {
    setEditingRule({
      ...rule,
      conditions: (rule.conditions || []).map((c, i) => ({ ...c, _key: c._key ?? i })),
      results: rule.results ? { ...rule.results } : { nudge: true, nudgeText: '', escalate: false, escalateMessage: '', logForReview: false },
      isNew: false,
    });
    setView('editor');
  };

  const handleSaveRule = () => {
    if (!editingRule) return;
    const cleaned = { ...editingRule };
    delete cleaned.isNew;
    cleaned.conditions = cleaned.conditions.map(({ _key, ...rest }) => rest);
    if (!cleaned.createdAt) cleaned.createdAt = new Date().toISOString().slice(0, 10);
    cleaned.source = cleaned.source || 'manual';

    setRules(prev => {
      const idx = prev.findIndex(r => r.id === cleaned.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = cleaned;
        return next;
      }
      return [...prev, cleaned];
    });
    setEditingRule(null);
    setView('home');
  };

  const handleDeleteRule = (ruleId) => {
    setRules(prev => prev.filter(r => r.id !== ruleId));
  };

  const handleToggleRule = (ruleId) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, isActive: !r.isActive } : r));
  };

  const handleAiGenerate = () => {
    if (!nlInput.trim()) return;
    setAiParsing(true);
    setAiResult(null);
    setTimeout(() => {
      const result = matchNLInput(nlInput);
      setAiResult(result || {
        name: 'Custom Coaching Rule',
        category: 'custom',
        severity: 'warning',
        trigger: 'on_agent_message',
        conditions: [
          { field: 'agent_message_text', operator: 'does_not_contain', value: nlInput.slice(0, 40) },
        ],
        conditionLogic: 'AND',
        results: {
          nudge: true,
          nudgeText: `Coaching guidance: ${nlInput.slice(0, 80)}`,
          escalate: false,
          logForReview: false,
        },
      });
      setAiParsing(false);
    }, 1800);
  };

  const handleAiSave = () => {
    if (!aiResult) return;
    const newRule = {
      ...aiResult,
      id: 'rule-ai-' + Date.now(),
      isActive: true,
      createdAt: new Date().toISOString().slice(0, 10),
      source: 'ai',
      description: nlInput,
      conditions: aiResult.conditions?.map((c, i) => ({ ...c, _key: i })) || [],
    };
    setRules(prev => [...prev, newRule]);
    setNlInput('');
    setAiResult(null);
    setView('home');
  };

  const handleAiEditManually = () => {
    if (!aiResult) return;
    setEditingRule({
      id: 'new-' + Date.now(),
      name: aiResult.name,
      description: nlInput,
      category: aiResult.category,
      severity: aiResult.severity,
      trigger: aiResult.trigger,
      triggerMinutes: 5,
      conditions: aiResult.conditions?.map((c, i) => ({ ...c, _key: i })) || [],
      conditionLogic: aiResult.conditionLogic || 'AND',
      results: aiResult.results ? { ...aiResult.results } : { nudge: true, nudgeText: '', escalate: false, logForReview: false },
      isActive: true,
      isNew: true,
      source: 'ai',
    });
    setNlInput('');
    setAiResult(null);
    setView('editor');
  };

  const activeRules = rules.filter(r => r.isActive);
  const filteredRules = searchText.trim()
    ? rules.filter(r =>
        r.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (r.description || '').toLowerCase().includes(searchText.toLowerCase()) ||
        r.category.toLowerCase().includes(searchText.toLowerCase())
      )
    : rules;

  const inputStyle = {
    width: '100%', padding: '9px 14px 9px 36px',
    border: `1px solid ${colors.inputBorder}`, borderRadius: theme.radii.md,
    fontSize: '13px', fontFamily: theme.fonts.body,
    backgroundColor: colors.inputBackground, color: colors.text,
    outline: 'none', transition: theme.transitions.fast, boxSizing: 'border-box',
  };

  // ───────────────────── RULES HOME VIEW ──────────────────────
  if (view === 'home') {
    return (
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <h1 style={{ fontFamily: theme.fonts.heading, fontSize: '28px', fontWeight: 700, color: colors.text, margin: '0 0 6px' }}>
                Coaching Rules
              </h1>
              <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>
                Define real-time coaching behaviors for your agents. NextIQ monitors conversations and nudges agents when rules are triggered.
              </p>
            </div>
            <button
              onClick={() => { setNlInput(''); setAiResult(null); setView('creator'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0,
                padding: '8px 16px', borderRadius: theme.radii.md,
                border: 'none', backgroundColor: theme.colors.blue, color: '#fff',
                fontSize: '13px', fontWeight: 600, fontFamily: theme.fonts.body,
                cursor: 'pointer', transition: theme.transitions.fast, whiteSpace: 'nowrap',
              }}
            >
              <Plus size={15} /> New Coaching Rule
            </button>
          </div>
        </div>

        {/* Stats banner */}
        <div style={{
          marginBottom: '20px', padding: '12px 16px', borderRadius: theme.radii.lg,
          backgroundColor: theme.colors.purpleMuted, border: `1px solid ${theme.colors.purple}20`,
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <Shield size={16} color={theme.colors.purple} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>
            {activeRules.length} active rules
          </span>
          <span style={{ fontSize: '12px', color: colors.textSecondary }}>
            across {new Set(rules.map(r => r.category)).size} categories.
            NextIQ evaluates these in real-time during every conversation.
          </span>
        </div>

        {/* OOB Templates Section */}
        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px',
              border: 'none', background: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            <FileText size={16} color={theme.colors.purple} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: colors.text, fontFamily: theme.fonts.body }}>
              Quick-Start Templates
            </span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: colors.textTertiary, backgroundColor: colors.surfaceHover, padding: '2px 8px', borderRadius: theme.radii.full }}>
              {OOB_TEMPLATES.length}
            </span>
            {showTemplates ? <ChevronUp size={14} color={colors.textTertiary} /> : <ChevronDown size={14} color={colors.textTertiary} />}
          </button>
          {showTemplates && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
              {OOB_TEMPLATES.map(tmpl => {
                const sev = severityOf(tmpl.severity);
                const isHov = hoveredCard === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onMouseEnter={() => setHoveredCard(tmpl.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      padding: '16px', borderRadius: theme.radii.lg,
                      border: `1px solid ${isHov ? tmpl.color + '60' : colors.border}`,
                      backgroundColor: isHov ? tmpl.color + '06' : colors.surface,
                      cursor: 'pointer', transition: theme.transitions.fast,
                    }}
                    onClick={() => handleUseTemplate(tmpl)}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: theme.radii.md,
                        backgroundColor: tmpl.color + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <tmpl.icon size={18} color={tmpl.color} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>{tmpl.name}</span>
                          <span style={{
                            fontSize: '10px', fontWeight: 600, padding: '1px 6px', borderRadius: theme.radii.full,
                            backgroundColor: sev.bg, color: sev.color,
                          }}>
                            {sev.label}
                          </span>
                        </div>
                        <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0, lineHeight: 1.4 }}>
                          {tmpl.description}
                        </p>
                      </div>
                    </div>
                    {isHov && (
                      <div style={{
                        marginTop: '10px', paddingTop: '10px', borderTop: `1px solid ${colors.borderLight}`,
                        display: 'flex', alignItems: 'center', gap: '6px',
                      }}>
                        <Play size={12} color={theme.colors.blue} />
                        <span style={{ fontSize: '11px', fontWeight: 600, color: theme.colors.blue }}>
                          Use Template
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '400px' }}>
          <Search size={15} color={colors.textTertiary} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            placeholder="Search coaching rules..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = colors.inputBorderFocus; }}
            onBlur={e => { e.target.style.borderColor = colors.inputBorder; }}
          />
        </div>

        {/* Active Rules List */}
        <div style={{ marginBottom: '12px' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: colors.text, fontFamily: theme.fonts.body }}>
            Active Rules
          </span>
          <span style={{ fontSize: '11px', fontWeight: 600, color: colors.textTertiary, backgroundColor: colors.surfaceHover, padding: '2px 8px', borderRadius: theme.radii.full, marginLeft: '8px' }}>
            {filteredRules.length}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredRules.map(rule => {
            const sev = severityOf(rule.severity);
            const cat = categoryOf(rule.category);
            const isHov = hoveredCard === 'rule-' + rule.id;
            return (
              <div
                key={rule.id}
                onMouseEnter={() => setHoveredCard('rule-' + rule.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  padding: '14px 16px', borderRadius: theme.radii.lg,
                  border: `1px solid ${isHov ? theme.colors.blue + '40' : colors.border}`,
                  backgroundColor: isHov ? theme.colors.blueMuted : colors.surface,
                  transition: theme.transitions.fast,
                  display: 'flex', alignItems: 'center', gap: '14px',
                  opacity: rule.isActive ? 1 : 0.55,
                }}
              >
                <div style={{
                  width: '4px', height: '36px', borderRadius: '2px',
                  backgroundColor: sev.color, flexShrink: 0,
                }} />
                <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => handleEditRule(rule)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>{rule.name}</span>
                    <span style={{
                      fontSize: '10px', fontWeight: 600, padding: '1px 6px', borderRadius: theme.radii.full,
                      backgroundColor: cat.color + '15', color: cat.color,
                    }}>
                      {cat.label}
                    </span>
                    <span style={{
                      fontSize: '10px', fontWeight: 600, padding: '1px 6px', borderRadius: theme.radii.full,
                      backgroundColor: sev.bg, color: sev.color,
                    }}>
                      {sev.label}
                    </span>
                    {rule.source === 'ai' && (
                      <span style={{
                        fontSize: '10px', fontWeight: 600, padding: '1px 6px', borderRadius: theme.radii.full,
                        backgroundColor: theme.colors.purpleMuted, color: theme.colors.purple,
                      }}>
                        AI-generated
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {rule.description || TRIGGER_OPTIONS.find(t => t.id === rule.trigger)?.label || rule.trigger}
                  </p>
                </div>

                {/* Toggle */}
                <div
                  onClick={e => { e.stopPropagation(); handleToggleRule(rule.id); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', flexShrink: 0 }}
                >
                  <div style={{
                    width: '32px', height: '18px', borderRadius: '9px',
                    backgroundColor: rule.isActive ? theme.colors.success : colors.textTertiary,
                    position: 'relative', transition: theme.transitions.fast,
                  }}>
                    <div style={{
                      width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#fff',
                      position: 'absolute', top: '2px',
                      left: rule.isActive ? '16px' : '2px',
                      transition: theme.transitions.fast, boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                    }} />
                  </div>
                </div>

                {/* Actions */}
                {isHov && (
                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                    <button
                      onClick={() => handleEditRule(rule)}
                      style={{
                        width: '28px', height: '28px', borderRadius: theme.radii.sm,
                        border: `1px solid ${colors.border}`, backgroundColor: colors.surface,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                      title="Edit"
                    >
                      <Edit size={13} color={colors.textSecondary} />
                    </button>
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      style={{
                        width: '28px', height: '28px', borderRadius: theme.radii.sm,
                        border: `1px solid ${colors.border}`, backgroundColor: colors.surface,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                      title="Delete"
                    >
                      <Trash2 size={13} color={theme.colors.error} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {filteredRules.length === 0 && (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <Shield size={32} color={colors.textTertiary} style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>
                {searchText.trim() ? 'No rules match your search.' : 'No coaching rules configured yet. Use a template or create one with AI.'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ───────────────────── AI CREATOR VIEW ──────────────────────
  if (view === 'creator') {
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Back */}
        <button
          onClick={() => { setView('home'); setAiResult(null); setNlInput(''); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px',
            border: 'none', background: 'none', cursor: 'pointer', padding: 0,
            fontSize: '13px', fontWeight: 600, color: colors.textSecondary, fontFamily: theme.fonts.body,
          }}
        >
          <ArrowLeft size={15} /> Back to Rules
        </button>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: theme.radii.lg,
              background: `linear-gradient(135deg, ${theme.colors.purple}, ${theme.colors.blue})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={18} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontFamily: theme.fonts.heading, fontSize: '24px', fontWeight: 700, color: colors.text, margin: 0 }}>
                Create with AI
              </h1>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>
            Describe the coaching behavior you want to enforce in plain English. NextIQ will generate a structured rule for you.
          </p>
        </div>

        {/* NL Input */}
        <div style={{
          borderRadius: theme.radii.xl, border: `1px solid ${colors.border}`,
          backgroundColor: colors.surface, overflow: 'hidden', marginBottom: '24px',
          boxShadow: theme.shadows.md,
        }}>
          <div style={{ padding: '20px 20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Sparkles size={14} color={theme.colors.purple} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: theme.colors.purple, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Describe your rule
              </span>
            </div>
            <textarea
              ref={nlInputRef}
              value={nlInput}
              onChange={e => setNlInput(e.target.value)}
              placeholder={'e.g. "Make sure agents always verify the customer\'s email before making any changes to their account. If they skip verification, show a warning and alert the supervisor."'}
              rows={4}
              style={{
                width: '100%', padding: '14px', border: `1px solid ${colors.borderLight}`,
                borderRadius: theme.radii.lg, fontSize: '14px', fontFamily: theme.fonts.body,
                backgroundColor: colors.surfaceHover, color: colors.text, outline: 'none',
                resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box',
                transition: theme.transitions.fast,
              }}
              onFocus={e => { e.target.style.borderColor = theme.colors.purple + '60'; e.target.style.backgroundColor = colors.inputBackground; }}
              onBlur={e => { e.target.style.borderColor = colors.borderLight; e.target.style.backgroundColor = colors.surfaceHover; }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: `1px solid ${colors.borderLight}`, marginTop: '12px' }}>
            <span style={{ fontSize: '12px', color: colors.textTertiary }}>
              Try: "verify identity", "greet warmly", "empathy on frustration"
            </span>
            <button
              onClick={handleAiGenerate}
              disabled={!nlInput.trim() || aiParsing}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 18px', borderRadius: theme.radii.md,
                border: 'none', color: '#fff', cursor: 'pointer', fontFamily: theme.fonts.body,
                fontSize: '13px', fontWeight: 600,
                background: (!nlInput.trim() || aiParsing) ? colors.textTertiary : `linear-gradient(135deg, ${theme.colors.purple}, ${theme.colors.blue})`,
                opacity: (!nlInput.trim() || aiParsing) ? 0.6 : 1,
                transition: theme.transitions.fast,
              }}
            >
              {aiParsing ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...</> : <><Sparkles size={14} /> Generate Rule</>}
            </button>
          </div>
        </div>

        {/* AI Result Preview */}
        {aiParsing && (
          <div style={{
            padding: '32px', borderRadius: theme.radii.xl, border: `1px solid ${colors.border}`,
            backgroundColor: colors.surface, textAlign: 'center',
          }}>
            <Loader size={24} color={theme.colors.purple} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
            <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>
              Analyzing your description and generating a structured rule...
            </p>
          </div>
        )}

        {aiResult && !aiParsing && (
          <div style={{
            borderRadius: theme.radii.xl, border: `1px solid ${theme.colors.purple}30`,
            backgroundColor: colors.surface, overflow: 'hidden',
            boxShadow: theme.shadows.md,
          }}>
            <div style={{
              padding: '14px 20px', borderBottom: `1px solid ${colors.borderLight}`,
              background: `linear-gradient(135deg, ${theme.colors.purple}08, ${theme.colors.blue}08)`,
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <Check size={16} color={theme.colors.success} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>Rule Generated</span>
            </div>
            <div style={{ padding: '20px' }}>
              {/* Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Rule Name</label>
                <span style={{ fontSize: '16px', fontWeight: 700, color: colors.text }}>{aiResult.name}</span>
              </div>
              {/* Meta row */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: theme.radii.full,
                  backgroundColor: categoryOf(aiResult.category).color + '15',
                  color: categoryOf(aiResult.category).color,
                }}>
                  {categoryOf(aiResult.category).label}
                </span>
                <span style={{
                  fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: theme.radii.full,
                  backgroundColor: severityOf(aiResult.severity).bg,
                  color: severityOf(aiResult.severity).color,
                }}>
                  {severityOf(aiResult.severity).label}
                </span>
                <span style={{
                  fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: theme.radii.full,
                  backgroundColor: colors.surfaceHover, color: colors.textSecondary,
                }}>
                  {TRIGGER_OPTIONS.find(t => t.id === aiResult.trigger)?.label || aiResult.trigger}
                </span>
              </div>
              {/* Conditions */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Conditions</label>
                {aiResult.conditions?.map((cond, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px',
                    fontSize: '13px', color: colors.text,
                  }}>
                    {i > 0 && <span style={{ fontSize: '11px', fontWeight: 700, color: theme.colors.purple, marginRight: '4px' }}>{aiResult.conditionLogic || 'AND'}</span>}
                    <span style={{ backgroundColor: colors.surfaceHover, padding: '2px 8px', borderRadius: theme.radii.sm, fontSize: '12px', fontWeight: 500 }}>
                      {FIELD_OPTIONS.find(f => f.id === cond.field)?.label || cond.field}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: theme.colors.purple }}>
                      {OPERATOR_OPTIONS.find(o => o.id === cond.operator)?.label || cond.operator}
                    </span>
                    <span style={{ backgroundColor: colors.surfaceHover, padding: '2px 8px', borderRadius: theme.radii.sm, fontSize: '12px', fontStyle: 'italic' }}>
                      {cond.value}
                    </span>
                  </div>
                ))}
              </div>
              {/* Results */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Results</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {aiResult.results?.nudge && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: colors.text }}>
                      <MessageSquare size={14} color={theme.colors.blue} style={{ marginTop: '1px', flexShrink: 0 }} />
                      <span><strong>Nudge agent:</strong> {aiResult.results.nudgeText}</span>
                    </div>
                  )}
                  {aiResult.results?.escalate && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: theme.colors.error }}>
                      <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                      <span><strong>Escalate to supervisor</strong>{aiResult.results.escalateMessage ? `: ${aiResult.results.escalateMessage}` : ''}</span>
                    </div>
                  )}
                  {aiResult.results?.logForReview && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: colors.textSecondary }}>
                      <FileText size={14} style={{ flexShrink: 0 }} />
                      <span>Log for QA review</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '14px 20px', borderTop: `1px solid ${colors.borderLight}`, backgroundColor: colors.surfaceHover }}>
              <button
                onClick={handleAiEditManually}
                style={{
                  padding: '8px 18px', borderRadius: theme.radii.md, fontSize: '13px', fontWeight: 600,
                  border: `1px solid ${colors.border}`, backgroundColor: 'transparent', color: colors.text,
                  cursor: 'pointer', fontFamily: theme.fonts.body,
                }}
              >
                Edit Manually
              </button>
              <button
                onClick={handleAiSave}
                style={{
                  padding: '8px 18px', borderRadius: theme.radii.md, fontSize: '13px', fontWeight: 600,
                  border: 'none', color: '#fff', cursor: 'pointer', fontFamily: theme.fonts.body,
                  backgroundColor: theme.colors.blue,
                }}
              >
                Save Rule
              </button>
            </div>
          </div>
        )}

        {/* Or create manually */}
        {!aiParsing && !aiResult && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <span style={{ fontSize: '13px', color: colors.textTertiary }}>or </span>
            <button
              onClick={() => {
                setEditingRule({
                  id: 'new-' + Date.now(),
                  name: '', description: '', category: 'custom', severity: 'warning',
                  trigger: 'on_agent_message', triggerMinutes: 5,
                  conditions: [], conditionLogic: 'AND',
                  results: { nudge: true, nudgeText: '', escalate: false, escalateMessage: '', logForReview: false },
                  isActive: true, isNew: true,
                });
                setView('editor');
              }}
              style={{
                border: 'none', background: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: 600, color: theme.colors.blue,
                fontFamily: theme.fonts.body, textDecoration: 'underline',
              }}
            >
              build manually from scratch
            </button>
          </div>
        )}
      </div>
    );
  }

  // ───────────────────── RULE EDITOR VIEW ──────────────────────
  if (view === 'editor' && editingRule) {
    const updateField = (key, val) => setEditingRule(prev => ({ ...prev, [key]: val }));
    const updateResult = (key, val) => setEditingRule(prev => ({ ...prev, results: { ...prev.results, [key]: val } }));
    const addCondition = () => {
      setEditingRule(prev => ({
        ...prev,
        conditions: [...prev.conditions, { _key: Date.now(), field: 'agent_message_text', operator: 'contains', value: '' }],
      }));
    };
    const updateCondition = (key, field, val) => {
      setEditingRule(prev => ({
        ...prev,
        conditions: prev.conditions.map(c => c._key === key ? { ...c, [field]: val } : c),
      }));
    };
    const removeCondition = (key) => {
      setEditingRule(prev => ({ ...prev, conditions: prev.conditions.filter(c => c._key !== key) }));
    };

    const canSave = editingRule.name.trim() && editingRule.conditions.length > 0;

    return (
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        {/* Back */}
        <button
          onClick={() => { setView('home'); setEditingRule(null); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px',
            border: 'none', background: 'none', cursor: 'pointer', padding: 0,
            fontSize: '13px', fontWeight: 600, color: colors.textSecondary, fontFamily: theme.fonts.body,
          }}
        >
          <ArrowLeft size={15} /> Back to Rules
        </button>

        <h1 style={{ fontFamily: theme.fonts.heading, fontSize: '24px', fontWeight: 700, color: colors.text, margin: '0 0 24px' }}>
          {editingRule.isNew ? 'New Coaching Rule' : 'Edit Coaching Rule'}
        </h1>

        {/* Section 1: Identity */}
        <div style={{
          padding: '20px', borderRadius: theme.radii.xl, border: `1px solid ${colors.border}`,
          backgroundColor: colors.surface, marginBottom: '16px',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: colors.text, margin: '0 0 16px', fontFamily: theme.fonts.body }}>
            Rule Identity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: colors.text, marginBottom: '5px' }}>
                Name <span style={{ color: theme.colors.error }}>*</span>
              </label>
              <input
                value={editingRule.name}
                onChange={e => updateField('name', e.target.value)}
                placeholder="e.g. Verify Identity Before Account Changes"
                style={{
                  width: '100%', padding: '9px 14px', border: `1px solid ${colors.inputBorder}`,
                  borderRadius: theme.radii.md, fontSize: '13px', fontFamily: theme.fonts.body,
                  backgroundColor: colors.inputBackground, color: colors.text, outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = colors.inputBorderFocus; }}
                onBlur={e => { e.target.style.borderColor = colors.inputBorder; }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: colors.text, marginBottom: '5px' }}>
                Description
              </label>
              <textarea
                value={editingRule.description || ''}
                onChange={e => updateField('description', e.target.value)}
                placeholder="Describe what this rule enforces and when it should fire..."
                rows={2}
                style={{
                  width: '100%', padding: '9px 14px', border: `1px solid ${colors.inputBorder}`,
                  borderRadius: theme.radii.md, fontSize: '13px', fontFamily: theme.fonts.body,
                  backgroundColor: colors.inputBackground, color: colors.text, outline: 'none',
                  resize: 'vertical', lineHeight: 1.5, boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = colors.inputBorderFocus; }}
                onBlur={e => { e.target.style.borderColor = colors.inputBorder; }}
              />
            </div>
            {/* Category + Severity row */}
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: colors.text, marginBottom: '5px' }}>Category</label>
                <select
                  value={editingRule.category}
                  onChange={e => updateField('category', e.target.value)}
                  style={{
                    width: '100%', padding: '9px 14px', border: `1px solid ${colors.inputBorder}`,
                    borderRadius: theme.radii.md, fontSize: '13px', fontFamily: theme.fonts.body,
                    backgroundColor: colors.inputBackground, color: colors.text, outline: 'none',
                    boxSizing: 'border-box', cursor: 'pointer',
                  }}
                >
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: colors.text, marginBottom: '5px' }}>Severity</label>
                <div style={{ display: 'flex', borderRadius: theme.radii.md, border: `1px solid ${colors.inputBorder}`, overflow: 'hidden' }}>
                  {SEVERITY_OPTIONS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => updateField('severity', s.id)}
                      style={{
                        flex: 1, padding: '8px 0', border: 'none', cursor: 'pointer',
                        fontSize: '12px', fontWeight: 600, fontFamily: theme.fonts.body,
                        backgroundColor: editingRule.severity === s.id ? s.bg : 'transparent',
                        color: editingRule.severity === s.id ? s.color : colors.textSecondary,
                        transition: theme.transitions.fast,
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Active toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                onClick={() => updateField('isActive', !editingRule.isActive)}
                style={{
                  width: '36px', height: '20px', borderRadius: '10px',
                  backgroundColor: editingRule.isActive ? theme.colors.success : colors.textTertiary,
                  position: 'relative', cursor: 'pointer', transition: theme.transitions.fast,
                }}
              >
                <div style={{
                  width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fff',
                  position: 'absolute', top: '2px',
                  left: editingRule.isActive ? '18px' : '2px',
                  transition: theme.transitions.fast, boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                }} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: editingRule.isActive ? theme.colors.success : colors.textTertiary }}>
                {editingRule.isActive ? 'Active' : 'Paused'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Trigger */}
        <div style={{
          padding: '20px', borderRadius: theme.radii.xl, border: `1px solid ${colors.border}`,
          backgroundColor: colors.surface, marginBottom: '16px',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: colors.text, margin: '0 0 16px', fontFamily: theme.fonts.body }}>
            Trigger
          </h3>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: colors.text, marginBottom: '5px' }}>When should this rule be evaluated?</label>
          <select
            value={editingRule.trigger}
            onChange={e => updateField('trigger', e.target.value)}
            style={{
              width: '100%', padding: '9px 14px', border: `1px solid ${colors.inputBorder}`,
              borderRadius: theme.radii.md, fontSize: '13px', fontFamily: theme.fonts.body,
              backgroundColor: colors.inputBackground, color: colors.text, outline: 'none',
              boxSizing: 'border-box', cursor: 'pointer',
            }}
          >
            {TRIGGER_OPTIONS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          {editingRule.trigger === 'after_n_minutes' && (
            <div style={{ marginTop: '10px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: colors.text, marginBottom: '5px' }}>Minutes threshold</label>
              <input
                type="number"
                min={1}
                value={editingRule.triggerMinutes || 5}
                onChange={e => updateField('triggerMinutes', parseInt(e.target.value) || 5)}
                style={{
                  width: '100px', padding: '9px 14px', border: `1px solid ${colors.inputBorder}`,
                  borderRadius: theme.radii.md, fontSize: '13px', fontFamily: theme.fonts.body,
                  backgroundColor: colors.inputBackground, color: colors.text, outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}
        </div>

        {/* Section 3: Conditions */}
        <div style={{
          padding: '20px', borderRadius: theme.radii.xl, border: `1px solid ${colors.border}`,
          backgroundColor: colors.surface, marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: colors.text, margin: 0, fontFamily: theme.fonts.body }}>
              Conditions
            </h3>
            {editingRule.conditions.length > 1 && (
              <div style={{ display: 'flex', borderRadius: theme.radii.md, border: `1px solid ${colors.inputBorder}`, overflow: 'hidden' }}>
                {['AND', 'OR'].map(logic => (
                  <button
                    key={logic}
                    onClick={() => updateField('conditionLogic', logic)}
                    style={{
                      padding: '4px 12px', border: 'none', cursor: 'pointer',
                      fontSize: '11px', fontWeight: 700, fontFamily: theme.fonts.body,
                      backgroundColor: editingRule.conditionLogic === logic ? theme.colors.purple + '15' : 'transparent',
                      color: editingRule.conditionLogic === logic ? theme.colors.purple : colors.textSecondary,
                      transition: theme.transitions.fast,
                    }}
                  >
                    {logic}
                  </button>
                ))}
              </div>
            )}
          </div>

          {editingRule.conditions.map((cond, i) => (
            <div key={cond._key} style={{ marginBottom: '10px' }}>
              {i > 0 && (
                <div style={{ textAlign: 'center', margin: '6px 0' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: theme.colors.purple, backgroundColor: theme.colors.purpleMuted, padding: '2px 10px', borderRadius: theme.radii.full }}>
                    {editingRule.conditionLogic}
                  </span>
                </div>
              )}
              <div style={{
                display: 'flex', gap: '8px', alignItems: 'center', padding: '10px 12px',
                borderRadius: theme.radii.lg, border: `1px solid ${colors.borderLight}`,
                backgroundColor: colors.surfaceHover,
              }}>
                <select
                  value={cond.field}
                  onChange={e => updateCondition(cond._key, 'field', e.target.value)}
                  style={{
                    flex: 2, padding: '7px 10px', border: `1px solid ${colors.inputBorder}`,
                    borderRadius: theme.radii.sm, fontSize: '12px', fontFamily: theme.fonts.body,
                    backgroundColor: colors.inputBackground, color: colors.text, outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {FIELD_OPTIONS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                </select>
                <select
                  value={cond.operator}
                  onChange={e => updateCondition(cond._key, 'operator', e.target.value)}
                  style={{
                    flex: 1.5, padding: '7px 10px', border: `1px solid ${colors.inputBorder}`,
                    borderRadius: theme.radii.sm, fontSize: '12px', fontFamily: theme.fonts.body,
                    backgroundColor: colors.inputBackground, color: colors.text, outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {OPERATOR_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                </select>
                {!['is_empty', 'is_not_empty'].includes(cond.operator) && (
                  <input
                    value={cond.value}
                    onChange={e => updateCondition(cond._key, 'value', e.target.value)}
                    placeholder="Value..."
                    style={{
                      flex: 2, padding: '7px 10px', border: `1px solid ${colors.inputBorder}`,
                      borderRadius: theme.radii.sm, fontSize: '12px', fontFamily: theme.fonts.body,
                      backgroundColor: colors.inputBackground, color: colors.text, outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                )}
                <button
                  onClick={() => removeCondition(cond._key)}
                  style={{
                    width: '28px', height: '28px', borderRadius: theme.radii.sm,
                    border: `1px solid ${colors.border}`, backgroundColor: colors.surface,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}
                >
                  <X size={13} color={colors.textTertiary} />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={addCondition}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px',
              padding: '7px 14px', borderRadius: theme.radii.md,
              border: `1px dashed ${colors.border}`, backgroundColor: 'transparent',
              fontSize: '12px', fontWeight: 600, color: theme.colors.blue, fontFamily: theme.fonts.body,
              cursor: 'pointer', transition: theme.transitions.fast,
            }}
          >
            <Plus size={13} /> Add Condition
          </button>
        </div>

        {/* Section 4: Results */}
        <div style={{
          padding: '20px', borderRadius: theme.radii.xl, border: `1px solid ${colors.border}`,
          backgroundColor: colors.surface, marginBottom: '24px',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: colors.text, margin: '0 0 16px', fontFamily: theme.fonts.body }}>
            Results
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Nudge */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div
                  onClick={() => updateResult('nudge', !editingRule.results.nudge)}
                  style={{
                    width: '36px', height: '20px', borderRadius: '10px',
                    backgroundColor: editingRule.results.nudge ? theme.colors.blue : colors.textTertiary,
                    position: 'relative', cursor: 'pointer', transition: theme.transitions.fast, flexShrink: 0,
                  }}
                >
                  <div style={{
                    width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fff',
                    position: 'absolute', top: '2px',
                    left: editingRule.results.nudge ? '18px' : '2px',
                    transition: theme.transitions.fast, boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                  }} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>Nudge Agent</span>
              </div>
              {editingRule.results.nudge && (
                <textarea
                  value={editingRule.results.nudgeText || ''}
                  onChange={e => updateResult('nudgeText', e.target.value)}
                  placeholder="Message shown to the agent when this rule fires..."
                  rows={2}
                  style={{
                    width: '100%', padding: '9px 14px', border: `1px solid ${colors.inputBorder}`,
                    borderRadius: theme.radii.md, fontSize: '13px', fontFamily: theme.fonts.body,
                    backgroundColor: colors.inputBackground, color: colors.text, outline: 'none',
                    resize: 'vertical', lineHeight: 1.5, boxSizing: 'border-box', marginLeft: '46px',
                    maxWidth: 'calc(100% - 46px)',
                  }}
                  onFocus={e => { e.target.style.borderColor = colors.inputBorderFocus; }}
                  onBlur={e => { e.target.style.borderColor = colors.inputBorder; }}
                />
              )}
            </div>

            {/* Escalate */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div
                  onClick={() => updateResult('escalate', !editingRule.results.escalate)}
                  style={{
                    width: '36px', height: '20px', borderRadius: '10px',
                    backgroundColor: editingRule.results.escalate ? theme.colors.error : colors.textTertiary,
                    position: 'relative', cursor: 'pointer', transition: theme.transitions.fast, flexShrink: 0,
                  }}
                >
                  <div style={{
                    width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fff',
                    position: 'absolute', top: '2px',
                    left: editingRule.results.escalate ? '18px' : '2px',
                    transition: theme.transitions.fast, boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                  }} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>Escalate to Supervisor</span>
              </div>
              {editingRule.results.escalate && (
                <input
                  value={editingRule.results.escalateMessage || ''}
                  onChange={e => updateResult('escalateMessage', e.target.value)}
                  placeholder="Optional message for supervisor..."
                  style={{
                    width: 'calc(100% - 46px)', padding: '9px 14px', border: `1px solid ${colors.inputBorder}`,
                    borderRadius: theme.radii.md, fontSize: '13px', fontFamily: theme.fonts.body,
                    backgroundColor: colors.inputBackground, color: colors.text, outline: 'none',
                    boxSizing: 'border-box', marginLeft: '46px',
                  }}
                  onFocus={e => { e.target.style.borderColor = colors.inputBorderFocus; }}
                  onBlur={e => { e.target.style.borderColor = colors.inputBorder; }}
                />
              )}
            </div>

            {/* Log for review */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                onClick={() => updateResult('logForReview', !editingRule.results.logForReview)}
                style={{
                  width: '36px', height: '20px', borderRadius: '10px',
                  backgroundColor: editingRule.results.logForReview ? theme.colors.purple : colors.textTertiary,
                  position: 'relative', cursor: 'pointer', transition: theme.transitions.fast, flexShrink: 0,
                }}
              >
                <div style={{
                  width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fff',
                  position: 'absolute', top: '2px',
                  left: editingRule.results.logForReview ? '18px' : '2px',
                  transition: theme.transitions.fast, boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                }} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>Log for QA Review</span>
            </div>
          </div>
        </div>

        {/* Save / Cancel */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '40px' }}>
          <button
            onClick={() => { setView('home'); setEditingRule(null); }}
            style={{
              padding: '9px 20px', borderRadius: theme.radii.md, fontSize: '13px', fontWeight: 600,
              border: `1px solid ${colors.border}`, backgroundColor: 'transparent', color: colors.text,
              cursor: 'pointer', fontFamily: theme.fonts.body,
            }}
          >
            Cancel
          </button>
          <button
            disabled={!canSave}
            onClick={handleSaveRule}
            style={{
              padding: '9px 20px', borderRadius: theme.radii.md, fontSize: '13px', fontWeight: 600,
              border: 'none', color: '#fff', cursor: canSave ? 'pointer' : 'default', fontFamily: theme.fonts.body,
              backgroundColor: canSave ? theme.colors.blue : colors.textTertiary,
              opacity: canSave ? 1 : 0.6,
            }}
          >
            {editingRule.isNew ? 'Create Rule' : 'Save Changes'}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
