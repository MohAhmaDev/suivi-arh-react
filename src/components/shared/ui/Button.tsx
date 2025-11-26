import { forwardRef } from 'react';
import MuiButton, { type ButtonProps as MuiButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/system';

export interface ButtonProps extends MuiButtonProps {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading = false, children, disabled, startIcon, sx, ...props }, ref) => {
    const baseStyle: SxProps<Theme> = { gap: 1 };
    const computedSx: SxProps<Theme> = Array.isArray(sx)
      ? [baseStyle, ...sx]
      : sx
        ? [baseStyle, sx]
        : baseStyle;

    return (
      <MuiButton
        ref={ref}
        disableElevation
        {...props}
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : startIcon}
        disabled={disabled || loading}
        sx={computedSx}
      >
        {children}
      </MuiButton>
    );
  },
);

Button.displayName = 'Button';
