import { useState } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import {
  Shield, Plus, AlertTriangle, ChevronDown, Target,
  ToggleRight, ToggleLeft, Activity, Search, Edit,
} from 'lucide-react';
import { NEXTIQ_GUARDRAILS, NEXTIQ_GOALS } from '../data/nextiqConfig';

export default function NextIQGuardrails({ onCreateGuardrail, onEditGuardrail, allGuardrails: allGuardrailsProp, customGuardrails = [] }) {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const [expandedRule, setExpandedRule] = useState(null);
  const [hoveredRule, setHoveredRule] = useState(null);

  const allGuardrails = allGuardrailsProp || [...NEXTIQ_GUARDRAILS, ...customGuardrails];

  const criticalCount = allGuardrails.filter(g => g.severity === 'critical').length;
  const warningCount = allGuardrails.filter(g => g.severity === 'warning').length;

  const goalName = (id) => NEXTIQ_GOALS.find(g => g.id === id)?.name || id;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: colors.text, margin: 0 }}>Guardrails</h1>
          <p style={{ fontSize: '14px', color: colors.textSecondary, margin: '4px 0 0' }}>
            Governance rules that constrain NextIQ's behavior across all sub-agents
          </p>
        </div>
        <button onClick={() => onCreateGuardrail?.()} style={{
          padding: '8px 18px', borderRadius: theme.radii.md, border: 'none',
          backgroundColor: theme.colors.blue, color: '#fff',
          fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body,
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <Plus size={15} /> Create Guardrail
        </button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'Total Rules', value: allGuardrails.length, icon: Shield, color: theme.colors.blue },
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

      {/* Rules List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {allGuardrails.map(rule => {
          const isExpanded = expandedRule === rule.id;
          const isHov = hoveredRule === rule.id;
          const sevColor = rule.severity === 'critical' ? theme.colors.error : theme.colors.warning;
          const sevBg = rule.severity === 'critical' ? theme.colors.errorMuted : theme.colors.warningMuted;

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
              {/* Row Header */}
              <div
                onClick={() => setExpandedRule(isExpanded ? null : rule.id)}
                style={{
                  padding: '16px 20px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '14px',
                }}
              >
                {/* Severity Badge */}
                <div style={{
                  width: '32px', height: '32px', borderRadius: theme.radii.md,
                  backgroundColor: `${sevColor}10`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <AlertTriangle size={16} color={sevColor} />
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
                  </div>
                  <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0 }}>{rule.description}</p>
                </div>

                {/* Status Toggle */}
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

              {/* Expanded Detail */}
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

                  {/* Applicable Goals */}
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
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
