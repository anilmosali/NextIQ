import { useState } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';

export default function Card({ children, style, hover = true, onClick, ...rest }) {
  const [hovered, setHovered] = useState(false);
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: colors.cardBackground,
        borderRadius: theme.radii.xl,
        border: `1px solid ${colors.cardBorder}`,
        boxShadow: hover && hovered ? theme.shadows.md : colors.cardShadow,
        transition: `all ${theme.transitions.base}`,
        transform: hover && hovered && onClick ? 'translateY(-1px)' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
