import { useState, useMemo } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import {
  ChevronLeft, Target, Activity, ThumbsUp, Star,
  Edit, Save, RotateCcw, Lock, Sparkles, FileText, Wrench,
  AlertTriangle, Zap, Shield,
} from 'lucide-react';
import { NEXTIQ_GOALS, NEXTIQ_ENGINE, NEXTIQ_GUARDRAILS } from '../data/nextiqConfig';

export default function NextIQGoalDetail({ goalId, onBack }) {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const [activeTab, setActiveTab] = useState('overview');
  const [editingPrompt, setEditingPrompt] = useState(false);

  const goal = useMemo(() => NEXTIQ_GOALS.find(g => g.id === goalId), [goalId]);
  const [goalPrompt, setGoalPrompt] = useState(goal?.prompt || '');

  if (!goal) return null;

  const statusColor = goal.status === 'active' ? theme.colors.success : theme.colors.warning;
  const statusBg = goal.status === 'active' ? theme.colors.successMuted : theme.colors.warningMuted;

  const linkedGuardrails = NEXTIQ_GUARDRAILS.filter(g => g.applicableGoals.includes(goalId));

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'prompt', label: 'Prompt' },
    { id: 'scope', label: 'Scope' },
    { id: 'activity', label: 'Activity' },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <button
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '6px 0', border: 'none', backgroundColor: 'transparent',
          color: theme.colors.blue, fontSize: '13px', fontWeight: 600, fontFamily: theme.fonts.body,
          cursor: 'pointer', marginBottom: '16px',
        }}
      >
        <ChevronLeft size={16} /> Back to Goals
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <Target size={20} color={theme.colors.blue} />
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: colors.text, margin: 0 }}>{goal.name}</h1>
            <span style={{
              padding: '3px 10px', borderRadius: theme.radii.full, fontSize: '11px', fontWeight: 600,
              backgroundColor: statusBg, color: statusColor, textTransform: 'capitalize',
            }}>{goal.status}</span>
          </div>
          <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>{goal.description}</p>
        </div>
        <button style={{
          padding: '8px 16px', borderRadius: theme.radii.md,
          border: `1px solid ${colors.border}`, backgroundColor: 'transparent',
          color: colors.text, fontSize: '13px', fontWeight: 600, fontFamily: theme.fonts.body,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          <Edit size={14} /> Edit Goal
        </button>
      </div>

      {/* Tab Bar */}
      <div style={{
        display: 'flex', gap: '0', borderBottom: `1px solid ${colors.border}`, marginBottom: '24px',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px', border: 'none',
              borderBottom: activeTab === tab.id ? `2px solid ${theme.colors.blue}` : '2px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === tab.id ? theme.colors.blue : colors.textSecondary,
              fontSize: '13px', fontWeight: 600, fontFamily: theme.fonts.body,
              cursor: 'pointer', transition: theme.transitions.fast,
            }}
          >{tab.label}</button>
        ))}
      </div>

      {/* ── Overview Tab ── */}
      {activeTab === 'overview' && (
        <div>
          {/* Metrics */}
          {goal.metrics.sessions > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
              {[
                { label: 'Sessions (24h)', value: goal.metrics.sessions, icon: Activity, color: theme.colors.blue },
                { label: 'NBA Acceptance', value: `${goal.metrics.nbaAcceptance}%`, icon: ThumbsUp, color: theme.colors.success },
                { label: 'Agent Rating', value: `${goal.metrics.agentRating} / 5`, icon: Star, color: theme.colors.warning },
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
                      <div style={{ fontSize: '18px', fontWeight: 700, color: colors.text }}>{card.value}</div>
                      <div style={{ fontSize: '11px', color: colors.textSecondary }}>{card.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Activation Patterns */}
          <div style={{
            padding: '20px', borderRadius: theme.radii.xl,
            backgroundColor: colors.surface, border: `1px solid ${colors.border}`, marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Zap size={14} color={theme.colors.blue} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>Activation Patterns</span>
            </div>
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 12px' }}>
              The engine routes conversations to this goal when customer messages contain these patterns.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {goal.activationPatterns.map((p, i) => (
                <span key={i} style={{
                  padding: '5px 12px', borderRadius: theme.radii.full,
                  backgroundColor: `${theme.colors.blue}08`, border: `1px solid ${theme.colors.blue}20`,
                  fontSize: '12px', fontWeight: 500, color: theme.colors.blue,
                  fontFamily: "'Space Grotesk', monospace",
                }}>"{p}"</span>
              ))}
            </div>
          </div>

          {/* Quick Scope Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <div style={{
              padding: '18px', borderRadius: theme.radii.lg,
              backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <FileText size={14} color={theme.colors.blue} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text }}>Knowledge</span>
              </div>
              {goal.knowledge.map((kb, i) => (
                <div key={i} style={{
                  fontSize: '12px', color: colors.textSecondary, padding: '4px 0',
                  borderTop: i > 0 ? `1px solid ${colors.borderLight}` : 'none',
                }}>{kb.name}</div>
              ))}
            </div>
            <div style={{
              padding: '18px', borderRadius: theme.radii.lg,
              backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Wrench size={14} color={theme.colors.purple} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text }}>Actions</span>
              </div>
              {goal.actions.map((act, i) => (
                <div key={i} style={{
                  fontSize: '12px', color: colors.textSecondary, padding: '4px 0',
                  borderTop: i > 0 ? `1px solid ${colors.borderLight}` : 'none',
                }}>{act.name}</div>
              ))}
            </div>
            <div style={{
              padding: '18px', borderRadius: theme.radii.lg,
              backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Shield size={14} color={theme.colors.warning} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text }}>Guardrails</span>
              </div>
              {linkedGuardrails.map((gr, i) => (
                <div key={i} style={{
                  fontSize: '12px', color: colors.textSecondary, padding: '4px 0',
                  borderTop: i > 0 ? `1px solid ${colors.borderLight}` : 'none',
                }}>
                  <span style={{ color: gr.severity === 'critical' ? theme.colors.error : theme.colors.warning, fontWeight: 600, marginRight: '4px' }}>
                    {gr.id}
                  </span>
                  {gr.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Prompt Tab ── */}
      {activeTab === 'prompt' && (
        <div>
          {/* Inherited Engine Prompt */}
          <div style={{
            padding: '20px', borderRadius: theme.radii.xl,
            backgroundColor: colors.surface, border: `1px solid ${colors.border}`, marginBottom: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Lock size={14} color={colors.textSecondary} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>Inherited from Engine</span>
              <span style={{
                padding: '2px 8px', borderRadius: theme.radii.full, fontSize: '10px', fontWeight: 600,
                backgroundColor: colors.surfaceHover, color: colors.textSecondary,
              }}>Read-only</span>
            </div>
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 10px' }}>
              The system prompt and admin instructions from the NextIQ Engine are always included. This goal's prompt is appended after.
            </p>
            <div style={{
              padding: '14px', borderRadius: theme.radii.md,
              backgroundColor: colors.surfaceHover, border: `1px solid ${colors.borderLight}`,
              fontSize: '12px', color: colors.textSecondary, lineHeight: 1.6,
              fontFamily: "'Space Grotesk', monospace", whiteSpace: 'pre-wrap',
              opacity: 0.6, maxHeight: '150px', overflowY: 'auto',
            }}>
              {NEXTIQ_ENGINE.adminPrompt}
            </div>
          </div>

          {/* Goal-Specific Prompt */}
          <div style={{
            padding: '20px', borderRadius: theme.radii.xl,
            backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={14} color={theme.colors.blue} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>Goal-Specific Prompt</span>
              </div>
              {editingPrompt ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => { setGoalPrompt(goal.prompt); setEditingPrompt(false); }} style={{
                    padding: '6px 14px', borderRadius: theme.radii.md, border: `1px solid ${colors.border}`,
                    backgroundColor: 'transparent', color: colors.textSecondary,
                    fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body,
                    display: 'flex', alignItems: 'center', gap: '5px',
                  }}><RotateCcw size={12} /> Cancel</button>
                  <button onClick={() => setEditingPrompt(false)} style={{
                    padding: '6px 14px', borderRadius: theme.radii.md, border: 'none',
                    backgroundColor: theme.colors.blue, color: '#fff',
                    fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body,
                    display: 'flex', alignItems: 'center', gap: '5px',
                  }}><Save size={12} /> Save</button>
                </div>
              ) : (
                <button onClick={() => setEditingPrompt(true)} style={{
                  padding: '6px 14px', borderRadius: theme.radii.md, border: `1px solid ${colors.border}`,
                  backgroundColor: 'transparent', color: colors.text,
                  fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body,
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}><Edit size={12} /> Edit</button>
              )}
            </div>
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 12px' }}>
              Instructions specific to this goal. Appended to the system prompt when this sub-agent is activated.
            </p>
            {editingPrompt ? (
              <textarea
                value={goalPrompt}
                onChange={e => setGoalPrompt(e.target.value)}
                style={{
                  width: '100%', minHeight: '260px', padding: '16px', borderRadius: theme.radii.md,
                  border: `2px solid ${theme.colors.blue}40`, backgroundColor: colors.inputBackground,
                  color: colors.text, fontSize: '13px', fontFamily: "'Space Grotesk', monospace",
                  lineHeight: 1.7, resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                }}
              />
            ) : (
              <div style={{
                padding: '16px', borderRadius: theme.radii.md,
                backgroundColor: colors.surfaceHover, border: `1px solid ${colors.borderLight}`,
                fontSize: '13px', color: colors.text, lineHeight: 1.7,
                fontFamily: "'Space Grotesk', monospace", whiteSpace: 'pre-wrap',
              }}>
                {goalPrompt}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Scope Tab ── */}
      {activeTab === 'scope' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Knowledge Sources */}
          <div style={{
            padding: '20px', borderRadius: theme.radii.xl,
            backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={14} color={theme.colors.blue} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>Knowledge Sources</span>
              </div>
              <button style={{
                padding: '5px 12px', borderRadius: theme.radii.md, border: `1px solid ${colors.border}`,
                backgroundColor: 'transparent', color: theme.colors.blue,
                fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body,
              }}>+ Map Knowledge</button>
            </div>
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 12px' }}>
              KB articles assigned to this goal. NextIQ retrieves from these sources when this sub-agent is active.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {goal.knowledge.map(kb => (
                <div key={kb.id} style={{
                  padding: '12px 16px', borderRadius: theme.radii.md,
                  border: `1px solid ${colors.border}`, backgroundColor: colors.cardBackground,
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <FileText size={16} color={theme.colors.blue} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>{kb.name}</div>
                    <div style={{ fontSize: '11px', color: colors.textSecondary }}>{kb.category}</div>
                  </div>
                  <span style={{
                    padding: '2px 8px', borderRadius: theme.radii.full, fontSize: '10px', fontWeight: 600,
                    backgroundColor: theme.colors.successMuted, color: theme.colors.success,
                  }}>Indexed</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mapped Actions */}
          <div style={{
            padding: '20px', borderRadius: theme.radii.xl,
            backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wrench size={14} color={theme.colors.purple} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>Mapped Actions</span>
              </div>
              <button style={{
                padding: '5px 12px', borderRadius: theme.radii.md, border: `1px solid ${colors.border}`,
                backgroundColor: 'transparent', color: theme.colors.blue,
                fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body,
              }}>+ Map Action</button>
            </div>
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 12px' }}>
              Tools/APIs available to this goal. These appear as ACTION NBAs when relevant.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {goal.actions.map(act => (
                <div key={act.id} style={{
                  padding: '12px 16px', borderRadius: theme.radii.md,
                  border: `1px solid ${colors.border}`, backgroundColor: colors.cardBackground,
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <Wrench size={16} color={theme.colors.purple} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>{act.name}</div>
                    <div style={{ fontSize: '11px', color: colors.textSecondary }}>{act.category}</div>
                  </div>
                  <span style={{
                    padding: '2px 8px', borderRadius: theme.radii.full, fontSize: '10px', fontWeight: 600,
                    backgroundColor: `${theme.colors.purple}10`, color: theme.colors.purple,
                  }}>Tool</span>
                </div>
              ))}
            </div>
          </div>

          {/* Linked Guardrails */}
          <div style={{
            padding: '20px', borderRadius: theme.radii.xl,
            backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={14} color={theme.colors.warning} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>Linked Guardrails</span>
              </div>
              <button style={{
                padding: '5px 12px', borderRadius: theme.radii.md, border: `1px solid ${colors.border}`,
                backgroundColor: 'transparent', color: theme.colors.blue,
                fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body,
              }}>+ Link Guardrail</button>
            </div>
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 12px' }}>
              Governance rules enforced on this goal's outputs and actions.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {linkedGuardrails.map(gr => (
                <div key={gr.id} style={{
                  padding: '12px 16px', borderRadius: theme.radii.md,
                  border: `1px solid ${gr.severity === 'critical' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)'}`,
                  backgroundColor: gr.severity === 'critical' ? 'rgba(239,68,68,0.02)' : 'rgba(245,158,11,0.02)',
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <AlertTriangle size={16} color={gr.severity === 'critical' ? theme.colors.error : theme.colors.warning} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>{gr.name}</span>
                      <span style={{
                        padding: '1px 6px', borderRadius: theme.radii.full, fontSize: '9px', fontWeight: 700,
                        textTransform: 'uppercase',
                        backgroundColor: gr.severity === 'critical' ? theme.colors.errorMuted : theme.colors.warningMuted,
                        color: gr.severity === 'critical' ? theme.colors.error : theme.colors.warning,
                      }}>{gr.severity}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '2px' }}>{gr.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Activity Tab ── */}
      {activeTab === 'activity' && (
        <div>
          {goal.activity.length === 0 ? (
            <div style={{
              padding: '48px', textAlign: 'center', borderRadius: theme.radii.lg,
              backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
            }}>
              <Activity size={32} color={colors.textTertiary} style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>
                No activity yet — this goal hasn't been activated in any sessions.
              </p>
            </div>
          ) : (
            <div style={{
              borderRadius: theme.radii.xl, overflow: 'hidden',
              backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
            }}>
              {/* Table Header */}
              <div style={{
                display: 'grid', gridTemplateColumns: '100px 1fr 1fr 1.5fr 90px',
                padding: '10px 20px', backgroundColor: colors.surfaceHover,
                borderBottom: `1px solid ${colors.border}`,
              }}>
                {['Time', 'Agent', 'Customer', 'Actions Executed', 'NBAs'].map(h => (
                  <span key={h} style={{
                    fontSize: '10px', fontWeight: 700, color: colors.textSecondary,
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}>{h}</span>
                ))}
              </div>
              {goal.activity.map((row, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '100px 1fr 1fr 1.5fr 90px',
                  padding: '12px 20px', alignItems: 'center',
                  borderBottom: i < goal.activity.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
                }}>
                  <span style={{ fontSize: '12px', color: colors.textTertiary }}>{row.time}</span>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: colors.text }}>{row.agent}</span>
                  <span style={{ fontSize: '12px', color: colors.textSecondary }}>{row.customer}</span>
                  <span style={{ fontSize: '12px', color: colors.textSecondary, fontFamily: "'Space Grotesk', monospace" }}>{row.action}</span>
                  <span style={{ fontSize: '12px', color: theme.colors.success, fontWeight: 600 }}>
                    {row.nbasAccepted}/{row.nbasTotal}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
