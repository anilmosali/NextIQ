import { useState, useRef, useEffect } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import {
  Cpu, ChevronRight, ChevronDown, Lock, Edit, Save, RotateCcw, Settings,
  Sparkles, AlertTriangle, Activity, Zap, Inbox, ToggleRight, ToggleLeft,
  Check, X, Wrench, Users, Plus, Search,
} from 'lucide-react';
import { NEXTIQ_ENGINE, NEXTIQ_GOALS, NEXTIQ_GUARDRAILS, AUTOPILOT_CONFIG, ALL_ACTIONS, ALL_INBOXES } from '../data/nextiqConfig';

function ActionPickerDropdown({ linkedActions, onAdd, onClose, colors }) {
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const available = ALL_ACTIONS.filter(a => !linkedActions.includes(a.id));
  const filtered = available.filter(a =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce((acc, act) => {
    if (!acc[act.category]) acc[act.category] = [];
    acc[act.category].push(act);
    return acc;
  }, {});

  return (
    <div ref={ref} style={{
      position: 'absolute', top: '100%', right: 0, marginTop: '4px',
      width: '340px',
      backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
      borderRadius: theme.radii.lg, boxShadow: theme.shadows.dropdown,
      zIndex: 120, maxHeight: '320px', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        padding: '8px 12px', borderBottom: `1px solid ${colors.border}`,
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <Search size={13} color={colors.textSecondary} />
        <input
          placeholder="Search actions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoFocus
          style={{
            flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent',
            color: colors.text, fontSize: '12px', fontFamily: theme.fonts.body,
          }}
        />
      </div>
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {Object.entries(grouped).map(([cat, acts]) => (
          <div key={cat}>
            <div style={{ padding: '8px 12px 4px', fontSize: '9px', fontWeight: 700, color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              {cat}
            </div>
            {acts.map(act => (
              <button
                key={act.id}
                onClick={() => onAdd(act.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '7px 12px', border: 'none', backgroundColor: 'transparent',
                  cursor: 'pointer', textAlign: 'left', fontFamily: theme.fonts.body,
                  transition: theme.transitions.fast,
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = colors.surfaceHover}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Wrench size={12} color={theme.colors.purple} />
                <span style={{ flex: 1, fontSize: '12px', fontWeight: 500, color: colors.text }}>{act.name}</span>
                <Plus size={12} color={theme.colors.blue} />
              </button>
            ))}
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0 }}>
              {available.length === 0 ? 'All actions are already linked.' : 'No matching actions.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const TOPOLOGY_MAX = 3;

export default function NextIQEngine({ onNavigateToGoal, onNavigateToGoals, onNavigateToGuardrails }) {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  const [adminPrompt, setAdminPrompt] = useState(NEXTIQ_ENGINE.adminPrompt);
  const [editingPrompt, setEditingPrompt] = useState(false);
  const [maxNBAs, setMaxNBAs] = useState(NEXTIQ_ENGINE.maxNBAsPerTurn);
  const [fallback, setFallback] = useState(NEXTIQ_ENGINE.fallbackBehavior);
  const [hoveredGoal, setHoveredGoal] = useState(null);

  const [autopilotEnabled, setAutopilotEnabled] = useState(AUTOPILOT_CONFIG.enabled);
  const [mappings, setMappings] = useState(AUTOPILOT_CONFIG.mappings);
  const [expandedInbox, setExpandedInbox] = useState(null);
  const [actionPickerFor, setActionPickerFor] = useState(null);

  const [showInboxPicker, setShowInboxPicker] = useState(false);
  const [inboxSearch, setInboxSearch] = useState('');
  const pickerRef = useRef(null);

  const activeGoals = NEXTIQ_GOALS.filter(g => g.status === 'active');
  const pausedGoals = NEXTIQ_GOALS.filter(g => g.status === 'paused');
  const statusColor = (s) => s === 'active' ? theme.colors.success : theme.colors.warning;

  const mappedIds = mappings.map(m => m.inboxId);
  const unmappedInboxes = ALL_INBOXES.filter(ib => !mappedIds.includes(ib.id));
  const filteredUnmapped = unmappedInboxes.filter(ib =>
    !inboxSearch || ib.name.toLowerCase().includes(inboxSearch.toLowerCase())
  );

  useEffect(() => {
    const handler = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowInboxPicker(false);
        setInboxSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectStyle = {
    padding: '8px 12px', borderRadius: theme.radii.md,
    border: `1px solid ${colors.border}`, backgroundColor: colors.inputBackground,
    color: colors.text, fontSize: '13px', fontFamily: theme.fonts.body,
    cursor: 'pointer', outline: 'none',
  };

  const mapInbox = (inboxId) => {
    setMappings(prev => [...prev, { inboxId, allowedActions: [], enabled: false }]);
    setShowInboxPicker(false);
    setInboxSearch('');
    setExpandedInbox(inboxId);
  };

  const toggleInboxEnabled = (inboxId) => {
    setMappings(prev => prev.map(m =>
      m.inboxId === inboxId ? { ...m, enabled: !m.enabled } : m
    ));
  };

  const unmapInbox = (inboxId) => {
    setMappings(prev => prev.filter(m => m.inboxId !== inboxId));
    if (expandedInbox === inboxId) setExpandedInbox(null);
  };

  const addAction = (inboxId, actionId) => {
    setMappings(prev => prev.map(m =>
      m.inboxId === inboxId ? { ...m, allowedActions: [...m.allowedActions, actionId] } : m
    ));
  };

  const removeAction = (inboxId, actionId) => {
    setMappings(prev => prev.map(m =>
      m.inboxId === inboxId ? { ...m, allowedActions: m.allowedActions.filter(a => a !== actionId) } : m
    ));
  };

  const toggleActionEnabled = (inboxId, actionId) => {
    removeAction(inboxId, actionId);
  };

  const getInbox = (id) => ALL_INBOXES.find(ib => ib.id === id);
  const getAction = (id) => ALL_ACTIONS.find(a => a.id === id);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <Cpu size={22} color={theme.colors.blue} />
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: colors.text, margin: 0 }}>NextIQ Engine</h1>
          <span style={{
            padding: '3px 10px', borderRadius: theme.radii.full, fontSize: '11px', fontWeight: 600,
            backgroundColor: theme.colors.successMuted, color: theme.colors.success,
          }}>Active</span>
        </div>
        <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>
          The orchestrator that routes conversations to specialized sub-agents based on customer intent and context.
        </p>
      </div>

      {/* ── Routing Topology ── */}
      <div style={{
        padding: '24px', borderRadius: theme.radii.xl,
        backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Activity size={14} color={theme.colors.blue} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>Routing Topology</span>
        </div>

        {(() => {
          const sorted = [...NEXTIQ_GOALS].sort((a, b) => {
            if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
            return b.metrics.sessions - a.metrics.sessions;
          });
          const visibleGoals = sorted.slice(0, TOPOLOGY_MAX);
          const remaining = NEXTIQ_GOALS.length - TOPOLOGY_MAX;
          const rowCount = visibleGoals.length + (remaining > 0 ? 1 : 0);

          return (
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{
                padding: '16px 20px', borderRadius: theme.radii.lg,
                background: `linear-gradient(135deg, ${theme.colors.blue}, #004580)`,
                color: '#fff', minWidth: '160px', flexShrink: 0,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Cpu size={16} />
                  <span style={{ fontSize: '14px', fontWeight: 700 }}>NextIQ Engine</span>
                </div>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>Orchestrator</div>
                <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>
                  {activeGoals.length} active · {pausedGoals.length} paused
                </div>
              </div>

              <div style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                alignSelf: 'stretch', padding: '0 4px', minWidth: '50px',
              }}>
                {Array.from({ length: rowCount }).map((_, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '100%', height: '2px', backgroundColor: `${theme.colors.blue}30`, position: 'relative' }}>
                      <div style={{
                        position: 'absolute', right: '-4px', top: '-3px', width: 0, height: 0,
                        borderLeft: `6px solid ${theme.colors.blue}40`,
                        borderTop: '4px solid transparent', borderBottom: '4px solid transparent',
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                {visibleGoals.map(goal => (
                  <div
                    key={goal.id}
                    onClick={() => onNavigateToGoal?.(goal.id)}
                    onMouseEnter={() => setHoveredGoal(goal.id)}
                    onMouseLeave={() => setHoveredGoal(null)}
                    style={{
                      padding: '12px 16px', borderRadius: theme.radii.lg,
                      border: `1px solid ${hoveredGoal === goal.id ? theme.colors.blue + '60' : colors.border}`,
                      backgroundColor: hoveredGoal === goal.id ? `${theme.colors.blue}05` : colors.cardBackground,
                      cursor: 'pointer', transition: theme.transitions.fast,
                      display: 'flex', alignItems: 'center', gap: '12px',
                    }}
                  >
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: statusColor(goal.status), flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>{goal.name}</div>
                      <div style={{ fontSize: '11px', color: colors.textSecondary, marginTop: '2px' }}>
                        {goal.actions.length} actions · {goal.knowledge.length} KB
                        {goal.status === 'paused' && ' · paused'}
                      </div>
                    </div>
                    <ChevronRight size={14} color={colors.textTertiary} />
                  </div>
                ))}

                {remaining > 0 && (
                  <div
                    onClick={() => onNavigateToGoals?.()}
                    onMouseEnter={() => setHoveredGoal('__more')}
                    onMouseLeave={() => setHoveredGoal(null)}
                    style={{
                      padding: '10px 16px', borderRadius: theme.radii.lg,
                      border: `1px dashed ${hoveredGoal === '__more' ? theme.colors.blue + '60' : colors.border}`,
                      backgroundColor: hoveredGoal === '__more' ? `${theme.colors.blue}05` : colors.cardBackground,
                      cursor: 'pointer', transition: theme.transitions.fast,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    }}
                  >
                    <span style={{ fontSize: '12px', fontWeight: 600, color: theme.colors.blue }}>
                      +{remaining} more goal{remaining !== 1 ? 's' : ''}
                    </span>
                    <ChevronRight size={13} color={theme.colors.blue} />
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        <div
          onClick={() => onNavigateToGuardrails?.()}
          style={{
            marginTop: '16px', padding: '10px 16px', borderRadius: theme.radii.md,
            backgroundColor: `${theme.colors.warning}08`, border: `1px dashed ${theme.colors.warning}30`,
            display: 'flex', alignItems: 'center', gap: '8px',
            cursor: 'pointer', transition: theme.transitions.fast,
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = `${theme.colors.warning}14`; e.currentTarget.style.borderColor = `${theme.colors.warning}50`; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = `${theme.colors.warning}08`; e.currentTarget.style.borderColor = `${theme.colors.warning}30`; }}
        >
          <AlertTriangle size={14} color={theme.colors.warning} />
          <span style={{ fontSize: '12px', color: colors.textSecondary, flex: 1 }}>
            <strong style={{ color: colors.text }}>{NEXTIQ_GUARDRAILS.filter(g => g.status === 'active').length} Guardrails</strong> governing all sub-agents
          </span>
          <ChevronRight size={14} color={theme.colors.warning} />
        </div>
      </div>

      {/* ── System Prompt ── */}
      <div style={{
        padding: '24px', borderRadius: theme.radii.xl,
        backgroundColor: colors.surface, border: `1px solid ${colors.border}`, marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Lock size={14} color={colors.textSecondary} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>System Prompt</span>
          <span style={{
            padding: '2px 8px', borderRadius: theme.radii.full, fontSize: '10px', fontWeight: 600,
            backgroundColor: colors.surfaceHover, color: colors.textSecondary,
          }}>Managed by Nextiva</span>
        </div>
        <div style={{
          padding: '16px', borderRadius: theme.radii.md,
          backgroundColor: colors.surfaceHover, border: `1px solid ${colors.borderLight}`,
          fontSize: '12.5px', color: colors.textSecondary, lineHeight: 1.7,
          fontFamily: "'Space Grotesk', monospace", whiteSpace: 'pre-wrap',
          opacity: 0.7, maxHeight: '200px', overflowY: 'auto',
        }}>
          {NEXTIQ_ENGINE.systemPrompt}
        </div>
      </div>

      {/* ── Admin Instructions ── */}
      <div style={{
        padding: '24px', borderRadius: theme.radii.xl,
        backgroundColor: colors.surface, border: `1px solid ${colors.border}`, marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={14} color={theme.colors.blue} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>Admin Instructions</span>
          </div>
          {editingPrompt ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setEditingPrompt(false)} style={{
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
          Company-specific rules that apply across all sub-agents. These instructions are appended to the system prompt.
        </p>
        {editingPrompt ? (
          <textarea
            value={adminPrompt}
            onChange={(e) => setAdminPrompt(e.target.value)}
            style={{
              width: '100%', minHeight: '180px', padding: '16px', borderRadius: theme.radii.md,
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
          }}>{adminPrompt}</div>
        )}
      </div>

      {/* ══════════ Autopilot Configuration ══════════ */}
      <div style={{
        padding: '24px', borderRadius: theme.radii.xl,
        backgroundColor: colors.surface, border: `1px solid ${colors.border}`, marginBottom: '24px',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={14} color={theme.colors.purple} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>Autopilot</span>
          </div>
          <button
            onClick={() => setAutopilotEnabled(!autopilotEnabled)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '5px 14px', borderRadius: theme.radii.full, border: 'none',
              backgroundColor: autopilotEnabled ? theme.colors.successMuted : colors.surfaceHover,
              cursor: 'pointer', transition: theme.transitions.fast,
            }}
          >
            {autopilotEnabled
              ? <ToggleRight size={18} color={theme.colors.success} />
              : <ToggleLeft size={18} color={colors.textTertiary} />}
            <span style={{
              fontSize: '12px', fontWeight: 600,
              color: autopilotEnabled ? theme.colors.success : colors.textSecondary,
            }}>{autopilotEnabled ? 'Enabled' : 'Disabled'}</span>
          </button>
        </div>
        <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 20px' }}>
          When enabled, NextIQ can auto-execute approved actions without agent click. Map specific Inboxes and configure which actions Autopilot is allowed to run for each.
        </p>

        {!autopilotEnabled && (
          <div style={{
            padding: '10px 16px', borderRadius: theme.radii.md,
            backgroundColor: `${theme.colors.warning}08`, border: `1px solid ${theme.colors.warning}20`,
            marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <AlertTriangle size={14} color={theme.colors.warning} />
            <span style={{ fontSize: '12px', color: colors.textSecondary }}>
              Autopilot is globally disabled. You can still configure inbox mappings and actions below — they'll take effect once you enable Autopilot.
            </span>
          </div>
        )}

        {/* Mapped Inboxes — always visible for configuration */}
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
            {mappings.map(mapping => {
              const ib = getInbox(mapping.inboxId);
              if (!ib) return null;
              const isExpanded = expandedInbox === ib.id;
              const count = mapping.allowedActions.length;
              const inboxActive = mapping.enabled && autopilotEnabled;

              return (
                <div key={ib.id} style={{
                  borderRadius: theme.radii.lg,
                  border: `1px solid ${mapping.enabled ? theme.colors.purple + '25' : colors.border}`,
                  backgroundColor: mapping.enabled ? `${theme.colors.purple}02` : colors.surface,
                  transition: theme.transitions.fast,
                  opacity: !autopilotEnabled ? 0.85 : 1,
                }}>
                  {/* Row */}
                  <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '34px', height: '34px', borderRadius: theme.radii.md,
                      backgroundColor: mapping.enabled ? `${theme.colors.purple}10` : colors.surfaceHover,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Inbox size={16} color={mapping.enabled ? theme.colors.purple : colors.textTertiary} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>{ib.name}</span>
                        {!mapping.enabled && (
                          <span style={{
                            padding: '1px 7px', borderRadius: theme.radii.full, fontSize: '9px', fontWeight: 700,
                            backgroundColor: colors.surfaceHover, color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: '0.3px',
                          }}>Draft</span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: colors.textSecondary, marginTop: '1px' }}>
                        {ib.description}
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                        <span style={{ fontSize: '10px', color: colors.textTertiary }}>
                          <Users size={9} style={{ marginRight: '2px', verticalAlign: 'middle' }} />
                          {ib.members} agents
                        </span>
                        <span style={{ fontSize: '10px', color: colors.textTertiary }}>
                          {ib.channels.join(', ')}
                        </span>
                        {ib.skills?.length > 0 && (
                          <span style={{ fontSize: '10px', color: colors.textTertiary }}>
                            {ib.skills.length} skill{ib.skills.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    <span style={{
                      padding: '3px 9px', borderRadius: theme.radii.full, fontSize: '10px', fontWeight: 600,
                      backgroundColor: count > 0 ? `${theme.colors.purple}10` : theme.colors.warningMuted,
                      color: count > 0 ? theme.colors.purple : theme.colors.warning,
                    }}>
                      {count > 0 ? `${count} action${count !== 1 ? 's' : ''}` : 'No actions'}
                    </span>

                    <button
                      onClick={() => setExpandedInbox(isExpanded ? null : ib.id)}
                      style={{
                        padding: '5px 12px', borderRadius: theme.radii.md,
                        border: `1px solid ${colors.border}`, backgroundColor: 'transparent',
                        color: theme.colors.blue, fontSize: '11px', fontWeight: 600,
                        cursor: 'pointer', fontFamily: theme.fonts.body,
                        display: 'flex', alignItems: 'center', gap: '4px',
                      }}
                    >
                      <Wrench size={11} />
                      Manage Actions
                      <ChevronDown size={12} style={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: theme.transitions.fast,
                      }} />
                    </button>

                    {/* Per-inbox enable/disable toggle */}
                    <button
                      onClick={() => toggleInboxEnabled(ib.id)}
                      title={mapping.enabled ? 'Disable Autopilot for this inbox' : 'Enable Autopilot for this inbox'}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        padding: '4px 10px', borderRadius: theme.radii.full, border: 'none',
                        backgroundColor: mapping.enabled ? theme.colors.successMuted : colors.surfaceHover,
                        cursor: 'pointer', transition: theme.transitions.fast,
                      }}
                    >
                      {mapping.enabled
                        ? <ToggleRight size={16} color={theme.colors.success} />
                        : <ToggleLeft size={16} color={colors.textTertiary} />}
                      <span style={{
                        fontSize: '10px', fontWeight: 600,
                        color: mapping.enabled ? theme.colors.success : colors.textTertiary,
                      }}>{mapping.enabled ? 'Active' : 'Inactive'}</span>
                    </button>

                    <button
                      onClick={() => unmapInbox(ib.id)}
                      title="Remove from Autopilot"
                      style={{
                        padding: '6px', borderRadius: theme.radii.md,
                        border: `1px solid ${colors.border}`, backgroundColor: 'transparent',
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                      }}
                    >
                      <X size={13} color={colors.textTertiary} />
                    </button>
                  </div>

                    {/* Expanded: Linked Actions Table */}
                    {isExpanded && (
                      <div style={{
                        borderTop: `1px solid ${colors.border}`,
                        padding: '16px 18px', backgroundColor: `${theme.colors.purple}02`,
                        borderRadius: `0 0 ${theme.radii.lg} ${theme.radii.lg}`,
                        position: 'relative',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Wrench size={12} color={theme.colors.purple} />
                            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: colors.textSecondary }}>
                              Linked Actions
                            </span>
                            <span style={{ fontSize: '11px', color: colors.textTertiary }}>
                              ({count} of {ALL_ACTIONS.length})
                            </span>
                          </div>
                          <div style={{ position: 'relative' }}>
                            <button
                              onClick={() => setActionPickerFor(actionPickerFor === ib.id ? null : ib.id)}
                              style={{
                                padding: '5px 12px', borderRadius: theme.radii.md,
                                border: `1px solid ${theme.colors.purple}40`,
                                backgroundColor: `${theme.colors.purple}06`,
                                color: theme.colors.purple, fontSize: '11px', fontWeight: 600,
                                cursor: 'pointer', fontFamily: theme.fonts.body,
                                display: 'flex', alignItems: 'center', gap: '4px',
                              }}
                            >
                              <Plus size={12} /> Add Actions
                            </button>
                            {actionPickerFor === ib.id && (
                              <ActionPickerDropdown
                                linkedActions={mapping.allowedActions}
                                onAdd={(actId) => addAction(ib.id, actId)}
                                onClose={() => setActionPickerFor(null)}
                                colors={colors}
                              />
                            )}
                          </div>
                        </div>

                        {count === 0 && (
                          <div style={{
                            padding: '20px', borderRadius: theme.radii.md,
                            border: `1px dashed ${colors.border}`, backgroundColor: colors.surfaceHover,
                            textAlign: 'center',
                          }}>
                            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0 }}>
                              No actions linked yet. Click "Add Actions" to allow Autopilot to execute actions for this inbox.
                            </p>
                          </div>
                        )}

                        {count > 0 && (
                          <div style={{
                            borderRadius: theme.radii.md, overflow: 'hidden',
                            border: `1px solid ${colors.borderLight}`,
                          }}>
                            {/* Table Header */}
                            <div style={{
                              display: 'grid', gridTemplateColumns: '1fr 140px 40px',
                              padding: '6px 14px', backgroundColor: colors.surfaceHover,
                              borderBottom: `1px solid ${colors.borderLight}`,
                            }}>
                              <span style={{ fontSize: '9px', fontWeight: 700, color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Action</span>
                              <span style={{ fontSize: '9px', fontWeight: 700, color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Category</span>
                              <span />
                            </div>

                            {mapping.allowedActions.map((actId, idx) => {
                              const act = getAction(actId);
                              if (!act) return null;
                              return (
                                <div key={actId} style={{
                                  display: 'grid', gridTemplateColumns: '1fr 140px 40px',
                                  padding: '8px 14px', alignItems: 'center',
                                  borderBottom: idx < count - 1 ? `1px solid ${colors.borderLight}` : 'none',
                                  backgroundColor: colors.cardBackground,
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Wrench size={12} color={theme.colors.purple} />
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text, fontFamily: "'Space Grotesk', monospace" }}>
                                      {act.name}
                                    </span>
                                  </div>
                                  <span style={{
                                    fontSize: '10px', fontWeight: 500, color: colors.textTertiary,
                                  }}>{act.category}</span>
                                  <button
                                    onClick={() => removeAction(ib.id, actId)}
                                    title="Remove action"
                                    style={{
                                      padding: '3px', borderRadius: theme.radii.sm,
                                      border: 'none', backgroundColor: 'transparent',
                                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.colors.errorMuted}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                  >
                                    <X size={12} color={colors.textTertiary} />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <p style={{ fontSize: '10px', color: colors.textTertiary, margin: '10px 0 0' }}>
                          Only linked actions can be auto-executed by Autopilot. Unlinked actions still appear as NBAs but require manual agent click.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}

              {mappings.length === 0 && (
                <div style={{
                  padding: '28px', borderRadius: theme.radii.lg,
                  border: `1px dashed ${colors.border}`, backgroundColor: colors.surfaceHover,
                  textAlign: 'center',
                }}>
                  <Inbox size={22} color={colors.textTertiary} style={{ marginBottom: '8px' }} />
                  <p style={{ fontSize: '13px', color: colors.textSecondary, margin: 0 }}>
                    No inboxes mapped to Autopilot yet. Map an inbox to get started.
                  </p>
                </div>
              )}
            </div>

            {/* ── Map Inbox Button + Picker ── */}
            <div style={{ position: 'relative' }} ref={pickerRef}>
              <button
                onClick={() => { setShowInboxPicker(!showInboxPicker); setInboxSearch(''); }}
                style={{
                  padding: '8px 18px', borderRadius: theme.radii.md,
                  border: `1px dashed ${theme.colors.purple}40`,
                  backgroundColor: `${theme.colors.purple}04`,
                  color: theme.colors.purple, fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', fontFamily: theme.fonts.body,
                  display: 'flex', alignItems: 'center', gap: '6px',
                  width: '100%', justifyContent: 'center',
                }}
              >
                <Plus size={15} /> Map Inbox to Autopilot
              </button>

              {/* Picker Dropdown */}
              {showInboxPicker && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px',
                  backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
                  borderRadius: theme.radii.lg, boxShadow: theme.shadows.dropdown,
                  zIndex: 100, overflow: 'hidden', maxHeight: '420px', display: 'flex', flexDirection: 'column',
                }}>
                  {/* Search */}
                  <div style={{
                    padding: '10px 14px', borderBottom: `1px solid ${colors.border}`,
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}>
                    <Search size={14} color={colors.textSecondary} />
                    <input
                      placeholder="Search inboxes..."
                      value={inboxSearch}
                      onChange={e => setInboxSearch(e.target.value)}
                      autoFocus
                      style={{
                        flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent',
                        color: colors.text, fontSize: '13px', fontFamily: theme.fonts.body,
                      }}
                    />
                  </div>

                  {/* Available Inboxes */}
                  <div style={{ overflowY: 'auto', flex: 1 }}>
                    {filteredUnmapped.length > 0 && (
                      <div style={{ padding: '6px 14px 4px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                          Available Inboxes
                        </span>
                      </div>
                    )}
                    {filteredUnmapped.map(ib => (
                      <button
                        key={ib.id}
                        onClick={() => mapInbox(ib.id)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                          padding: '10px 14px', border: 'none', backgroundColor: 'transparent',
                          cursor: 'pointer', textAlign: 'left', fontFamily: theme.fonts.body,
                          transition: theme.transitions.fast,
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = colors.surfaceHover}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div style={{
                          width: '30px', height: '30px', borderRadius: theme.radii.sm,
                          backgroundColor: `${theme.colors.blue}08`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <Inbox size={14} color={theme.colors.blue} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>{ib.name}</div>
                          <div style={{ fontSize: '11px', color: colors.textSecondary }}>
                            {ib.members} agents · {ib.channels.join(', ')}
                          </div>
                        </div>
                        <Plus size={14} color={theme.colors.blue} />
                      </button>
                    ))}
                    {filteredUnmapped.length === 0 && !inboxSearch && (
                      <div style={{ padding: '16px 14px', textAlign: 'center' }}>
                        <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0 }}>
                          All inboxes are already mapped.
                        </p>
                      </div>
                    )}
                    {filteredUnmapped.length === 0 && inboxSearch && (
                      <div style={{ padding: '16px 14px', textAlign: 'center' }}>
                        <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0 }}>
                          No matching inboxes found.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Status footer */}
            {mappings.length > 0 && (
              <div style={{
                marginTop: '12px', padding: '8px 14px', borderRadius: theme.radii.md,
                backgroundColor: colors.surfaceHover, display: 'flex', alignItems: 'center', gap: '14px',
              }}>
                <span style={{ fontSize: '11px', color: colors.textSecondary }}>
                  <strong style={{ color: colors.text }}>{mappings.filter(m => m.enabled).length}</strong> of {mappings.length} inbox{mappings.length !== 1 ? 'es' : ''} active
                </span>
                <span style={{ fontSize: '11px', color: colors.textTertiary }}>|</span>
                <span style={{ fontSize: '11px', color: colors.textSecondary }}>
                  <strong style={{ color: colors.text }}>{mappings.reduce((sum, m) => sum + m.allowedActions.length, 0)}</strong> total action{mappings.reduce((sum, m) => sum + m.allowedActions.length, 0) !== 1 ? 's' : ''} configured
                </span>
                {!autopilotEnabled && (
                  <>
                    <span style={{ fontSize: '11px', color: colors.textTertiary }}>|</span>
                    <span style={{ fontSize: '11px', color: theme.colors.warning, fontWeight: 600 }}>
                      Global Autopilot off
                    </span>
                  </>
                )}
              </div>
            )}
          </>
      </div>

      {/* ── Global Settings ── */}
      <div style={{
        padding: '24px', borderRadius: theme.radii.xl,
        backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Settings size={14} color={colors.textSecondary} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>Global Settings</span>
        </div>
        <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 20px' }}>
          These settings apply when no goal-specific override is configured.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: colors.textSecondary, marginBottom: '6px' }}>Max NBAs Per Turn</label>
            <select value={maxNBAs} onChange={e => setMaxNBAs(Number(e.target.value))} style={selectStyle}>
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: colors.textSecondary, marginBottom: '6px' }}>Fallback Behavior</label>
            <select value={fallback} onChange={e => setFallback(e.target.value)} style={selectStyle}>
              <option value="kb_only">Surface KB only (no NBAs)</option>
              <option value="kb_and_nba">Surface KB + generic NBAs</option>
              <option value="silent">Silent (no suggestions)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
