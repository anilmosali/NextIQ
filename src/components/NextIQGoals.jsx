import { useState } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import {
  Target, Plus, Search, ChevronRight, Activity, Clock,
  ThumbsUp, Star, Pause, Play, MoreHorizontal,
} from 'lucide-react';
import { NEXTIQ_GOALS } from '../data/nextiqConfig';

export default function NextIQGoals({ onSelectGoal }) {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [hoveredGoal, setHoveredGoal] = useState(null);

  const filtered = NEXTIQ_GOALS.filter(g => {
    if (filter === 'active' && g.status !== 'active') return false;
    if (filter === 'paused' && g.status !== 'paused') return false;
    if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusColor = (s) => s === 'active' ? theme.colors.success : theme.colors.warning;
  const statusBg = (s) => s === 'active' ? theme.colors.successMuted : theme.colors.warningMuted;

  const totalSessions = NEXTIQ_GOALS.reduce((s, g) => s + g.metrics.sessions, 0);
  const avgAcceptance = Math.round(
    NEXTIQ_GOALS.filter(g => g.metrics.nbaAcceptance > 0)
      .reduce((s, g) => s + g.metrics.nbaAcceptance, 0) /
    (NEXTIQ_GOALS.filter(g => g.metrics.nbaAcceptance > 0).length || 1)
  );

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: colors.text, margin: 0 }}>Goals</h1>
          <p style={{ fontSize: '14px', color: colors.textSecondary, margin: '4px 0 0' }}>
            Specialized sub-agents that handle specific customer intents
          </p>
        </div>
        <button style={{
          padding: '8px 18px', borderRadius: theme.radii.md, border: 'none',
          backgroundColor: theme.colors.blue, color: '#fff',
          fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body,
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <Plus size={15} /> Create Goal
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'Total Goals', value: NEXTIQ_GOALS.length, icon: Target, color: theme.colors.blue },
          { label: 'Active', value: NEXTIQ_GOALS.filter(g => g.status === 'active').length, icon: Play, color: theme.colors.success },
          { label: 'Sessions (24h)', value: totalSessions, icon: Activity, color: theme.colors.purple },
          { label: 'NBA Acceptance', value: `${avgAcceptance}%`, icon: ThumbsUp, color: theme.colors.blue },
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

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center' }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 14px', borderRadius: theme.radii.md,
          border: `1px solid ${colors.border}`, backgroundColor: colors.inputBackground,
        }}>
          <Search size={14} color={colors.textSecondary} />
          <input
            placeholder="Search goals..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent',
              color: colors.text, fontSize: '13px', fontFamily: theme.fonts.body,
            }}
          />
        </div>
        {['all', 'active', 'paused'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '7px 14px', borderRadius: theme.radii.full,
            border: `1px solid ${filter === f ? theme.colors.blue : colors.border}`,
            backgroundColor: filter === f ? `${theme.colors.blue}10` : 'transparent',
            color: filter === f ? theme.colors.blue : colors.textSecondary,
            fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body,
            textTransform: 'capitalize',
          }}>{f}</button>
        ))}
      </div>

      {/* Goals List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(goal => {
          const isHov = hoveredGoal === goal.id;
          return (
            <div
              key={goal.id}
              onClick={() => onSelectGoal(goal.id)}
              onMouseEnter={() => setHoveredGoal(goal.id)}
              onMouseLeave={() => setHoveredGoal(null)}
              style={{
                padding: '18px 20px', borderRadius: theme.radii.lg,
                border: `1px solid ${isHov ? theme.colors.blue + '40' : colors.border}`,
                backgroundColor: isHov ? `${theme.colors.blue}03` : colors.surface,
                cursor: 'pointer', transition: theme.transitions.fast,
                display: 'flex', alignItems: 'center', gap: '16px',
              }}
            >
              {/* Status indicator */}
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                backgroundColor: statusColor(goal.status), flexShrink: 0,
              }} />

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>{goal.name}</span>
                  <span style={{
                    padding: '2px 8px', borderRadius: theme.radii.full, fontSize: '10px', fontWeight: 600,
                    backgroundColor: statusBg(goal.status), color: statusColor(goal.status),
                    textTransform: 'capitalize',
                  }}>{goal.status}</span>
                </div>
                <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0, lineHeight: 1.5 }}>
                  {goal.description}
                </p>
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                  <span style={{ fontSize: '11px', color: colors.textTertiary }}>
                    {goal.actions.length} actions
                  </span>
                  <span style={{ fontSize: '11px', color: colors.textTertiary }}>
                    {goal.knowledge.length} knowledge sources
                  </span>
                  <span style={{ fontSize: '11px', color: colors.textTertiary }}>
                    {goal.activationPatterns.length} trigger patterns
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexShrink: 0 }}>
                {goal.metrics.sessions > 0 && (
                  <>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: colors.text }}>{goal.metrics.sessions}</div>
                      <div style={{ fontSize: '10px', color: colors.textTertiary }}>Sessions</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: theme.colors.success }}>{goal.metrics.nbaAcceptance}%</div>
                      <div style={{ fontSize: '10px', color: colors.textTertiary }}>NBA Accept</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: colors.text }}>{goal.metrics.agentRating}</div>
                      <div style={{ fontSize: '10px', color: colors.textTertiary }}>Agent Rating</div>
                    </div>
                  </>
                )}
                {goal.metrics.sessions === 0 && (
                  <span style={{
                    padding: '4px 12px', borderRadius: theme.radii.full,
                    backgroundColor: colors.surfaceHover, fontSize: '11px',
                    color: colors.textSecondary, fontWeight: 500,
                  }}>No data yet</span>
                )}
              </div>

              <ChevronRight size={16} color={colors.textTertiary} />
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{
            padding: '48px', textAlign: 'center', borderRadius: theme.radii.lg,
            backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
          }}>
            <Target size={32} color={colors.textTertiary} style={{ marginBottom: '12px' }} />
            <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>No goals match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
