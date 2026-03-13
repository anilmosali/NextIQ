import { useState, useRef, useEffect } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import {
  ChevronLeft, Target, Sparkles, Zap, FileText, Wrench, Shield,
  Plus, X, Search, AlertTriangle, Save, Check,
} from 'lucide-react';
import { ALL_ACTIONS, NEXTIQ_GUARDRAILS } from '../data/nextiqConfig';

const AVAILABLE_KB = [
  { id: 'kb-billing', name: 'KB_BillingInvoicing.pdf', category: 'Billing' },
  { id: 'kb-plans', name: 'KB_PlansAndPricing.pdf', category: 'Product' },
  { id: 'kb-overage', name: 'KB_OveragePolicy.pdf', category: 'Billing' },
  { id: 'kb-credits', name: 'KB_CreditAndRefundPolicy.pdf', category: 'Finance' },
  { id: 'kb-pw', name: 'KB_PasswordReset.pdf', category: 'Account Access' },
  { id: 'kb-sec', name: 'KB_AccountSecurity.pdf', category: 'Security' },
  { id: 'kb-mfa', name: 'KB_MFARecovery.pdf', category: 'Security' },
  { id: 'kb-onboard', name: 'KB_MerchantOnboarding.pdf', category: 'Onboarding' },
  { id: 'kb-stripe', name: 'KB_StripeIntegration.pdf', category: 'Integration' },
  { id: 'kb-paypal', name: 'KB_PayPalIntegration.pdf', category: 'Integration' },
  { id: 'kb-products', name: 'KB_ProductListing.pdf', category: 'Commerce' },
  { id: 'kb-shipping', name: 'KB_ShippingProfiles.pdf', category: 'Commerce' },
  { id: 'kb-api', name: 'KB_APIDocs.pdf', category: 'Technical' },
  { id: 'kb-webhooks', name: 'KB_WebhookGuide.pdf', category: 'Technical' },
  { id: 'kb-ratelimit', name: 'KB_RateLimiting.pdf', category: 'Technical' },
  { id: 'kb-sdk', name: 'KB_SDKReference.pdf', category: 'Technical' },
  { id: 'kb-usage', name: 'KB_UsageAndOverages.pdf', category: 'Billing' },
];

function PickerDropdown({ items, selected, onAdd, onClose, colors, label, icon: Icon, iconColor }) {
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const available = items.filter(i => !selected.includes(i.id));
  const filtered = available.filter(i =>
    !search || i.name.toLowerCase().includes(search.toLowerCase()) || (i.category || '').toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce((acc, item) => {
    const cat = item.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div ref={ref} style={{
      position: 'absolute', top: '100%', right: 0, marginTop: '4px', width: '360px',
      backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
      borderRadius: theme.radii.lg, boxShadow: theme.shadows.dropdown,
      zIndex: 120, maxHeight: '340px', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        padding: '8px 12px', borderBottom: `1px solid ${colors.border}`,
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <Search size={13} color={colors.textSecondary} />
        <input placeholder={`Search ${label}...`} value={search} onChange={e => setSearch(e.target.value)} autoFocus
          style={{ flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent', color: colors.text, fontSize: '12px', fontFamily: theme.fonts.body }}
        />
      </div>
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {Object.entries(grouped).map(([cat, acts]) => (
          <div key={cat}>
            <div style={{ padding: '8px 12px 4px', fontSize: '9px', fontWeight: 700, color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{cat}</div>
            {acts.map(item => (
              <button key={item.id} onClick={() => onAdd(item)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', textAlign: 'left', fontFamily: theme.fonts.body, transition: theme.transitions.fast }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = colors.surfaceHover}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Icon size={12} color={iconColor} />
                <span style={{ flex: 1, fontSize: '12px', fontWeight: 500, color: colors.text }}>{item.name}</span>
                <Plus size={12} color={theme.colors.blue} />
              </button>
            ))}
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0 }}>
              {available.length === 0 ? `All ${label} already added.` : 'No matches.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NextIQGoalCreate({ onBack, onSave, editGoal }) {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const isEdit = !!editGoal;

  const [name, setName] = useState(editGoal?.name || '');
  const [description, setDescription] = useState(editGoal?.description || '');
  const [status, setStatus] = useState(editGoal?.status || 'active');
  const [prompt, setPrompt] = useState(editGoal?.prompt || '');
  const [patternInput, setPatternInput] = useState('');
  const [patterns, setPatterns] = useState(editGoal?.activationPatterns || []);
  const [knowledge, setKnowledge] = useState(editGoal?.knowledge || []);
  const [actions, setActions] = useState(editGoal?.actions?.map(a => ({ id: a.name || a.id, name: a.name || a.id, category: a.category })) || []);
  const [guardrails, setGuardrails] = useState(editGoal?.guardrails || []);

  const [showKBPicker, setShowKBPicker] = useState(false);
  const [showActionPicker, setShowActionPicker] = useState(false);
  const [showGuardrailPicker, setShowGuardrailPicker] = useState(false);
  const [saved, setSaved] = useState(false);

  const addPattern = () => {
    const trimmed = patternInput.trim();
    if (trimmed && !patterns.includes(trimmed)) {
      setPatterns(prev => [...prev, trimmed]);
      setPatternInput('');
    }
  };

  const handlePatternKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addPattern();
    }
  };

  const isValid = name.trim() && description.trim() && patterns.length > 0 && prompt.trim();

  const handleSave = () => {
    if (!isValid) return;
    const goalData = {
      id: isEdit ? editGoal.id : `goal-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')}`,
      name: name.trim(),
      description: description.trim(),
      status,
      activationPatterns: patterns,
      knowledge,
      actions: actions.map(a => ({ id: `act-${a.id}`, name: a.name || a.id, category: a.category })),
      guardrails,
      metrics: isEdit ? editGoal.metrics : { sessions: 0, nbaAcceptance: 0, agentRating: '-' },
      prompt: prompt.trim(),
      activity: isEdit ? editGoal.activity : [],
    };
    setSaved(true);
    setTimeout(() => onSave(goalData), 600);
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: theme.radii.md,
    border: `1px solid ${colors.border}`, backgroundColor: colors.inputBackground,
    color: colors.text, fontSize: '13px', fontFamily: theme.fonts.body,
    outline: 'none', boxSizing: 'border-box',
  };

  const sectionStyle = {
    padding: '24px', borderRadius: theme.radii.xl,
    backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
    marginBottom: '20px',
  };

  const sectionHeader = (icon, label, color) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
      {icon}
      <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>{label}</span>
      {color && <span style={{ fontSize: '11px', color: colors.textTertiary }}>Required</span>}
    </div>
  );

  if (saved) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          backgroundColor: theme.colors.successMuted, display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '16px',
        }}>
          <Check size={32} color={theme.colors.success} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: colors.text, margin: '0 0 8px' }}>{isEdit ? 'Goal Updated' : 'Goal Created'}</h2>
        <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>
          <strong>{name}</strong> has been {isEdit ? 'updated successfully' : 'added to the Goals registry'}.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <button onClick={onBack} style={{
        display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 0', border: 'none',
        backgroundColor: 'transparent', color: theme.colors.blue, fontSize: '13px', fontWeight: 600,
        fontFamily: theme.fonts.body, cursor: 'pointer', marginBottom: '16px',
      }}>
        <ChevronLeft size={16} /> {isEdit ? 'Back to Goal Detail' : 'Back to Goals'}
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
        <Target size={22} color={theme.colors.blue} />
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: colors.text, margin: 0 }}>{isEdit ? 'Edit Goal' : 'Create New Goal'}</h1>
      </div>

      {/* ── 1. Basic Info ── */}
      <div style={sectionStyle}>
        {sectionHeader(<Target size={15} color={theme.colors.blue} />, 'Basic Information', true)}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: colors.textSecondary, marginBottom: '6px' }}>Goal Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Subscription Cancellation" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: colors.textSecondary, marginBottom: '6px' }}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Describe what this goal handles — what types of customer intents does it address?"
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: colors.textSecondary, marginBottom: '6px' }}>Initial Status</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['active', 'paused'].map(s => (
                <button key={s} onClick={() => setStatus(s)} style={{
                  padding: '7px 18px', borderRadius: theme.radii.full,
                  border: `1px solid ${status === s ? (s === 'active' ? theme.colors.success : theme.colors.warning) + '40' : colors.border}`,
                  backgroundColor: status === s ? (s === 'active' ? theme.colors.successMuted : theme.colors.warningMuted) : 'transparent',
                  color: status === s ? (s === 'active' ? theme.colors.success : theme.colors.warning) : colors.textSecondary,
                  fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body, textTransform: 'capitalize',
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Activation Patterns ── */}
      <div style={sectionStyle}>
        {sectionHeader(<Zap size={15} color={theme.colors.purple} />, 'Activation Patterns', true)}
        <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 12px' }}>
          The Engine routes conversations to this goal when customer messages match these patterns. Add keywords or phrases.
        </p>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input value={patternInput} onChange={e => setPatternInput(e.target.value)} onKeyDown={handlePatternKey}
            placeholder='Type a pattern and press Enter (e.g. "cancel subscription")'
            style={{ ...inputStyle, flex: 1, width: 'auto' }}
          />
          <button onClick={addPattern} disabled={!patternInput.trim()} style={{
            padding: '8px 16px', borderRadius: theme.radii.md, border: 'none',
            backgroundColor: patternInput.trim() ? theme.colors.blue : colors.surfaceHover,
            color: patternInput.trim() ? '#fff' : colors.textTertiary,
            fontSize: '12px', fontWeight: 600, cursor: patternInput.trim() ? 'pointer' : 'default',
            fontFamily: theme.fonts.body, display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0,
          }}>
            <Plus size={13} /> Add
          </button>
        </div>
        {patterns.length > 0 ? (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {patterns.map((p, i) => (
              <span key={i} style={{
                padding: '5px 10px', borderRadius: theme.radii.full,
                backgroundColor: `${theme.colors.blue}08`, border: `1px solid ${theme.colors.blue}20`,
                fontSize: '12px', fontWeight: 500, color: theme.colors.blue,
                fontFamily: "'Space Grotesk', monospace",
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                "{p}"
                <button onClick={() => setPatterns(prev => prev.filter((_, j) => j !== i))}
                  style={{ padding: 0, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex' }}>
                  <X size={11} color={theme.colors.blue} />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div style={{ padding: '12px', borderRadius: theme.radii.md, border: `1px dashed ${colors.border}`, textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: colors.textTertiary }}>No patterns added yet</span>
          </div>
        )}
      </div>

      {/* ── 3. Goal Prompt ── */}
      <div style={sectionStyle}>
        {sectionHeader(<Sparkles size={15} color={theme.colors.blue} />, 'Goal-Specific Prompt', true)}
        <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 12px' }}>
          Instructions specific to this goal. Appended to the system prompt when this sub-agent is activated.
        </p>
        <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
          placeholder={`You are the [Goal Name] specialist for Velocity Commerce.\n\nWhen activated:\n1. ...\n2. ...\n3. ...`}
          rows={8}
          style={{ ...inputStyle, fontFamily: "'Space Grotesk', monospace", lineHeight: 1.7, resize: 'vertical' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
          <span style={{ fontSize: '11px', color: prompt.length > 1800 ? theme.colors.warning : colors.textTertiary }}>
            {prompt.length} / 2000
          </span>
        </div>
      </div>

      {/* ── 4. Knowledge Sources ── */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={15} color={theme.colors.blue} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>Knowledge Sources</span>
            <span style={{ fontSize: '11px', color: colors.textTertiary }}>Optional</span>
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowKBPicker(!showKBPicker)} style={{
              padding: '5px 14px', borderRadius: theme.radii.md, border: `1px solid ${theme.colors.blue}30`,
              backgroundColor: `${theme.colors.blue}06`, color: theme.colors.blue,
              fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body,
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              <Plus size={12} /> Map Knowledge
            </button>
            {showKBPicker && (
              <PickerDropdown
                items={AVAILABLE_KB}
                selected={knowledge.map(k => k.id)}
                onAdd={(kb) => setKnowledge(prev => [...prev, kb])}
                onClose={() => setShowKBPicker(false)}
                colors={colors} label="knowledge sources" icon={FileText} iconColor={theme.colors.blue}
              />
            )}
          </div>
        </div>
        <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 12px' }}>
          KB articles assigned to this goal. NextIQ retrieves from these sources when this sub-agent is active.
        </p>
        {knowledge.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {knowledge.map(kb => (
              <div key={kb.id} style={{
                padding: '10px 14px', borderRadius: theme.radii.md, border: `1px solid ${colors.border}`,
                backgroundColor: colors.cardBackground, display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <FileText size={14} color={theme.colors.blue} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: colors.text }}>{kb.name}</div>
                  <div style={{ fontSize: '10px', color: colors.textSecondary }}>{kb.category}</div>
                </div>
                <button onClick={() => setKnowledge(prev => prev.filter(k => k.id !== kb.id))}
                  style={{ padding: '3px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.colors.errorMuted}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <X size={12} color={colors.textTertiary} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '16px', borderRadius: theme.radii.md, border: `1px dashed ${colors.border}`, textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: colors.textTertiary }}>No knowledge sources mapped yet. Click "Map Knowledge" to add.</span>
          </div>
        )}
      </div>

      {/* ── 5. Actions ── */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wrench size={15} color={theme.colors.purple} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>Mapped Actions</span>
            <span style={{ fontSize: '11px', color: colors.textTertiary }}>Optional</span>
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowActionPicker(!showActionPicker)} style={{
              padding: '5px 14px', borderRadius: theme.radii.md, border: `1px solid ${theme.colors.purple}30`,
              backgroundColor: `${theme.colors.purple}06`, color: theme.colors.purple,
              fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body,
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              <Plus size={12} /> Map Action
            </button>
            {showActionPicker && (
              <PickerDropdown
                items={ALL_ACTIONS} selected={actions.map(a => a.id)}
                onAdd={(act) => setActions(prev => [...prev, act])}
                onClose={() => setShowActionPicker(false)}
                colors={colors} label="actions" icon={Wrench} iconColor={theme.colors.purple}
              />
            )}
          </div>
        </div>
        <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 12px' }}>
          Tools/APIs available to this goal. These appear as ACTION NBAs when relevant during conversations.
        </p>
        {actions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {actions.map(act => (
              <div key={act.id} style={{
                padding: '10px 14px', borderRadius: theme.radii.md, border: `1px solid ${colors.border}`,
                backgroundColor: colors.cardBackground, display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <Wrench size={14} color={theme.colors.purple} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: colors.text }}>{act.name}</div>
                  <div style={{ fontSize: '10px', color: colors.textSecondary }}>{act.category}{act.type ? ` · ${act.type}` : ''}</div>
                </div>
                <button onClick={() => setActions(prev => prev.filter(a => a.id !== act.id))}
                  style={{ padding: '3px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.colors.errorMuted}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <X size={12} color={colors.textTertiary} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '16px', borderRadius: theme.radii.md, border: `1px dashed ${colors.border}`, textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: colors.textTertiary }}>No actions mapped yet. Click "Map Action" to add.</span>
          </div>
        )}
      </div>

      {/* ── 6. Guardrails ── */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={15} color={theme.colors.warning} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>Linked Guardrails</span>
            <span style={{ fontSize: '11px', color: colors.textTertiary }}>Optional</span>
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowGuardrailPicker(!showGuardrailPicker)} style={{
              padding: '5px 14px', borderRadius: theme.radii.md, border: `1px solid ${theme.colors.warning}30`,
              backgroundColor: `${theme.colors.warning}06`, color: theme.colors.warning,
              fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body,
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              <Plus size={12} /> Link Guardrail
            </button>
            {showGuardrailPicker && (
              <PickerDropdown
                items={NEXTIQ_GUARDRAILS.map(g => ({ id: g.id, name: g.name, category: g.severity === 'critical' ? 'Critical' : 'Warning' }))}
                selected={guardrails}
                onAdd={(gr) => setGuardrails(prev => [...prev, gr.id])}
                onClose={() => setShowGuardrailPicker(false)}
                colors={colors} label="guardrails" icon={AlertTriangle} iconColor={theme.colors.warning}
              />
            )}
          </div>
        </div>
        <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 12px' }}>
          Governance rules enforced on this goal's outputs and actions.
        </p>
        {guardrails.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {guardrails.map(grId => {
              const gr = NEXTIQ_GUARDRAILS.find(g => g.id === grId);
              if (!gr) return null;
              const sevColor = gr.severity === 'critical' ? theme.colors.error : theme.colors.warning;
              return (
                <div key={grId} style={{
                  padding: '10px 14px', borderRadius: theme.radii.md,
                  border: `1px solid ${sevColor}15`, backgroundColor: `${sevColor}02`,
                  display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  <AlertTriangle size={14} color={sevColor} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text }}>{gr.name}</span>
                      <span style={{
                        padding: '1px 6px', borderRadius: theme.radii.full, fontSize: '9px', fontWeight: 700,
                        textTransform: 'uppercase',
                        backgroundColor: gr.severity === 'critical' ? theme.colors.errorMuted : theme.colors.warningMuted,
                        color: sevColor,
                      }}>{gr.severity}</span>
                    </div>
                    <div style={{ fontSize: '10px', color: colors.textSecondary, marginTop: '2px' }}>{gr.description}</div>
                  </div>
                  <button onClick={() => setGuardrails(prev => prev.filter(g => g !== grId))}
                    style={{ padding: '3px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.colors.errorMuted}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <X size={12} color={colors.textTertiary} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ padding: '16px', borderRadius: theme.radii.md, border: `1px dashed ${colors.border}`, textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: colors.textTertiary }}>No guardrails linked yet. Click "Link Guardrail" to add.</span>
          </div>
        )}
      </div>

      {/* ── Validation Summary ── */}
      {!isValid && (name || description || patterns.length > 0 || prompt) && (
        <div style={{
          padding: '14px 20px', borderRadius: theme.radii.lg,
          backgroundColor: `${theme.colors.warning}06`, border: `1px solid ${theme.colors.warning}20`,
          marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px',
        }}>
          <AlertTriangle size={15} color={theme.colors.warning} style={{ flexShrink: 0, marginTop: '1px' }} />
          <div style={{ fontSize: '12px', color: colors.textSecondary, lineHeight: 1.6 }}>
            <strong style={{ color: colors.text }}>Required fields missing:</strong>
            {!name.trim() && <span style={{ display: 'block' }}>• Goal name</span>}
            {!description.trim() && <span style={{ display: 'block' }}>• Description</span>}
            {patterns.length === 0 && <span style={{ display: 'block' }}>• At least one activation pattern</span>}
            {!prompt.trim() && <span style={{ display: 'block' }}>• Goal-specific prompt</span>}
          </div>
        </div>
      )}

      {/* ── Bottom Save Button ── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '40px' }}>
        <button onClick={onBack} style={{
          padding: '9px 22px', borderRadius: theme.radii.md, border: `1px solid ${colors.border}`,
          backgroundColor: 'transparent', color: colors.textSecondary,
          fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body,
        }}>
          Cancel
        </button>
        <button onClick={handleSave} disabled={!isValid} style={{
          padding: '9px 22px', borderRadius: theme.radii.md, border: 'none',
          backgroundColor: isValid ? theme.colors.blue : colors.surfaceHover,
          color: isValid ? '#fff' : colors.textTertiary,
          fontSize: '13px', fontWeight: 600, cursor: isValid ? 'pointer' : 'not-allowed',
          fontFamily: theme.fonts.body, display: 'flex', alignItems: 'center', gap: '6px',
          transition: theme.transitions.fast, opacity: isValid ? 1 : 0.7,
        }}>
          <Save size={14} /> {isEdit ? 'Save Changes' : 'Create Goal'}
        </button>
      </div>
    </div>
  );
}
