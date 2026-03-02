import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import { CheckCircle } from 'lucide-react';

export default function EmptyState({ title, description, illustration, variant = 'light' }) {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 40px',
        textAlign: 'center',
      }}
    >
      {illustration || (
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: theme.radii.xl,
            backgroundColor: colors.successMuted,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <CheckCircle size={28} color={theme.colors.success} />
        </div>
      )}
      {title && (
        <h3
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: '18px',
            fontWeight: 700,
            color: colors.text,
            margin: '16px 0 8px',
          }}
        >
          {title}
        </h3>
      )}
      {description && (
        <p
          style={{
            fontSize: '14px',
            color: colors.textSecondary,
            margin: 0,
            maxWidth: '320px',
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
