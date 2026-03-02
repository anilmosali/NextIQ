import theme from '../theme';

export default function Avatar({ name, size = 40, gradient, status }) {
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

  const defaultGradient = `linear-gradient(135deg, ${theme.colors.blue} 0%, ${theme.colors.avatarIndigo} 100%)`;

  const statusColors = {
    online: theme.colors.success,
    away: theme.colors.warning,
    busy: theme.colors.error,
    offline: theme.colors.gray400,
  };

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: gradient || defaultGradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.36,
          fontWeight: 600,
          color: '#fff',
          fontFamily: theme.fonts.body,
          letterSpacing: '0.5px',
        }}
      >
        {initials}
      </div>
      {status && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: size * 0.28,
            height: size * 0.28,
            borderRadius: '50%',
            backgroundColor: statusColors[status] || theme.colors.gray400,
            border: `2px solid ${theme.colors.white}`,
          }}
        />
      )}
    </div>
  );
}
