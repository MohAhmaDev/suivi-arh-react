import { type ReactNode } from 'react';
import Chip, { type ChipProps } from '@mui/material/Chip';
import { type SxProps, type Theme } from '@mui/material/styles';

export type BadgeTone = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface BadgeProps extends Omit<ChipProps, 'color' | 'variant' | 'label' | 'children'> {
  tone?: BadgeTone;
  label?: ReactNode;
  children?: ReactNode;
}

const toneStyles: Record<BadgeTone, { bg: string; color: string; border: string }> = {
  primary: { bg: '#E3F2FD', color: '#0D47A1', border: '#BBDEFB' },
  info: { bg: '#DBEAFE', color: '#1E3A8A', border: '#BFDBFE' },
  success: { bg: '#D1FAE5', color: '#065F46', border: '#A7F3D0' },
  warning: { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
  error: { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' },
  neutral: { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' },
};

export const Badge = ({ tone = 'primary', children, label, sx, ...props }: BadgeProps) => {
  const baseStyles = {
    height: '24px',
    borderRadius: '999px',
    fontWeight: 600,
    fontSize: '12px',
    px: 1.5,
    color: toneStyles[tone].color,
    bgcolor: toneStyles[tone].bg,
    borderColor: toneStyles[tone].border,
  } satisfies SxProps<Theme>;

  const mergedSx: SxProps<Theme> = Array.isArray(sx)
    ? [baseStyles, ...sx]
    : sx
      ? [baseStyles, sx]
      : baseStyles;

  return (
    <Chip
      {...props}
      variant="outlined"
      label={children ?? label}
      sx={mergedSx}
    />
  );
};
