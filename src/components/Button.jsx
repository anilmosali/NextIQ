import { useState } from 'react';
import theme from '../theme';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  onClick,
  disabled,
  style: customStyle,
  ...rest
}) {
  const [hovered, setHovered] = useState(false);

  const sizes = {
    sm: { padding: '6px 12px', fontSize: '13px', gap: '6px' },
    md: { padding: '10px 20px', fontSize: '14px', gap: '8px' },
    lg: { padding: '14px 28px', fontSize: '16px', gap: '10px' },
  };

  const variants = {
    primary: {
      backgroundColor: hovered ? '#0056A0' : theme.colors.blue,
      color: theme.colors.white,
      border: 'none',
      boxShadow: hovered ? '0 4px 12px rgba(0, 98, 184, 0.4)' : '0 2px 8px rgba(0, 98, 184, 0.25)',
    },
    secondary: {
      backgroundColor: hovered ? theme.colors.gray100 : theme.colors.white,
      color: theme.colors.navy,
      border: `1px solid ${theme.colors.gray200}`,
      boxShadow: 'none',
    },
    ghost: {
      backgroundColor: hovered ? theme.colors.blueMuted : 'transparent',
      color: hovered ? theme.colors.blue : theme.colors.gray500,
      border: 'none',
      boxShadow: 'none',
    },
    danger: {
      backgroundColor: hovered ? '#DC2626' : theme.colors.error,
      color: theme.colors.white,
      border: 'none',
      boxShadow: 'none',
    },
  };

  const s = sizes[size];
  const v = variants[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...s,
        ...v,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        borderRadius: theme.radii.md,
        fontFamily: theme.fonts.body,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: `all ${theme.transitions.fast}`,
        opacity: disabled ? 0.5 : 1,
        whiteSpace: 'nowrap',
        lineHeight: 1.4,
        ...customStyle,
      }}
      {...rest}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  );
}
