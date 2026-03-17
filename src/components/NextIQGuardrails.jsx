import { useState, useMemo } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import {
  Shield, Plus, AlertTriangle, ChevronDown, Target,
  ToggleRight, ToggleLeft, Activity, Search, Edit,
  Globe, Lock, Sparkles, Package, X, Download,
} from 'lucide-react';
import { NEXTIQ_GUARDRAILS, NEXTIQ_GOALS } from '../data/nextiqConfig';

const GUARDRAIL_TEMPLATES = [
  {
    id: 'gtpl-identity-gate', name: 'Identity Verification Gate', category: 'Security',
    severity: 'critical', level: 'organization',
    description: 'Block NextIQ from executing account-modifying actions until customer identity is verified in the current session.',
    condition: 'When NextIQ attempts to execute an account-modifying action (email update, MFA reset, password reset, credit application) AND Verify_Identity has not been completed in the current session',
    constraint: 'Block the action in the NextIQ pipeline. Surface Verify_Identity as the required first step. Display: "Identity verification required before this action can proceed."',
    applicableGoals: [],
  },
  {
    id: 'gtpl-cross-account', name: 'Cross-Account Data Isolation', category: 'Security',
    severity: 'critical', level: 'organization',
    description: 'Prevent NextIQ from surfacing or referencing data from one customer account in a conversation with a different customer.',
    condition: 'On every KB response, NBA, and tool call — validate that all referenced account IDs match the current conversation customer',
    constraint: 'Block the response or action if cross-account data is detected. Surface a warning to the agent. Log the incident for security audit.',
    applicableGoals: [],
  },
  {
    id: 'gtpl-session-timeout', name: 'Session Timeout Lockdown', category: 'Security',
    severity: 'warning', level: 'organization',
    description: 'Restrict NextIQ capabilities after prolonged idle sessions to prevent stale-context actions.',
    condition: 'When the conversation has been idle for more than 30 minutes AND NextIQ attempts to execute an action using previously cached context',
    constraint: 'Block auto-execution. Force NextIQ to re-fetch customer context before proceeding. Surface a warning: "Session context may be stale — refreshing data."',
    applicableGoals: [],
  },
  {
    id: 'gtpl-legal-safe', name: 'Legal Keyword Safe Mode', category: 'Compliance',
    severity: 'critical', level: 'organization',
    description: 'When legal keywords are detected, restrict the NextIQ pipeline to reply-only mode and disable all ACTION NBAs.',
    condition: 'Customer message contains: "lawyer", "attorney", "legal action", "sue", "litigation", "court", "regulatory complaint", "FTC", "BBB"',
    constraint: 'Switch NextIQ to REPLY-only mode — disable all ACTION NBAs. Trigger Escalate_To_Supervisor automatically. Log all messages for legal review. Safe mode persists until supervisor clears it.',
    applicableGoals: [],
  },
  {
    id: 'gtpl-gdpr', name: 'GDPR Data Handling', category: 'Compliance',
    severity: 'warning', level: 'goal',
    description: 'For EU/UK merchants, restrict NextIQ PII surfacing and add consent language to data-related actions.',
    condition: 'Merchant account geography is "UK" or "EU" OR conversation inbox is tagged with EU/UK region',
    constraint: 'Limit NextIQ data surfacing in KB responses to non-PII fields. Add GDPR consent language to any AI-initiated action that accesses or modifies personal data. Log all data access with GDPR compliance tag.',
    applicableGoals: ['goal-chargeback', 'goal-account-security', 'goal-billing-plan', 'goal-onboarding'],
  },
  {
    id: 'gtpl-audit-trail', name: 'Audit Trail Enforcement', category: 'Compliance',
    severity: 'warning', level: 'organization',
    description: 'Ensure every AI-initiated action is logged with full context (agent, customer, action type, parameters, timestamp) for compliance review.',
    condition: 'On every ACTION NBA that is executed by NextIQ — whether in Autopilot or agent-confirmed mode',
    constraint: 'Log the action with: agent ID, customer ID, action name, all parameters, timestamp, goal context, and Autopilot status. Flag any actions that bypass the normal approval flow.',
    applicableGoals: [],
  },
  {
    id: 'gtpl-credit-limit', name: 'Credit Authorization Limit', category: 'Financial',
    severity: 'critical', level: 'goal',
    description: 'Block NextIQ from auto-executing credits above a configurable threshold. Require supervisor approval for large amounts.',
    condition: 'When NextIQ attempts Apply_Billing_Credit AND the credit amount exceeds $500',
    constraint: 'Block auto-execution in the NextIQ pipeline. Surface supervisor approval prompt to the agent with credit amount, reason, and merchant details. Log the request for audit.',
    applicableGoals: ['goal-chargeback'],
  },
  {
    id: 'gtpl-no-auto-refund', name: 'No Auto-Refunds in Autopilot', category: 'Financial',
    severity: 'critical', level: 'goal',
    description: 'Prevent NextIQ from auto-executing financial actions (credits, refunds, plan changes) in Autopilot mode.',
    condition: 'NextIQ Autopilot mode is active AND action category is financial (Apply_Billing_Credit, Process_Refund, Modify_Plan)',
    constraint: 'Always require explicit agent click. Surface as a manual NBA with "Requires Agent Approval" badge. Log blocked auto-execution attempts.',
    applicableGoals: ['goal-chargeback', 'goal-billing-plan'],
  },
  {
    id: 'gtpl-discount-ceiling', name: 'Discount Ceiling', category: 'Financial',
    severity: 'warning', level: 'goal',
    description: 'Prevent NextIQ from recommending or applying discounts above a configured maximum percentage.',
    condition: 'When NextIQ generates a discount-related NBA AND the discount percentage exceeds the configured maximum (e.g., 20%)',
    constraint: 'Suppress the discount NBA. Surface a modified NBA capped at the maximum allowed discount. Log the original recommendation for review.',
    applicableGoals: ['goal-billing-plan'],
  },
  {
    id: 'gtpl-pii-masking', name: 'PII Masking in AI Text', category: 'Data Privacy',
    severity: 'warning', level: 'organization',
    description: 'Mask personally identifiable information in all NextIQ-generated text — responses, NBAs, and summaries.',
    condition: 'On every text generated by the NextIQ pipeline — REPLY drafts, NBA descriptions, conversation summaries, KB excerpts',
    constraint: 'Regex scan for PII patterns (email, SSN, card numbers, phone). Mask to partial format. Tool-response data shown to agent is exempt — masking applies to NextIQ-generated text only.',
    applicableGoals: [],
  },
  {
    id: 'gtpl-tone-gate', name: 'AI Tone Analysis Gate', category: 'Data Privacy',
    severity: 'warning', level: 'organization',
    description: 'Run tone analysis on NextIQ-generated text before delivery. Block or rewrite responses that fall below the professional threshold.',
    condition: 'On every REPLY draft and suggested response generated by the NextIQ pipeline — before output',
    constraint: 'Run tone analysis. If below threshold: in Autopilot, auto-rewrite. In assist mode, surface a "Tone Warning" badge with a suggested revision. Log all flagged outputs.',
    applicableGoals: [],
  },
  {
    id: 'gtpl-autopilot-safety', name: 'Autopilot Safety Boundary', category: 'Operational',
    severity: 'critical', level: 'goal',
    description: 'Restrict high-risk actions from auto-executing in Autopilot mode, regardless of automation settings.',
    condition: 'NextIQ Autopilot is active AND action is flagged as high-risk (financial, account modification, data deletion, plan changes)',
    constraint: 'Block auto-execution. Surface as a manual NBA with "Requires Agent Approval" badge. Log all blocked attempts with action details and Autopilot configuration.',
    applicableGoals: ['goal-chargeback', 'goal-billing-plan'],
  },
  {
    id: 'gtpl-escalation-timeout', name: 'Escalation Timeout', category: 'Operational',
    severity: 'warning', level: 'goal',
    description: 'Force NextIQ to escalate unresolved conversations after a configurable time threshold.',
    condition: 'Active goal sub-agent has been running for more than 10 minutes AND no resolution action has been completed',
    constraint: 'Surface a priority escalation NBA. In Autopilot, trigger auto-escalation to the supervisor queue with full conversation context. Log the timeout event.',
    applicableGoals: ['goal-account-security'],
  },
];

const TEMPLATE_CATEGORIES = {
  Security: { color: '#EF4444', icon: Shield },
  Compliance: { color: '#8B5CF6', icon: Lock },
  Financial: { color: '#F59E0B', icon: AlertTriangle },
  'Data Privacy': { color: '#0062B8', icon: Globe },
  Operational: { color: '#10B981', icon: Activity },
};

export default function NextIQGuardrails({ onCreateGuardrail, onEditGuardrail, onImportTemplate, allGuardrails: allGuardrailsProp, customGuardrails = [] }) {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const [expandedRule, setExpandedRule] = useState(null);
  const [hoveredRule, setHoveredRule] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');

  const allGuardrails = allGuardrailsProp || [...NEXTIQ_GUARDRAILS, ...customGuardrails];

  const orgGuardrails = allGuardrails.filter(g => g.level === 'organization');
  const goalGuardrails = allGuardrails.filter(g => g.level === 'goal');

  const criticalCount = allGuardrails.filter(g => g.severity === 'critical').length;
  const warningCount = allGuardrails.filter(g => g.severity === 'warning').length;

  const goalName = (id) => NEXTIQ_GOALS.find(g => g.id === id)?.name || id;

  const filteredTemplates = GUARDRAIL_TEMPLATES.filter(t =>
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

  const handleImportTemplate = (tpl) => {
    setShowTemplates(false);
    onImportTemplate?.({
      name: tpl.name,
      description: tpl.description,
      severity: tpl.severity,
      level: tpl.level,
      condition: tpl.condition,
      constraint: tpl.constraint,
      applicableGoals: tpl.applicableGoals,
      status: 'active',
    });
  };

  const renderRule = (rule) => {
    const isExpanded = expandedRule === rule.id;
    const isHov = hoveredRule === rule.id;
    const sevColor = rule.severity === 'critical' ? theme.colors.error : theme.colors.warning;
    const sevBg = rule.severity === 'critical' ? theme.colors.errorMuted : theme.colors.warningMuted;
    const isOrg = rule.level === 'organization';

    return (
      <div key={rule.id}
        onMouseEnter={() => setHoveredRule(rule.id)}
        onMouseLeave={() => setHoveredRule(null)}
        style={{
          borderRadius: theme.radii.lg, overflow: 'hidden',
          border: `1px solid ${isHov ? sevColor + '30' : colors.border}`,
          backgroundColor: colors.surface,
          transition: theme.transitions.fast,
        }}
      >
        <div
          onClick={() => setExpandedRule(isExpanded ? null : rule.id)}
          style={{
            padding: '16px 20px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '14px',
          }}
        >
          <div style={{
            width: '32px', height: '32px', borderRadius: theme.radii.md,
            backgroundColor: isOrg ? `${theme.colors.blue}10` : `${sevColor}10`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {isOrg ? <Globe size={16} color={theme.colors.blue} /> : <AlertTriangle size={16} color={sevColor} />}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>{rule.name}</span>
              <span title={rule.severity === 'critical'
                ? 'Hard block — action is stopped. Autopilot escalates to human.'
                : 'Soft flag — agent is warned but can override. Logged for audit.'}
              style={{
                padding: '2px 7px', borderRadius: theme.radii.full, fontSize: '10px', fontWeight: 700,
                backgroundColor: sevBg, color: sevColor, textTransform: 'uppercase',
              }}>{rule.severity}</span>
              {isOrg && (
                <span style={{
                  padding: '2px 7px', borderRadius: theme.radii.full, fontSize: '10px', fontWeight: 600,
                  backgroundColor: `${theme.colors.blue}08`, color: theme.colors.blue,
                  display: 'flex', alignItems: 'center', gap: '3px',
                }}>
                  <Globe size={9} /> Always On
                </span>
              )}
            </div>
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0 }}>{rule.description}</p>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '4px 10px', borderRadius: theme.radii.full,
            backgroundColor: rule.status === 'active' ? theme.colors.successMuted : colors.surfaceHover,
          }}>
            {rule.status === 'active' ? (
              <ToggleRight size={14} color={theme.colors.success} />
            ) : (
              <ToggleLeft size={14} color={colors.textTertiary} />
            )}
            <span style={{
              fontSize: '11px', fontWeight: 600,
              color: rule.status === 'active' ? theme.colors.success : colors.textSecondary,
              textTransform: 'capitalize',
            }}>{rule.status}</span>
          </div>

          <ChevronDown size={14} color={colors.textTertiary} style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: theme.transitions.fast,
          }} />
        </div>

        {isExpanded && (
          <div style={{
            borderTop: `1px solid ${colors.border}`, padding: '16px 20px',
            backgroundColor: `${sevColor}02`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
              <button
                onClick={() => onEditGuardrail?.(rule.id)}
                style={{
                  padding: '6px 14px', borderRadius: theme.radii.md,
                  border: `1px solid ${colors.border}`, backgroundColor: 'transparent',
                  color: colors.text, fontSize: '12px', fontWeight: 600,
                  cursor: 'pointer', fontFamily: theme.fonts.body,
                  display: 'flex', alignItems: 'center', gap: '6px',
                  transition: theme.transitions.fast,
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = colors.surfaceHover}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Edit size={13} /> Edit Guardrail
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '6px' }}>
                  Trigger Condition
                </div>
                <div style={{
                  padding: '10px 14px', borderRadius: theme.radii.md,
                  backgroundColor: colors.surfaceHover, border: `1px solid ${colors.borderLight}`,
                  fontSize: '12px', color: colors.text, lineHeight: 1.6,
                }}>
                  {rule.condition}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '6px' }}>
                  Constraint / Action
                </div>
                <div style={{
                  padding: '10px 14px', borderRadius: theme.radii.md,
                  backgroundColor: colors.surfaceHover, border: `1px solid ${colors.borderLight}`,
                  fontSize: '12px', color: colors.text, lineHeight: 1.6,
                }}>
                  {rule.constraint}
                </div>
              </div>
            </div>

            {isOrg ? (
              <div style={{
                padding: '10px 14px', borderRadius: theme.radii.md,
                backgroundColor: `${theme.colors.blue}04`, border: `1px solid ${theme.colors.blue}15`,
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <Globe size={14} color={theme.colors.blue} />
                <span style={{ fontSize: '12px', color: theme.colors.blue, fontWeight: 500 }}>
                  Organization-level — enforced across all goals and sub-agents
                </span>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '8px' }}>
                  Applied To Goals
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {rule.applicableGoals.map(gid => (
                    <span key={gid} style={{
                      padding: '4px 12px', borderRadius: theme.radii.full,
                      backgroundColor: `${theme.colors.blue}08`, border: `1px solid ${theme.colors.blue}20`,
                      fontSize: '12px', fontWeight: 500, color: theme.colors.blue,
                      display: 'flex', alignItems: 'center', gap: '5px',
                    }}>
                      <Target size={11} /> {goalName(gid)}
                    </span>
                  ))}
                  {rule.applicableGoals.length === 0 && (
                    <span style={{ fontSize: '12px', color: colors.textTertiary, fontStyle: 'italic' }}>
                      No goals linked — this guardrail won't activate contextually
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: colors.text, margin: 0 }}>Guardrails</h1>
          <p style={{ fontSize: '14px', color: colors.textSecondary, margin: '4px 0 0' }}>
            Governance rules that constrain NextIQ's behavior — organized by scope
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
          <button onClick={() => { setTemplateSearch(''); setShowTemplates(true); }} style={{
            padding: '8px 16px', borderRadius: theme.radii.md,
            border: `1px solid ${colors.border}`, backgroundColor: 'transparent', color: colors.text,
            fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body,
            display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
          }}>
            <Package size={15} /> Guardrail Templates
          </button>
          <button onClick={() => onCreateGuardrail?.()} style={{
            padding: '8px 18px', borderRadius: theme.radii.md, border: 'none',
            backgroundColor: theme.colors.blue, color: '#fff',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body,
            display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
          }}>
            <Plus size={15} /> New Guardrail
          </button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Total Rules', value: allGuardrails.length, icon: Shield, color: theme.colors.blue },
          { label: 'Organization', value: orgGuardrails.length, icon: Globe, color: theme.colors.purple },
          { label: 'Critical', value: criticalCount, icon: AlertTriangle, color: theme.colors.error },
          { label: 'Warning', value: warningCount, icon: Activity, color: theme.colors.warning },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} style={{
              padding: '16px', borderRadius: theme.radii.lg,
              backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: theme.radii.md,
                backgroundColor: `${card.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={16} color={card.color} />
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: colors.text }}>{card.value}</div>
                <div style={{ fontSize: '11px', color: colors.textSecondary }}>{card.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Organization Guardrails */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Globe size={16} color={theme.colors.blue} />
          <span style={{ fontSize: '15px', fontWeight: 700, color: colors.text }}>Organization Guardrails</span>
          <span style={{
            padding: '2px 8px', borderRadius: theme.radii.full, fontSize: '10px', fontWeight: 600,
            backgroundColor: `${theme.colors.blue}08`, color: theme.colors.blue,
          }}>{orgGuardrails.length}</span>
        </div>
        <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 12px', lineHeight: 1.5 }}>
          Always enforced across every goal and sub-agent. These are your universal safety net — identity checks, PII masking, compliance triggers.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {orgGuardrails.map(rule => renderRule(rule))}
        </div>
      </div>

      {/* Goal-Specific Guardrails */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Target size={16} color={theme.colors.purple} />
          <span style={{ fontSize: '15px', fontWeight: 700, color: colors.text }}>Goal-Specific Guardrails</span>
          <span style={{
            padding: '2px 8px', borderRadius: theme.radii.full, fontSize: '10px', fontWeight: 600,
            backgroundColor: `${theme.colors.purple}08`, color: theme.colors.purple,
          }}>{goalGuardrails.length}</span>
        </div>
        <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 12px', lineHeight: 1.5 }}>
          Activated only when the linked goal's sub-agent is running. Use these for domain-specific constraints like credit limits or escalation timeouts.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {goalGuardrails.map(rule => renderRule(rule))}
        </div>
      </div>

      {/* ── Guardrail Templates Modal ── */}
      {showTemplates && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(2,18,44,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{
            backgroundColor: colors.surface, borderRadius: theme.radii.xl, boxShadow: theme.shadows.modal,
            width: '100%', maxWidth: '660px', maxHeight: '80vh', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${colors.border}`, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text, margin: 0, fontFamily: theme.fonts.heading }}>Guardrail Templates</h2>
                  <p style={{ fontSize: '13px', color: colors.textSecondary, margin: '4px 0 0' }}>
                    Pre-built guardrails for common AI safety patterns. Import and customize for your organization.
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
                  style={{
                    width: '100%', padding: '9px 14px 9px 36px',
                    border: `1px solid ${colors.border}`, borderRadius: theme.radii.md,
                    fontSize: '13px', fontFamily: theme.fonts.body,
                    backgroundColor: colors.inputBackground, color: colors.text,
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {templateGroups.map(([cat, templates]) => {
                const catMeta = TEMPLATE_CATEGORIES[cat] || { color: '#6B7280', icon: Shield };
                const CatIcon = catMeta.icon;
                return (
                  <div key={cat} style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <div style={{ width: '4px', height: '14px', borderRadius: '2px', backgroundColor: catMeta.color }} />
                      <span style={{ fontSize: '12px', fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{cat}</span>
                      <span style={{ fontSize: '10px', color: colors.textTertiary, backgroundColor: colors.surfaceHover, padding: '1px 6px', borderRadius: theme.radii.full }}>
                        {templates.length}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {templates.map(tpl => {
                        const tplSevColor = tpl.severity === 'critical' ? theme.colors.error : theme.colors.warning;
                        const tplSevBg = tpl.severity === 'critical' ? theme.colors.errorMuted : theme.colors.warningMuted;
                        return (
                          <div key={tpl.id} style={{
                            padding: '12px 16px', borderRadius: theme.radii.md,
                            border: `1px solid ${colors.border}`, backgroundColor: colors.cardBackground,
                            display: 'flex', alignItems: 'center', gap: '12px',
                          }}>
                            <div style={{
                              width: '32px', height: '32px', borderRadius: theme.radii.md,
                              backgroundColor: catMeta.color + '12',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                              <CatIcon size={15} color={catMeta.color} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>{tpl.name}</span>
                                <span style={{
                                  padding: '1px 6px', borderRadius: theme.radii.full, fontSize: '9px', fontWeight: 700,
                                  backgroundColor: tplSevBg, color: tplSevColor, textTransform: 'uppercase',
                                }}>{tpl.severity}</span>
                                <span style={{
                                  padding: '1px 6px', borderRadius: theme.radii.full, fontSize: '9px', fontWeight: 600,
                                  backgroundColor: tpl.level === 'organization' ? `${theme.colors.blue}08` : `${theme.colors.purple}08`,
                                  color: tpl.level === 'organization' ? theme.colors.blue : theme.colors.purple,
                                }}>{tpl.level === 'organization' ? 'Org' : 'Goal'}</span>
                              </div>
                              <p style={{ fontSize: '11px', color: colors.textSecondary, margin: 0, lineHeight: 1.4 }}>{tpl.description}</p>
                            </div>
                            <button onClick={() => handleImportTemplate(tpl)} style={{
                              padding: '5px 14px', borderRadius: theme.radii.md, border: `1px solid ${theme.colors.blue}30`,
                              backgroundColor: theme.colors.blueMuted, color: theme.colors.blue,
                              fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body,
                              display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, whiteSpace: 'nowrap',
                            }}>
                              <Download size={12} /> Import
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
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
