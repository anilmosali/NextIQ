import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import { BookOpen, Clock } from 'lucide-react';

export default function NextIQPlaybooks() {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: colors.text, margin: 0 }}>Playbooks</h1>
        <p style={{ fontSize: '14px', color: colors.textSecondary, margin: '4px 0 0' }}>
          Process-centric dynamic flows to guide agents through complex procedures
        </p>
      </div>

      <div style={{
        padding: '64px 32px', borderRadius: theme.radii.xl,
        backgroundColor: colors.surface, border: `1px dashed ${colors.border}`,
        textAlign: 'center',
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.colors.blue}12, ${theme.colors.purple}12)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <BookOpen size={28} color={theme.colors.blue} />
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text, margin: '0 0 8px' }}>
          Coming Soon
        </h2>
        <p style={{
          fontSize: '14px', color: colors.textSecondary, maxWidth: '420px',
          margin: '0 auto 24px', lineHeight: 1.6,
        }}>
          Playbooks will allow you to define step-by-step workflows that NextIQ guides agents
          through in real time — ensuring consistency across your team for complex, multi-step procedures.
        </p>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '8px 16px', borderRadius: theme.radii.full,
          backgroundColor: `${theme.colors.blue}08`, border: `1px solid ${theme.colors.blue}20`,
        }}>
          <Clock size={14} color={theme.colors.blue} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: theme.colors.blue }}>
            Planned for Phase 2
          </span>
        </div>
      </div>
    </div>
  );
}
