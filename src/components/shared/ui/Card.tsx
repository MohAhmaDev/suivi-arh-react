import Paper, { type PaperProps } from '@mui/material/Paper';

export type CardProps = PaperProps;

export const Card = ({ children, sx, ...props }: CardProps) => (
  <Paper
    elevation={0}
    {...props}
    sx={{
      p: 3,
      borderRadius: '12px',
      border: '1px solid',
      borderColor: 'divider',
      boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.10), 0 2px 4px -2px rgba(15, 23, 42, 0.10)',
      ...sx,
    }}
  >
    {children}
  </Paper>
);
