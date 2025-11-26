import { forwardRef } from 'react';
import TextField, { type TextFieldProps } from '@mui/material/TextField';

export type InputProps = TextFieldProps;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ fullWidth = true, margin = 'normal', variant = 'outlined', ...props }, ref) => (
    <TextField
      {...props}
      fullWidth={fullWidth}
      margin={margin}
      variant={variant}
      inputRef={ref}
    />
  ),
);

Input.displayName = 'Input';
