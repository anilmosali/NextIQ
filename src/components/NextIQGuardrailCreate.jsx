import { useState, useRef, useEffect } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import {
  ChevronLeft, Shield, AlertTriangle, Save, Check, Plus, X,
  Target, Search,
} from 'lucide-react';
import { NEXTIQ_GOALS, NEXTIQ_GUARDRAILS } from '../data/nextiqConfig';

export default function NextIQGuardrailCreate({ onBack, onSave, allGoals: allGoalsProp, customGoals = [], editGuardrail }) {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const isEdit = !!editGuardrail;

  const [name, setName] = useState(editGuardrail?.name || '');
  const [description, setDescription] = useState(editGuardrail?.description || '');
  const [severity, setSeverity] = useState(editGuardrail?.severity || 'critical');
  const [status, setStatus] = useState(editGuardrail?.status || 'active');
  const [condition, setCondition] = useState(editGuardrail?.condition || '');
  const [constraint, setConstraint] = useState(editGuardrail?.constraint || '');
  const [selectedGoals, setSelectedGoals] = useState(editGuardrail?.applicableGoals || []);
  const [showGoalPicker, setShowGoalPicker] = useState(false);
  const [goalSearch, setGoalSearch] = useState('');
  const [saved, setSaved] = useState(false);

  const pickerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowGoalPicker(false);
        setGoalSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const allGoals = allGoalsProp || [...NEXTIQ_GOALS, ...customGoals];
  const availableGoals = allGoals.filter(g => !selectedGoals.includes(g.id));
  const filteredGoals = availableGoals.filter(g =>
    !goalSearch || g.name.toLowerCase().includes(goalSearch.toLowerCase())
  );

  const nextId = `GR-${String(NEXTIQ_GUARDRAILS.length + 1).padStart(3, '0')}`;

  const isValid = name.trim() && description.trim() && condition.trim() && constraint.trim();

  const handleSave = () => {
    if (!isValid) return;
    const guardrailData = {
      id: isEdit ? editGuardrail.id : nextId,
      name: name.trim(),
      description: description.trim(),
      severity,
      status,
      condition: condition.trim(),
      constraint: constraint.trim(),
      applicableGoals: selectedGoals,
    };
    setSaved(true);
    setTimeout(() => onSave(guardrailData), 600);
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

  const sevColor = severity === 'critical' ? theme.colors.error : theme.colors.warning;
  const sevBg = severity === 'critical' ? theme.colors.errorMuted : theme.colors.warningMuted;

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
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: colors.text, margin: '0 0 8px' }}>
          {isEdit ? 'Guardrail Updated' : 'Guardrail Created'}
        </h2>
        <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>
          <strong>{name}</strong> has been {isEdit ? 'updated successfully' : 'added to the Guardrails registry'}.
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
        <ChevronLeft size={16} /> Back to Guardrails
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
        <Shield size={22} color={theme.colors.warning} />
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: colors.text, margin: 0 }}>
          {isEdit ? 'Edit Guardrail' : 'Create New Guardrail'}
        </h1>
        <span style={{
          padding: '3px 10px', borderRadius: theme.radii.full, fontSize: '10px', fontWeight: 700,
          backgroundColor: sevBg, color: sevColor, textTransform: 'uppercase',
        }}>{severity}</span>
      </div>

      {/* ── 1. Identity ── */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Shield size={15} color={theme.colors.warning} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>Identity & Classification</span>
          <span style={{ fontSize: '11px', color: colors.textTertiary }}>Required</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: colors.textSecondary, marginBottom: '6px' }}>Guardrail Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Maximum Discount Limit" style={inputStyle} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: colors.textSecondary, marginBottom: '6px' }}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="A human-readable explanation of what this guardrail enforces and why it exists."
              rows={2} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: colors.textSecondary, marginBottom: '8px' }}>Severity</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['critical', 'warning'].map(s => {
                  const sc = s === 'critical' ? theme.colors.error : theme.colors.warning;
                  const sb = s === 'critical' ? theme.colors.errorMuted : theme.colors.warningMuted;
                  return (
                    <button key={s} onClick={() => setSeverity(s)} style={{
                      padding: '7px 18px', borderRadius: theme.radii.full,
                      border: `1px solid ${severity === s ? sc + '40' : colors.border}`,
                      backgroundColor: severity === s ? sb : 'transparent',
                      color: severity === s ? sc : colors.textSecondary,
                      fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body,
                      textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '5px',
                    }}>
                      <AlertTriangle size={12} /> {s}
                    </button>
                  );
                })}
              </div>
              <p style={{
                fontSize: '11px', color: colors.textTertiary, margin: '8px 0 0',
                lineHeight: '1.5', maxWidth: '420px',
              }}>
                {severity === 'critical'
                  ? 'Hard block — the action or response is stopped and cannot proceed. In Autopilot, the session is escalated to a human agent.'
                  : 'Soft flag — the agent is warned but can choose to override. In Autopilot, the action proceeds but the violation is logged for audit.'}
              </p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: colors.textSecondary, marginBottom: '8px' }}>Initial Status</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['active', 'inactive'].map(s => (
                  <button key={s} onClick={() => setStatus(s)} style={{
                    padding: '7px 18px', borderRadius: theme.radii.full,
                    border: `1px solid ${status === s ? (s === 'active' ? theme.colors.success : colors.textTertiary) + '40' : colors.border}`,
                    backgroundColor: status === s ? (s === 'active' ? theme.colors.successMuted : colors.surfaceHover) : 'transparent',
                    color: status === s ? (s === 'active' ? theme.colors.success : colors.textSecondary) : colors.textSecondary,
                    fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body, textTransform: 'capitalize',
                  }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Trigger Condition ── */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <AlertTriangle size={15} color={theme.colors.error} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>Trigger Condition</span>
          <span style={{ fontSize: '11px', color: colors.textTertiary }}>Required</span>
        </div>
        <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 14px' }}>
          Define WHEN this guardrail activates. Describe the condition in natural language — the AI engine evaluates it at runtime.
        </p>
        <textarea value={condition} onChange={e => setCondition(e.target.value)}
          placeholder='e.g. "When Apply_Billing_Credit action is triggered with amount > $500" or "Customer message contains: lawyer, attorney, legal action"'
          rows={3} style={{ ...inputStyle, fontFamily: "'Space Grotesk', monospace", lineHeight: 1.7, resize: 'vertical' }}
        />
      </div>

      {/* ── 3. Constraint / Enforcement ── */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Shield size={15} color={sevColor} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>Constraint / Enforcement</span>
          <span style={{ fontSize: '11px', color: colors.textTertiary }}>Required</span>
        </div>
        <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 14px' }}>
          Define WHAT happens when the trigger fires. Describe the enforcement action — block, restrict, notify, mask, etc.
        </p>
        <textarea value={constraint} onChange={e => setConstraint(e.target.value)}
          placeholder='e.g. "Block auto-execution. Surface supervisor approval prompt to agent. Log the request with amount, reason, and merchant details."'
          rows={3} style={{ ...inputStyle, fontFamily: "'Space Grotesk', monospace", lineHeight: 1.7, resize: 'vertical' }}
        />
      </div>

      {/* ── 4. Applicable Goals ── */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={15} color={theme.colors.blue} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>Applied To Goals</span>
            <span style={{ fontSize: '11px', color: colors.textTertiary }}>Optional</span>
          </div>
          <div style={{ position: 'relative' }} ref={pickerRef}>
            <button onClick={() => { setShowGoalPicker(!showGoalPicker); setGoalSearch(''); }} style={{
              padding: '5px 14px', borderRadius: theme.radii.md, border: `1px solid ${theme.colors.blue}30`,
              backgroundColor: `${theme.colors.blue}06`, color: theme.colors.blue,
              fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body,
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              <Plus size={12} /> Add Goal
            </button>

            {showGoalPicker && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: '4px', width: '340px',
                backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
                borderRadius: theme.radii.lg, boxShadow: theme.shadows.dropdown,
                zIndex: 120, maxHeight: '300px', display: 'flex', flexDirection: 'column',
              }}>
                <div style={{
                  padding: '8px 12px', borderBottom: `1px solid ${colors.border}`,
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <Search size={13} color={colors.textSecondary} />
                  <input placeholder="Search goals..." value={goalSearch} onChange={e => setGoalSearch(e.target.value)} autoFocus
                    style={{ flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent', color: colors.text, fontSize: '12px', fontFamily: theme.fonts.body }}
                  />
                </div>
                <div style={{ overflowY: 'auto', flex: 1 }}>
                  {filteredGoals.map(g => {
                    const goalStatusColor = g.status === 'active' ? theme.colors.success : theme.colors.warning;
                    return (
                      <button key={g.id} onClick={() => { setSelectedGoals(prev => [...prev, g.id]); setShowGoalPicker(false); setGoalSearch(''); }}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '9px 12px', border: 'none', backgroundColor: 'transparent',
                          cursor: 'pointer', textAlign: 'left', fontFamily: theme.fonts.body,
                          transition: theme.transitions.fast,
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = colors.surfaceHover}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: goalStatusColor, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: colors.text }}>{g.name}</div>
                          <div style={{ fontSize: '10px', color: colors.textSecondary }}>{g.status}</div>
                        </div>
                        <Plus size={12} color={theme.colors.blue} />
                      </button>
                    );
                  })}
                  {filteredGoals.length === 0 && (
                    <div style={{ padding: '16px', textAlign: 'center' }}>
                      <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0 }}>
                        {availableGoals.length === 0 ? 'All goals already added.' : 'No matches.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 14px' }}>
          Select which Goals this guardrail applies to. If none are selected, it applies globally.
        </p>

        {selectedGoals.length > 0 ? (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {selectedGoals.map(gid => {
              const g = allGoals.find(gl => gl.id === gid);
              if (!g) return null;
              return (
                <span key={gid} style={{
                  padding: '5px 10px', borderRadius: theme.radii.full,
                  backgroundColor: `${theme.colors.blue}08`, border: `1px solid ${theme.colors.blue}20`,
                  fontSize: '12px', fontWeight: 500, color: theme.colors.blue,
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <Target size={11} /> {g.name}
                  <button onClick={() => setSelectedGoals(prev => prev.filter(id => id !== gid))}
                    style={{ padding: 0, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex' }}>
                    <X size={11} color={theme.colors.blue} />
                  </button>
                </span>
              );
            })}
          </div>
        ) : (
          <div style={{ padding: '14px', borderRadius: theme.radii.md, border: `1px dashed ${colors.border}`, textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: colors.textTertiary }}>No goals selected — guardrail will apply globally to all sub-agents</span>
          </div>
        )}
      </div>

      {/* ── Live Preview ── */}
      {(name || condition || constraint) && (
        <div style={{
          padding: '20px', borderRadius: theme.radii.xl,
          backgroundColor: `${sevColor}02`, border: `1px solid ${sevColor}15`,
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <AlertTriangle size={14} color={sevColor} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Preview</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>{name || 'Untitled Guardrail'}</span>
            <span style={{
              padding: '2px 7px', borderRadius: theme.radii.full, fontSize: '10px', fontWeight: 700,
              backgroundColor: sevBg, color: sevColor, textTransform: 'uppercase',
            }}>{severity}</span>
          </div>
          <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 12px' }}>{description || 'No description'}</p>
          {condition && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: colors.textTertiary, textTransform: 'uppercase', marginBottom: '4px' }}>Trigger</div>
              <div style={{
                padding: '8px 12px', borderRadius: theme.radii.md, backgroundColor: colors.surfaceHover,
                fontSize: '12px', color: colors.text, lineHeight: 1.5, fontFamily: "'Space Grotesk', monospace",
              }}>{condition}</div>
            </div>
          )}
          {constraint && (
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: colors.textTertiary, textTransform: 'uppercase', marginBottom: '4px' }}>Enforcement</div>
              <div style={{
                padding: '8px 12px', borderRadius: theme.radii.md, backgroundColor: colors.surfaceHover,
                fontSize: '12px', color: colors.text, lineHeight: 1.5, fontFamily: "'Space Grotesk', monospace",
              }}>{constraint}</div>
            </div>
          )}
        </div>
      )}

      {/* ── Validation ── */}
      {!isValid && (name || description || condition || constraint) && (
        <div style={{
          padding: '14px 20px', borderRadius: theme.radii.lg,
          backgroundColor: `${theme.colors.warning}06`, border: `1px solid ${theme.colors.warning}20`,
          marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px',
        }}>
          <AlertTriangle size={15} color={theme.colors.warning} style={{ flexShrink: 0, marginTop: '1px' }} />
          <div style={{ fontSize: '12px', color: colors.textSecondary, lineHeight: 1.6 }}>
            <strong style={{ color: colors.text }}>Required fields missing:</strong>
            {!name.trim() && <span style={{ display: 'block' }}>• Guardrail name</span>}
            {!description.trim() && <span style={{ display: 'block' }}>• Description</span>}
            {!condition.trim() && <span style={{ display: 'block' }}>• Trigger condition</span>}
            {!constraint.trim() && <span style={{ display: 'block' }}>• Constraint / enforcement</span>}
          </div>
        </div>
      )}

      {/* ── Bottom Actions ── */}
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
          <Save size={14} /> {isEdit ? 'Save Changes' : 'Create Guardrail'}
        </button>
      </div>
    </div>
  );
}
